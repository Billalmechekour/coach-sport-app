-- Contacts / réseaux sociaux affichés dans le footer, éditables par le coach.
create table if not exists public.site_contacts (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'custom',            -- facebook | tiktok | instagram | whatsapp | youtube | phone | email | website | custom
  label text not null default '',
  value text not null default '',                 -- URL, numéro de téléphone ou email
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_contacts_sort
  on public.site_contacts (sort_order asc, created_at asc);

drop trigger if exists trg_site_contacts_updated_at on public.site_contacts;
create trigger trg_site_contacts_updated_at
before update on public.site_contacts
for each row
execute function public.set_updated_at();

alter table public.site_contacts enable row level security;

-- Lecture publique (footer visible par tous). Les écritures passent uniquement par la
-- fonction edge `site-contacts` (service role) après vérification que l'appelant est le coach.
drop policy if exists "Anyone can view site contacts" on public.site_contacts;
create policy "Anyone can view site contacts"
on public.site_contacts
for select
to anon, authenticated
using (true);
