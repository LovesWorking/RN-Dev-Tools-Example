---
id: storage-events
title: Storage Events Listener
---

Real-time monitoring of storage operations as they happen, providing instant visibility into AsyncStorage mutations, deletions, and modifications.

> **Coming Soon**: Storage Events is currently available as a component but not yet integrated into the floating bubble menu. It will be accessible in the next release.

## Overview

Storage Events Listener captures and displays all AsyncStorage operations in real-time, helping you debug storage-related issues, track data flow, and understand storage patterns in your application.

## How It Works

The Storage Events system intercepts AsyncStorage operations at runtime:

[//]: # 'StorageEventsSystem'
```tsx
// All these operations are automatically tracked:
await AsyncStorage.setItem('key', 'value')
await AsyncStorage.removeItem('key')
await AsyncStorage.multiSet([['key1', 'val1'], ['key2', 'val2']])
await AsyncStorage.clear()

// Each operation appears instantly in the events list
```
[//]: # 'StorageEventsSystem'

## Event Types

### setItem

Single key-value write operations:

[//]: # 'SetItemEvent'
```tsx
AsyncStorage.setItem('user_token', 'abc123')

// Event shows:
// Action: setItem
// Key: user_token
// Timestamp: 10:30:45
```
[//]: # 'SetItemEvent'

### removeItem

Key deletion operations:

[//]: # 'RemoveItemEvent'
```tsx
AsyncStorage.removeItem('temp_data')

// Event shows:
// Action: removeItem (red)
// Key: temp_data
// Timestamp: 10:30:46
```
[//]: # 'RemoveItemEvent'

### multiSet

Batch write operations:

[//]: # 'MultiSetEvent'
```tsx
AsyncStorage.multiSet([
  ['setting1', 'value1'],
  ['setting2', 'value2']
])

// Event shows:
// Action: multiSet
// Data: 2 pairs
// Timestamp: 10:30:47
```
[//]: # 'MultiSetEvent'

### multiRemove

Batch deletion operations:

[//]: # 'MultiRemoveEvent'
```tsx
AsyncStorage.multiRemove(['key1', 'key2', 'key3'])

// Event shows:
// Action: multiRemove (red)
// Data: 3 keys
// Timestamp: 10:30:48
```
[//]: # 'MultiRemoveEvent'

### mergeItem

Merge operations for existing data:

[//]: # 'MergeItemEvent'
```tsx
AsyncStorage.mergeItem('user_settings', JSON.stringify({
  theme: 'dark'
}))

// Event shows:
// Action: mergeItem (blue)
// Key: user_settings
// Timestamp: 10:30:49
```
[//]: # 'MergeItemEvent'

### clear

Complete storage wipe:

[//]: # 'ClearEvent'
```tsx
AsyncStorage.clear()

// Event shows:
// Action: clear (red)
// Data: All storage
// Timestamp: 10:30:50
```
[//]: # 'ClearEvent'

## Event Interface Features

### Live Event Stream

- **Real-time updates** - Events appear instantly
- **Event history** - Last 100 events retained
- **Auto-scroll** - New events appear at top
- **Time stamps** - Precise timing for each operation

### Visual Indicators

Event colors indicate operation type:
- **Green** - Write operations (setItem, multiSet)
- **Red** - Delete operations (removeItem, clear)
- **Blue** - Merge operations (mergeItem)
- **Gray** - Read operations (when implemented)

### Recording Controls

Control event capture:

- **Play/Pause** - Start or stop event recording
- **Clear** - Remove all captured events
- **Filter** - Show specific event types (coming soon)

## Use Cases

### Debugging Storage Issues

Track down storage-related bugs:

[//]: # 'DebuggingStorage'
```tsx
// Monitor when and how data is stored
// See if data is being overwritten
// Check for unexpected deletions
// Verify batch operations
```
[//]: # 'DebuggingStorage'

### Performance Monitoring

Identify storage bottlenecks:

[//]: # 'PerformanceMonitoring'
```tsx
// Count storage operations per second
// Identify excessive storage calls
// Find unnecessary clear operations
// Optimize batch operations
```
[//]: # 'PerformanceMonitoring'

### Data Flow Analysis

Understand storage patterns:

[//]: # 'DataFlowAnalysis'
```tsx
// Track user session storage
// Monitor cache updates
// Verify data persistence
// Analyze storage sequences
```
[//]: # 'DataFlowAnalysis'

## Current Implementation

The Storage Events component currently exists as:

[//]: # 'CurrentImplementation'
```tsx
import { StorageEventListener } from './components/StorageEventListener'

// Standalone component (not in bubble yet)
<StorageEventListener />
```
[//]: # 'CurrentImplementation'

Features available:
- AsyncStorage operation tracking
- Event history (last 100 events)
- Play/pause recording
- Clear events
- Color-coded operations
- Timestamp display

## Planned Features

### Bubble Integration

Coming in next release:
- Access via **STORAGE EVENTS** menu option
- Modal view with full event details
- Integration with storage browser

### Enhanced Filtering

Future filtering options:
- Filter by operation type
- Search by key name
- Time range selection
- Regular expression matching

### Event Details

Expanded event information:
- Full value display
- Before/after comparison for merges
- Stack trace to calling code
- Performance metrics

### Export Capabilities

Data export features:
- Export to JSON
- Copy event log
- Share via email
- Save to file

## Integration with Storage Browser

Storage Events will complement the Storage Browser:

[//]: # 'StorageIntegration'
```tsx
// Storage Browser: Current state of all keys
// Storage Events: How we got to that state

// Click event → Jump to key in browser
// See storage changes in real-time
// Correlate events with app actions
```
[//]: # 'StorageIntegration'

## Performance Impact

Storage Events Listener has minimal overhead:

- **Lightweight hooks** - Minimal interception cost
- **Capped history** - Only last 100 events stored
- **Lazy rendering** - Virtualized event list
- **Dev-only** - Completely removed in production

## Technical Details

### How Events Are Captured

The system wraps AsyncStorage methods:

[//]: # 'EventCapture'
```tsx
// Internally, the listener wraps AsyncStorage:
const originalSetItem = AsyncStorage.setItem
AsyncStorage.setItem = async (key, value) => {
  // Capture event
  captureEvent({ action: 'setItem', key, value })
  // Call original
  return originalSetItem(key, value)
}
```
[//]: # 'EventCapture'

### Event Data Structure

Each event contains:

[//]: # 'EventStructure'
```tsx
interface AsyncStorageEvent {
  action: 'setItem' | 'removeItem' | 'clear' | ...
  timestamp: Date
  data?: {
    key?: string
    value?: any
    keys?: string[]
    pairs?: Array<[string, string]>
  }
}
```
[//]: # 'EventStructure'

## Best Practices

### Development Workflow

1. **Start recording** before testing features
2. **Perform actions** in your app
3. **Review events** to understand storage flow
4. **Identify issues** like duplicate writes
5. **Optimize** based on patterns observed

### What to Look For

Common issues to identify:
- Excessive storage operations
- Missing data persistence
- Unexpected clear operations
- Race conditions in storage
- Inefficient batch operations

## Limitations

### Current Limitations

- Only tracks AsyncStorage (not MMKV or SecureStorage yet)
- Maximum 100 events in history
- No persistence of events between sessions
- Not integrated into bubble menu yet

### Platform Limitations

- Web: Limited to localStorage operations
- Expo Go: Some operations may not be captured
- Production: Completely disabled for performance

## Roadmap

### Phase 1 (Current)
✅ Basic event capture
✅ Event display component
✅ Play/pause/clear controls

### Phase 2 (Next Release)
⏳ Bubble menu integration
⏳ Modal view
⏳ Event filtering

### Phase 3 (Future)
⏳ MMKV event tracking
⏳ SecureStorage events
⏳ Export capabilities
⏳ Performance metrics

## Temporary Usage

Until bubble integration is complete:

[//]: # 'TemporaryUsage'
```tsx
// Add to your debug screen
import { StorageEventListener } from 'rn-better-dev-tools/storage-events'

function DebugScreen() {
  return (
    <View>
      <StorageEventListener />
    </View>
  )
}
```
[//]: # 'TemporaryUsage'

## Next Steps

- [Storage Monitoring](./storage-monitoring.md) - Current storage state
- [Network Monitoring](./network-monitoring.md) - API request tracking
- [React Query Tools](./react-query-tools.md) - Cache debugging