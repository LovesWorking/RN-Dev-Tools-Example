# AGENTS.md — Working With RN Dev Tools Example

This file tells future agents how this repo is organized, how the floating dev tools work now, and the key patterns to keep intact. Please follow these rules when changing related code.

## TL;DR
- Floating menu is now data‑driven and self‑contained.
- Use `FloatingMenu` with an `installedApps` array. If an app opens a modal, return a Promise from `onPress` and resolve it on modal close — the row auto‑hides while pending.
- Dial and settings are always accessible: the row uses `UserStatus` as the dial launcher when `userRole` is provided, otherwise a small launcher icon is shown.
- Environment badge on the row is controlled by the settings toggle and by an `environment` prop to `FloatingMenu`.

## Project Layout (relevant parts)
- `app/` — Expo app entry; see `app/index.tsx` for how we integrate the tools.
- `rn-better-dev-tools/src/floatingMenu/` — Self‑contained floating tools module.
  - `FloatingMenu.tsx` — Main entry for the row.
  - `floatingTools.tsx` — Draggable row UI.
  - `dial/` — Dial overlay (menu of icons).
  - `DevToolsSettingsModal.tsx` — Settings UI (original look, uses JsModal).
  - `types.ts` — InstalledApp + rendering context.
  - `useSafeAreaInsets.ts`, `DraggableHeader.tsx`, `colors.ts` — local utilities to keep portability.
  - `ui/` — small local components used by the modal if needed.
- `rn-better-dev-tools/src/features/env/` — Environment feature (badge + modal + helpers).

## Floating Menu Rules
- Always pass apps via `installedApps: InstalledApp[]` to `FloatingMenu`.
- To open a dev modal/tool from the row or dial, define:
  - `icon: ReactNode | (ctx) => ReactNode` (ctx carries `{slot, size, state?, actions?}`)
  - `onPress: (ctx) => void | Promise<void>`
- If `onPress` returns a Promise, the row auto‑hides until the Promise resolves. Resolve the Promise in your modal’s `onClose`.
- Row content order: Environment badge (if settings allow and `environment` prop passed), launcher (UserStatus if `userRole` present; grid icon otherwise), then app icons (slot `'row'|'both'`).

## InstalledApp Contract
```
export interface InstalledApp {
  id: string;
  name: string;
  icon: React.ReactNode | ((ctx: { slot: 'row'|'dial'; size: number; state?: any; actions?: any }) => React.ReactNode);
  onPress: (ctx: { state?: any; actions?: any }) => void | Promise<void>;
  slot?: 'row' | 'dial' | 'both';
  color?: string;
}
```

## Dial & Settings
- Dial layout is the default overlay for app discovery; it reads the same `installedApps` (slot `'dial'|'both'`).
- Settings modal is accessible from the dial center button and uses the original `JsModal` UI.
- Settings visibility is bridged for known ids (`query`, `env`, `sentry`, `storage`, `wifi`, `network`); unknown ids default to visible.

## Visibility & Hiding
- Row hides when:
  - An app’s `onPress` returned a Promise (while pending).
  - Dial is open.
- Row reappears when:
  - The Promise resolves (modal closed), or the dial closes.

## Environment Badge
- To show the badge, pass `environment` to `FloatingMenu` and ensure the settings toggle for environment badge is ON.
- Component lives at `rn-better-dev-tools/src/features/env/components/EnvironmentIndicator.tsx` and is re‑exported via `features/env`.

## Portability Guidelines
- The `floatingMenu` folder is self‑contained: you can copy it to another repo without shared imports.
- We still use shared pieces for the settings modal (icons, JsModal, etc.) to preserve the original look in this repo. If you copy out the folder, either:
  - Keep the original settings (requires shared UI + AsyncStorage), or
  - Swap the settings modal to the local `ui/` components (previous variant is preserved in git history as reference).

## App Integration — Example
- See `app/index.tsx` for a working example:
  - Builds `installedApps` with the Env app.
  - `onPress` returns a Promise; the Promise resolves in `EnvVarsModal`’s `onClose`.
  - Passes `environment` and `userRole` to `FloatingMenu`.

## Dev Commands
- `npm start` / `npm run dev` — start Expo dev server
- `npm run ios` / `npm run android` — run on iOS/Android
- `pnpm reload` / `npm run reload` — reload the Expo app (ALWAYS use before taking screenshots)
- `npm run lint` — lint
- `npm test` — run jest tests

## Code Style
- TypeScript, strict; 2‑space indent; single quotes.
- Minimalist changes; preserve animations & UX when modifying dial/menu.

## Testing Guidance
- If you add a new app:
  - Verify icon render at size 16 (row) and 32 (dial).
  - Verify `onPress` behavior and auto‑hide via Promise.
  - Verify settings visibility toggles for known ids.
- Don’t introduce network/timer reliance in tests.

## Plan — Extract Env to Its Own Package (Bob)
We want `features/env` as a standalone library using `react-native-builder-bob`.

1) Scaffold a local library with Bob
- `npx create-react-native-library@latest rn-better-dev-env --local`
- Answer prompts: TypeScript, no example app (local template), no native code if you only need JS.

2) Move Env code
- Copy from `rn-better-dev-tools/src/features/env/` to `modules/rn-better-dev-env/src/`:
  - `components/` (EnvVarsModal, EnvironmentIndicator, etc.)
  - `types/` (export only public types)
  - `utils/` & `hooks/` (helpers used by the modal)
  - Create an `index.ts` that re‑exports the public API:
    - `EnvVarsModal`, `EnvironmentIndicator`, `createEnvVarConfig`, `envVar`, `types`

3) Fix imports
- Replace `@/rn-better-dev-tools/...` with local imports inside the new package.
- Keep icons as peer‑deps if needed, OR vendor minimal icons locally.
- Keep `JsModal` as a peer (or ship a minimal variant if you need portability).

4) Configure package.json
- Set `name`, `version`, `main` (dist entry), `types`.
- Ensure `react`, `react-native` as peerDependencies.
- Configure `bob` build scripts (`prepare`, `build`):
  - Example: `"prepare": "bob build"`

5) Build & link
- `npm install`
- `npm run prepare` (bob builds to `lib/`)
- Add dependency in app `package.json` using a local link:
  - npm: `"rn-better-dev-env": "file:./modules/rn-better-dev-env"`
  - yarn: `"rn-better-dev-env": "link:./modules/rn-better-dev-env"`
- `npm install` to link it, then import from `'rn-better-dev-env'` in the app.

6) Verify
- Launch the app, open the modal from `FloatingMenu` → Env app.
- Check types & lint.

7) (Optional) Publish later
- Remove local link, publish to npm with `release-it` or similar.

## Quick Checklist
- [ ] `FloatingMenu` + `installedApps` used (no hardcoded tools)
- [ ] `onPress` returns a Promise for modal apps
- [ ] Row auto‑hides during pending Promise
- [ ] `environment` prop passed and settings toggle ON to show ENV badge
- [ ] `userRole` passed to use `UserStatus` as dial launcher (fallback launcher otherwise)
- [ ] Dial + Settings accessible and look correct
- [ ] Env extraction plan with Bob followed when packaging

When in doubt, keep the visuals identical and the logic data‑driven.

