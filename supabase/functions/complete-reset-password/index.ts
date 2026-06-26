import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

function getPasswordValidationError(password: string) {
  if (password.length < 12) return "Le mot de passe doit contenir au moins 12 caractères.";
  if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une lettre minuscule.";
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une lettre majuscule.";
  if (!/\d/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
  if (!/[!@#$%&*_\-?.]/.test(password)) return "Le mot de passe doit contenir au moins un symbole autorisé.";
  return "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { resetToken, password } = await request.json();
    const safeResetToken = String(resetToken ?? "").trim();
    const safePassword = String(password ?? "");

    if (!safeResetToken) {
      return errorResponse(400, "RESET_SESSION_REQUIRED", "Session de réinitialisation manquante.");
    }

    const passwordValidationError = getPasswordValidationError(safePassword);
    if (passwordValidationError) {
      return errorResponse(400, "PASSWORD_REQUIREMENTS_FAILED", passwordValidationError);
    }

    const supabase = createAdminClient();
    const now = new Date();
    const nowIso = now.toISOString();
    const resetTokenHash = await sha256Hex(safeResetToken);

    const { data: activeSession, error: activeSessionError } = await supabase
      .from("password_reset_codes")
      .select("id, user_id, reset_session_expires_at, consumed_at")
      .eq("reset_session_hash", resetTokenHash)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeSessionError) {
      console.error("reset session lookup error", activeSessionError);
      return errorResponse(500, "RESET_SESSION_LOOKUP_FAILED", "Impossible de vérifier cette session.");
    }

    if (!activeSession?.id) {
      return errorResponse(401, "RESET_SESSION_INVALID", "La session de réinitialisation est invalide.");
    }

    const sessionExpiresAt = new Date(activeSession.reset_session_expires_at ?? "");

    if (!(sessionExpiresAt instanceof Date) || Number.isNaN(sessionExpiresAt.getTime()) || sessionExpiresAt.getTime() <= now.getTime()) {
      await supabase
        .from("password_reset_codes")
        .update({ consumed_at: nowIso })
        .eq("id", activeSession.id);

      return errorResponse(410, "RESET_SESSION_EXPIRED", "La session de réinitialisation a expiré.");
    }

    const { error: updateUserError } = await supabase.auth.admin.updateUserById(activeSession.user_id, {
      password: safePassword,
    });

    if (updateUserError) {
      console.error("admin password update error", updateUserError);
      return errorResponse(500, "PASSWORD_UPDATE_FAILED", "Impossible de mettre à jour le mot de passe.");
    }

    const { error: consumeCodesError } = await supabase
      .from("password_reset_codes")
      .update({
        consumed_at: nowIso,
        reset_session_hash: null,
        reset_session_expires_at: null,
      })
      .eq("user_id", activeSession.user_id)
      .is("consumed_at", null);

    if (consumeCodesError) {
      console.error("consume reset codes error", consumeCodesError);
    }

    return jsonResponse({
      success: true,
    });
  } catch (error) {
    console.error("complete-reset-password unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
