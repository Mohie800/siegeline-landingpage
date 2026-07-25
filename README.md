# SIEGELINE RIVALS — landing site

The public website for the game: one marketing page plus the legal and support pages
Google Play requires. Static Astro site, no client-side JavaScript, deployed to
Cloudflare Pages. Plan and rationale: [PLAN.md](PLAN.md).

Standalone app — **not** part of war-game's pnpm workspace. Run everything from this
folder.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # → dist/
pnpm preview        # serve dist/
pnpm typecheck      # astro check
pnpm assets         # re-crop screenshots + regenerate logo/og-image (needs sharp)
pnpm shots <dir>    # screenshot every page, phone + desktop, against a running preview
```

## Layout

```
src/
  config.ts              every value that changes between "planning" and "published"
  i18n/ui.ts             all marketing copy, EN + AR
  data/legal/en/*.md     privacy · terms · account-deletion · support (the documents)
  pages/                 index, [slug] (legal), ar/index, ar/[slug], 404
  components/            Header, Footer, Home, PlayBadge
  layouts/               Base (head/meta/JSON-LD), Legal (document chrome)
  styles/global.css      fonts, theme tokens, .prose
  assets/                logo + screenshots (raw-*.png are the untouched captures)
public/                  fonts, favicon, robots.txt, _headers (CSP + caching)
scripts/                 prepare-assets.mjs, shots.mjs
```

Brand assets come from the game itself: the wordmark is
`unity-client/Assets/Resources/UI/logo-wordmark.png`, the fonts are the same woff2
subsets the client ships, and the screenshots are captures from
`unity-client/Screenshots/`. They are **copied in and committed** — nothing here reads
across into a sibling folder at build time.

## Deploying

The site is plain static output, so it runs anywhere. Both hosts are configured; each
ignores the other's config file.

### Vercel (current target — no DNS migration needed)

`mohyeldeen.dev` runs on Hostinger nameservers (`ns1/ns2.dns-parking.com`) with the apex
and `www` already pointing at Vercel, and `nakama` / `game2` at the game VPS. Cloudflare
custom domains would require moving the whole zone to Cloudflare — not worth the risk to
live backends — so this site takes the one-record route:

1. Import the repo in Vercel (Astro auto-detected: build `pnpm build`, output `dist`).
2. Project → Settings → Domains → add `siegeline.mohyeldeen.dev`.
3. At Hostinger add: `CNAME siegeline → cname.vercel-dns.com`.

`vercel.json` carries the CSP and cache headers there — Vercel does **not** read
`public/_headers`. Keep the two files in sync when either changes.

`vercel.json` is schema-validated on deploy and rejects any unknown key, so it takes no
comments — not even the `"//"` convention. Explain changes here instead.

### Cloudflare

Cloudflare's current dashboard offers two flows. This repo is set up for the newer one:

**Workers Builds** (the screen with a *Deploy command* field):

| Field | Value |
| --- | --- |
| Build command | `pnpm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | repo root (this folder **is** the repo root) |

`wrangler.jsonc` makes it an assets-only Worker — no Worker script, Cloudflare just
serves `dist/`, with `404.html` as the not-found page. It must be committed and pushed,
or the deploy step fails with a missing-configuration error.

**Classic Pages** (the screen with a *Build output directory* field) also works: build
command `pnpm run build`, output directory `dist`, no deploy command — `wrangler.jsonc`
is simply ignored.

Either way `public/_headers` supplies the CSP and cache rules (both flows honour it), and
no adapter is needed while the site is fully static — see PLAN.md §2a for adding
server-rendered routes later.

## Before launch — the TODO list

1. **`src/config.ts`** — confirm `supportEmail` exists and is monitored; set
   `governingLaw`; flip `playLive` to `true` once the Play listing is public.
2. **`src/data/legal/en/terms.md` §11** — replace the visible `TODO — set the governing
   jurisdiction` line. The email address also appears literally in the four documents;
   changing `config.ts` does not rewrite them.
3. **Screenshots** — the current three are Arabic-UI editor captures, chosen because
   they were the best available. Recapture in English at phone aspect for the site, and
   separately for the Play listing (2–8 shots, plus a 1024×500 feature graphic and a
   512×512 icon).
4. **Play badge** — `PlayBadge.astro` draws a generic button. Replace with Google's
   official "Get it on Google Play" badge artwork before linking to a live listing.
5. **Arabic legal pages** — `AR_LEGAL_READY` is `false`, so Arabic pages link to the
   English documents. Add `src/data/legal/ar/*.md` and flip the flag.
6. **Cross-repo work Play requires** (tracked in PLAN.md §6b): an `account_delete` RPC
   in `war-game/apps/meta/`, plus DELETE ACCOUNT / PRIVACY / TERMS rows in
   `unity-client/Assets/Scripts/Ui/SettingsSheet.cs`. When the in-app path ships, set
   `inAppDeletion: true` and update `account-deletion.md`, which currently states
   honestly that only the email route exists.
7. **Store identity** — `unity-client/ProjectSettings` still says
   `com.siegeline.unityslice` / "Siegeline Slice"; the site assumes `com.siegeline.game`.

## Verifying

```bash
pnpm build && pnpm preview --port 4331     # one shell
pnpm shots ./shots                          # another — then look at the images
```

Check by hand before a release: `/privacy` and `/account-deletion` load in a private
window with no app installed (that is how a Play reviewer sees them), the Arabic pages
read right-to-left at 360 px, and no page requests a third-party host.
