# Dev Tools Persistence Test Guide

## Features with Persistence

The following dev tools features now persist their state across app refreshes:

### 1. Storage Modal
- **Tab Selection**: STORAGE vs EVENTS tab selection is remembered
- **Monitoring State**: Event monitoring (play/pause) state persists
- **Test Steps**:
  1. Open dev tools bubble → Select STORAGE
  2. Switch to EVENTS tab
  3. Click play button to start monitoring
  4. Refresh app (press 'r' in terminal)
  5. Open storage modal again
  6. ✅ EVENTS tab should be selected
  7. ✅ Monitoring should be active (pause button visible)

### 2. Network Modal
- **Modal State**: Network modal open/closed state persists
- **Test Steps**:
  1. Open dev tools bubble → Select NETWORK
  2. Network modal opens
  3. Refresh app (press 'r' in terminal)
  4. ✅ Network modal should automatically reopen

### 3. WiFi Toggle
- **Online/Offline State**: WiFi enabled/disabled state persists
- **Test Steps**:
  1. Look at the WiFi icon in dev tools footer (green = enabled, red = disabled)
  2. Click WiFi icon to toggle it off (turns red)
  3. Refresh app (press 'r' in terminal)
  4. ✅ WiFi icon should remain red (disabled)
  5. React Query will show queries as paused
  6. Click WiFi icon again to re-enable (turns green)

## Storage Keys Used

All persistence is stored in AsyncStorage with these keys:

- `@devtools_storage_active_tab` - Storage modal tab selection
- `@devtools_storage_is_monitoring` - Storage event monitoring state
- `@devtools_modal_state` - All modal visibility states
- `@devtools_settings_wifi_enabled` - WiFi toggle state

## Testing All Features Together

1. Open Storage modal, switch to EVENTS, start monitoring
2. Close modal, toggle WiFi off (red)
3. Open Network modal
4. Refresh app
5. All states should persist:
   - Storage modal: EVENTS tab, monitoring active
   - WiFi: Still disabled (red)
   - Network modal: Automatically reopens

## Clearing Persisted State

To reset all persisted state, you can:
1. Clear AsyncStorage: `AsyncStorage.clear()`
2. Or uninstall and reinstall the app