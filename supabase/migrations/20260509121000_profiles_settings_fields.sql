alter table public.profiles add column if not exists avatar_url text not null default '';
alter table public.profiles add column if not exists phone_number text not null default '';
alter table public.profiles add column if not exists phone_country_code text not null default '';
alter table public.profiles add column if not exists phone_verified_at timestamptz;
alter table public.profiles add column if not exists address_line1 text not null default '';
alter table public.profiles add column if not exists address_line2 text not null default '';
alter table public.profiles add column if not exists postal_code text not null default '';
alter table public.profiles add column if not exists city text not null default '';
alter table public.profiles add column if not exists region text not null default '';
alter table public.profiles add column if not exists sport_goal_custom text not null default '';
alter table public.profiles add column if not exists has_no_supplement boolean not null default false;
alter table public.profiles add column if not exists dietary_supplements jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists has_no_injury boolean not null default false;
alter table public.profiles add column if not exists injury_history jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists has_no_medical_information boolean not null default false;
alter table public.profiles add column if not exists medical_information jsonb not null default '[]'::jsonb;

do $$
begin
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
end;
$$;
