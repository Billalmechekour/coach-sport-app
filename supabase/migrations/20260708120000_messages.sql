-- Messagerie coach ⇄ athlète. Chaque message appartient à une conversation identifiée par l'athlète.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null,                                  -- l'athlète de la conversation
  sender text not null check (sender in ('athlete', 'coach')),
  kind text not null default 'text',                         -- text | image | file | voice
  body text not null default '',                             -- texte du message (ou libellé de la pièce jointe)
  read_by_coach boolean not null default false,
  read_by_athlete boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_athlete_created
  on public.messages (athlete_id, created_at asc);

alter table public.messages enable row level security;

-- L'athlète peut lire sa propre conversation. Les écritures et la vue « coach » passent par la
-- fonction edge `messages` (service role) après vérification de l'identité.
drop policy if exists "Athlete reads own conversation" on public.messages;
create policy "Athlete reads own conversation"
on public.messages
for select
to authenticated
using (athlete_id = auth.uid());
