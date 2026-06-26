create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
