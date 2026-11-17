create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  attending boolean not null,
  song text check (char_length(song) <= 120),
  gift_category text check (char_length(gift_category) <= 120)
);

alter table public.rsvps enable row level security;

-- Invitados solo pueden insertar; las respuestas se leen desde el dashboard.
create policy "invitados pueden responder" on public.rsvps
  for insert to anon with check (gift_category is null or attending);

grant insert on public.rsvps to anon;
