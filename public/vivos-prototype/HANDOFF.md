# VivOS — Claude Code Handoff

You are porting a redesigned front-end ("VivOS") into Vivian's existing **Next.js** personal site.
A working **HTML/React prototype** of the target design already exists — treat it as the source of truth
for layout, interaction, and visual system. Your job is to re-implement it natively in the Next.js app
**without changing any backend behavior**, plus build **one** small new backend feature (recommendations).

---

## 0. Read these first (the prototype)

The prototype is plain React (via in-browser Babel). Read it to understand exactly what to build:

- `VivOS.html` — global CSS / design tokens / boot, dock, menubar, window styles
- `os/data.jsx` — content + the **app registry** (`APPS`), recommendations data (`PICKS`), commands
- `os/kit.jsx` — window chrome, drag logic, the WebAudio piano synth, toasts + matcha-rain
- `os/apps.jsx` — every app's contents (About, AMA.chat, Piano, Podcast, yap.txt, builds, picks, terminal)
- `os/chrome.jsx` — menu bar, dock, command palette (⌘K), boot splash
- `os/app.jsx` — the window manager (open/close/focus/z-order/maximize) + Tweaks (day/night, wallpaper, accent)
- `tweaks-panel.jsx`, `assets/avatar.png`

The concept: the site is **"VivOS," a personal operating system** — a desktop you boot into, with draggable
app windows, a dock, a menu bar, and a ⌘K command palette. Each "app" is a section of the old site.

---

## 1. Hard constraints — DO NOT change

This is a **front-end-only** redesign except for the single new feature in §4.

- ❌ Do not modify the Supabase schema for existing tables, auth, or the `questions` flow.
- ❌ Do not change existing API contracts/response shapes, env vars, or `src/utils/supabase.ts`.
- ❌ Do not touch the Spotify embed, the YouTube embeds, the GitHub link, or the lettergen.io link.
- ✅ Keep `questions` (AMA) reading/writing exactly as it does today (`id`, `content`, `answer`).
- ✅ Everything visual/structural in `src/app` and `src/components` is fair game to replace.

If a desired UI needs data that doesn't exist, **flag it** — do not fake it.

---

## 2. Target stack & approach

Existing: **Next.js 15 (app router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase**.

- Convert the prototype's plain JSX into **TypeScript React components** under `src/`.
- Port the prototype CSS. Prefer **CSS variables + a global stylesheet (or CSS modules)** for the OS chrome
  and window system (it's heavily custom); use Tailwind where convenient. Keep the exact tokens in §6.
- The desktop is a **client component** (`"use client"`) — window state, drag, audio, ⌘K all run client-side.
- Load the three Google fonts via `next/font` (Bricolage Grotesque, Space Grotesk, Space Mono).

### Routing
Make the **home route `/` render the VivOS desktop**. The desktop is the whole experience; apps are windows,
not pages. Recommended:
- `/` → `<Desktop/>` (boot splash → opens `about` by default).
- Keep the old routes (`/qa`, `/piano`, `/podcast`, `/blog`) as **thin redirects to `/?app=<id>`** (or delete them)
  so existing links/bookmarks still work. Support an optional `?app=` query param that auto-opens that window.
- Retire `page.tsx`'s bedroom hero and the old components (`LayeredClickableImages`, `ClickableImageLayer`,
  `FloatingCTAButton`, `FloatingHomeButton`) — they're replaced by the OS shell.

---

## 3. Component map (prototype → Next.js)

Suggested structure under `src/`:

```
src/app/
  layout.tsx            // fonts, <html>/<body>, global.css
  page.tsx              // renders <Desktop/> (client)
  globals.css           // ported VivOS tokens + chrome/window/app styles
src/os/
  Desktop.tsx           // window manager: open/close/focus/z/max, ⌘K, command runner, wallpaper
  WindowManager state   // (useReducer or useState array of windows)
  Window.tsx            // title bar (3 lights), drag, maximize, focus; renders the app by id
  MenuBar.tsx           // logo, greeting, "now: <app>", matcha battery, ⌘K, day/night, clock
  Dock.tsx              // app launchers + external links, hover labels, open indicator
  CommandPalette.tsx    // ⌘K fuzzy list of apps + commands (arrow/enter/esc)
  BootSplash.tsx        // greeting + matcha progress bar, click-to-skip
  fx.tsx                // toast + matcha-rain context; synth helpers (WebAudio)
  registry.ts           // APPS array (id, name, icon, accent, default w/h, component)
  data.ts               // piano videos, podcast embed, blog posts, projects, NOW, bio, tabs
src/os/apps/
  AboutApp.tsx          // bio + avatar + facts + chips
  AmaApp.tsx            // chat UI — WIRED TO SUPABASE `questions` (see below)
  PianoApp.tsx          // playable keyboard (WebAudio) + YouTube recordings
  PodcastApp.tsx        // Spotify embed (unchanged URL)
  YapApp.tsx            // blog posts as a notes app
  BuildsApp.tsx         // projects (lettergen.io etc.)
  PicksApp.tsx          // recommendations — FETCHES /api/recommendations (see §4)
  TerminalApp.tsx       // vibesh REPL: help/ls/open/whoami/matcha/chord/theme/neofetch/joke/echo/clear/sudo
```

### AMA.chat must use the real backend
In the prototype `AmaApp` mocks the send. In production, wire it to the existing `questions` table:
- On mount: `supabase.from('questions').select('*').order('id', { ascending: false })`, render each as a
  `you:` bubble (`content`) + `viv:` bubble (`answer`) when an answer exists, else a pending state.
- On submit: `supabase.from('questions').insert([{ content }])` — **same shape as today**. Keep the optimistic
  bubble + "saved to the wall" confirmation.

---

## 4. NEW backend feature — Recommendations (the only backend work)

`PicksApp` shows Vivian's recommendations in four tabs: **matcha · eats · bakeries · classical**.
The prototype uses static demo data; make it real.

### 4a. Supabase table + migration
```sql
create table public.recommendations (
  id          bigint generated always as identity primary key,
  category    text not null check (category in ('matcha','eats','bakeries','classical')),
  name        text not null,
  area        text,                       -- neighborhood/area, or composer/detail for 'classical'
  note        text,                       -- Vivian's one-line take
  rating      smallint check (rating between 1 and 5),
  tag         text,
  sort        int default 0,
  created_at  timestamptz default now()
);

alter table public.recommendations enable row level security;

-- public read
create policy "recs are public" on public.recommendations
  for select using (true);

-- writes: restrict to the service role / authenticated owner only (no public insert).
-- (mirror whatever auth approach the project already uses; do NOT open public writes.)
```
Seed it with the demo rows in `os/data.jsx` (`PICKS`) so the page isn't empty, then Vivian edits in Supabase.

### 4b. API route
`src/app/api/recommendations/route.ts`:
- `GET` → optional `?category=` filter; returns rows ordered by `sort, id`.
- Keep response shape: `{ id, category, name, area, note, rating, tag }[]`.
- (Optional, auth-gated) `POST` to add a pick from the site — only if it fits the project's existing auth;
  otherwise skip and let Vivian add rows in Supabase.

### 4c. Wire the UI
- `PicksApp` fetches `/api/recommendations` (or queries Supabase directly, matching the `questions` pattern),
  groups by `category`, renders the four tabs.
- Matcha tab shows 🍵×rating; other tabs show ★×rating.
- Cover **loading / empty / error** states. Remove the "demo / sample" banner + chips once live.

> ⚠️ This is the **only** place new backend is introduced. Everything else is presentation over existing data.

---

## 5. Behaviors to preserve from the prototype

- **Window manager:** draggable by title bar; click brings to front (z-order); double-click title or green
  light = maximize; red light = close. Cascade new windows. On **mobile (<760px)** windows go near-fullscreen
  and you switch via the dock (one visible at a time by z-order).
- **Dock:** hover label + bounce; dot indicator when an app is open; external links open in a new tab.
- **Menu bar:** live clock, greeting by time of day, "now: <focused app>", ⌘K button, day/night toggle.
- **⌘K command palette:** fuzzy-jump to any app + fun commands (toggle night, rain matcha, play a chord,
  surprise me, tidy desktop, open GitHub). Arrow-key nav, Enter to run, Esc to close.
- **Piano:** clicking keys plays notes via WebAudio (triangle osc, soft attack/decay). Keep `play a chord`.
  *(Nice-to-have: map keyboard letters a/s/d/f… → notes while the piano window is focused.)*
- **Terminal:** the `vibesh` REPL commands listed in §3.
- **Tweaks/Settings:** day/night, wallpaper (mesh / graph-grid / dawn), system accent color. In production
  these can live in a small "settings" app or a menu-bar menu (persist to localStorage).
- **Boot splash** on first load (skippable), then auto-open `about`.
- **Easter eggs / fun:** matcha rain, toast confirmations, the desktop sticky note, equalizer on podcast.
- Respect **`prefers-reduced-motion`** (the prototype already gates animations behind `html.reduced`).

---

## 6. Visual system (tokens — copy exactly)

```
Fonts:  display = Bricolage Grotesque (700/800) · UI/body = Space Grotesk · mono = Space Mono
Day:    --canvas #efe9dc  --win #fffdf8  --ink #211f29  --ink-soft #54505f  --ink-mute #8b8698  --line rgba(33,31,41,.1)
Night:  --canvas #0c0b16  --win #181626  --ink #ecebf6  --ink-soft #b3afc8  --ink-mute #7d7795  --line rgba(255,255,255,.1)
Accents: purple #8a5cf0 · sky #3aa3ff · coral #ff7a9c · amber #f0a020 · matcha #3fb277  (system accent default #8a5cf0)
Radius:  windows 16 · controls 10–12 · pills 999     Shadow: soft multi-layer, stronger on focused window
Wallpaper: blurred radial-gradient color blobs ("mesh"); "grid" adds graph-paper lines; "dawn" = warm gradient
Window lights: close #ff6b6b · min #ffce4d · max #4dd08a     Terminal: dark #0c1018, green-on-dark mono
```

---

## 7. Acceptance criteria

- [ ] `/` boots into VivOS; `about` opens by default; dock + menu bar + ⌘K all work.
- [ ] All six content apps render; **AMA.chat reads & writes the real `questions` table**; Spotify + YouTube
      embeds and the GitHub/lettergen links are unchanged and working.
- [ ] `recommendations` table + `GET /api/recommendations` exist; **picks** renders live data with
      loading/empty/error states; demo banner removed.
- [ ] Windows drag, focus, maximize, close; mobile falls back to fullscreen-by-dock.
- [ ] Day/night + wallpaper + accent work and persist; `prefers-reduced-motion` honored.
- [ ] No changes to existing schema/auth/API shapes. TypeScript builds clean; no console errors.

---

## 8. Suggested commit sequence

1. Fonts + `globals.css` tokens + app shell (`Desktop`, `Window`, `MenuBar`, `Dock`) with one stub app.
2. Window manager (drag/focus/z/max/close) + boot splash + ⌘K palette + fx (toasts/rain/synth).
3. Port apps: About, yap, builds, podcast, piano (with synth), terminal.
4. Wire **AMA.chat** to Supabase `questions` (read + insert).
5. Recommendations: migration + seed + `GET /api/recommendations` + `PicksApp` wiring + states.
6. Tweaks (day/night, wallpaper, accent) + persistence; mobile/responsive + reduced-motion pass.
7. Retire old bedroom components/routes (or convert routes to `?app=` redirects). Final consistency pass.
```
