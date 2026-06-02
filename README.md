# Cadence

A calm **focus timer and deep‑work journal**, built with **Expo** (iOS / Android / Web).
It’s for doing one thing at a time: set an intention, focus for a set block, and log a one‑tap
reflection. Over time it quietly shows you how much focused work you’ve done, your streak, and
when you focus best.

The UI follows an Apple‑style design language — *the interface recedes so the work is the loudest
thing on screen*. During a session the screen settles into a near‑black canvas with a single blue
progress ring; everywhere else is bright, low‑density, and built from one quiet accent.

> Everything stays on your device. No account, no network, no tracking — it works fully offline,
> which also makes it instant to demo.

## Why it’s useful

- **Single‑tasking by design.** One intention, one timer, one calm screen. No feeds, no lists.
- **A settle‑in breath.** An optional paced breathing pause (an expanding orb, *breathe in / out*)
  before each block helps you actually start.
- **Reflection, not just timing.** After each block you tag how it went (Scattered / Okay / In
  flow). That turns the timer into a lightweight record of *what* you focused on and how it felt.
- **Insights that matter.** Focused time today and this week, a day streak, a 7‑day chart, your
  best part of the day, and a scrollable journal of past blocks.

## Interesting / refined details

- A live SVG **progress ring** depletes as the block runs; the remaining time is set in the rare
  weight‑300 display face with tabular figures so the digits never jitter.
- The session screen is a **distraction‑free near‑black mode**; the header disappears entirely.
- **Haptics** on start, each breath, and completion (a no‑op on web / when disabled).
- Mood is shown using **only the single blue accent** — filled → ring → hairline — never a second
  color, true to the system.
- State is **persisted locally** (AsyncStorage on device, localStorage on web).

## Design system → code

Tokens are transcribed once and referenced everywhere (no inline hex):

| Concern | Source | Used by |
|---|---|---|
| Colors (single Action‑Blue accent) | `src/theme/tokens.ts` | every component |
| Typography ladder (Inter 300/400/600/700) | `src/theme/typography.ts` → `type` | `Txt` primitive |
| Spacing (8px base) / radius / the one product‑shadow | `src/theme/tokens.ts` | layout |
| Breakpoints (480/640/734/833/1068/1440) | `src/theme/responsive.ts` → `useLayout` | responsive sizing |

Component grammar reused from the spec: the **true‑black global‑nav** (`AppHeader`), **pill
chips** with a 2px Focus‑Blue selected state (`Chip`), **hairline utility cards** with no shadow
(`Card`), **blue pill / ghost‑pill / circular** controls (`Buttons`), and the system‑wide
`scale(0.95)` press micro‑interaction. Body copy runs at 17px, headlines at weight 600 with
negative tracking, weight 500 is deliberately absent, and the single drop‑shadow is reserved for
nothing but a resting surface.

## Run it

```bash
npm install
npx expo start          # press i / a, or scan the QR with Expo Go on your phone
npx expo start --web    # open in a browser
```

Requires Node 18+. Targets Expo SDK 56 (React Native 0.85, React 19).

### Project layout

```
App.tsx                 # fonts, store provider, routing, immersive header logic
src/theme/              # tokens, typography ladder, responsive breakpoints
src/state/              # local store (AsyncStorage), insights math, countdown hook, haptics
src/components/         # AppHeader, Ring, BreathingOrb, Chip, Card, WeekChart, SessionRow, …
src/screens/            # FocusScreen, InsightsScreen, SettingsScreen
```

## Deploy (web)

The app exports to a static site you can host anywhere. Build locally with:

```bash
npm run build:web        # outputs to ./dist
```

`./dist` is a plain static folder (`index.html` + `_expo/` assets). The committed `app.json` keeps
**root‑relative** asset paths, so any root‑domain host works out of the box.

### GitHub Pages (zero external service)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. One‑time setup:
**repo → Settings → Pages → Source: “GitHub Actions.”** The site goes live at
`https://<you>.github.io/<repo>/`.

Because a project repo is served under a sub‑path (e.g. `/claude_auto/`), the workflow injects that
base path into `app.json` **at build time** via Expo’s `experiments.baseUrl`, so assets resolve.
The committed config is left root‑relative. It also writes a `404.html` SPA fallback and a
`.nojekyll` file (so the `_expo/` folder isn’t stripped).

### Vercel / Netlify / Cloudflare Pages (connect the repo)

These serve at the domain root, so no base path is needed:

- **Vercel** — `vercel.json` is included (build `npx expo export --platform web`, output `dist`).
- **Netlify** — `netlify.toml` is included (same build/publish + SPA redirect).
- **Cloudflare Pages** — Build command `npx expo export --platform web`, Output directory `dist`.

> Deploying the web export to a **sub‑path** on a host other than GitHub Pages? Set
> `experiments.baseUrl` in `app.json` to that path before building.

## Notes

- Fonts are imported per‑weight from `@expo-google-fonts/inter/<weight>` so Metro bundles only the
  four faces in use.
- The countdown derives remaining time from an absolute end timestamp, so it stays accurate across
  re‑renders and brief backgrounding.
