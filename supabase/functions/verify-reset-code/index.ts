import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  isValidEmail,
  isValidResetCode,
  jsonResponse,
  normalizeEmail,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

const RESET_SESSION_LIFETIME_SECONDS = 1800;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { email: rawEmail, code: rawCode } = await request.json();
    const email = normalizeEmail(String(rawEmail ?? ""));
    const code = String(rawCode ?? "").trim();

    if (!email || !isValidEmail(email)) {
      return errorResponse(400, "INVALID_EMAIL", "Adresse email invalide.");
    }

    if (!isValidResetCode(code)) {
      return errorResponse(400, "RESET_CODE_INVALID", "Code invalide. Le code doit contenir exactement 6 caractères alphanumériques.");
    }

    const supabase = createAdminClient();
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: latestCode, error: latestCodeError } = await supabase
      .from("password_reset_codes")
      .select("id, user_id, email, code_hash, expires_at, consumed_at, attempts_count")
      .eq("email", email)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCodeError) {
      console.error("verify reset code lookup error", latestCodeError);
      return errorResponse(500, "RESET_CODE_LOOKUP_FAILED", "Impossible de vérifier ce code.");
    }

    if (!latestCode?.id) {
      return errorResponse(410, "RESET_CODE_EXPIRED", "Le code a expiré. Demande un nouveau code.");
    }

    const latestExpiresAt = new Date(latestCode.expires_at);

    if (latestExpiresAt.getTime() <= now.getTime()) {
      await supabase
        .from("password_reset_codes")
        .update({ consumed_at: nowIso })
        .eq("id", latestCode.id);

      return errorResponse(410, "RESET_CODE_EXPIRED", "Le code a expiré. Demande un nouveau code.");
    }

    const incomingHash = await sha256Hex(code);

    if (incomingHash !== latestCode.code_hash) {
      await supabase
        .from("password_reset_codes")
        .update({ attempts_count: (latestCode.attempts_count ?? 0) + 1 })
        .eq("id", latestCode.id);

      return errorResponse(400, "RESET_CODE_INVALID", "Code incorrect.");
    }

    const resetToken = crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
    const resetTokenHash = await sha256Hex(resetToken);
    const resetSessionExpiresAt = new Date(now.getTime() + RESET_SESSION_LIFETIME_SECONDS * 1000).toISOString();

    const { error: markVerifiedError } = await supabase
      .from("password_reset_codes")
      .update({
        verified_at: nowIso,
        reset_session_hash: resetTokenHash,
        reset_session_expires_at: resetSessionExpiresAt,
      })
      .eq("id", latestCode.id);

    if (markVerifiedError) {
      console.error("mark verified reset code error", markVerifiedError);
      return errorResponse(500, "RESET_CODE_VERIFY_FAILED", "Impossible de valider ce code.");
    }

    return jsonResponse({
      success: true,
      resetToken,
      expiresAt: resetSessionExpiresAt,
      email,
    });
  } catch (error) {
    console.error("verify-reset-code unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
