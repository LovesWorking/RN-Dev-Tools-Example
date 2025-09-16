---

⏺ Summary

I've completed a comprehensive analysis of your rn-dev-tools-example repository and created a detailed restructuring plan at
/Users/aj/Desktop/rn-dev-tools-example/MONOREPO_RESTRUCTURING_PLAN_V2.md.

Key Findings:

What's Already Good:

- Using workspace protocol (workspace:\*) for package linking
- Proper pnpm workspace and Lerna configuration
- Consistent package naming with @rn-dev-tools namespace
- All packages use React Native Builder Bob

Main Issues:

1. Conflicting linking methods - Yalc artifacts present while using workspace protocol
2. No hot reload setup - Missing watch scripts for development
3. Version mismatches - Example uses React 19/RN 0.79.5 while packages have older versions
4. No unified dev workflow - Need coordinated build and watch commands

The Restructuring Plan Includes:

6 Phases:

1. Clean up yalc artifacts (not needed with workspace protocol)
2. Align dependencies across monorepo
3. Implement hot reload with watch mode
4. Standardize package structure
5. Optimize build process
6. Improve developer experience

Key improvements:

- One pnpm dev command for full hot-reload development
- Automatic rebuilds when package source changes
- Clean workspace-based linking (no yalc needed)
- Parallel builds for speed
- Consistent TypeScript configuration

The plan provides step-by-step implementation instructions and scripts to transform your monorepo into the same clean structure we achieved in the test repository, but with all your
existing packages intact.

---

# Monorepo Restructuring Plan V2

## Current State Analysis

### What's Working Well ✅

1. **Workspace Protocol**: Already using `workspace:*` in example/package.json
2. **pnpm Workspaces**: Configured with pnpm-workspace.yaml
3. **Lerna Setup**: Using @lerna-lite for versioning and publishing
4. **Bob Configuration**: All packages use react-native-builder-bob
5. **Package Naming**: Consistent @rn-dev-tools namespace
6. **Build Scripts**: Packages have proper build/prepare scripts

### Issues Identified 🔴

1. **Mixed Linking Methods**: Yalc is present but packages use workspace protocol (conflicting approaches)
2. **Version Mismatches**:
   - Example uses React 19.0.0 + RN 0.79.5
   - Packages have older React/RN versions in devDependencies
3. **No Hot Reload Setup**: Missing watch scripts for development
4. **Inconsistent TypeScript Config**: Different strictness levels across packages
5. **No Unified Build Command**: Need coordinated build across all packages
6. **Missing Development Workflow**: No clear dev mode for rapid iteration

## Restructuring Game Plan

### Phase 1: Clean Up Conflicting Systems

**Goal**: Remove yalc and ensure pure workspace-based development

#### Tasks:

1. **Remove Yalc Artifacts**

   ```bash
   rm -rf .yalc yalc.lock
   rm -rf example/.yalc example/yalc.lock
   ```

2. **Verify Workspace Links**
   - Ensure all packages use `workspace:*` protocol
   - Already done in example/package.json ✅

### Phase 2: Align Dependencies

**Goal**: Ensure version consistency across monorepo

#### Tasks:

1. **Update Root package.json**

   - Move shared devDependencies to root
   - Use React 19.0.0 and RN 0.79.5 consistently

2. **Update Package devDependencies**

   - Remove React/RN from individual package devDeps
   - Let them inherit from root via peerDependencies

3. **TypeScript Alignment**
   - Use @types/react ~19.0.10 consistently
   - Ensure all packages use same TS config base

### Phase 3: Implement Hot Reload Development

**Goal**: Enable rapid development with hot reload (no watch mode needed!)

#### Key Discovery: Bob doesn't support --watch, but we don't need it! Metro handles hot reload by watching source files directly.

#### Tasks:

1. **Add "source" Export to Package.json**
   Each package needs a "source" field in exports for Metro to watch:

   ```json
   {
     "exports": {
       ".": {
         "source": "./src/index.tsx",  // Metro watches this!
         "import": "./lib/module/index.js",
         "require": "./lib/commonjs/index.js",
         "types": "./lib/typescript/index.d.ts"
       }
     }
   }
   ```

2. **Update Root Scripts (NO INFINITE LOOPS!)**
   ⚠️ CRITICAL: Never add `"install": "pnpm install"` - it creates an infinite loop!

   ```json
   {
     "scripts": {
       "build": "lerna run build --stream",
       "build:packages": "lerna run build --stream",
       "clean": "lerna run clean && rimraf node_modules packages/*/node_modules example/node_modules",
       "clean:packages": "lerna run clean",
       "dev": "pnpm start",
       "start": "pnpm --filter example start",
       "ios": "pnpm --filter example ios",
       "android": "pnpm --filter example android",
       "typecheck": "lerna run typecheck --stream",
       "test": "pnpm run build && pnpm run typecheck && pnpm run lint",
       "fresh": "pnpm run clean && pnpm install && pnpm run build"
     }
   }
   ```

3. **Create Metro Configuration for Hot Reload**
   Create `example/metro.config.js`:

   ```javascript
   const { getDefaultConfig } = require('expo/metro-config');
   const path = require('path');

   const config = getDefaultConfig(__dirname);

   const projectRoot = __dirname;
   const monorepoRoot = path.resolve(projectRoot, '..');

   // Watch all workspace roots for changes
   config.watchFolders = [monorepoRoot];

   // Ensure Metro can resolve modules from workspace packages
   config.resolver.nodeModulesPaths = [
     path.resolve(projectRoot, 'node_modules'),
     path.resolve(monorepoRoot, 'node_modules'),
   ];

   // IMPORTANT: Tell Metro to watch SOURCE files, not built files
   config.resolver.unstable_enablePackageExports = true;
   config.resolver.unstable_conditionNames = ['source', 'import', 'require'];

   module.exports = config;
   ```

### Phase 4: Standardize Package Structure

**Goal**: Ensure all packages follow the same patterns

#### Tasks:

1. **Update All Package.json Files**
   Note: No watch script needed - Bob doesn't support it and Metro handles hot reload!

   ```json
   {
     "scripts": {
       "build": "bob build",
       "typecheck": "tsc --noEmit",
       "prepare": "bob build",
       "clean": "rimraf lib",
       "test": "pnpm run typecheck"
     }
   }
   ```

2. **Standardize TypeScript Config**

   - Create shared tsconfig.base.json at root
   - All packages extend from base
   - Enable strict mode consistently

3. **Fix Bob Configuration**
   - Ensure all packages skip TypeScript if React 19 types cause issues
   - Or downgrade to compatible React types

### Phase 5: Optimize Build Process

**Goal**: Fast, reliable builds with proper caching

#### Tasks:

1. **Implement Incremental Builds**

   - Use Bob's caching capabilities
   - Add .bob-cache to .gitignore

2. **Parallel Building**

   - Already using pnpm --parallel ✅
   - Ensure proper build order if dependencies exist

3. **Pre-commit Hooks**
   - Add lint-staged for changed files only
   - Run typecheck before commits

### Phase 6: Developer Experience

**Goal**: Smooth development workflow

#### Tasks:

1. **Create Development Scripts**

   ```bash
   # scripts/dev.sh
   #!/bin/bash
   echo "🔨 Building packages..."
   pnpm build:packages
   echo "🚀 Starting development mode..."
   pnpm dev
   ```

2. **Add Package Creation Script**

   ```bash
   # scripts/create-package.sh
   #!/bin/bash
   # Template-based package creation
   # Ensures consistency
   ```

3. **Documentation**
   - Update README with new workflow
   - Add CONTRIBUTING.md with development guide

## Implementation Steps

### Step 1: Backup Current State

```bash
cp -r . ../rn-dev-tools-example-backup
```

### Step 2: Clean Yalc

```bash
rm -rf .yalc yalc.lock
find . -name ".yalc" -type d -exec rm -rf {} +
find . -name "yalc.lock" -type f -delete
```

### Step 3: Update Dependencies

1. Update root package.json with aligned versions
2. Update all package devDependencies
3. Run `pnpm install` to sync

### Step 4: Add Source Exports for Hot Reload

1. Add "source" field to exports in all package.json files
2. Ensure Metro config has `unstable_enablePackageExports` enabled
3. Test hot reload by editing a source file

### Step 5: Create Metro Config

```javascript
// example/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

// Watch all workspace roots for changes
config.watchFolders = [monorepoRoot];

// Ensure Metro can resolve modules from workspace packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// CRITICAL: Enable source file watching for hot reload!
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['source', 'import', 'require'];

module.exports = config;
```

### Step 6: Test Hot Reload

1. Start dev mode: `pnpm dev`
2. Modify a package source file
3. Verify changes appear in app

## Expected Outcome

### Development Workflow

```bash
# One-time setup (builds packages automatically via prepare scripts)
pnpm install

# Development (with hot reload - no watch needed!)
pnpm start  # or pnpm dev

# Build all packages
pnpm build

# Clean and rebuild everything
pnpm fresh

# Run on iOS/Android
pnpm ios
pnpm android

# Clean everything
pnpm clean

# Type checking (expect React 19 warnings)
pnpm typecheck
```

### Benefits

1. ✅ No more yalc complexity
2. ✅ Automatic rebuilds on file changes
3. ✅ Consistent dependency versions
4. ✅ Fast hot reload in development
5. ✅ Clean workspace-based linking
6. ✅ Parallel builds for speed

## Migration Checklist

- [ ] Remove yalc artifacts
- [ ] Update root package.json scripts (REMOVE any "install" script!)
- [ ] Add "source" export to all package.json files
- [ ] Remove any watch scripts (Bob doesn't support them)
- [ ] Create shared tsconfig.base.json
- [ ] Update package TypeScript configs
- [ ] Create metro.config.js with source watching enabled
- [ ] Test hot reload with package source file changes
- [ ] Update documentation
- [ ] Test full build pipeline with `pnpm fresh`
- [ ] Test publishing workflow with Lerna

## Critical Pitfalls to Avoid 🚨

### 1. NEVER Add Recursive Install Script
```json
// ❌ WRONG - Creates infinite loop!
"scripts": {
  "install": "pnpm install"  // DON'T DO THIS!
}

// ✅ CORRECT - Let pnpm handle install normally
"scripts": {
  // No install script needed
}
```

### 2. Bob Doesn't Support Watch Mode
```bash
# ❌ This will fail:
bob build --watch  # Error: Unknown argument: watch

# ✅ You don't need it! Metro watches source files directly
```

### 3. Must Add "source" Export for Hot Reload
Without this, hot reload won't work:
```json
"exports": {
  ".": {
    "source": "./src/index.tsx",  // REQUIRED for hot reload!
    "import": "./lib/module/index.js",
    "require": "./lib/commonjs/index.js"
  }
}
```

### 4. Metro Config Must Enable Package Exports
```javascript
// CRITICAL: These lines enable source file watching
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['source', 'import', 'require'];
```

## Notes

### React 19 Type Issues

If TypeScript errors persist with React 19:

1. Option A: Skip TypeScript in Bob builds (current approach in clean monorepo)
2. Option B: Downgrade to React 18 types
3. Option C: Wait for React Native official React 19 support

### Performance Optimization

- Metro watches source files directly - no rebuild needed during development!
- Metro's fast refresh updates without full reload
- pnpm's workspace protocol avoids npm link issues
- Bob builds are only needed for production/publishing

### Publishing Strategy

- Keep Lerna for versioning and publishing
- Use conventional commits for changelogs
- Publish from CI/CD pipeline only
