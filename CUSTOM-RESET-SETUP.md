# Custom Reset Code Setup

Cette version envoie un code de reinitialisation de `6 caracteres alphanumeriques` au lieu de l OTP natif Supabase.

## 1. Executer le SQL

Dans Supabase SQL Editor, execute le fichier :

`supabase/password-reset-schema.sql`

## 2. Ajouter les secrets Edge Functions

Secrets obligatoires :

- `SERVICE_ROLE_KEY`
- `APP_NAME`
- `APP_LOGO_URL`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`

Pour Brevo :

- `BREVO_API_KEY`

Pour Resend :

- `RESEND_API_KEY`

Pour Gmail API :

- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `GMAIL_REFRESH_TOKEN`
- `GMAIL_USER_ID` (optionnel, `me` par defaut)

Exemple Brevo :

```bash
npx supabase secrets set EMAIL_PROVIDER="brevo"
npx supabase secrets set EMAIL_FROM="noreply.hicham.fit@gmail.com"
npx supabase secrets set EMAIL_FROM_NAME="Hicham-Fit App"
npx supabase secrets set BREVO_API_KEY="TA_CLE_API_BREVO"
```

Exemple Gmail API, pour afficher le meme expediteur que l email de confirmation :

```bash
npx supabase secrets set EMAIL_PROVIDER="gmail"
npx supabase secrets set EMAIL_FROM="noreply.hicham.fit@gmail.com"
npx supabase secrets set EMAIL_FROM_NAME="Hicham-Fit App"
npx supabase secrets set GMAIL_CLIENT_ID="TON_CLIENT_ID_GOOGLE"
npx supabase secrets set GMAIL_CLIENT_SECRET="TON_CLIENT_SECRET_GOOGLE"
npx supabase secrets set GMAIL_REFRESH_TOKEN="TON_REFRESH_TOKEN_GOOGLE"
```

## 3. Deployer les fonctions

```bash
npx supabase functions deploy send-reset-code --no-verify-jwt
npx supabase functions deploy verify-reset-code --no-verify-jwt
npx supabase functions deploy complete-reset-password --no-verify-jwt
```

## 4. Flux attendu cote frontend

- L utilisateur saisit son email.
- `send-reset-code` verifie que le compte existe et envoie un code par email.
- Le code est valide `3 minutes`.
- Si le code est correct, `verify-reset-code` retourne un `resetToken`.
- `complete-reset-password` met a jour le mot de passe.

## 5. Important

Supabase Edge Functions ne sont pas ideales pour SMTP direct avec nodemailer. Cette version utilise donc Brevo, Resend ou Gmail API par HTTP, plus fiable en production.
