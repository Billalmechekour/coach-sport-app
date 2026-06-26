create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.client_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null,
  message text not null,
  author_name text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_reviews_user_unique unique (user_id),
  constraint client_reviews_rating_range check (rating between 1 and 5),
  constraint client_reviews_message_length check (char_length(trim(message)) between 10 and 200)
);

create index if not exists idx_client_reviews_updated_at
  on public.client_reviews (updated_at desc);

drop trigger if exists trg_client_reviews_updated_at on public.client_reviews;
create trigger trg_client_reviews_updated_at
before update on public.client_reviews
for each row
execute function public.set_updated_at();

alter table public.client_reviews enable row level security;

drop policy if exists "Anyone can view client reviews" on public.client_reviews;
create policy "Anyone can view client reviews"
on public.client_reviews
for select
to anon, authenticated
using (true);

drop policy if exists "Users can insert own review" on public.client_reviews;
create policy "Users can insert own review"
on public.client_reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own review" on public.client_reviews;
create policy "Users can update own review"
on public.client_reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own review" on public.client_reviews;
create policy "Users can delete own review"
on public.client_reviews
for delete
to authenticated
using (auth.uid() = user_id);
