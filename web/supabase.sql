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

-- Conteo agregado por categoría (sin nombres) para el tablero de regalos.
create or replace function public.gift_counts()
returns table (gift_category text, total bigint)
language sql stable security definer set search_path = '' as $$
  select gift_category, count(*) from public.rsvps
  where attending and gift_category is not null
  group by gift_category
$$;
revoke execute on function public.gift_counts() from public;
grant execute on function public.gift_counts() to anon;

-- Acompañantes (+1). Solo se escriben vía confirmar(); anon no lee nada.
create table if not exists public.acompanantes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rsvp_id uuid not null references public.rsvps(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80)
);
create index if not exists acompanantes_rsvp_id_idx on public.acompanantes (rsvp_id);
alter table public.acompanantes enable row level security;
revoke all on public.acompanantes from anon, authenticated;

-- Guarda la respuesta y sus acompañantes en una sola transacción.
create or replace function public.confirmar(
  p_name text, p_attending boolean, p_song text, p_gift text, p_acompanantes text[] default '{}'
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if p_gift is not null and not p_attending then
    raise exception 'regalo solo si asiste';
  end if;
  if cardinality(p_acompanantes) > 10 then
    raise exception 'máximo 10 acompañantes';
  end if;
  insert into public.rsvps (name, attending, song, gift_category)
  values (trim(p_name), p_attending, nullif(trim(p_song), ''), p_gift)
  returning id into v_id;
  if p_attending then
    insert into public.acompanantes (rsvp_id, name)
    select v_id, trim(n) from unnest(p_acompanantes) n where trim(n) <> '';
  end if;
end $$;
revoke execute on function public.confirmar(text, boolean, text, text, text[]) from public;
grant execute on function public.confirmar(text, boolean, text, text, text[]) to anon;

-- Conteo para el anfitrión (dashboard): invitados que asisten + sus acompañantes.
create or replace view public.conteo_asistentes with (security_invoker = true) as
  select
    (select count(*) from public.rsvps where attending) as invitados,
    (select count(*) from public.acompanantes) as acompanantes,
    (select count(*) from public.rsvps where attending)
      + (select count(*) from public.acompanantes) as total;
revoke all on public.conteo_asistentes from anon, authenticated;
