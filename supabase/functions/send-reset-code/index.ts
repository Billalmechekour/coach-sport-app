import {
  createAdminClient,
  errorResponse,
  generateResetCode,
  isValidEmail,
  jsonResponse,
  normalizeEmail,
  sendResetCodeEmail,
  sha256Hex,
  corsHeaders,
} from "../_shared/reset-helpers.ts";

const CODE_LIFETIME_SECONDS = 180;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { email: rawEmail } = await request.json();
    const email = normalizeEmail(String(rawEmail ?? ""));
    const requestAppUrl = (request.headers.get("origin") || "").trim();

    if (!email || !isValidEmail(email)) {
      return errorResponse(400, "INVALID_EMAIL", "Adresse email invalide.");
    }

    const supabase = createAdminClient();
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: userRows, error: userLookupError } = await supabase.rpc("find_confirmed_user_by_email", {
      check_email: email,
    });

    if (userLookupError) {
      console.error("find_confirmed_user_by_email error", userLookupError);
      return errorResponse(500, "USER_LOOKUP_FAILED", "Impossible de vérifier ce compte.");
    }

    const userRecord = Array.isArray(userRows) ? userRows[0] : null;

    if (!userRecord?.user_id) {
      return errorResponse(404, "ACCOUNT_NOT_FOUND", "Aucun compte confirmé n'existe avec cette adresse email.");
    }

    const { data: latestCode, error: latestCodeError } = await supabase
      .from("password_reset_codes")
      .select("id, expires_at, consumed_at")
      .eq("email", email)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCodeError) {
      console.error("latest code error", latestCodeError);
      return errorResponse(500, "RESET_CODE_LOOKUP_FAILED", "Impossible de vérifier le code actuel.");
    }

    if (latestCode?.id) {
      const latestExpiresAt = new Date(latestCode.expires_at);
      const latestExpiresAtMs = latestExpiresAt.getTime();
      const maxAllowedExpiresAtMs = now.getTime() + CODE_LIFETIME_SECONDS * 1000;

      if (Number.isFinite(latestExpiresAtMs) && latestExpiresAtMs > now.getTime() && latestExpiresAtMs <= maxAllowedExpiresAtMs) {
        const retryAfterSeconds = Math.max(1, Math.ceil((latestExpiresAtMs - now.getTime()) / 1000));
        return errorResponse(
          429,
          "RESET_CODE_ACTIVE",
          "Un code a déjà été envoyé. Réessaie plus tard.",
          {
            retryAfterSeconds,
            expiresAt: latestExpiresAt.toISOString(),
          },
        );
      }

      // Old deployments or manual data edits may leave a code with an expiration far beyond
      // the 3-minute window. Consume it so the user never gets a huge retry timer.
      await supabase
        .from("password_reset_codes")
        .update({ consumed_at: nowIso })
        .eq("id", latestCode.id);
    }

    const code = generateResetCode(6);
    const codeHash = await sha256Hex(code);
    const expiresAt = new Date(now.getTime() + CODE_LIFETIME_SECONDS * 1000).toISOString();

    const { data: insertedCode, error: insertError } = await supabase
      .from("password_reset_codes")
      .insert({
        user_id: userRecord.user_id,
        email,
        code_hash: codeHash,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (insertError || !insertedCode?.id) {
      console.error("insert reset code error", insertError);
      return errorResponse(500, "RESET_CODE_CREATE_FAILED", "Impossible de créer le code de réinitialisation.");
    }

    try {
      await sendResetCodeEmail({
        to: email,
        code,
        fullName: userRecord.full_name,
        appUrl: requestAppUrl,
      });
    } catch (mailError) {
      console.error("send reset email error", mailError);

      await supabase
        .from("password_reset_codes")
        .delete()
        .eq("id", insertedCode.id);

      const mailErrorMessage = String(mailError instanceof Error ? mailError.message : mailError).toLowerCase();
      let publicMessage = "Impossible d'envoyer l'email de vérification.";

      if (mailErrorMessage.includes("missing brevo_api_key")) {
        publicMessage = "Impossible d'envoyer l'email : la clé BREVO_API_KEY manque dans Supabase.";
      } else if (mailErrorMessage.includes("401") || mailErrorMessage.includes("unauthorized") || mailErrorMessage.includes("invalid api key")) {
        publicMessage = "Impossible d'envoyer l'email : la clé API Brevo est invalide.";
      } else if (mailErrorMessage.includes("sender") || mailErrorMessage.includes("from") || mailErrorMessage.includes("not verified")) {
        publicMessage = "Impossible d'envoyer l'email : l'adresse expéditeur n'est pas validée dans Brevo.";
      } else if (mailErrorMessage.includes("403") || mailErrorMessage.includes("permission") || mailErrorMessage.includes("forbidden")) {
        publicMessage = "Impossible d'envoyer l'email : Brevo refuse l'envoi. Vérifie l'activation transactionnelle et l'expéditeur.";
      } else if (mailErrorMessage.includes("brevo email failed")) {
        publicMessage = "Impossible d'envoyer l'email : Brevo a refusé la demande. Vérifie la clé API et l'expéditeur validé.";
      }

      return errorResponse(500, "RESET_EMAIL_SEND_FAILED", publicMessage);
    }

    return jsonResponse({
      success: true,
      expiresAt,
      retryAfterSeconds: CODE_LIFETIME_SECONDS,
      email,
    });
  } catch (error) {
    console.error("send-reset-code unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
