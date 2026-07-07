import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

// Seuls ces comptes (le coach) peuvent modifier les contacts du footer.
const COACH_EMAILS = ["noreply.hicham.fit@gmail.com", "billalmechekour6@gmail.com"];

const ALLOWED_KINDS = [
  "facebook",
  "tiktok",
  "instagram",
  "linkedin",
  "whatsapp",
  "youtube",
  "phone",
  "email",
  "website",
  "custom",
];

function normalizeAction(value: unknown) {
  const action = String(value || "list").trim().toLowerCase();
  return ["list", "save"].includes(action) ? action : "list";
}

function normalizeKind(value: unknown) {
  const kind = String(value || "custom").trim().toLowerCase();
  return ALLOWED_KINDS.includes(kind) ? kind : "custom";
}

function serializeContact(row: Record<string, unknown>) {
  return {
    id: String(row.id || ""),
    kind: String(row.kind || "custom"),
    label: String(row.label || ""),
    value: String(row.value || ""),
    sort_order: Number(row.sort_order || 0),
  };
}

function sanitizeContacts(value: unknown) {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item, index) => {
      const entry = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        kind: normalizeKind(entry.kind),
        label: String(entry.label || "").trim().slice(0, 60),
        value: String(entry.value || "").trim().slice(0, 300),
        sort_order: Number.isFinite(Number(entry.sort_order)) ? Number(entry.sort_order) : index,
      };
    })
    .filter((entry) => entry.value.length > 0)
    .slice(0, 30);
}

async function getAuthenticatedUser(request: Request, supabase: ReturnType<typeof createAdminClient>) {
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();

  if (!accessToken) {
    throw new Error("AUTH_REQUIRED");
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.id) {
    throw new Error("AUTH_REQUIRED");
  }

  return data.user;
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
    const action = normalizeAction(payload.action);
    const supabase = createAdminClient();

    if (action === "list") {
      const { data, error } = await supabase
        .from("site_contacts")
        .select("id,kind,label,value,sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("site contacts list error", error);
        return errorResponse(500, "CONTACTS_LIST_FAILED", "Impossible de charger les contacts.");
      }

      return jsonResponse({
        success: true,
        contacts: (data || []).map((row) => serializeContact(row as Record<string, unknown>)),
      });
    }

    // action === "save" : réservé au coach.
    const user = await getAuthenticatedUser(request, supabase);
    const userEmail = String(user.email || "").trim().toLowerCase();
    const metaIsCoach = Boolean(
      (user.app_metadata as Record<string, unknown> | undefined)?.is_coach ||
        (user.user_metadata as Record<string, unknown> | undefined)?.is_coach,
    );
    if (!COACH_EMAILS.includes(userEmail) && !metaIsCoach) {
      return errorResponse(
        403,
        "FORBIDDEN",
        `Action réservée au coach (connecté en tant que ${user.email || "inconnu"}).`,
      );
    }

    const contacts = sanitizeContacts(payload.contacts);

    // Remplace entièrement la liste (simple et fiable).
    const { error: deleteError } = await supabase.from("site_contacts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) {
      console.error("site contacts clear error", deleteError);
      return errorResponse(500, "CONTACTS_SAVE_FAILED", "Impossible d’enregistrer les contacts.");
    }

    if (contacts.length) {
      const { error: insertError } = await supabase.from("site_contacts").insert(contacts);
      if (insertError) {
        console.error("site contacts insert error", insertError);
        return errorResponse(500, "CONTACTS_SAVE_FAILED", "Impossible d’enregistrer les contacts.");
      }
    }

    const { data, error } = await supabase
      .from("site_contacts")
      .select("id,kind,label,value,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("site contacts reload error", error);
      return errorResponse(500, "CONTACTS_SAVE_FAILED", "Impossible d’enregistrer les contacts.");
    }

    return jsonResponse({
      success: true,
      contacts: (data || []).map((row) => serializeContact(row as Record<string, unknown>)),
    });
  } catch (error) {
    console.error("site-contacts unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);

    if (message === "AUTH_REQUIRED") {
      return errorResponse(401, "AUTH_REQUIRED", "Connecte-toi pour modifier les contacts.");
    }

    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
