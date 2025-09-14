# Import Updates Needed for Storage Inspector Package

## Status of Copied Files

### ✅ Successfully Copied
- All UI components (ModalHeader, TabSelector, ValueTypeBadge, etc.)
- Game UI constants (macOSDesignSystemColors, gameUIColors)
- Utilities (formatRelativeTime, valueFormatting, copyToClipboard)
- Storage utilities (devToolsStorageKeys)
- Hooks (useSafeAreaInsets)
- Icons (entire icons directory)
- TreeDiffViewer from dif-viewer

### 🔧 Created Placeholders (Need Real Implementation)
- `DataViewer.tsx` - Component for viewing data
- `storageQueryUtils.ts` - Storage utility functions
- `useStorageQueryCounts.ts` - Hook for storage counts

## Import Path Updates Required

### 1. Update Shared Imports
Replace all imports from `@/rn-better-dev-tools/src/shared/` with relative paths:

```typescript
// Old:
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";
// New:
import { ModalHeader } from "../shared/ui/components/ModalHeader";

// Old:
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";
// New:
import { macOSColors } from "../shared/ui/gameUI/constants/macOSDesignSystemColors";
```

### 2. Update React Query Imports
Replace all imports from `../../react-query/` with external paths:

```typescript
// Old:
import { DataViewer } from "../../react-query/components/shared/DataViewer";
// New:
import { DataViewer } from "../external/react-query/components/shared/DataViewer";

// Old:
import { getStorageTypeLabel } from "../../react-query/utils/storageQueryUtils";
// New:
import { getStorageTypeLabel } from "../external/react-query/utils/storageQueryUtils";
```

### 3. Update Icon Imports
Replace icon imports with local icons:

```typescript
// Old:
import { HardDrive } from "rn-better-dev-tools/icons";
// New:
import { HardDrive } from "../icons";
```

### 4. Update TreeDiffViewer Import
```typescript
// Old:
import TreeDiffViewerComponent from "@/dif-viewer/TreeDiffViewer";
// New:
import TreeDiffViewerComponent from "../../external/TreeDiffViewer";
```

## Files That Need Import Updates

### Components Directory
- StorageSection.tsx
- StorageModalWithTabs.tsx
- StorageKeyCard.tsx
- StorageKeyRow.tsx
- StorageKeySection.tsx
- StorageActions.tsx
- StorageEventDetailModal.tsx
- StorageEventDetailContent.tsx
- StorageEventsSection.tsx
- StorageEventListener.tsx
- StorageFilterViewV2.tsx
- GameUIStorageBrowser.tsx
- GameUIStorageStats.tsx
- DiffViewer.tsx
- DiffViewer/TreeDiffViewer.tsx
- DiffViewer/DiffOptionsPanel.tsx
- DiffViewer/DiffModeSelector.tsx
- DiffViewer/modes/*.tsx

## Next Steps

1. Run a script to update all import paths
2. Test that all imports resolve correctly
3. Build the package to verify everything compiles
4. Update the placeholder files with actual implementations when available