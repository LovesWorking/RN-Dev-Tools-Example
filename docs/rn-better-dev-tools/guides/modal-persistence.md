---
id: modal-persistence
title: Modal Persistence
---

All dev tool modals automatically remember their state, position, and size between sessions, maintaining your debugging setup across app restarts.

## Overview

Modal persistence ensures you never lose your debugging context. When you restart your app during development, all modals restore to their previous state, allowing you to continue exactly where you left off.

## What Gets Persisted

### Open/Closed State

Each modal remembers if it was open:

[//]: # 'OpenClosedState'
```tsx
// If React Query modal was open when app closed
// It reopens automatically on next launch

// Persisted states:
// - React Query Browser: Open/Closed
// - Environment Variables: Open/Closed
// - Storage Browser: Open/Closed
// - Network Monitor: Open/Closed
```
[//]: # 'OpenClosedState'

### Modal Position

Draggable modal positions are saved:

[//]: # 'ModalPosition'
```tsx
// Each modal saves:
{
  x: 100,  // Horizontal position
  y: 200,  // Vertical position
  
  // Position restored on reopen
}
```
[//]: # 'ModalPosition'

### Modal Size

Resizable modal dimensions persist:

[//]: # 'ModalSize'
```tsx
// Saved dimensions:
{
  width: 400,   // Modal width
  height: 600,  // Modal height
  
  // Size restored on reopen
}
```
[//]: # 'ModalSize'

### Active Selections

Current selections within modals:

[//]: # 'ActiveSelections'
```tsx
// React Query modal remembers:
// - Selected query key
// - Active filter (all/success/error)
// - Active tab (queries/mutations)
// - Search terms

// Storage modal remembers:
// - Selected storage type
// - Active filters
// - Sort preferences
```
[//]: # 'ActiveSelections'

## How It Works

### Storage Mechanism

Persistence uses AsyncStorage:

[//]: # 'StorageMechanism'
```tsx
// Automatically saved to:
AsyncStorage.setItem('@devtools:modal:state', {
  reactQuery: {
    isOpen: true,
    position: { x: 100, y: 200 },
    size: { width: 400, height: 600 },
    selectedKey: ['todos'],
    activeFilter: 'all'
  },
  storage: {
    isOpen: false,
    // ...
  }
})
```
[//]: # 'StorageMechanism'

### Save Triggers

State saves automatically on:

- **Modal open/close** - State change saved
- **Position change** - After drag ends
- **Size change** - After resize completes
- **Selection change** - Query/filter selection
- **App background** - Before suspension

### Restore Process

On app launch:

1. **Read saved state** - Load from storage
2. **Validate state** - Ensure data validity
3. **Apply state** - Restore modal positions
4. **Open modals** - Reopen previously open modals
5. **Restore selections** - Set active items

## Configuration

### Enable/Disable Persistence

Control persistence globally:

[//]: # 'EnableDisablePersistence'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  enableModalPersistence={true} // Default: true
/>
```
[//]: # 'EnableDisablePersistence'

### Shared Dimensions

Share size across all modals:

[//]: # 'SharedDimensions'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  enableSharedModalDimensions={true} // All modals use same size
/>
```
[//]: # 'SharedDimensions'

When enabled:
- Resizing one modal resizes all
- Provides consistent interface
- Reduces adjustment time

### Reset Persistence

Clear all saved states:

[//]: # 'ResetPersistence'
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'

// Clear all dev tools persistence
await AsyncStorage.multiRemove([
  '@devtools:modal:state',
  '@devtools:bubble:position',
  '@devtools:user:preferences'
])
```
[//]: # 'ResetPersistence'

## Modal-Specific Persistence

### React Query Modal

Persisted data:
- **Query selection** - Last viewed query
- **Filter state** - Active status filter
- **Tab selection** - Queries vs Mutations
- **Search terms** - Query search text
- **Expanded nodes** - Data tree state

### Storage Modal

Persisted data:
- **Storage type** - MMKV/Async/Secure
- **Search filters** - Key/value search
- **Sort order** - Alphabetical/recent
- **Expanded entries** - Detailed views

### Environment Variables Modal

Persisted data:
- **Filter state** - Required/optional/all
- **Search terms** - Variable search
- **Collapsed groups** - Variable categories

### Network Modal

Persisted data:
- **Recording state** - Active/paused
- **Filters** - Status/method filters
- **Time range** - Selected period
- **Expanded requests** - Detail views

## User Experience

### Seamless Continuation

Continue debugging without interruption:

[//]: # 'SeamlessContinuation'
```tsx
// Workflow:
// 1. Open React Query modal
// 2. Select a query to debug
// 3. App crashes or you restart
// 4. Modal reopens with same query selected
// 5. Continue debugging immediately
```
[//]: # 'SeamlessContinuation'

### Quick Access Patterns

Common development patterns:

[//]: # 'QuickAccessPatterns'
```tsx
// Keep frequently used modals open:
// - React Query always visible for API work
// - Storage browser for auth debugging
// - Environment vars for config checks

// They'll be ready every time you launch
```
[//]: # 'QuickAccessPatterns'

### Layout Preservation

Maintain your debugging layout:

[//]: # 'LayoutPreservation'
```tsx
// Arrange modals once:
// - React Query top-left
// - Storage bottom-right
// - Environment vars centered

// Layout restored on every launch
```
[//]: # 'LayoutPreservation'

## Performance Considerations

### Storage Impact

Minimal storage footprint:
- ~2KB per modal state
- ~10KB total maximum
- Automatic cleanup of old data

### Load Time

Fast restoration:
- Async loading doesn't block app
- < 50ms to restore all states
- Progressive modal opening

### Memory Usage

Efficient memory management:
- States loaded on demand
- Unused modal states cleared
- No memory leaks

## Platform Behavior

### iOS

- Persistence across app updates
- Survives force quit
- Cleared on app delete

### Android

- Survives process death
- Maintains across updates
- Respects storage permissions

### Web

- Uses localStorage
- Persists across sessions
- Domain-specific storage

## Troubleshooting

### Modals Not Restoring

If modals don't restore:

1. **Check persistence enabled** - Not disabled in config
2. **Verify storage access** - AsyncStorage working
3. **Clear corrupted state** - Reset persistence
4. **Check modal IDs** - Modals properly identified

### Position Outside Screen

If modal appears off-screen:

1. **Rotation change** - Landscape to portrait
2. **Screen size change** - Different device
3. **Bounds validation** - Auto-corrects position

### State Conflicts

If state seems wrong:

1. **Version mismatch** - Update changed structure
2. **Corrupted data** - Clear and restart
3. **Multiple instances** - Ensure single bubble

## Best Practices

### Development Workflow

Optimize your setup:

[//]: # 'DevelopmentWorkflow'
```tsx
// 1. Arrange modals for your task
// 2. Keep relevant tools open
// 3. They'll persist through:
//    - Hot reloads
//    - App restarts
//    - Crashes
//    - Updates
```
[//]: # 'DevelopmentWorkflow'

### Team Coordination

Share layouts with team:

[//]: # 'TeamCoordination'
```tsx
// Export your layout:
const layout = await AsyncStorage.getItem('@devtools:modal:state')

// Share with team
// They can import for same setup
```
[//]: # 'TeamCoordination'

### Clean State Practices

Maintain clean persistence:

[//]: # 'CleanStatePractices'
```tsx
// Periodically reset if cluttered
// Clear before major updates
// Reset when switching projects
// Clean on environment changes
```
[//]: # 'CleanStatePractices'

## Advanced Features

### Custom Persistence

Extend persistence for custom data:

[//]: # 'CustomPersistence'
```tsx
// Save custom debug state
AsyncStorage.setItem('@devtools:custom:state', {
  breakpoints: [...],
  watchedValues: [...],
  customFilters: [...]
})
```
[//]: # 'CustomPersistence'

### State Export/Import

Backup and restore setups:

[//]: # 'StateExportImport'
```tsx
// Export all dev tools state
const exportState = async () => {
  const state = await AsyncStorage.getItem('@devtools:modal:state')
  // Save to file or share
}

// Import saved state
const importState = async (savedState) => {
  await AsyncStorage.setItem('@devtools:modal:state', savedState)
  // Restart app to apply
}
```
[//]: # 'StateExportImport'

### Conditional Persistence

Persist based on conditions:

[//]: # 'ConditionalPersistence'
```tsx
// Only persist in development
if (__DEV__) {
  enablePersistence()
}

// Persist for specific users
if (user.isDeveloper) {
  enablePersistence()
}
```
[//]: # 'ConditionalPersistence'

## Future Enhancements

### Planned Features

- **Cloud sync** - Sync across devices
- **Profiles** - Multiple layout profiles  
- **Shortcuts** - Quick layout switches
- **Templates** - Predefined layouts
- **History** - Undo/redo support

### Integration Plans

- Desktop app sync
- Team workspace sharing
- Git-tracked configs
- CI/CD integration

## Related Features

### Bubble Position

The floating bubble also persists position:
- Separate from modal persistence
- Maintains dragged position
- Resets on reinstall

### User Preferences

Other persisted preferences:
- Selected menu theme (G/C/D)
- WiFi toggle state
- Filter preferences
- Sort orders

## Next Steps

- [Floating Bubble](./floating-bubble.md) - Main interface control
- [React Query Tools](./react-query-tools.md) - Query debugging
- [Configuration](../configuration.md) - Setup options