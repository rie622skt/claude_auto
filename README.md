# NOVA Watch

A fictional premium‑smartwatch product site, built with **Expo** (iOS / Android / Web) to
demonstrate an Apple‑style design language: *reverent product presentation framed by
near‑invisible UI*. Edge‑to‑edge tiles alternate light and dark, a single blue accent carries
every interactive element, and the product — here a **live, vector watch that tracks your real
clock** — is always the loudest thing on the screen.

> Everything is generated in code (no photography pipeline). The watch is an SVG render whose
> hands move with the device clock and whose case, band, and face update the instant you change
> a configurator option.

## What's interesting about it

- **A live watch render.** `WatchRender` draws an Apple‑Watch‑style cushion case, band, and OLED
  face in pure SVG. The hour/minute/second hands track `Date` every second; the Modular face
  even fills a single‑accent ring with the fraction of the day elapsed.
- **A real configurator.** On the *Configure* surface, pick **size · case · band style · band
  color · watch face** from pill chips. The preview watch and the running price total update
  live, and a frosted floating bar pins **Add to Bag** to the bottom of the viewport.
- **Three surfaces, one design language.** *Overview* (alternating full‑bleed tiles),
  *Configure* (chips + sticky price bar), and *Accessories* (pill search + responsive utility‑card
  grid) all share the same type ladder, spacing rhythm, and single Action‑Blue accent.

## Design system → code

The supplied design tokens are transcribed once and referenced everywhere (no inline hex):

| Concern | Token source | Where |
|---|---|---|
| Colors | `src/theme/tokens.ts` → `colors` | every component |
| Typography ladder (Inter 300/400/600/700) | `src/theme/typography.ts` → `type` | `Txt` primitive |
| Spacing (8px base) / radius / the single product‑shadow | `src/theme/tokens.ts` | layout + `WatchRender` |
| Breakpoints (480/640/734/833/1068/1440) | `src/theme/responsive.ts` → `useLayout` | responsive sizing |

Component mapping to the spec:

- `product-tile-light / parchment / dark / dark2 / dark3` → `ProductTile`
- `button-primary`, `button-secondary-pill`, `button-store-hero`, `button-dark-utility`,
  `text-link(-on-dark)` → `Buttons.tsx` (all share the `scale(0.95)` press micro‑interaction)
- `global-nav` (true‑black, collapses to a hamburger ≤ 833px) → `GlobalNav`
- `sub-nav-frosted` + `floating-sticky-bar` (parchment @ 80% + `expo-blur`) → `SubNav`, `FloatingBar`
- `configurator-option-chip(-selected)` → `OptionChip`
- `store-utility-card` (hairline, 18px radius, no shadow) → `StoreCard`
- `search-input` (pill) → `SearchInput`
- `footer` (dense 2.41‑leading link columns) → `Footer`

Faithful details: body copy runs at **17px**, headlines sit at **weight 600** with negative
tracking, the **2.41** footer leading is preserved, the **one** drop‑shadow is reserved for the
watch render only, and the weight ladder deliberately skips 500.

## Run it

```bash
npm install
npx expo start          # then press i / a, or scan the QR with Expo Go on your phone
npx expo start --web    # open in a browser
```

Requires Node 18+. The project targets Expo SDK 56 (React Native 0.85, React 19).

### Project layout

```
App.tsx                     # fonts, global state (config / bag), header + screen switching
src/theme/                  # tokens, typography ladder, responsive breakpoints
src/components/             # ProductTile, WatchRender, Buttons, nav, chips, cards, footer, icons
src/screens/                # OverviewScreen, ConfigureScreen, AccessoriesScreen
src/data/                   # catalog (options + accessories) and config/price helpers
```

## Deploy (web)

The app exports to a static site you can host anywhere. Build locally with:

```bash
npm run build:web        # outputs to ./dist
```

`./dist` is a plain static folder (`index.html` + `_expo/` assets). The committed
`app.json` keeps **root‑relative** asset paths, so any root‑domain host works out of the box.

### GitHub Pages (zero external service)

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One‑time setup: **repo → Settings → Pages → Source: “GitHub Actions.”** Then push (or run the
workflow manually). The site goes live at `https://<you>.github.io/<repo>/`.

Because Pages serves a project repo under a sub‑path (e.g. `/claude_auto/`), the workflow injects
that base path into `app.json` **at build time** via Expo’s `experiments.baseUrl`, so assets
resolve correctly. The committed config is left untouched (still root‑relative). It also writes a
`404.html` SPA fallback and a `.nojekyll` file (so the `_expo/` folder isn’t stripped).

### Vercel / Netlify / Cloudflare Pages (connect the repo)

These serve at the domain root, so no base path is needed:

- **Vercel** — `vercel.json` is included (build `npx expo export --platform web`, output `dist`).
- **Netlify** — `netlify.toml` is included (same build/publish + SPA redirect).
- **Cloudflare Pages** — set Build command `npx expo export --platform web`, Output directory `dist`.

> If you deploy the Expo web export to a **sub‑path** on a host other than GitHub Pages, set
> `experiments.baseUrl` in `app.json` to that path (e.g. `"/app"`) before building.

## Notes

- Fonts are imported per‑weight from `@expo-google-fonts/inter/<weight>` so Metro bundles only
  the four faces in use.
- `BlurView` provides the frosted glass on iOS/Web; Android falls back to the parchment‑at‑80%
  tint, which the design names as the base color anyway.
- NOVA Watch is not a real product — it exists to exercise the design system end to end.
