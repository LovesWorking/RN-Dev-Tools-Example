# Shared Dependencies Needed for Storage Inspector Package

## Files to Copy from `rn-better-dev-tools/src/shared/`

### UI Components (`shared/ui/components/`)
- [ ] `ModalHeader.tsx` - Used by StorageModalWithTabs, StorageEventDetailModal
- [ ] `TabSelector.tsx` - Used by StorageModalWithTabs
- [ ] `ValueTypeBadge.tsx` - Used by StorageModalWithTabs
- [ ] `CompactRow.tsx` - Used by StorageKeyRow
- [ ] `TypeBadge.tsx` - Used by StorageKeyRow
- [ ] `SectionHeader.tsx` - Used by StorageKeySection
- [ ] `CopyButton.tsx` - Used by StorageActions

### Console UI Components (`shared/ui/console/`)
- [ ] `CyberpunkSectionButton.tsx` - Used by StorageSection, StorageEventsSection

### Game UI Constants (`shared/ui/gameUI/`)
- [ ] `constants/macOSDesignSystemColors.ts` - Used by multiple components
- [ ] `constants/gameUIColors.ts` - Used by StorageKeyCard, GameUIStorageStats, etc.
- [ ] `index.ts` - Main gameUI exports

### Utilities (`shared/utils/`)
- [ ] `time/formatRelativeTime.ts` - Used for timestamp formatting
- [ ] `valueFormatting.ts` - Contains parseValue, formatValue functions
- [ ] `clipboard/copyToClipboard.ts` - Clipboard functionality

### Storage Utilities (`shared/storage/`)
- [ ] `devToolsStorageKeys.ts` - Contains devToolsStorageKeys, isDevToolsStorageKey

### Hooks (`shared/hooks/`)
- [ ] `useSafeAreaInsets.ts` - Used by StorageEventDetailModal

## Files from Other Features

### React Query Components (`features/react-query/`)
- [ ] `components/shared/DataViewer.tsx` - Used for data display
- [ ] `utils/storageQueryUtils.ts` - Storage utilities (getStorageTypeLabel, etc.)
- [ ] `hooks/useStorageQueryCounts.ts` - Used by StorageSection

### Diff Viewer Component (`dif-viewer/`)
- [ ] `TreeDiffViewer.tsx` - Used by TreeDiffViewer component

## Icons Package
The storage inspector uses icons from `rn-better-dev-tools/icons`:
- HardDrive
- Database
- RefreshCw
- Trash2
- Play
- Pause
- Filter
- ChevronDown
- ChevronRight
- Plus
- Minus
- Eye
- Clock
- Activity
- FileText
- Copy
- Check
- X
- AlertTriangle
- Info
- GitBranch
- Layers
- Code
- FileCode
- ToggleLeft
- ToggleRight
- Columns
- AlignLeft
- ChevronUp

## Import Path Updates Needed

After copying files, update all imports:
1. Replace `@/rn-better-dev-tools/src/shared/` with relative paths or package internals
2. Replace `../../react-query/` with appropriate paths
3. Replace `rn-better-dev-tools/icons` with icon package or copy icons
4. Replace `@/dif-viewer/` with appropriate path

## Directory Structure for Copied Files

Suggested structure in the package:
```
packages/react-native-storage-inspector/src/
├── components/       # Existing storage components
├── shared/          # Copy shared dependencies here
│   ├── ui/
│   │   ├── components/
│   │   ├── console/
│   │   └── gameUI/
│   ├── utils/
│   ├── storage/
│   └── hooks/
├── icons/           # Either copy icons or use icon package
└── external/        # For DataViewer, TreeDiffViewer, etc.
```