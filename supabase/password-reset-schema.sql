-- Hicham-Fit App
-- Custom password reset flow with 6-character alphanumeric codes

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.password_reset_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  verified_at timestamptz,
  consumed_at timestamptz,
  reset_session_hash text,
  reset_session_expires_at timestamptz,
  attempts_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint password_reset_codes_email_lower check (email = lower(email))
);

create index if not exists idx_password_reset_codes_email_created_at
  on public.password_reset_codes (email, created_at desc);

create index if not exists idx_password_reset_codes_user_created_at
  on public.password_reset_codes (user_id, created_at desc);

create index if not exists idx_password_reset_codes_reset_session_hash
  on public.password_reset_codes (reset_session_hash);

drop trigger if exists trg_password_reset_codes_updated_at on public.password_reset_codes;
create trigger trg_password_reset_codes_updated_at
before update on public.password_reset_codes
for each row
execute function public.set_updated_at();

alter table public.password_reset_codes enable row level security;

create or replace function public.find_confirmed_user_by_email(check_email text)
returns table (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  full_name text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    u.id as user_id,
    lower(u.email) as email,
    coalesce(p.first_name, '') as first_name,
    coalesce(p.last_name, '') as last_name,
    nullif(trim(concat_ws(' ', p.first_name, p.last_name)), '') as full_name
  from auth.users u
  left join public.profiles p on p.id = u.id
  where lower(u.email) = lower(trim(check_email))
    and u.email_confirmed_at is not null
    and u.deleted_at is null
  order by u.created_at desc
  limit 1;
$$;

revoke all on function public.find_confirmed_user_by_email(text) from public;
grant execute on function public.find_confirmed_user_by_email(text) to service_role;

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

drop trigger if exists trg_phone_verification_codes_updated_at on public.phone_verification_codes;
create trigger trg_phone_verification_codes_updated_at
before update on public.phone_verification_codes
for each row
execute function public.set_updated_at();

alter table public.phone_verification_codes enable row level security;
