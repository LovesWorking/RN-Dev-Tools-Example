---
id: api
title: API Reference
---

Complete API reference for RN Better Dev Tools components and configuration.

## RnBetterDevToolsBubble

The main component that provides all dev tools functionality.

```tsx
<RnBetterDevToolsBubble
  queryClient={queryClient}
  environment={environment}
  userRole={userRole}
  requiredEnvVars={requiredEnvVars}
  requiredStorageKeys={requiredStorageKeys}
  enableSharedModalDimensions={enableSharedModalDimensions}
  hideEnvironment={hideEnvironment}
  hideUserStatus={hideUserStatus}
  hideQueryButton={hideQueryButton}
  hideWifiToggle={hideWifiToggle}
  hideEnvButton={hideEnvButton}
  hideSentryButton={hideSentryButton}
  hideStorageButton={hideStorageButton}
/>
```

### Props

#### queryClient

- **Type**: `QueryClient`
- **Required**: Yes
- **Description**: The TanStack Query client instance

[//]: # 'QueryClient'
```tsx
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

<RnBetterDevToolsBubble queryClient={queryClient} />
```
[//]: # 'QueryClient'

#### environment

- **Type**: `'development' | 'staging' | 'production'`
- **Required**: Yes
- **Description**: Current application environment

[//]: # 'Environment'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
/>
```
[//]: # 'Environment'

#### userRole

- **Type**: `'user' | 'admin' | 'developer'`
- **Required**: No
- **Default**: `'user'`
- **Description**: User role for role-based features

[//]: # 'UserRole'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  userRole="admin"
/>
```
[//]: # 'UserRole'

#### requiredEnvVars

- **Type**: `RequiredEnvVar[]`
- **Required**: No
- **Default**: `[]`
- **Description**: Environment variables to monitor

[//]: # 'RequiredEnvVars'
```tsx
interface RequiredEnvVar {
  key: string
  description?: string
  defaultValue?: string
  optional?: boolean
}

<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredEnvVars={[
    { 
      key: 'EXPO_PUBLIC_API_URL', 
      description: 'API endpoint' 
    },
    { 
      key: 'EXPO_PUBLIC_SENTRY_DSN', 
      description: 'Error tracking',
      optional: true 
    }
  ]}
/>
```
[//]: # 'RequiredEnvVars'

#### requiredStorageKeys

- **Type**: `RequiredStorageKey[]`
- **Required**: No
- **Default**: `[]`
- **Description**: Storage keys to monitor

[//]: # 'RequiredStorageKeys'
```tsx
interface RequiredStorageKey {
  key: string
  type: 'async' | 'mmkv' | 'secure'
  description?: string
  defaultValue?: string
  optional?: boolean
}

<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredStorageKeys={[
    { 
      key: 'auth_token', 
      type: 'secure',
      description: 'User authentication' 
    },
    { 
      key: 'app_settings', 
      type: 'async',
      description: 'User preferences',
      optional: true 
    }
  ]}
/>
```
[//]: # 'RequiredStorageKeys'

#### enableSharedModalDimensions

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Share dimensions across all modals

[//]: # 'SharedModalDimensions'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  enableSharedModalDimensions={true}
/>
```
[//]: # 'SharedModalDimensions'

#### hideEnvironment

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide environment indicator badge

[//]: # 'HideEnvironment'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideEnvironment={true}
/>
```
[//]: # 'HideEnvironment'

#### hideUserStatus

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide user role indicator

[//]: # 'HideUserStatus'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  userRole="admin"
  hideUserStatus={true}
/>
```
[//]: # 'HideUserStatus'

#### hideQueryButton

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide React Query tools section

[//]: # 'HideQueryButton'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideQueryButton={true}
/>
```
[//]: # 'HideQueryButton'

#### hideWifiToggle

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide WiFi toggle for network simulation

[//]: # 'HideWifiToggle'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideWifiToggle={true}
/>
```
[//]: # 'HideWifiToggle'

#### hideEnvButton

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide environment variables section

[//]: # 'HideEnvButton'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideEnvButton={true}
/>
```
[//]: # 'HideEnvButton'

#### hideSentryButton

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide Sentry events section (currently must be true)

[//]: # 'HideSentryButton'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideSentryButton={true} // Currently required
/>
```
[//]: # 'HideSentryButton'

#### hideStorageButton

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Hide storage browser section

[//]: # 'HideStorageButton'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideStorageButton={true}
/>
```
[//]: # 'HideStorageButton'

## Type Definitions

### Environment

```tsx
type Environment = 'development' | 'staging' | 'production'
```

### UserRole

```tsx
type UserRole = 'user' | 'admin' | 'developer'
```

### RequiredEnvVar

```tsx
interface RequiredEnvVar {
  key: string           // Environment variable name
  description?: string  // Description for documentation
  defaultValue?: string // Default if not set
  optional?: boolean    // Whether variable is optional
}
```

### RequiredStorageKey

```tsx
interface RequiredStorageKey {
  key: string                         // Storage key name
  type: 'async' | 'mmkv' | 'secure'  // Storage backend
  description?: string                // Description for documentation
  defaultValue?: string               // Default value if not set
  optional?: boolean                  // Whether key is optional
}
```

## Exported Components

### StorageEventListener (Standalone)

Monitor AsyncStorage events (not yet integrated into bubble):

```tsx
import { StorageEventListener } from 'rn-better-dev-tools/storage-events'

function DebugScreen() {
  return <StorageEventListener />
}
```

## Utility Functions

### resetDevToolsState

Clear all persisted dev tools state:

```tsx
import { resetDevToolsState } from 'rn-better-dev-tools'

await resetDevToolsState()
// All modal positions, states, and preferences cleared
```

### getDevToolsState

Get current dev tools state:

```tsx
import { getDevToolsState } from 'rn-better-dev-tools'

const state = await getDevToolsState()
// Returns: { modals: {...}, bubble: {...}, preferences: {...} }
```

## Hooks

### useDevToolsConfig

Access current dev tools configuration:

```tsx
import { useDevToolsConfig } from 'rn-better-dev-tools'

function MyComponent() {
  const config = useDevToolsConfig()
  // Returns current configuration object
}
```

### useModalState

Control modal visibility programmatically:

```tsx
import { useModalState } from 'rn-better-dev-tools'

function MyComponent() {
  const { openModal, closeModal, isOpen } = useModalState('reactQuery')
  
  // Open React Query modal
  openModal()
  
  // Check if open
  if (isOpen) {
    // Modal is visible
  }
}
```

## Constants

### DEFAULT_CONFIG

Default configuration values:

```tsx
const DEFAULT_CONFIG = {
  environment: 'development',
  userRole: 'user',
  enableSharedModalDimensions: false,
  hideEnvironment: false,
  hideUserStatus: false,
  hideQueryButton: false,
  hideWifiToggle: false,
  hideEnvButton: false,
  hideSentryButton: true,
  hideStorageButton: false,
  requiredEnvVars: [],
  requiredStorageKeys: []
}
```

### MODAL_TYPES

Available modal identifiers:

```tsx
const MODAL_TYPES = {
  REACT_QUERY: 'reactQuery',
  STORAGE: 'storage',
  ENV_VARS: 'envVars',
  NETWORK: 'network',
  SENTRY: 'sentry'
}
```

### MENU_TYPES

Available menu styles:

```tsx
const MENU_TYPES = {
  GAME_UI: 'dial2',    // G button
  CLAUDE: 'claude',    // C button
  DIAL: 'dial'        // D button
}
```

## Events

### DevTools Events

Listen to dev tools events:

```tsx
import { DevToolsEventEmitter } from 'rn-better-dev-tools'

// Listen for modal open
DevToolsEventEmitter.on('modalOpen', (modalType) => {
  console.log(`Modal opened: ${modalType}`)
})

// Listen for modal close
DevToolsEventEmitter.on('modalClose', (modalType) => {
  console.log(`Modal closed: ${modalType}`)
})

// Listen for bubble position change
DevToolsEventEmitter.on('bubbleMove', (position) => {
  console.log(`Bubble moved to: ${position.x}, ${position.y}`)
})
```

## Error Handling

### Error Boundaries

Dev tools include built-in error boundaries:

```tsx
// Errors in dev tools won't crash your app
// They're caught and displayed in console
```

### Fallback Behavior

If dev tools fail to load:
- Bubble won't appear
- App continues normally
- Error logged to console

## Performance

### Lazy Loading

Components load on demand:

```tsx
// Tools only load when accessed
// Reduces initial bundle size
// Improves app startup time
```

### Production Optimization

Auto-removed in production:

```tsx
// In production builds:
// - Component returns null
// - No code executed
// - Zero performance impact
```

## Migration Guide

### From v1 to v2

```tsx
// v1
<DevToolsBubble client={queryClient} />

// v2
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
/>
```

### Breaking Changes

- `client` prop renamed to `queryClient`
- `environment` prop now required
- Sentry temporarily disabled

## Next Steps

- [Configuration](../configuration.md) - Detailed configuration guide
- [Quick Start](../quick-start.md) - Get started quickly
- [React Query Tools](../guides/react-query-tools.md) - Query debugging