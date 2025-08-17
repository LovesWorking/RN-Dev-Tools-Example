---
id: quick-start
title: Quick Start
---

Get RN Better Dev Tools running in your React Native app in under 5 minutes.

## Installation

```bash
npm i rn-better-dev-tools
```
```bash
pnpm add rn-better-dev-tools
```
```bash
yarn add rn-better-dev-tools
```
```bash
bun add rn-better-dev-tools
```

## Basic Setup

Add the dev tools bubble to your app's root component:

[//]: # 'QuickSetup'
```tsx
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RnBetterDevToolsBubble 
        queryClient={queryClient}
        environment="development"
      />
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```
[//]: # 'QuickSetup'

## That's It!

Run your app and you'll see a floating bubble on the right side of your screen. Tap it to access:

- **React Query browser** - View and manage all queries and mutations
- **Storage inspector** - Monitor AsyncStorage, MMKV, and SecureStorage
- **Environment variables** - Check your app's configuration
- **Network monitor** - Track API requests and responses

## Essential Configuration

### Required Environment Variables

Tell the dev tools which environment variables your app needs:

[//]: # 'RequiredEnvVars'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredEnvVars={[
    { key: 'EXPO_PUBLIC_API_URL', description: 'Backend API endpoint' },
    { key: 'EXPO_PUBLIC_APP_ENV', description: 'Current environment' }
  ]}
/>
```
[//]: # 'RequiredEnvVars'

### Required Storage Keys

Monitor critical storage keys:

[//]: # 'RequiredStorageKeys'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredStorageKeys={[
    { key: 'user_token', type: 'secure', description: 'Auth token' },
    { key: 'app_settings', type: 'async', description: 'User preferences' }
  ]}
/>
```
[//]: # 'RequiredStorageKeys'

## Common Patterns

### Development-Only Setup

Ensure the tools only appear in development:

[//]: # 'DevOnlySetup'
```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'

export default function App() {
  return (
    <>
      {__DEV__ && (
        <RnBetterDevToolsBubble 
          queryClient={queryClient}
          environment="development"
        />
      )}
      {/* Your app */}
    </>
  )
}
```
[//]: # 'DevOnlySetup'

### With User Roles

Display different debugging capabilities based on user type:

[//]: # 'UserRoles'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  userRole={user.isAdmin ? 'admin' : 'user'}
/>
```
[//]: # 'UserRoles'

## Using the Tools

### Opening the Menu

Tap any of the menu buttons on the floating bubble:
- **G** - Game-style UI menu
- **C** - Claude-themed menu  
- **D** - Dial menu interface

### React Query Tools

1. Open the menu and select **REACT QUERY**
2. Browse active queries and mutations
3. Tap any query to view or edit its data
4. Use the WiFi toggle to simulate offline mode

### Storage Browser

1. Open the menu and select **STORAGE**
2. View all storage entries across AsyncStorage, MMKV, and SecureStorage
3. Tap entries to view, edit, or delete
4. Monitor real-time storage events

### Environment Monitor

1. Open the menu and select **ENV VARS**
2. Check all available environment variables
3. See warnings for missing required variables
4. Verify your app's configuration

## Next Steps

- [Installation Guide](./installation.md) - Platform-specific setup
- [Configuration](./configuration.md) - Advanced customization options
- [React Query Tools](./guides/react-query-tools.md) - Deep dive into query debugging