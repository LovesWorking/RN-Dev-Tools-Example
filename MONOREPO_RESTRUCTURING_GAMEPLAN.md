# Monorepo Restructuring Game Plan

## Current Issues Analysis

After reviewing both your current setup and the React Native Builder Bob repository, here are the key issues with your current approach:

### 🚨 Current Problems
1. **File Dependencies**: Using `file:./packages/react-native-env-manager` instead of proper workspace management
2. **Manual Build Scripts**: Hacky manual build scripts like `build:env`, `build:network`, etc.
3. **No Workspace Management**: Missing proper pnpm-workspace.yaml configuration
4. **No Versioning Strategy**: No Lerna or changesets for automatic versioning
5. **Inconsistent Patterns**: Packages don't follow consistent patterns
6. **No Shared Configuration**: Each package duplicates configuration files

### 📖 References from Bob Repo
- **Workspace Config**: `/Users/aj/Desktop/rn bob clone/package.json:3-6` (workspaces array)
- **Lerna Config**: `/Users/aj/Desktop/rn bob clone/lerna.json` (independent versioning)
- **Shared Scripts**: `/Users/aj/Desktop/rn bob clone/package.json:14-21` (watch, release, etc.)
- **TypeScript Paths**: `/Users/aj/Desktop/rn bob clone/tsconfig.json:4-8` (package path mapping)

## Game Plan: Restructure to Bob-Style Monorepo

### Phase 1: Setup Workspace Management

#### 1.1 Create Workspace Configuration
Create `pnpm-workspace.yaml` in root:
```yaml
packages:
  - 'packages/*'
  - 'example'  # For your Expo app
```

**Reference**: Similar to Bob's `package.json:3-6` workspaces configuration

#### 1.2 Add Lerna Configuration
Create `lerna.json`:
```json
{
  "packages": ["packages/*"],
  "npmClient": "pnpm",
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

**Reference**: Exact copy from `/Users/aj/Desktop/rn bob clone/lerna.json`

#### 1.3 Update Root package.json
```json
{
  "private": true,
  "workspaces": ["packages/*", "example"],
  "packageManager": "pnpm@10.10.0",
  "scripts": {
    "lint": "eslint \"packages/**/*.{js,ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "watch": "concurrently 'pnpm typecheck --watch' 'lerna run --parallel prepare -- --watch'",
    "test": "lerna run test",
    "build": "lerna run build",
    "release": "lerna publish",
    "dev": "pnpm --filter example dev",
    "start": "pnpm --filter example start"
  }
}
```

**Reference**: Based on Bob's `/Users/aj/Desktop/rn bob clone/package.json:14-21` scripts

### Phase 2: Restructure Directory Layout

#### 2.1 Move Example App
```bash
# Create example directory
mkdir example

# Move Expo app files
mv app example/
mv assets example/
mv components example/
mv hooks example/
mv constants example/
mv src example/
mv app.config.js example/
mv babel.config.js example/
mv tsconfig.json example/
```

#### 2.2 Update Example package.json
Create `example/package.json`:
```json
{
  "name": "example",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "dev": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@rn-dev-tools/react-native-env-manager": "workspace:*",
    "@rn-dev-tools/react-native-network-inspector": "workspace:*",
    "@rn-dev-tools/react-native-react-query-devtools": "workspace:*",
    "@rn-dev-tools/react-native-storage-inspector": "workspace:*"
  }
}
```

**Key Change**: Use `workspace:*` instead of `file:` dependencies

### Phase 3: Standardize Package Structure

#### 3.1 Update Package Dependencies
For each package in `packages/`, update package.json to remove the `react-native-builder-bob` dependency and add it to root:

**Root devDependencies** (following Bob pattern from `/Users/aj/Desktop/rn bob clone/package.json:22-38`):
```json
{
  "devDependencies": {
    "@lerna-lite/cli": "^4.1.2",
    "@lerna-lite/publish": "^4.1.2",
    "@lerna-lite/run": "^4.1.2",
    "concurrently": "^7.2.2",
    "react-native-builder-bob": "^0.40.13",
    "typescript": "^5.8.3",
    "eslint": "^9.26.0"
  }
}
```

#### 3.2 Create Shared TypeScript Config
Root `tsconfig.json` with package path mapping:
```json
{
  "compilerOptions": {
    "rootDir": ".",
    "paths": {
      "@rn-dev-tools/react-native-env-manager": ["./packages/react-native-env-manager/src"],
      "@rn-dev-tools/react-native-network-inspector": ["./packages/react-native-network-inspector/src"],
      "@rn-dev-tools/react-native-react-query-devtools": ["./packages/react-native-react-query-devtools/src"],
      "@rn-dev-tools/react-native-storage-inspector": ["./packages/react-native-storage-inspector/src"]
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
    "packages/*/templates",
    "**/node_modules"
  ]
}
```

**Reference**: Based on Bob's `/Users/aj/Desktop/rn bob clone/tsconfig.json:4-8` path mapping

### Phase 4: Implement Auto-linking with Yalc Alternative

#### 4.1 Use Lerna Link Instead of Yalc
```bash
# Link all packages for development
lerna link

# Or use pnpm workspace linking (automatic)
pnpm install
```

#### 4.2 Development Workflow Scripts
Update package scripts to use Lerna:
```json
{
  "scripts": {
    "dev:packages": "lerna run --parallel prepare -- --watch",
    "dev:example": "pnpm --filter example start",
    "dev": "concurrently \"pnpm dev:packages\" \"pnpm dev:example\"",
    "fresh": "lerna run clean && lerna run build && pnpm --filter example start"
  }
}
```

### Phase 5: Shared Configuration Setup

#### 5.1 Root ESLint Config
Create `eslint.config.mjs`:
```javascript
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['packages/**/*.{ts,tsx}', 'example/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Shared rules
    },
  },
];
```

**Reference**: Similar pattern to Bob's `/Users/aj/Desktop/rn bob clone/eslint.config.mjs`

#### 5.2 Shared Prettier Config
Add to root package.json:
```json
{
  "prettier": {
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "useTabs": false
  }
}
```

**Reference**: From Bob's `/Users/aj/Desktop/rn bob clone/package.json:59-64`

### Phase 6: Build System Integration

#### 6.1 Remove Manual Build Scripts
Delete these from root package.json:
- `build:packages`
- `build:env`
- `build:network`
- `build:rq`
- `build:storage`

#### 6.2 Use Lerna for Building
```json
{
  "scripts": {
    "build": "lerna run build",
    "watch": "lerna run --parallel prepare -- --watch",
    "clean": "lerna run clean"
  }
}
```

**Reference**: Bob's approach from `/Users/aj/Desktop/rn bob clone/package.json:17` watch script

### Phase 7: Package Standardization

#### 7.1 Ensure All Packages Follow Pattern
Each package should have consistent:

**package.json structure**:
```json
{
  "name": "@rn-dev-tools/package-name",
  "version": "0.1.0",
  "main": "lib/commonjs/index.js",
  "module": "lib/module/index.js",
  "types": "lib/typescript/index.d.ts",
  "exports": {
    ".": {
      "import": "./lib/module/index.js",
      "require": "./lib/commonjs/index.js",
      "types": "./lib/typescript/index.d.ts"
    }
  },
  "scripts": {
    "build": "bob build",
    "prepare": "bob build",
    "clean": "rimraf lib",
    "typecheck": "tsc --noEmit"
  },
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": ["commonjs", "module", "typescript"]
  }
}
```

**Reference**: Pattern from Bob's packages like `/Users/aj/Desktop/rn bob clone/packages/react-native-builder-bob/package.json`

## Migration Steps

### Step 1: Backup and Clean
```bash
# Backup current state
git add . && git commit -m "backup: current state before monorepo restructure"

# Clean up
rm -rf node_modules
rm -rf packages/*/node_modules
rm pnpm-lock.yaml
```

### Step 2: Setup New Structure
```bash
# Create workspace config
echo "packages:\n  - 'packages/*'\n  - 'example'" > pnpm-workspace.yaml

# Create example directory and move files
mkdir example
# Move files as outlined in Phase 2
```

### Step 3: Install Dependencies
```bash
# Install lerna
pnpm add -D @lerna-lite/cli @lerna-lite/publish @lerna-lite/run

# Install everything
pnpm install
```

### Step 4: Test Everything
```bash
# Build all packages
pnpm build

# Start development
pnpm dev
```

## Benefits of This Approach

### 🎯 Advantages Over Current Setup
1. **Automatic Linking**: No more manual `file:` dependencies
2. **Shared Dependencies**: No duplicate dev dependencies
3. **Unified Build**: One command builds everything
4. **Proper Versioning**: Lerna handles semantic versioning
5. **Watch Mode**: Automatic rebuilds during development
6. **Publishing Ready**: Ready for npm publishing with proper versioning

### 📚 Key References from Bob Repo
- **Monorepo Structure**: `/Users/aj/Desktop/rn bob clone/` (overall layout)
- **Workspace Config**: `/Users/aj/Desktop/rn bob clone/package.json:3-6`
- **Lerna Setup**: `/Users/aj/Desktop/rn bob clone/lerna.json`
- **Build Scripts**: `/Users/aj/Desktop/rn bob clone/package.json:17` (watch command)
- **TypeScript Paths**: `/Users/aj/Desktop/rn bob clone/tsconfig.json:4-8`
- **Package Patterns**: `/Users/aj/Desktop/rn bob clone/packages/*/package.json`

## Development Workflow After Migration

### Daily Development
```bash
# Start everything in watch mode
pnpm dev

# Or start just packages in watch mode
pnpm dev:packages

# Or start just example app
pnpm dev:example
```

### Building
```bash
# Build all packages
pnpm build

# Clean and rebuild
pnpm clean && pnpm build
```

### Publishing
```bash
# Publish new versions (when ready)
pnpm release
```

This restructure will give you the same professional monorepo setup as React Native Builder Bob, with proper workspace management, automatic linking, unified builds, and a clear path to publishing your packages.