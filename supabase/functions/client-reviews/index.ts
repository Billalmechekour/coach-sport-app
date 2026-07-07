import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

const reviewFields = `
  id,
  user_id,
  rating,
  message,
  author_name,
  avatar_url,
  created_at,
  updated_at,
  profiles (
    first_name,
    last_name,
    avatar_url
  )
`;

const COACH_EMAILS = ["noreply.hicham.fit@gmail.com", "billalmechekour6@gmail.com"];

function isCoachUser(user: { email?: string | null; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  const email = String(user.email || "").trim().toLowerCase();
  if (COACH_EMAILS.includes(email)) return true;
  return Boolean(user.app_metadata?.is_coach || user.user_metadata?.is_coach);
}

function normalizeAction(value: unknown) {
  const action = String(value || "list").trim().toLowerCase();
  return ["list", "save", "delete", "coach-delete"].includes(action) ? action : "list";
}

function normalizeMessage(value: unknown) {
  return String(value || "").trim().slice(0, 200);
}

function normalizeRating(value: unknown) {
  return Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
}

function getProfileName(profile: Record<string, unknown> | null | undefined) {
  return `${String(profile?.first_name || "").trim()} ${String(profile?.last_name || "").trim()}`.trim();
}

function serializeReview(row: Record<string, unknown>) {
  const profile = (row.profiles && typeof row.profiles === "object" ? row.profiles : null) as
    | Record<string, unknown>
    | null;
  const profileName = getProfileName(profile);
  const profileAvatar = String(profile?.avatar_url || "").trim();

  return {
    id: String(row.id || ""),
    author_id: String(row.user_id || ""),
    author_name: profileName || String(row.author_name || "").trim() || "Athlète",
    avatar_url: profileAvatar || String(row.avatar_url || "").trim(),
    rating: Number(row.rating || 0),
    message: String(row.message || ""),
    created_at: String(row.updated_at || row.created_at || new Date().toISOString()),
  };
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
        .from("client_reviews")
        .select(reviewFields)
        .order("updated_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("client reviews list error", error);
        return errorResponse(500, "REVIEWS_LIST_FAILED", "Impossible de charger les avis.");
      }

      return jsonResponse({
        success: true,
        reviews: (data || []).map((row) => serializeReview(row as Record<string, unknown>)),
      });
    }

    const user = await getAuthenticatedUser(request, supabase);

    if (action === "delete") {
      const { error } = await supabase.from("client_reviews").delete().eq("user_id", user.id);

      if (error) {
        console.error("client review delete error", error);
        return errorResponse(500, "REVIEW_DELETE_FAILED", "Impossible de supprimer l’avis.");
      }

      return jsonResponse({ success: true, deleted: true });
    }

    // Suppression par le coach : un/plusieurs avis (reviewIds) ou tous (all: true).
    if (action === "coach-delete") {
      if (!isCoachUser(user)) {
        return errorResponse(403, "FORBIDDEN", "Action réservée au coach.");
      }

      const ids = Array.isArray(payload.reviewIds)
        ? payload.reviewIds.map((id: unknown) => String(id || "").trim()).filter(Boolean)
        : [];
      const deleteAll = payload.all === true;

      if (!ids.length && !deleteAll) {
        return errorResponse(400, "NO_REVIEWS", "Aucun avis à supprimer.");
      }

      let query = supabase.from("client_reviews").delete();
      query = ids.length
        ? query.in("id", ids)
        : query.neq("id", "00000000-0000-0000-0000-000000000000");

      const { error } = await query;
      if (error) {
        console.error("coach review delete error", error);
        return errorResponse(500, "REVIEW_DELETE_FAILED", "Impossible de supprimer les avis.");
      }

      return jsonResponse({ success: true, deleted: true, deletedCount: ids.length || null });
    }

    const message = normalizeMessage(payload.message);
    const rating = normalizeRating(payload.rating);

    if (!message || message.length < 10 || message.length > 200 || rating < 1 || rating > 5) {
      return errorResponse(400, "REVIEW_INVALID", "Avis invalide.");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name,last_name,avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const authorName =
      getProfileName(profile as Record<string, unknown> | null) ||
      String(user.user_metadata?.full_name || "").trim() ||
      user.email ||
      "Athlète";
    const avatarUrl =
      String((profile as Record<string, unknown> | null)?.avatar_url || "").trim() ||
      String(user.user_metadata?.avatar_url || "").trim();

    const { data, error } = await supabase
      .from("client_reviews")
      .upsert(
        {
          user_id: user.id,
          rating,
          message,
          author_name: authorName,
          avatar_url: avatarUrl,
        },
        { onConflict: "user_id" },
      )
      .select(reviewFields)
      .single();

    if (error || !data) {
      console.error("client review save error", error);
      return errorResponse(500, "REVIEW_SAVE_FAILED", "Impossible d’enregistrer l’avis.");
    }

    return jsonResponse({
      success: true,
      review: serializeReview(data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("client-reviews unexpected error", error);
    const message = String(error instanceof Error ? error.message : error);

    if (message === "AUTH_REQUIRED") {
      return errorResponse(401, "AUTH_REQUIRED", "Connecte-toi à ton compte pour partager ton avis.");
    }

    return errorResponse(500, "UNEXPECTED_ERROR", "Erreur inattendue.");
  }
});
