# Field Notes — sample editorial publication

A self-contained sample site: a seasonal magazine issue with a lead essay, a
filterable contents list, an archive and a subscribe form. It is a **portfolio
template** — the magazine is fictional and the form sends nothing.

- Sector: Editorial publication / long-form journal
- Stack: static HTML, CSS and vanilla JS. No build step, no webfonts, no CDN.
- Run: `python3 -m http.server 3000` in this folder.
- Files: `index.html`, `styles.css`, `main.js`.

## The brand, as written

| Item | Value |
| --- | --- |
| Name | Field Notes |
| One-liner | Essays on landscape, memory and the places between. |
| Audience | Readers of literary non-fiction; 2,400 subscribers, four issues a year. |
| Tone | First person, specific, unhurried. Never "content". |
| Paper | `#F6F0E4` warm cream, ink `#1D1A15`, rust `#9C3A22`, moss `#5D6650` |
| Type | Iowan Old Style / Palatino / Georgia display; system sans for labels |
| Grid | 1180px page, 66ch measure, hairline rules, no cards with shadows |

### Screen inventory

1. **Masthead** — issue number and season, oversized wordmark, subscription line, section nav.
2. **Lead story** — portrait plate, kicker, headline, standfirst, byline, drop cap, pull quote.
3. **In this issue** — six numbered pieces, filterable by Essays / Walks / Interviews, read times.
4. **Archive** — three cards with landscape photographs.
5. **Subscribe** — the pitch, price, validation and honest "sample" note.
6. **Footer** — repeated nav, sample disclosure.

### Sample content

- Issue 14, Autumn 2026. £18 a year. Six contributors, 2,400 readers.
- Lead: *The long walk home* by Maya Ellis, 6 min, 12 October 2026.
- Contents: *A ferry to nowhere* (9 min), *The last lighthouse keeper* (14), *Salt and signal* (7), *Three bridges, one river* (5), *The mapmaker's daughter* (11).
- Archive: *A cliff in November*, *The wood that moved*, *Notes from the Sound*.

## What to show it for

Pitch this at publishers, writers and small magazines: it demonstrates editorial
hierarchy, a readable measure, real serif typography without webfont weight, a
scroll-linked reading progress bar, full-bleed editorial photography, and a form
with inline validation.

## Motion

A small dependency-free motion layer runs on top of the page. It adds a
scroll-linked reading rail, a parallax lead plate, staggered reveals for the
lead copy, issue rows and archive cards, and a live filter transition when a
section chip or the Walks/Interviews nav links are used. The layer only runs
when `prefers-reduced-motion` is not set; the page stays fully readable and
static without it. `main.js` owns the whole layer.

## Make it yours

- Brand: swap the wordmark, the tagline in `.brand-note`, the palette tokens and `<title>`.
- Pieces: edit the `<li data-kind="essay|walk|interview">` items — the filter reads `data-kind` and the chips need no change.
- Art: photography lives in `assets/`. Keep each `.plate` wrapper's aspect ratio and replace the image files when your own shoot arrives. Credits are in `ASSETS.md`.
- Form: replace the handler in `main.js` with a POST to your provider, and add the endpoint to a CSP if you add one.

## Photography

The site uses four locally hosted Pexels photographs. They are free to use under
the Pexels license; source pages, photographers and the exact crops are listed
in [`ASSETS.md`](ASSETS.md).

## Limits

One page, one issue. There is no article template, pagination, search or CMS;
the reading progress bar measures this page. Good enough to show, not to publish
a magazine on.
