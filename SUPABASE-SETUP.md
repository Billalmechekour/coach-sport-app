# Setup Supabase - Hicham-Fit App

## 1) Creer le projet Supabase
1. Va sur https://supabase.com
2. Clique sur **New project**
3. Note ton mot de passe DB

## 2) Activer confirmation email
1. Dans Supabase: **Authentication > Providers > Email**
2. Active **Email**
3. Active **Confirm email**

## 3) Configurer les URLs de redirection
Dans **Authentication > URL Configuration**:
- Site URL (local): `http://localhost:5173`
- Additional Redirect URLs:
  - `http://localhost:5173/auth?mode=login`
  - `https://TON-DOMAINE-VERCEL/auth?mode=login`

## 4) Creer la base (table profiles + policies)
1. Ouvre **SQL Editor**
2. Execute le fichier: `supabase/schema.sql`
3. Si tu avais deja execute un ancien script, re-execute `supabase/schema.sql` pour remplacer le trigger et ajouter la fonction `email_exists`.

## 5) Ajouter les cles dans le projet React
1. Copie `.env.example` vers `.env`
2. Remplis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_AUTH_REDIRECT_URL` (optionnel, recommande)

Exemple:
```env
VITE_SUPABASE_URL=https://abcxyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth?mode=login
```

## 6) Lancer le projet
```bash
npm run dev
```

## 7) Test du flux inscription
1. Ouvre `/auth?mode=register`
2. Remplis prenom, nom, email, mot de passe
3. Clique **Creer mon compte**
4. Regarde ton email et clique sur le lien
5. Reviens et connecte-toi

## Important
- Les comptes ne sont plus stockes dans `hm-users` (localStorage).
- L'inscription/connexion passe par Supabase Auth.
- Le profil applicatif `public.profiles` est cree **seulement apres confirmation email** (`email_confirmed_at`).
- Note: Supabase cree quand meme un utilisateur en attente dans `auth.users` au moment du signup (comportement normal de Supabase).
- Si tu vois "Configuration serveur manquante", verifie le fichier `.env`.
