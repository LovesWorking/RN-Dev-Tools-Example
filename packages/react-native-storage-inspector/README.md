# @rn-dev-tools/react-native-storage-inspector

A comprehensive storage inspection and management tool for React Native applications. Supports AsyncStorage, MMKV, and SecureStore.

## Features

- 📦 **Multi-Storage Support**: Inspect AsyncStorage, MMKV, and SecureStore
- 🔍 **Storage Browser**: Browse and search through all storage keys
- 📊 **Storage Statistics**: View storage usage stats and patterns
- 🎯 **Required Keys Validation**: Define and validate required storage keys
- 📝 **Event Tracking**: Track storage operations in real-time
- 🔄 **Diff Viewer**: Compare storage values over time
- 🗑️ **Storage Management**: Clear individual keys or entire storage

## Installation

```bash
npm install @rn-dev-tools/react-native-storage-inspector
# or
yarn add @rn-dev-tools/react-native-storage-inspector
# or
pnpm add @rn-dev-tools/react-native-storage-inspector
```

## Usage

```tsx
import {
  StorageSection,
  StorageModalWithTabs,
  StorageKeyInfo,
  AsyncStorageListener,
} from "@rn-dev-tools/react-native-storage-inspector";

// Use the storage section in your dev tools
<StorageSection onPress={() => setModalVisible(true)} />

// Display the full storage modal
<StorageModalWithTabs
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
/>
```

## Components

### StorageSection
Main entry point component that displays storage statistics.

### StorageModalWithTabs
Full-featured modal with tabs for browsing, events, and management.

### StorageKeyCard
Individual storage key display component with actions.

### StorageBrowserMode
Browse and search through all storage keys.

### StorageEventsSection
Track and display storage operations in real-time.

## Utilities

### AsyncStorageListener
Listen to AsyncStorage changes and track operations.

### clearAllStorage
Clear all storage across AsyncStorage, MMKV, and SecureStore.

### objectDiff / lineDiff
Compare storage values and visualize changes.

## Types

The package exports comprehensive TypeScript types for all storage operations:

- `StorageKeyInfo`: Information about a storage key
- `StorageKeyStats`: Statistics about storage usage
- `StorageEvent`: Storage operation events
- `StorageType`: Storage backend type (mmkv, async, secure)

## License

MIT