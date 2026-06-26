import {
  corsHeaders,
  createAdminClient,
  decryptSecretText,
  errorResponse,
  jsonResponse,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { token: rawToken } = await request.json();
    const token = String(rawToken ?? "").trim();

    if (!token) {
      return errorResponse(400, "SIGNUP_TOKEN_REQUIRED", "Lien de confirmation invalide.");
    }

    const supabase = createAdminClient();
    const tokenHash = await sha256Hex(token);
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: pendingSignup, error: pendingSignupError } = await supabase
      .from("pending_signups")
      .select("id, email, password_ciphertext, password_nonce, first_name, last_name, date_of_birth, sex, country_code, expires_at, consumed_at")
      .eq("token_hash", tokenHash)
      .is("consumed_at", null)
      .maybeSingle();

    if (pendingSignupError) {
      console.error("pending signup lookup error", pendingSignupError);
      return errorResponse(500, "SIGNUP_LOOKUP_FAILED", "Impossible de vérifier ce lien.");
    }

    if (!pendingSignup?.id) {
      return errorResponse(404, "SIGNUP_TOKEN_INVALID", "Lien de confirmation invalide ou déjà utilisé.");
    }

    if (new Date(pendingSignup.expires_at).getTime() <= now.getTime()) {
      await supabase
        .from("pending_signups")
        .update({ consumed_at: nowIso })
        .eq("id", pendingSignup.id);

      return errorResponse(410, "SIGNUP_TOKEN_EXPIRED", "Le lien de confirmation a expiré. Crée un nouveau compte.");
    }

    const password = await decryptSecretText(pendingSignup.password_ciphertext, pendingSignup.password_nonce);
    const fullName = `${pendingSignup.first_name || ""} ${pendingSignup.last_name || ""}`.trim();

    const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: pendingSignup.email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: pendingSignup.first_name || "",
        last_name: pendingSignup.last_name || "",
        full_name: fullName,
        date_of_birth: pendingSignup.date_of_birth,
        sex: pendingSignup.sex || "",
        country_code: pendingSignup.country_code || "",
      },
    });

    if (createUserError) {
      const message = String(createUserError.message || "").toLowerCase();

      if (message.includes("already") || message.includes("registered")) {
        await supabase
          .from("pending_signups")
          .update({ consumed_at: nowIso })
          .eq("id", pendingSignup.id);

        return errorResponse(409, "USER_EXISTS", "Ce compte existe déjà avec cette adresse email.");
      }

      console.error("create confirmed user error", createUserError);
      return errorResponse(500, "USER_CREATE_FAILED", "Impossible de créer ce compte.");
    }

    await supabase
      .from("pending_signups")
      .update({ consumed_at: nowIso })
      .eq("id", pendingSignup.id);

    return jsonResponse({
      success: true,
      email: pendingSignup.email,
      userId: createdUser.user?.id,
    });
  } catch (error) {
    console.error("confirm-signup unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
