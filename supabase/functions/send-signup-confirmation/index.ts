import {
  corsHeaders,
  createAdminClient,
  encryptSecretText,
  errorResponse,
  generateSecureToken,
  isValidEmail,
  jsonResponse,
  normalizeEmail,
  sendSignupConfirmationEmail,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

const SIGNUP_LINK_LIFETIME_HOURS = 24;

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const body = await request.json();
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const birthDate = String(body.birthDate ?? "");
    const sex = String(body.sex ?? "").trim();
    const country = String(body.country ?? "").trim();
    const signupClientId = String(body.signupClientId ?? "").trim().slice(0, 120);
    const appUrl = (request.headers.get("origin") || Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || "").trim().replace(/\/+$/, "");

    if (!email || !isValidEmail(email)) {
      return errorResponse(400, "INVALID_EMAIL", "Adresse email invalide.");
    }

    if (!password || !firstName || !lastName || !birthDate || !sex || !country || !isValidDate(birthDate)) {
      return errorResponse(400, "INVALID_SIGNUP_DATA", "Informations d'inscription invalides.");
    }

    if (!appUrl) {
      return errorResponse(500, "APP_URL_MISSING", "URL de l'application manquante.");
    }

    const supabase = createAdminClient();
    const { data: emailExists, error: emailExistsError } = await supabase.rpc("email_exists", {
      check_email: email,
    });

    if (emailExistsError) {
      console.error("email_exists error", emailExistsError);
      return errorResponse(500, "USER_LOOKUP_FAILED", "Impossible de vérifier ce compte.");
    }

    if (emailExists === true) {
      return errorResponse(409, "USER_EXISTS", "Ce compte existe déjà avec cette adresse email.");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + SIGNUP_LINK_LIFETIME_HOURS * 60 * 60 * 1000).toISOString();
    const token = generateSecureToken();
    const tokenHash = await sha256Hex(token);
    const encryptedPassword = await encryptSecretText(password);

    if (signupClientId) {
      const { error: consumePreviousError } = await supabase
        .from("pending_signups")
        .update({ consumed_at: now.toISOString() })
        .eq("signup_client_id", signupClientId)
        .is("consumed_at", null)
        .neq("email", email);

      if (consumePreviousError) {
        console.error("pending signup previous consume error", consumePreviousError);
        return errorResponse(500, "PENDING_SIGNUP_FAILED", "Impossible de préparer la confirmation email.");
      }
    }

    const { error: upsertError } = await supabase
      .from("pending_signups")
      .upsert(
        {
          email,
          password_ciphertext: encryptedPassword.ciphertext,
          password_nonce: encryptedPassword.nonce,
          token_hash: tokenHash,
          first_name: firstName,
          last_name: lastName,
          signup_client_id: signupClientId || null,
          date_of_birth: birthDate,
          sex,
          country_code: country,
          expires_at: expiresAt,
          consumed_at: null,
        },
        { onConflict: "email" },
      );

    if (upsertError) {
      console.error("pending signup upsert error", upsertError);
      return errorResponse(500, "PENDING_SIGNUP_FAILED", "Impossible de préparer la confirmation email.");
    }

    const confirmationUrl = `${appUrl}/auth?mode=login&signup_token=${encodeURIComponent(token)}`;
    await sendSignupConfirmationEmail({
      to: email,
      fullName: `${firstName} ${lastName}`.trim(),
      confirmationUrl,
    });

    return jsonResponse({
      success: true,
      email,
      expiresAt,
    });
  } catch (error) {
    console.error("send-signup-confirmation unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
