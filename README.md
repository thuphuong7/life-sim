# Life Sim

A gamified life-plan tracker. It turns a real five-year plan (a baker job in Vancouver → Canadian permanent residence → working holidays abroad) into a board game with quests, XP, a route map, weekly challenges and a French exam tracker for **TCF Canada**.

The interface is in Vietnamese; the code and this README are in English.

## What it does

| View | What you can do |
|---|---|
| **Hôm nay** (Today) | See today's schedule. Every French slot links to the right learning app; marking it done opens the proof form. Study outside the schedule, this week's challenges, grammar points due for review, next quests. |
| **Focus screen** (`#focus`, `#checkin`) | Landing page for a phone automation that asks "anything urgent?" before you start scrolling. Counts every time you choose focus over scrolling. |
| **Bản đồ** (Map) | SVG route board of ten milestones. Two stations re-date themselves from logged data: work-experience hours (1,560 needed, capped at 30 h/week) and French study hours. CRS score bar against 2026 draw cut-offs. |
| **Tiếng Pháp** (French) | The four TCF Canada tests with IRCC's score → NCLC conversion; 30 grammar points (A2–B2) with 3-star mastery and spaced review after 2, 7 and 21 days; 17 vocabulary themes; an error log that ranks weak points; mock-test log; roadmap; curated immersion links. |
| **Nhiệm vụ** (Quests) | Tabbed quest log, completion history by date (`#history`) with undo, weekly hours log with a projection, a filterable catalogue of courses. |
| **Thêm** (More) | Weekly schedule, cash-goal calculator, skill tree, achievements, phone setup guide, settings, backup (copy / download / import JSON), sources. |

**Proof before points.** Nothing completes on a single tap. Quests, weekly challenges and study sessions open a submit form that needs a short description or an https link as proof; XP is added only when the player confirms. Every completion goes into a dated history with a two-step undo that removes its XP and logged minutes.

## Tech

- **React 18 + TypeScript** (strict, no `any` outside the migration boundary) built with **Vite 5**. No UI library: one stylesheet with design tokens and `light-dark()` for dark mode.
- **Two builds from one codebase**
  - `npm run build` → a static site in `docs/`, served by GitHub Pages. Installable as a **PWA** (manifest + network-first service worker). Data lives in `localStorage`, with JSON export and import.
  - `npm run build:artifact` → one self-contained HTML file (via `vite-plugin-singlefile`) for a claude.ai artifact, where progress syncs across devices through the artifact database.
- Accessibility: real buttons and links, 44 px targets, visible focus ring, `aria-current` navigation, reduced-motion support.

## Architecture

```
src/
  data/         content only: plan.ts (quests, schedule, map), french.ts (TCF format, grammar, vocab, links), content.json
  lib/
    dates.ts    local-date helpers (ISO keys, weeks start on Monday)
    calc.ts     pure functions: XP, ranks, projections, NCLC conversion, streaks, spaced review
    storage.ts  schema migration (v1 → v2) and the storage adapters
    store.ts    useStore() React hook: local-first writes, debounced remote sync
    actions.ts  small mutations shared by several views
  components/   HUD, route board, UI pieces (Meter, Tabs, Stars, Icon)
  views/        Today, Focus, MapView, French, Quests, More
```

**State** is one JSON document (`Save`, schema v3). `migrate()` accepts anything (an old v1/v2 save, a hand-edited backup, garbage) and returns a complete v3 document, so every view can trust its shape. One-tap checkmarks from v1/v2 become history entries flagged as unproven, worth 0 XP. XP is the sum of confirmed history entries, nothing else. Every change is written to `localStorage` at once and, when running as an artifact, pushed to the remote document after a 700 ms debounce, with writes chained so they land in order. On load, the copy with the newer `updated` timestamp wins.

**Projections** use the average of the last four logged weeks, falling back to the planned hours in settings until there is data.

## Run it

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # static site → docs/
npm run build:artifact   # single file → dist-artifact/index.html
```

## Deploy to GitHub Pages

1. Run `npm run build` and commit the `docs/` folder.
2. In the repository: **Settings → Pages → Deploy from a branch → `main` / `/docs`**.
3. Each push to `main` republishes the site.

## Make it yours

Everything personal is in `src/data/`: names, dates, quests, schedule and links. Replace those files before publishing the site; the engine does not need to change.

## Credits

Built with Claude (Anthropic) as a pair programmer. Exam formats, score tables and fees were checked against official pages in November 2026; the in-app Sources list links each one.
