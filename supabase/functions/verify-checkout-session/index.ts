import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  sendTransactionalEmail,
} from "../_shared/reset-helpers.ts";

// Construit le HTML de l'email de facture Stripe envoyé au client.
function buildStripeInvoiceEmailHtml({
  fullName,
  invoiceNumber,
  amountTotal,
  currency,
  hostedUrl,
  pdfUrl,
}: {
  fullName?: string | null;
  invoiceNumber: string;
  amountTotal: string;
  currency: string;
  hostedUrl?: string | null;
  pdfUrl?: string | null;
}) {
  const appName = "Hicham Fit App";
  const safeFullName = fullName ? fullName.replace(/[<>&"']/g, "") : "";
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";
  const currencyLabel = currency?.toUpperCase() === "EUR" ? "€" : currency?.toUpperCase() || "€";

  const parts: string[] = [];
  parts.push('<div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">');
  parts.push('<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">');
  parts.push('<div style="padding:32px;text-align:center;background:linear-gradient(135deg,#effcf5 0%,#ffffff 50%,#ecfeff 100%);">');
  parts.push('<div style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Facture de paiement</div>');
  parts.push(`<h1 style="margin:20px 0 8px;font-size:28px;color:#0f172a;">${appName}</h1>`);
  parts.push(`<p style="margin:0;color:#64748b;font-size:14px;">Facture N\u00b0 ${invoiceNumber}</p>`);
  parts.push('</div>');
  parts.push('<div style="padding:28px 32px;">');
  parts.push(`<p style="margin:0 0 16px;font-size:15px;">${helloLine}</p>`);
  parts.push(`<p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">Merci pour votre achat sur <strong>${appName}</strong>. Votre paiement de <strong>${amountTotal} ${currencyLabel}</strong> a \u00e9t\u00e9 confirm\u00e9 avec succ\u00e8s.</p>`);
  parts.push(`<p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">${pdfUrl ? "La facture d\u00e9taill\u00e9e est jointe \u00e0 cet email au format PDF." : "Vous trouverez ci-dessous le lien vers votre facture."}</p>`);
  if (hostedUrl) {
    parts.push(`<div style="text-align:center;margin:26px 0 4px;"><a href="${hostedUrl}" style="display:inline-block;background:#14b86f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:14px;">Voir la facture en ligne</a></div>`);
  }
  if (pdfUrl) {
    parts.push(`<div style="text-align:center;margin:14px 0 4px;"><a href="${pdfUrl}" style="display:inline-block;background:#ffffff;color:#14b86f;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 24px;border-radius:14px;border:2px solid #14b86f;">T\u00e9l\u00e9charger le PDF</a></div>`);
  }
  parts.push('</div>');
  parts.push(`<div style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">Merci pour votre confiance \u2014 ${appName}</div>`);
  parts.push('</div></div>');
  return parts.join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!secretKey) {
      return errorResponse(500, "STRIPE_CONFIG_MISSING", "Clé Stripe manquante côté serveur.");
    }

    const authorization = request.headers.get("Authorization") || "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return errorResponse(401, "SESSION_REQUIRED", "Session requise.");
    }

    const supabase = createAdminClient();
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user?.id) {
      return errorResponse(401, "SESSION_INVALID", "Session invalide.");
    }
    const user = userData.user;

    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
    if (!sessionId) {
      return errorResponse(400, "SESSION_ID_REQUIRED", "Identifiant de session manquant.");
    }

    const stripe = new Stripe(secretKey, {
      // @ts-ignore
      apiVersion: "2026-03-25.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Sécurité : la session doit appartenir à l'utilisateur connecté.
    if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
      return errorResponse(403, "SESSION_FORBIDDEN", "Cette session ne vous appartient pas.");
    }

    // On ne débloque QUE si Stripe confirme le paiement.
    const paid = session.payment_status === "paid";
    const productIds = (session.metadata?.product_ids || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // L'envoi de la facture par email se fait EN ARRIÈRE-PLAN (waitUntil) : on répond TOUT DE SUITE
    // (toast + redirection rapides côté app), l'email part juste après sans bloquer la réponse.
    const willSendInvoice = Boolean(paid && session.invoice);

    if (willSendInvoice) {
      const sendInvoiceTask = (async () => {
        try {
          const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice.id;
          const invoice = await stripe.invoices.retrieve(invoiceId);
          const invoicePdfUrl = invoice.invoice_pdf || null;
          const hostedUrl = invoice.hosted_invoice_url || null;
          const invoiceNumber = invoice.number || invoiceId;

          const customerEmail = user.email;
          if (!customerEmail) throw new Error("No customer email found");

          let fullName: string | null = null;
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", user.id)
              .maybeSingle();
            fullName = profile?.full_name ?? null;
          } catch {
            /* profil optionnel */
          }

          const amountTotal = ((session.amount_total || 0) / 100).toFixed(2);
          const currency = session.currency || "eur";

          let pdfBase64 = "";
          if (invoicePdfUrl) {
            try {
              const pdfResponse = await fetch(invoicePdfUrl);
              if (pdfResponse.ok) {
                const pdfBuffer = await pdfResponse.arrayBuffer();
                const pdfBytes = new Uint8Array(pdfBuffer);
                let binary = "";
                for (let i = 0; i < pdfBytes.length; i += 0x8000) {
                  binary += String.fromCharCode(...pdfBytes.subarray(i, i + 0x8000));
                }
                pdfBase64 = btoa(binary);
              }
            } catch (pdfError) {
              console.error("[invoice] PDF download error:", pdfError);
            }
          }

          const html = buildStripeInvoiceEmailHtml({
            fullName,
            invoiceNumber,
            amountTotal,
            currency,
            hostedUrl,
            pdfUrl: invoicePdfUrl,
          });

          const text = [
            fullName ? `Bonjour ${fullName},` : "Bonjour,",
            "",
            `Merci pour votre achat sur Hicham Fit App. Votre paiement de ${amountTotal} ${currency.toUpperCase() === "EUR" ? "€" : currency.toUpperCase()} a été confirmé.`,
            "",
            `Facture N° ${invoiceNumber}`,
            hostedUrl ? `Voir en ligne : ${hostedUrl}` : "",
            invoicePdfUrl ? `PDF : ${invoicePdfUrl}` : "",
            "",
            "Merci pour votre confiance — Hicham Fit App",
          ].filter(Boolean).join("\n");

          const subject = `Votre facture ${invoiceNumber} — Hicham Fit App`;

          await sendTransactionalEmail({
            to: customerEmail,
            subject,
            html,
            text,
            attachments: pdfBase64
              ? [{ name: `facture-${invoiceNumber}.pdf`, content: pdfBase64 }]
              : undefined,
          });
          console.log("[invoice] ✅ Invoice email sent to", customerEmail);
        } catch (invoiceError) {
          console.error("[invoice] ❌ Invoice email error (background):", invoiceError);
        }
      })();

      // Exécute la tâche APRÈS la réponse (ne bloque pas la requête).
      try {
        // @ts-ignore -- EdgeRuntime est fourni par le runtime Supabase Edge Functions
        if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
          // @ts-ignore
          EdgeRuntime.waitUntil(sendInvoiceTask);
        }
      } catch {
        /* ignore */
      }
    }

    return jsonResponse({
      success: true,
      paid,
      productIds: paid ? productIds : [],
      amountTotal: session.amount_total,
      currency: session.currency,
      invoiceSent: willSendInvoice,
    });
  } catch (error) {
    console.error("verify-checkout-session error", error);
    return errorResponse(500, "CHECKOUT_VERIFY_FAILED", "Impossible de vérifier le paiement.");
  }
});
