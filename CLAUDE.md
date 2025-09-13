# Project-Specific Claude Instructions

## IMPORTANT: Expo Go Only - NO Dev Builds

**This project uses Expo Go exclusively. Do NOT use development builds.**

### ❌ Never Use:
- `expo prebuild`
- `expo run:ios`
- `expo run:android`
- `npx react-native run-ios`
- `npx react-native run-android`
- Any native module installation that requires prebuild
- Any command that generates iOS/Android folders

### ✅ Always Use:
- `expo start` - Start Expo server for Expo Go
- `expo start --go` - Start and open in Expo Go
- `expo start --clear` - Start with cache cleared
- `npm run nuke:go` - Complete reset and start with Expo Go

### Package Management
This project has local packages in `/packages/`:
- `@rn-dev-tools/react-native-env-manager`
- `@rn-dev-tools/react-native-network-inspector`

These packages must be built before running the app:
- `npm run build:packages` - Build all packages
- `npm run start:go` - Build packages and start with Expo Go

### Development Workflow
1. Always build packages first if you've made changes to them
2. Use Expo Go app on device/simulator to scan QR code
3. Never generate native folders (iOS/Android)
4. All dependencies must be Expo Go compatible

### Testing
- Test on device using Expo Go app
- Use iOS Simulator with Expo Go app installed
- No native builds = no native testing required

## React Native Code Rules

### ❌ DO NOT import React separately
React Native with Expo SDK 50+ includes React in the global scope. Never do:
```javascript
import React from 'react'; // ❌ WRONG
```

Instead, use React directly without importing:
```javascript
// ✅ CORRECT - React is available globally
export const Component: React.FC<Props> = () => {
  return <View>...</View>;
};
```

## Project Structure
```
/
├── app/                    # Expo Router app directory
├── packages/              # Local packages (npm workspaces style)
│   ├── react-native-env-manager/
│   └── react-native-network-inspector/
├── rn-better-dev-tools/   # Dev tools UI components
└── scripts/               # Build and utility scripts
```

## Key Scripts
- `npm run nuke` - Complete reset (clears everything, rebuilds, restarts)
- `npm run nuke:go` - Complete reset and start with Expo Go
- `npm run build:packages` - Build local packages
- `npm run start:go` - Build packages and start Expo Go

## Remember
**This is an Expo Go project. No prebuild. No native folders. No dev builds.**