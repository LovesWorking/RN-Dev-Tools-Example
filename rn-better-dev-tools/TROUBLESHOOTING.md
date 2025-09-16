# RN Better Dev Tools - Troubleshooting Guide

This guide covers common issues, solutions, and debugging techniques for the RN Better Dev Tools library.

## Common Setup Issues

### 1. Dev Tools Not Appearing

**Problem**: The development tools bubble doesn't show up in your app.

**Solutions**:

```tsx
// ✅ Ensure __DEV__ check
{__DEV__ && (
  <RnBetterDevToolsBubble
    queryClient={queryClient}
    environment="dev"
  />
)}

// ✅ Check if accidentally hidden
<RnBetterDevToolsBubble
  queryClient={queryClient}
  environment="dev"
  hideUserStatus={false}  // Make sure this is false
/>

// ✅ Verify QueryClient is provided
const queryClient = new QueryClient(); // Must be created

// ✅ Check component placement (should be last in tree)
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourMainApp />
      {/* Place dev tools AFTER main app content */}
      {__DEV__ && <RnBetterDevToolsBubble {...props} />}
    </QueryClientProvider>
  );
}
```

**Debug Steps**:
1. Add console log to verify dev tools are being rendered:
```tsx
{__DEV__ && console.log('Rendering dev tools') && (
  <RnBetterDevToolsBubble {...props} />
)}
```

2. Check if the component is mounted using React DevTools
3. Verify no overlay views are blocking the bubble

### 2. QueryClient Not Found Error

**Problem**: Error about missing QueryClient or React Query context.

**Solution**:

```tsx
// ❌ Wrong - Dev tools outside provider
export function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
      <RnBetterDevToolsBubble queryClient={queryClient} /> {/* Outside provider */}
    </>
  );
}

// ✅ Correct - Dev tools inside provider
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && (
        <RnBetterDevToolsBubble queryClient={queryClient} />
      )}
    </QueryClientProvider>
  );
}
```

### 3. Environment Variable Issues

**Problem**: Environment variables not being detected or validated correctly.

**Solutions**:

```tsx
// ✅ Check environment variable format
const requiredEnvVars = [
  // Make sure variables exist in your .env files
  "EXPO_PUBLIC_API_URL",           // ✅ Correct format
  "API_URL",                       // ❌ Missing EXPO_PUBLIC_ prefix
  
  // For type checking, ensure correct syntax
  { 
    key: "EXPO_PUBLIC_DEBUG_MODE", 
    expectedType: "boolean"         // ✅ Valid type
  },
  {
    key: "EXPO_PUBLIC_PORT",
    expectedType: "int"             // ❌ Use "number" instead
  }
];

// ✅ Verify environment variable values
console.log('Environment variables:', {
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE,
});
```

**Debug Steps**:
1. Check your `.env` file exists and has correct format:
```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_ENVIRONMENT=development
```

2. Restart your development server after changing environment variables
3. For Expo projects, ensure variables start with `EXPO_PUBLIC_`

### 4. Storage Integration Problems

**Problem**: Storage keys not being monitored or showing errors.

**Solutions**:

```tsx
// ✅ Ensure storage libraries are installed
// For AsyncStorage
npm install @react-native-async-storage/async-storage

// For MMKV (optional)
npm install react-native-mmkv

// For Secure Storage (optional)  
npm install react-native-keychain

// ✅ Check storage key configuration
const requiredStorageKeys = [
  "user_preferences",              // ✅ Simple key
  {
    key: "auth_token",
    storageType: "secure",         // ✅ Valid storage type
    description: "User auth token"
  },
  {
    key: "settings",
    storageType: "invalid"         // ❌ Use "async", "mmkv", or "secure"
  }
];

// ✅ Verify storage permissions (iOS)
// Add to Info.plist for keychain access:
<key>NSFaceIDUsageDescription</key>
<string>Use Face ID to authenticate</string>
```

## Performance Troubleshooting

### 1. Slow Modal Animations

**Problem**: Modals animate slowly or stutter during open/close.

**Solutions**:

```tsx
// ✅ Enable native driver optimizations
<JsModal
  visible={visible}
  onClose={onClose}
  enableSharedModalDimensions={false}  // Disable if causing issues
  initialMode="floating"               // Try floating mode for better performance
>
  {content}
</JsModal>

// ✅ Reduce content complexity during animations
const [isAnimating, setIsAnimating] = useState(false);

return (
  <JsModal
    visible={visible}
    onClose={onClose}
    onAnimationStart={() => setIsAnimating(true)}
    onAnimationEnd={() => setIsAnimating(false)}
  >
    {isAnimating ? (
      <SimpleLoadingView />        // Show simplified content during animation
    ) : (
      <ComplexContentView />       // Full content when animation complete
    )}
  </JsModal>
);
```

**Debug Steps**:
1. Enable performance monitoring:
```tsx
// Enable React Native performance monitoring
if (__DEV__) {
  import('react-native/Libraries/Performance/Systrace').then(Systrace => {
    Systrace.beginEvent('DevTools');
  });
}
```

2. Check for expensive operations in render:
```tsx
// ❌ Avoid expensive operations in render
function ExpensiveComponent() {
  const expensiveValue = heavyComputation(); // Computed every render
  return <View>{expensiveValue}</View>;
}

// ✅ Use memoization
function OptimizedComponent() {
  const expensiveValue = useMemo(() => heavyComputation(), [dependencies]);
  return <View>{expensiveValue}</View>;
}
```

### 2. High Memory Usage

**Problem**: App memory usage increases when dev tools are active.

**Solutions**:

```tsx
// ✅ Limit data retention
<RnBetterDevToolsBubble
  queryClient={queryClient}
  environment="dev"
  // Reduce data kept in memory
  maxNetworkRequests={50}      // Limit network history
  maxSentryEvents={25}         // Limit Sentry events  
  maxStorageEvents={30}        // Limit storage events
/>

// ✅ Use pagination for large datasets
function LargeDataModal() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  
  const paginatedData = useMemo(() => 
    largeDataset.slice((page - 1) * pageSize, page * pageSize),
    [largeDataset, page, pageSize]
  );
  
  return (
    <JsModal visible={visible} onClose={onClose}>
      <VirtualizedList data={paginatedData} />
    </JsModal>
  );
}
```

### 3. Laggy UI Interactions

**Problem**: UI becomes unresponsive when dev tools are open.

**Solutions**:

```tsx
// ✅ Use InteractionManager for heavy operations
import { InteractionManager } from 'react-native';

function HeavyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Wait for interactions to complete before heavy work
    const task = InteractionManager.runAfterInteractions(() => {
      performHeavyOperation().then(setData);
    });
    
    return () => task.cancel();
  }, []);
  
  return data ? <DataView data={data} /> : <LoadingView />;
}

// ✅ Debounce frequent updates
import { useDebouncedCallback } from 'use-debounce';

function SearchableList() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useDebouncedCallback(
    (searchQuery) => {
      performSearch(searchQuery);
    },
    300  // Wait 300ms after user stops typing
  );
  
  return (
    <TextInput
      value={query}
      onChangeText={(text) => {
        setQuery(text);
        debouncedSearch(text);
      }}
    />
  );
}
```

## Network Monitoring Issues

### 1. Network Requests Not Showing

**Problem**: HTTP requests aren't being captured in the network monitor.

**Solutions**:

```tsx
// ✅ Ensure network interception is set up early
// In your App.tsx or index.js (before any network calls)
import { setupNetworkInterceptor } from 'rn-better-dev-tools/network';

if (__DEV__) {
  setupNetworkInterceptor();
}

// ✅ Check if using unsupported networking library
// Supported: fetch(), XMLHttpRequest, react-query, axios
// For other libraries, you may need custom integration

// ✅ Verify requests aren't filtered out
setupNetworkInterceptor({
  ignoreUrls: [
    // Make sure your URLs aren't in ignore list
    /\/api\/debug/,  // This would ignore debug endpoints
  ]
});
```

**Debug Steps**:
1. Test with a simple fetch request:
```tsx
// Add this to verify network interception works
useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())
    .then(data => console.log('Test request:', data));
}, []);
```

2. Check console for interception setup messages
3. Verify the network library you're using is supported

### 2. Large Response Bodies Causing Issues

**Problem**: Large API responses slow down or crash the network monitor.

**Solutions**:

```tsx
// ✅ Limit response body size
setupNetworkInterceptor({
  maxResponseBodySize: 1024 * 10,  // 10KB limit
  truncateResponses: true,         // Truncate large responses
  logResponseBody: false,          // Disable response body logging for large responses
});

// ✅ Filter out problematic endpoints
setupNetworkInterceptor({
  ignoreUrls: [
    /\/api\/large-data/,           // Ignore known large endpoints
    /\/uploads/,                   // Ignore file uploads
    /\.(png|jpg|jpeg|gif|pdf)$/,   // Ignore binary files
  ]
});
```

### 3. Authentication Headers Exposed

**Problem**: Sensitive authentication headers are visible in the network monitor.

**Solutions**:

```tsx
// ✅ Filter sensitive headers
setupNetworkInterceptor({
  sensitiveHeaders: [
    'authorization',
    'x-api-key',
    'x-auth-token',
    'cookie',
    'x-session-id',
  ],
  redactSensitiveData: true,  // Replace with [REDACTED]
});

// ✅ Custom header filtering
setupNetworkInterceptor({
  requestHeaderFilter: (headers) => {
    const filtered = { ...headers };
    
    // Remove or redact sensitive headers
    if (filtered.authorization) {
      filtered.authorization = '[REDACTED]';
    }
    
    return filtered;
  }
});
```

## React Query Integration Issues

### 1. Queries Not Appearing

**Problem**: React Query queries aren't showing in the dev tools.

**Solutions**:

```tsx
// ✅ Ensure QueryClient is the same instance
// Create once and reuse
const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && (
        <RnBetterDevToolsBubble 
          queryClient={queryClient}  // Same instance
        />
      )}
    </QueryClientProvider>
  );
}

// ✅ Check query configuration
const { data } = useQuery({
  queryKey: ['user', userId],  // Must have queryKey
  queryFn: fetchUser,          // Must have queryFn
  enabled: !!userId,           // Check if query is enabled
});

// ✅ Verify queries are actually running
const query = useQuery({
  queryKey: ['test'],
  queryFn: async () => {
    console.log('Query running'); // Add logging
    return fetchData();
  }
});
```

### 2. Query Cache Issues

**Problem**: Query cache operations (invalidate, refetch) not working.

**Solutions**:

```tsx
// ✅ Ensure proper query key matching
// Keys must match exactly for cache operations
const userQuery = useQuery({
  queryKey: ['user', 123],     // Exact key
  queryFn: fetchUser
});

// This will work
queryClient.invalidateQueries({ queryKey: ['user', 123] });

// This won't match
queryClient.invalidateQueries({ queryKey: ['user'] }); // Missing ID

// ✅ Use query key factories for consistency
const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
};
```

### 3. Mutations Not Tracking

**Problem**: React Query mutations aren't appearing in the mutation browser.

**Solutions**:

```tsx
// ✅ Ensure mutations have proper configuration
const mutation = useMutation({
  mutationKey: ['updateUser'],     // Add mutationKey for tracking
  mutationFn: updateUser,
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }
});

// ✅ Check mutation is actually being called
const handleSubmit = () => {
  console.log('Triggering mutation'); // Add logging
  mutation.mutate(userData);
};

// ✅ Verify mutation state changes
useEffect(() => {
  console.log('Mutation state:', {
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  });
}, [mutation.isLoading, mutation.isError, mutation.isSuccess]);
```

## Sentry Integration Problems

### 1. Sentry Events Not Showing

**Problem**: Sentry errors and events aren't appearing in the dev tools.

**Solutions**:

```tsx
// ✅ Ensure Sentry is properly initialized BEFORE dev tools
import * as Sentry from '@sentry/react-native';

// Initialize Sentry first
Sentry.init({
  dsn: 'YOUR_DSN',
  environment: 'development',
  debug: __DEV__,
});

// Then initialize your app with dev tools
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && (
        <RnBetterDevToolsBubble 
          queryClient={queryClient}
          environment="dev"
          hideSentryButton={false}  // Ensure not hidden
        />
      )}
    </QueryClientProvider>
  );
}

// ✅ Test Sentry integration with manual events
useEffect(() => {
  // Test error
  Sentry.captureException(new Error('Test error for dev tools'));
  
  // Test message
  Sentry.captureMessage('Test message for dev tools', 'info');
  
  // Test breadcrumb
  Sentry.addBreadcrumb({
    message: 'Test breadcrumb',
    level: 'info',
  });
}, []);
```

### 2. Performance Monitoring Not Working

**Problem**: Sentry performance data isn't being captured.

**Solutions**:

```tsx
// ✅ Enable performance monitoring in Sentry config
Sentry.init({
  dsn: 'YOUR_DSN',
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,  // Higher rate in dev
  enableAutoPerformanceTracking: true,
  enableOutOfMemoryTracking: true,
  enableNativeCrashHandling: true,
});

// ✅ Add custom performance measurements
import * as Sentry from '@sentry/react-native';

function ExpensiveComponent() {
  useEffect(() => {
    const transaction = Sentry.startTransaction({
      name: 'ExpensiveComponent',
      op: 'navigation'
    });
    
    performExpensiveOperation().then(() => {
      transaction.finish();
    });
    
    return () => transaction.finish();
  }, []);
  
  return <YourComponent />;
}
```

## TypeScript Configuration Issues

### 1. Type Errors with Dev Tools

**Problem**: TypeScript compilation errors when using dev tools.

**Solutions**:

```tsx
// ✅ Install type definitions
npm install --save-dev @types/react @types/react-native

// ✅ Check tsconfig.json includes necessary types
{
  "compilerOptions": {
    "types": ["react", "react-native"],
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true  // Skip type checking for node_modules
  }
}

// ✅ Use proper type imports
import type { UserRole, Environment } from 'rn-better-dev-tools';

// ✅ Type your configurations properly
const requiredEnvVars: RequiredEnvVar[] = [
  "EXPO_PUBLIC_API_URL",
  {
    key: "EXPO_PUBLIC_DEBUG_MODE",
    expectedType: "boolean" as const,  // Use const assertion
  }
];
```

### 2. Module Resolution Issues

**Problem**: TypeScript can't find dev tools modules or types.

**Solutions**:

```tsx
// ✅ Check package is installed correctly
npm list rn-better-dev-tools

// ✅ Try explicit imports
import { RnBetterDevToolsBubble } from 'rn-better-dev-tools/src/index';

// ✅ Add to tsconfig.json paths (if needed)
{
  "compilerOptions": {
    "paths": {
      "rn-better-dev-tools/*": ["./node_modules/rn-better-dev-tools/src/*"]
    }
  }
}

// ✅ Clear TypeScript cache
npx tsc --build --clean
rm -rf node_modules/.cache
```

## Build and Deployment Issues

### 1. Dev Tools in Production Build

**Problem**: Dev tools accidentally included in production builds.

**Solutions**:

```tsx
// ✅ Always wrap with __DEV__ check
{__DEV__ && (
  <RnBetterDevToolsBubble {...props} />
)}

// ✅ Use environment variables for additional safety
const isDevelopment = __DEV__ && process.env.NODE_ENV !== 'production';

{isDevelopment && (
  <RnBetterDevToolsBubble {...props} />
)}

// ✅ For Expo projects, check app.json configuration
{
  "expo": {
    "extra": {
      "enableDevTools": true  // Set to false for production
    }
  }
}

// Then in your app:
import Constants from 'expo-constants';
const enableDevTools = __DEV__ && Constants.expoConfig?.extra?.enableDevTools;
```

### 2. Bundle Size Issues

**Problem**: Dev tools increase bundle size even when not used.

**Solutions**:

```tsx
// ✅ Use dynamic imports for dev tools
const DevTools = React.lazy(() => 
  __DEV__ 
    ? import('rn-better-dev-tools').then(module => ({ 
        default: module.RnBetterDevToolsBubble 
      }))
    : Promise.resolve({ default: () => null })
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {__DEV__ && (
        <React.Suspense fallback={null}>
          <DevTools queryClient={queryClient} environment="dev" />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}

// ✅ Configure Metro bundler to exclude dev tools in production
// metro.config.js
module.exports = {
  resolver: {
    blacklistRE: __DEV__ 
      ? undefined 
      : /rn-better-dev-tools/,  // Exclude in production
  },
};
```

### 3. Native Module Conflicts

**Problem**: Conflicts with native modules used by dev tools.

**Solutions**:

```tsx
// ✅ Check for version conflicts
npm ls react-native-mmkv
npm ls @react-native-async-storage/async-storage
npm ls react-native-keychain

// ✅ Use peer dependencies resolution
// package.json
{
  "resolutions": {
    "react-native-mmkv": "^2.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0"
  }
}

// ✅ Optional dependency handling
try {
  const { MMKV } = require('react-native-mmkv');
  // Use MMKV if available
} catch (error) {
  // Fallback to AsyncStorage
  console.warn('MMKV not available, using AsyncStorage');
}
```

## Debugging Development Tools

### 1. Enable Debug Logging

```tsx
// Add to your App.tsx for debug information
if (__DEV__) {
  // Enable dev tools debug logging
  console.log('Dev Tools Debug Mode Enabled');
  
  // Log environment variables
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
  });
  
  // Log React Query client state
  console.log('Query Client:', queryClient);
}
```

### 2. Component Debug Mode

```tsx
// Add debug props to dev tools
<RnBetterDevToolsBubble
  queryClient={queryClient}
  environment="dev"
  debug={true}                    // Enable internal debugging
  onError={(error) => {           // Error handler
    console.error('DevTools Error:', error);
  }}
  onStateChange={(state) => {     // State change handler
    console.log('DevTools State:', state);
  }}
/>
```

### 3. Network Debug

```tsx
// Debug network interception
setupNetworkInterceptor({
  debug: true,                    // Enable debug logging
  onRequest: (request) => {
    console.log('Network Request:', request);
  },
  onResponse: (response) => {
    console.log('Network Response:', response);
  },
  onError: (error) => {
    console.error('Network Error:', error);
  }
});
```

## Getting Help

### 1. Collect Debug Information

```tsx
// Create a debug info function
function getDebugInfo() {
  return {
    // React Native info
    rnVersion: require('react-native/package.json').version,
    
    // Platform info
    platform: Platform.OS,
    version: Platform.Version,
    
    // Environment
    isDev: __DEV__,
    nodeEnv: process.env.NODE_ENV,
    
    // Query Client
    queryClientState: queryClient.getQueryCache().getAll().length,
    
    // Device info
    screenDimensions: Dimensions.get('window'),
    
    // Storage availability
    storageAvailable: {
      asyncStorage: !!AsyncStorage,
      mmkv: (() => {
        try {
          require('react-native-mmkv');
          return true;
        } catch {
          return false;
        }
      })(),
      keychain: (() => {
        try {
          require('react-native-keychain');
          return true;
        } catch {
          return false;
        }
      })(),
    }
  };
}

// Log debug info when issues occur
console.log('Debug Info:', getDebugInfo());
```

### 2. Common Error Messages

| Error | Likely Cause | Solution |
|-------|-------------|----------|
| "QueryClient not found" | Dev tools outside QueryClientProvider | Move dev tools inside provider |
| "Cannot read property of undefined" | Missing required prop | Check all required props are provided |
| "Network interception failed" | Network interceptor not set up | Call setupNetworkInterceptor() early |
| "Storage permission denied" | Missing keychain permissions | Add keychain permissions to iOS |
| "Module not found: rn-better-dev-tools" | Package not installed | Run npm install rn-better-dev-tools |

### 3. Performance Profiling

```tsx
// Use React DevTools Profiler
import { Profiler } from 'react';

function DevToolsProfiler({ children }) {
  const onRenderCallback = (id, phase, actualDuration) => {
    console.log('DevTools Render:', { id, phase, actualDuration });
  };

  return (
    <Profiler id="DevTools" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}

// Wrap dev tools in profiler
{__DEV__ && (
  <DevToolsProfiler>
    <RnBetterDevToolsBubble {...props} />
  </DevToolsProfiler>
)}
```

---

For additional support, please check:
- GitHub Issues for known problems and solutions
- Example projects for working implementations  
- Community discussions for troubleshooting tips
- Documentation updates for the latest fixes