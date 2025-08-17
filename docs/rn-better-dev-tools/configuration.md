---
id: configuration
title: Configuration
---

Comprehensive configuration options for customizing RN Better Dev Tools to match your development workflow.

## Basic Configuration

The minimal configuration requires only a QueryClient:

[//]: # 'MinimalConfig'
```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
/>
```
[//]: # 'MinimalConfig'

## Configuration Options

### Environment Configuration

Define your application environment for visual indicators:

[//]: # 'EnvironmentConfig'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development" // 'development' | 'staging' | 'production'
  hideEnvironment={false} // Show/hide environment badge
/>
```
[//]: # 'EnvironmentConfig'

### User Roles

Display role-based debugging capabilities:

[//]: # 'UserRoleConfig'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  userRole="admin" // 'user' | 'admin' | 'developer'
  hideUserStatus={false} // Show/hide user role indicator
/>
```
[//]: # 'UserRoleConfig'

### Required Environment Variables

Monitor critical environment variables:

[//]: # 'RequiredEnvConfig'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredEnvVars={[
    { 
      key: 'EXPO_PUBLIC_API_URL', 
      description: 'Backend API endpoint',
      defaultValue: 'https://api.example.com' // Optional
    },
    { 
      key: 'EXPO_PUBLIC_APP_ENV', 
      description: 'Current environment'
    },
    {
      key: 'EXPO_PUBLIC_SENTRY_DSN',
      description: 'Sentry error tracking',
      optional: true // Mark as optional
    }
  ]}
/>
```
[//]: # 'RequiredEnvConfig'

### Required Storage Keys

Track important storage entries:

[//]: # 'RequiredStorageConfig'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredStorageKeys={[
    { 
      key: 'user_token', 
      type: 'secure', // 'async' | 'mmkv' | 'secure'
      description: 'Authentication token'
    },
    { 
      key: 'app_settings', 
      type: 'async',
      description: 'User preferences',
      defaultValue: '{"theme": "dark"}' // Optional default
    },
    {
      key: 'cache_data',
      type: 'mmkv',
      description: 'Cached API responses',
      optional: true
    }
  ]}
/>
```
[//]: # 'RequiredStorageConfig'

## Feature Toggles

### Hiding Specific Sections

Control which debugging sections are available:

[//]: # 'FeatureToggles'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  hideQueryButton={false}    // React Query tools
  hideEnvButton={false}       // Environment variables
  hideStorageButton={false}   // Storage browser
  hideSentryButton={true}     // Sentry events (currently disabled)
  hideWifiToggle={false}      // Network simulation toggle
/>
```
[//]: # 'FeatureToggles'

### Modal Persistence

Configure modal state persistence:

[//]: # 'ModalPersistence'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  enableSharedModalDimensions={true} // Share size across all modals
/>
```
[//]: # 'ModalPersistence'

## Advanced Configuration

### Custom Menu Types

The dev tools support multiple menu interfaces:

[//]: # 'MenuTypes'
```tsx
// Users can switch between menu types using the G, C, D buttons
// G - Game UI (Dial2) - Futuristic gaming interface
// C - Claude theme - AI-inspired design
// D - Dial menu - Classic radial menu
```
[//]: # 'MenuTypes'

### Complete Configuration Example

[//]: # 'CompleteConfig'
```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools'
import { QueryClient } from '@tanstack/react-query'
import { useAuth } from './hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

export function App() {
  const { user } = useAuth()
  
  return (
    <>
      {__DEV__ && (
        <RnBetterDevToolsBubble 
          // Core configuration
          queryClient={queryClient}
          environment={process.env.EXPO_PUBLIC_APP_ENV || 'development'}
          
          // User configuration
          userRole={user?.role || 'user'}
          hideUserStatus={false}
          
          // Required validations
          requiredEnvVars={[
            { key: 'EXPO_PUBLIC_API_URL', description: 'API endpoint' },
            { key: 'EXPO_PUBLIC_APP_ENV', description: 'Environment' },
            { key: 'EXPO_PUBLIC_SENTRY_DSN', description: 'Error tracking', optional: true }
          ]}
          requiredStorageKeys={[
            { key: 'auth_token', type: 'secure', description: 'User authentication' },
            { key: 'user_preferences', type: 'async', description: 'App settings' }
          ]}
          
          // Feature toggles
          hideQueryButton={false}
          hideEnvButton={false}
          hideStorageButton={false}
          hideSentryButton={true} // Currently disabled
          hideWifiToggle={false}
          hideEnvironment={false}
          
          // Modal configuration
          enableSharedModalDimensions={true}
        />
      )}
      <YourAppContent />
    </>
  )
}
```
[//]: # 'CompleteConfig'

## Environment-Specific Configuration

### Development Environment

Maximum debugging capabilities:

[//]: # 'DevEnvironment'
```tsx
const devConfig = {
  queryClient,
  environment: 'development',
  userRole: 'developer',
  // Show all debugging sections
  hideQueryButton: false,
  hideEnvButton: false,
  hideStorageButton: false,
  hideWifiToggle: false,
}
```
[//]: # 'DevEnvironment'

### Staging Environment

Production-like with debugging:

[//]: # 'StagingEnvironment'
```tsx
const stagingConfig = {
  queryClient,
  environment: 'staging',
  userRole: user?.role || 'user',
  // Hide developer-specific features
  hideWifiToggle: true,
  hideSentryButton: true,
}
```
[//]: # 'StagingEnvironment'

### Production Environment

Automatically disabled, but can be configured for admin users:

[//]: # 'ProductionEnvironment'
```tsx
const productionConfig = {
  queryClient,
  environment: 'production',
  userRole: 'admin',
  // Only show critical monitoring
  hideQueryButton: true,
  hideStorageButton: true,
  hideWifiToggle: true,
}

// Only show for admin users in production
{(__DEV__ || user?.isAdmin) && <RnBetterDevToolsBubble {...productionConfig} />}
```
[//]: # 'ProductionEnvironment'

## Persistence Settings

The dev tools automatically persist:

- **Bubble position** - Maintains position across app restarts
- **Modal states** - Remembers which modals were open
- **Modal positions** - Saves where modals were positioned
- **Modal sizes** - Retains custom modal dimensions
- **Active filters** - Preserves query filters and search terms
- **Selected tabs** - Remembers active tabs in each section

These settings are stored locally and cleared when the app is deleted.

## Performance Considerations

### Optimizing for Large Applications

For apps with many queries:

[//]: # 'PerformanceOptimization'
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce observer overhead in dev tools
      notifyOnChangeProps: 'tracked',
    },
  },
})
```
[//]: # 'PerformanceOptimization'

### Conditional Loading

Load dev tools only when needed:

[//]: # 'ConditionalLoading'
```tsx
const DevTools = __DEV__ 
  ? require('rn-better-dev-tools').RnBetterDevToolsBubble 
  : () => null

<DevTools queryClient={queryClient} environment="development" />
```
[//]: # 'ConditionalLoading'

## Next Steps

- [React Query Tools](./guides/react-query-tools.md) - Deep dive into query debugging
- [Storage Monitoring](./guides/storage-monitoring.md) - Storage inspection features
- [Environment Monitoring](./guides/environment-monitoring.md) - Environment variable tracking