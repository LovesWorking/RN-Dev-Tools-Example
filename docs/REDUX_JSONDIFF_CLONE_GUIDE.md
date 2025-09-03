# Redux DevTools JSONDiff — Exact Behavior and RN Clone Plan

This document captures exactly how Redux DevTools renders its JSON diff (single view) and provides a step-by-step plan to replicate it in React Native so the result matches Redux visually and behaviorally.

## What Redux Does

- **Library/Component**: `JSONDiff.tsx` renders a diff using `react-json-tree` with a custom `valueRenderer`.
  - Source: `packages/redux-devtools-inspector-monitor/src/tabs/JSONDiff.tsx`
- **Theme Source**: Colors are taken from an Emotion theme built from Base16.
  - Source: `packages/redux-devtools-inspector-monitor/src/utils/themes.ts`
- **Tree Behavior**: Expands first level by default; hides root; uses `postprocessValue` to normalize array deltas from `jsondiffpatch`.

### Visual Semantics

- **Highlighting method**: Background highlighting behind values; the text color stays the normal theme text color for readability.
- **Diff semantics (array values from jsondiffpatch)**:
  - Length 1: `[new]` → Added value, green background.
  - Length 2: `[old, new]` → Updated value, renders “old => new”.
    - Old: red background + line-through.
    - Arrow: magenta/purple text color.
    - New: green background.
  - Length 3: `[old, 0, 0]` → Removed value, red background + line-through.
- **Truncation**: Uses `stringifyAndShrink(val, isWideLayout)` to shorten long values (more aggressive in non-wide layout).
- **Padding/radius**: Each highlighted chip uses `padding: 2px 3px` and `borderRadius: 3px`.
- **Inline layout**: Values and arrow are inline spans with small spacing, not block rows.

### Exact Colors (from Base16-derived theme)

From `packages/redux-devtools-inspector-monitor/src/utils/themes.ts`:
- `TEXT_COLOR`: `theme.base06`
- `TEXT_PLACEHOLDER_COLOR`: `rgba(theme.base06, 60)`
- `ITEM_HINT_COLOR`: `rgba(theme.base0F, 90)`
- `DIFF_ADD_COLOR`: `rgba(theme.base0B, 40)`
- `DIFF_REMOVE_COLOR`: `rgba(theme.base08, 40)`
- `DIFF_ARROW_COLOR`: `theme.base0E`

For the common “default/dark” theme, typical resolved values are:
- Add bg: green @ 40% opacity
- Remove bg: red @ 40% opacity
- Arrow: magenta/purple (base0E)
- Text: neutral LIGHT text (base06) — not green/red

### Renderer Details (Redux)

`JSONDiff.tsx` core logic (summarized):
- `postprocessValue(prepareDelta)` maps jsondiffpatch arrays to readable tuples for arrays (`_t: 'a'`).
- `valueRenderer(raw, value)`:
  - If `Array.isArray(value)` then:
    - `[1]`: render value with `backgroundColor: DIFF_ADD_COLOR`.
    - `[old, new]`: render three spans:
      - Old: `backgroundColor: DIFF_REMOVE_COLOR`, `textDecoration: line-through`.
      - Arrow: text colored `DIFF_ARROW_COLOR` → literal `' => '`
      - New: `backgroundColor: DIFF_ADD_COLOR`.
    - `[old, 0, 0]`: render value with `backgroundColor: DIFF_REMOVE_COLOR`, `textDecoration: line-through`.
  - Else: return `raw` (default react-json-tree rendering).
- All chips share a common style: `padding: 2px 3px; borderRadius: 3px; color: TEXT_COLOR`.

## How Ours Differs (RN Single View)

Current file: `dif-viewer/SingleViewDiffViewer.tsx`.

- Uses colored text (addedText/removedText) instead of neutral text on colored background.
- Uses low-opacity highlights (0.1) instead of 0.4; arrow is blue, not magenta.
- Collapsed node chips do use bg but still color the text green/red.
- Different truncation/compact formats than Redux’s `stringifyAndShrink`.

Effect: lower readability and visual mismatch with Redux DevTools.

## Exact Conversion Plan (React Native)

Goal: a one-to-one visual match to Redux’s single-view diff, using RN `View`/`Text` primitives.

1) Theme Tokens (new constants)
- Add RN equivalents for the Redux tokens (resolve from your existing theme or define constants):
  - `TEXT_COLOR` → base16 `base06`-like neutral text.
  - `DIFF_ADD_COLOR` → `rgba(base0B, 0.4)`.
  - `DIFF_REMOVE_COLOR` → `rgba(base08, 0.4)`.
  - `DIFF_ARROW_COLOR` → `base0E`.
- Stop using `addedText/removedText` for value text; always use `TEXT_COLOR` for values inside chips.

2) Inline Chips (values and arrow)
- Implement styles equivalent to Redux chips:
  - `chipBase`: `paddingVertical: 2, paddingHorizontal: 3, borderRadius: 3`
  - `chipAdd`: `backgroundColor: DIFF_ADD_COLOR`
  - `chipRemove`: `backgroundColor: DIFF_REMOVE_COLOR`, plus `textDecorationLine: 'line-through'` for removed/old values.
  - `arrow`: `color: DIFF_ARROW_COLOR`, text is literal `' => '`
- Ensure the encapsulated text color is always `TEXT_COLOR`.

3) Update Types/Rendering
- For leaf diffs:
  - Added: `[new]` → render one chip (green bg) with neutral text color.
  - Removed: `[old, 0, 0]` → one chip (red bg + line-through).
  - Changed: `[old, new]` → three inline pieces: red-del + arrow + green-add.
- For collapsed object/array nodes in “changed” state, display compact `"{…}"` / `"[…]"` values with the same chip rules for old/new.

4) Truncation/Shrink Logic
- Implement `stringifyAndShrink(value, isWideLayout)`:
  - If wide: if length > 42 → show first 30 + ellipsis + last 10.
  - Else: if length > 22 → first 15 + ellipsis + last 5.
- Apply to both old/new values inside chips.

5) Neutral Type Coloring
- Do not color strings/numbers/booleans differently inside chips; use `TEXT_COLOR`.
- Keep syntax coloring only for non-diff, unhighlighted values if desired. For Redux parity within chips, text is neutral.

6) Spacing/Alignment
- Keep chips inline in a single row with small spacing.
- Avoid large padding/margins that make the chips look like blocks.

7) Arrow Color
- Replace current blue with `DIFF_ARROW_COLOR` (magenta/purple from theme).

8) RN Implementation Notes
- Use `<Text>` nesting to apply background color and line-through cleanly.
- Set `numberOfLines`/`ellipsizeMode` only if needed; prefer manual truncation matching Redux’s logic.
- Ensure `fontFamily: 'monospace'` is applied consistently.

## File Changes To Make (Upon Approval)

- Remove `rn-better-dev-tools/src/features/storage/components/DiffViewer/ChatGPTDiffWrapper.tsx`.
- Create `dif-viewer/chatgtsingledifviewer.tsx` as a copy of `dif-viewer/SingleViewDiffViewer.tsx`, then:
  - Replace color usage inside chips to use `TEXT_COLOR` with `DIFF_ADD_COLOR`/`DIFF_REMOVE_COLOR` backgrounds.
  - Replace arrow color with `DIFF_ARROW_COLOR`.
  - Increase bg opacity to match Redux (0.4 equivalent).
  - Add `stringifyAndShrink` behavior and apply to chip values.
  - Ensure collapsed nodes render old/new compact values as chips exactly like Redux.
- Update `rn-better-dev-tools/src/features/storage/components/DiffViewer/TestDiffViewers.tsx`:
  - For `viewerType === 'chatgpt'`, render `chatgtsingledifviewer` instead of `ChatGPTDiffWrapper`.

## Acceptance Checklist

- Added, removed, and changed values render with background highlighting only.
- Old values are struck through; arrow is magenta; new values are green.
- Text color inside chips is neutral, readable, and consistent.
- Truncation matches Redux rules for wide vs. non-wide layout.
- Collapsed objects/arrays show as compact chips with correct highlighting.
- Visual comparison against Redux DevTools shows parity.

---
If you approve this plan, I will:
1) Replace `ChatGPTDiffWrapper` with `chatgtsingledifviewer` (cloned),
2) Implement the Redux-accurate visuals in the clone,
3) Wire it in `TestDiffViewers` for the `chatgpt` viewer mode.
