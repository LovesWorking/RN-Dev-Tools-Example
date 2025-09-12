# TODO — Network Inspector Package Compliance

This document tracks what needs fixing in `@rn-dev-tools/react-native-network-inspector` to comply with our package standards. Each task is completely independent and includes all necessary sub-components. Tasks can be completed in any order without dependencies.

## TL;DR
The package works but needs config updates for modern bundlers, TypeScript adjustments, and possibly minimal UI components. All imports are already clean (no forbidden dependencies).

## Package.json Modernization

- [x] [#001] Complete package.json configuration for modern bundlers
      → Add 'files' field with `["lib", "src", "!**/__tests__", "!**/__mocks__"]`
      → Add 'exports' field with proper ESM/CJS/types configuration
      → Add 'sideEffects: false' for tree-shaking
      → Add 'clean' script: `"clean": "rimraf lib"`
      → Verify all paths point to compiled builds in lib/
      → Test package can be imported correctly after changes

## TypeScript Configuration

- [x] [#002] Complete TypeScript configuration update for React Native package
      → Remove "dom" from lib array (React Native doesn't need DOM types)
      → Change "module" to "ESNext" for modern bundlers
      → Update "outDir" to "lib/typescript" to match bob conventions
      → Set "noUnusedLocals": true and "noUnusedParameters": true
      → Remove "noEmit": false (bob handles emit)
      → Run typecheck to verify no new errors
      → Build package to confirm output structure is correct

## Build Tools & Dependencies

- [x] [#003] Set up build tools and verify clean build process
      → Install rimraf@^5.0.0 as devDependency
      → Add clean script to package.json if missing
      → Run clean command to remove old builds
      → Run build command to generate fresh lib/
      → Verify lib/ contains commonjs, module, and typescript folders
      → Test importing the built package from the app

## Code Quality & Import Validation

- [x] [#004] Implement complete import validation system
      → Review all import statements in src/ for forbidden imports
      → Check for any `@/` alias usage (should be none)
      → Check for `rn-better-dev-tools/*` imports (should be none)
      → Create scripts/validate-imports.js validation script
      → Add validation to package.json scripts
      → Run validation and fix any issues found
      → Document validation process in package README

## UI Components Development

- [x] [#005] Build complete minimal UI component system for network inspector
      → Investigate if UI components would help adoption
      → Create SectionButton component for menu tiles
      → Create SimpleNetworkModal for basic viewing
      → Keep all components dependency-free (react/react-native only)
      → Add proper TypeScript types for all props
      → Export components from index.ts
      → Test components render correctly in the app
      → Document component usage in README

## Implementation Notes

**Task Independence:**
Each task above is completely self-contained with all necessary sub-steps. You can:
- Pick any task in any order
- Complete it fully without needing other tasks
- Verify it works independently

**Current Status:**
- All 5 tasks have been completed ✅
- Package has clean imports (no @/ or cross-package refs)
- Package follows all standards from package-plan.md
- Both network-inspector and env-manager packages are now compliant

## Future Package Extractions

- [ ] [#006] Extract complete Storage Inspector as standalone package
      → Create packages/react-native-storage-inspector directory
      → Set up package.json with proper exports and build config
      → Implement useStorageSnapshot hook for data fetching
      → Create StorageSection component for menu integration
      → Build SimpleStorageModal for viewing/editing storage
      → Add support for AsyncStorage, MMKV, and SecureStore
      → Make storage backends injectable via props
      → Test with multiple storage backends
      → Document usage and integration

- [ ] [#007] Extract complete Performance Monitor as standalone package
      → Create packages/react-native-performance-monitor directory
      → Set up package.json following package-plan.md template
      → Implement FPS monitoring and reporting hooks
      → Create memory usage tracking utilities
      → Build PerformanceSection component for menu
      → Create SimplePerformanceModal for metrics display
      → Add configurable performance thresholds
      → Test on both iOS and Android
      → Document performance impact and usage

- [ ] [#008] Extract complete Console/Logger as standalone package
      → Create packages/react-native-console-logger directory
      → Configure package.json with proper module exports
      → Implement log capture and filtering system
      → Create ConsoleSection component for menu
      → Build SimpleConsoleModal for log viewing
      → Add log level filtering (debug, info, warn, error)
      → Implement log export functionality
      → Test with various log volumes
      → Document integration with existing loggers

## Package Maintenance

- [ ] [#009] Set up automated package validation CI/CD
      → Create GitHub workflow for all packages
      → Add import validation checks
      → Run TypeScript checks on all packages
      → Build all packages to verify output
      → Test imports from a sample app
      → Check for dependency violations
      → Generate build status badges
      → Set up automated npm publishing

- [ ] [#010] Create package documentation website
      → Set up Docusaurus or similar
      → Document each package's API
      → Add integration examples
      → Create migration guides
      → Include troubleshooting section
      → Add package comparison matrix
      → Deploy to GitHub Pages
      → Set up search functionality

---

## Working with These Tasks

**For Humans:**
Each task includes everything needed to complete it independently. Pick any task and follow all sub-steps.

**For AI Agents:**
Tasks are designed to be claimed and completed in parallel. Each task ID is unique and includes all necessary context.