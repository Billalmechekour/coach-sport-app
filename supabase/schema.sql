-- Hicham-Fit App - Supabase SQL setup
-- Execute this script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  full_name text generated always as (trim(first_name || ' ' || last_name)) stored,
  date_of_birth date,
  sex text not null default '',
  country_code text not null default '',
  avatar_url text not null default '',
  phone_number text not null default '',
  phone_country_code text not null default '',
  phone_verified_at timestamptz,
  address_line1 text not null default '',
  address_line2 text not null default '',
  postal_code text not null default '',
  city text not null default '',
  region text not null default '',
  height_cm integer,
  current_weight_kg numeric(5,2),
  has_no_sport boolean not null default false,
  sport_practices jsonb not null default '[]'::jsonb,
  sport_practiced text not null default '',
  sport_level text not null default '',
  sport_goal text not null default '',
  sport_goal_custom text not null default '',
  sessions_per_week integer,
  injuries text not null default '',
  remarks text not null default '',
  has_no_supplement boolean not null default false,
  dietary_supplements jsonb not null default '[]'::jsonb,
  has_no_injury boolean not null default false,
  injury_history jsonb not null default '[]'::jsonb,
  has_no_medical_information boolean not null default false,
  medical_information jsonb not null default '[]'::jsonb,
  sport_profile_completed_at timestamptz,
  role text not null default 'athlete',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_height_cm_range check (height_cm is null or height_cm between 80 and 260),
  constraint profiles_current_weight_kg_range check (current_weight_kg is null or current_weight_kg between 25 and 350),
  constraint profiles_sessions_per_week_range check (sessions_per_week is null or sessions_per_week between 0 and 21),
  constraint profiles_sport_practices_array check (jsonb_typeof(sport_practices) = 'array'),
  constraint profiles_dietary_supplements_array check (jsonb_typeof(dietary_supplements) = 'array'),
  constraint profiles_injury_history_array check (jsonb_typeof(injury_history) = 'array'),
  constraint profiles_medical_information_array check (jsonb_typeof(medical_information) = 'array'),
  constraint profiles_sport_level_allowed check (sport_level in ('', 'beginner', 'intermediate', 'advanced')),
  constraint profiles_sport_goal_allowed check (
    sport_goal in (
      '',
      'weight_loss',
      'fat_loss_cut',
      'muscle_hypertrophy',
      'vascular_hypertrophy',
      'mobility',
      'strength',
      'body_recomposition',
      'fat_loss',
      'muscle_gain',
      'fitness',
      'performance',
      'maintenance',
      'other'
    )
  )
);

alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists sex text not null default '';
alter table public.profiles add column if not exists country_code text not null default '';
alter table public.profiles add column if not exists avatar_url text not null default '';
alter table public.profiles add column if not exists phone_number text not null default '';
alter table public.profiles add column if not exists phone_country_code text not null default '';
alter table public.profiles add column if not exists phone_verified_at timestamptz;
alter table public.profiles add column if not exists address_line1 text not null default '';
alter table public.profiles add column if not exists address_line2 text not null default '';
alter table public.profiles add column if not exists postal_code text not null default '';
alter table public.profiles add column if not exists city text not null default '';
alter table public.profiles add column if not exists region text not null default '';
alter table public.profiles add column if not exists height_cm integer;
alter table public.profiles add column if not exists current_weight_kg numeric(5,2);
alter table public.profiles add column if not exists has_no_sport boolean not null default false;
alter table public.profiles add column if not exists sport_practices jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists sport_practiced text not null default '';
alter table public.profiles add column if not exists sport_level text not null default '';
alter table public.profiles add column if not exists sport_goal text not null default '';
alter table public.profiles add column if not exists sport_goal_custom text not null default '';
alter table public.profiles add column if not exists sessions_per_week integer;
alter table public.profiles add column if not exists injuries text not null default '';
alter table public.profiles add column if not exists remarks text not null default '';
alter table public.profiles add column if not exists has_no_supplement boolean not null default false;
alter table public.profiles add column if not exists dietary_supplements jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists has_no_injury boolean not null default false;
alter table public.profiles add column if not exists injury_history jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists has_no_medical_information boolean not null default false;
alter table public.profiles add column if not exists medical_information jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists sport_profile_completed_at timestamptz;

alter table public.profiles drop constraint if exists profiles_sport_goal_allowed;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_height_cm_range'
  ) then
    alter table public.profiles
      add constraint profiles_height_cm_range check (height_cm is null or height_cm between 80 and 260);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_current_weight_kg_range'
  ) then
    alter table public.profiles
      add constraint profiles_current_weight_kg_range check (current_weight_kg is null or current_weight_kg between 25 and 350);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sessions_per_week_range'
  ) then
    alter table public.profiles
      add constraint profiles_sessions_per_week_range check (sessions_per_week is null or sessions_per_week between 0 and 21);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sport_practices_array'
  ) then
    alter table public.profiles
      add constraint profiles_sport_practices_array check (jsonb_typeof(sport_practices) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_dietary_supplements_array'
  ) then
    alter table public.profiles
      add constraint profiles_dietary_supplements_array check (jsonb_typeof(dietary_supplements) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_injury_history_array'
  ) then
    alter table public.profiles
      add constraint profiles_injury_history_array check (jsonb_typeof(injury_history) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_medical_information_array'
  ) then
    alter table public.profiles
      add constraint profiles_medical_information_array check (jsonb_typeof(medical_information) = 'array');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sport_level_allowed'
  ) then
    alter table public.profiles
      add constraint profiles_sport_level_allowed check (sport_level in ('', 'beginner', 'intermediate', 'advanced'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sport_goal_allowed'
  ) then
    alter table public.profiles
      add constraint profiles_sport_goal_allowed check (
        sport_goal in (
          '',
          'weight_loss',
          'fat_loss_cut',
          'muscle_hypertrophy',
          'vascular_hypertrophy',
          'mobility',
          'strength',
          'body_recomposition',
          'fat_loss',
          'muscle_gain',
          'fitness',
          'performance',
          'maintenance',
          'other'
        )
      );
  end if;
end;
$$;

create table if not exists public.pending_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_ciphertext text not null,
  password_nonce text not null,
  token_hash text not null unique,
  signup_client_id text,
  first_name text not null default '',
  last_name text not null default '',
  date_of_birth date,
  sex text not null default '',
  country_code text not null default '',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pending_signups_email_lower check (email = lower(email))
);

alter table public.pending_signups add column if not exists signup_client_id text;

create index if not exists idx_pending_signups_email
  on public.pending_signups (email);

create index if not exists idx_pending_signups_token_hash
  on public.pending_signups (token_hash);

create index if not exists idx_pending_signups_signup_client_id
  on public.pending_signups (signup_client_id)
  where signup_client_id is not null;

create table if not exists public.phone_verification_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phone_number text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  verified_at timestamptz,
  consumed_at timestamptz,
  attempts_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint phone_verification_codes_phone_format check (phone_number ~ '^\+[1-9][0-9]{7,14}$')
);

create index if not exists idx_phone_verification_codes_user_phone_created_at
  on public.phone_verification_codes (user_id, phone_number, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_pending_signups_updated_at on public.pending_signups;
create trigger trg_pending_signups_updated_at
before update on public.pending_signups
for each row
execute function public.set_updated_at();

drop trigger if exists trg_phone_verification_codes_updated_at on public.phone_verification_codes;
create trigger trg_phone_verification_codes_updated_at
before update on public.phone_verification_codes
for each row
execute function public.set_updated_at();

create or replace function public.handle_confirmed_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.email_confirmed_at is not null then
    return new;
  end if;

  insert into public.profiles (id, first_name, last_name, date_of_birth, sex, country_code, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'date_of_birth', '') ~ '^\d{4}-\d{2}-\d{2}$'
      then (new.raw_user_meta_data ->> 'date_of_birth')::date
      else null
    end,
    coalesce(new.raw_user_meta_data ->> 'sex', ''),
    coalesce(new.raw_user_meta_data ->> 'country_code', ''),
    'athlete'
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    date_of_birth = excluded.date_of_birth,
    sex = excluded.sex,
    country_code = excluded.country_code,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
after insert or update of email_confirmed_at on auth.users
for each row execute function public.handle_confirmed_user();

create or replace function public.email_exists(check_email text)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return exists (
    select 1
    from auth.users
    where lower(email) = lower(check_email)
  );
end;
$$;

revoke all on function public.email_exists(text) from public;
grant execute on function public.email_exists(text) to anon;
grant execute on function public.email_exists(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.pending_signups enable row level security;
alter table public.phone_verification_codes enable row level security;

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

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
