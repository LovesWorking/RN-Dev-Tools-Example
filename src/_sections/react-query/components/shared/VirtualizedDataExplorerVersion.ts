/**
 * Version tracking for VirtualizedDataExplorer component
 * 
 * UPDATE THIS VERSION whenever you make changes to:
 * - VirtualizedDataExplorer.tsx
 * - VirtualizedDataExplorerRefactored.tsx
 * - Any performance-impacting changes to the component
 */

export const VIRTUALIZED_DATA_EXPLORER_VERSION = {
  version: "1.6.0",
  name: "Realistic Testing",
  date: "2024-01-18",
  description: "Testing with realistic progressive expansion",
  changes: [
    "Separated state management into hooks",
    "Extracted pure utility functions",
    "Optimized re-renders with React.memo",
    "Added custom comparison function to VirtualizedItem",
    "Memoized renderItem with useCallback",
    "Removed circular reference checking",
    "Removed chunk processing",
    "Testing with initialExpanded only (realistic usage)",
  ],
};

/**
 * Version History (for reference)
 * 
 * 1.0.0 - Initial Refactored (2024-01-18)
 *   - First tracked version after refactoring
 *   - Baseline for performance comparisons
 */

export type ComponentVersion = typeof VIRTUALIZED_DATA_EXPLORER_VERSION;