# NetworkModal Migration Plan

## Goal
Make `react-native-network-inspector` a self-contained package with complete modal implementation, following the same pattern as `react-native-react-query-devtools`.

## Current State
- **Modal Location**: `rn-better-dev-tools/src/components/network/NetworkModal.tsx`
- **Dependencies**: Tightly coupled to app's JsModal system
- **Package Exports**: Only `SimpleNetworkModal`, utilities, and one UI component

## Target State
- Full-featured NetworkInspector component within the package
- Independent modal management with detail views
- Clean API surface matching ReactQueryDevTools pattern

## Migration Steps

### Phase 1: Setup Package Structure
- [ ] Create comprehensive directory structure:
  ```
  src/
    components/
      modals/
      filters/
      detail-views/
      list-items/
    hooks/
    icons/
    utils/
  ```

### Phase 2: Copy and Adapt Core Components
From `rn-better-dev-tools/src/components/network/`:
- [ ] Copy `NetworkModal.tsx` → `src/components/modals/NetworkInspectorModal.tsx`
- [ ] Copy `NetworkEventItemCompact.tsx` → `src/components/list-items/NetworkEventItemCompact.tsx`
- [ ] Copy `NetworkFilterViewV3.tsx` → `src/components/filters/NetworkFilterView.tsx`
- [ ] Copy `NetworkEventDetailView.tsx` → `src/components/detail-views/NetworkEventDetailView.tsx`
- [ ] Copy any other network-related components

### Phase 3: Create Modal Management System
- [ ] Create `src/hooks/useModalManager.ts`
  - Modal open/close state
  - Selected event management
  - Filter state (status, method, search)
  - Detail view navigation
- [ ] Create `src/hooks/useNetworkFilters.ts`
  - Filter logic
  - Search functionality
  - Status/method filtering

### Phase 4: Replace JsModal Dependency
- [ ] Evaluate modal options:
  1. Copy JsModal implementation (check complexity)
  2. Use react-native-modal package
  3. Create custom modal with gesture support
- [ ] Implement chosen solution
- [ ] Add swipe-to-dismiss functionality
- [ ] Add modal sizing/positioning logic

### Phase 5: Copy Shared Dependencies
From `rn-better-dev-tools/src/shared/`:
- [ ] Copy ModalHeader component
- [ ] Copy macOSColors constants
- [ ] Copy gameUI styling if used
- [ ] Copy TickProvider or implement similar
- [ ] Update all import paths

### Phase 6: Enhance Detail View
- [ ] Create comprehensive NetworkEventDetailView
- [ ] Add request headers view
- [ ] Add response headers view
- [ ] Add request/response body viewers
- [ ] Add timing breakdown view
- [ ] Add copy functionality for URLs, headers, bodies

### Phase 7: Create Main Export Component
- [ ] Create `src/NetworkInspector.tsx` as main entry point
  ```tsx
  export type NetworkInspectorProps = {
    // Controlled mode
    visible?: boolean;
    onClose?: () => void;

    // Filtering
    defaultFilter?: 'all' | 'success' | 'error' | 'pending';
    defaultSearchQuery?: string;

    // UI options
    enableSharedModalDimensions?: boolean;
    showFloatingButton?: boolean;
    floatingButtonPosition?: { bottom?: number; right?: number };

    // Features
    maxEvents?: number;
    enableExport?: boolean;
    enableClear?: boolean;
  };
  ```

### Phase 8: Implement Features
- [ ] Add export functionality (JSON, HAR format)
- [ ] Add clear all events
- [ ] Add pause/resume monitoring
- [ ] Add event persistence (optional)
- [ ] Add performance metrics view

### Phase 9: Handle Icons
- [ ] Copy required icons (Globe, Trash2, Power, Search, Filter, etc.)
- [ ] Create icon index file
- [ ] Consider icon optimization

### Phase 10: Update Package Exports
- [ ] Update `src/index.ts`:
  ```tsx
  // Main component
  export { NetworkInspector } from './NetworkInspector';
  export type { NetworkInspectorProps } from './NetworkInspector';

  // Keep existing exports
  export { SimpleNetworkModal } from './components/SimpleNetworkModal';
  // ... other existing exports
  ```

### Phase 11: Testing Integration
- [ ] Update app/index.tsx to use new NetworkInspector
- [ ] Test controlled mode
- [ ] Test uncontrolled mode with floating button
- [ ] Test all filters and search
- [ ] Test detail view navigation
- [ ] Test export functionality
- [ ] Performance test with many events

### Phase 12: Cleanup
- [ ] Remove old NetworkModal from rn-better-dev-tools
- [ ] Remove unused network components from rn-better-dev-tools
- [ ] Update any remaining imports
- [ ] Add deprecation notice to SimpleNetworkModal if replacing

## API Design (Following ReactQueryDevTools Pattern)

### Controlled Usage
```tsx
import { NetworkInspector } from '@rn-dev-tools/react-native-network-inspector';

<NetworkInspector
  visible={isOpen}
  onClose={() => setIsOpen(false)}
  defaultFilter="error"
/>
```

### Uncontrolled Usage (with floating button)
```tsx
<NetworkInspector
  showFloatingButton={true}
  floatingButtonPosition={{ bottom: 100, right: 20 }}
  maxEvents={500}
/>
```

### Advanced Usage
```tsx
<NetworkInspector
  visible={isOpen}
  onClose={handleClose}
  defaultFilter="all"
  enableExport={true}
  enableClear={true}
  maxEvents={1000}
  onEventSelect={(event) => console.log('Selected:', event)}
/>
```

## Features to Implement

### Core Features (Must Have)
- [ ] Event list with real-time updates
- [ ] Basic filtering (status, method)
- [ ] Search functionality
- [ ] Event detail view
- [ ] Clear events
- [ ] Pause/resume monitoring

### Enhanced Features (Nice to Have)
- [ ] Export to JSON/HAR
- [ ] Request/response body search
- [ ] Performance metrics
- [ ] Event grouping by domain
- [ ] Request replay functionality
- [ ] Size analysis
- [ ] Timing waterfall chart

## Dependencies to Resolve
1. **JsModal** - Decide on modal implementation
2. **TickProvider** - Copy or reimplement
3. **Shared UI Components** - Strategy for sharing
4. **Storage** - Event persistence strategy
5. **Icons** - Complete icon set needed

## Performance Considerations
- [ ] Virtual list for large event counts
- [ ] Debounced search
- [ ] Lazy loading of event details
- [ ] Memory management for event storage
- [ ] Efficient filtering algorithms

## Success Criteria
- [ ] Fully self-contained package
- [ ] No dependencies on rn-better-dev-tools
- [ ] Feature parity with current implementation
- [ ] Enhanced detail views
- [ ] Clean, well-documented API
- [ ] Performance with 1000+ events
- [ ] Smooth animations and interactions

## Migration Strategy
1. **Phase 1**: Create new NetworkInspector alongside existing exports
2. **Phase 2**: Migrate app to use new component
3. **Phase 3**: Deprecate old components
4. **Phase 4**: Remove old code in next major version

## Notes
- Consider creating shared UI package for common components
- Ensure backward compatibility for SimpleNetworkModal users
- Add comprehensive examples to README
- Consider adding storybook stories for components
- Add proper accessibility labels
- Consider i18n support for future