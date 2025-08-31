import { JsonValue } from "../../types/types";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";

// Stable constants to prevent re-renders [[memory:4875251]]
const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };
const ITEM_HEIGHT = 24; // Fixed height for better performance - reduced for tighter spacing
const LONG_ITEM_HEIGHT = 36; // Height for items with long keys - reduced for tighter spacing
const CHUNK_SIZE = 50; // Process data in chunks to avoid blocking UI
const MAX_DEPTH_LIMIT = 15; // Prevent excessive nesting
const MAX_ITEMS_PER_LEVEL = 500; // Limit items to prevent memory issues
const LONG_KEY_THRESHOLD = 30; // Keys longer than this use vertical layout

// Pre-computed indent styles with reduced indentation [[memory:4875251]]
const INDENT_STYLES = Array.from(
  { length: MAX_DEPTH_LIMIT + 1 },
  (_, depth) =>
    StyleSheet.create({
      container: {
        marginLeft: depth * 10, // Reduced space for tighter tree lines
      },
    }).container,
);

// Enhanced type color cache using centralized theme colors [[memory:4875251]]
const TYPE_COLOR_CACHE = new Map([
  ["string", gameUIColors.dataTypes.string],
  ["number", gameUIColors.dataTypes.number],
  ["bigint", gameUIColors.optional], // Purple for bigint (distinct from number)
  ["boolean", gameUIColors.dataTypes.boolean],
  ["null", gameUIColors.dataTypes.null],
  ["undefined", gameUIColors.dataTypes.undefined],
  ["function", gameUIColors.dataTypes.function],
  ["symbol", gameUIColors.critical], // Pink for symbols (distinct from function)
  ["date", gameUIColors.critical], // Pink for dates
  ["error", gameUIColors.error], // Red for errors
  ["array", gameUIColors.dataTypes.array],
  ["object", gameUIColors.dataTypes.object],
  ["map", gameUIColors.info], // Cyan for maps (distinct from object/array)
  ["set", gameUIColors.success], // Green for sets (distinct from map/array/object)
  ["circular", gameUIColors.warning], // Yellow for circular references
]);

// Pre-computed stable styles with React Query-inspired design
const STABLE_STYLES = StyleSheet.create({
  container: {
    backgroundColor: gameUIColors.primary + "08", // bg-white/[0.03]
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.primary + "14", // border-white/[0.08]
    // Remove flex: 1 and minHeight to allow natural sizing
  },
  header: {
    flexDirection: "column",
    paddingHorizontal: 16, // Increased padding like dev tools
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: gameUIColors.primary, // text-white
    fontSize: 14,
    fontWeight: "500", // font-medium
  },
  description: {
    color: gameUIColors.secondary, // text-gray-400
    fontSize: 12,
    marginTop: 2,
  },
  typeLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.primary + "14", // border-white/[0.08]
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  typeName: {
    fontSize: 10,
    fontWeight: "500",
    color: gameUIColors.secondary, // text-gray-400
  },
  itemContainer: {
    minHeight: ITEM_HEIGHT,
    backgroundColor: "transparent",
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start", // Align items to top for better alignment with expand arrows
  },
  itemTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start", // Changed from center to align expand arrow with first line of text
    paddingLeft: 0, // Remove padding to align with tree lines
    paddingRight: 16,
    paddingVertical: 2, // Further reduced for even tighter spacing
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.primary + "0D", // border-white/[0.05]
    minHeight: 24, // Match ITEM_HEIGHT for consistency
  },
  itemTouchablePressed: {
    backgroundColor: gameUIColors.primary + "05", // bg-white/[0.02]
  },
  expanderContainer: {
    width: 16, // Reduced to minimize space
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4, // Align with text baseline
  },
  expanderIcon: {
    width: 12,
    height: 12,
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 2, // Reduced padding for tighter alignment
    flexWrap: "wrap",
  },
  labelContainerVertical: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 2, // Reduced padding for tighter alignment
    paddingVertical: 2,
  },
  labelContainerVerticalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  labelText: {
    color: gameUIColors.primary, // text-white
    fontSize: 12,
    fontWeight: "500", // font-medium
    fontFamily: "monospace",
    marginRight: 8,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  labelTextTruncated: {
    color: gameUIColors.primary, // text-white
    fontSize: 12,
    fontWeight: "500", // font-medium
    fontFamily: "monospace",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  valueTextVertical: {
    fontSize: 12,
    fontFamily: "monospace",
    color: gameUIColors.primaryLight, // text-gray-300
    paddingLeft: 16, // Indent the value
  },
  valueText: {
    fontSize: 12,
    fontFamily: "monospace",
    flex: 1,
    color: gameUIColors.primaryLight, // text-gray-300
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    color: gameUIColors.secondary, // text-gray-400
    fontSize: 12,
  },
  noDataContainer: {
    padding: 16,
    alignItems: "center",
  },
  noDataText: {
    color: gameUIColors.secondary, // text-gray-400
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 8,
  },
  headerTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  expanderMargin: {
    marginLeft: 8,
  },
});

// Type definitions for flattened data structure
interface FlatDataItem {
  id: string;
  key: string;
  value: JsonValue;
  valueType: string;
  depth: number;
  isExpandable: boolean;
  isExpanded: boolean;
  parentId?: string;
  hasChildren: boolean;
  childCount: number;
  path: string[];
  type: string; // For FlatList optimization
}

// Enhanced type detection optimized for performance
const getValueType = (value: JsonValue): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (value instanceof Error) return "error";
  if (value instanceof Map) return "map";
  if (value instanceof Set) return "set";
  if (value instanceof RegExp) return "regexp";
  if (typeof value === "function") return "function";
  if (typeof value === "symbol") return "symbol";
  if (typeof value === "bigint") return "bigint";
  if (typeof value === "object") return "object";
  return typeof value;
};

// Get value count for collections
const getValueCount = (value: JsonValue, valueType: string): number => {
  if (value === null) return 0;

  switch (valueType) {
    case "array":
      return Array.isArray(value) ? value.length : 0;
    case "object":
      return typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof Error) &&
        !(value instanceof RegExp) &&
        !(value instanceof Map) &&
        !(value instanceof Set)
        ? Object.keys(value).length
        : 0;
    case "map":
      return value instanceof Map ? value.size : 0;
    case "set":
      return value instanceof Set ? value.size : 0;
    default:
      return 0;
  }
};

// Format value for display
const formatValue = (value: JsonValue, valueType: string): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  switch (valueType) {
    case "string":
      return `"${String(value)}"`;
    case "boolean":
      return value === true ? "true" : "false";
    case "function":
      return typeof value === "function"
        ? value.toString().slice(0, 50) + "..."
        : "undefined";
    case "symbol":
      return typeof value === "symbol" ? String(value) : "undefined";
    case "date":
      return value instanceof Date ? value.toISOString() : "undefined";
    case "regexp":
      return value instanceof RegExp ? value.toString() : "undefined";
    case "bigint":
      return typeof value === "bigint" ? value.toString() + "n" : "undefined";
    case "error":
      return value instanceof Error
        ? `${value.name}: ${value.message}`
        : "undefined";
    default:
      return displayValue(value);
  }
};

// Optimized type color lookup using cache [[memory:4875251]]
const getTypeColor = (valueType: string): string => {
  return TYPE_COLOR_CACHE.get(valueType) || gameUIColors.dataTypes.array;
};

// Memoized components for performance
const Expander = React.memo(
  ({ expanded, onPress }: { expanded: boolean; onPress: () => void }) => (
    <TouchableOpacity
      sentry-label="ignore devtools data explorer expander"
      style={STABLE_STYLES.expanderContainer}
      onPress={onPress}
      hitSlop={HIT_SLOP_10}
    >
      <View style={STABLE_STYLES.expanderIcon}>
        <Svg
          width={12}
          height={12}
          viewBox="0 0 16 16"
          style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
        >
          <Path
            d="M6 12l4-4-4-4"
            strokeWidth={2}
            stroke={gameUIColors.secondary} // text-gray-400
            fill="none"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  ),
);

// Type legend component to replace inline type indicators
const TypeLegend = React.memo(
  ({ visibleTypes }: { visibleTypes: string[] }) => {
    const uniqueTypes = Array.from(new Set(visibleTypes)).slice(0, 8); // Limit to 8 most common types

    return (
      <View style={STABLE_STYLES.typeLegend}>
        {uniqueTypes.map((type) => {
          const color = getTypeColor(type);
          return (
            <View
              key={type}
              style={[
                STABLE_STYLES.typeBadge,
                {
                  backgroundColor: `${color}10`,
                  borderColor: `${color}30`,
                },
              ]}
            >
              <View
                style={[STABLE_STYLES.typeColor, { backgroundColor: color }]}
              />
              <Text style={STABLE_STYLES.typeName}>{type}</Text>
            </View>
          );
        })}
      </View>
    );
  },
);

// Optimized data flattening with chunked processing to prevent UI blocking [[memory:4875251]]
const useDataFlattening = (
  data: JsonValue,
  maxDepth = 10,
  autoExpandFirstLevel = false,
) => {
  const [flatData, setFlatData] = useState<FlatDataItem[]>([]);
  const flatDataMapRef = useRef<Map<string, { item: FlatDataItem; index: number }>>(new Map());

  // Initialize with root expanded and optionally first level
  const getInitialExpanded = useCallback(() => {
    const initial = new Set(["root"]);
    if (autoExpandFirstLevel && data && typeof data === "object") {
      if (Array.isArray(data)) {
        data.forEach((_, index) => {
          initial.add(`root.${index}`);
        });
      } else {
        Object.keys(data).forEach((key) => {
          initial.add(`root.${key}`);
        });
      }
    }
    return initial;
  }, [autoExpandFirstLevel, data]);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() =>
    getInitialExpanded(),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Debug logging - commented out for less noise
  // console.log('[VirtualizedDataExplorer] Hook render - isProcessing:', isProcessing);
  // Store circular cache outside of re-renders to prevent reset
  const circularCacheRef = useRef<WeakSet<object>>();
  const processingRef = useRef(false);
  const dataVersionRef = useRef(0);
  const lastActionRef = useRef<{ type: 'expand' | 'collapse' | 'init'; itemId?: string }>();

  // Stable flattenData function that doesn't depend on expandedItems
  const flattenDataStable = useCallback(
    (
      value: JsonValue,
      key = "root",
      depth = 0,
      parentId?: string,
      path: string[] = [],
      expandedSet: Set<string>,
      circularCache: WeakSet<object>,
    ): FlatDataItem[] => {
      // Early termination for performance [[memory:4875251]]
      if (depth > Math.min(maxDepth, MAX_DEPTH_LIMIT)) return [];

      const currentPath = [...path, key];
      const id = currentPath.join(".");
      const valueType = getValueType(value);
      const isExpandable =
        ["object", "array", "map", "set"].includes(valueType) && value !== null;
      const rawChildCount = isExpandable ? getValueCount(value, valueType) : 0;
      // Limit child count to prevent performance issues [[memory:4875251]]
      const childCount = Math.min(rawChildCount, MAX_ITEMS_PER_LEVEL);

      // Check for circular references
      if (value && typeof value === "object") {
        if (circularCache.has(value)) {
          return [
            {
              id,
              key,
              value: "[Circular Reference]",
              valueType: "circular",
              depth,
              isExpandable: false,
              isExpanded: false,
              parentId,
              hasChildren: false,
              childCount: 0,
              path: currentPath,
              type: "circular",
            },
          ];
        }
        circularCache.add(value);
      }

      const currentItem: FlatDataItem = {
        id,
        key,
        value,
        valueType,
        depth,
        isExpandable,
        isExpanded: expandedSet.has(id),
        parentId,
        hasChildren: childCount > 0,
        childCount,
        path: currentPath,
        type: isExpandable ? "expandable" : valueType,
      };

      const result = [currentItem];

      // Only add children if expanded and not too deep [[memory:4875251]]
      if (
        isExpandable &&
        expandedSet.has(id) &&
        depth < Math.min(maxDepth, MAX_DEPTH_LIMIT)
      ) {
        try {
          let entries: [string, JsonValue][] = [];

          switch (valueType) {
            case "array":
              entries = Array.isArray(value)
                ? value.map((item, index): [string, JsonValue] => [
                    index.toString(),
                    item,
                  ])
                : [];
              break;
            case "object":
              entries =
                typeof value === "object" &&
                value !== null &&
                !(value instanceof Date) &&
                !(value instanceof Error) &&
                !(value instanceof RegExp) &&
                !(value instanceof Map) &&
                !(value instanceof Set)
                  ? Object.entries(value)
                  : [];
              break;
            case "map":
              entries =
                value instanceof Map
                  ? Array.from(value.entries()).map(([k, v]) => [
                      String(k),
                      v as JsonValue,
                    ])
                  : [];
              break;
            case "set":
              entries =
                value instanceof Set
                  ? Array.from(value.values()).map((v, index) => [
                      index.toString(),
                      v as JsonValue,
                    ])
                  : [];
              break;
          }

          // Aggressively limit children for performance [[memory:4875251]]
          const limitedEntries = entries.slice(0, childCount);

          // Process children in smaller batches to avoid blocking
          for (let i = 0; i < limitedEntries.length; i += CHUNK_SIZE) {
            const chunk = limitedEntries.slice(i, i + CHUNK_SIZE);
            for (const [childKey, childValue] of chunk) {
              result.push(
                ...flattenDataStable(
                  childValue,
                  childKey,
                  depth + 1,
                  id,
                  currentPath,
                  expandedSet,
                  circularCache,
                ),
              );
            }

            // Yield to main thread periodically for large datasets
            if (i > 0 && i % (CHUNK_SIZE * 2) === 0) {
              break; // Let InteractionManager handle the rest
            }
          }
        } catch (error) {
          // Skip malformed data
        }
      }

      return result;
    },
    [maxDepth], // Only depend on maxDepth, not expandedItems
  );

  // Only process full data when data changes (not on expand/collapse)
  useEffect(() => {
    console.log('\n[VirtualizedDataExplorer] ====== USE EFFECT ======');
    console.log('[VirtualizedDataExplorer] lastActionRef:', lastActionRef.current);
    console.log('[VirtualizedDataExplorer] expandedItems.size:', expandedItems.size);
    
    // Skip if this was just an expand/collapse action
    if (lastActionRef.current && (lastActionRef.current.type === 'expand' || lastActionRef.current.type === 'collapse')) {
      console.log('[VirtualizedDataExplorer] Skipping full processing - was expand/collapse');
      // Make sure processing flag is cleared for incremental updates
      if (isProcessing) {
        setIsProcessing(false);
        processingRef.current = false;
      }
      lastActionRef.current = undefined;
      return;
    }

    // Prevent concurrent processing
    if (processingRef.current) {
      console.log('[VirtualizedDataExplorer] Skipping - already processing');
      return;
    }

    console.log('[VirtualizedDataExplorer] Starting FULL data processing');
    let isCancelled = false;
    let timeoutId: NodeJS.Timeout | undefined;
    processingRef.current = true;
    setIsProcessing(true);

    const processData = async () => {
      // Failsafe timeout to prevent stuck processing
      timeoutId = setTimeout(() => {
        if (processingRef.current && !isCancelled) {
          console.error('[VirtualizedDataExplorer] Processing timeout - forcing clear after 5 seconds');
          setIsProcessing(false);
          processingRef.current = false;
        }
      }, 5000);
      // Small delay to debounce rapid changes
      // Small delay to batch rapid changes
      await new Promise(resolve => setTimeout(resolve, 10));
      
      if (isCancelled) {
        console.log('[VirtualizedDataExplorer] Processing cancelled during delay');
        processingRef.current = false;
        return;
      }

      try {
        // Initialize circular cache for new data
        circularCacheRef.current = new WeakSet();
        dataVersionRef.current = data as any;

        console.log('[VirtualizedDataExplorer] Processing full data tree');
        console.log('[VirtualizedDataExplorer] Data type:', typeof data);
        console.log('[VirtualizedDataExplorer] ExpandedItems:', Array.from(expandedItems));
        const startTime = Date.now();

        const newFlatData = flattenDataStable(
          data,
          "root",
          0,
          undefined,
          [],
          expandedItems,
          circularCacheRef.current,
        );

        console.log(`[VirtualizedDataExplorer] Full processing: ${newFlatData.length} items in ${Date.now() - startTime}ms`);
        
        // Build the map for incremental updates
        const newMap = new Map<string, { item: FlatDataItem; index: number }>();
        newFlatData.forEach((item, index) => {
          newMap.set(item.id, { item, index });
        });
        flatDataMapRef.current = newMap;
        console.log('[VirtualizedDataExplorer] Built map with', newMap.size, 'entries');
        console.log('[VirtualizedDataExplorer] Map keys:', Array.from(newMap.keys()));

        if (!isCancelled) {
          setFlatData(newFlatData);
          setIsProcessing(false);
          processingRef.current = false;
          if (timeoutId) clearTimeout(timeoutId);
          console.log('[VirtualizedDataExplorer] Full processing complete');
        } else {
          console.log('[VirtualizedDataExplorer] Processing was cancelled');
          if (timeoutId) clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('[VirtualizedDataExplorer] Error during processing:', error);
        // Reset to empty data on error
        if (!isCancelled) {
          console.log('[VirtualizedDataExplorer] Resetting to empty data due to error');
          setFlatData([]);
          flatDataMapRef.current = new Map();
          setIsProcessing(false);
          processingRef.current = false;
          if (timeoutId) clearTimeout(timeoutId);
        } else {
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
    };

    processData();

    return () => {
      console.log('[VirtualizedDataExplorer] useEffect cleanup - cancelling processing');
      isCancelled = true;
      processingRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [data, expandedItems, flattenDataStable, maxDepth]);

  // Incremental update function for expand/collapse
  const updateFlatDataIncremental = useCallback(
    (itemId: string, isExpanding: boolean) => {
      console.log(`\n[VirtualizedDataExplorer] ====== INCREMENTAL UPDATE ======`);
      console.log(`[VirtualizedDataExplorer] ItemId: ${itemId}, isExpanding: ${isExpanding}`);
      
      // Clear processing flag since we're doing incremental update
      setIsProcessing(false);
      processingRef.current = false;
      
      setFlatData((prevFlatData) => {
        console.log('[VirtualizedDataExplorer] Current flatData length:', prevFlatData.length);
        console.log('[VirtualizedDataExplorer] Map size:', flatDataMapRef.current.size);
        
        const itemEntry = flatDataMapRef.current.get(itemId);
        if (!itemEntry) {
          console.error(`[VirtualizedDataExplorer] ERROR: Item '${itemId}' not found in map!`);
          console.log('[VirtualizedDataExplorer] Available keys in map:', Array.from(flatDataMapRef.current.keys()));
          return prevFlatData;
        }
        
        console.log('[VirtualizedDataExplorer] Found item:', {
          key: itemEntry.item.key,
          index: itemEntry.index,
          isExpandable: itemEntry.item.isExpandable,
          hasChildren: itemEntry.item.hasChildren,
          childCount: itemEntry.item.childCount,
          valueType: itemEntry.item.valueType,
        });

        const { item, index } = itemEntry;
        
        if (isExpanding && item.isExpandable && item.hasChildren) {
          console.log('[VirtualizedDataExplorer] Starting expansion...');
          // Expand: insert children after the item
          const newItems = [...prevFlatData];
          
          // Create a new circular cache for this subtree
          const subCircularCache = new WeakSet<object>();
          if (item.value && typeof item.value === 'object') {
            subCircularCache.add(item.value);
          }

          console.log('[VirtualizedDataExplorer] Calling flattenDataStable with:', {
            value: typeof item.value,
            itemId: itemId,
            depth: item.depth,
            path: item.path,
          });

          // We need to get the actual children, not re-process the parent
          // So we process each child entry individually
          const childrenItems: FlatDataItem[] = [];
          
          try {
            let entries: [string, JsonValue][] = [];
            const valueType = item.valueType;
            
            switch (valueType) {
              case "array":
                entries = Array.isArray(item.value)
                  ? item.value.map((childValue, index): [string, JsonValue] => [
                      index.toString(),
                      childValue,
                    ])
                  : [];
                break;
              case "object":
                entries =
                  typeof item.value === "object" &&
                  item.value !== null &&
                  !(item.value instanceof Date) &&
                  !(item.value instanceof Error) &&
                  !(item.value instanceof RegExp) &&
                  !(item.value instanceof Map) &&
                  !(item.value instanceof Set)
                    ? Object.entries(item.value)
                    : [];
                break;
              case "map":
                entries =
                  item.value instanceof Map
                    ? Array.from(item.value.entries()).map(([k, v]) => [
                        String(k),
                        v as JsonValue,
                      ])
                    : [];
                break;
              case "set":
                entries =
                  item.value instanceof Set
                    ? Array.from(item.value.values()).map((v, index) => [
                        index.toString(),
                        v as JsonValue,
                      ])
                    : [];
                break;
            }
            
            console.log(`[VirtualizedDataExplorer] Found ${entries.length} child entries`);
            
            // Process each child
            for (const [childKey, childValue] of entries) {
              const childItems = flattenDataStable(
                childValue,
                childKey,
                item.depth + 1,
                itemId,
                item.path,
                new Set(), // Children start collapsed
                subCircularCache,
              );
              childrenItems.push(...childItems);
            }
          } catch (error) {
            console.error('[VirtualizedDataExplorer] Error processing children:', error);
          }
          
          const childrenToInsert = childrenItems;

          console.log(`[VirtualizedDataExplorer] Will insert ${childrenToInsert.length} children`);
          if (childrenToInsert.length > 0) {
            console.log('[VirtualizedDataExplorer] First child to insert:', {
              id: childrenToInsert[0].id,
              key: childrenToInsert[0].key,
              depth: childrenToInsert[0].depth,
              parentId: childrenToInsert[0].parentId,
            });
          }
          
          // Update the parent item to show it's expanded
          newItems[index] = { ...item, isExpanded: true };
          
          // Insert children after the parent
          newItems.splice(index + 1, 0, ...childrenToInsert);
          
          // Rebuild the map
          const newMap = new Map<string, { item: FlatDataItem; index: number }>();
          newItems.forEach((item, idx) => {
            newMap.set(item.id, { item, index: idx });
          });
          flatDataMapRef.current = newMap;
          console.log(`[VirtualizedDataExplorer] Expansion complete - new total: ${newItems.length} items`);
          console.log('[VirtualizedDataExplorer] New map size:', newMap.size);
          
          return newItems;
        } else if (!isExpanding) {
          // Collapse: remove all descendants
          const itemsToRemove = new Set<string>();
          const findDescendants = (parentId: string, depth: number) => {
            prevFlatData.forEach(child => {
              if (child.parentId === parentId || (child.id.startsWith(parentId + '.') && child.depth > depth)) {
                itemsToRemove.add(child.id);
                if (child.hasChildren) {
                  findDescendants(child.id, child.depth);
                }
              }
            });
          };
          
          findDescendants(itemId, item.depth);
          
          // Filter out descendants and update the parent
          const newItems = prevFlatData
            .map((it, idx) => {
              if (it.id === itemId) {
                return { ...it, isExpanded: false };
              }
              return it;
            })
            .filter(it => !itemsToRemove.has(it.id));
          
          // Rebuild the map
          const newMap = new Map<string, { item: FlatDataItem; index: number }>();
          newItems.forEach((item, idx) => {
            newMap.set(item.id, { item, index: idx });
          });
          flatDataMapRef.current = newMap;
          console.log(`[VirtualizedDataExplorer] Collapse complete - removed ${itemsToRemove.size} items, new total: ${newItems.length}`);
          
          return newItems;
        }
        
        return prevFlatData;
      });
    },
    [flattenDataStable],
  );

  const toggleExpanded = useCallback((itemId: string) => {
    console.log(`\n[VirtualizedDataExplorer] ====== TOGGLE EXPANDED ======`);
    console.log(`[VirtualizedDataExplorer] ItemId: ${itemId}`);
    console.log('[VirtualizedDataExplorer] Current expandedItems:', Array.from(expandedItems));
    console.log('[VirtualizedDataExplorer] FlatData length:', flatData.length);
    console.log('[VirtualizedDataExplorer] Map has item?:', flatDataMapRef.current.has(itemId));
    
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      const isExpanding = !newSet.has(itemId);
      console.log(`[VirtualizedDataExplorer] Action: ${isExpanding ? 'EXPANDING' : 'COLLAPSING'}`);
      
      if (isExpanding) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      
      console.log('[VirtualizedDataExplorer] New expandedItems will be:', Array.from(newSet));
      
      // Store the action for the effect to use
      lastActionRef.current = { type: isExpanding ? 'expand' : 'collapse', itemId };
      
      // Perform incremental update
      updateFlatDataIncremental(itemId, isExpanding);
      
      return newSet;
    });
  }, [updateFlatDataIncremental, expandedItems, flatData.length]);

  // console.log('[VirtualizedDataExplorer] Returning from hook - isProcessing:', isProcessing, 'flatData.length:', flatData.length);
  return { flatData, isProcessing, toggleExpanded };
};

// Optimized virtualized item renderer with full-row clickability [[memory:4875251]]
const VirtualizedItem = React.memo(
  ({
    item,
    onToggleExpanded,
  }: {
    item: FlatDataItem;
    onToggleExpanded: (id: string) => void;
  }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [showFullKey, setShowFullKey] = useState(false);

    // Use pre-computed styles to avoid inline calculations [[memory:4875251]]
    const indentStyle =
      INDENT_STYLES[Math.min(item.depth, MAX_DEPTH_LIMIT)] || INDENT_STYLES[0];
    const color = getTypeColor(item.valueType);

    // Check if key is long and needs special layout
    const isLongKey = item.key.length > LONG_KEY_THRESHOLD;

    // Use inline handler since component is already memoized [[memory:4875251]]
    const handlePress = () => {
      console.log(`[VirtualizedItem] Pressed item: ${item.id}, expandable: ${item.isExpandable}`);
      if (item.isExpandable) {
        onToggleExpanded(item.id);
      }
    };

    const handleKeyPress = () => {
      if (isLongKey) {
        setShowFullKey(!showFullKey);
      }
    };

    // Always show full key for better identification
    const displayKey = item.key;

    return (
      <View style={[STABLE_STYLES.itemContainer, indentStyle]}>
        {/* Tree lines */}
        {item.depth > 0 && (
          <View
            style={{
              position: "absolute",
              left: -10,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: gameUIColors.primary + "26",
            }}
          />
        )}
        {item.depth > 0 && (
          <View
            style={{
              position: "absolute",
              left: -10,
              top: 10, // Center of the 20px height (marginTop: 4 + height: 12 / 2)
              width: 10, // Connect to the arrow
              height: 1,
              backgroundColor: gameUIColors.primary + "26",
            }}
          />
        )}
        <TouchableOpacity
          sentry-label="ignore devtools data explorer item"
          style={[
            STABLE_STYLES.itemTouchable,
            isPressed && STABLE_STYLES.itemTouchablePressed,
            isLongKey && { minHeight: LONG_ITEM_HEIGHT, paddingVertical: 2 },
          ]}
          onPress={handlePress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={item.isExpandable ? 0.7 : 1}
          disabled={!item.isExpandable}
        >
          {item.isExpandable ? (
            <Expander expanded={item.isExpanded} onPress={() => {}} />
          ) : (
            <View style={STABLE_STYLES.expanderContainer} />
          )}

          {isLongKey ? (
            // Vertical layout for long keys
            <View style={STABLE_STYLES.labelContainerVertical}>
              <View style={STABLE_STYLES.labelContainerVerticalRow}>
                <TouchableOpacity
                  sentry-label="ignore devtools data explorer key press"
                  onPress={handleKeyPress}
                  style={{ flex: 1 }}
                >
                  <Text
                    style={STABLE_STYLES.labelTextTruncated}
                    numberOfLines={undefined}
                  >
                    {displayKey}:
                  </Text>
                </TouchableOpacity>
              </View>

              {item.isExpandable ? (
                <Text
                  style={[
                    STABLE_STYLES.valueTextVertical,
                    { color: gameUIColors.secondary },
                  ]}
                >
                  {item.valueType} ({item.childCount}{" "}
                  {item.childCount === 1 ? "item" : "items"})
                </Text>
              ) : (
                <Text style={[STABLE_STYLES.valueTextVertical, { color }]}>
                  {formatValue(item.value, item.valueType)}
                </Text>
              )}
            </View>
          ) : (
            // Horizontal layout for normal keys
            <View style={STABLE_STYLES.labelContainer}>
              <Text style={STABLE_STYLES.labelText} numberOfLines={undefined}>
                {item.key}:
              </Text>

              {item.isExpandable ? (
                <Text
                  style={[
                    STABLE_STYLES.valueText,
                    { color: gameUIColors.secondary },
                  ]}
                >
                  {item.valueType} ({item.childCount}{" "}
                  {item.childCount === 1 ? "item" : "items"})
                </Text>
              ) : (
                <Text style={[STABLE_STYLES.valueText, { color }]}>
                  {formatValue(item.value, item.valueType)}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

// Main virtualized data explorer component
interface VirtualizedDataExplorerProps {
  title: string;
  description?: string;
  data: JsonValue;
  maxDepth?: number;
  rawMode?: boolean; // When true, shows data directly without container/header/badges
  initialExpanded?: boolean; // When true, auto-expands the first level of data
}

export const VirtualizedDataExplorer: React.FC<
  VirtualizedDataExplorerProps
> = ({
  title,
  description,
  data,
  maxDepth = 10,
  rawMode = false,
  initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(rawMode); // Auto-expand in raw mode
  // console.log('[VirtualizedDataExplorer] Component render - rawMode:', rawMode, 'title:', title);
  const { flatData, isProcessing, toggleExpanded } = useDataFlattening(
    data,
    maxDepth,
    initialExpanded,
  );
  // console.log('[VirtualizedDataExplorer] Got from hook - isProcessing:', isProcessing, 'flatData.length:', flatData.length);

  // Calculate visible types for the legend
  const visibleTypes = useMemo(() => {
    return flatData.map((item) => item.valueType);
  }, [flatData]);

  // Remove unnecessary useCallback - not passed to memoized components [[memory:4875251]]
  const toggleMainExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Stable renderItem using module-scope function [[memory:4875251]]
  const renderItem = ({ item }: { item: FlatDataItem }) => (
    <VirtualizedItem item={item} onToggleExpanded={toggleExpanded} />
  );

  // Calculate average item size for better FlatList performance [[memory:4875251]]
  const averageItemSize = useMemo(() => {
    const longKeyCount = flatData.filter(
      (item) => item.key.length > LONG_KEY_THRESHOLD,
    ).length;
    const normalKeyCount = flatData.length - longKeyCount;

    if (flatData.length === 0) return ITEM_HEIGHT;

    const totalHeight =
      longKeyCount * LONG_ITEM_HEIGHT + normalKeyCount * ITEM_HEIGHT;
    return Math.round(totalHeight / flatData.length);
  }, [flatData]);

  // Simple keyExtractor without useCallback [[memory:4875251]]
  const keyExtractor = (item: FlatDataItem) => item.id;

  const hasData =
    data &&
    (typeof data === "object" || Array.isArray(data)) &&
    (Array.isArray(data)
      ? data.length > 0
      : Object.keys(data as object).length > 0);

  // Raw mode: render data directly without header/container
  if (rawMode) {
    if (!hasData) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={STABLE_STYLES.noDataText}>No data available</Text>
        </View>
      );
    }

    // console.log('[VirtualizedDataExplorer] Rendering raw mode - isProcessing:', isProcessing);
    return (
      <View style={{ flex: 1 }}>
        {isProcessing ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={STABLE_STYLES.loadingText}>Processing data... (raw mode, isProcessing={String(isProcessing)})</Text>
          </View>
        ) : (
          <FlatList
            sentry-label="ignore devtools data explorer list"
            data={flatData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={STABLE_STYLES.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={10}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  // Standard mode: render with header and container
  if (!hasData) {
    return (
      <View style={STABLE_STYLES.container}>
        <View style={STABLE_STYLES.header}>
          <View style={STABLE_STYLES.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={STABLE_STYLES.title}>{title}</Text>
              {description && (
                <Text style={STABLE_STYLES.description}>{description}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={STABLE_STYLES.noDataContainer}>
          <Text style={STABLE_STYLES.noDataText}>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={STABLE_STYLES.container}>
      <View style={STABLE_STYLES.header}>
        <View style={STABLE_STYLES.headerRow}>
          <TouchableOpacity
            sentry-label="ignore devtools data explorer header toggle"
            onPress={toggleMainExpanded}
            hitSlop={HIT_SLOP_10}
            style={STABLE_STYLES.headerTouchable}
          >
            <View style={{ flex: 1 }}>
              <Text style={STABLE_STYLES.title}>{title}</Text>
              {description && (
                <Text style={STABLE_STYLES.description}>{description}</Text>
              )}
            </View>
            <View style={STABLE_STYLES.expanderMargin}>
              <Expander expanded={isExpanded} onPress={toggleMainExpanded} />
            </View>
          </TouchableOpacity>
        </View>

        {isExpanded && visibleTypes.length > 0 && !rawMode && (
          <TypeLegend visibleTypes={visibleTypes} />
        )}
      </View>

      {isExpanded && (
        <>
          {isProcessing ? (
            <View style={STABLE_STYLES.loadingContainer}>
              <Text style={STABLE_STYLES.loadingText}>Processing data... (isProcessing={String(isProcessing)})</Text>
            </View>
          ) : (
            <View
              style={{
                height: Math.min(flatData.length * averageItemSize, 400),
              }}
            >
              <FlatList
                sentry-label="ignore devtools data explorer collapsed list"
                data={flatData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={STABLE_STYLES.listContent}
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={10}
                scrollEnabled={false}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};
