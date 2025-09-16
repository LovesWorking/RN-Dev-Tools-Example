# codexRoutes

This document inventories our current Expo Router setup, then outlines a concrete, step‑by‑step plan to establish robust authenticated vs. public routing that enforces correct redirects and back behavior. No code changes are made here; this is the plan and structure.

## Current Routes And Structure

- Root layout: `app/_layout.tsx`
  - Uses `<Stack screenOptions={{ headerShown: false }}>` and explicitly declares `index` and `+not-found` screens.
  - Global wrappers/providers: `QueryClientWrapper` (React Query singleton), `DevToolsThemeProvider`, `LinearGradient`, and splash/font loading via `expo-font` and `expo-splash-screen`.

- Explicit routes/files in `app/`:
  - `/` → `app/index.tsx`
  - `/test-filters` → `app/test-filters.tsx`
  - `+not-found` → `app/+not-found.tsx` (404 handler)

- Non-routes (implementation-only):
  - `app/components/PokemonCardSwipeable.tsx` (UI component, not a route)

- Not present currently:
  - No `(auth)` or `(app)` route groups
  - No nested layouts (e.g., `(tabs)/_layout.tsx`)
  - No `+native-intent.tsx` deep link handler
  - No protected routing or auth redirect logic

Summary: The app has a simple root stack with just the home and 404 screens. There is no auth-aware structure, so users can navigate to any present route (e.g., `/test-filters`) without gating.

## Gaps vs. Best Practices (from docs/expo routes)

- Missing route groups `(auth)` and `(app)` to clearly separate public vs. authenticated sections.
- No protected route guards; nothing prevents reaching auth screens when logged in or app screens when logged out.
- No splash/auth loading gating: potential for flicker of the wrong screen during session resolution if/when auth is added.
- No initial route settings in nested stacks to ensure correct back behavior from deep links.
- No tab/drawer layout where appropriate; header/tab options centralized per group are not used.
- No deep link rewrite/redirect handler (`+native-intent.tsx`) for legacy or external links.

## Goals For Proper Auth/Public Routing

- Logged-in users must never see or navigate back to auth screens (login, sign-up, forgot password).
- Logged-out users must be automatically redirected to the auth flow.
- Clean URL structure with groups: `(auth)` and `(app)`, with optional `(tabs)` or feature stacks.
- One source of truth for session state with a provider; reactive rerender triggers gated navigation changes.
- No screen duplication; avoid declaring the same screen in multiple places.
- Predictable back behavior; no “back to login” after sign-in; use replace/dismiss semantics where needed.

## Proposed Route Structure

Top-level (root):

```
app/
  _layout.tsx                 # Root layout with protected routing
  +not-found.tsx             # Global 404

  (auth)/                    # Public-only routes
    _layout.tsx              # Auth stack (headers allowed)
    sign-in.tsx              # Login
    sign-up.tsx              # Registration
    forgot-password.tsx      # Reset flow (optional)

  (app)/                     # Authenticated-only routes
    _layout.tsx              # Central app layout (Tabs or Stack)
    (tabs)/                  # Tabs (optional but recommended)
      _layout.tsx            # Tab config
      index.tsx              # Home tab (migrate current index.tsx here)
      profile.tsx            # Example tab
      settings.tsx           # Example tab

    # Feature stacks (examples)
    user/[id].tsx            # Dynamic routes
    modal.tsx                # Modal presentation when needed
```

Notes:

- The existing `app/index.tsx` should become the authenticated home (e.g., move to `app/(app)/(tabs)/index.tsx` or `app/(app)/index.tsx` if not using tabs yet).
- Keep `app/+not-found.tsx` as-is to continue handling unknown paths.
- Keep `app/test-filters.tsx` either as a dev route under `(app)` (e.g., `app/(app)/dev/test-filters.tsx`) or remove from production builds.

## Protected Routing Plan (No Code Yet)

Root layout gating logic (driven by docs’ patterns):

- Wrap the app in a `SessionProvider` that exposes `{ session, isLoading, signIn, signOut }`.
- Prevent auto-hide of the splash screen; hide it only after auth state resolves to avoid flicker.
- In `app/_layout.tsx`, render:
  - `<Stack.Protected guard={!!session}>` for `(app)` group.
  - `<Stack.Protected guard={!session}>` for `(auth)` group.
- Do not declare the same screens twice across guards.

Redirect semantics achieved by guards:

- Logged in:
  - `(auth)` content is not mounted; navigating “back” from `(app)` cannot land on login because it’s outside the mounted tree and can be replaced on sign-in.
- Logged out:
  - `(app)` content is not mounted; any app attempt should land in `(auth)`.

Back behavior and transitions:

- For sign-in success, prefer `router.replace('/(app)')` (or rely on reactive guard to switch trees) so the auth screen is not in history.
- For sign-out, prefer `router.replace('/(auth)/sign-in')` and/or rely on guard change.
- In nested stacks, set `export const unstable_settings = { initialRouteName: 'index' }` where deep links should still show a back button and correct history.

## Layout And Folder Improvements

- Add `(tabs)/_layout.tsx` under `(app)` to centralize tab options, icons, and labels.
- Use per-group `_layout.tsx` to configure headers and presentations per feature (e.g., modal stacks or details stacks).
- Consolidate dev-only screens under a `dev/` segment and consider gating with build flags.
- Consider adding `+native-intent.tsx` to rewrite legacy deep links to the new structure.

## Do/Don’t Summary (from our Expo routing docs)

- Do: Use route groups for auth vs. app; avoid URL noise with `(group)`.
- Do: Use `<Link />` for user-driven navigation; use `router.navigate/replace/push` for imperative flows.
- Do: Handle loading states during auth resolution to avoid flicker.
- Do: Set `initialRouteName` in nested stacks to keep predictable history.
- Don’t: Declare the same screen in multiple places or mix guarded and unguarded declarations.
- Don’t: Navigate in render without guards; avoid string concatenation for dynamic paths.
- Don’t: Use web-only props in mobile (e.g., `target="_blank"`).
- Don’t: Use `router.back()` to close modals; use `router.dismiss()`.

## Step‑By‑Step Implementation Plan

1. Auth state foundation

- Create `ctx/auth.tsx` (or equivalent) with `SessionProvider` and `useSession()` exposing `{ session, isLoading, signIn, signOut }`.
- Persist session token via storage and ensure guard reactivity.

2. Root layout gating

- Update `app/_layout.tsx` to:
  - Wrap with `SessionProvider`.
  - Gate with `<Stack.Protected guard={!!session}>` for `(app)` and `<Stack.Protected guard={!session}>` for `(auth)`.
  - Keep `+not-found` globally available.
- Control splash visibility based on `isLoading` to prevent UI flicker.

3. Route reorganization

- Create `(auth)` group with: `sign-in`, `sign-up`, `forgot-password`.
- Create `(app)` group:
  - If using tabs: `(app)/(tabs)/_layout.tsx`, and move current `index.tsx` into that group as the home tab.
  - Otherwise: `(app)/index.tsx` as the main entry.
- Move `test-filters.tsx` into `(app)/dev/` or remove from production.

4. Navigation semantics

- On successful `signIn`, rely on guard or call `router.replace('/(app)')`.
- On `signOut`, rely on guard or call `router.replace('/(auth)/sign-in')`.
- Ensure initial routes in nested stacks for consistent back buttons.

5. Optional enhancements

- Add `+native-intent.tsx` to map legacy deep links to the new routes.
- Add `Tabs`/`Drawer` as needed for IA; centralize tab icons and badges in `(tabs)/_layout.tsx`.
- Prefetch heavy screens via `<Link prefetch />` or `router.prefetch`.

6. QA and guardrail checks

- Verify: logged-in cannot reach `(auth)` and cannot back into it; logged-out cannot reach `(app)` screens.
- Verify: deep links land correctly with back behavior.
- Verify: no duplicate screen declarations; no flicker on launch.

## Migration Notes For This App

- Current `app/index.tsx` is the primary screen and should become the authenticated home (move under `(app)`).
- Keep `+not-found.tsx` in root; it will continue to catch unknown routes.
- There is no existing auth—initially simulate session state in `SessionProvider` during development to verify guard logic.
- Ensure the current provider tree (QueryClientWrapper, theme) wraps the new `(auth)` and `(app)` groups equivalently to today’s root setup.

---

If you want, I can implement this structure next: create the groups/layouts, wire a minimal `SessionProvider`, and migrate `index.tsx` while preserving providers and styles.
