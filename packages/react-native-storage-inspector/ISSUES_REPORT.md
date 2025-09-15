# Storage Inspector Package - Issues Report

## Summary
The storage inspector package has been successfully moved but has several categories of issues that need to be resolved before it can build properly.

## Issue Categories

### 1. SVG Component Type Errors (High Priority)
**Files affected:**
- `src/components/CopyButton.tsx`
- `src/components/DiffViewer/DataViewer/VirtualizedDataExplorer.tsx`
- `src/shared/ui/components/CopyButton.tsx`

**Issue:** react-native-svg components (Svg, Path, Rect, Circle) cannot be used as JSX components due to type incompatibility.

**Solution needed:**
- Add react-native-svg as a peer dependency
- Ensure proper TypeScript types are installed
- May need to update import statements or type declarations

### 2. Missing Import Paths (High Priority)
Multiple files have imports pointing to old locations that need to be updated:

**Old import patterns that need fixing:**
- `rn-better-dev-tools/icons` → Should be relative path to local icons
- `@/rn-better-dev-tools/src/shared/ui/gameUI` → Should be relative path
- `@/rn-better-dev-tools/src/shared/clipboard/copyToClipboard` → Should be relative path

**Files with import issues:**
- `src/shared/ui/components/CompactRow.tsx`
- `src/shared/ui/components/CopyButton.tsx`
- `src/shared/ui/components/ModalHeader.tsx`
- `src/shared/ui/components/TypeBadge.tsx`
- `src/shared/ui/components/ValueTypeBadge.tsx`
- `src/shared/ui/console/CyberpunkSectionButton.tsx`
- `src/icons/lucide-icons-original-full.tsx`

### 3. Missing Files/Components (High Priority)
The following files are referenced but not present in the package:

**GameUI components missing:**
- `src/shared/ui/gameUI/components/GameUICollapsibleSection`
- `src/shared/ui/gameUI/components/GameUIStatusHeader`
- `src/shared/ui/gameUI/components/GameUICompactStats`
- `src/shared/ui/gameUI/components/GameUIIssuesList`
- `src/shared/ui/gameUI/hooks/useGameUIAlertState`

**Console UI components missing:**
- `src/shared/ui/console/CyberpunkButtonOutline`
- `src/shared/ui/console/CyberpunkIconContainer`

**Utility files missing:**
- `src/shared/utils/clipboard/autoDetectClipboard`
- `src/shared/utils/utils/safeStringify`
- `src/shared/utils/utils/displayValue`

### 4. TypeScript Issues (Medium Priority)
- Missing type imports: `ComponentType` not found in `lucide-icons-original-full.tsx`
- Not all code paths return values in:
  - `src/shared/hooks/useSafeAreaInsets.ts`
  - `src/shared/jsModal/useSafeAreaInsets.ts`
- Type mismatch in `ThemedSplitView.tsx` (line 228)

### 5. Package Configuration Issues (Low Priority)
**Current package.json issues:**
- react-native-svg is not listed as a dependency
- Version mismatch: package.json shows `react-native-builder-bob@^0.37.5` but should be `^0.40.0` for compatibility

## Recommended Fix Order

1. **Fix package.json dependencies:**
   - Add `react-native-svg` as peer dependency
   - Update react-native-builder-bob version

2. **Copy missing files from main project:**
   - GameUI components and hooks
   - Console UI components (CyberpunkButtonOutline, CyberpunkIconContainer)
   - Utility functions

3. **Update all import paths:**
   - Replace absolute imports with relative paths
   - Update all references to `rn-better-dev-tools/icons`
   - Fix all `@/rn-better-dev-tools/` imports

4. **Fix TypeScript issues:**
   - Add missing type imports
   - Fix return statements in hook files
   - Resolve type mismatches

## Files Needing Manual Review
Some files may have been modified by the user and reverted:
- `src/shared/ui/console/CyberpunkSectionButton.tsx`
- `package.json`

These should be checked to ensure the correct versions are in place.

## Next Steps
1. Install missing dependencies
2. Copy missing shared files
3. Update all import paths to use relative imports
4. Run TypeScript check again to verify fixes
5. Run lint check once TypeScript issues are resolved