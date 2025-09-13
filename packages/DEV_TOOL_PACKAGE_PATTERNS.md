# Dev Tool Package Patterns

## Common Patterns (Consistency Points)

### 1. Package Structure
Both packages follow a similar directory structure:
```
packages/[package-name]/
├── src/
│   ├── index.ts         # Main export file
│   ├── types/           # Type definitions
│   ├── utils/           # Utility functions
│   ├── hooks/           # React hooks
│   └── components/      # UI components (network-inspector only)
├── lib/                 # Built output
├── node_modules/
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

### 2. Package.json Configuration

#### Shared Patterns:
- **Namespace**: Both use `@rn-dev-tools/` prefix
- **Version**: Start at `0.1.0`
- **Build Tool**: Both use `react-native-builder-bob`
- **Module System**: Support CommonJS, ES Modules, and TypeScript
- **Exports Configuration**: Modern exports field with import/require/types
- **Files Field**: Explicitly declare published files
- **Side Effects**: Both marked as `sideEffects: false`
- **Peer Dependencies**: Both require `react` and `react-native` as peers

#### Standard Export Configuration:
```json
{
  "main": "lib/commonjs/index.js",
  "module": "lib/module/index.js",
  "types": "lib/typescript/index.d.ts",
  "exports": {
    ".": {
      "import": "./lib/module/index.js",
      "require": "./lib/commonjs/index.js",
      "types": "./lib/typescript/index.d.ts"
    }
  }
}
```

### 3. TypeScript Configuration

#### Common tsconfig.json Settings:
- Target: ES2020
- Module: ESNext
- JSX: react-native
- Strict mode enabled
- Declaration maps enabled
- Root dir: `./src`
- Out dir: `./lib/typescript`

#### tsconfig.build.json Pattern:
Both extend base tsconfig and exclude test files

### 4. Build Configuration

#### react-native-builder-bob Setup:
```json
{
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": ["commonjs", "module", "typescript"]
  }
}
```

### 5. Export Pattern

Both use barrel exports in `src/index.ts`:
- Export types explicitly
- Export utilities/hooks
- Export core functionality
- Named exports only (no default exports)

## Key Differences

### 1. Scripts

**env-manager** (More Complete):
```json
{
  "typecheck": "tsc --noEmit",
  "lint": "eslint \"**/*.{js,ts,tsx}\"",
  "clean": "rimraf lib",
  "build": "bob build",
  "prepare": "bob build",
  "prepublishOnly": "npm run clean && npm run build"
}
```

**network-inspector** (Minimal):
```json
{
  "build": "bob build",
  "typecheck": "tsc --noEmit"
}
```

### 2. Code Quality Tools

**env-manager**:
- Has ESLint configuration
- Has Prettier configuration inline
- More dev dependencies for linting
- Has lefthook for git hooks

**network-inspector**:
- No linting setup
- No prettier config
- Minimal dev dependencies

### 3. TypeScript Strictness

**env-manager**:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

**network-inspector**:
- `noUnusedLocals: false`
- `noUnusedParameters: false`
- Missing some strict checks

### 4. Components

**network-inspector**:
- Has UI components directory
- Exports React components

**env-manager**:
- No UI components
- Pure logic/hooks only

### 5. Documentation

**network-inspector**:
- Has TODO.md for tracking tasks

**env-manager**:
- No documentation files in package

### 6. Repository URLs

**env-manager**:
- Points to individual GitHub repo

**network-inspector**:
- Points to monorepo with directory field

## Recommended Standard Pattern

Based on the analysis, here's the recommended standard for dev tool packages:

### 1. Required Package.json Fields
```json
{
  "name": "@rn-dev-tools/[package-name]",
  "version": "0.1.0",
  "description": "[Clear description]",
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
  "files": ["src", "lib", "!**/__tests__", "!**/__mocks__"],
  "sideEffects": false,
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint \"**/*.{js,ts,tsx}\"",
    "clean": "rimraf lib",
    "build": "bob build",
    "prepare": "bob build",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "react-native-builder-bob": {
    "source": "src",
    "output": "lib",
    "targets": ["commonjs", "module", ["typescript", { "project": "tsconfig.build.json" }]]
  }
}
```

### 2. Standard Directory Structure
```
packages/[package-name]/
├── src/
│   ├── index.ts         # Barrel exports
│   ├── types/
│   │   └── index.ts     # Type definitions
│   ├── utils/           # Utility functions
│   ├── hooks/           # React hooks (if applicable)
│   └── components/      # UI components (if applicable)
├── lib/                 # Build output (gitignored)
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── .gitignore
└── README.md           # Package documentation
```

### 3. Standard TypeScript Config
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "jsx": "react-native",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./lib/typescript",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "**/__tests__/**/*", "**/__mocks__/**/*"]
}
```

### 4. Export Guidelines
- Use named exports only (no default exports)
- Organize exports by category (types, utils, hooks, components)
- Export types explicitly with `export type`
- Keep index.ts clean and organized

### 5. Code Quality Standards
- Include ESLint and Prettier configs
- Enable all TypeScript strict checks
- Include prepare script for automatic builds
- Add proper .gitignore file

## Migration Checklist

To align existing packages with the standard:

### For react-native-network-inspector:
- [ ] Add missing scripts (lint, clean, prepare, prepublishOnly)
- [ ] Add ESLint and Prettier configuration
- [ ] Enable TypeScript strict checks
- [ ] Update repository URL structure
- [ ] Add README.md
- [ ] Update bob config to use tsconfig.build.json

### For react-native-env-manager:
- [ ] Already follows most patterns
- [ ] Consider adding README.md
- [ ] Ensure repository structure is consistent

## Future Considerations

1. **Testing**: Add standard testing setup with Jest
2. **CI/CD**: Add GitHub Actions for automated testing/building
3. **Documentation**: Standardize README template
4. **Versioning**: Consider using changesets for version management
5. **Publishing**: Automate npm publishing workflow