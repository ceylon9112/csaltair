# Jazz Fest 2026

Production-minded **Expo + React Native + TypeScript** app for festival patrons: lineup, schedule, static map, accessibility hub, ticket snapshots, local reviews, and local reminders — **guest mode only**, **offline-first**, **no backend** in MVP.

**Frase Protection — Annual Alarm System Review** (separate **Vite** SPA for field visits) lives under **`frase-protection-annual-review/`**. See [frase-protection-annual-review/DEPLOY.md](frase-protection-annual-review/DEPLOY.md).

## Stack

| Layer | Choice |
|--------|--------|
| App | Expo SDK 54, React Native 0.81, TypeScript |
| Navigation | Expo Router (file-based) |
| Server state | TanStack Query (bundled content, `staleTime: Infinity`) |
| UI state | Zustand + AsyncStorage persistence |
| Images | `expo-image` |
| Map overlays | `react-native-svg` |
| Notifications | `expo-notifications` (local schedules; remote-ready stub) |
| Gestures | `react-native-gesture-handler` + Reanimated |

## Run

```bash
cd jazz-fest-2026
npm install
npm start
```

Then open in **Expo Go** (iOS/Android) or run `npm run ios` / `npm run android`.

### Web in the browser (recommended: Vite)

The **Expo + Metro + React Native Web** stack can be fragile in some desktop browsers. For a reliable **browser prototype**, use the separate **Vite + React (DOM)** app under `patron-web/`. It imports the same **seed data, types, repositories, Zustand stores, and utilities** (`@/` → repo root) and does **not** use Expo or React Native Web.

```bash
cd jazz-fest-2026
npm install
npm install --prefix patron-web
npm run web:vite
```

Then open **`http://127.0.0.1:5173`** in **Chrome, Edge, or Firefox** (Vite default port). Production bundle: `npm run build:web:vite` → output in `patron-web/dist/`.

**`ERR_CONNECTION_REFUSED` / “refused to connect”:** Nothing is listening yet — the Vite dev server is **not running** or you’re using the **wrong port**. Run **`npm run web:vite`** from `jazz-fest-2026` and **leave that terminal open**, then open **`http://127.0.0.1:5173`** (include **`:5173`**). On Windows you can double‑click **`Start-Vite-Web.cmd`**. See **`patron-web/BROWSER_URL.txt`**.

**“Connection Failed” (other):** (1) Wait until the terminal prints **Local: http://127.0.0.1:5173/**. (2) **Do not use the editor’s embedded Simple Browser** for loopback — use Chrome/Edge, or **`npm run open:vite`** after the server is up.

**Web via Expo + Metro (optional)**

1. Run **`npm run web`**. Expo starts Metro and **opens your system default browser** (`--web` → `openPlatformAsync('desktop')`). Do **not** rely on an embedded IDE “Simple Browser” if it shows **Connection Failed** — it often cannot reach your PC’s loopback.
2. **Use HTTP, not HTTPS.** The local dev server is **`http://127.0.0.1:8081`** (note **`http://`**). If you use **`https://`** or a mangled URL like **`https://ttp//127.0.0.1:8081`**, the browser shows **`ERR_NAME_NOT_RESOLVED`**. There is no `s` in `http` for localhost Metro.
3. Quick copy: see **`DEV_SERVER_URL.txt`** in this folder, or run **`npm run open`** after Metro is listening (opens the same URL in your default browser).
4. If the browser didn’t open, paste the URL from the terminal line **`Waiting on http://…`**. With `--localhost`, Expo uses **`127.0.0.1`**, not `localhost`, in many places — try **`http://127.0.0.1:8081`** first, then **`http://localhost:8081`**.
5. If **`localhost` / `127.0.0.1` still fail** (VPN, proxy, IPv6-only `localhost`, or sandboxed browser): run **`npm run web:tunnel`** and open the **https://…** URL Expo prints (ngrok). Requires internet.
6. Alternative: **`npm run web:lan`** — use the **LAN IP** (`http://192.168.x.x:8081`) from the terminal on another device on the same network.

**Why “Connection Failed” happens:** nothing is listening (wrong port / server not started), or the browser cannot reach the host’s loopback (embedded browser, strict firewall). **Fix:** use the URL from the terminal, **`127.0.0.1`**, **system browser**, or **tunnel**.

**Blank screen / “nothing loads” (web):** Expo Router’s root `SafeAreaProvider` uses a **0×0 frame** on web. React Navigation’s **native stack** (`NativeStackView`) calls `useSafeAreaFrame()` for sizing, so the UI can render with **zero height** (white page). The app wraps the root **`Stack` in a second `SafeAreaProvider` on web only**, with metrics from `useWindowDimensions()`, so the stack gets a real viewport frame. The root layout also uses a plain **`View`** on web instead of `GestureHandlerRootView` to avoid extra layout quirks. If the UI still fails, open the browser **Console** (F12) for errors and try `npm run web:tunnel`.

**Project path:** The repo lives under **`salt air` (space in the path).** Some tools behave badly with spaces; if you see odd Metro/Expo issues, clone or move the project to a path **without spaces** (e.g. `C:\dev\jazz-fest-2026`).

**Static web export (`web.output: "static"`)** was removed from `app.json` because this app has dynamic routes (`[id]`) without `generateStaticParams`; that combination can break local web preview. Re-enable static output only when you add `generateStaticParams` for those routes, then use `npx expo export --platform web` for production.

## Beta testing and prototypes

**Current app version:** `1.0.0-beta.1` (see `app.json` / `package.json`). Native IDs: **`com.saltair.jazzfest2026`** (iOS bundle ID + Android application ID).

1. **Fastest — Expo Go (no store):** Run **`npm start`**, scan the QR code with Expo Go (same SDK 54). Good for internal smoke tests; push notifications and some native behavior differ from a release build.

2. **Web prototype — static export:** Run **`npm run export:web`** → output in **`dist-web/`**. Deploy that folder to any static host (Netlify, Vercel, S3, GitHub Pages). Open the site over **HTTPS** on the host; no Metro URL confusion.

3. **Installable Android/iOS (TestFlight / internal / APK sideload):** Use [EAS Build](https://docs.expo.dev/build/introduction/). One-time setup:
   - `npm install`
   - `npx eas-cli login` and `npx eas-cli init` (links the project and adds `extra.eas.projectId` in `app.json`; or install **`eas-cli`** globally and use `eas login` / `eas init`)
   - **`npm run build:android:preview`** — internal **APK** (`preview` profile in `eas.json`) for sideloading or Play internal testing  
   - **`npm run build:ios:preview`** — iOS internal/TestFlight (requires Apple Developer Program)

4. **Gate before sharing builds:** **`npm run beta:check`** runs tests, TypeScript, ESLint, and `expo-doctor`.

If the project path contains **spaces** (e.g. `salt air`), prefer moving the repo to a path **without spaces** before relying on Metro or EAS locally on Windows.

## Scripts

- `npm start` — Expo dev server  
- `npm run web` — Web dev (localhost) + opens browser  
- `npm run web:lan` — Web dev, LAN URL (for devices on same network)  
- `npm run web:tunnel` — Web dev via **HTTPS tunnel** (works when localhost is blocked)  
- `npm run web:vite` — **Vite** dev server for browser (`patron-web/`, port **5173**)  
- `npm run build:web:vite` — Production **Vite** bundle → **`patron-web/dist/`**  
- `npm run export:web` — Expo **Metro** web export → **`dist-web/`**  
- `npm run beta:check` — Tests + `tsc` + lint + `expo-doctor` (pre-beta sanity)  
- `npm run build:android:preview` / `npm run build:ios:preview` — EAS preview builds (after `eas init`)  
- `npm run test` — Jest (e.g. overlap utilities)  
- `npm run lint` — ESLint (Expo config)

## Offline-first model

1. **Content** ships as typed **seed modules** under `data/seed/` and is loaded through `ContentRepository` (`services/content/ContentRepository.ts`).  
2. TanStack Query hydrates once per session with `staleTime: Infinity` so lineup, map metadata, tickets, info, and alerts behave like a cached bundle.  
3. **No network** is required for core flows after the JS bundle loads.  
4. **Last synced** time is stored in preferences (`store/preferencesStore.ts`) when the content query resolves (simulates a future CDN/API sync).  
5. **User data** (saved schedule, reviews, notification IDs map) lives in **AsyncStorage** via Zustand persist.

### Swapping mock data for remote JSON later

1. Add a fetch (or file read) in `ContentRepository.getBundle()` that returns `ContentBundle` (`types/models.ts`).  
2. Optionally validate with Zod against the same shapes.  
3. Persist the last good bundle to AsyncStorage if you want cold-start offline; re-query TanStack Query on foreground.  
4. Replace or extend files in `data/seed/` as the authoring source until CMS is live.

## Local reviews (MVP)

- One review per **performance instance** (`performanceId`).  
- **1–5 stars**, optional **note ≤ 100 characters** (`store/reviewStore.ts`, `REVIEW_NOTE_MAX`).  
- **Device-only** — no sync, no public feed.

## Notifications

- **MVP:** `scheduleShowReminderAsync` schedules **local** notifications before saved sets (`services/notifications/NotificationService.ts`).  
- **Android:** channels `reminders` and `alerts` are created in `ensureAndroidChannelAsync`.  
- **Settings:** permission prompt + master toggle + default reminder offset.  
- **V2 remote push:** see `services/notifications/remotePushPlaceholder.ts` — register token, handle payloads, merge into Alerts center without rewriting screens.

## Project layout (high level)

```
app/                 Expo Router routes (tabs + stacks + modals)
components/          Reusable UI (common/, map/, home/)
data/seed/           Typed mock festival content
features/            (reserved — logic mostly in screens + stores today)
hooks/               e.g. useContentQuery
providers/           QueryClient + theme wiring
services/            Repositories, notifications, storage helpers
store/               Zustand stores (preferences, schedule, reviews)
theme/               Tokens + ThemeProvider
types/               Shared domain models
utils/               Time, overlap, festival dates
```

## Product guardrails (MVP)

- No login, no public reviews, no checkout, no GPS routing, no sponsor/ads, no hotels/rideshare/food discovery.  
- Ticket screen: **pricing snapshot + external link** only.  
- Map: **static SVG placeholder** with tappable zones — replace artwork under `components/map/FestivalMapView.tsx` and `data/seed/mapZones.ts`.

## Store submission notes

- Replace placeholder **artist images** (currently Unsplash URLs in `data/seed/artists.ts`) with **bundled or licensed** assets for production.  
- Confirm **official** ticket URLs and copy with the festival.  
- **`eas.json`** is included with **preview** (internal APK) and **production** profiles; run **`npx eas init`** once, then use **`eas build`**. Configure notification entitlements for production push when you add remote push.

## Tests

`utils/__tests__/overlap.test.ts` covers schedule overlap detection used for conflict warnings.

---

*Placeholder content is labeled in-app and in seed files with `TODO` where official 2026 assets should land.*
