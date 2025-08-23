# DRY Improvements for RN Better Dev Tools

## Executive Summary

This document outlines areas where code reuse can significantly reduce the codebase size and improve maintainability of the rn-better-dev-tools npm package. The analysis identified approximately **1,200-1,500 lines of duplicate code** that can be extracted into shared components and utilities.

## Priority Classification

- 🔴 **CRITICAL** - Exact duplicates causing immediate maintenance burden
- 🟡 **HIGH** - Significant duplication with clear extraction path
- 🟢 **MEDIUM** - Pattern duplication that would benefit from abstraction
- 🔵 **LOW** - Nice-to-have improvements for consistency

---

## 🔴 CRITICAL: Exact Code Duplicates

### 1. Time Formatting Utilities
**Files:**
- `features/storage/utils/formatRelativeTime.ts` (26 lines)
- `features/sentry/utils/formatRelativeTime.ts` (31 lines)

**Solution:**
```typescript
// Move to: shared/utils/time/formatRelativeTime.ts
export function formatRelativeTime(
  date: Date | number, 
  currentTime: number = Date.now()
): string {
  // Unified implementation
}
```

**Impact:** Remove 31 duplicate lines, standardize time display across features

### 2. Game UI Color Constants
**Files:**
- `features/storage/components/GameUIStorageStats.tsx` (lines 20-38)
- `features/env/components/CyberpunkEnvVarStats.tsx` (lines 11-28)
- Already exists: `shared/ui/gameUI/constants/gameUIColors.ts` ✅

**Solution:**
```typescript
// Remove local definitions and import from:
import { gameUIColors } from '@/shared/ui/gameUI/constants/gameUIColors';
```

**Impact:** Remove 36+ duplicate lines, ensure consistent theming

---

## 🟡 HIGH PRIORITY: Major Pattern Duplications

### 3. Modal Wrapper Pattern
**Files:**
- `features/network/components/NetworkModal.tsx`
- `features/storage/components/StorageModal.tsx`
- `features/storage/components/StorageModalWithTabs.tsx`
- `features/sentry/components/SentryLogsModal.tsx`
- `features/react-query/components/modals/ReactQueryModal.tsx`

**Duplicated Elements:**
- Modal header structure (80-100 lines per modal)
- Persistence key logic
- ClaudeModal60FPSClean wrapper
- Back button handling
- Dimension management

**Solution:**
```typescript
// Create: shared/ui/modals/BaseFeatureModal.tsx
interface BaseFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  subtitle?: string | React.ReactNode;
  persistenceKey: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode[];
  enableSharedDimensions?: boolean;
}

export const BaseFeatureModal: React.FC<BaseFeatureModalProps> = ({...}) => {
  // Extract common modal logic
  return (
    <ClaudeModal60FPSClean {...}>
      <ModalHeader />
      {children}
    </ClaudeModal60FPSClean>
  );
};
```

**Impact:** Remove ~400 lines of duplicate modal boilerplate

### 4. Stats Component Architecture
**Files:**
- `features/storage/components/GameUIStorageStats.tsx` (713 lines)
- `features/env/components/CyberpunkEnvVarStats.tsx` (492 lines)
- `features/react-query/components/GameUIQueryStats.tsx` (229 lines) ✅ Already optimized!

**Duplicated Patterns:**
- Health calculation logic
- Status pulse animations
- Bottom stats bar structure
- Empty state handling
- Grid layout patterns

**Solution:**
```typescript
// Create: shared/ui/gameUI/components/BaseStatsComponent.tsx
interface BaseStatsConfig {
  title: string;
  metrics: StatsMetric[];
  healthCalculation: (data: any) => number;
  emptyState?: React.ReactNode;
}

// Note: GameUIQueryStats already uses GameUICompactStats - this is the pattern!
```

**Impact:** Remove ~300 lines, standardize stats displays

### 5. Filter Management Pattern
**Files:**
- `features/network/components/NetworkFilterView.tsx` (555 lines)
- `features/storage/components/StorageFilterView.tsx`
- `features/sentry/components/SentryFilterView.tsx`

**Duplicated Logic:**
- AsyncStorage filter persistence
- Add/remove pattern management
- Filter chip rendering
- Tab-based filtering UI

**Solution:**
```typescript
// Create: shared/hooks/useFilterPersistence.ts
export function useFilterPersistence<T>(
  storageKey: string,
  defaultFilters: T
) {
  // Extract AsyncStorage logic
}

// Create: shared/ui/filters/BaseFilterView.tsx
export const BaseFilterView = ({
  filters,
  onFilterChange,
  filterOptions,
  ...
}) => {
  // Extract common filter UI
};
```

**Impact:** Remove ~200 lines of filter management code

---

## 🟢 MEDIUM PRIORITY: Reusable Patterns

### 6. Tick/Interval Hooks
**Files:**
- `features/storage/hooks/useTickEverySecond.tsx`
- `features/sentry/hooks/useTickEveryMinute.tsx`

**Solution:**
```typescript
// Create: shared/hooks/useInterval.ts
export function useInterval(callback: () => void, delay: number | null) {
  // Generic interval implementation
}

export const useTickEverySecond = () => useInterval(() => {}, 1000);
export const useTickEveryMinute = () => useInterval(() => {}, 60000);
```

**Impact:** Remove 40 lines, provide flexible timing utilities

### 7. Event Detail Views
**Files:**
- `features/network/components/NetworkEventDetailView.tsx`
- `features/sentry/components/SentryEventDetailView.tsx`
- `features/storage/components/StorageEventDetailContent.tsx`

**Common Patterns:**
- Header with timestamp
- Collapsible sections
- JSON data display
- Copy to clipboard functionality

**Solution:**
```typescript
// Create: shared/ui/details/BaseEventDetailView.tsx
interface EventDetailSection {
  title: string;
  data: any;
  renderContent?: (data: any) => React.ReactNode;
}
```

**Impact:** Remove ~150 lines of detail view boilerplate

### 8. Empty State Components
**Files:**
- Multiple features have similar empty state displays
- `features/log-dump/EmptyStates.tsx` (good example to extend)

**Solution:**
```typescript
// Enhance: shared/ui/components/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  variant?: 'default' | 'gaming' | 'cyberpunk';
}
```

**Impact:** Standardize empty states across all features

---

## 🔵 LOW PRIORITY: Nice-to-Have Improvements

### 9. Input Component Themes
**Files:**
- `features/react-query/components/shared/CyberpunkInput.tsx` (517 lines)
- `features/react-query/components/shared/NebulaInput.tsx` (372 lines)

**Solution:**
```typescript
// Create: shared/ui/inputs/ThemedInput.tsx
interface ThemedInputProps extends TextInputProps {
  theme: 'cyberpunk' | 'nebula' | 'default';
  // ... common props
}
```

**Impact:** Remove ~400 lines, provide consistent input styling

### 10. Button Components
**Current State:**
- Various button implementations scattered throughout
- `shared/ui/console/CyberpunkButtonOutline.tsx`
- `shared/ui/console/GalaxyButton.tsx`
- Inline TouchableOpacity patterns

**Solution:**
```typescript
// Create: shared/ui/buttons/index.ts
export { BaseButton } from './BaseButton';
export { IconButton } from './IconButton';
export { ActionButton } from './ActionButton';
// Theme variants
```

### 11. List Item Components
**Pattern appears in:**
- `NetworkEventItem` / `NetworkEventItemCompact`
- `SentryEventLogEntryItem` / `SentryEventLogEntryItemCompact`
- `LogEntryItem`

**Solution:**
```typescript
// Create: shared/ui/lists/BaseListItem.tsx
interface BaseListItemProps {
  title: string;
  subtitle?: string;
  timestamp?: Date;
  status?: 'success' | 'error' | 'warning' | 'info';
  compact?: boolean;
  onPress?: () => void;
}
```

---

## Implementation Strategy

### Phase 1: Critical & High Priority (Week 1)
1. ✅ Extract `formatRelativeTime` to shared utils
2. ✅ Remove duplicate color definitions, use existing `gameUIColors`
3. ✅ Create `BaseFeatureModal` component
4. ✅ Extract filter persistence hooks

### Phase 2: Medium Priority (Week 2)
5. ✅ Create base stats component architecture
6. ✅ Consolidate tick/interval hooks
7. ✅ Extract event detail view patterns
8. ✅ Enhance empty state system

### Phase 3: Low Priority (Week 3+)
9. ⏳ Unify input components with theme system
10. ⏳ Standardize button components
11. ⏳ Create base list item components

---

## Estimated Impact

### Metrics
- **Lines of Code Reduction:** ~1,200-1,500 lines (15-20% reduction)
- **Components Affected:** 25+ components
- **Files to Modify:** ~40 files
- **New Shared Components:** ~12-15 components/utilities

### Benefits
1. **Reduced Bundle Size:** Smaller npm package for consumers
2. **Easier Maintenance:** Single source of truth for common patterns
3. **Consistent UX:** Standardized behaviors across all dev tools
4. **Faster Development:** New features can leverage existing components
5. **Better Testing:** Test shared components once, benefit everywhere

### Risks & Mitigation
- **Risk:** Over-abstraction making code harder to understand
  - **Mitigation:** Keep abstractions simple, well-documented
- **Risk:** Breaking existing functionality during refactor
  - **Mitigation:** Incremental changes, comprehensive testing
- **Risk:** Performance impact from additional abstraction layers
  - **Mitigation:** Profile before/after, use React.memo where appropriate

---

## Code Organization Recommendations

### Proposed Shared Structure
```
shared/
├── ui/
│   ├── modals/
│   │   ├── BaseFeatureModal.tsx
│   │   ├── ModalHeader.tsx
│   │   └── hooks/
│   │       └── useModalPersistence.ts
│   ├── filters/
│   │   ├── BaseFilterView.tsx
│   │   ├── FilterChip.tsx
│   │   └── hooks/
│   │       └── useFilterPersistence.ts
│   ├── stats/
│   │   ├── BaseStatsComponent.tsx
│   │   ├── StatsMetric.tsx
│   │   └── HealthIndicator.tsx
│   ├── details/
│   │   ├── BaseEventDetailView.tsx
│   │   └── DetailSection.tsx
│   ├── lists/
│   │   ├── BaseListItem.tsx
│   │   └── VirtualizedList.tsx
│   └── inputs/
│       └── ThemedInput.tsx
├── hooks/
│   ├── useInterval.ts
│   ├── useAsyncStorage.ts
│   └── useDebounce.ts
└── utils/
    ├── time/
    │   ├── formatRelativeTime.ts
    │   └── formatTimestamp.ts
    ├── data/
    │   ├── safeStringify.ts
    │   └── formatBytes.ts
    └── clipboard/
        └── copyToClipboard.ts
```

---

## Conclusion

The codebase shows good component composition principles but has accumulated duplicate patterns as features were developed independently. By extracting these common patterns into shared components, we can:

1. **Reduce codebase by 15-20%**
2. **Improve consistency** across all dev tools
3. **Accelerate future development** with reusable components
4. **Simplify maintenance** with single sources of truth

The highest ROI improvements are the Critical and High Priority items, which should be tackled first. The existing `GameUICompactStats` and `gameUIColors` demonstrate the right pattern - we need to apply this approach more broadly across the codebase.

## Next Steps

1. **Review & Approve** this document with the team
2. **Create tickets** for each extraction task
3. **Start with Critical items** (exact duplicates)
4. **Establish patterns** that new features must follow
5. **Document shared components** for easy discovery