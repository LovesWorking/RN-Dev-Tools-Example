# Package Extraction Guide

This document outlines the process for extracting dev tool features from `rn-better-dev-tools/src/features/` into standalone packages.

## Overview

We're modularizing the dev tools by extracting each feature into its own npm package. This allows for:
- Better code organization
- Reusable components across projects
- Independent versioning and updates
- Reduced bundle size when only specific tools are needed

## Completed Extractions

### ✅ Environment Manager
- **Source**: `rn-better-dev-tools/src/features/env/`
- **Package**: `@rn-dev-tools/react-native-env-manager`
- **Status**: Complete and integrated

### ✅ Network Inspector
- **Source**: `rn-better-dev-tools/src/features/network/`
- **Package**: `@rn-dev-tools/react-native-network-inspector`
- **Status**: Complete and integrated

## Remaining Features to Extract

### 🔄 Storage Inspector (Next)
- **Source**: `rn-better-dev-tools/src/features/storage/`
- **Target Package**: `@rn-dev-tools/react-native-storage-inspector`
- **Components to move**:
  - Storage browser and viewer
  - AsyncStorage management
  - Diff viewer components
  - Storage key/value operations

### 📋 React Query DevTools
- **Source**: `rn-better-dev-tools/src/features/react-query/`
- **Target Package**: `@rn-dev-tools/react-native-react-query-devtools`
- **Components to move**:
  - Query browser
  - Mutation browser
  - Data editor
  - Cache management

## Step-by-Step Extraction Process

### 1. Create Package Structure
```bash
mkdir packages/@rn-dev-tools/react-native-[feature-name]
cd packages/@rn-dev-tools/react-native-[feature-name]
```

### 2. Initialize Package
Copy structure from existing packages (env or network):
```
├── package.json (with correct name and dependencies)
├── tsconfig.json
├── tsconfig.build.json
├── src/
│   ├── index.ts (main exports)
│   ├── types/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── lib/ (generated after build)
```

### 3. Package.json Template
```json
{
  "name": "@rn-dev-tools/react-native-[feature-name]",
  "version": "0.1.0",
  "description": "[Feature] inspector for React Native development",
  "main": "lib/commonjs/index",
  "module": "lib/module/index",
  "types": "lib/typescript/index.d.ts",
  "react-native": "src/index",
  "source": "src/index",
  "files": [
    "src",
    "lib",
    "android",
    "ios",
    "cpp",
    "*.podspec",
    "!ios/build",
    "!android/build",
    "!android/gradle",
    "!android/gradlew",
    "!android/gradlew.bat",
    "!android/local.properties",
    "!**/__tests__",
    "!**/__fixtures__",
    "!**/__mocks__",
    "!**/.*"
  ],
  "scripts": {
    "test": "jest",
    "typecheck": "tsc --noEmit",
    "lint": "eslint \"**/*.{js,ts,tsx}\"",
    "prepack": "bob build",
    "release": "release-it",
    "example": "yarn --cwd example",
    "build": "bob build",
    "clean": "del-cli android/build example/android/build example/android/app/build example/ios/build lib"
  },
  "keywords": [
    "react-native",
    "ios",
    "android"
  ],
  "repository": "https://github.com/your-repo/react-native-dev-tools",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/your-repo/react-native-dev-tools/issues"
  },
  "homepage": "https://github.com/your-repo/react-native-dev-tools#readme",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  },
  "devDependencies": {
    "@react-native-community/eslint-config": "^3.0.2",
    "@types/jest": "^28.1.2",
    "@types/react": "~17.0.21",
    "del-cli": "^5.0.0",
    "eslint": "^8.4.1",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jest": "^28.1.1",
    "prettier": "^2.0.5",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-builder-bob": "^0.20.0",
    "release-it": "^15.0.0",
    "typescript": "^4.5.2"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "engines": {
    "node": ">= 16.0.0"
  },
  "packageManager": "^yarn@1.22.15",
  "jest": {
    "preset": "react-native",
    "modulePathIgnorePatterns": [
      "<rootDir>/example/node_modules",
      "<rootDir>/lib/"
    ]
  },
  "eslintIgnore": [
    "node_modules/",
    "lib/"
  ],
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": [
      "commonjs",
      "module",
      [
        "typescript",
        {
          "project": "tsconfig.build.json"
        }
      ]
    ]
  }
}
```

### 4. Move Source Code
- Copy all relevant files from `rn-better-dev-tools/src/features/[feature]/` to new package `src/`
- Update all import paths to use absolute imports or relative to new structure
- Create main `src/index.ts` with proper exports

### 5. Fix Import Paths
Common patterns to fix:
```typescript
// Old relative imports
import { Component } from '../../../shared/ui/components'

// New absolute imports  
import { Component } from '@/rn-better-dev-tools/src/shared/ui/components'
```

### 6. Build Package
```bash
npm run build
```

### 7. Update Main App Dependencies
Add to main `package.json`:
```json
{
  "dependencies": {
    "@rn-dev-tools/react-native-[feature-name]": "file:./packages/@rn-dev-tools/react-native-[feature-name]"
  }
}
```

### 8. Integration with Dev Tools System

#### Update installedApps in app/index.tsx
```typescript
const installedApps: InstalledApp[] = [
  // ... existing apps
  {
    id: "[feature-id]",
    name: "[Feature Name]",
    slot: "both", // or "floating" or "dial"
    icon: ({ size }) => (
      <FeatureIcon size={size} color="#9f6" />
    ),
    onPress: () => {
      // Open feature modal
    },
  },
];
```

#### The settings system is already dynamic - new tools will automatically:
- Appear in settings modal
- Be toggleable on/off
- Respect user preferences
- Work in both floating and dial menus

### 9. Clean Up Old Code
- Delete the original folder: `rn-better-dev-tools/src/features/[feature]/`
- Fix any remaining import errors
- Run `npm run lint` and `npx tsc --noEmit` to verify no issues

### 10. Verify Integration
- Test that the feature works in both floating and dial menus
- Verify settings toggle functionality
- Ensure no TypeScript or lint errors
- Take screenshots to confirm UI is unchanged

## Important Notes

### React Dependencies
- **Never** add React to `devDependencies` - causes duplicate React instance errors
- Only use `peerDependencies` for React and React Native
- Remove React from `devDependencies` if build fails with hook errors

### Settings System
The settings system is fully dynamic since the network extraction. New tools automatically:
- Generate default settings entries
- Appear in settings modal 
- Support toggle on/off functionality
- Work with both floating and dial menus

No hardcoding required - just add the app to `installedApps` array.

### Import Path Strategy
- Use absolute imports with `@/` prefix for shared components
- Keep package-internal imports relative
- Update all references when moving code

### Build Issues
- Always run `npm run build` after creating package
- Check for missing lib/ directory if import fails
- Verify package.json scripts are correct

## Troubleshooting Common Issues

### "Cannot resolve module" errors
- Missing `npm run build` step
- Incorrect import paths
- Missing dependencies in package.json

### React Hook errors
- React in devDependencies (remove it)
- Duplicate React instances
- Check peer dependencies are correct

### TypeScript errors after cleanup
- Unused imports in old files
- Functions expecting different return types
- Missing type definitions

## Testing Checklist
- [ ] Package builds successfully (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Minimal lint warnings (`npm run lint`)
- [ ] Feature appears in floating menu
- [ ] Feature appears in dial menu
- [ ] Settings toggle works correctly
- [ ] No UI/UX changes from original
- [ ] All original functionality preserved