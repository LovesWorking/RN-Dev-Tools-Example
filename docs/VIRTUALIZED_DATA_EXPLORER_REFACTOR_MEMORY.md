# VirtualizedDataExplorer Refactoring Memory Bank

## Current Understanding (As of Initial Analysis)

### Component Purpose
A virtualized, read-only data viewer for efficiently rendering large, nested JSON data structures in React Native dev tools. Uses FlashList for virtualization to handle massive datasets without performance issues.

### Key Features Identified
1. **Virtualization** - Only renders visible items using FlashList
2. **Nested Data Support** - Expanding/collapsing nested objects/arrays
3. **Type Indicators** - Color-coded values based on type
4. **Performance Optimization** - Chunked processing, memoization, lazy evaluation
5. **Tree Lines** - Visual hierarchy with connecting lines
6. **Type Legend** - Shows all data types present in the structure
7. **Raw Mode** - Can render without header/container
8. **Auto-Expand** - Can auto-expand first level

## Current Execution Order (2-Level Nested Object)

### Initial Mount Flow:
1. **Component Mount** → VirtualizedDataExplorer receives props
2. **State Initialization** → useState for isExpanded (based on rawMode)
3. **useDataFlattening Hook Called** →
   - Initialize expandedItems Set with "root" (and first level if autoExpand)
   - Set isProcessing to true
   - Create circularCache WeakSet

4. **useEffect in useDataFlattening Triggers** →
   - InteractionManager.runAfterInteractions scheduled
   - flattenData called with root data
   
5. **flattenData Execution (root level)** →
   - Check depth limit (0 < maxDepth)
   - Build path: ["root"]
   - getValueType(data) → returns "object"
   - getValueCount(data) → counts object keys
   - Check circular reference (add to WeakSet)
   - Create root FlatDataItem
   - Check if expanded (root is in expandedItems)
   - Process children (first level keys)

6. **flattenData Recursion (level 1)** →
   - For each key in object:
     - Build path: ["root", key]
     - getValueType → determine type
     - Create FlatDataItem for each
     - If expandable and in expandedItems, recurse

7. **flattenData Recursion (level 2)** →
   - Similar process for second level
   - Creates FlatDataItems
   - No further recursion (not expanded by default)

8. **State Update** →
   - setFlatData with flattened array
   - setIsProcessing(false)

9. **Render Phase** →
   - Calculate visibleTypes from flatData
   - Render container (if not rawMode)
   - Render header with Expander
   - Render TypeLegend (if expanded and not rawMode)
   - Render FlashList with flatData

10. **FlashList Virtualization** →
    - keyExtractor generates keys
    - renderItem called for visible items only
    - VirtualizedItem renders each row

### User Interaction Flow (Expanding Item):
1. **User Taps Row** → TouchableOpacity.onPress
2. **handlePress in VirtualizedItem** → calls onToggleExpanded(item.id)
3. **toggleExpanded in useDataFlattening** →
   - Updates expandedItems Set
   - Triggers useEffect re-run
4. **Re-flattening** → Same process but includes newly expanded item's children
5. **Re-render** → FlashList updates with new flatData

## Problems Identified

### 1. Single Responsibility Violations
- `useDataFlattening` does: state management, data processing, circular detection, chunking
- `VirtualizedItem` does: rendering, interaction handling, layout decisions
- `flattenData` does: flattening, circular detection, type checking, limiting

### 2. Complex Functions
- `flattenData` is 100+ lines doing multiple things
- `VirtualizedItem` has complex conditional rendering logic
- Main component has multiple render paths

### 3. Mixed Concerns
- Business logic mixed with UI logic
- Data processing mixed with state management
- Type detection mixed with formatting

## Refactoring Plan

### Phase 1: Extract Pure Utility Functions
1. Type detection utilities
2. Value formatting utilities  
3. Color mapping utilities
4. Path building utilities

### Phase 2: Extract Data Processing
1. Circular reference detection
2. Data flattening logic
3. Children processing
4. Depth limiting

### Phase 3: Extract State Management
1. Expanded items management
2. Processing state management
3. Initial state computation

### Phase 4: Extract UI Components
1. Tree line rendering
2. Expander component
3. Type legend component
4. Item content rendering

### Phase 5: Reorganize Main Component
1. Separate container logic
2. Separate raw mode logic
3. Clean render methods

## Notes
- Must maintain exact same behavior
- Keep all optimizations in place
- Add clear comments for understanding
- Sort by execution order

## Refactoring Complete - Execution Order Verification

### Verified Execution Order (Same as Original):

1. **Component Mount** → VirtualizedDataExplorer receives props
2. **State Initialization** → useState for isExpanded (based on rawMode)
3. **useDataFlattening Hook** → Now split into:
   - useExpandedItems (manages expanded state)
   - useDataFlattening (manages flattening process)
4. **useEffect Triggers** → Same InteractionManager.runAfterInteractions
5. **flattenData Function** → Now broken into:
   - Main flattenData function
   - Helper functions (getValueType, getValueCount, etc.)
   - processChildren for recursion
6. **State Updates** → Same setFlatData pattern
7. **Render Phase** → Same render logic, now cleaner
8. **User Interactions** → Same toggle mechanism

### Key Improvements Made:

1. **Pure Functions Extracted** (SRP):
   - getValueType
   - getValueCount
   - formatValue
   - getTypeColor
   - buildPath
   - buildId
   - createFlatDataItem
   - getValueEntries

2. **State Management Separated** (SRP):
   - useExpandedItems hook
   - Circular reference detection isolated

3. **UI Components Separated** (SRP):
   - TreeLines component
   - ItemContent component
   - TypeLegend unchanged but documented
   - Expander unchanged but documented

4. **Code Organization** (KISS):
   - Sections clearly labeled
   - Functions sorted by execution order
   - Comments explain each section's purpose

### Performance Benchmark Results Expected:
- Small nested objects: < 10ms render time
- Large flat objects (500 items): < 20ms render time
- Deep nested objects: < 30ms render time
- Large arrays: < 15ms render time
- Complex mixed data: < 25ms render time

### Behavior Verification:
✅ Same data flattening logic
✅ Same expand/collapse behavior
✅ Same rendering output
✅ Same performance optimizations
✅ Same memoization patterns
✅ Same virtualization with FlashList

The refactored version maintains 100% behavioral compatibility while being much easier to understand, debug, and maintain.