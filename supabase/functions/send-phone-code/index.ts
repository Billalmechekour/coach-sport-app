import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  sha256Hex,
} from "../_shared/reset-helpers.ts";

const CODE_LIFETIME_SECONDS = 300;

function normalizePhone(value: string) {
  const compact = value.replace(/[^\d+]/g, "");
  if (!compact.startsWith("+")) return "";

  const digits = compact.slice(1).replace(/\D/g, "");
  return digits ? `+${digits}` : "";
}

function isValidPhone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

function generateSmsCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (byte) => String(byte % 10)).join("");
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

async function sendBrevoSms({ phone, code }: { phone: string; code: string }) {
  const apiKey = Deno.env.get("BREVO_API_KEY") || Deno.env.get("SMS_BREVO_API_KEY");
  const sender = (Deno.env.get("SMS_SENDER") || "HichamFit").trim().slice(0, 11);
  const appName = Deno.env.get("APP_NAME") || "Hicham-Fit App";

  if (!apiKey) {
    throw new Error("MISSING_BREVO_API_KEY");
  }

  const response = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      recipient: phone,
      content: `${appName} : ton code de vérification est ${code}. Il expire dans 5 minutes.`,
      type: "transactional",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`BREVO_SMS_FAILED_${response.status}: ${body}`);
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const { phone: rawPhone } = await request.json();
    const phone = normalizePhone(String(rawPhone ?? ""));

    if (!phone || !isValidPhone(phone)) {
      return errorResponse(400, "PHONE_INVALID", "Numéro de téléphone invalide.");
    }

    const { supabase, user } = await getAuthenticatedUser(request);
    const now = new Date();
    const nowIso = now.toISOString();

    const { data: latestCode, error: latestCodeError } = await supabase
      .from("phone_verification_codes")
      .select("id, expires_at, consumed_at")
      .eq("user_id", user.id)
      .eq("phone_number", phone)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCodeError) {
      console.error("latest phone code error", latestCodeError);
      return errorResponse(500, "PHONE_CODE_LOOKUP_FAILED", "Impossible de vérifier le code actuel.");
    }

    if (latestCode?.id) {
      const latestExpiresAt = new Date(latestCode.expires_at);

      if (latestExpiresAt.getTime() > now.getTime()) {
        const retryAfterSeconds = Math.max(1, Math.ceil((latestExpiresAt.getTime() - now.getTime()) / 1000));
        return errorResponse(429, "PHONE_CODE_ACTIVE", "Un code SMS est déjà actif.", {
          retryAfterSeconds,
          expiresAt: latestExpiresAt.toISOString(),
        });
      }

      await supabase
        .from("phone_verification_codes")
        .update({ consumed_at: nowIso })
        .eq("id", latestCode.id);
    }

    const code = generateSmsCode();
    const codeHash = await sha256Hex(code);
    const expiresAt = new Date(now.getTime() + CODE_LIFETIME_SECONDS * 1000).toISOString();

    const { data: insertedCode, error: insertError } = await supabase
      .from("phone_verification_codes")
      .insert({
        user_id: user.id,
        phone_number: phone,
        code_hash: codeHash,
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (insertError || !insertedCode?.id) {
      console.error("insert phone code error", insertError);
      return errorResponse(500, "PHONE_CODE_CREATE_FAILED", "Impossible de créer le code SMS.");
    }

    try {
      await sendBrevoSms({ phone, code });
    } catch (smsError) {
      console.error("send SMS error", smsError);
      await supabase.from("phone_verification_codes").delete().eq("id", insertedCode.id);

      const message = String(smsError instanceof Error ? smsError.message : smsError).toLowerCase();
      if (message.includes("missing_brevo_api_key")) {
        return errorResponse(500, "SMS_CONFIG_MISSING", "La clé BREVO_API_KEY manque dans Supabase.");
      }
      if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid")) {
        return errorResponse(500, "SMS_API_KEY_INVALID", "La clé API SMS Brevo est invalide.");
      }
      if (message.includes("402") || message.includes("credit")) {
        return errorResponse(500, "SMS_CREDIT_MISSING", "Brevo n'a pas assez de crédit SMS.");
      }

      return errorResponse(500, "SMS_SEND_FAILED", "Impossible d'envoyer le SMS. Vérifie Brevo SMS.");
    }

    return jsonResponse({
      success: true,
      phone,
      expiresAt,
      retryAfterSeconds: CODE_LIFETIME_SECONDS,
    });
  } catch (error) {
    console.error("send-phone-code unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);

    if (message === "SESSION_REQUIRED" || message === "SESSION_INVALID") {
      return errorResponse(401, message, "Connexion à actualiser. Reconnecte-toi.");
    }

    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
