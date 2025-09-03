# RN Better Dev Tools - Cleanup Plan

## Overview
This document outlines all the files, folders, and code that should be removed from the `rn-better-dev-tools` package to clean it up for packaging as a standalone module.

## Files to Remove

### 1. Unused Bubble Components (Never Imported)
- `rn-better-dev-tools/src/components/bubble/ClaudeGridMenu.tsx` 
- `rn-better-dev-tools/src/components/bubble/ClaudeGridMenuSVGGlitch.tsx`
- `rn-better-dev-tools/src/components/bubble/CyberpunkGlitchBackground.tsx`
- `rn-better-dev-tools/src/components/bubble/CyberpunkToggle.tsx`
- `rn-better-dev-tools/src/components/bubble/dial/Dial2.tsx`

### 2. Example/Demo Files
- `rn-better-dev-tools/src/components/modals/PureModal/PureModalExample.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/DiffThemeShowcase.tsx`

### 3. Unused DiffViewer Components
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/DiffModeSelector.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/DiffOptionsPanel.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/MultiModeDiffViewer.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/StandaloneDiffViewer.tsx`

### 4. Unused DiffViewer Modes (All Never Imported)
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/modes/EnhancedSplitView.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/modes/InlineDiffView.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/modes/SideBySideDiffView.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/modes/StructureDiffView.tsx`
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/modes/UnifiedDiffView.tsx`

### 5. Entire VSCode DiffViewer Integration (Never Used)
**Remove entire folder:** `rn-better-dev-tools/src/features/storage/components/DiffViewer/vscode/`
- `DiffDecorations.ts`
- `DiffViewModel.ts`
- `VSCodeDiffViewer.tsx`
- `VSCodeTheme.ts`
- `characterDiffComputer.ts`
- `diffComputer.ts`

### 6. Backup Files
- `rn-better-dev-tools/src/features/react-query/components/shared/VirtualizedDataExplorer.tsx.bak`

### 7. Documentation Files
- `rn-better-dev-tools/src/features/storage/components/DiffViewer/VS_CODE_DIFF_MIGRATION_GUIDE.md`

### 8. Unused Console Components
- `rn-better-dev-tools/src/shared/ui/console/BubbleSettingsModal.tsx`

## TypeScript Errors to Fix

### 1. Import Errors
- **File:** `components/AutoDiffTest.tsx`
  - **Error:** Cannot find module `MultiModeDiffViewer`
  - **Action:** Remove this test file or update imports

- **File:** `components/StandaloneDiffExample.tsx`
  - **Error:** Cannot find module `StandaloneDiffViewer`
  - **Action:** Remove this example file or update imports

- **File:** `docs/svg/PureRNSVGComparison.tsx`
  - **Error:** Cannot find module `lucide-icons-improved`
  - **Action:** Update import path or remove if unused

### 2. Type Errors
- **File:** `rn-better-dev-tools/src/components/bubble/RnBetterDevToolsBubble.tsx`
  - **Error:** Property 'buttonPosition' does not exist on type 'DialDevToolsProps'
  - **Action:** Fix type definition or remove unused prop

- **File:** `rn-better-dev-tools/src/shared/ui/console/index.ts`
  - **Error:** Cannot find module './sections'
  - **Action:** Remove import or create missing file

### 3. Commented/Disabled Code to Clean
- **File:** `rn-better-dev-tools/src/components/bubble/RnBetterDevToolsBubble.tsx`
  - Remove commented import: `// import { SentryLogsModal } from "@/rn-better-dev-tools/src/features/sentry/components/SentryLogsModal";`

## Unused Variables and Imports Analysis

Will scan each remaining file after removing unused files to identify:
- Unused imports
- Unused variables
- Unused functions
- Unused types/interfaces

## Files/Components That ARE Being Used (Keep These)

### Core Components
- `RnBetterDevToolsBubble.tsx` - Main entry point
- `DialDevTools.tsx` - Used by bubble
- `ThemedSplitView.tsx` - Used in StorageEventDetailContent
- `TreeDiffViewer.tsx` - Used in StorageEventDetailContent
- All features folders (env, network, react-query, sentry, storage) - Core functionality

### Utilities
- All action utilities (triggerError, triggerLoading, etc.) - Used by components
- `VirtualizedDataExplorer.tsx` - Used despite having backup file
- All hooks - Used throughout components

## Recommended Cleanup Order

1. **First Pass - Remove Obvious Unused Files**
   - Delete all files listed in sections 1-8 above
   - Remove the entire vscode folder

2. **Second Pass - Fix Import Errors**
   - Update or remove files with import errors
   - Clean up commented imports

3. **Third Pass - Clean Individual Files**
   - Run ESLint/TSC on each file
   - Remove unused imports and variables
   - Fix type errors

4. **Fourth Pass - Final Verification**
   - Run ts-prune again
   - Run TypeScript compiler
   - Ensure no broken imports remain

## Summary Statistics

- **Total files to remove:** ~25 files
- **Total folders to remove:** 1 (vscode folder)
- **TypeScript errors to fix:** 5 main errors
- **Files with unused imports:** TBD (will scan after removing unused files)

## Notes

- The majority of removable code appears to be experimental DiffViewer implementations that were never integrated
- The VSCode integration attempt can be completely removed
- Several UI experiments (ClaudeGridMenu, CyberpunkToggle) were never connected to the main app
- Focus should be on keeping only the actively used dev tools features