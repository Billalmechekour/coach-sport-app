-- Temps réel de la messagerie.

-- Le coach (identifié par son marqueur is_coach, ou l'email coach) peut LIRE tous les messages.
-- Les athlètes gardent uniquement l'accès à leur propre conversation (policy existante).
-- => en temps réel, seul le coach reçoit toutes les conversations ; aucune fuite côté athlètes.
drop policy if exists "Coach reads all messages" on public.messages;
create policy "Coach reads all messages"
on public.messages
for select
to authenticated
using (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'is_coach'), 'false') = 'true'
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_coach'), 'false') = 'true'
  or (auth.jwt() ->> 'email') = 'noreply.hicham.fit@gmail.com'
);

-- Active la diffusion temps réel (Realtime) sur la table messages, sans échouer si déjà activée.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
