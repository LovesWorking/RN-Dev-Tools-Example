# EnvVarsModal Migration Plan

## Goal
Make `react-native-env-manager` a self-contained package with its own modal implementation, following the same pattern as `react-native-react-query-devtools`.

## Current State
- **Modal Location**: `rn-better-dev-tools/src/components/env/EnvVarsModal.tsx`
- **Dependencies**: Tightly coupled to app's JsModal system
- **Package Exports**: Only utilities and hooks, no UI components

## Target State
- Self-contained modal within the package
- Independent modal management
- Clean API surface matching ReactQueryDevTools pattern

## Migration Steps

### Phase 1: Setup Package Structure
- [ ] Create `src/components/` directory structure
- [ ] Create `src/hooks/` for modal management
- [ ] Create `src/icons/` for any env-specific icons

### Phase 2: Copy and Adapt Core Components
From `rn-better-dev-tools/src/components/env/`:
- [ ] Copy `EnvVarsModal.tsx` → `src/components/modals/EnvManagerModal.tsx`
- [ ] Copy `EnvVarSection.tsx` → `src/components/EnvVarSection.tsx`
- [ ] Copy `EnvStatsOverview.tsx` → `src/components/EnvStatsOverview.tsx`
- [ ] Copy `GameUIEnvContent.tsx` → `src/components/GameUIEnvContent.tsx`
- [ ] Copy `EnvVarsSection.tsx` → `src/components/EnvVarsSection.tsx`
- [ ] Copy `EnvVarRow.tsx` → `src/components/EnvVarRow.tsx`

### Phase 3: Create Modal Management Hook
- [ ] Create `src/hooks/useModalManager.ts` (similar to ReactQuery's pattern)
  - Handle modal open/close state
  - Manage active filters
  - Handle search state
  - Persist user preferences

### Phase 4: Replace JsModal Dependency
- [ ] Copy minimal JsModal implementation or create new modal wrapper
- [ ] Options:
  1. Copy JsModal as internal component (if lightweight)
  2. Create simplified modal using react-native-modal
  3. Use basic React Native Modal with custom styling

### Phase 5: Copy Shared Dependencies
From `rn-better-dev-tools/src/shared/`:
- [ ] Copy required UI components (ModalHeader, HeaderSearchButton, etc.)
- [ ] Copy gameUI constants and colors
- [ ] Copy utility functions (displayValue, etc.)
- [ ] Update import paths to be package-relative

### Phase 6: Create Main Export Component
- [ ] Create `src/EnvManager.tsx` as main entry point
  ```tsx
  export type EnvManagerProps = {
    visible?: boolean;
    onClose?: () => void;
    requiredEnvVars: RequiredEnvVar[];
    defaultFilter?: string | null;
    enableSharedModalDimensions?: boolean;
    showFloatingButton?: boolean;
    floatingButtonPosition?: { bottom?: number; right?: number };
  };
  ```

### Phase 7: Update Package Exports
- [ ] Update `src/index.ts` to export:
  - `EnvManager` component
  - All existing utilities and types
  - Hook exports

### Phase 8: Handle Icons
- [ ] Copy EnvLaptopIcon to package
- [ ] Copy any other required icons
- [ ] Create icon index file

### Phase 9: Testing Integration
- [ ] Update app/index.tsx to import from package
- [ ] Test controlled mode (visible/onClose)
- [ ] Test uncontrolled mode (floating button)
- [ ] Verify all functionality works

### Phase 10: Cleanup
- [ ] Remove old EnvVarsModal from rn-better-dev-tools
- [ ] Remove unused env components from rn-better-dev-tools
- [ ] Update any remaining imports
- [ ] Document breaking changes

## API Design (Following ReactQueryDevTools Pattern)

### Controlled Usage
```tsx
import { EnvManager } from '@rn-dev-tools/react-native-env-manager';

<EnvManager
  visible={isOpen}
  onClose={() => setIsOpen(false)}
  requiredEnvVars={requiredEnvVars}
/>
```

### Uncontrolled Usage (with floating button)
```tsx
<EnvManager
  requiredEnvVars={requiredEnvVars}
  showFloatingButton={true}
  floatingButtonPosition={{ bottom: 100, right: 20 }}
/>
```

## Dependencies to Resolve
1. **JsModal** - Need to decide on modal implementation strategy
2. **Shared UI Components** - Copy vs create new vs extract to shared package
3. **Storage Keys** - Copy devToolsStorageKeys or create env-specific keys
4. **Icons** - Ensure all icons are available in package

## Success Criteria
- [ ] Package is fully self-contained
- [ ] No dependencies on rn-better-dev-tools
- [ ] Works in both controlled and uncontrolled modes
- [ ] Maintains all current functionality
- [ ] Clean, documented API
- [ ] No breaking changes for existing users (if possible)

## Notes
- Consider creating a shared UI package for common components if both env and network packages need them
- Ensure backward compatibility where possible
- Add proper TypeScript exports
- Include README with usage examples