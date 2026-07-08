import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

const COACH_EMAILS = ["noreply.hicham.fit@gmail.com", "billalmechekour6@gmail.com", "hichamechkour39@gmail.com"];

function isCoachUser(user: { email?: string | null; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  if (!user) return false;
  const email = String(user.email || "").trim().toLowerCase();
  if (COACH_EMAILS.includes(email)) return true;
  return Boolean(user.app_metadata?.is_coach || user.user_metadata?.is_coach);
}

function normalizeAction(value: unknown) {
  const action = String(value || "list").trim().toLowerCase();
  return ["send", "thread", "conversations", "mark-read", "upload-media"].includes(action) ? action : "thread";
}

function normalizeKind(value: unknown) {
  const kind = String(value || "text").trim().toLowerCase();
  return ["text", "image", "file", "voice"].includes(kind) ? kind : "text";
}

function serializeMessage(row: Record<string, unknown>) {
  return {
    id: String(row.id || ""),
    athlete_id: String(row.athlete_id || ""),
    sender: String(row.sender || "athlete"),
    kind: String(row.kind || "text"),
    body: String(row.body || ""),
    read_by_coach: Boolean(row.read_by_coach),
    read_by_athlete: Boolean(row.read_by_athlete),
    created_at: String(row.created_at || new Date().toISOString()),
  };
}

async function getAuthenticatedUser(request: Request, supabase: ReturnType<typeof createAdminClient>) {
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) throw new Error("AUTH_REQUIRED");
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.id) throw new Error("AUTH_REQUIRED");
  return data.user;
}

async function loadProfiles(supabase: ReturnType<typeof createAdminClient>, ids: string[]) {
  const map = new Map<string, { name: string; avatar: string }>();
  if (!ids.length) return map;
  const { data } = await supabase
    .from("profiles")
    .select("id,first_name,last_name,avatar_url")
    .in("id", ids);
  for (const row of (data || []) as Record<string, unknown>[]) {
    const name = `${String(row.first_name || "").trim()} ${String(row.last_name || "").trim()}`.trim();
    map.set(String(row.id), { name, avatar: String(row.avatar_url || "").trim() });
  }
  return map;
}

// Crée le bucket chat-media s'il n'existe pas, puis upload le fichier via l'API Storage REST.
async function ensureBucketAndUpload(base64: string, mimeType: string, kind: string): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceKey) return null;

  const storageBase = `${supabaseUrl}/storage/v1`;
  const authHeaders = {
    "Authorization": `Bearer ${serviceKey}`,
    "apikey": serviceKey,
  };

  try {
    await fetch(`${storageBase}/bucket`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id: "chat-media", name: "chat-media", public: true, file_size_limit: 20971520 }),
    });
  } catch { /* bucket existe déjà */ }

  let bytes: Uint8Array;
  try {
    const binary = atob(base64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  } catch { return null; }

  const ext = kind === "voice" ? "webm" : kind === "image" ? "jpg" : "bin";
  const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadUrl = `${storageBase}/object/chat-media/${path}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": mimeType || "application/octet-stream" },
    body: bytes,
  });

  if (!res.ok) return null;
  return `${storageBase}/object/public/chat-media/${path}`;
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
    const user = await getAuthenticatedUser(request, supabase);
    const coach = isCoachUser(user);

    if (action === "upload-media") {
      const kind = normalizeKind(payload.kind);
      const base64 = String(payload.base64 || "").trim();
      const mimeType = String(payload.mimeType || "application/octet-stream").trim();
      if (!base64) return errorResponse(400, "EMPTY", "Données manquantes.");

      const url = await ensureBucketAndUpload(base64, mimeType, kind);
      if (!url) return errorResponse(500, "UPLOAD_FAILED", "Impossible d'uploader le fichier.");
      return jsonResponse({ success: true, url });
    }

    // La conversation ciblée : le coach précise athleteId ; l'athlète = lui-même.
    const targetAthleteId = coach ? String(payload.athleteId || "").trim() : user.id;

    if (action === "send") {
      const kind = normalizeKind(payload.kind);
      const body = String(payload.body || "").trim().slice(0, 4000);
      if (!body) return errorResponse(400, "EMPTY", "Message vide.");
      if (coach && !targetAthleteId) return errorResponse(400, "NO_ATHLETE", "Athlète manquant.");

      const row = {
        athlete_id: targetAthleteId,
        sender: coach ? "coach" : "athlete",
        kind,
        body,
        read_by_coach: coach,      // le coach a « lu » ce qu'il envoie
        read_by_athlete: !coach,   // l'athlète a « lu » ce qu'il envoie
      };
      const { data, error } = await supabase.from("messages").insert(row).select("*").single();
      if (error || !data) {
        console.error("message send error", error);
        return errorResponse(500, "SEND_FAILED", "Impossible d’envoyer le message.");
      }
      return jsonResponse({ success: true, message: serializeMessage(data as Record<string, unknown>) });
    }

    if (action === "thread") {
      if (coach && !targetAthleteId) return errorResponse(400, "NO_ATHLETE", "Athlète manquant.");
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("athlete_id", targetAthleteId)
        .order("created_at", { ascending: true })
        .limit(500);
      if (error) {
        console.error("message thread error", error);
        return errorResponse(500, "THREAD_FAILED", "Impossible de charger la conversation.");
      }
      // Marque comme lus les messages reçus dans cette conversation.
      if (coach) {
        await supabase.from("messages").update({ read_by_coach: true })
          .eq("athlete_id", targetAthleteId).eq("sender", "athlete").eq("read_by_coach", false);
      } else {
        await supabase.from("messages").update({ read_by_athlete: true })
          .eq("athlete_id", targetAthleteId).eq("sender", "coach").eq("read_by_athlete", false);
      }
      return jsonResponse({
        success: true,
        messages: (data || []).map((r) => serializeMessage(r as Record<string, unknown>)),
      });
    }

    if (action === "mark-read") {
      if (coach) {
        if (!targetAthleteId) return errorResponse(400, "NO_ATHLETE", "Athlète manquant.");
        await supabase.from("messages").update({ read_by_coach: true })
          .eq("athlete_id", targetAthleteId).eq("sender", "athlete").eq("read_by_coach", false);
      } else {
        await supabase.from("messages").update({ read_by_athlete: true })
          .eq("athlete_id", user.id).eq("sender", "coach").eq("read_by_athlete", false);
      }
      return jsonResponse({ success: true });
    }

    // action === "conversations" : réservé au coach → liste des conversations (1 par athlète).
    if (!coach) return errorResponse(403, "FORBIDDEN", "Action réservée au coach.");

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) {
      console.error("conversations error", error);
      return errorResponse(500, "CONVERSATIONS_FAILED", "Impossible de charger les conversations.");
    }

    const byAthlete = new Map<string, { last: Record<string, unknown>; unread: number }>();
    for (const raw of (data || []) as Record<string, unknown>[]) {
      const aid = String(raw.athlete_id || "");
      if (!aid) continue;
      let entry = byAthlete.get(aid);
      if (!entry) {
        entry = { last: raw, unread: 0 }; // 1re occurrence = dernier message (tri desc)
        byAthlete.set(aid, entry);
      }
      if (String(raw.sender) === "athlete" && !raw.read_by_coach) entry.unread += 1;
    }

    const ids = [...byAthlete.keys()];
    const profiles = await loadProfiles(supabase, ids);
    const conversations = ids.map((aid) => {
      const entry = byAthlete.get(aid)!;
      const prof = profiles.get(aid) || { name: "", avatar: "" };
      const last = serializeMessage(entry.last);
      return {
        athlete_id: aid,
        athlete_name: prof.name || "Athlète",
        athlete_avatar: prof.avatar,
        last_message: last.body,
        last_kind: last.kind,
        last_sender: last.sender,
        last_at: last.created_at,
        unread: entry.unread,
      };
    });
    conversations.sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime());

    return jsonResponse({ success: true, conversations });
  } catch (error) {
    console.error("messages unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);
    if (message === "AUTH_REQUIRED") {
      return errorResponse(401, "AUTH_REQUIRED", "Connecte-toi pour accéder à la messagerie.");
    }
    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
