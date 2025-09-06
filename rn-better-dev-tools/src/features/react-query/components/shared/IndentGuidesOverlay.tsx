import { memo, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";

interface GuideSegment {
  startLine: number;
  endLine: number;
  isBracketPair?: boolean;
  bracketNestLevel?: number;
}

interface GuideColumn {
  depth: number;
  left: number;
  segments: GuideSegment[];
}

interface BracketPair {
  openLine: number;
  closeLine: number;
  depth: number;
  column: number;
  nestLevel: number;
}

interface FlatDataItem {
  id: string;
  key: string;
  value: any;
  valueType: string;
  depth: number;
  isExpandable: boolean;
  isExpanded: boolean;
  parentId?: string;
  hasChildren: boolean;
  childCount: number;
  path: string[];
  type: string;
  isLastChild?: boolean;
  parentHasMoreSiblings?: boolean[];
  siblingIndex?: number;
  totalSiblings?: number;
}

interface IndentGuidesOverlayProps {
  flatData: FlatDataItem[];
  visibleRange: { start: number; end: number };
  scrollOffset: number;
  itemHeight: number;
  indentWidth: number;
  activeLineIndex?: number;
}

// VS Code-inspired color constants with proper opacity
const GUIDE_COLOR = gameUIColors.primary + "14"; // 8% opacity - very subtle like VS Code
const ACTIVE_GUIDE_COLOR = gameUIColors.primary + "28"; // 16% opacity - slightly brighter for active
const BRACKET_PAIR_COLORS = [
  gameUIColors.dataTypes.array + "20",    // Level 0 - 12.5% opacity
  gameUIColors.dataTypes.object + "20",   // Level 1
  gameUIColors.info + "20",               // Level 2
  gameUIColors.success + "20",            // Level 3
  gameUIColors.warning + "20",            // Level 4
  gameUIColors.critical + "20",           // Level 5
];

/**
 * IndentGuidesOverlay component that renders VS Code-style continuous indent guide lines
 * This is rendered as a single overlay above the list items, not per-item
 */
export const IndentGuidesOverlay = memo<IndentGuidesOverlayProps>(({
  flatData,
  visibleRange,
  scrollOffset,
  itemHeight,
  indentWidth,
  activeLineIndex,
}) => {
  // First, detect bracket pairs in the data
  const bracketPairs = useMemo(() => {
    const pairs: BracketPair[] = [];
    const stack: Array<{ item: FlatDataItem; index: number; nestLevel: number }> = [];
    
    flatData.forEach((item, index) => {
      // Track objects and arrays as bracket pairs
      if ((item.valueType === 'object' || item.valueType === 'array') && item.isExpandable) {
        if (item.isExpanded && item.hasChildren) {
          // This is an open bracket
          const nestLevel = stack.length;
          stack.push({ item, index, nestLevel });
        }
      }
      
      // Check if we're at the end of a bracket pair
      if (stack.length > 0) {
        const lastOpen = stack[stack.length - 1];
        
        // Check if this is the last child of the open bracket
        if (item.parentId === lastOpen.item.id) {
          // Check if there's a next item that's not a child of this parent
          const nextItem = index < flatData.length - 1 ? flatData[index + 1] : null;
          if (!nextItem || nextItem.parentId !== lastOpen.item.id) {
            // This is the closing bracket position
            pairs.push({
              openLine: lastOpen.index,
              closeLine: index,
              depth: lastOpen.item.depth + 1,
              column: lastOpen.item.depth * indentWidth,
              nestLevel: lastOpen.nestLevel
            });
            stack.pop();
          }
        }
      }
    });
    
    return pairs;
  }, [flatData, indentWidth]);
  
  const guides = useMemo(() => {
    if (!flatData || flatData.length === 0) return [];
    
    const guideColumns: GuideColumn[] = [];
    
    // Calculate the maximum depth we need to render
    const visibleItems = flatData.slice(
      Math.max(0, visibleRange.start),
      Math.min(flatData.length, visibleRange.end + 1)
    );
    
    if (visibleItems.length === 0) return [];
    
    const maxDepth = Math.max(...visibleItems.map(item => item.depth));
    
    // For each depth level, find continuous segments where guides should be shown
    // Start from depth 0 to show guides for root's children
    for (let depth = 0; depth <= maxDepth; depth++) {
      // Skip depth 0 as root doesn't need a guide above it
      if (depth === 0) continue;
      
      // For depth 1 (root's children), the guide should be at the root's expander position
      // For deeper levels, add the indent
      const column: GuideColumn = {
        depth,
        left: depth === 1 ? 8 : (depth - 1) * indentWidth + 8,  // Special case for root's children
        segments: []
      };
      
      let segmentStart = -1;
      let inSegment = false;
      
      // Scan through visible items to find where guides should appear
      for (let i = visibleRange.start; i <= Math.min(visibleRange.end, flatData.length - 1); i++) {
        const item = flatData[i];
        const nextItem = i < flatData.length - 1 ? flatData[i + 1] : null;
        
        // Determine if a guide should be shown at this depth for this line
        let shouldShowGuide = false;
        
        // Case 1: Item is at or deeper than this depth level
        if (item.depth >= depth) {
          shouldShowGuide = true;
        }
        
        // Case 2: Item is expanded parent at depth-1 with children
        if (item.depth === depth - 1 && item.isExpanded && item.hasChildren) {
          // Check if next item is a child
          if (nextItem && nextItem.depth === depth) {
            shouldShowGuide = true;
          }
        }
        
        // Case 3: Check if this is part of a continuous vertical line from parent levels
        // This handles the case where we need to draw lines through items that connect siblings
        if (item.depth > depth) {
          // We're deeper than the guide level, so we should show it
          shouldShowGuide = true;
        } else if (item.depth === depth - 1) {
          // We're at the parent level - check if there are more siblings below
          // that would need this guide to continue
          if (nextItem && nextItem.depth >= depth) {
            shouldShowGuide = true;
          }
        }
        
        // Track segments
        if (shouldShowGuide && !inSegment) {
          segmentStart = i;
          inSegment = true;
        } else if (!shouldShowGuide && inSegment) {
          // End the segment
          column.segments.push({
            startLine: segmentStart,
            endLine: i - 1
          });
          inSegment = false;
        }
      }
      
      // Close any open segment
      if (inSegment && segmentStart !== -1) {
        column.segments.push({
          startLine: segmentStart,
          endLine: Math.min(visibleRange.end, flatData.length - 1)
        });
      }
      
      // Only add column if it has segments
      if (column.segments.length > 0) {
        guideColumns.push(column);
      }
    }
    
    // Add bracket pair guides as additional segments
    bracketPairs.forEach(pair => {
      // Check if this bracket pair intersects with the visible range
      if (pair.closeLine >= visibleRange.start && pair.openLine <= visibleRange.end) {
        // Find or create the column for this depth
        let column = guideColumns.find(c => c.depth === pair.depth);
        if (!column) {
          column = {
            depth: pair.depth,
            left: pair.depth === 1 ? 8 : (pair.depth - 1) * indentWidth + 8,  // Special case for root's children
            segments: []
          };
          guideColumns.push(column);
        }
        
        // Add the bracket pair segment
        column.segments.push({
          startLine: Math.max(pair.openLine, visibleRange.start),
          endLine: Math.min(pair.closeLine, visibleRange.end),
          isBracketPair: true,
          bracketNestLevel: pair.nestLevel
        });
      }
    });
    
    // Sort columns by depth for consistent rendering
    guideColumns.sort((a, b) => a.depth - b.depth);
    
    return guideColumns;
  }, [flatData, visibleRange, indentWidth, bracketPairs]);
  
  // Determine active indent guide
  const activeGuide = useMemo(() => {
    if (activeLineIndex === undefined || activeLineIndex < 0) return null;
    
    const activeItem = flatData[activeLineIndex];
    if (!activeItem) return null;
    
    const activeDepth = activeItem.depth;
    if (activeDepth === 0) return null;
    
    // Find the range of lines that belong to the same indent block
    let startLine = activeLineIndex;
    let endLine = activeLineIndex;
    
    // Search upward for the start of the block
    for (let i = activeLineIndex - 1; i >= 0; i--) {
      const item = flatData[i];
      if (item.depth < activeDepth) break;
      if (item.depth === activeDepth) {
        startLine = i;
      }
    }
    
    // Search downward for the end of the block
    for (let i = activeLineIndex + 1; i < flatData.length; i++) {
      const item = flatData[i];
      if (item.depth < activeDepth) break;
      if (item.depth === activeDepth) {
        endLine = i;
      }
    }
    
    return {
      depth: activeDepth,
      startLine,
      endLine
    };
  }, [flatData, activeLineIndex]);
  
  return (
    <View style={styles.overlay} pointerEvents="none">
      {guides.map((column) => 
        column.segments.map((segment, segmentIdx) => {
          // Check if this segment is part of the active guide
          const isActive = activeGuide && 
            column.depth === activeGuide.depth &&
            segment.startLine <= activeGuide.endLine &&
            segment.endLine >= activeGuide.startLine;
          
          // Calculate the actual render position relative to visible area
          const relativeStart = segment.startLine - visibleRange.start;
          const segmentHeight = (segment.endLine - segment.startLine + 1) * itemHeight;
          
          // Skip segments that are completely outside the visible area
          if (relativeStart * itemHeight + segmentHeight < -scrollOffset) {
            return null;
          }
          
          // Check if the segment starts with a parent item (expanded item at depth-1)
          const startItem = flatData[segment.startLine];
          const isStartingFromParent = startItem && startItem.depth === column.depth - 1 && startItem.isExpanded;
          
          // Adjust position if starting from parent - start below the expand arrow
          const topOffset = isStartingFromParent ? (itemHeight / 2) : 0;
          const heightAdjustment = isStartingFromParent ? -(itemHeight / 2) : 0;
          
          // Determine the color based on bracket pair or regular guide
          let lineColor = GUIDE_COLOR;
          if (segment.isBracketPair && segment.bracketNestLevel !== undefined) {
            lineColor = BRACKET_PAIR_COLORS[segment.bracketNestLevel % BRACKET_PAIR_COLORS.length];
          } else if (isActive) {
            lineColor = ACTIVE_GUIDE_COLOR;
          }
          
          return (
            <View
              key={`${column.depth}-${segmentIdx}`}
              style={[
                styles.guideLine,
                {
                  left: column.left,
                  top: relativeStart * itemHeight - scrollOffset + topOffset,
                  height: segmentHeight + heightAdjustment,
                  backgroundColor: lineColor,
                }
              ]}
            />
          );
        })
      )}
    </View>
  );
});

IndentGuidesOverlay.displayName = "IndentGuidesOverlay";

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Render above content but below interactive elements
  },
  guideLine: {
    position: "absolute",
    width: 1, // Exactly 1px like VS Code
    backgroundColor: GUIDE_COLOR,
  },
  guideLineActive: {
    backgroundColor: ACTIVE_GUIDE_COLOR,
  },
});