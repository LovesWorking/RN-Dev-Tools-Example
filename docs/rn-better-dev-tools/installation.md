---
id: installation
title: Installation
---

Complete installation guide for RN Better Dev Tools across different React Native platforms.

## Prerequisites

- React Native 0.64 or higher
- React 18 or higher
- @tanstack/react-query v5 or higher
- TypeScript 4.7+ (for TypeScript projects)

## Package Installation

```bash
npm i rn-better-dev-tools @tanstack/react-query
```
```bash
pnpm add rn-better-dev-tools @tanstack/react-query
```
```bash
yarn add rn-better-dev-tools @tanstack/react-query
```
```bash
bun add rn-better-dev-tools @tanstack/react-query
```

## Platform-Specific Setup

### React Native CLI

No additional setup required. The package works out of the box:

[//]: # 'ReactNativeCLI'
```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <RnBetterDevToolsBubble 
      queryClient={queryClient}
      environment="development"
    />
  )
}
```
[//]: # 'ReactNativeCLI'

### Expo

#### Expo Go

Works directly without additional configuration. Storage monitoring uses mock implementations for compatibility:

[//]: # 'ExpoGo'
```tsx
// In Expo Go, MMKV is automatically mocked with AsyncStorage
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
/>
```
[//]: # 'ExpoGo'

> Note: For full MMKV support, use a development build

#### Expo Development Build

For native storage support, install peer dependencies:

```bash
npx expo install react-native-mmkv expo-secure-store @react-native-async-storage/async-storage
```

### React Native Web

Add web-specific polyfills if using storage features:

```bash
npm i @react-native-async-storage/async-storage
```

Configure webpack or your bundler to alias native modules:

[//]: # 'WebConfig'
```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage': '@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.web.js'
    }
  }
}
```
[//]: # 'WebConfig'

## Optional Dependencies

### Storage Monitoring

For full storage monitoring capabilities:

```bash
# MMKV - High-performance key-value storage
npm i react-native-mmkv

# AsyncStorage - Standard React Native storage
npm i @react-native-async-storage/async-storage

# SecureStorage (Expo only)
npx expo install expo-secure-store
```

### Network Monitoring

Network monitoring works automatically with fetch and XMLHttpRequest. For additional features:

```bash
# Optional: Advanced network debugging
npm i react-native-flipper
```

### Desktop Companion App

For enhanced debugging with the desktop app:

1. Download the [desktop app](https://github.com/LovesWorking/rn-better-dev-tools/releases)
2. Install the sync package:

```bash
npm i react-query-external-sync
```

3. Configure the connection:

[//]: # 'DesktopSync'
```tsx
import { setupDevToolsSync } from 'react-query-external-sync'

// In your app initialization
setupDevToolsSync({
  queryClient,
  port: 8097 // Default port
})
```
[//]: # 'DesktopSync'

## iOS Setup

For React Native CLI projects, run:

```bash
cd ios && pod install
```

For storage features, add to your `Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>Used for secure storage access</string>
```

## Android Setup

No additional setup required for most features.

For secure storage on Android API < 23, add to `android/app/build.gradle`:

```gradle
android {
  defaultConfig {
    minSdkVersion 23
  }
}
```

## TypeScript Configuration

Add types to your `tsconfig.json`:

[//]: # 'TypeScriptConfig'
```json
{
  "compilerOptions": {
    "types": ["rn-better-dev-tools"]
  }
}
```
[//]: # 'TypeScriptConfig'

## Production Builds

RN Better Dev Tools automatically disables itself in production builds. No additional configuration needed:

[//]: # 'ProductionSafety'
```tsx
// This is handled automatically, but you can be explicit:
{__DEV__ && <RnBetterDevToolsBubble {...props} />}
```
[//]: # 'ProductionSafety'

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution errors:

```bash
# Clear caches
npx react-native start --reset-cache

# For Expo
npx expo start -c
```

### iOS Build Failures

```bash
# Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

### Android Build Issues

```bash
# Clean build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Metro Configuration

For custom Metro configurations, ensure these extensions are included:

[//]: # 'MetroConfig'
```js
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json']
  }
}
```
[//]: # 'MetroConfig'

## Verifying Installation

After installation, verify the tools are working:

1. Run your app in development mode
2. Look for the floating bubble on the right side
3. Tap any menu button (G, C, or D)
4. Verify you can access the debugging panels

## Next Steps

- [Configuration](./configuration.md) - Customize the dev tools
- [Quick Start](./quick-start.md) - Basic usage examples
- [React Query Tools](./guides/react-query-tools.md) - Using the query browser