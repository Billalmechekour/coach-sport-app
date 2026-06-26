import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  isValidEmail,
  jsonResponse,
  normalizeEmail,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function base64UrlDecode(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a[index] ^ b[index];
  }

  return diff === 0;
}

async function verifyEmailChangeToken(token: string) {
  const [encodedPayload, encodedSignature] = token.split(".");

  if (!encodedPayload || !encodedSignature) {
    throw new Error("EMAIL_CHANGE_TOKEN_INVALID");
  }

  const secret = Deno.env.get("EMAIL_CHANGE_SECRET") || Deno.env.get("SERVICE_ROLE_KEY") || "";

  if (!secret) {
    throw new Error("EMAIL_CHANGE_SECRET_MISSING");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expectedSignature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload)),
  );
  const receivedSignature = base64UrlToBytes(encodedSignature);

  if (!timingSafeEqual(expectedSignature, receivedSignature)) {
    throw new Error("EMAIL_CHANGE_TOKEN_INVALID");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const expiresAt = Number(payload.exp || 0) * 1000;

  if (!expiresAt || expiresAt <= Date.now()) {
    throw new Error("EMAIL_CHANGE_TOKEN_EXPIRED");
  }

  const userId = String(payload.sub || "");
  const oldEmail = normalizeEmail(String(payload.old_email || ""));
  const newEmail = normalizeEmail(String(payload.new_email || ""));

  if (!userId || !oldEmail || !isValidEmail(newEmail)) {
    throw new Error("EMAIL_CHANGE_TOKEN_INVALID");
  }

  return { userId, oldEmail, newEmail };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { token: rawToken } = await request.json().catch(() => ({}));
    const token = String(rawToken || "").trim();

    if (!token) {
      return errorResponse(400, "EMAIL_CHANGE_TOKEN_REQUIRED", "Lien de confirmation invalide.");
    }

    const { userId, oldEmail, newEmail } = await verifyEmailChangeToken(token);
    const tokenHash = await sha256Hex(token);
    const supabase = createAdminClient();
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user?.id || normalizeEmail(userData.user.email || "") !== oldEmail) {
      return errorResponse(404, "EMAIL_CHANGE_TOKEN_INVALID", "Lien de confirmation invalide ou déjà utilisé.");
    }

    const userMetadata = userData.user.user_metadata || {};
    const pendingTokenHash = String(userMetadata.pending_email_change_token_hash || "");
    const pendingNewEmail = normalizeEmail(String(userMetadata.pending_email_change_new_email || ""));
    const pendingExpiresAt = String(userMetadata.pending_email_change_expires_at || "");

    if (
      !pendingTokenHash ||
      pendingTokenHash !== tokenHash ||
      pendingNewEmail !== newEmail ||
      (pendingExpiresAt && new Date(pendingExpiresAt).getTime() <= Date.now())
    ) {
      return errorResponse(404, "EMAIL_CHANGE_TOKEN_INVALID", "Lien de confirmation invalide ou déjà utilisé.");
    }

    const { data: emailExists, error: emailExistsError } = await supabase.rpc("email_exists", {
      check_email: newEmail,
    });

    if (emailExistsError) {
      console.error("email_exists error", emailExistsError);
      return errorResponse(500, "EMAIL_LOOKUP_FAILED", "Impossible de vérifier cette adresse email.");
    }

    if (emailExists === true) {
      return errorResponse(409, "EMAIL_ALREADY_USED", "Cette adresse email est déjà utilisée.");
    }

    const {
      pending_email_change_token_hash: _pendingTokenHash,
      pending_email_change_new_email: _pendingNewEmail,
      pending_email_change_old_email: _pendingOldEmail,
      pending_email_change_expires_at: _pendingExpiresAt,
      ...cleanUserMetadata
    } = userMetadata;

    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      email: newEmail,
      email_confirm: true,
      user_metadata: {
        ...cleanUserMetadata,
        email: newEmail,
      },
    });

    if (updateError) {
      console.error("confirm email change update error", updateError);
      return errorResponse(500, "EMAIL_CHANGE_FAILED", "Impossible de confirmer cette adresse email.");
    }

    return jsonResponse({
      success: true,
      email: updatedUser.user?.email || newEmail,
      userId,
    });
  } catch (error) {
    const code = String(error?.message || "");

    if (code === "EMAIL_CHANGE_TOKEN_EXPIRED") {
      return errorResponse(410, "EMAIL_CHANGE_TOKEN_EXPIRED", "Le lien de confirmation email a expiré.");
    }

    if (code === "EMAIL_CHANGE_TOKEN_INVALID") {
      return errorResponse(404, "EMAIL_CHANGE_TOKEN_INVALID", "Lien de confirmation invalide ou déjà utilisé.");
    }

    console.error("confirm-email-change unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
