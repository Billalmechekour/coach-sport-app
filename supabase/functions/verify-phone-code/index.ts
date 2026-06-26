import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  isValidResetCode,
  jsonResponse,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

function normalizePhone(value: string) {
  const compact = value.replace(/[^\d+]/g, "");
  if (!compact.startsWith("+")) return "";

  const digits = compact.slice(1).replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

function isValidPhone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw new Error("SESSION_REQUIRED");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.id) {
    throw new Error("SESSION_INVALID");
  }

  return { supabase, user: data.user };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { phone: rawPhone, code: rawCode } = await request.json();
    const phone = normalizePhone(String(rawPhone ?? ""));
    const code = String(rawCode ?? "").trim();

    if (!phone || !isValidPhone(phone)) {
      return errorResponse(400, "PHONE_INVALID", "Numéro de téléphone invalide.");
    }

    if (!isValidResetCode(code)) {
      return errorResponse(400, "PHONE_CODE_INVALID", "Code SMS invalide.");
    }

    const { supabase, user } = await getAuthenticatedUser(request);
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: latestCode, error: latestCodeError } = await supabase
      .from("phone_verification_codes")
      .select("id, code_hash, expires_at, consumed_at, attempts_count")
      .eq("user_id", user.id)
      .eq("phone_number", phone)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCodeError) {
      console.error("verify phone code lookup error", latestCodeError);
      return errorResponse(500, "PHONE_CODE_LOOKUP_FAILED", "Impossible de vérifier ce code.");
    }

    if (!latestCode?.id) {
      return errorResponse(410, "PHONE_CODE_EXPIRED", "Le code SMS a expiré. Demande un nouveau code.");
    }

    const latestExpiresAt = new Date(latestCode.expires_at);

    if (latestExpiresAt.getTime() <= now.getTime()) {
      await supabase
        .from("phone_verification_codes")
        .update({ consumed_at: nowIso })
        .eq("id", latestCode.id);

      return errorResponse(410, "PHONE_CODE_EXPIRED", "Le code SMS a expiré. Demande un nouveau code.");
    }

    const incomingHash = await sha256Hex(code);

    if (incomingHash !== latestCode.code_hash) {
      await supabase
        .from("phone_verification_codes")
        .update({ attempts_count: (latestCode.attempts_count ?? 0) + 1 })
        .eq("id", latestCode.id);

      return errorResponse(400, "PHONE_CODE_INVALID", "Code SMS incorrect.");
    }

    await supabase
      .from("phone_verification_codes")
      .update({
        verified_at: nowIso,
        consumed_at: nowIso,
      })
      .eq("id", latestCode.id);

    return jsonResponse({
      success: true,
      phone,
      verifiedAt: nowIso,
    });
  } catch (error) {
    console.error("verify-phone-code unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);

    if (message === "SESSION_REQUIRED" || message === "SESSION_INVALID") {
      return errorResponse(401, message, "Connexion à actualiser. Reconnecte-toi.");
    }

    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
