# TODO: React Query DevTools Package Migration

## Package Setup and Structure

- [x] [#001] Create initial package structure and configuration
      → Create packages/react-native-react-query-devtools directory
      → Create src directory with subdirectories (components, hooks, utils, types)
      → Create package.json with standard configuration following DEV_TOOL_PACKAGE_PATTERNS.md
      → Add name as @rn-dev-tools/react-native-react-query-devtools
      → Add version 0.1.0 and description "React Query DevTools for React Native"
      → Configure main, module, types, and exports fields
      → Add scripts (typecheck, lint, clean, build, prepare, prepublishOnly)
      → Add react-native-builder-bob configuration
      → Create tsconfig.json with strict TypeScript settings
      → Create tsconfig.build.json extending base config
      → Create .gitignore with standard patterns
      → Create README.md with package documentation

- [x] [#002] Install and configure all required dependencies
      → Add @tanstack/react-query as peer dependency
      → Add react and react-native as peer dependencies
      → Add react-native-svg as peer dependency (for SVG icons)
      → Add @react-native-async-storage/async-storage as peer dependency
      → Add typescript and @types/react as dev dependencies
      → Add @types/react-native as dev dependency
      → Add react-native-builder-bob as dev dependency
      → Add eslint and prettier with configurations
      → Add rimraf for clean script
      → Run npm install to verify all dependencies resolve
      → Verify package builds with npm run build

## Core Types Migration

- [x] [#003] Migrate and consolidate type definitions
      → Create src/types/index.ts as main type export file
      → Copy JsonValue type and related types from types/types.ts
      → Copy isPlainObject type guard function
      → Create QueryDevToolsProps interface for main component
      → Create ModalMode type union for different modal states
      → Create DevToolsTheme interface for theming support
      → Add proper type exports in index file
      → Test type imports work correctly

## Shared Utilities Migration

- [x] [#004] Extract and migrate shared utility functions
      → Create src/utils/index.ts as main utils export
      → Copy safeStringify utility from shared/utils
      → Copy displayValue utility from shared/utils
      → Migrate deleteNestedDataByPath utility
      → Migrate updateNestedDataByPath utility
      → Migrate getQueryStatusColor utility
      → Migrate getQueryStatusLabel utility
      → Create storageKeys utility replacing devToolsStorageKeys dependency
      → Test all utilities work independently

- [x] [#005] Migrate storage-related utilities
      → Create src/utils/storage.ts for storage operations
      → Migrate modalStorageOperations utility
      → Migrate storageQueryUtils functions
      → Migrate getStorageQueryCounts utility
      → Replace @/rn-better-dev-tools storage key imports with local version
      → Add AsyncStorage operations wrapper
      → Test storage operations work correctly

## Component Migration - Shared Components

- [x] [#006] Migrate shared/reusable UI components
      → Create src/components/shared directory
      → Migrate VirtualizedDataExplorer component
      → Migrate DataViewer component
      → Migrate TypeLegend component
      → Migrate IndentGuides and IndentGuidesOverlay components
      → Migrate CyberpunkInput component
      → Create local color constants to replace gameUIColors imports
      → Create index.ts with all shared component exports
      → Test components render without external dependencies

## Component Migration - Query Browser

- [x] [#007] Migrate query browser core components
      → Create src/components/query-browser directory
      → Migrate QueryBrowser main component
      → Migrate QueryRow component
      → Migrate QueryDetails component
      → Migrate QueryInformation component
      → Migrate QueryActions component
      → Migrate QueryStatus component
      → Migrate QueryStatusCount component
      → Migrate QueryDetailsChip component
      → Create index.ts with all query browser exports

- [x] [#008] Migrate query browser action components
      → Migrate Explorer component to query-browser directory
      → Migrate ActionButton component
      → Migrate ClearCacheButton component
      → Migrate NetworkToggleButton component
      → Migrate StorageStatusCount component
      → Migrate SVG icons from svgs.tsx
      → Update all import paths to local references
      → Test all action buttons work correctly

## Component Migration - Mutations

- [x] [#009] Migrate mutation-related components
      → Migrate MutationsList component
      → Migrate MutationDetails component
      → Migrate MutationInformation component
      → Migrate MutationButton component
      → Migrate MutationStatusCount component
      → Migrate MutationDetailsChips component
      → Update imports to use local paths
      → Test mutation components render correctly

## Component Migration - Modals

- [x] [#010] Migrate modal components and structure
      → Create src/components/modals directory
      → Migrate ReactQueryModal main modal component
      → Migrate ReactQueryModalHeader component
      → Migrate QueryBrowserModal component
      → Migrate MutationBrowserModal component
      → Migrate DataEditorModal component
      → Migrate MutationEditorModal component
      → Migrate QueryBrowserFooter component
      → Migrate MutationBrowserFooter component
      → Migrate SwipeIndicator component
      → Create index.ts with all modal exports

## Component Migration - Mode Components

- [x] [#011] Migrate mode-specific components
      → Create src/components/modes directory
      → Migrate QueryBrowserMode component
      → Migrate DataEditorMode component
      → Migrate MutationBrowserMode component
      → Migrate MutationEditorMode component
      → Migrate QuerySelector component
      → Migrate WifiToggle component
      → Replace useSafeAreaInsets with react-native-safe-area-context
      → Update all imports to local paths

## Hooks Migration

- [xTest Session] [#012] Migrate all custom React hooks
  → Create src/hooks directory with index.ts
  → Migrate useAllQueries hook
  → Migrate useAllMutations hook
  → Migrate useSelectedQuery hook
  → Migrate useSelectedMutation hook
  → Migrate useQueryStatusCounts hook
  → Migrate useStorageQueryCounts hook
  → Migrate useWifiState hook
  → Migrate useModalManager hook
  → Migrate useModalPersistence hook
  → Migrate useActionButtons hook
  → Migrate useMutationActionButtons hook
  → Migrate useReactQueryState hook
  → Test all hooks work with local dependencies

## Action Utilities Migration

- [ ] [#013] Migrate query/mutation action utilities
      → Create src/utils/actions directory
      → Migrate deleteItem action utility
      → Migrate invalidate action utility
      → Migrate refetch action utility
      → Migrate remove action utility
      → Migrate reset action utility
      → Migrate triggerError action utility
      → Migrate triggerLoading action utility
      → Create index.ts with all action exports
      → Test actions work with React Query client

## Theme and Styling

- [ ] [#014] Create standalone theme system
      → Create src/theme directory
      → Extract color constants from gameUIColors dependencies
      → Extract macOSColors constants
      → Create default theme configuration
      → Create ThemeProvider component for customization
      → Add theme type definitions
      → Create getThemeColors utility function
      → Update all components to use local theme
      → Test theming works independently

## Main Entry Point

- [ ] [#015] Create main package entry point and exports
      → Create src/index.ts as main entry
      → Export ReactQueryDevTools as main component
      → Export all modal components
      → Export all hooks for external use
      → Export type definitions
      → Export utility functions if needed
      → Create ReactQueryDevToolsProvider wrapper if needed
      → Add JSDoc comments for all exports
      → Test imports work from package root

## Replace External Dependencies

- [ ] [#016] Replace all external shared dependencies
      → Replace @/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets
      → Install react-native-safe-area-context as dependency
      → Replace gameUIColors imports with local theme colors
      → Replace macOSColors imports with local constants
      → Replace CyberpunkSectionButton with local implementation
      → Remove all @/ aliased imports
      → Verify no external dependencies remain
      → Test package works standalone

## Testing and Documentation

- [ ] [#017] Add comprehensive documentation and examples
      → Write detailed README.md with installation instructions
      → Add usage examples for basic setup
      → Document all available props and options
      → Create TypeScript usage examples
      → Add customization and theming guide
      → Document all exported hooks
      → Add troubleshooting section
      → Create CHANGELOG.md file
      → Add contributing guidelines

- [ ] [#018] Create example app and test integration
      → Create example React Native app in examples directory
      → Install @tanstack/react-query in example
      → Configure React Query client
      → Import and use ReactQueryDevTools
      → Test all modal modes work correctly
      → Test query browsing functionality
      → Test mutation browsing functionality
      → Test data editing capabilities
      → Verify package size is reasonable
      → Test on iOS and Android

## Build and Publish Preparation

- [ ] [#019] Prepare package for publishing
      → Run npm run build to generate all outputs
      → Verify lib directory contains all build artifacts
      → Check package.json has correct metadata
      → Update repository and homepage URLs
      → Add keywords for npm discoverability
      → Set proper license (MIT)
      → Run npm pack to test package contents
      → Verify package size is acceptable
      → Test local installation with npm link
      → Create .npmignore if needed

- [ ] [#020] Final validation and cleanup
      → Remove TODO.md from package directory
      → Ensure all console.log statements are removed
      → Run TypeScript strict checks pass
      → Run ESLint and fix any issues
      → Format code with Prettier
      → Verify all imports are correct
      → Test tree-shaking works properly
      → Update version to 0.1.0
      → Create git tag for release
      → Document breaking changes if any

## Post-Migration Tasks

- [ ] [#021] Update main app to use new package
      → Remove old react-query feature directory
      → Install @rn-dev-tools/react-native-react-query-devtools
      → Update imports in main app
      → Test integration works correctly
      → Update any documentation references
      → Remove old code from rn-better-dev-tools
      → Verify bundle size impact
      → Test hot reload still works
      → Update CLAUDE.md if needed

## Optional Enhancements

- [ ] [#022] Add advanced features and optimizations
      → Add query search/filter functionality
      → Add export/import for query data
      → Add performance monitoring
      → Add query timeline view
      → Add network request integration
      → Add dark/light theme toggle
      → Add compact view mode
      → Optimize for large query counts
      → Add query grouping features
      → Consider adding web support

---

## Task Details

### Critical Dependencies to Handle

1. **@tanstack/react-query** - Must be peer dependency
2. **react-native-safe-area-context** - Replace custom hook
3. **react-native-svg** - For icon components
4. **@react-native-async-storage/async-storage** - For persistence

### Files to Extract Colors From

- gameUIColors → Create local `src/theme/colors.ts`
- macOSColors → Create local `src/theme/macOSColors.ts`

### Import Path Replacements

- `@/rn-better-dev-tools/src/shared/*` → Local equivalents
- `@/rn-better-dev-tools/src/features/react-query/*` → Direct local paths

### Package Structure Target

```
packages/react-native-react-query-devtools/
├── src/
│   ├── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── macOSColors.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── index.ts
│   │   ├── storage.ts
│   │   └── actions/
│   ├── hooks/
│   │   └── index.ts
│   └── components/
│       ├── shared/
│       ├── query-browser/
│       ├── modals/
│       └── modes/
├── lib/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── .gitignore
└── README.md
```
