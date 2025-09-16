# RN Better Dev Tools - Usage Guide

This guide provides practical examples and implementation patterns for integrating the RN Better Dev Tools into your React Native application.

## Quick Start

### 1. Installation

```bash
npm install rn-better-dev-tools @tanstack/react-query
# or
yarn add rn-better-dev-tools @tanstack/react-query
```

### 2. Basic Setup

```tsx
// App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools';
import { YourAppContent } from './YourAppContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppContent />
      
      {/* Dev Tools - Only shows in development */}
      {__DEV__ && (
        <RnBetterDevToolsBubble
          queryClient={queryClient}
          environment="dev"
          userRole="admin"
        />
      )}
    </QueryClientProvider>
  );
}
```

### 3. Environment Detection

```tsx
// utils/environment.ts
import { Environment } from 'rn-better-dev-tools';

export function getCurrentEnvironment(): Environment {
  // Method 1: From environment variables
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT;
  if (env === 'prod' || env === 'production') return 'prod';
  if (env === 'staging') return 'staging';
  if (env === 'qa' || env === 'test') return 'qa';
  if (env === 'dev' || env === 'development') return 'dev';
  
  // Method 2: From app configuration
  if (__DEV__) return 'local';
  
  // Method 3: From build configuration
  // Add your own logic here based on your build setup
  
  return 'local';
}

// App.tsx
import { getCurrentEnvironment } from './utils/environment';

export default function App() {
  const environment = getCurrentEnvironment();
  
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppContent />
      {__DEV__ && (
        <RnBetterDevToolsBubble
          queryClient={queryClient}
          environment={environment}
          userRole="admin"
        />
      )}
    </QueryClientProvider>
  );
}
```

## Environment Variables Setup

### Basic Environment Variables

```tsx
// config/environmentVariables.ts
import { RequiredEnvVar } from 'rn-better-dev-tools';

export const requiredEnvVars: RequiredEnvVar[] = [
  // API Configuration
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_API_KEY",
  
  // Feature Flags
  {
    key: "EXPO_PUBLIC_ENABLE_ANALYTICS",
    expectedType: "boolean",
    description: "Controls analytics collection"
  },
  
  // Environment Specific
  {
    key: "EXPO_PUBLIC_ENVIRONMENT",
    expectedValue: "development",
    description: "Current environment name"
  },
  
  // URLs with validation
  {
    key: "EXPO_PUBLIC_WEBSOCKET_URL", 
    expectedType: "url",
    description: "WebSocket connection endpoint"
  }
];
```

### Advanced Environment Validation

```tsx
// config/environmentValidation.ts
import { RequiredEnvVar } from 'rn-better-dev-tools';

// Development environment variables
export const devEnvVars: RequiredEnvVar[] = [
  "EXPO_PUBLIC_DEV_API_URL",
  {
    key: "EXPO_PUBLIC_DEBUG_MODE",
    expectedType: "boolean",
    description: "Enables debug logging and dev features"
  },
  {
    key: "EXPO_PUBLIC_MOCK_RESPONSES", 
    expectedType: "boolean",
    description: "Use mock API responses"
  }
];

// Staging environment variables
export const stagingEnvVars: RequiredEnvVar[] = [
  "EXPO_PUBLIC_STAGING_API_URL",
  {
    key: "EXPO_PUBLIC_SENTRY_DSN",
    expectedType: "string",
    description: "Sentry error tracking DSN"
  }
];

// Production environment variables
export const prodEnvVars: RequiredEnvVar[] = [
  "EXPO_PUBLIC_PROD_API_URL",
  "EXPO_PUBLIC_SENTRY_DSN",
  {
    key: "EXPO_PUBLIC_ANALYTICS_KEY",
    expectedType: "string", 
    description: "Analytics service API key"
  }
];

// Combine based on environment
export function getRequiredEnvVars(environment: Environment): RequiredEnvVar[] {
  const baseVars: RequiredEnvVar[] = [
    "EXPO_PUBLIC_APP_NAME",
    "EXPO_PUBLIC_VERSION"
  ];
  
  switch (environment) {
    case 'local':
    case 'dev':
      return [...baseVars, ...devEnvVars];
    case 'staging':
      return [...baseVars, ...stagingEnvVars];
    case 'prod':
      return [...baseVars, ...prodEnvVars];
    default:
      return baseVars;
  }
}
```

## Storage Configuration

### Basic Storage Setup

```tsx
// config/storageKeys.ts
import { RequiredStorageKey } from 'rn-better-dev-tools';

export const requiredStorageKeys: RequiredStorageKey[] = [
  // AsyncStorage keys
  "user_preferences",
  "app_settings",
  "onboarding_status",
  
  // Secure storage keys
  {
    key: "auth_token",
    storageType: "secure",
    description: "User authentication JWT token"
  },
  {
    key: "refresh_token", 
    storageType: "secure",
    description: "Token refresh JWT"
  },
  
  // MMKV storage keys (if using react-native-mmkv)
  {
    key: "cache_data",
    storageType: "mmkv", 
    description: "Application cache data"
  },
  
  // Expected values
  {
    key: "terms_accepted",
    expectedValue: "true",
    description: "User has accepted terms and conditions"
  }
];
```

### Storage Types Integration

```tsx
// storage/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

// MMKV instance (if using)
export const mmkvStorage = new MMKV();

// Storage utilities
export const storage = {
  // AsyncStorage methods
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  },
  
  // MMKV methods
  getMmkvItem(key: string): string | undefined {
    return mmkvStorage.getString(key);
  },
  
  setMmkvItem(key: string, value: string): void {
    mmkvStorage.set(key, value);
  },
  
  // Secure storage methods  
  async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      return credentials ? credentials.password : null;
    } catch {
      return null;
    }
  },
  
  async setSecureItem(key: string, value: string): Promise<void> {
    return Keychain.setInternetCredentials(key, key, value);
  }
};
```

## Custom Modal Implementation

### Using JsModal Component

```tsx
// components/CustomModal.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { JsModal } from 'rn-better-dev-tools';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  data?: any;
}

export function CustomModal({ visible, onClose, title, data }: CustomModalProps) {
  const [mode, setMode] = useState<'fullscreen' | 'floating'>('fullscreen');

  return (
    <JsModal
      visible={visible}
      onClose={onClose}
      initialMode={mode}
      allowModeToggle={true}
      enableSharedModalDimensions={true}
      header={{
        title,
        subtitle: `${Object.keys(data || {}).length} items`,
        showToggleButton: true,
        showCloseButton: true,
        backgroundColor: 'rgba(10, 10, 20, 0.95)',
      }}
      styles={{
        modal: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderColor: 'rgba(0, 255, 255, 0.3)',
        },
        content: {
          padding: 20,
          flex: 1,
        }
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 16, marginBottom: 20 }}>
          Modal Content
        </Text>
        
        {/* Your custom content here */}
        <Text style={{ color: 'gray' }}>
          {JSON.stringify(data, null, 2)}
        </Text>
        
        <Button title="Action" onPress={() => console.log('Action pressed')} />
      </View>
    </JsModal>
  );
}
```

### Custom Header Component

```tsx
// components/CustomHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from 'rn-better-dev-tools/themes';

interface CustomHeaderProps {
  title: string;
  onClose: () => void;
  onToggleMode: () => void;
  mode: 'fullscreen' | 'floating';
}

export function CustomHeader({ title, onClose, onToggleMode, mode }: CustomHeaderProps) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.modalHeader,
      borderBottomWidth: 1,
      borderBottomColor: colors.modalHeaderBorder,
    }}>
      <Text style={{
        color: colors.text,
        fontSize: 18,
        fontWeight: '600',
      }}>
        {title}
      </Text>
      
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={onToggleMode}
          style={{
            padding: 8,
            backgroundColor: colors.modalToggleButtonBg,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: colors.modalToggleButton, fontSize: 12 }}>
            {mode === 'fullscreen' ? 'FLOAT' : 'FULL'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 8,
            backgroundColor: colors.modalCloseButtonBg,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: colors.modalCloseButton, fontSize: 12 }}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Usage in JsModal
<JsModal
  visible={visible}
  onClose={onClose}
  header={{
    customContent: (
      <CustomHeader
        title="Custom Modal"
        onClose={onClose}
        onToggleMode={() => {}}
        mode="fullscreen"
      />
    )
  }}
>
  {/* Modal content */}
</JsModal>
```

## Advanced Configuration Examples

### Role-Based Feature Access

```tsx
// hooks/useUserRole.ts
import { useState, useEffect } from 'react';
import { UserRole } from 'rn-better-dev-tools';

export function useUserRole(): UserRole {
  const [userRole, setUserRole] = useState<UserRole>('user');
  
  useEffect(() => {
    // Determine user role based on your authentication system
    const checkUserRole = async () => {
      try {
        const user = await getCurrentUser(); // Your auth method
        
        if (user.isAdmin) {
          setUserRole('admin');
        } else if (user.isInternal) {
          setUserRole('internal');
        } else {
          setUserRole('user');
        }
      } catch {
        setUserRole('user');
      }
    };
    
    checkUserRole();
  }, []);
  
  return userRole;
}

// App.tsx
import { useUserRole } from './hooks/useUserRole';

export default function App() {
  const userRole = useUserRole();
  
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppContent />
      {__DEV__ && (
        <RnBetterDevToolsBubble
          queryClient={queryClient}
          environment="dev"
          userRole={userRole}
          // Admin sees all tools
          hideQueryButton={userRole === 'user'}
          hideSentryButton={userRole === 'user'}
          hideStorageButton={userRole === 'user'}
        />
      )}
    </QueryClientProvider>
  );
}
```

### Environment-Specific Configuration

```tsx
// config/devToolsConfig.ts
import { Environment, RequiredEnvVar, RequiredStorageKey } from 'rn-better-dev-tools';

interface DevToolsConfig {
  requiredEnvVars: RequiredEnvVar[];
  requiredStorageKeys: RequiredStorageKey[];
  hiddenTools: string[];
}

export function getDevToolsConfig(environment: Environment): DevToolsConfig {
  const baseConfig: DevToolsConfig = {
    requiredEnvVars: [
      "EXPO_PUBLIC_APP_NAME",
      "EXPO_PUBLIC_VERSION"
    ],
    requiredStorageKeys: [
      "user_preferences"
    ],
    hiddenTools: []
  };
  
  switch (environment) {
    case 'local':
    case 'dev':
      return {
        ...baseConfig,
        requiredEnvVars: [
          ...baseConfig.requiredEnvVars,
          "EXPO_PUBLIC_DEV_API_URL",
          { key: "EXPO_PUBLIC_DEBUG_MODE", expectedType: "boolean" }
        ],
        requiredStorageKeys: [
          ...baseConfig.requiredStorageKeys,
          "debug_settings",
          { key: "mock_data", storageType: "mmkv" }
        ],
        hiddenTools: [] // Show all tools in development
      };
      
    case 'staging':
      return {
        ...baseConfig,
        requiredEnvVars: [
          ...baseConfig.requiredEnvVars,
          "EXPO_PUBLIC_STAGING_API_URL",
          "EXPO_PUBLIC_SENTRY_DSN"
        ],
        hiddenTools: ['storage'] // Hide storage tools in staging
      };
      
    case 'prod':
      return {
        ...baseConfig,
        requiredEnvVars: [
          ...baseConfig.requiredEnvVars,
          "EXPO_PUBLIC_PROD_API_URL",
          "EXPO_PUBLIC_ANALYTICS_KEY"
        ],
        hiddenTools: ['query', 'storage', 'sentry'] // Minimal tools in production
      };
      
    default:
      return baseConfig;
  }
}

// Usage
const config = getDevToolsConfig(environment);

<RnBetterDevToolsBubble
  queryClient={queryClient}
  environment={environment}
  requiredEnvVars={config.requiredEnvVars}
  requiredStorageKeys={config.requiredStorageKeys}
  hideQueryButton={config.hiddenTools.includes('query')}
  hideStorageButton={config.hiddenTools.includes('storage')}
  hideSentryButton={config.hiddenTools.includes('sentry')}
/>
```

### Network Monitoring Setup

```tsx
// network/networkInterceptor.ts
import { setupNetworkInterceptor } from 'rn-better-dev-tools/network';

// Setup network monitoring (call this early in your app)
export function initializeNetworkMonitoring() {
  if (__DEV__) {
    setupNetworkInterceptor({
      // Filter sensitive requests
      ignoreUrls: [
        /\/auth\/login/,
        /\/payments\//,
        /\/sensitive-data\//
      ],
      
      // Filter request headers
      sensitiveHeaders: [
        'authorization',
        'x-api-key',
        'cookie'
      ],
      
      // Max requests to keep in memory
      maxRequests: 100,
      
      // Enable request body logging
      logRequestBody: true,
      
      // Enable response body logging  
      logResponseBody: true
    });
  }
}

// App.tsx
import { initializeNetworkMonitoring } from './network/networkInterceptor';

export default function App() {
  useEffect(() => {
    initializeNetworkMonitoring();
  }, []);
  
  return (
    // ... rest of your app
  );
}
```

## Integration Examples

### Expo Router Integration

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      
      {__DEV__ && (
        <RnBetterDevToolsBubble
          queryClient={queryClient}
          environment="dev"
          userRole="admin"
          requiredEnvVars={[
            "EXPO_PUBLIC_API_URL",
            { key: "EXPO_PUBLIC_DEBUG", expectedType: "boolean" }
          ]}
        />
      )}
    </QueryClientProvider>
  );
}
```

### Redux Integration

```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupDevToolsStorageMonitoring } from './devToolsIntegration';

export const store = configureStore({
  reducer: {
    // your reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

// Monitor Redux state in dev tools
if (__DEV__) {
  setupDevToolsStorageMonitoring(store);
}

// devToolsIntegration.ts
import { Store } from '@reduxjs/toolkit';

export function setupDevToolsStorageMonitoring(store: Store) {
  // Monitor Redux state changes and sync with dev tools storage
  store.subscribe(() => {
    const state = store.getState();
    // Save state snapshot for dev tools inspection
    AsyncStorage.setItem('redux_state', JSON.stringify(state));
  });
}
```

## Best Practices

### 1. Performance Optimization

```tsx
// Use useMemo for expensive configurations
const devToolsConfig = useMemo(() => ({
  requiredEnvVars: getRequiredEnvVars(environment),
  requiredStorageKeys: getRequiredStorageKeys(environment),
}), [environment]);

// Conditional rendering to avoid unnecessary work
{__DEV__ && environment !== 'prod' && (
  <RnBetterDevToolsBubble
    queryClient={queryClient}
    environment={environment}
    {...devToolsConfig}
  />
)}
```

### 2. Error Boundaries

```tsx
// components/DevToolsErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class DevToolsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('DevTools Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ position: 'absolute', top: 100, right: 20, padding: 10, backgroundColor: 'red' }}>
          <Text style={{ color: 'white' }}>Dev Tools Error</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Usage
<DevToolsErrorBoundary>
  <RnBetterDevToolsBubble {...props} />
</DevToolsErrorBoundary>
```

### 3. Conditional Loading

```tsx
// hooks/useDevTools.tsx
import { useState, useEffect } from 'react';

export function useDevTools() {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    // Only load dev tools when needed
    const checkDevTools = async () => {
      if (!__DEV__) return;
      
      // Check if user wants dev tools (could be a setting)
      const devToolsEnabled = await AsyncStorage.getItem('dev_tools_enabled');
      setShouldLoad(devToolsEnabled === 'true');
    };
    
    checkDevTools();
  }, []);
  
  return shouldLoad;
}

// Usage
export default function App() {
  const shouldLoadDevTools = useDevTools();
  
  return (
    <QueryClientProvider client={queryClient}>
      <YourAppContent />
      {shouldLoadDevTools && (
        <RnBetterDevToolsBubble {...devToolsProps} />
      )}
    </QueryClientProvider>
  );
}
```