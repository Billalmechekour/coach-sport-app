import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  isValidEmail,
  jsonResponse,
  normalizeEmail,
  sendEmailChangeConfirmationEmail,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

const EMAIL_CHANGE_LINK_LIFETIME_HOURS = 24;
const profileFields =
  "first_name,last_name,date_of_birth,sex,country_code,avatar_url,phone_number,phone_country_code,phone_verified_at,address_line1,address_line2,postal_code,city,region,created_at,height_cm,current_weight_kg,has_no_sport,sport_practices,sport_practiced,sport_level,sport_goal,sport_goal_custom,sessions_per_week,injuries,remarks,has_no_supplement,dietary_supplements,has_no_injury,injury_history,has_no_medical_information,medical_information,sport_profile_completed_at";
const allowedProfileFields = new Set([
  "first_name",
  "last_name",
  "date_of_birth",
  "sex",
  "country_code",
  "avatar_url",
  "phone_number",
  "phone_country_code",
  "phone_verified_at",
  "address_line1",
  "address_line2",
  "postal_code",
  "city",
  "region",
  "height_cm",
  "current_weight_kg",
  "has_no_sport",
  "sport_practices",
  "sport_practiced",
  "sport_level",
  "sport_goal",
  "sport_goal_custom",
  "sessions_per_week",
  "injuries",
  "remarks",
  "has_no_supplement",
  "dietary_supplements",
  "has_no_injury",
  "injury_history",
  "has_no_medical_information",
  "medical_information",
  "sport_profile_completed_at",
]);

function getPublicKey() {
  return (
    Deno.env.get("SUPABASE_ANON_KEY") ||
    Deno.env.get("ANON_KEY") ||
    Deno.env.get("SERVICE_ROLE_KEY") ||
    ""
  );
}

function isStrongPassword(value: string) {
  return (
    value.length >= 12 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%&*_\-?.]/.test(value)
  );
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signEmailChangePayload(payload: Record<string, unknown>) {
  const secret = Deno.env.get("EMAIL_CHANGE_SECRET") || Deno.env.get("SERVICE_ROLE_KEY") || "";

  if (!secret) {
    throw new Error("Missing EMAIL_CHANGE_SECRET or SERVICE_ROLE_KEY.");
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedPayload}.${encodedSignature}`;
}

function getAppOrigin(request: Request, fallbackUrl: string) {
  const rawOrigin = request.headers.get("origin") || "";

  if (rawOrigin) return rawOrigin.trim().replace(/\/+$/, "");

  try {
    return new URL(fallbackUrl).origin;
  } catch {
    return (Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || "").trim().replace(/\/+$/, "");
  }
}

function sanitizeProfilePayload(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([key]) => allowedProfileFields.has(key)),
  );
}

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

    const payload = await request.json().catch(() => ({}));
    const currentPassword = String(payload.currentPassword || "");
    const newPassword = String(payload.newPassword || "");
    const nextEmail = normalizeEmail(String(payload.newEmail || ""));
    const emailRedirectTo = String(payload.emailRedirectTo || "");
    const metadata =
      payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata)
        ? payload.metadata
        : {};
    const profilePayload = sanitizeProfilePayload(payload.profile);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const publicKey = getPublicKey();

    if (!supabaseUrl || !publicKey) {
      return errorResponse(500, "SERVER_CONFIG_MISSING", "Configuration serveur manquante.");
    }

    const admin = createAdminClient();
    const { data: userData, error: userError } = await admin.auth.getUser(accessToken);

    if (userError || !userData.user?.id || !userData.user.email) {
      return errorResponse(401, "SESSION_INVALID", "Session invalide.");
    }

    const user = userData.user;

    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(400, "CURRENT_PASSWORD_REQUIRED", "Mot de passe actuel requis.");
      }

      if (!isStrongPassword(newPassword)) {
        return errorResponse(400, "PASSWORD_WEAK", "Le nouveau mot de passe ne respecte pas les conditions.");
      }

      const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: publicKey,
        },
        body: JSON.stringify({
          email: user.email,
          password: currentPassword,
        }),
      });

      if (!verifyResponse.ok) {
        return errorResponse(400, "CURRENT_PASSWORD_INVALID", "Mot de passe actuel incorrect.");
      }

      const { error: passwordError } = await admin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (passwordError) {
        console.error("password update error", passwordError);
        return errorResponse(500, "PASSWORD_UPDATE_FAILED", "Impossible de changer le mot de passe.");
      }
    }

    if (Object.keys(metadata).length > 0) {
      const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(user.user_metadata || {}),
          ...metadata,
        },
      });

      if (metadataError) {
        console.error("metadata update error", metadataError);
        return errorResponse(500, "METADATA_UPDATE_FAILED", "Impossible d’enregistrer les informations du compte.");
      }
    }

    let updatedProfile = null;
    if (Object.keys(profilePayload).length > 0) {
      const { data: profileData, error: profileError } = await admin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            ...profilePayload,
          },
          { onConflict: "id" },
        )
        .select(profileFields)
        .single();

      if (profileError) {
        console.error("profile update error", profileError);
        return errorResponse(500, "PROFILE_UPDATE_FAILED", "Impossible d’enregistrer le profil.");
      }

      updatedProfile = profileData || null;
    }

    if (nextEmail && nextEmail !== normalizeEmail(user.email)) {
      if (!isValidEmail(nextEmail)) {
        return errorResponse(400, "INVALID_EMAIL", "Adresse email invalide.");
      }

      const { data: emailExists, error: emailExistsError } = await admin.rpc("email_exists", {
        check_email: nextEmail,
      });

      if (emailExistsError) {
        console.error("email_exists error", emailExistsError);
        return errorResponse(500, "EMAIL_LOOKUP_FAILED", "Impossible de vérifier cette adresse email.");
      }

      if (emailExists === true) {
        return errorResponse(409, "EMAIL_ALREADY_USED", "Cette adresse email est déjà utilisée.");
      }

      const now = Date.now();
      const expiresAt = new Date(now + EMAIL_CHANGE_LINK_LIFETIME_HOURS * 60 * 60 * 1000).toISOString();
      const token = await signEmailChangePayload({
        sub: user.id,
        old_email: normalizeEmail(user.email),
        new_email: nextEmail,
        iat: Math.floor(now / 1000),
        nonce: crypto.randomUUID(),
        exp: Math.floor(new Date(expiresAt).getTime() / 1000),
      });
      const tokenHash = await sha256Hex(token);
      const appOrigin = getAppOrigin(request, emailRedirectTo);
      const confirmationUrl = `${appOrigin}/auth?mode=login&email_change_token=${encodeURIComponent(token)}`;
      const fullName = String(
        metadata.full_name ||
          user.user_metadata?.full_name ||
          `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
          "",
      );

      const { error: pendingEmailMetadataError } = await admin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(user.user_metadata || {}),
          ...metadata,
          pending_email_change_token_hash: tokenHash,
          pending_email_change_new_email: nextEmail,
          pending_email_change_old_email: normalizeEmail(user.email),
          pending_email_change_expires_at: expiresAt,
        },
      });

      if (pendingEmailMetadataError) {
        console.error("pending email metadata update error", pendingEmailMetadataError);
        return errorResponse(500, "EMAIL_CHANGE_PREPARE_FAILED", "Impossible de préparer la confirmation email.");
      }

      await sendEmailChangeConfirmationEmail({
        to: nextEmail,
        fullName,
        confirmationUrl,
      });
    }

    const { data: freshUserData } = await admin.auth.admin.getUserById(user.id);

    return jsonResponse({
      success: true,
      user: {
        id: freshUserData.user?.id || user.id,
        email: freshUserData.user?.email || user.email,
        user_metadata: freshUserData.user?.user_metadata || {},
      },
      profile: updatedProfile,
      emailConfirmationSent: Boolean(nextEmail && nextEmail !== normalizeEmail(user.email)),
      passwordUpdated: Boolean(newPassword),
    });
  } catch (error) {
    console.error("update-account-security unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
