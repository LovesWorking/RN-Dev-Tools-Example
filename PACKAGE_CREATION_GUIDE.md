# React Native Builder Bob - Complete Package Creation Guide

This comprehensive guide covers everything you need to know about creating packages using React Native Builder Bob's monorepo tools and architecture.

## Table of Contents

1. [Overview](#overview)
2. [Monorepo Architecture](#monorepo-architecture)
3. [Workspace Configuration](#workspace-configuration)
4. [Creating New Packages](#creating-new-packages)
5. [Package Structure Patterns](#package-structure-patterns)
6. [Build System](#build-system)
7. [Publishing & Release Management](#publishing--release-management)
8. [Development Workflow](#development-workflow)
9. [Available Templates](#available-templates)
10. [Configuration Reference](#configuration-reference)

## Overview

React Native Builder Bob is a monorepo containing two main packages that work together to scaffold and build React Native libraries:

- **`create-react-native-library`**: CLI for scaffolding new React Native libraries
- **`react-native-builder-bob`**: Build tool for compiling and packaging libraries

The monorepo uses:
- **Yarn Workspaces** for dependency management
- **Lerna** for versioning and publishing
- **TypeScript** for type safety
- **Babel** for compilation
- **ESLint** for code quality

## Monorepo Architecture

### Root Structure
```
├── packages/                    # All packages live here
│   ├── create-react-native-library/
│   └── react-native-builder-bob/
├── docs/                       # Documentation workspace
├── package.json                # Root workspace config
├── lerna.json                  # Lerna configuration
├── tsconfig.json               # Shared TypeScript config
├── eslint.config.mjs           # Shared ESLint config
└── yarn.lock                   # Lockfile
```

### Key Files
- **`package.json`**: Defines workspaces, shared scripts, and dev dependencies
- **`lerna.json`**: Controls publishing, versioning, and release configuration
- **`tsconfig.json`**: Shared TypeScript configuration with package path mapping

## Workspace Configuration

### Root package.json
```json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "docs"
  ],
  "packageManager": "yarn@3.6.1",
  "scripts": {
    "lint": "eslint \"**/*.{js,ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "watch": "concurrently 'yarn typecheck --watch' 'lerna run --parallel prepare -- --watch'",
    "test": "yarn workspace react-native-builder-bob test",
    "docs": "yarn workspace docs",
    "release": "lerna publish"
  }
}
```

### Lerna Configuration
```json
{
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "independent",
  "command": {
    "publish": {
      "graphType": "all",
      "syncWorkspaceLock": true,
      "allowBranch": "main",
      "allowPeerDependenciesUpdate": true,
      "conventionalCommits": true,
      "createRelease": "github",
      "changelogIncludeCommitsClientLogin": " - by @%l",
      "message": "chore: publish"
    }
  }
}
```

## Creating New Packages

### Step 1: Create Package Directory
```bash
mkdir packages/your-package-name
cd packages/your-package-name
```

### Step 2: Initialize package.json
```json
{
  "name": "your-package-name",
  "version": "0.1.0",
  "description": "Description of your package",
  "keywords": ["react-native", "library"],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/callstack/react-native-builder-bob.git",
    "directory": "packages/your-package-name"
  },
  "main": "lib/index.js",
  "files": ["lib", "bin"],
  "engines": {
    "node": "^20.19.0 || ^22.12.0 || >= 23.4.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "scripts": {
    "prepare": "babel --extensions .ts,.tsx src --out-dir lib --source-maps --delete-dir-on-start"
  }
}
```

### Step 3: Create Source Structure
```
packages/your-package-name/
├── src/
│   ├── index.ts              # Main entry point
│   └── utils/               # Utility modules
├── package.json
├── tsconfig.json            # Package-specific TS config
└── README.md
```

### Step 4: Add to TypeScript Paths
Update root `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "your-package-name": ["./packages/your-package-name/src"],
      // ... other packages
    }
  }
}
```

## Package Structure Patterns

### CLI Package Structure (like create-react-native-library)
```
packages/create-react-native-library/
├── src/
│   ├── index.ts              # CLI entry point with yargs
│   ├── constants.ts          # Shared constants
│   ├── input.ts              # User input handling
│   ├── template.ts           # Template processing
│   ├── utils/               # Utility functions
│   └── exampleApp/          # Example app generation
├── templates/               # Template files
│   ├── common/
│   ├── js-library/
│   ├── native-library-new/
│   └── ...
├── bin/                     # CLI executable
├── package.json
└── README.md
```

### Build Tool Package Structure (like react-native-builder-bob)
```
packages/react-native-builder-bob/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── build.ts              # Build command implementation
│   ├── init.ts               # Init command implementation
│   ├── schema.ts             # Configuration schema
│   └── utils/               # Build utilities
├── bin/
│   └── bob                  # Executable script
├── babel-preset.js          # Babel preset export
├── metro-config.js          # Metro config export
├── package.json
└── README.md
```

### Required Package Fields

#### Essential package.json Fields
```json
{
  "name": "package-name",
  "version": "x.x.x",
  "main": "lib/index.js",        # Entry point after build
  "files": ["lib", "bin"],       # Files to include in npm package
  "engines": {                   # Node version requirements
    "node": "^20.19.0 || ^22.12.0 || >= 23.4.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

#### For CLI Packages
```json
{
  "bin": {
    "command-name": "bin/command-name"
  }
}
```

## Build System

### Babel Configuration
Each package uses Babel for TypeScript compilation:
```json
{
  "scripts": {
    "prepare": "babel --extensions .ts,.tsx src --out-dir lib --source-maps --delete-dir-on-start"
  }
}
```

### Build Targets (for bob)
```typescript
type Target = 'commonjs' | 'module' | 'typescript' | 'codegen';
```

### Watch Mode
```bash
yarn watch  # Builds all packages in watch mode
```

### Build Commands
```bash
# Build all packages
lerna run prepare

# Build specific package
yarn workspace package-name prepare

# Type check all packages
yarn typecheck

# Lint all packages
yarn lint
```

## Publishing & Release Management

### Release Process
1. **Automatic Versioning**: Lerna handles semantic versioning based on conventional commits
2. **Independent Versioning**: Each package maintains its own version
3. **GitHub Releases**: Automatically creates GitHub releases with changelogs
4. **NPM Publishing**: Publishes to NPM registry

### Publishing Commands
```bash
# Standard release
yarn release

# Pre-release (requires lerna.json config)
yarn lerna publish --conventional-commits --conventional-prerelease --preid next

# Graduate pre-release to stable
yarn lerna publish --conventional-commits --conventional-graduate
```

### Pre-release Configuration
Update `lerna.json`:
```json
{
  "command": {
    "publish": {
      "preId": "next",
      "preDistTag": "next",
      "allowBranch": ["main", "next"]
    }
  }
}
```

### Release Requirements
- **GH_TOKEN**: GitHub token for release creation
- **Clean working directory**: No uncommitted changes
- **Main branch**: Must be on allowed branch (usually main)

## Development Workflow

### Initial Setup
```bash
# Install dependencies
yarn

# Build all packages
yarn prepare

# Start watch mode for development
yarn watch
```

### Local Testing
```bash
# Test CLI locally
../bob/packages/create-react-native-library/bin/create-react-native-library

# Test bob build tool
../bob/packages/react-native-builder-bob/bin/bob
```

### Code Quality
```bash
# Type checking
yarn typecheck

# Linting
yarn lint

# Fix lint issues
yarn lint --fix

# Run tests
yarn test
```

### Documentation Development
```bash
# Start docs development server
yarn docs dev
```

## Available Templates

The `create-react-native-library` package includes multiple templates:

### Library Templates
- **`js-library`**: JavaScript-only library
- **`native-library-new`**: Native module with new architecture
- **`kotlin-library-new`**: Kotlin-based native library
- **`objc-library`**: Objective-C library
- **`expo-library`**: Expo-compatible library

### View Templates
- **`native-view-new`**: Native view component
- **`kotlin-view-new`**: Kotlin-based view
- **`objc-view-new`**: Objective-C view

### Nitro Templates
- **`nitro-module`**: Nitro module (experimental)
- **`nitro-view`**: Nitro view component (experimental)

### Common Templates
- **`common`**: Shared template components
- **`native-common`**: Native-specific shared components
- **`example-common`**: Example app components

## Configuration Reference

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "rootDir": ".",
    "paths": {
      "package-name": ["./packages/package-name/src"]
    },
    "outDir": "./typescript",
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": [
    "**/lib",
    "**/templates",
    "**/__fixtures__"
  ]
}
```

### ESLint Configuration
```javascript
module.exports = {
  extends: 'satya164',
  root: true,
  env: {
    node: true
  }
};
```

### Babel Configuration (for libraries)
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: '20' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-strict-mode'
  ]
};
```

## Best Practices

### Package Naming
- Use descriptive, kebab-case names
- Include scope if applicable: `@scope/package-name`
- Follow npm naming conventions

### Versioning
- Follow semantic versioning (semver)
- Use conventional commits for automatic versioning
- Independent versioning for each package

### Dependencies
- Use `dependencies` for runtime dependencies
- Use `devDependencies` for build-time dependencies
- Use `peerDependencies` for optional dependencies

### File Organization
- Keep source files in `src/`
- Build output goes to `lib/`
- Include only necessary files in `files` array
- Use meaningful directory structure

### Documentation
- Include comprehensive README.md
- Document all public APIs
- Provide usage examples
- Keep documentation in sync with code

### Testing
- Write tests for all public APIs
- Use consistent testing patterns
- Include tests in CI/CD pipeline
- Test CLI tools with fixtures

This guide provides everything needed to create, build, and maintain packages within the React Native Builder Bob monorepo architecture.