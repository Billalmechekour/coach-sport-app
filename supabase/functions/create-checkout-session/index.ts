import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
} from "../_shared/reset-helpers.ts";

// Catalogue de prix AUTORITAIRE (côté serveur). Les montants envoyés par le client ne sont JAMAIS
// utilisés : on ne se fie qu'à ce catalogue (en centimes) pour éviter toute manipulation de prix.
// Doit rester synchronisé avec `shopProducts` du frontend (produits « Payant »).
const PRODUCT_CATALOG: Record<string, { name: string; amount: number }> = {
  "fat-loss-program": { name: "Programme Perte de gras", amount: 4900 },
  "mass-gain-plan": { name: "Plan Prise de masse", amount: 3900 },
  "coaching-pack": { name: "Pack coaching transformation", amount: 9900 },
  "ebook-strength": { name: "Ebook Force et technique", amount: 1900 },
  "hiit-burn": { name: "Programme HIIT brûle-graisse", amount: 2900 },
  "powerlifting-plan": { name: "Plan Powerlifting force max", amount: 4500 },
  "nutrition-advanced": { name: "Ebook Nutrition avancée", amount: 2500 },
  "competition-prep": { name: "Pack Préparation compétition", amount: 14900 },
  "full-body-4w": { name: "Programme Full Body 4 semaines", amount: 3500 },
  "shred-8w": { name: "Programme Shred 8 semaines", amount: 5900 },
  "mobility-plan": { name: "Plan Mobilité & Souplesse", amount: 2200 },
  "meal-prep-guide": { name: "Guide Meal Prep", amount: 1800 },
  "home-workout": { name: "Programme Maison sans matériel", amount: 2700 },
  "ebook-recovery": { name: "Ebook Récupération & Sommeil", amount: 1500 },
  "elite-coaching": { name: "Coaching Élite 1-à-1", amount: 19900 },
};
const CURRENCY = "eur";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Méthode non autorisée.");
  }

  try {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!secretKey) {
      return errorResponse(500, "STRIPE_CONFIG_MISSING", "Clé Stripe manquante côté serveur.");
    }

    // Auth : on exige une session valide (comme les autres fonctions du projet).
    const authorization = request.headers.get("Authorization") || "";
    const accessToken = authorization.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return errorResponse(401, "SESSION_REQUIRED", "Session requise.");
    }

    const supabase = createAdminClient();
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user?.id) {
      return errorResponse(401, "SESSION_INVALID", "Session invalide.");
    }
    const user = userData.user;

    const body = await request.json().catch(() => ({}));
    const requestedIds: string[] = Array.isArray(body?.items)
      ? body.items.filter((id: unknown) => typeof id === "string")
      : [];
    // Page de retour après paiement : "shop" (Boutique) ou "programs" (Mes programmes).
    const returnTo = body?.returnTo === "programs" ? "programs" : "shop";

    // On ne garde que les produits PAYANTS connus du catalogue serveur.
    const uniqueIds = Array.from(new Set(requestedIds)).filter((id) => PRODUCT_CATALOG[id]);
    if (!uniqueIds.length) {
      return errorResponse(400, "NO_VALID_ITEMS", "Aucun produit payant valide dans le panier.");
    }

    const appUrl = (
      request.headers.get("origin") ||
      Deno.env.get("APP_URL") ||
      Deno.env.get("SITE_URL") ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");
    if (!appUrl) {
      return errorResponse(500, "APP_URL_MISSING", "URL de l'application manquante.");
    }

    const stripe = new Stripe(secretKey, {
      // @ts-ignore -- la version d'API la plus récente peut ne pas figurer dans les types du SDK installé
      apiVersion: "2026-03-25.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const lineItems = uniqueIds.map((id) => {
      const product = PRODUCT_CATALOG[id];
      return {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: product.amount,
          product_data: { name: product.name, metadata: { product_id: id } },
        },
      };
    });

    const metadata = { user_id: user.id, product_ids: uniqueIds.join(",") };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      metadata,
      payment_intent_data: {
        metadata,
        statement_descriptor: "HICHAM FIT APP",
        statement_descriptor_suffix: "PROG",
      },
      // Génère une VRAIE facture Stripe (numéro + PDF téléchargeable/hébergé) pour ce paiement unique.
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Achat de programmes — Hicham Fit App",
          metadata,
          footer: "Merci pour votre confiance — Hicham Fit App",
          custom_fields: [
            { name: "Application", value: "Hicham Fit App" },
          ],
        },
      },
      custom_text: {
        submit: { message: "Hicham Fit App — Coaching sportif & nutrition" },
      },
      // Adresse de facturation collectée sur la page Stripe (utile pour une facture conforme).
      billing_address_collection: "auto",
      success_url: `${appUrl}/dashboard?view=${returnTo}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?view=${returnTo}&checkout=cancel`,
    });

    return jsonResponse({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("create-checkout-session error", error);
    return errorResponse(
      500,
      "CHECKOUT_CREATE_FAILED",
      `Impossible de créer la session de paiement: ${error?.message || String(error)}`,
    );
  }
});
