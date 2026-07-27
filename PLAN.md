# Plan — SIEGELINE landing site + Google Play compliance pages

Status: **M0–M3 built** (scaffold, four legal pages EN, marketing page EN + AR, asset
pass) · Written 2026-07-25 · Owner: solo dev (Mohyeldeen)

Remaining: **M4** deploy, **M5** cross-repo account-deletion work, Arabic translations of
the legal documents, and the pre-launch TODO list in [README.md](README.md).

The public website for the game: a short, professional studio-style landing page
plus the legal/support pages Google Play requires before the app can be published.
**Google Play only** — no App Store, no iOS copy anywhere in the content.

---

## 0. Why this app exists here

The `siegeline/` root is now a workspace of independent siblings. This is the
second one:

```
siegeline/
  war-game/       TS monorepo — sim, protocol, game-server (Colyseus), meta (Nakama), admin
  unity-client/   Unity 6 client — the real game client
  landing/        ← this app: public marketing site + Play legal pages (standalone)
```

`landing/` is **not** part of war-game's pnpm workspace. It gets its own
`package.json` and lockfile and can be built, deployed, and later moved out
without touching the game. It only *reads* two things from its siblings: the logo
and curated screenshots (copied in, not symlinked — see §5).

---

## 1. Open decisions (confirm before M1)

| # | Decision | Recommendation | Why it matters |
|---|---|---|---|
| D1 | Domain | `siegeline.mohyeldeen.dev` (DNS + Cloudflare already in use for `nakama.` / `game2.` / `admin.`) | The privacy-policy URL goes into Play Console and should be stable. A dedicated domain (`siegeline.game`) costs money — against the $0 policy in `war-game/costs.md`. |
| D2 | Publisher / studio name shown on the site + Play listing | `Mohyeldeen` (matches Unity `companyName`) | Must match the Play developer account name and the entity named in the ToS. |
| D3 | Contact email for support + legal | a dedicated address, e.g. `support@mohyeldeen.dev` | Play requires a public support email; the deletion request flow needs an inbox that is actually monitored. |
| D4 | Governing law / jurisdiction in the ToS | user's country of residence | ToS is unusable without it. |
| D5 | Arabic at launch? | **Yes** — the logo itself is bilingual and the game is fully AR-localized | Decides whether i18n routing lands in M1 or is retrofitted. |
| D6 | Real-money IAP at launch? | **No** (gems are earned / promo codes today) | Changes the Data Safety form, the ToS virtual-goods section, and whether Play Billing must be integrated. |

---

## 2. Stack

| Layer | Choice | Note |
|---|---|---|
| Framework | **Astro 7** (7.1.3 installed), `output: 'static'` | Zero JS shipped by default; legal pages authored as Markdown; trivial EN/AR routing; static now, dynamic later without a rewrite (§2a). |
| Styling | **Tailwind 4** (`@tailwindcss/vite`) | Same idiom as `war-game/apps/admin`. |
| Content | Astro content collections — `src/data/legal/{en,ar}/*.md` | Legal text stays in Markdown, reviewable as a diff. |
| Images | Astro `<Image>` → WebP variants from committed PNG sources | Screenshots are the page's whole weight budget. |
| Host | **Vercel** (free tier), domain `siegeline.mohyeldeen.dev` | Decided 2026-07-25 on DNS grounds: `mohyeldeen.dev` runs on Hostinger nameservers with the apex + `www` already on Vercel and `nakama`/`game2` on the game VPS. A Cloudflare custom domain needs the whole zone moved to Cloudflare — unacceptable risk to live backends — whereas Vercel needs one new `CNAME siegeline → cname.vercel-dns.com`. `vercel.json` carries CSP + cache headers (Vercel ignores `public/_headers`). |
| Package manager | pnpm, own lockfile | Independent of war-game's workspace. |

Rejected: React+Vite SPA (needless JS for a 5-page brochure), plain hand-written
HTML (duplicating a header/footer across ~14 files EN+AR is where these sites rot).

Note on TypeScript: `astro check` cannot run against TypeScript 7 (the native compiler
does not expose the API the language server needs), so the dev dependency is pinned to
**typescript@6**. Revisit when Astro's tooling supports TS 7.

### 2a. Growth path — adding dynamic content later

Static output is the starting point, not a ceiling. Astro adds server rendering
**per route**, so none of this requires a rewrite:

- Install `@astrojs/vercel` once. Everything stays prerendered until a page opts out.
- Add `export const prerender = false` to the top of any single page or API route
  that needs to run on the server — the rest of the site is still built to static
  HTML. This is how a deletion-request **form** (a real POST endpoint instead of a
  `mailto:`) would land without making the legal pages dynamic.
- **Server islands** (`server:defer`) let one component on an otherwise static page
  render on request — the shape a live leaderboard, player count, or server-status
  badge would take, reading from Nakama.
- **Interactive widgets** can be React components mounted as islands
  (`client:visible`), so the admin-console idiom is still available where it earns
  its bundle.
- Markdown collections make patch notes / a news page a content-authoring job, not
  a CMS integration.

Keep the four legal pages fully static regardless — they must load for a Play
reviewer with no JS, no login, and no server dependency.

---

## 3. Site map

**Marketing (1 page, scroll sections):**

| Section | Content |
|---|---|
| Hero | Bilingual gold wordmark on a dark battlefield backdrop, one-line hook, **Get it on Google Play** badge, "Free to play" |
| What it is | 3 short pillars: real-time 1v1/2v2 sieges · build & upgrade your base · collect and level a 12-unit army |
| Screenshots | 5–6 curated captures in a phone frame, horizontal scroll on mobile |
| Progression | Chests, card levels, trophies, ranked ladder — one paragraph, one image |
| Footer | Studio name, © year, links to Privacy · Terms · Support · Account deletion, support email, language switch |

**Required / supporting pages:**

| Route | Purpose | Play requirement |
|---|---|---|
| `/privacy` | Privacy policy | **Mandatory.** Public, non-geofenced, HTML (not a PDF), not user-editable, names the app. |
| `/account-deletion` | Web request path to delete the account + its data | **Mandatory** for apps that create accounts — and it must exist *outside* the app, reachable in a browser without installing. |
| `/terms` | ToS / EULA — virtual currency, fair play & bans, no cash value, liability, governing law | Not strictly required; strongly recommended once virtual goods exist. |
| `/support` | Contact email, FAQ, how to report a bug/player, response window | Backs the store listing's support contact. |
| `/press` (optional, M4+) | Logo pack, screenshots, fact sheet, boilerplate | Nice-to-have; cheap once assets are curated. |

No cookie banner: the site ships **no analytics and no cookies**. If analytics is
ever added, use a cookieless provider (Cloudflare Web Analytics, Plausible) and add one line
to the privacy policy — don't reach for a consent modal.

---

## 4. Design direction

Keep it sparse and confident — a studio page, not a feature dump. The brand is
already decided by the game's own art; the site should look like the same product.

- **Source of truth for brand:** `unity-client/Assets/Resources/UI/logo-wordmark.png`
  — gold beveled "SIEGELINE" over "خط الحصار", transparent background.
- **Palette:** pull directly from the logo and HUD — gold `#F5C518`-ish primary,
  deep navy panel `#141C2E`-ish, near-black background, white text at ~90%.
  Extract exact values from the PNG + `unity-client/Assets/Scripts/Ui/UiKit.cs`
  rather than inventing new ones.
- **Type:** reuse the game's faces so the page and the app read as one thing —
  **Lilita One** (display, EN) + **Nunito** (body, EN); **Lalezar** (display, AR)
  + **Cairo** (body, AR). Self-host the woff2 (same approach as the game client,
  see the `ui-fonts` note); never fake-bold the display face.
- **Motion:** one subtle parallax/fade on the hero. No autoplaying video, no
  carousels that move on their own.
- **Dark only.** The game has no light theme; a light-mode site would look borrowed.
- **Accessibility:** real text over images (never bake copy into a screenshot),
  AA contrast on gold-on-dark, focus rings intact, `dir="rtl"` correctness in AR.

---

## 5. Asset pipeline

Assets are **copied into `landing/src/assets/`** at curation time and committed.
No build-time reach into `../unity-client` — that would couple two repos that are
meant to separate.

1. **Logo** — trim transparent padding from `logo-wordmark.png` (808 KB), export
   `logo.avif/webp` at 3 widths + a PNG fallback, plus `favicon.svg`,
   `apple-touch-icon.png` (harmless), and a 1200×630 `og-image.png`
   (logo + one screenshot + tagline).
2. **Screenshots for the site** — `unity-client/Screenshots/` holds ~555 editor
   auto-captures (every 5 s while playing, ultrawide game-view aspect). Curate
   5–6 that show: a base at T2/T3, a squad fight, the ranked/home screen, a chest
   reveal, the collection screen. Downscale to ~1600 px wide WebP/AVIF (the
   "don't ship oversized textures" rule applies to the web too — oversized images
   only cost bandwidth here, but 1600 px is the honest ceiling for a phone frame).
3. **Play Store graphics** (separate from the site, produced in the same pass):
   - App icon **512×512** 32-bit PNG
   - Feature graphic **1024×500** PNG/JPG
   - **2–8 phone screenshots** — these must be captured **on a real device at
     phone aspect**, not from the ultrawide editor view. Add a device-capture run
     to the release checklist; the editor captures are for the website only.
   - Short description ≤80 chars, full description ≤4000 chars, EN + AR.
4. Optional `scripts/optimize.mjs` (sharp) so re-running the pass is one command.

---

## 6. Google Play compliance — what the site must carry, and what it can't fix alone

Play's requirements land in three places. **Only the first is web work.**

### 6a. Pages this site must host

- **Privacy policy** covering, at minimum, what the game actually collects today:
  - a **device identifier** (Nakama device authentication creates the account),
  - a **display name** chosen by the player, and their **friends list / challenges**,
  - **gameplay + progression data** (trophies, rank, match history, inventory,
    card levels, gold/gems),
  - **technical logs** from the game server (IP address in transit, error logs).
  It must state: no ads, no analytics SDKs, no data sold, no data shared with
  third parties beyond the hosting provider; data stored on the developer's own
  VPS (Nakama + Postgres); how long data is kept; how to request deletion (link
  to `/account-deletion`); a contact email; a "last updated" date; and the age
  policy (**13+**, not directed at children). Add the Google Sign-In section only
  when account linking actually ships in the Unity client — the policy must
  describe the app as it is, not as it's planned.
- **Account deletion page** — plain instructions + a `mailto:` request (or a
  simple form): what gets deleted (account, profile, inventory, match history,
  leaderboard entries), what is retained and why (e.g. anonymized aggregate match
  logs, fraud/ban records), and the turnaround (state a concrete window, e.g. 30
  days). Must work without installing the app.
- **Terms**, **Support** — as in §3.

### 6b. Work this forces in the other two repos (not web work — track it)

- **In-app account deletion.** Play requires *both* an in-app path and the web
  path. Today there is neither. Needs a Nakama RPC (`account_delete` in
  `war-game/apps/meta/src/`) that wipes the storage collections + leaderboard
  entries and unlinks the device, plus a **DELETE ACCOUNT** row in the Unity
  `SettingsSheet.cs` with a two-step confirm.
- **In-app privacy link.** Play wants a privacy link inside the app as well as in
  the Console — add **PRIVACY** and **TERMS** rows to `SettingsSheet.cs` opening
  the site URLs.
- ~~**Store identity is currently wrong for release.**~~ **DONE 2026-07-25.**
  `unity-client/ProjectSettings` now has `productName: SIEGELINE`,
  `applicationIdentifier.Android: com.siegeline.game`, and `bundleVersion: 0.7.0`
  (versionCode 1). Launcher icons are generated from the logo and assigned to all
  18 Android icon slots. The full submission path now lives in
  `store-listing/CHECKLIST.md`.

### 6c. Console fields to fill at submission (checklist to keep here)

Privacy policy URL · Data safety form (incl. the **data deletion URL** = our
`/account-deletion`) · App access (device auth = no test credentials needed —
say so) · Ads: **none** · Content rating (IARC questionnaire) · Target audience:
**13+**, not child-directed · Financial features: none · Data encrypted in
transit: yes (TLS/WSS) · Government/health/news declarations: no.

⚠️ Play policy changes often. Re-verify the live checklist in Console at
submission time rather than trusting this list.

---

## 7. Internationalization (EN + AR)

- Routes: `/` (EN, default) and `/ar/…`; `<html lang dir>` set per locale;
  `hreflang` alternates for both.
- Legal pages exist in both languages, but the **English version is the canonical
  legal text** — say so in one line at the top of the AR pages (standard practice,
  avoids translation drift becoming a legal problem).
- RTL: mirror layout with Tailwind logical properties (`ps-`/`pe-`/`ms-`/`me-`),
  never hard `left/right`. The gold wordmark is bilingual, so it needs no mirroring.
- Language switch in the footer, preserving the current path.

---

## 8. Milestones

| M | Scope | Done when |
|---|---|---|
| **M0** | Scaffold: Astro + Tailwind + brand tokens + layout shell (header/footer/lang switch) | `pnpm build` emits a static site; header/footer render EN + AR |
| **M1** | **Legal + support pages first** — privacy, account-deletion, terms, support (EN, then AR) | The four URLs are live and quotable in Play Console. *This is the critical path to submitting the app; the marketing page is not.* |
| **M2** | Marketing page: hero, pillars, screenshots, progression, Play badge | Renders well at 360 px, 768 px, 1440 px; no layout shift |
| **M3** | Asset pass: logo exports, 6 curated screenshots, og-image, favicon, Play graphics | All images AVIF/WebP; page weight ≤ 1.2 MB on first load |
| **M4** | Deploy: Vercel project, `CNAME siegeline` at Hostinger, HTTPS, 404 page | The four legal URLs resolve publicly, non-geofenced, no login |
| **M5** | Cross-repo: `account_delete` RPC + Settings rows (delete / privacy / terms) in Unity; store identity fixed | Deletion works end-to-end from both the app and the web page |

M1 before M2 is deliberate: an unpublished game does not need a marketing page,
but it cannot be submitted at all without the policy URLs.

---

## 9. Verification

- `pnpm build` clean; **no client JS** on the legal pages.
- Lighthouse ≥ 95 on Performance / Accessibility / Best Practices / SEO, tested
  at mobile throttling.
- Internal + external link check (the Play badge link 404s until the app is live —
  expected; make it point at the listing only after publication).
- Manual RTL pass on the AR pages at 360 px.
- Confirm from an incognito browser, with no app installed, that `/privacy` and
  `/account-deletion` load — that is exactly how a Play reviewer will check.

## 10. Non-goals

No CMS. No blog. No newsletter signup or lead capture. No App Store / iOS
mentions anywhere. No downloadable APK from the site (Play distribution only).
No account **login** on the website — deletion requests go through email/form,
verified against the in-game player id, so the site stays fully static.
