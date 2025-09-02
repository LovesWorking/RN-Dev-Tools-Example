# Floating Tools Enhancement Plan

Goal: Show quick-access dev tool icons (Query, Env, Storage, WiFi, Network, etc.) directly in the floating dev tools bubble, driven by settings (FLOATING tab). Defaults: only Environment indicator + User Status enabled.

## Steps

1. Audit current bubble and settings flow
2. Update defaults: floating tools off by default (except env + environment badge)
3. Add floating icons to `RnBetterDevToolsBubble` gated by settings + hide props
4. Reuse dial icons and correct colors; wire `onPress` to existing handlers
5. Handle WiFi toggle with red slash when off
6. Verify modals open correctly; respect hidden props
7. Polish styles for consistency with bubble
8. Sanity pass and mark tasks complete

## Status

- [x] 1. Audit current bubble and settings flow
- [x] 2. Update defaults (env/environment true; others false)
- [x] 3. Add floating icons to bubble per settings
- [x] 4. Use dial icons + correct colors + handlers
- [x] 5. WiFi toggle visual state
- [x] 6. Verify modals open / respect hide props
- [x] 7. Style polish
- [x] 8. Sanity pass

