# UI Components Extraction Plan

## Overview
After reviewing the codebase, I've identified several UI component groups that are strong candidates for extraction into standalone npm packages. These components are currently in `rn-better-dev-tools/src/shared/ui/` and demonstrate high reusability potential.

## Recommended Packages for Extraction

### 1. `@rn-dev-tools/react-native-ui-primitives`
**Priority: HIGH**

Core UI building blocks that can be used across any React Native project:

- **Components to extract:**
  - `BackButton` - Standard back navigation button
  - `Badge` - Status/label badges
  - `CloseButton` - Modal/dialog close button
  - `Divider` - Visual separator component
  - `SearchBar` - Full-featured search input with suggestions
  - `TabSelector` - Tab navigation component
  - `TimeDisplay` - Formatted time display component
  - `CopyButton` - Clipboard copy functionality
  - `EmptyState` - Empty state displays
  - `ErrorBoundary` - Error handling wrapper

- **Benefits:**
  - Zero external dependencies (pure React Native)
  - Commonly needed in most apps
  - Well-tested, production-ready components
  - Consistent API design

### 2. `@rn-dev-tools/react-native-collapsible`
**Priority: HIGH**

Advanced collapsible/expandable components:

- **Components to extract:**
  - `CollapsibleSection` - Basic collapsible container
  - `ExpandableSection` - Enhanced expandable with animations
  - `ExpandableSectionHeader` - Customizable section headers
  - `ExpandableSectionWithModal` - Expandable with modal support
  - `DraggableHeader` - Draggable header for sheets/modals

- **Benefits:**
  - Solves common UI pattern needs
  - Smooth animations included
  - Accessibility support built-in
  - Can be used independently of dev tools

### 3. `@rn-dev-tools/react-native-data-inspector`
**Priority: MEDIUM**

Data visualization and inspection components:

- **Components to extract:**
  - `DataInspector` - JSON/object tree viewer
  - `ValueTypeBadge` - Type indicator badges
  - `TypeBadge` - Data type display
  - `DetailView` - Detailed data view
  - `StatsCard` - Statistics display card with grid layout

- **Benefits:**
  - Useful for debugging tools
  - Admin panels and dashboards
  - Developer-focused apps
  - Clean data presentation

### 4. `@rn-dev-tools/react-native-game-ui`
**Priority: LOW**

Specialized gaming/cyberpunk themed UI components:

- **Components to extract:**
  - All components in `gameUI/` directory
  - `GalaxyButton` - Animated space-themed button
  - `CyberpunkButtonOutline` - Cyberpunk styled button
  - `ConsoleSection` - Terminal-style sections
  - Game UI color system and themes

- **Benefits:**
  - Complete themed UI system
  - Unique aesthetic for gaming/tech apps
  - Includes animations and effects
  - Cohesive design language

### 5. `@rn-dev-tools/react-native-filter-controls`
**Priority: MEDIUM**

Filtering and control components:

- **Components to extract:**
  - `CompactFilterChips` - Filter chip selector
  - `FilterViewPattern` - Filter view template
  - `DynamicFilterView` - Dynamic filter builder
  - `StatusIndicator` - Status display component

- **Benefits:**
  - Common pattern in data-heavy apps
  - Reusable filter logic
  - Consistent UX patterns

## Components Already Well-Positioned

The following are already in good locations and don't need extraction:

1. **Feature-specific components** in `rn-better-dev-tools/src/features/`:
   - React Query browser components
   - Sentry logging components
   - Log dump components
   These are tightly coupled to their features and should remain.

2. **App-specific components** in root `components/`:
   - Pokemon demo components
   - App-specific themed components
   These are example/demo components specific to this app.

## Extraction Process Template

For each package extraction:

1. **Setup Package Structure:**
   ```
   packages/[package-name]/
   ├── src/
   │   ├── index.ts
   │   ├── components/
   │   ├── hooks/
   │   └── types/
   ├── package.json
   ├── tsconfig.json
   └── README.md
   ```

2. **Configuration Requirements:**
   - Use React Native Bob for building
   - TypeScript support
   - Peer dependencies on React & React Native
   - Proper exports for CommonJS and ES modules

3. **Testing Strategy:**
   - Move existing tests with components
   - Add Storybook stories if applicable
   - Include example usage in README

## Implementation Priority

1. **Phase 1 (Immediate):**
   - `@rn-dev-tools/react-native-ui-primitives`
   - `@rn-dev-tools/react-native-collapsible`

2. **Phase 2 (Next Sprint):**
   - `@rn-dev-tools/react-native-data-inspector`
   - `@rn-dev-tools/react-native-filter-controls`

3. **Phase 3 (Future):**
   - `@rn-dev-tools/react-native-game-ui`

## Benefits of Extraction

1. **Reusability:** Components can be used in other projects
2. **Maintainability:** Clear separation of concerns
3. **Testing:** Easier to test in isolation
4. **Documentation:** Each package can have focused docs
5. **Version Management:** Independent versioning and updates
6. **Community:** Can be open-sourced separately if desired
7. **Tree Shaking:** Better bundle optimization

## Next Steps

1. Review and approve this extraction plan
2. Start with Phase 1 packages
3. Create package boilerplate using existing package structure
4. Move components and update imports
5. Add comprehensive documentation
6. Test integration with main app
7. Consider publishing to npm registry

## Notes

- All extracted packages should follow the `@rn-dev-tools/` namespace
- Maintain backward compatibility during extraction
- Consider creating a migration guide for existing code
- Each package should be independently installable and usable