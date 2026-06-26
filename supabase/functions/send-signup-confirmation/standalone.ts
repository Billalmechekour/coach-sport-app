// Standalone send-signup-confirmation with Gmail SMTP support.
// Paste this into the Supabase Dashboard for the function `send-signup-confirmation`.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function errorResponse(status: number, code: string, message: string) {
  return jsonResponse({ success: false, error: { code, message } }, status);
}

function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey =
    Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) throw new Error("MISSING_ENV");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function generateSecureToken(bytesLength = 32) {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(bytesLength)));
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getEncryptionKey() {
  const secret = Deno.env.get("SIGNUP_PASSWORD_SECRET") || Deno.env.get("SERVICE_ROLE_KEY");
  if (!secret) throw new Error("Missing SIGNUP_PASSWORD_SECRET or SERVICE_ROLE_KEY.");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function encryptSecretText(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getEncryptionKey();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(value),
  );
  return {
    ciphertext: bytesToBase64Url(new Uint8Array(encrypted)),
    nonce: bytesToBase64Url(iv),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSignupEmailHtml({
  confirmationUrl,
  fullName,
}: {
  confirmationUrl: string;
  fullName?: string | null;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const safeName = fullName ? escapeHtml(fullName) : "";
  const helloLine = safeName ? `Bonjour ${safeName},` : "Bonjour,";
  const safeUrl = escapeHtml(confirmationUrl);
  const safeAppName = escapeHtml(appName);
  return `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.10);">
        <div style="padding:36px 32px;background:linear-gradient(135deg,#effcf5 0%,#ffffff 50%,#ecfeff 100%);text-align:center;">
          <div style="display:inline-block;padding:8px 16px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">Confirme ton compte</div>
          <h1 style="margin:20px 0 10px;font-size:32px;line-height:1.2;color:#0f172a;">Bienvenue chez ${safeAppName}</h1>
          <p style="margin:0;font-size:16px;line-height:1.6;color:#475569;">${helloLine}<br/>Confirme ton adresse email pour activer ton compte.</p>
        </div>
        <div style="padding:24px 32px 36px;text-align:center;">
          <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;background:#10b981;color:#ffffff;border-radius:14px;text-decoration:none;font-weight:700;font-size:16px;">Activer mon compte</a>
          <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">Si le bouton ne fonctionne pas, copie-colle ce lien dans ton navigateur :<br/><a href="${safeUrl}" style="color:#0f766e;word-break:break-all;">${safeUrl}</a></p>
          <p style="margin:18px 0 0;font-size:12px;color:#94a3b8;">Ce lien est valide pendant 24 heures.</p>
        </div>
      </div>
    </div>
  `;
}

async function sendWithSmtp({
  to,
  subject,
  html,
  text,
  fromEmail,
  fromName,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromEmail: string;
  fromName: string;
}) {
  const host = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
  const port = Number(Deno.env.get("SMTP_PORT") || "465");
  const username = Deno.env.get("SMTP_USER") || fromEmail;
  const password = Deno.env.get("SMTP_PASS") || "";
  if (!password) throw new Error("Missing SMTP_PASS.");
  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: port === 465,
      auth: { username, password },
    },
  });
  try {
    await client.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      content: text,
      html,
    });
  } finally {
    await client.close();
  }
}

const SIGNUP_LINK_LIFETIME_HOURS = 24;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Methode non autorisee.");
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
    const appUrl = (
      request.headers.get("origin") ||
      Deno.env.get("APP_URL") ||
      Deno.env.get("SITE_URL") ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");

    if (!email || !isValidEmail(email)) {
      return errorResponse(400, "INVALID_EMAIL", "Adresse email invalide.");
    }
    if (
      !password ||
      !firstName ||
      !lastName ||
      !birthDate ||
      !sex ||
      !country ||
      !isValidDate(birthDate)
    ) {
      return errorResponse(400, "INVALID_SIGNUP_DATA", "Informations d inscription invalides.");
    }
    if (!appUrl) {
      return errorResponse(500, "APP_URL_MISSING", "URL de l application manquante.");
    }

    const supabase = createAdminClient();

    const { data: emailExists, error: emailExistsError } = await supabase.rpc("email_exists", {
      check_email: email,
    });
    if (emailExistsError) {
      console.error("email_exists error", emailExistsError);
      return errorResponse(500, "USER_LOOKUP_FAILED", "Impossible de verifier ce compte.");
    }
    if (emailExists === true) {
      return errorResponse(409, "USER_EXISTS", "Ce compte existe deja avec cette adresse email.");
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + SIGNUP_LINK_LIFETIME_HOURS * 60 * 60 * 1000,
    ).toISOString();
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
        return errorResponse(
          500,
          "PENDING_SIGNUP_FAILED",
          "Impossible de preparer la confirmation email.",
        );
      }
    }

    const { error: upsertError } = await supabase.from("pending_signups").upsert(
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
      return errorResponse(
        500,
        "PENDING_SIGNUP_FAILED",
        "Impossible de preparer la confirmation email.",
      );
    }

    const confirmationUrl = `${appUrl}/auth?mode=login&signup_token=${encodeURIComponent(token)}`;
    const fromEmail =
      Deno.env.get("EMAIL_FROM") || Deno.env.get("SMTP_FROM_EMAIL") || "noreply@example.com";
    const fromName =
      Deno.env.get("EMAIL_FROM_NAME") ||
      Deno.env.get("SMTP_FROM_NAME") ||
      Deno.env.get("APP_NAME") ||
      "Hicham-Fit App";
    const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";

    await sendWithSmtp({
      to: email,
      subject: `Confirme ton compte - ${appName}`,
      html: buildSignupEmailHtml({
        confirmationUrl,
        fullName: `${firstName} ${lastName}`.trim(),
      }),
      text: `Bonjour,\n\nConfirme ton adresse email pour creer et activer ton compte ${appName} :\n${confirmationUrl}\n\nCe lien est valide pendant 24 heures.`,
      fromEmail,
      fromName,
    });

    return jsonResponse({ success: true, email, expiresAt });
  } catch (error) {
    console.error("send-signup-confirmation unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);
    return errorResponse(500, "UNEXPECTED_ERROR", `Erreur inattendue: ${message}`);
  }
});
