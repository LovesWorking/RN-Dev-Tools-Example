---
id: storage-monitoring
title: Storage Monitoring
---

Real-time monitoring and management of all storage mechanisms in your React Native application, including MMKV, AsyncStorage, and SecureStorage.

## Overview

Storage Monitoring provides complete visibility into your app's local storage, allowing you to inspect, modify, and delete stored data across different storage backends with live updates.

## Accessing Storage Tools

1. Tap any menu button (G, C, or D) on the floating bubble
2. Select **STORAGE** from the menu
3. Browse all storage entries across different backends

## Storage Types

### MMKV Storage

High-performance key-value storage:

[//]: # 'MMKVStorage'
```tsx
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

// Store data
storage.set('user.name', 'John Doe')
storage.set('app.theme', 'dark')
storage.set('cache.timestamp', Date.now())

// All visible in dev tools instantly
```
[//]: # 'MMKVStorage'

Features:
- **Synchronous API** - No async/await needed
- **Type-safe** - Automatic serialization
- **Performance** - 30x faster than AsyncStorage
- **Encryption** - Optional encryption support

> Note: In Expo Go, MMKV is mocked with AsyncStorage for compatibility

### AsyncStorage

Standard React Native storage:

[//]: # 'AsyncStorage'
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'

// Store data
await AsyncStorage.setItem('user_preferences', JSON.stringify({
  theme: 'dark',
  notifications: true
}))

// Appears in storage browser
```
[//]: # 'AsyncStorage'

Features:
- **Async API** - Promise-based
- **JSON serialization** - Store complex objects
- **Cross-platform** - Works everywhere
- **Size limits** - ~6MB on Android, unlimited on iOS

### SecureStorage

Encrypted storage for sensitive data:

[//]: # 'SecureStorage'
```tsx
import * as SecureStore from 'expo-secure-store'

// Store sensitive data
await SecureStore.setItemAsync('auth_token', 'secret-token-123')
await SecureStore.setItemAsync('user_pin', '1234')

// Shows in dev tools with security indicator
```
[//]: # 'SecureStorage'

Features:
- **Encryption** - Hardware-backed encryption
- **Biometric protection** - Optional biometric auth
- **Keychain/Keystore** - Uses platform secure storage
- **Size limits** - ~2KB per entry

## Storage Browser Interface

### Storage Statistics

View aggregated storage information:

- **Total entries** - Count across all storage types
- **MMKV entries** - Number of MMKV keys
- **AsyncStorage entries** - AsyncStorage item count
- **SecureStorage entries** - Secure items count
- **Total size** - Approximate storage usage

### Entry List

Each storage entry displays:

- **Key name** - Full storage key
- **Storage type** - MMKV, Async, or Secure badge
- **Value preview** - First 50 characters
- **Data type** - String, object, array, number, boolean
- **Size** - Approximate size in bytes

### Filtering and Search

Filter storage entries by:

- **Storage type** - MMKV, AsyncStorage, SecureStorage
- **Key search** - Find entries by key name
- **Value search** - Search within values
- **Data type** - Filter by type (string, object, etc.)

## CRUD Operations

### Viewing Data

Tap any storage entry to view:

1. **Full value** - Complete data display
2. **Formatted JSON** - Pretty-printed objects
3. **Type information** - Detailed type analysis
4. **Metadata** - Size, last modified (if available)

### Editing Data

Modify storage values in real-time:

[//]: # 'EditingData'
```tsx
// 1. Tap a storage entry
// 2. Select "Edit"
// 3. Modify the value
// 4. Save changes

// Changes immediately reflect in your app
```
[//]: # 'EditingData'

Editing features:
- **JSON editor** - Syntax highlighting for JSON
- **Validation** - Ensures valid JSON before saving
- **Type preservation** - Maintains original data type
- **Undo support** - Revert changes before saving

### Creating Entries

Add new storage entries:

1. Tap the **+** button
2. Select storage type (MMKV, Async, Secure)
3. Enter key name
4. Enter value (JSON supported)
5. Save to storage

[//]: # 'CreatingEntries'
```tsx
// Example: Create test data
Key: "test_user"
Type: AsyncStorage
Value: {
  "id": 123,
  "name": "Test User",
  "role": "admin"
}
```
[//]: # 'CreatingEntries'

### Deleting Entries

Remove storage entries:

1. Swipe left on an entry (or tap and hold)
2. Confirm deletion
3. Entry is immediately removed

Bulk operations:
- **Clear storage type** - Remove all entries from one backend
- **Clear all** - Wipe all storage (with confirmation)

## Required Storage Keys

### Configuration

Monitor critical storage keys:

[//]: # 'RequiredKeys'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  requiredStorageKeys={[
    { 
      key: 'auth_token', 
      type: 'secure',
      description: 'User authentication token'
    },
    { 
      key: 'user_preferences', 
      type: 'async',
      description: 'App settings and preferences'
    },
    {
      key: 'cache_version',
      type: 'mmkv',
      description: 'Cache versioning',
      optional: true
    }
  ]}
/>
```
[//]: # 'RequiredKeys'

### Validation Indicators

Required keys show validation status:

- **✓ Present** - Required key exists
- **⚠️ Missing** - Required key not found
- **Yellow badge** - Optional key not set
- **Red highlight** - Critical missing key

## Storage Events (Coming Soon)

Real-time storage event monitoring:

[//]: # 'StorageEvents'
```tsx
// Feature in development
// Will show live storage operations:
// - setItem events
// - removeItem events
// - clear events
// - With timestamps and values
```
[//]: # 'StorageEvents'

> Note: Storage events listener exists but not yet integrated into the bubble menu

## Integration with React Query

Storage entries used by React Query are accessible:

[//]: # 'ReactQueryIntegration'
```tsx
// React Query persisted cache appears as:
// Key: "react-query-cache"
// Type: AsyncStorage or MMKV

// View and modify cached queries directly
```
[//]: # 'ReactQueryIntegration'

## Performance Considerations

### Large Data Sets

For apps with many storage entries:

- **Virtualized scrolling** - Smooth performance with thousands of entries
- **Lazy loading** - Values loaded on demand
- **Search optimization** - Indexed searching for speed

### Storage Limits

Be aware of platform limits:

| Storage Type | iOS Limit | Android Limit |
|-------------|-----------|---------------|
| MMKV | Unlimited* | Unlimited* |
| AsyncStorage | Unlimited | ~6MB |
| SecureStorage | ~2KB/entry | ~2KB/entry |

*Limited by device storage

## Common Use Cases

### User Authentication

Monitor auth tokens and session data:

[//]: # 'AuthMonitoring'
```tsx
// Check stored auth tokens
// Key: "auth_token" (SecureStorage)
// Key: "refresh_token" (SecureStorage)
// Key: "user_session" (AsyncStorage)
```
[//]: # 'AuthMonitoring'

### App Settings

View and modify user preferences:

[//]: # 'AppSettings'
```tsx
// Common settings keys
// Key: "app_theme" - dark/light mode
// Key: "notification_settings" - push preferences
// Key: "language_preference" - app language
```
[//]: # 'AppSettings'

### Cache Management

Inspect and clear cached data:

[//]: # 'CacheManagement'
```tsx
// Cache-related keys
// Key: "api_cache_*" - API response cache
// Key: "image_cache_*" - Downloaded images
// Key: "cache_timestamp" - Cache validity
```
[//]: # 'CacheManagement'

## Best Practices

### Key Naming

Use consistent, hierarchical key names:

[//]: # 'KeyNaming'
```tsx
// Good naming patterns
"user.profile.name"
"user.settings.theme"
"cache.api.users"
"temp.form.draft"

// Avoid
"data1"
"key123"
"x"
```
[//]: # 'KeyNaming'

### Data Organization

Structure data logically:

[//]: # 'DataOrganization'
```tsx
// Store related data together
{
  "user.profile": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  }
}

// Rather than separate keys
"user.id": 123
"user.name": "John"
"user.email": "john@example.com"
```
[//]: # 'DataOrganization'

### Security

Store sensitive data appropriately:

[//]: # 'SecurityBestPractices'
```tsx
// Use SecureStorage for:
- Authentication tokens
- API keys
- User credentials
- Payment information

// Use AsyncStorage/MMKV for:
- User preferences
- App settings
- Cached data
- Non-sensitive info
```
[//]: # 'SecurityBestPractices'

## Troubleshooting

### Data Not Appearing

If storage entries don't show:

1. **Refresh** - Pull down to refresh
2. **Check filters** - Ensure no filters active
3. **Verify storage** - Confirm data is actually stored
4. **Restart app** - Some changes need restart

### Edit Not Saving

When edits don't persist:

1. **Validate JSON** - Ensure valid format
2. **Check permissions** - SecureStorage may need auth
3. **Storage limits** - Check if exceeding limits
4. **Type matching** - Preserve original data type

## Platform Notes

### Expo Go Limitations

In Expo Go:
- MMKV is mocked with AsyncStorage
- Some SecureStorage features limited
- Use development builds for full features

### Web Support

On React Native Web:
- MMKV falls back to localStorage
- SecureStorage not available
- AsyncStorage uses browser storage

## Next Steps

- [Storage Events](./storage-events.md) - Live storage monitoring
- [React Query Tools](./react-query-tools.md) - Query cache management
- [Network Monitoring](./network-monitoring.md) - API debugging