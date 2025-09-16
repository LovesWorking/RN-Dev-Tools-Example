# Storage Inspector Fix Plan

## Current Issue
The storage inspector shows "0 keys" even though AsyncStorage has data. The root cause is that the code was copied from a React Query-based implementation but key components were left as placeholders.

## Architecture Analysis

### Current (Broken) Flow
1. `StorageModalWithTabs` renders with two tabs: "browser" and "events"
2. Browser tab shows `StorageBrowserMode` → `GameUIStorageBrowser`
3. `GameUIStorageBrowser` tries to get data from React Query cache using:
   - `queryClient.getQueryCache().getAll()`
   - Filters queries with `isStorageQuery(query.queryKey)`
   - Expects query keys like `["#storage", "async", key]`
4. **PROBLEM**: No code actually populates these React Query cache entries
5. Three files have "This is a placeholder" instead of real implementation:
   - `useStorageQueryCounts.ts`
   - `storageQueryUtils.ts`
   - `DataViewer.tsx`

### Working Event System (for reference)
The Events tab works correctly because it:
1. Uses `AsyncStorageListener` to intercept AsyncStorage method calls
2. Directly captures events without React Query
3. Maintains its own state with `useState<AsyncStorageEvent[]>`
4. Updates in real-time when storage operations occur

## Proposed Solution

### Remove React Query Dependency
Instead of fixing the React Query integration, we'll follow the same pattern as the Events system:
1. Load AsyncStorage data directly (like Events does with listeners)
2. Store in component state (like Events does with `useState`)
3. Remove all React Query dependencies

### Implementation Steps

#### Step 1: Create Direct Storage Data Hook
Create `useAsyncStorageKeys` hook that:
- Calls `AsyncStorage.getAllKeys()` to get all keys
- Calls `AsyncStorage.multiGet(keys)` to get all values
- Returns formatted data structure matching current `StorageKeyInfo` type
- Refreshes on interval or manual trigger

#### Step 2: Update GameUIStorageBrowser
Modify to:
- Accept storage data as props instead of reading from React Query
- Remove all `queryClient` usage
- Keep existing UI/filtering/display logic

#### Step 3: Fix Placeholder Files
Replace the three placeholder files:

**1. `useStorageQueryCounts.ts`**
- Currently: Returns placeholder hook that gets counts from React Query
- Fix: Create direct counting logic from AsyncStorage data
- Return: `{ total, async, mmkv, secure }` counts

**2. `storageQueryUtils.ts`**
- Currently: Has query key builders and type checkers for React Query
- Fix: Convert to simple storage utilities
- Keep: Type definitions and formatting functions
- Remove: Query key builders

**3. `DataViewer.tsx`**
- Currently: Placeholder for data visualization
- Fix: Implement proper JSON/data viewer component
- Use: The working `VirtualizedDataExplorer` from DiffViewer

#### Step 4: Update StorageBrowserMode
Connect the new hook:
```typescript
export function StorageBrowserMode({ requiredStorageKeys = [] }) {
  const storageData = useAsyncStorageKeys();
  return <GameUIStorageBrowser
    storageData={storageData}
    requiredStorageKeys={requiredStorageKeys}
  />;
}
```

## File Changes Required

### New Files
1. `/src/hooks/useAsyncStorageKeys.ts` - Direct AsyncStorage data loading

### Files to Modify
1. `/src/components/GameUIStorageBrowser.tsx` - Remove React Query, accept props
2. `/src/components/StorageBrowserMode.tsx` - Use new hook, pass data as props
3. `/src/components/StorageSection.tsx` - Update to use new counting logic

### Files to Fix (Remove Placeholders)
1. `/src/external/react-query/hooks/useStorageQueryCounts.ts`
2. `/src/external/react-query/utils/storageQueryUtils.ts`
3. `/src/external/react-query/components/shared/DataViewer.tsx`

### Files to Potentially Remove
1. `/src/hooks/useAsyncStorageData.ts` - The React Query version I just created

## Data Structure

### Current StorageKeyInfo (keep as-is)
```typescript
interface StorageKeyInfo {
  key: string;
  value: unknown;
  storageType: StorageType;
  status: "required_present" | "required_missing" | "optional_present" | ...;
  category: "required" | "optional";
  description?: string;
  expectedValue?: unknown;
  expectedType?: string;
}
```

### New Hook Return Type
```typescript
interface StorageData {
  keys: StorageKeyInfo[];
  devToolKeys: StorageKeyInfo[];
  stats: StorageKeyStats;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}
```

## Benefits of This Approach

1. **Simpler**: No React Query complexity
2. **Consistent**: Matches the Events tab pattern
3. **Direct**: Straight AsyncStorage access like Events
4. **Maintainable**: Less abstraction, easier to debug
5. **Working Model**: Events tab already proves this pattern works

## Testing Plan

1. Verify AsyncStorage has test data (already added in app/index.tsx)
2. Check that keys load and display in Browser tab
3. Ensure refresh functionality works
4. Test filtering and search features
5. Verify dev tool keys are properly hidden/shown
6. Confirm required key validation works

## Priority Order

1. **High Priority**: Get basic key loading working
   - Create `useAsyncStorageKeys` hook
   - Update `GameUIStorageBrowser` to use it
   - Fix `useStorageQueryCounts.ts` placeholder

2. **Medium Priority**: Fix visualization
   - Fix `DataViewer.tsx` placeholder
   - Ensure value display works properly

3. **Low Priority**: Cleanup
   - Remove React Query utilities if truly not needed
   - Optimize refresh/polling logic

## Questions to Resolve

1. Should we keep the `external/react-query` folder structure or reorganize?
2. Do we need MMKV and SecureStore support now or just AsyncStorage?
3. Should the refresh be automatic (interval) or manual only?

## Next Steps

Once this plan is approved:
1. Implement the `useAsyncStorageKeys` hook
2. Update components to use direct data
3. Fix all placeholder files
4. Test thoroughly with screenshots
5. Clean up unused React Query code