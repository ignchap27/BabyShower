# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Spanish-language (es-CO) Shrek-themed baby shower invitation for Jerónimo, rebuilt from a Canva Site (`https://pookieversario2.my.canva.site/baby-shower-jero`) as a Vite + React app in `web/`. RSVPs (incl. gift-category vote) go to Supabase table `rsvps` (project ref `mfkgssxzghoupureyrsb`, MCP configured in `.mcp.json`).

- `web/`: the app. `cd web && npm run dev` / `npm run build`. Env in `web/.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; anon/publishable key only, never service_role).
- `web/supabase.sql`: table + RLS (anon may insert only, no select).
- `web/public/assets/`: renamed assets by content — `personajes/`, `decoracion/`, `letras/` (Shrek-style letter PNGs, unused fallback), `fuentes/` (`shrek.ttf` titles, `canva-gotica.woff` body = Canva font `YADK34Ssw3U_0`), `audio/musica.mp3` (extracted from Canva bg video).
- `canva-export/`: original Canva "Save Page As" files, reference only. Asset folders there are swapped relative to the HTML (`_files Main` belongs to `Baby Shower Jero.html`). HTML is minified with one-letter-per-element text; grep fragments.

## Product rules

- Music loops continuously the whole visit; no music/mute button (starts on first gesture since autoplay is blocked).
- Flow: envelope → details (scroll) → RSVP (name, attending, song, gift category if attending) → thanks.
