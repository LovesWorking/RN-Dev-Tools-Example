# Adding Apps to the Floating Menu

This guide shows how to add tools (“apps”) to the new data‑driven floating menu, using the Environment (env) feature as a concrete example.

## Overview
- The floating menu is driven by an `installedApps` array.
- Each app defines:
  - `id` (string, stable)
  - `name` (string)
  - `icon` (ReactNode or function)
  - `onPress` (handler receiving `{ state?, actions? }`)
  - optional `slot`: `row`, `dial`, or `both` (default `both`)
- The bubble builds generic `actions` (open modals, toggle wifi) and `state` (e.g. `isWifiEnabled`) and passes them to your apps.

## Quick Example (Env tool)
```tsx
import { FloatingMenu, type InstalledApp } from 'rn-better-dev-tools';
import { EnvLaptopIcon } from 'rn-better-dev-tools/icons';

const [isEnvOpen, setEnvOpen] = useState(false);
const [envCloseResolver, setEnvCloseResolver] = useState<(() => void) | null>(null);

const installedApps: InstalledApp[] = [
  {
    id: 'env',
    name: 'Open Environment Tools',
    slot: 'both', // shows in row + dial
    icon: ({ size }) => (
      <EnvLaptopIcon size={size} color="#9f6" glowColor="#9f6" noBackground />
    ),
    // Return a Promise that resolves when your modal closes.
    onPress: () => new Promise<void>((resolve) => {
      setEnvOpen(true);
      setEnvCloseResolver(() => resolve);
    }),
  },
];

<FloatingMenu apps={installedApps} />

<EnvVarsModal
  visible={isEnvOpen}
  onClose={() => { setEnvOpen(false); envCloseResolver?.(); setEnvCloseResolver(null); }}
  requiredEnvVars={requiredEnvVars}
/>
```

## Icon Function Context
When `icon` is a function, it receives a render context:
- `slot`: `'row' | 'dial'`
- `size`: number (`16` for row, `32` for dial)
- `state?`: dynamic state (e.g. `isWifiEnabled`)
- `actions?`: dynamic actions (e.g. `openEnvironment`, `toggleWifi`)

Example (WiFi icon that reacts to state):
```tsx
{
  id: 'wifi',
  name: 'Toggle WiFi',
  icon: ({ size, state }) => (
    <WifiCircuitIcon
      size={size}
      color={state?.isWifiEnabled ? '#6cf' : '#f66'}
      glowColor={state?.isWifiEnabled ? '#6cf' : '#f66'}
      showSlash={!state?.isWifiEnabled}
      noBackground
    />
  ),
  onPress: ({ actions }) => actions?.toggleWifi?.(),
}
```

## Actions and State (what you can call/read)
The bubble provides a generic map of actions and state:
- `actions` (callable):
  - `openReactQuery()`, `openEnvironment()`, `openSentry()`, `openStorage()`, `openNetwork()`, `toggleWifi()`
- `state` (read-only):
  - `isWifiEnabled: boolean`

These are dynamic and not part of a hardcoded type, so you can safely check and call with optional chaining.

## Slots and Visibility
- `slot`:
  - `row` → quick‑access icon row
  - `dial` → radial dial only
  - `both` (default)
- Settings (DevToolsSettingsModal) can hide/show known app ids while preserving spacing:
  - Known ids: `query`, `env`, `sentry`, `storage`, `wifi`, `network`
  - Unknown ids default to visible

## Standalone Dial Usage (optional)
You can render just the dial overlay if you want a separate floating menu:
```tsx
import { DialDevTools } from 'rn-better-dev-tools';

<DialDevTools
  apps={installedApps}
  state={{ isWifiEnabled: true }}
  actions={{ openEnvironment: () => setEnvOpen(true) }}
  onClose={() => setDialOpen(false)}
/>
```

## Zero‑Tools Behavior
- The dial opens even with `apps={[]}`. It will show the background and center/settings UI with no icons.
- The row simply renders no icons when `installedApps` is empty.

## Tips
- Use stable `id`s. For WiFi behavior (dial doesn’t auto‑close on toggle), use `id: 'wifi'`.
- If an app isn’t visible, check the settings modal toggles.
- If TypeScript complains about `actions` or `state`, ensure your `onPress` accepts a required context parameter and you use optional chaining (`actions?.openEnvironment?.()`).

## Env Feature Reference
If you’re validating environment variables, you can continue to use the Env feature:
```tsx
import { createEnvVarConfig, envVar } from 'rn-better-dev-tools/features/env';

const requiredEnvVars = createEnvVarConfig([
  envVar('EXPO_PUBLIC_API_URL').exists(),
  envVar('EXPO_PUBLIC_ENVIRONMENT').withValue('development').build(),
]);

<FloatingMenu apps={installedApps} />
```

That’s it — add entries to `installedApps`, and the floating menu will render them in the row and dial.
