-- Reconnaît aussi billalmechekour6@gmail.com comme compte coach pour la lecture temps réel.
drop policy if exists "Coach reads all messages" on public.messages;
create policy "Coach reads all messages"
on public.messages
for select
to authenticated
using (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'is_coach'), 'false') = 'true'
  or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_coach'), 'false') = 'true'
  or (auth.jwt() ->> 'email') in ('noreply.hicham.fit@gmail.com', 'billalmechekour6@gmail.com')
);
