# ClaudeModal60FPSClean Architecture & Implementation Guide

## Overview
ClaudeModal60FPSClean is a high-performance React Native modal component optimized for 60FPS animations with support for bottom sheet and floating modes, gestures, persistence, and custom headers.

## Key Features
- **Dual Mode**: Bottom sheet and floating window modes
- **60FPS Performance**: Uses native driver animations and transforms
- **Gesture Support**: 
  - Drag to resize (bottom sheet mode)
  - Drag to move (floating mode)
  - Double tap header to toggle modes
  - Triple tap header to close
  - Swipe down hard to close (bottom sheet)
- **State Persistence**: Saves position, size, and mode to AsyncStorage
- **Custom Headers**: Support for custom header content with full gesture integration

## Component Structure

### Main Modal Component
- **Location**: `/src/claudeModal/ClaudeModal60FPSClean.tsx`
- **Props**:
  - `visible`: Controls modal visibility
  - `header`: Configuration object for header (title, subtitle, customContent)
  - `onClose`: Callback when modal closes
  - `onModeChange`: Callback when mode changes (bottomSheet/floating)
  - `persistenceKey`: AsyncStorage key for persistence
  - `enablePersistence`: Enable/disable state persistence
  - `initialMode`: Starting mode (bottomSheet or floating)
  - `styles`: Custom style overrides

### Header System
The header supports three configurations:
1. **Standard Header**: Title and subtitle with default controls
2. **Custom Content**: React component rendered within standard header structure
3. **Complete Replacement**: Full header replacement (e.g., CyberpunkModalHeader)

#### Custom Header Implementation
```tsx
header={{
  customContent: <YourCustomComponent />,
  showToggleButton: true,  // Shows mode toggle button
}}
```

### Modal Storage (Persistence)
- **Class**: `ModalStorage` 
- **Saves**: mode, dimensions (width, height, left, top), panelHeight
- **Debounced**: 500ms delay to prevent excessive writes
- **Key Format**: Uses `persistenceKey` prop or defaults to modal-specific key

## Common Integration Patterns

### React Query Modals
The React Query dev tools use a modal routing system:

1. **ReactQueryModal**: Main router component that displays appropriate modal
2. **QueryBrowserModal**: Shows list of queries when none selected
3. **DataEditorModal**: Shows query details when query is selected
4. **MutationBrowserModal**: Shows list of mutations
5. **MutationEditorModal**: Shows mutation details

Each modal uses ClaudeModal60FPSClean with custom headers via `ReactQueryModalHeader`.

### Dev Tools Console
- **DevToolsSectionListModal**: Main dev tools menu
- Uses standard header with title/subtitle
- Routes to different tool sections (env vars, storage, network, etc.)

## Important Implementation Details

### Gesture Handling
1. **Pan Responders**: 
   - `bottomSheetPanResponder`: Handles vertical drag for resizing
   - `floatingDragPanResponder`: Handles drag to move in floating mode
   - `resizeHandlers`: Corner handles for floating mode resize

2. **Touch Handling**:
   - Uses `TouchableWithoutFeedback` for tap detection
   - Pan handlers attached to appropriate View components
   - Headers must have pan handlers passed as props for drag functionality

### Performance Optimizations
1. **Native Driver**: All animations use `useNativeDriver: true`
2. **Transform-based**: Uses transforms instead of layout properties
3. **Memoization**: Components wrapped in `React.memo`
4. **Debounced Persistence**: Prevents excessive AsyncStorage writes

### Style Requirements
```javascript
// Critical header styles for interaction
header: {
  minHeight: 48,  // Ensures touchable area
  paddingVertical: 4,  // Spacing for drag indicator
  backgroundColor: "#171717",  // Dark theme background
}

// Drag indicator must be visible
dragIndicatorContainer: {
  paddingVertical: 8,  // Touch target size
}
```

## Common Issues & Solutions

### Issue: Custom header not showing
**Solution**: Ensure header.customContent is a rendered component, not a function:
```tsx
// ❌ Wrong
header={{ customContent: renderHeader }}

// ✅ Correct  
header={{ customContent: renderHeader() }}
```

### Issue: Can't drag modal in floating mode
**Solution**: Check that pan handlers are properly attached to header:
- Pan handlers must be passed through to the header component
- TouchableWithoutFeedback should wrap inner content, not outer View
- Ensure no conflicting gesture handlers block the pan responder

### Issue: Modal state not persisting
**Solution**: 
1. Ensure `enablePersistence={true}`
2. Provide unique `persistenceKey` prop
3. Check AsyncStorage permissions
4. Clear old storage if structure changed

### Issue: Double/triple tap not working
**Solution**:
- Header must have sufficient height (minHeight: 48)
- TouchableWithoutFeedback must be properly configured
- No overlapping touch handlers blocking taps

## Testing Checklist
- [ ] Modal opens in correct mode (bottomSheet/floating)
- [ ] Double tap toggles between modes
- [ ] Triple tap closes modal
- [ ] Drag header moves modal (floating mode)
- [ ] Drag bottom resizes modal (bottom sheet mode)
- [ ] Corner handles resize modal (floating mode)
- [ ] Custom header content displays correctly
- [ ] State persists across app reloads
- [ ] Swipe down hard closes modal (bottom sheet)
- [ ] Modal respects safe area insets

## Performance Metrics
- Target: 60 FPS during all animations
- Resize/drag should feel smooth with no stuttering
- Mode transitions should be instant
- No unnecessary re-renders during interactions

## Dependencies
- `react-native-reanimated`: For gesture handling
- `react-native-gesture-handler`: For advanced gestures
- `@react-native-async-storage/async-storage`: For persistence
- `react-native-safe-area-context`: For safe area insets

## Future Enhancements
- [ ] Keyboard avoidance in floating mode
- [ ] Multi-window support (multiple floating modals)
- [ ] Snap points for floating mode positioning
- [ ] Gesture-based mode switching (pinch to toggle)
- [ ] Custom animation curves per modal instance