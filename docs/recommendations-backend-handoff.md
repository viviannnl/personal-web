# Backend Hand-off — Recommendations ("picks")

**Status:** Frontend shipped (empty state). Backend **not yet implemented** — this doc is the spec to finish it.
**Owner of the UI:** `src/os/apps/PicksApp.tsx`
**Branch where the redesign lives:** `redesign/vivos-ui-refresh` (PR #2)

---

## 1. Context — what exists today

The site was redesigned into "VivOS," a desktop-OS UI. One window, **`picks`**, is meant to show
Vivian's curated recommendations across four categories: **matcha · eats · bakeries · classical**.

During the redesign the picks backend was **deliberately deferred** because:
- The redesign was scoped front-end-only and a Supabase migration can't be applied from CI.
- The prototype's sample picks looked like placeholders, and we don't ship unverifiable content.

So `PicksApp` currently renders the **real 4-tab structure with an honest "coming soon" empty state** —
no demo rows, no "sample" banner. Your job is to make it live.

This is the **only** new backend work. Everything else in the app is presentation over existing data.

---

## 2. Patterns to follow (already in the repo)

- **Supabase client:** `src/utils/supabase.ts` — `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
  Do **not** change this file or its env var names.
- **Existing table contract (reference, don't touch):** `questions` is read/written as `{ id, content, answer }`.
  The AMA app (`src/os/apps/AmaApp.tsx`) shows the read/insert pattern: `supabase.from('questions').select(...).order('id')`
  and `.insert([{ content }]).select().single()`.
- **Existing API route pattern:** `src/app/api/qa/route.ts` — a thin route that calls Supabase and returns `Response.json(...)`.
  Mirror this for `/api/recommendations`.
- **Tabs + types already defined:** `src/os/data.ts` exports `PICK_TABS` and the
  `PickCategory = 'matcha' | 'eats' | 'bakeries' | 'classical'` union. Reuse them; don't redefine.

---

## 3. Data model — Supabase migration

Create the table (run via Supabase SQL editor or CLI — only Vivian can apply it):

```sql
create table public.recommendations (
  id          bigint generated always as identity primary key,
  category    text not null check (category in ('matcha','eats','bakeries','classical')),
  name        text not null,
  area        text,                       -- neighborhood/area; for 'classical' use composer/detail
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

-- NO public insert/update/delete. Writes happen via the Supabase dashboard
-- (or service_role). Do not open public writes. Mirror the project's existing
-- auth approach if a write path is ever added (see §5).
```

> ⚠️ Do not modify the `questions` schema, auth, or any existing table while doing this.

---

## 4. Seeding — use REAL data only

Seed with **Vivian's actual recommendations**, entered by her in Supabase. **Do not** import the prototype's
sample rows (`Nana's Green Tea`, `Late-night Noodle Co.`, etc.) — they were confirmed to be placeholders.
Until Vivian adds rows, the table stays empty and the UI's empty state shows (that's expected and correct).

Example INSERT shape (one row):

```sql
insert into public.recommendations (category, name, area, note, rating, tag, sort) values
  ('matcha', '<real place>', '<neighborhood>', '<one-line take>', 5, '<short tag>', 0);
```

---

## 5. API route — `src/app/api/recommendations/route.ts`

```ts
import { supabase } from "@/utils/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const category = new URL(req.url).searchParams.get("category"); // optional filter
  let q = supabase
    .from("recommendations")
    .select("id, category, name, area, note, rating, tag")
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
```

- **Response shape (keep stable):** `{ id, category, name, area, note, rating, tag }[]`.
- Order by `sort, id`.
- **POST is optional** and only if it fits the project's existing auth (it currently has none for writes).
  If in doubt, **skip POST** and let Vivian add rows in Supabase.

---

## 6. Frontend wiring — `src/os/apps/PicksApp.tsx`

Replace the current empty-state-only component with real fetching. Keep the tab structure and styling
(classes `.picks`, `.picks-tabs`, `.ptab`, `.picks-list`, `.pick`, `.pick-top`, `.pick-rate`, `.pick-meta`,
`.pick-note`, `.picks-empty` are all already in `globals.css`).

Behavior to implement:
1. On mount (and when the tab changes, or fetch once and group client-side), call
   `GET /api/recommendations` (or query Supabase directly, mirroring `AmaApp`).
2. **Render states** (all three required):
   - **loading** — a short "loading picks…" line.
   - **error** — reuse an error style like AMA's `.ama-state.err`, or add a `.picks-empty` variant.
   - **empty** (category has no rows) — keep the existing honest empty state copy.
3. **Ratings:** matcha tab renders `🍵 × rating`; the other tabs render `★ × rating`
   (the prototype filled the remainder with a dimmed `.pick-rate-off` span — optional but on-brand).
4. **Remove** the "coming soon" copy once a category returns rows. There is **no** demo/sample banner to add.

Row markup reference (matches existing CSS):

```tsx
<div className="pick">
  <div className="pick-top">
    <h3>{it.name}</h3>
    <span className="pick-rate" title={`${it.rating}/5`}>
      {(tab === "matcha" ? "🍵" : "★").repeat(it.rating)}
      <span className="pick-rate-off">{(tab === "matcha" ? "🍵" : "★").repeat(5 - it.rating)}</span>
    </span>
  </div>
  <div className="pick-meta mono">{it.area} · <span className="pick-tag">{it.tag}</span></div>
  <p className="pick-note">“{it.note}”</p>
</div>
```

---

## 7. Hard constraints (do not break)

- Do **not** change the `questions` table/flow, auth, env vars, or `src/utils/supabase.ts`.
- Do **not** open public write access to `recommendations`.
- Do **not** seed or display fabricated/placeholder rows — real data only.
- Do **not** change other API response shapes.
- Keep TypeScript clean and the production build green (`npm run build`).

---

## 8. Acceptance criteria

- [ ] `recommendations` table + RLS exist in Supabase (public read, no public write).
- [ ] `GET /api/recommendations` returns `{ id, category, name, area, note, rating, tag }[]` ordered by `sort, id`;
      `?category=` filters.
- [ ] `picks` window renders **live** data grouped into the four tabs.
- [ ] Matcha shows 🍵×rating; other tabs show ★×rating.
- [ ] **loading / empty / error** states all render correctly; "coming soon" only shows when a category is truly empty.
- [ ] No console errors; `npm run build` passes; no changes to existing schema/auth/API shapes.

---

## 9. Local dev / test

```bash
cd personal-web
npm i
npm run dev           # http://localhost:3000  (open /?app=picks)
# verify the four tabs, then add a test row in Supabase and confirm it appears live
npm run build         # must stay green
```

Deployment note: this Vercel project blocks deploys on CVE-flagged Next.js versions — keep Next.js on a
security-patched release (currently `15.3.9`).
