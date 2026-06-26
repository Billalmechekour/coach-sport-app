import { createClient } from "jsr:@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESET_CODE_LENGTH = 6;
const RESET_CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  return jsonResponse(
    {
      success: false,
      error: {
        code,
        message,
        ...(extra ?? {}),
      },
    },
    status,
  );
}

export function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidResetCode(value: string) {
  return /^[A-Za-z0-9]{6}$/.test(value);
}

export function generateResetCode(length = RESET_CODE_LENGTH) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let code = "";

  for (let index = 0; index < length; index += 1) {
    code += RESET_CODE_CHARSET[bytes[index] % RESET_CODE_CHARSET.length];
  }

  return code;
}

export async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function generateSecureToken(bytesLength = 32) {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(bytesLength)));
}

async function getEncryptionKey() {
  const secret = Deno.env.get("SIGNUP_PASSWORD_SECRET") || Deno.env.get("SERVICE_ROLE_KEY");

  if (!secret) {
    throw new Error("Missing SIGNUP_PASSWORD_SECRET or SERVICE_ROLE_KEY.");
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptSecretText(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getEncryptionKey();
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(value));

  return {
    ciphertext: bytesToBase64Url(new Uint8Array(encrypted)),
    nonce: bytesToBase64Url(iv),
  };
}

export async function decryptSecretText(ciphertext: string, nonce: string) {
  const key = await getEncryptionKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(nonce) },
    key,
    base64UrlToBytes(ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildResetEmailHtml({
  code,
  fullName,
  appUrl: rawAppUrl,
}: {
  code: string;
  fullName?: string | null;
  appUrl?: string | null;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const appUrl = (rawAppUrl || Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || "").trim().replace(/\/+$/, "");
  const logoUrl = (Deno.env.get("APP_LOGO_URL")?.trim() || (appUrl ? `${appUrl}/logo.png` : ""));
  const codeActionUrl = appUrl ? `${appUrl}/auth?mode=reset-code&code=${encodeURIComponent(code)}&copy=1` : "";
  const safeCode = escapeHtml(code);
  const safeAppName = escapeHtml(appName);
  const safeCodeActionUrl = escapeHtml(codeActionUrl);
  const safeFullName = fullName ? escapeHtml(fullName) : "";
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";

  return `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
        <div style="padding:40px 32px;background:linear-gradient(135deg,#effcf5 0%,#ffffff 40%,#ecfeff 100%);text-align:center;">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="Logo ${safeAppName}" width="96" height="96" style="width:96px;height:96px;object-fit:contain;border-radius:28px;margin:0 auto 22px;display:block;background:#0f172a;padding:10px;border:1px solid rgba(15,23,42,0.08);box-shadow:0 18px 42px rgba(15,23,42,0.16);" />`
              : ""
          }
          <div style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
            Réinitialisation du mot de passe
          </div>
          <h1 style="margin:24px 0 10px;font-size:38px;line-height:1.1;color:#0f172a;">
            Ton code de vérification
          </h1>
          <p style="margin:0;font-size:18px;line-height:1.7;color:#475569;">
            ${helloLine}<br />
            Utilise ce code pour réinitialiser ton mot de passe sur <strong>${safeAppName}</strong>.
          </p>
        </div>

        <div style="padding:0 32px 36px;">
          <div style="margin:0 auto 24px;max-width:460px;padding:22px 18px;border-radius:24px;border:1px solid #86efac;background:linear-gradient(180deg,#f0fdf4 0%,#ffffff 100%);text-align:center;box-shadow:0 16px 36px rgba(16,185,129,0.12);">
            <div style="font-size:14px;letter-spacing:0.22em;text-transform:uppercase;color:#059669;font-weight:800;margin-bottom:14px;">
              Code
            </div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #bbf7d0;border-radius:18px;overflow:hidden;">
              <tr>
                <td style="padding:28px 18px;font-size:34px;font-weight:900;letter-spacing:0.2em;color:#0f172a;text-align:center;white-space:nowrap;user-select:all;-webkit-user-select:all;">
                  ${safeCode}
                </td>
              </tr>
            </table>
            ${
              codeActionUrl
                ? `<div style="margin-top:16px;text-align:center;">
                    <a href="${safeCodeActionUrl}" target="_blank" style="display:inline-block;border-radius:16px;border:2px solid #10b981;background:#ffffff;color:#047857;font-size:15px;font-weight:900;padding:12px 18px;white-space:nowrap;text-decoration:none;">
                      <span style="display:inline-block;width:16px;height:16px;margin-right:8px;border:2px solid #047857;border-radius:4px;vertical-align:-3px;box-shadow:5px -5px 0 -2px #ffffff,5px -5px 0 0 #047857;"></span>
                      Copier
                    </a>
                  </div>`
                : ""
            }
            <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#64748b;">
              Clique sur Copier pour ouvrir l'application avec le code deja rempli, ou selectionne le code manuellement.
            </p>
          </div>

          <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#334155;text-align:center;">
            Ce code est valide pendant <strong>3 minutes</strong>.
          </p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#64748b;text-align:center;">
            Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#94a3b8;text-align:center;">
            Cet email est envoyé automatiquement, merci de ne pas répondre.
          </p>
        </div>
      </div>
    </div>
  `;
}

function buildSignupConfirmationEmailHtml({
  confirmationUrl,
  fullName,
}: {
  confirmationUrl: string;
  fullName?: string | null;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const fallbackAppUrl = (() => {
    try {
      return new URL(confirmationUrl).origin;
    } catch {
      return "";
    }
  })();
  const appUrl = (Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || fallbackAppUrl).trim().replace(/\/+$/, "");
  const logoUrl = Deno.env.get("APP_LOGO_URL")?.trim() || (appUrl ? `${appUrl}/logo.png` : "");
  const safeAppName = escapeHtml(appName);
  const safeConfirmationUrl = escapeHtml(confirmationUrl);
  const safeFullName = fullName ? escapeHtml(fullName) : "";
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";

  return `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
        <div style="padding:40px 32px;background:linear-gradient(135deg,#effcf5 0%,#ffffff 40%,#ecfeff 100%);text-align:center;">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="Logo ${safeAppName}" width="96" height="96" style="width:96px;height:96px;object-fit:contain;border-radius:28px;margin:0 auto 22px;display:block;background:#0f172a;padding:10px;border:1px solid rgba(15,23,42,0.08);box-shadow:0 18px 42px rgba(15,23,42,0.16);" />`
              : ""
          }
          <div style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
            Confirmation du compte
          </div>
          <h1 style="margin:24px 0 10px;font-size:38px;line-height:1.1;color:#0f172a;">
            Confirme ton adresse email
          </h1>
          <p style="margin:0;font-size:18px;line-height:1.7;color:#475569;">
            ${helloLine}<br />
            Clique sur le bouton ci-dessous pour créer et activer ton compte sur <strong>${safeAppName}</strong>.
          </p>
        </div>

        <div style="padding:0 32px 40px;text-align:center;">
          <a href="${safeConfirmationUrl}" target="_blank" style="display:inline-block;margin:32px auto 18px;border-radius:18px;border:2px solid #10b981;background:#10b981;color:#0f172a;font-size:16px;font-weight:900;padding:14px 24px;text-decoration:none;">
            Confirmer mon email
          </a>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#64748b;">
            Ce lien est valide pendant <strong>24 heures</strong>.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#94a3b8;">
            Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.
          </p>
        </div>
      </div>
    </div>
  `;
}

function buildEmailChangeConfirmationEmailHtml({
  confirmationUrl,
  fullName,
  newEmail,
}: {
  confirmationUrl: string;
  fullName?: string | null;
  newEmail: string;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const fallbackAppUrl = (() => {
    try {
      return new URL(confirmationUrl).origin;
    } catch {
      return "";
    }
  })();
  const appUrl = (Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || fallbackAppUrl).trim().replace(/\/+$/, "");
  const logoUrl = Deno.env.get("APP_LOGO_URL")?.trim() || (appUrl ? `${appUrl}/logo.png` : "");
  const safeAppName = escapeHtml(appName);
  const safeConfirmationUrl = escapeHtml(confirmationUrl);
  const safeFullName = fullName ? escapeHtml(fullName) : "";
  const safeNewEmail = escapeHtml(newEmail);
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";

  return `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
        <div style="padding:40px 32px;background:linear-gradient(135deg,#effcf5 0%,#ffffff 40%,#ecfeff 100%);text-align:center;">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="Logo ${safeAppName}" width="96" height="96" style="width:96px;height:96px;object-fit:contain;border-radius:28px;margin:0 auto 22px;display:block;background:#0f172a;padding:10px;border:1px solid rgba(15,23,42,0.08);box-shadow:0 18px 42px rgba(15,23,42,0.16);" />`
              : ""
          }
          <div style="display:inline-block;padding:10px 18px;border-radius:999px;border:1px solid #86efac;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
            Changement d'adresse email
          </div>
          <h1 style="margin:24px 0 10px;font-size:38px;line-height:1.1;color:#0f172a;">
            Confirme ta nouvelle adresse email
          </h1>
          <p style="margin:0;font-size:18px;line-height:1.7;color:#475569;">
            ${helloLine}<br />
            Clique sur le bouton ci-dessous pour utiliser <strong>${safeNewEmail}</strong> sur <strong>${safeAppName}</strong>.
          </p>
        </div>

        <div style="padding:0 32px 40px;text-align:center;">
          <a href="${safeConfirmationUrl}" target="_blank" style="display:inline-block;margin:32px auto 18px;border-radius:18px;border:2px solid #10b981;background:#10b981;color:#0f172a;font-size:16px;font-weight:900;padding:14px 24px;text-decoration:none;">
            Confirmer ma nouvelle adresse
          </a>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#64748b;">
            Ce lien est valide pendant <strong>24 heures</strong>. L'ancienne adresse reste active tant que ce lien n'est pas confirmé.
          </p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#94a3b8;">
            Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.
          </p>
        </div>
      </div>
    </div>
  `;
}

async function sendWithBrevo({
  to,
  subject,
  html,
  text,
  fromEmail,
  fromName,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromEmail: string;
  fromName: string;
  attachments?: { name: string; content: string }[];
}) {
  const apiKey = Deno.env.get("BREVO_API_KEY");

  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY.");
  }

  const body: Record<string, unknown> = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  };

  if (attachments && attachments.length) {
    body.attachment = attachments.map((file) => ({ name: file.name, content: file.content }));
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo email failed: ${response.status} ${errorText}`);
  }
}

async function sendWithResend({
  to,
  subject,
  html,
  text,
  fromEmail,
  fromName,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromEmail: string;
  fromName: string;
  attachments?: { name: string; content: string }[];
}) {
  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const body: Record<string, unknown> = {
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject,
    html,
    text,
  };

  if (attachments && attachments.length) {
    body.attachments = attachments.map((file) => ({ filename: file.name, content: file.content }));
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}

function encodeBase64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function encodeBase64UrlUtf8(value: string) {
  return encodeBase64Utf8(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function encodeMimeHeader(value: string) {
  return `=?UTF-8?B?${encodeBase64Utf8(value)}?=`;
}

async function getGmailAccessToken() {
  const clientId = Deno.env.get("GMAIL_CLIENT_ID");
  const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, or GMAIL_REFRESH_TOKEN.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(`Gmail token refresh failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return String(data.access_token);
}

async function sendWithGmail({
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
  const accessToken = await getGmailAccessToken();
  const boundary = `hm_${crypto.randomUUID().replaceAll("-", "")}`;
  const safeFromEmail = sanitizeHeaderValue(fromEmail);
  const safeFromName = sanitizeHeaderValue(fromName);
  const safeTo = sanitizeHeaderValue(to);
  const mime = [
    `From: ${encodeMimeHeader(safeFromName)} <${safeFromEmail}>`,
    `To: ${safeTo}`,
    `Subject: ${encodeMimeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  const userId = encodeURIComponent(Deno.env.get("GMAIL_USER_ID") || "me");
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      raw: encodeBase64UrlUtf8(mime),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail send failed: ${response.status} ${errorText}`);
  }
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

  if (!password) {
    throw new Error("Missing SMTP_PASS.");
  }

  const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
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

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { name: string; content: string }[];
}) {
  const provider = (Deno.env.get("EMAIL_PROVIDER") ?? "brevo").trim().toLowerCase();
  const fromEmail = Deno.env.get("EMAIL_FROM") ?? Deno.env.get("SMTP_FROM_EMAIL");
  const fromName = Deno.env.get("EMAIL_FROM_NAME") ?? Deno.env.get("SMTP_FROM_NAME") ?? Deno.env.get("APP_NAME") ?? "Hicham-Fit App";

  if (!fromEmail) {
    throw new Error("Missing EMAIL_FROM or SMTP_FROM_EMAIL.");
  }

  const payload = { to, subject, html, text, fromEmail, fromName, attachments };

  if (provider === "gmail") {
    await sendWithGmail(payload);
    return;
  }

  if (provider === "resend") {
    await sendWithResend(payload);
    return;
  }

  if (provider === "smtp") {
    await sendWithSmtp(payload);
    return;
  }

  await sendWithBrevo(payload);
}

export async function sendSignupConfirmationEmail({
  to,
  fullName,
  confirmationUrl,
}: {
  to: string;
  fullName?: string | null;
  confirmationUrl: string;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const subject = `Confirme ton compte - ${appName}`;
  const html = buildSignupConfirmationEmailHtml({ confirmationUrl, fullName });
  const text = `Bonjour,\n\nConfirme ton adresse email pour créer et activer ton compte ${appName} :\n${confirmationUrl}\n\nCe lien est valide pendant 24 heures.\n\nCet email est envoyé automatiquement, merci de ne pas répondre.`;

  await sendTransactionalEmail({ to, subject, html, text });
}

export async function sendEmailChangeConfirmationEmail({
  to,
  fullName,
  confirmationUrl,
}: {
  to: string;
  fullName?: string | null;
  confirmationUrl: string;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const subject = `Confirme ta nouvelle adresse email - ${appName}`;
  const html = buildEmailChangeConfirmationEmailHtml({ confirmationUrl, fullName, newEmail: to });
  const text = `Bonjour,\n\nConfirme ta nouvelle adresse email pour ton compte ${appName} :\n${confirmationUrl}\n\nCe lien est valide pendant 24 heures. L'ancienne adresse reste active tant que ce lien n'est pas confirmé.\n\nCet email est envoyé automatiquement, merci de ne pas répondre.`;

  await sendTransactionalEmail({ to, subject, html, text });
}

export async function sendResetCodeEmail({
  to,
  code,
  fullName,
  appUrl,
}: {
  to: string;
  code: string;
  fullName?: string | null;
  appUrl?: string | null;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const subject = `Code de réinitialisation - ${appName}`;
  const html = buildResetEmailHtml({ code, fullName, appUrl });
  const text = `Bonjour,\n\nVoici ton code de réinitialisation: ${code}\n\nCe code est valide pendant 3 minutes.\n\nCet email est envoyé automatiquement, merci de ne pas répondre.`;

  await sendTransactionalEmail({ to, subject, html, text });
}

export async function sendInvoiceEmail({
  to,
  fullName,
  invoiceNumber,
  dateStr,
  items,
  total,
  pdfBase64,
  downloadUrl,
}: {
  to: string;
  fullName?: string | null;
  invoiceNumber: string;
  dateStr: string;
  items: { category: string; title: string; price: string }[];
  total: number;
  pdfBase64: string;
  downloadUrl?: string | null;
}) {
  const appName = Deno.env.get("APP_NAME") ?? "Hicham-Fit App";
  const appUrl = (Deno.env.get("APP_URL") || Deno.env.get("SITE_URL") || "").trim().replace(/\/+$/, "");
  const logoUrl = Deno.env.get("APP_LOGO_URL")?.trim() || (appUrl ? `${appUrl}/logo.png` : "");
  const safeAppName = escapeHtml(appName);
  const safeFullName = fullName ? escapeHtml(fullName) : "";
  const helloLine = safeFullName ? `Bonjour ${safeFullName},` : "Bonjour,";
  const subject = `Votre facture ${invoiceNumber} - ${appName}`;

  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#475569;">${escapeHtml(item.category)}</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#0f172a;font-weight:bold;">${escapeHtml(item.title)}</td>
          <td style="padding:10px;border:1px solid #e2e8f0;color:#0f172a;text-align:right;white-space:nowrap;">${escapeHtml(item.price)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
        <div style="padding:32px;text-align:center;background:linear-gradient(135deg,#effcf5 0%,#ffffff 50%,#ecfeff 100%);">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="Logo ${safeAppName}" width="72" height="72" style="width:72px;height:72px;object-fit:contain;border-radius:18px;margin:0 auto 16px;display:block;background:#0f172a;padding:8px;" />`
              : ""
          }
          <h1 style="margin:0;font-size:22px;color:#0f172a;">Facture ${escapeHtml(invoiceNumber)}</h1>
          <p style="margin:6px 0 0;color:#64748b;font-size:13px;">${escapeHtml(dateStr)}</p>
        </div>
        <div style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:15px;">${helloLine}</p>
          <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">Merci pour votre achat. Voici le récapitulatif de votre commande. La facture détaillée est jointe à cet email au format PDF.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#14b86f;color:#ffffff;">
                <th style="padding:10px;border:1px solid #14b86f;text-align:left;">Catégorie</th>
                <th style="padding:10px;border:1px solid #14b86f;text-align:left;">Programme</th>
                <th style="padding:10px;border:1px solid #14b86f;text-align:right;">Prix unitaire</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin:20px 0 0;text-align:right;font-size:18px;font-weight:bold;color:#0f172a;">Total : ${total} €</p>
          ${
            downloadUrl
              ? `<div style="text-align:center;margin:26px 0 4px;">
                  <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#14b86f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:14px;">Télécharger la facture (PDF)</a>
                </div>
                <p style="margin:10px 0 0;text-align:center;color:#94a3b8;font-size:12px;">La facture est aussi jointe à cet email au format PDF.</p>`
              : `<p style="margin:18px 0 0;text-align:center;color:#94a3b8;font-size:12px;">La facture est jointe à cet email au format PDF.</p>`
          }
        </div>
        <div style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:12px;">
          Cet email est envoyé automatiquement, merci de ne pas répondre.
        </div>
      </div>
    </div>
  `;

  const textRows = items.map((item) => `- ${item.title} (${item.category}) : ${item.price}`).join("\n");
  const text = `${fullName ? `Bonjour ${fullName},` : "Bonjour,"}\n\nMerci pour votre achat. Voici votre commande (facture ${invoiceNumber} du ${dateStr}) :\n${textRows}\n\nTotal : ${total} €\n\nLa facture PDF est jointe à cet email.\n\nCet email est envoyé automatiquement, merci de ne pas répondre.`;

  await sendTransactionalEmail({
    to,
    subject,
    html,
    text,
    attachments: [{ name: `facture-${invoiceNumber}.pdf`, content: pdfBase64 }],
  });
}
