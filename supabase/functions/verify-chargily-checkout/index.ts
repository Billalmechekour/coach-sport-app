import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  sendTransactionalEmail,
} from "../_shared/reset-helpers.ts";

function getChargilyBaseUrl(): string {
  return (Deno.env.get("CHARGILY_BASE_URL") || "https://pay.chargily.net/test/api/v2")
    .trim()
    .replace(/\/+$/, "");
}

// Extrait { user_id, product_ids } depuis la metadata Chargily (tolère array ou objet).
function readMeta(metadata: unknown): { user_id?: string; product_ids?: string } {
  if (!metadata) return {};
  const first = Array.isArray(metadata) ? metadata[0] : metadata;
  if (first && typeof first === "object") {
    const obj = first as Record<string, unknown>;
    return {
      user_id: typeof obj.user_id === "string" ? obj.user_id : undefined,
      product_ids: typeof obj.product_ids === "string" ? obj.product_ids : undefined,
    };
  }
  return {};
}

// Email de facture (paiement CCP / Chargily, en DZD).
function buildChargilyInvoiceEmailHtml({
  fullName,
  invoiceNumber,
  amountDzd,
}: {
  fullName?: string | null;
  invoiceNumber: string;
  amountDzd: string;
}) {
  const appName = "Hicham Fit App";
  const safeFullName = fullName ? fullName.replace(/[<>&"']/g, "") : "";
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";
  const parts: string[] = [];
  parts.push('<div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">');
  parts.push('<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">');
  parts.push('<div style="padding:32px;text-align:center;background:linear-gradient(135deg,#effcf5 0%,#ffffff 50%,#ecfeff 100%);">');
  parts.push('<div style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Facture de paiement</div>');
  parts.push(`<h1 style="margin:20px 0 8px;font-size:28px;color:#0f172a;">${appName}</h1>`);
  parts.push(`<p style="margin:0;color:#64748b;font-size:14px;">Facture N° ${invoiceNumber}</p>`);
  parts.push('</div>');
  parts.push('<div style="padding:28px 32px;">');
  parts.push(`<p style="margin:0 0 16px;font-size:15px;">${helloLine}</p>`);
  parts.push(`<p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">Merci pour votre achat sur <strong>${appName}</strong>. Votre paiement de <strong>${amountDzd} DZD</strong> via CCP / EDAHABIA a été confirmé avec succès.</p>`);
  parts.push('</div>');
  parts.push(`<div style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">Merci pour votre confiance — ${appName}</div>`);
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
    const apiKey = Deno.env.get("CHARGILY_API_SECRET");
    if (!apiKey) {
      return errorResponse(500, "CHARGILY_CONFIG_MISSING", "Clé Chargily manquante côté serveur.");
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
    const checkoutId = typeof body?.checkoutId === "string" ? body.checkoutId.trim() : "";
    if (!checkoutId) {
      return errorResponse(400, "CHECKOUT_ID_REQUIRED", "Identifiant de paiement manquant.");
    }

    const chargilyResponse = await fetch(`${getChargilyBaseUrl()}/checkouts/${encodeURIComponent(checkoutId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const checkout = await chargilyResponse.json().catch(() => ({}));
    if (!chargilyResponse.ok || !checkout?.id) {
      console.error("chargily retrieve error", chargilyResponse.status, checkout);
      return errorResponse(502, "CHARGILY_VERIFY_FAILED", "Impossible de vérifier le paiement CCP.");
    }

    const meta = readMeta(checkout.metadata);

    // Sécurité : le paiement doit appartenir à l'utilisateur connecté.
    if (meta.user_id && meta.user_id !== user.id) {
      return errorResponse(403, "CHECKOUT_FORBIDDEN", "Ce paiement ne vous appartient pas.");
    }

    // On ne débloque QUE si Chargily confirme le paiement.
    const paid = checkout.status === "paid";
    const productIds = (meta.product_ids || "")
      .split(",")
      .map((id: string) => id.trim())
      .filter(Boolean);

    const amountDzd = String(checkout.amount ?? "");
    const willSendInvoice = paid;

    if (willSendInvoice) {
      const sendInvoiceTask = (async () => {
        try {
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

          const invoiceNumber = checkout.id;
          const html = buildChargilyInvoiceEmailHtml({ fullName, invoiceNumber, amountDzd });
          const text = [
            fullName ? `Bonjour ${fullName},` : "Bonjour,",
            "",
            `Merci pour votre achat sur Hicham Fit App. Votre paiement de ${amountDzd} DZD via CCP / EDAHABIA a été confirmé.`,
            "",
            `Facture N° ${invoiceNumber}`,
            "",
            "Merci pour votre confiance — Hicham Fit App",
          ].filter(Boolean).join("\n");

          await sendTransactionalEmail({
            to: customerEmail,
            subject: `Votre facture ${invoiceNumber} — Hicham Fit App`,
            html,
            text,
          });
          console.log("[chargily-invoice] ✅ Invoice email sent to", customerEmail);
        } catch (invoiceError) {
          console.error("[chargily-invoice] ❌ Invoice email error (background):", invoiceError);
        }
      })();

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
      amountTotal: checkout.amount ?? null,
      currency: checkout.currency || "dzd",
      invoiceSent: willSendInvoice,
    });
  } catch (error) {
    console.error("verify-chargily-checkout error", error);
    return errorResponse(500, "CHARGILY_VERIFY_FAILED", "Impossible de vérifier le paiement CCP.");
  }
});
