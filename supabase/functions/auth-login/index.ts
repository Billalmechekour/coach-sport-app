import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  isValidEmail,
  jsonResponse,
  normalizeEmail,
} from "../_shared/reset-helpers.ts";

const profileFields =
  "first_name,last_name,date_of_birth,sex,country_code,avatar_url,phone_number,phone_country_code,phone_verified_at,address_line1,address_line2,postal_code,city,region,created_at,height_cm,current_weight_kg,has_no_sport,sport_practices,sport_practiced,sport_level,sport_goal,sport_goal_custom,sessions_per_week,injuries,remarks,has_no_supplement,dietary_supplements,has_no_injury,injury_history,has_no_medical_information,medical_information,sport_profile_completed_at";

function getPublicKey() {
  return (
    Deno.env.get("SUPABASE_ANON_KEY") ||
    Deno.env.get("ANON_KEY") ||
    Deno.env.get("SERVICE_ROLE_KEY") ||
    ""
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
    const payload = await request.json().catch(() => ({}));
    const email = normalizeEmail(String(payload.email || ""));
    const password = String(payload.password || "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const publicKey = getPublicKey();

    if (!supabaseUrl || !publicKey) {
      return errorResponse(500, "SERVER_CONFIG_MISSING", "Configuration serveur manquante.");
    }

    if (!isValidEmail(email) || !password) {
      return errorResponse(400, "INVALID_CREDENTIALS", "Email ou mot de passe incorrect.");
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: publicKey,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.msg || data.error_description || data.message || "Email ou mot de passe incorrect.";
      const code = data.error_code || data.code || "INVALID_CREDENTIALS";
      return errorResponse(response.status, code, message);
    }

    let profile = null;
    if (data.user?.id) {
      const admin = createAdminClient();
      const { data: profileData, error: profileError } = await admin
        .from("profiles")
        .select(profileFields)
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("auth-login profile lookup error", profileError);
      } else {
        profile = profileData || null;
      }
    }

    return jsonResponse({ ...data, profile });
  } catch (error) {
    console.error("auth-login unexpected error", error);
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
