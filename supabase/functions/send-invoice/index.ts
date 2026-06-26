import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  sendInvoiceEmail,
} from "../_shared/reset-helpers.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
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

    const to = userData.user.email;

    if (!to) {
      return errorResponse(400, "NO_EMAIL", "Aucune adresse email associée au compte.");
    }

    const body = await request.json();
    const rawItems = Array.isArray(body?.items) ? body.items : [];
    const invoiceNumber = String(body?.invoiceNumber ?? "").trim();
    const dateStr = String(body?.dateStr ?? "").trim();
    const total = Number(body?.total) || 0;
    const pdfBase64 = String(body?.pdfBase64 ?? "").replace(/^data:[^,]*,/, "");

    const items = rawItems
      .map((item: Record<string, unknown>) => ({
        category: String(item?.category ?? ""),
        title: String(item?.title ?? ""),
        price: String(item?.price ?? ""),
      }))
      .filter((item: { title: string }) => item.title);

    if (!invoiceNumber || !items.length || !pdfBase64) {
      return errorResponse(400, "INVALID_INVOICE", "Données de facture incomplètes.");
    }

    let fullName: string | null = null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userData.user.id)
      .maybeSingle();
    fullName = profile?.full_name ?? null;

    let downloadUrl: string | null = null;
    try {
      const bucket = "invoices";
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some((entry) => entry.name === bucket)) {
        await supabase.storage.createBucket(bucket, { public: false });
      }

      const binary = atob(pdfBase64);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const path = `${userData.user.id}/${invoiceNumber}.pdf`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, bytes, {
        contentType: "application/pdf",
        upsert: true,
      });

      if (uploadError) {
        console.error("invoice upload error", uploadError);
      } else {
        const { data: signed } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60 * 24 * 90);
        downloadUrl = signed?.signedUrl ?? null;
      }
    } catch (storageError) {
      console.error("invoice storage error", storageError);
    }

    try {
      await sendInvoiceEmail({
        to,
        fullName,
        invoiceNumber,
        dateStr: dateStr || new Date().toLocaleDateString("fr-FR"),
        items,
        total,
        pdfBase64,
        downloadUrl,
      });
    } catch (mailError) {
      console.error("send-invoice email error", mailError);

      const mailErrorMessage = String(mailError instanceof Error ? mailError.message : mailError).toLowerCase();
      let publicMessage = "Impossible d'envoyer la facture par email.";

      if (mailErrorMessage.includes("missing brevo_api_key")) {
        publicMessage = "Impossible d'envoyer la facture : la clé BREVO_API_KEY manque dans Supabase.";
      } else if (mailErrorMessage.includes("401") || mailErrorMessage.includes("unauthorized") || mailErrorMessage.includes("invalid api key")) {
        publicMessage = "Impossible d'envoyer la facture : la clé API Brevo est invalide.";
      } else if (mailErrorMessage.includes("not verified") || mailErrorMessage.includes("sender")) {
        publicMessage = "Impossible d'envoyer la facture : l'adresse expéditeur n'est pas validée dans Brevo.";
      }

      return errorResponse(500, "INVOICE_EMAIL_FAILED", publicMessage);
    }

    return jsonResponse({ success: true, sentTo: to });
  } catch (error) {
    console.error("send-invoice unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
