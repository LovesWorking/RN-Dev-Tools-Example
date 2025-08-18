/**
 * Version tracking for VirtualizedDataExplorer component
 * 
 * UPDATE THIS VERSION whenever you make changes to:
 * - VirtualizedDataExplorer.tsx
 * - VirtualizedDataExplorerRefactored.tsx
 * - Any performance-impacting changes to the component
 */

export const VIRTUALIZED_DATA_EXPLORER_VERSION = {
  version: "1.1.0",
  name: "Full Expansion Support",
  date: "2024-01-18",
  description: "Added fullyExpanded prop for accurate performance testing",
  changes: [
    "Separated state management into hooks",
    "Extracted pure utility functions",
    "Optimized re-renders with React.memo",
    "Improved FlashList configuration",
    "Added fullyExpanded prop for complete tree expansion",
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