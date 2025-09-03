# Floating Dev Tools Hide/Show Toggle Test

## Feature Description

The floating dev tools bubble now supports a single-click hide/show toggle feature with position memory:

### Behavior:

1. **Single Click**: Toggles between hidden and visible states
   - When visible: Clicking once will hide the bubble to the right edge (only the drag handle remains visible)
   - When hidden: Clicking once will show the full bubble again **at its previous position**

2. **Position Memory**: The bubble remembers where it was before hiding
   - The position is saved when you click to hide
   - When you click to show, it returns to the exact same position
   - If you drag the bubble to a new location, that becomes the new saved position

3. **Drag Detection**: The tool differentiates between clicks and drags
   - Movement <= 5 pixels is considered a click
   - Movement > 5 pixels is considered a drag
   - Dragging still works as before for repositioning

4. **Animation**: Smooth 200ms animation when toggling states

## Testing Instructions:

### Test 1: Hide the bubble

1. Find the floating dev tools bubble (shows "LOCAL" and "Admin")
2. Click once on the drag handle (left side with dots)
3. The bubble should animate to the right edge, showing only the drag handle

### Test 2: Show the bubble with position memory

1. With the bubble hidden (only drag handle visible)
2. Click once on the drag handle
3. The bubble should animate back to its previous position (where it was before hiding)

### Test 3: Ensure drag still works

1. Press and hold the drag handle
2. Drag the bubble to a new position
3. Release - the bubble should stay at the new position
4. The drag action should NOT trigger the hide/show toggle

### Test 4: Position memory update

1. Drag the bubble to the left side of the screen
2. Click to hide it - it should animate to the right edge
3. Click to show it - it should return to the left side
4. Drag it to the center of the screen
5. Click to hide it - it should animate to the right edge
6. Click to show it - it should return to the center (new saved position)

### Test 5: Edge case - drag vs click

1. Press the drag handle
2. Move very slightly (1-2 pixels)
3. Release - this should be detected as a click and toggle hide/show
4. Press the drag handle
5. Move more than 5 pixels
6. Release - this should be a drag and NOT toggle hide/show

## Implementation Details:

- Tracks drag distance using `dragDistanceRef` and `isDragRef`
- Threshold of 5 pixels to differentiate click from drag
- `toggleHideShow` function handles the animation and state update
- `savedPositionRef` stores the bubble's position before hiding
- Position is saved to AsyncStorage after animation completes
- When dragging to a visible position, `savedPositionRef` is updated automatically
