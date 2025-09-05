# RN Better Dev Tools - API Documentation

A comprehensive React Native developer tools library that provides debugging utilities for React Query, environment variables, storage, network monitoring, Sentry integration, and more.

## Installation

```bash
npm install rn-better-dev-tools
# or
yarn add rn-better-dev-tools
```

## Core Components

### RnBetterDevToolsBubble

The main floating bubble component that provides access to all developer tools.

```tsx
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      {/* Your app content */}
      <RnBetterDevToolsBubble
        queryClient={queryClient}
        environment="development"
        userRole="admin"
        requiredEnvVars={[
          "EXPO_PUBLIC_API_URL",
          { key: "EXPO_PUBLIC_DEBUG_MODE", expectedType: "boolean" }
        ]}
        requiredStorageKeys={[
          "user_preferences",
          { key: "auth_token", storageType: "secure" }
        ]}
      />
    </>
  );
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `queryClient` | `QueryClient` | ✅ | - | React Query client instance |
| `environment` | `Environment` | ✅ | - | Current environment ("local", "dev", "qa", "staging", "prod") |
| `userRole` | `UserRole` | ❌ | `"user"` | User role for feature access ("admin", "internal", "user") |
| `requiredEnvVars` | `RequiredEnvVar[]` | ❌ | `[]` | Environment variables to validate |
| `requiredStorageKeys` | `RequiredStorageKey[]` | ❌ | `[]` | Storage keys to monitor |
| `enableSharedModalDimensions` | `boolean` | ❌ | `false` | Enable persistent modal sizing across sessions |
| `hideEnvironment` | `boolean` | ❌ | `false` | Hide environment indicator |
| `hideUserStatus` | `boolean` | ❌ | `false` | Hide user status button |
| `hideQueryButton` | `boolean` | ❌ | `false` | Hide React Query button |
| `hideWifiToggle` | `boolean` | ❌ | `false` | Hide WiFi toggle button |
| `hideEnvButton` | `boolean` | ❌ | `false` | Hide environment variables button |
| `hideSentryButton` | `boolean` | ❌ | `false` | Hide Sentry logs button |
| `hideStorageButton` | `boolean` | ❌ | `false` | Hide storage browser button |

### JsModal

A high-performance, draggable modal component optimized for 60 FPS animations.

```tsx
import { JsModal } from 'rn-better-dev-tools';

export function MyModal() {
  const [visible, setVisible] = useState(false);

  return (
    <JsModal
      visible={visible}
      onClose={() => setVisible(false)}
      header={{
        title: "Custom Modal",
        subtitle: "Modal subtitle",
        showToggleButton: true,
        showCloseButton: true
      }}
      styles={{
        modal: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        content: { padding: 20 }
      }}
      enableSharedModalDimensions={true}
      initialMode="fullscreen"
    >
      {/* Modal content */}
    </JsModal>
  );
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | ✅ | - | Modal visibility state |
| `onClose` | `() => void` | ✅ | - | Close handler |
| `children` | `ReactNode` | ✅ | - | Modal content |
| `header` | `HeaderConfig` | ❌ | - | Header configuration |
| `styles` | `CustomStyles` | ❌ | - | Custom styling |
| `enableSharedModalDimensions` | `boolean` | ❌ | `false` | Persist dimensions across sessions |
| `initialMode` | `ModalMode` | ❌ | `"fullscreen"` | Initial modal mode |
| `allowModeToggle` | `boolean` | ❌ | `true` | Allow switching between fullscreen/floating |
| `persistPosition` | `boolean` | ❌ | `true` | Remember modal position |
| `bounceOnOverscroll` | `boolean` | ❌ | `true` | Bounce effect on scroll |

#### Header Configuration

```tsx
interface HeaderConfig {
  title?: string;
  subtitle?: string;
  showToggleButton?: boolean;
  showCloseButton?: boolean;
  customContent?: ReactNode;
  rightContent?: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
}
```

#### Modal Modes

```tsx
type ModalMode = "fullscreen" | "floating";
```

#### Custom Styles

```tsx
interface CustomStyles {
  modal?: ViewStyle;
  content?: ViewStyle;
  header?: ViewStyle;
  scrollView?: ViewStyle;
}
```

## Type Definitions

### UserRole

Defines the user's access level for different development features.

```tsx
type UserRole = "admin" | "internal" | "user";
```

- **admin**: Full access to all development tools
- **internal**: Access to internal development features  
- **user**: Basic user-level debugging features

### Environment

Defines the current application environment.

```tsx
type Environment = "local" | "dev" | "qa" | "staging" | "prod";
```

Each environment displays with different colors and icons in the UI.

### RequiredEnvVar

Configuration for environment variables that should be validated.

```tsx
type RequiredEnvVar =
  | string // Just check if exists
  | {
      key: string;
      expectedValue: string;
      description?: string;
    }
  | {
      key: string;
      expectedType: EnvVarType;
      description?: string;
    };

type EnvVarType = "string" | "number" | "boolean" | "array" | "object" | "url";
```

#### Examples

```tsx
const requiredEnvVars: RequiredEnvVar[] = [
  // Simple existence check
  "EXPO_PUBLIC_API_URL",
  
  // Check specific value
  { 
    key: "EXPO_PUBLIC_ENVIRONMENT", 
    expectedValue: "development",
    description: "Must be set to development for debug features"
  },
  
  // Type validation
  { 
    key: "EXPO_PUBLIC_DEBUG_MODE", 
    expectedType: "boolean",
    description: "Controls debug logging"
  },
  
  // URL validation
  {
    key: "EXPO_PUBLIC_API_ENDPOINT",
    expectedType: "url", 
    description: "Backend API endpoint"
  }
];
```

### RequiredStorageKey

Configuration for storage keys that should be monitored.

```tsx
type RequiredStorageKey =
  | string // Default AsyncStorage
  | {
      key: string;
      expectedValue: string;
      description?: string;
    }
  | {
      key: string;
      expectedType: string;
      description?: string;
    }
  | {
      key: string;
      storageType: StorageType;
      description?: string;
    };

type StorageType = "async" | "mmkv" | "secure";
```

#### Examples

```tsx
const requiredStorageKeys: RequiredStorageKey[] = [
  // Simple AsyncStorage key
  "user_preferences",
  
  // Secure storage key
  {
    key: "auth_token",
    storageType: "secure",
    description: "User authentication token"
  },
  
  // MMKV storage with type validation
  {
    key: "app_settings", 
    storageType: "mmkv",
    expectedType: "object",
    description: "Application settings object"
  },
  
  // Expected value validation
  {
    key: "onboarding_complete",
    expectedValue: "true",
    description: "Onboarding completion status"  
  }
];
```

## Features Overview

### React Query DevTools
- Query browser with real-time status
- Mutation tracking and debugging
- Cache management and invalidation
- Data editor with JSON validation
- Query performance metrics

### Environment Management
- Environment variable validation
- Missing variable detection
- Type checking for environment values
- Environment indicator badge
- Real-time environment switching

### Storage Browser
- AsyncStorage, MMKV, and Secure Storage support
- Real-time storage monitoring
- Key-value editing with validation
- Storage events timeline
- Diff viewer for value changes

### Network Monitoring
- HTTP request/response logging
- Request filtering and search
- Response time tracking
- Error rate monitoring
- Offline mode simulation

### Sentry Integration
- Real-time error tracking
- Breadcrumb monitoring  
- Performance monitoring
- Custom event filtering
- Error details and stack traces

### Settings & Configuration
- Floating tools customization
- Modal behavior preferences
- Theme customization
- Feature toggle controls
- Persistent user preferences

## Advanced Configuration

### Theme Customization

```tsx
import { theme, colors } from 'rn-better-dev-tools/themes';

// Access theme colors
const primaryColor = colors.primary; // "#00FFFF"
const backgroundColor = colors.background; // "#0A0A0F"

// Apply theme styles
const customStyles = {
  modal: theme.styles.modal,
  card: theme.styles.card
};
```

### Performance Optimization

The library is optimized for production use:

- Native driver animations for 60 FPS performance
- Virtualized lists for large data sets
- Memoized components to prevent unnecessary re-renders
- Efficient storage monitoring with minimal overhead
- Lazy loading of heavy features

### Production Safety

- Automatically disables in production builds (when `__DEV__ === false`)
- No performance impact on production apps
- Secure storage integration with encryption
- Network request filtering for sensitive data
- Environment-based feature gating

## Best Practices

1. **Wrap your app root** - Place `RnBetterDevToolsBubble` at the app root level
2. **Configure required variables** - Define critical environment variables and storage keys
3. **Use appropriate user roles** - Restrict sensitive features based on user access
4. **Enable shared dimensions** - For consistent modal sizing across sessions
5. **Customize visibility** - Hide tools not relevant to your workflow
6. **Monitor performance** - Use network and query tools to identify bottlenecks

## TypeScript Support

The library is fully typed with TypeScript, providing:
- Complete type definitions for all components
- IntelliSense support in IDEs
- Compile-time validation of props
- Generic types for custom data structures
- Strict null checking compatibility