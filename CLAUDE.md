# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Not a source project. Two Canva websites ("Save Page As" exports) for a Spanish-language (es-CO) baby shower invitation, Shrek-themed. No package manager, build, lint, or tests. Not a git repo.

- `Baby Shower Jero copy.html`: saved from `https://pookieversario2.my.canva.site/baby-shower-jero` (landing page, "¡Estas invitado!").
- `Baby Shower Jero.html`: saved from `.../baby-shower-jero/page-5` (event details: date, Saturday 3:00 pm, address, "Trae tu propia poción").
- `SHREK___.TTF`: standalone font file, not referenced by either HTML.

View: `open "Baby Shower Jero.html"` (any browser, works from `file://`; `<base href=".">`).

## Gotchas

- **Asset folders are swapped relative to the HTML.** Both HTML files reference `./Baby Shower Jero_files/...`. The PNGs that `Baby Shower Jero.html` needs actually live in `Baby Shower Jero_files Main/`; the folder `Baby Shower Jero_files/` holds the images for `copy.html`. The JS/CSS bundles are identical in both folders. Fix paths (or rename folders) before expecting images to render.
- HTML is minified Canva output (~700 KB per file, single-line-ish). Edit with targeted `grep`/`sed`/Python, not by reading whole files.
- Visible text is rendered one letter per element (Canva text animation), so grepping for whole words like "Diciembre" in the raw HTML fails; search for fragments or strip tags first.
- Text uses an embedded Canva font (`font-family: YADK34Ssw3U_0`) loaded via `static_font_4.ltr.css`, not the Shrek TTF.
- Pages rely on Canva runtime JS (`*.runtime.js`, `*.vendor.js`) loaded with `integrity=` SRI hashes; modifying those JS files breaks loading unless the `integrity` attribute is removed/updated.
