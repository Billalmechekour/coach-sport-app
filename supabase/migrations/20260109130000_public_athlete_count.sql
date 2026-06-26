-- Public RPC to count the number of athletes (registered profiles).
-- Granted to anon so the public landing page can display it.

create or replace function public.public_athlete_count()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(count(*), 0)::int from public.profiles;
$$;

grant execute on function public.public_athlete_count() to anon;
grant execute on function public.public_athlete_count() to authenticated;
