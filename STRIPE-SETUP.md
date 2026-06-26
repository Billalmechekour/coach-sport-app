# Paiement Stripe — mise en place

Le paiement réel des **programmes payants** utilise **Stripe Checkout (page hébergée par Stripe)**.
Le formulaire de carte est sur la page Stripe → aucune donnée de carte ne transite par l'app.

## Architecture

1. **Boutique → « Payer »** : le frontend appelle l'Edge Function `create-checkout-session`.
2. `create-checkout-session` (serveur) calcule les prix depuis un **catalogue serveur** (jamais les
   prix envoyés par le client), crée une **Checkout Session** Stripe et renvoie son URL.
3. Le frontend **redirige** vers la page de paiement Stripe.
4. Après paiement, Stripe **redirige** vers
   `/dashboard?view=shop&checkout=success&session_id=...` (ou `...&checkout=cancel`).
5. Au retour, le frontend appelle `verify-checkout-session` qui **vérifie côté serveur** que le
   paiement est bien `paid`, puis **débloque** les programmes (localStorage `hm-shop-purchased`).

## 1. Créer un compte Stripe + récupérer la clé secrète

- Crée un compte sur https://dashboard.stripe.com
- Reste en **mode Test** (interrupteur en haut à droite).
- Developers → API keys → copie la **Secret key** (`sk_test_...`).

## 2. Donner la clé secrète aux Edge Functions (secret Supabase)

```bash
# depuis le dossier frontend/
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

(Assure-toi aussi que `APP_URL` est défini si tu testes hors localhost — sinon l'origine de la
requête est utilisée automatiquement, ce qui marche en local.)

## 3. Déployer les deux fonctions

```bash
supabase functions deploy create-checkout-session
supabase functions deploy verify-checkout-session
```

## 4. Tester (mode test)

- Carte de test : **4242 4242 4242 4242**, n'importe quelle date future, CVC quelconque, code postal quelconque.
- Boutique → ajoute un programme payant au panier → « Payer » → page Stripe → paie avec la carte test.
- Tu reviens sur la boutique : « Paiement confirmé ✓ », le programme est débloqué dans « Mes programmes ».

## Catalogue de prix (à garder synchronisé)

Les prix font autorité dans `supabase/functions/create-checkout-session/index.ts` (objet
`PRODUCT_CATALOG`, en **centimes**). Si tu changes un prix dans `shopProducts` (frontend),
mets-le à jour aussi dans ce catalogue serveur.

## Pour aller plus loin (production)

- Ajouter un **webhook** `checkout.session.completed` (source de vérité) et stocker les achats dans
  une **table Supabase** plutôt que `localStorage`.
- Passer la clé `sk_live_...` et activer les moyens de paiement voulus dans le Dashboard Stripe.
- Activer les **reçus Stripe** par email (Dashboard → Settings → Customer emails).
