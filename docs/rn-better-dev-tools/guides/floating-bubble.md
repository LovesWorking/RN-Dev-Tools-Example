---
id: floating-bubble
title: Floating Bubble
---

The floating bubble is your gateway to all dev tools, providing an always-accessible, draggable interface that stays on top of your app content.

## Overview

The floating bubble appears on the right side of your screen when dev tools are enabled, offering quick access to debugging features without disrupting your app's UI or requiring navigation changes.

## Bubble Components

### Environment Indicator

Shows current app environment:

- **DEV (Green)** - Development environment
- **STAGING (Yellow)** - Staging environment  
- **PROD (Red)** - Production environment

[//]: # 'EnvironmentIndicator'
```tsx
<RnBetterDevToolsBubble 
  environment="development" // Controls the badge color
/>
```
[//]: # 'EnvironmentIndicator'

### User Status

Displays current user role:

- **USER** - Standard user role
- **ADMIN** - Administrator role
- **DEV** - Developer role

[//]: # 'UserStatus'
```tsx
<RnBetterDevToolsBubble 
  userRole="admin" // Shows role badge
  hideUserStatus={false} // Toggle visibility
/>
```
[//]: # 'UserStatus'

### Menu Buttons

Three menu style options:

- **G Button** - Game UI (Dial2) - Futuristic gaming interface
- **C Button** - Claude theme - AI-inspired design
- **D Button** - Dial menu - Classic radial menu

Each opens the same tools with different visual styles.

## Positioning

### Draggable Interface

The bubble can be dragged anywhere on screen:

1. **Press and hold** the bubble
2. **Drag** to desired position
3. **Release** to set new position

### Position Persistence

The bubble remembers its position:

- Position saved to device storage
- Restored on app restart
- Maintains position across sessions
- Resets on app reinstall

### Default Position

Initial position:
- **44px** from right edge
- **708px** from bottom
- Adjusts for different screen sizes

## Menu Types

### Game UI (Dial2)

Futuristic cyberpunk-themed interface:

[//]: # 'GameUIMenu'
```tsx
// Activated by pressing 'G' button
// Features:
// - Neon color scheme
// - Animated transitions
// - Gaming-inspired design
// - Holographic effects
```
[//]: # 'GameUIMenu'

### Claude Theme

AI assistant-inspired design:

[//]: # 'ClaudeMenu'
```tsx
// Activated by pressing 'C' button
// Features:
// - Clean, minimal design
// - Smooth animations
// - Professional appearance
// - Gradient effects
```
[//]: # 'ClaudeMenu'

### Dial Menu

Classic radial menu design:

[//]: # 'DialMenu'
```tsx
// Activated by pressing 'D' button
// Features:
// - Circular layout
// - Radial animations
// - Icon-focused design
// - Smooth transitions
```
[//]: # 'DialMenu'

## Menu Sections

All menus provide access to:

### React Query

- Query browser
- Mutation tracker
- Cache management
- WiFi toggle

### Environment Variables

- Variable viewer
- Required validation
- Missing indicators

### Storage

- MMKV browser
- AsyncStorage viewer
- SecureStorage inspector
- CRUD operations

### Network (In Development)

- Request tracking
- Response inspection
- Error monitoring

### Sentry (Temporarily Disabled)

- Event viewer
- Error tracking
- Performance monitoring

## Visibility Control

### Hiding Sections

Control which tools appear:

[//]: # 'HidingSections'
```tsx
<RnBetterDevToolsBubble 
  queryClient={queryClient}
  environment="development"
  
  // Hide specific sections
  hideQueryButton={false}    // React Query tools
  hideEnvButton={false}       // Environment variables
  hideStorageButton={false}   // Storage browser
  hideSentryButton={true}     // Sentry events
  hideWifiToggle={false}      // Network toggle
/>
```
[//]: # 'HidingSections'

### Conditional Display

Show bubble only in development:

[//]: # 'ConditionalDisplay'
```tsx
{__DEV__ && (
  <RnBetterDevToolsBubble 
    queryClient={queryClient}
    environment="development"
  />
)}
```
[//]: # 'ConditionalDisplay'

### Environment-Based

Different configs per environment:

[//]: # 'EnvironmentBased'
```tsx
const isDev = process.env.NODE_ENV === 'development'
const isAdmin = user?.role === 'admin'

{(isDev || isAdmin) && (
  <RnBetterDevToolsBubble 
    queryClient={queryClient}
    environment={process.env.NODE_ENV}
    userRole={user?.role}
  />
)}
```
[//]: # 'EnvironmentBased'

## Interaction Patterns

### Opening Tools

1. **Tap menu button** (G, C, or D)
2. **Select tool** from menu
3. **Modal opens** with full interface

### Closing Tools

Multiple ways to close:
- **X button** in modal header
- **Swipe down** on modal
- **Tap outside** modal area
- **Back button** (Android)

### Quick Actions

Some actions available directly:
- **WiFi toggle** - No modal needed
- **Environment badge** - Shows current env
- **User status** - Tap for details

## Bubble States

### Active State

When tools are in use:
- Bubble remains visible
- Position locked
- Menus accessible

### Hidden State

Bubble hides when:
- Any modal is open
- Prevents visual overlap
- Returns when modal closes

### Loading State

During initialization:
- Bubble appears immediately
- Tools load asynchronously
- No delay in visibility

## Performance

### Optimizations

The bubble is optimized for:

- **Minimal overhead** - Lightweight component
- **Lazy loading** - Tools load on demand
- **Memory efficiency** - Unused tools unloaded
- **Smooth animations** - 60 FPS interactions

### Impact on App

- **No production impact** - Auto-disabled
- **Minimal dev impact** - < 1% CPU usage
- **Low memory** - ~5MB when idle
- **Async operations** - Non-blocking

## Customization

### Visual Theming

While not directly themeable, choose menu style:

[//]: # 'VisualTheming'
```tsx
// Users can switch between themes using buttons:
// G - Cyberpunk/Gaming theme
// C - Clean/Professional theme  
// D - Classic/Traditional theme
```
[//]: # 'VisualTheming'

### Size and Scale

Bubble adapts to screen size:
- Scales on tablets
- Adjusts for orientation
- Responsive to screen density

## Accessibility

### Touch Targets

All interactive elements:
- Minimum 44x44 points
- 8-point hit slop
- Clear visual feedback

### Visual Indicators

Status communication:
- Color coding for states
- Icons for sections
- Text labels for clarity

## Troubleshooting

### Bubble Not Appearing

If bubble doesn't show:

1. **Check DEV mode** - Only shows in development
2. **Verify setup** - Component properly imported
3. **Check permissions** - Overlay permissions (Android)
4. **Restart app** - Clear any cached state

### Position Issues

If position is wrong:

1. **Reset position** - Delete app and reinstall
2. **Check constraints** - Screen bounds detection
3. **Orientation** - Rotate device to reset

### Menu Not Opening

If menus don't work:

1. **Check touch events** - Other overlays blocking
2. **Verify state** - Modal may be open
3. **Memory pressure** - Close other apps

## Best Practices

### Development Workflow

1. **Keep visible** - Always have bubble accessible
2. **Learn shortcuts** - Use quick menu access
3. **Position wisely** - Don't cover important UI
4. **Use appropriate menu** - Choose style you prefer

### Team Settings

Standardize for team:

[//]: # 'TeamSettings'
```tsx
// Shared configuration
const devToolsConfig = {
  queryClient,
  environment: getEnvironment(),
  userRole: getUserRole(),
  hideStorageButton: false,
  hideEnvButton: false,
  // Team preferences
}

<RnBetterDevToolsBubble {...devToolsConfig} />
```
[//]: # 'TeamSettings'

### Production Safety

Ensure production safety:

[//]: # 'ProductionSafety'
```tsx
// Multiple safety checks
const showDevTools = 
  __DEV__ || // Development build
  user?.isInternalUser || // Internal users
  flags?.enableDebugMode // Feature flag

{showDevTools && <RnBetterDevToolsBubble {...props} />}
```
[//]: # 'ProductionSafety'

## Platform Notes

### iOS

- No special permissions needed
- Works with safe area
- Respects notch/dynamic island

### Android

- May need overlay permission
- Works with gesture navigation
- Adapts to system bars

### Web

- Fixed positioning used
- Mouse drag support
- Keyboard shortcuts planned

## Future Enhancements

### Planned Features

- **Minimize mode** - Smaller bubble option
- **Auto-hide** - Hide after inactivity
- **Gesture shortcuts** - Swipe to open
- **Custom positions** - Preset locations
- **Bubble themes** - Custom colors

### Integration Improvements

- Desktop app sync
- Team sharing
- Cloud settings
- Multi-device support

## Next Steps

- [Modal Persistence](./modal-persistence.md) - Window state management
- [React Query Tools](./react-query-tools.md) - Query debugging
- [Configuration](../configuration.md) - Setup options