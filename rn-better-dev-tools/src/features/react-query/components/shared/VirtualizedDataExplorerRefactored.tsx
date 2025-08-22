/**
 * VirtualizedDataExplorer - Refactored Version
 * 
 * A performant, virtualized data viewer for large JSON structures.
 * This refactored version follows SRP (Single Responsibility Principle) and KISS principles.
 * 
 * EXECUTION ORDER (for 2-level nested object):
 * 1. Component mounts with props
 * 2. State initializes (expanded state based on rawMode)
 * 3. useDataFlattening hook initializes
 * 4. useEffect triggers data processing
 * 5. Data flattening occurs recursively
 * 6. FlatData array is built
 * 7. Component renders with FlashList
 * 8. User interactions trigger re-flattening
 */

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
  InteractionManager,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { FlashList } from "@shopify/flash-list";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";

// ============================================================================
// SECTION 1: CONSTANTS AND CONFIGURATION
// ============================================================================

// Stable constants to prevent re-renders [[memory:4875251]]
const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };
const ITEM_HEIGHT = 24;
const LONG_ITEM_HEIGHT = 36;
const CHUNK_SIZE = 50;
const MAX_DEPTH_LIMIT = 15;
const MAX_ITEMS_PER_LEVEL = 500;
const LONG_KEY_THRESHOLD = 30;

// ============================================================================
// SECTION 2: TYPE DEFINITIONS
// ============================================================================

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
  type: string;
}

interface VirtualizedDataExplorerProps {
  title: string;
  description?: string;
  data: JsonValue;
  maxDepth?: number;
  rawMode?: boolean;
  initialExpanded?: boolean;
  fullyExpanded?: boolean;
}

// ============================================================================
// SECTION 3: STYLE DEFINITIONS (Pre-computed for performance)
// ============================================================================

// Pre-computed indent styles [[memory:4875251]]
const INDENT_STYLES = Array.from(
  { length: MAX_DEPTH_LIMIT + 1 },
  (_, depth) =>
    StyleSheet.create({
      container: {
        marginLeft: depth * 10,
      },
    }).container
);

// Pre-computed stable styles
const STABLE_STYLES = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  header: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    color: "#9CA3AF",
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
    borderTopColor: "rgba(255, 255, 255, 0.08)",
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
    color: "#9CA3AF",
  },
  itemContainer: {
    minHeight: ITEM_HEIGHT,
    backgroundColor: "transparent",
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 0,
    paddingRight: 16,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    minHeight: 24,
  },
  itemTouchablePressed: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  expanderContainer: {
    width: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  expanderIcon: {
    width: 12,
    height: 12,
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 2,
    flexWrap: "wrap",
  },
  labelContainerVertical: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 2,
    paddingVertical: 2,
  },
  labelContainerVerticalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  labelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "monospace",
    marginRight: 8,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  labelTextTruncated: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "monospace",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  valueTextVertical: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#D1D5DB",
    paddingLeft: 16,
  },
  valueText: {
    fontSize: 12,
    fontFamily: "monospace",
    flex: 1,
    color: "#D1D5DB",
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  noDataContainer: {
    padding: 16,
    alignItems: "center",
  },
  noDataText: {
    color: "#9CA3AF",
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

// ============================================================================
// SECTION 4: TYPE UTILITIES (Pure Functions)
// ============================================================================

/**
 * Detects the type of a value for display purposes
 * PURE FUNCTION - No side effects
 */
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

/**
 * Gets the count of items in a collection
 * PURE FUNCTION - No side effects
 */
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

/**
 * Checks if a value is expandable (has children)
 * PURE FUNCTION - No side effects
 */
const isExpandableType = (valueType: string): boolean => {
  return ["object", "array", "map", "set"].includes(valueType);
};

// ============================================================================
// SECTION 5: FORMATTING UTILITIES (Pure Functions)
// ============================================================================

/**
 * Formats a value for display based on its type
 * PURE FUNCTION - No side effects
 */
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

// ============================================================================
// SECTION 6: COLOR MAPPING (Pure Functions)
// ============================================================================

// Type color cache for performance [[memory:4875251]]
const TYPE_COLOR_CACHE = new Map([
  ["string", "#22D3EE"],
  ["number", "#3B82F6"],
  ["bigint", "#8B5CF6"],
  ["boolean", "#F59E0B"],
  ["null", "#6B7280"],
  ["undefined", "#9CA3AF"],
  ["function", "#A855F7"],
  ["symbol", "#D946EF"],
  ["date", "#EC4899"],
  ["error", "#EF4444"],
  ["array", "#10B981"],
  ["object", "#F97316"],
  ["map", "#06B6D4"],
  ["set", "#84CC16"],
  ["circular", "#F59E0B"],
]);

/**
 * Gets the color for a value type
 * PURE FUNCTION - No side effects
 */
const getTypeColor = (valueType: string): string => {
  return TYPE_COLOR_CACHE.get(valueType) || "#10B981";
};

// ============================================================================
// SECTION 7: DATA PROCESSING UTILITIES (Pure Functions with Impure Wrapper)
// ============================================================================

/**
 * Builds a path array for an item
 * PURE FUNCTION - No side effects
 */
const buildPath = (parentPath: string[], key: string): string[] => {
  return [...parentPath, key];
};

/**
 * Builds an ID from a path
 * PURE FUNCTION - No side effects
 */
const buildId = (path: string[]): string => {
  return path.join(".");
};

/**
 * Creates a FlatDataItem
 * PURE FUNCTION - No side effects
 */
const createFlatDataItem = (
  id: string,
  key: string,
  value: JsonValue,
  valueType: string,
  depth: number,
  parentId: string | undefined,
  path: string[],
  expandedItems: Set<string>,
  childCount: number
): FlatDataItem => {
  const expandable = isExpandableType(valueType) && value !== null;
  
  return {
    id,
    key,
    value,
    valueType,
    depth,
    isExpandable: expandable,
    isExpanded: expandedItems.has(id),
    parentId,
    hasChildren: childCount > 0,
    childCount,
    path,
    type: expandable ? "expandable" : valueType,
  };
};

/**
 * Gets entries from a value based on its type
 * PURE FUNCTION - No side effects
 */
const getValueEntries = (value: JsonValue, valueType: string): [string, JsonValue][] => {
  switch (valueType) {
    case "array":
      return Array.isArray(value)
        ? value.map((item, index): [string, JsonValue] => [index.toString(), item])
        : [];
    case "object":
      return typeof value === "object" &&
        value !== null &&
        !(value instanceof Date) &&
        !(value instanceof Error) &&
        !(value instanceof RegExp) &&
        !(value instanceof Map) &&
        !(value instanceof Set)
        ? Object.entries(value)
        : [];
    case "map":
      return value instanceof Map
        ? Array.from(value.entries()).map(([k, v]) => [String(k), v as JsonValue])
        : [];
    case "set":
      return value instanceof Set
        ? Array.from(value.values()).map((v, index) => [index.toString(), v as JsonValue])
        : [];
    default:
      return [];
  }
};

// ============================================================================
// SECTION 8: CIRCULAR REFERENCE DETECTION
// ============================================================================

/**
 * Checks if a value is a circular reference
 * IMPURE - Modifies WeakSet
 */
const checkCircularReference = (
  value: JsonValue,
  circularCache: WeakSet<object>
): boolean => {
  if (value && typeof value === "object") {
    if (circularCache.has(value)) {
      return true;
    }
    circularCache.add(value);
  }
  return false;
};

/**
 * Creates a circular reference item
 * PURE FUNCTION - No side effects
 */
const createCircularReferenceItem = (
  id: string,
  key: string,
  depth: number,
  parentId: string | undefined,
  path: string[]
): FlatDataItem => {
  return {
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
    path,
    type: "circular",
  };
};

// ============================================================================
// SECTION 9: DATA FLATTENING LOGIC (Core Processing)
// ============================================================================

/**
 * Main data flattening function
 * IMPURE - Uses circularCache
 */
const flattenData = (
  value: JsonValue,
  key: string = "root",
  depth: number = 0,
  parentId: string | undefined = undefined,
  path: string[] = [],
  expandedItems: Set<string>,
  maxDepth: number,
  circularCache: WeakSet<object>
): FlatDataItem[] => {
  // Check depth limit
  if (depth > Math.min(maxDepth, MAX_DEPTH_LIMIT)) {
    return [];
  }

  // Build path and ID
  const currentPath = buildPath(path, key);
  const id = buildId(currentPath);
  
  // Get value information
  const valueType = getValueType(value);
  
  // Skip circular reference check for performance
  // if (checkCircularReference(value, circularCache)) {
  //   return [createCircularReferenceItem(id, key, depth, parentId, currentPath)];
  // }
  
  // Calculate child count
  const rawChildCount = isExpandableType(valueType) ? getValueCount(value, valueType) : 0;
  const childCount = Math.min(rawChildCount, MAX_ITEMS_PER_LEVEL);
  
  // Create current item
  const currentItem = createFlatDataItem(
    id,
    key,
    value,
    valueType,
    depth,
    parentId,
    currentPath,
    expandedItems,
    childCount
  );
  
  const result = [currentItem];
  
  // Process children if expanded
  if (
    currentItem.isExpandable &&
    currentItem.isExpanded &&
    depth < Math.min(maxDepth, MAX_DEPTH_LIMIT)
  ) {
    const children = processChildren(
      value,
      valueType,
      depth,
      id,
      currentPath,
      expandedItems,
      maxDepth,
      childCount,
      circularCache
    );
    result.push(...children);
  }
  
  return result;
};

/**
 * Processes children of an expandable value
 * IMPURE - Calls flattenData recursively
 */
const processChildren = (
  value: JsonValue,
  valueType: string,
  depth: number,
  parentId: string,
  parentPath: string[],
  expandedItems: Set<string>,
  maxDepth: number,
  childLimit: number,
  circularCache: WeakSet<object>
): FlatDataItem[] => {
  const result: FlatDataItem[] = [];
  
  try {
    const entries = getValueEntries(value, valueType);
    const limitedEntries = entries.slice(0, childLimit);
    
    // Process all at once for performance (no chunking)
    for (const [childKey, childValue] of limitedEntries) {
      const childItems = flattenData(
        childValue,
        childKey,
        depth + 1,
        parentId,
        parentPath,
        expandedItems,
        maxDepth,
        circularCache
      );
      result.push(...childItems);
    }
  } catch (error) {
    console.warn("Error processing children:", error);
  }
  
  return result;
};

// ============================================================================
// SECTION 10: STATE MANAGEMENT HOOKS
// ============================================================================

/**
 * Manages expanded items state
 * CUSTOM HOOK - Encapsulates expanded state logic
 */
const useExpandedItems = (data: JsonValue, autoExpandFirstLevel: boolean, fullyExpanded: boolean = false) => {
  const getInitialExpanded = useCallback(() => {
    const initial = new Set(["root"]);
    
    if (fullyExpanded) {
      // Expand everything for performance testing
      const expandAll = (obj: JsonValue, path: string = "root"): void => {
        initial.add(path);
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              const itemPath = `${path}.${index}`;
              initial.add(itemPath);
              expandAll(item, itemPath);
            });
          } else {
            Object.entries(obj).forEach(([key, value]) => {
              const itemPath = `${path}.${key}`;
              initial.add(itemPath);
              expandAll(value, itemPath);
            });
          }
        }
      };
      expandAll(data);
    } else if (autoExpandFirstLevel && data && typeof data === 'object') {
      if (Array.isArray(data)) {
        data.forEach((_, index) => {
          initial.add(`root.${index}`);
        });
      } else {
        Object.keys(data).forEach(key => {
          initial.add(`root.${key}`);
        });
      }
    }
    
    return initial;
  }, [autoExpandFirstLevel, fullyExpanded, data]);
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => getInitialExpanded());
  
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  return { expandedItems, toggleExpanded };
};

/**
 * Manages data flattening process
 * CUSTOM HOOK - Encapsulates flattening logic
 */
const useDataFlattening = (
  data: JsonValue,
  maxDepth: number = 10,
  autoExpandFirstLevel: boolean = false,
  fullyExpanded: boolean = false
) => {
  const [flatData, setFlatData] = useState<FlatDataItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { expandedItems, toggleExpanded } = useExpandedItems(data, autoExpandFirstLevel, fullyExpanded);
  const circularCache = useRef(new WeakSet());
  
  // Process data when it changes or expanded items change
  useEffect(() => {
    let isCancelled = false;
    setIsProcessing(true);
    
    const processData = () => {
      InteractionManager.runAfterInteractions(() => {
        if (isCancelled) return;
        
        try {
          // Reset circular cache
          circularCache.current = new WeakSet();
          
          // Flatten data
          const newFlatData = flattenData(
            data,
            "root",
            0,
            undefined,
            [],
            expandedItems,
            maxDepth,
            circularCache.current
          );
          
          if (!isCancelled) {
            setFlatData(newFlatData);
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("Error flattening data:", error);
          if (!isCancelled) {
            setFlatData([]);
            setIsProcessing(false);
          }
        }
      });
    };
    
    processData();
    
    return () => {
      isCancelled = true;
    };
  }, [data, expandedItems, maxDepth]);
  
  return { flatData, isProcessing, toggleExpanded };
};

// ============================================================================
// SECTION 11: UI COMPONENTS (Presentational)
// ============================================================================

/**
 * Expander arrow component
 * PRESENTATIONAL COMPONENT - Pure UI
 */
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
            stroke="#9CA3AF"
            fill="none"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  )
);

/**
 * Type legend component
 * PRESENTATIONAL COMPONENT - Pure UI
 */
const TypeLegend = React.memo(
  ({ visibleTypes }: { visibleTypes: string[] }) => {
    const uniqueTypes = Array.from(new Set(visibleTypes)).slice(0, 8);
    
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
  }
);

/**
 * Tree lines component
 * PRESENTATIONAL COMPONENT - Pure UI
 */
const TreeLines = React.memo(({ depth }: { depth: number }) => {
  if (depth === 0) return null;
  
  return (
    <>
      <View
        style={{
          position: "absolute",
          left: -10,
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: -10,
          top: 10,
          width: 10,
          height: 1,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        }}
      />
    </>
  );
});

/**
 * Item content renderer
 * PRESENTATIONAL COMPONENT - Renders key-value pairs
 */
const ItemContent = React.memo(
  ({ item, isLongKey }: { item: FlatDataItem; isLongKey: boolean }) => {
    const color = getTypeColor(item.valueType);
    
    if (isLongKey) {
      return (
        <View style={STABLE_STYLES.labelContainerVertical}>
          <View style={STABLE_STYLES.labelContainerVerticalRow}>
            <Text style={STABLE_STYLES.labelTextTruncated} numberOfLines={undefined}>
              {item.key}:
            </Text>
          </View>
          {item.isExpandable ? (
            <Text style={[STABLE_STYLES.valueTextVertical, { color: "#9CA3AF" }]}>
              {item.valueType} ({item.childCount} {item.childCount === 1 ? "item" : "items"})
            </Text>
          ) : (
            <Text style={[STABLE_STYLES.valueTextVertical, { color }]}>
              {formatValue(item.value, item.valueType)}
            </Text>
          )}
        </View>
      );
    }
    
    return (
      <View style={STABLE_STYLES.labelContainer}>
        <Text style={STABLE_STYLES.labelText} numberOfLines={undefined}>
          {item.key}:
        </Text>
        {item.isExpandable ? (
          <Text style={[STABLE_STYLES.valueText, { color: "#9CA3AF" }]}>
            {item.valueType} ({item.childCount} {item.childCount === 1 ? "item" : "items"})
          </Text>
        ) : (
          <Text style={[STABLE_STYLES.valueText, { color }]}>
            {formatValue(item.value, item.valueType)}
          </Text>
        )}
      </View>
    );
  }
);

/**
 * Virtualized item component
 * CONTAINER COMPONENT - Manages item interaction
 */
const VirtualizedItem = React.memo(
  ({
    item,
    onToggleExpanded,
  }: {
    item: FlatDataItem;
    onToggleExpanded: (id: string) => void;
  }) => {
    const [isPressed, setIsPressed] = useState(false);
    
    // Get indent style
    const indentStyle = INDENT_STYLES[Math.min(item.depth, MAX_DEPTH_LIMIT)] || INDENT_STYLES[0];
    
    // Check if key is long
    const isLongKey = item.key.length > LONG_KEY_THRESHOLD;
    
    // Handle press
    const handlePress = () => {
      if (item.isExpandable) {
        onToggleExpanded(item.id);
      }
    };
    
    return (
      <View style={[STABLE_STYLES.itemContainer, indentStyle]}>
        <TreeLines depth={item.depth} />
        
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
          
          <ItemContent item={item} isLongKey={isLongKey} />
        </TouchableOpacity>
      </View>
    );
  },
  // Custom comparison - only re-render if these specific props change
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.isExpanded === nextProps.item.isExpanded &&
      prevProps.item.value === nextProps.item.value &&
      prevProps.onToggleExpanded === nextProps.onToggleExpanded
    );
  }
);

// ============================================================================
// SECTION 12: MAIN COMPONENT
// ============================================================================

/**
 * Main VirtualizedDataExplorer component
 * CONTAINER COMPONENT - Orchestrates the entire data explorer
 */
export const VirtualizedDataExplorer: React.FC<VirtualizedDataExplorerProps> = ({
  title,
  description,
  data,
  maxDepth = 10,
  rawMode = false,
  initialExpanded = false,
  fullyExpanded = false,
}) => {
  // State management
  const [isExpanded, setIsExpanded] = useState(rawMode || fullyExpanded);
  const { flatData, isProcessing, toggleExpanded } = useDataFlattening(
    data,
    maxDepth,
    initialExpanded,
    fullyExpanded
  );
  
  // Calculate visible types
  const visibleTypes = useMemo(() => {
    return flatData.map((item) => item.valueType);
  }, [flatData]);
  
  // Calculate average item size for FlashList
  const averageItemSize = useMemo(() => {
    const longKeyCount = flatData.filter(
      (item) => item.key.length > LONG_KEY_THRESHOLD
    ).length;
    const normalKeyCount = flatData.length - longKeyCount;
    
    if (flatData.length === 0) return ITEM_HEIGHT;
    
    const totalHeight = longKeyCount * LONG_ITEM_HEIGHT + normalKeyCount * ITEM_HEIGHT;
    return Math.round(totalHeight / flatData.length);
  }, [flatData]);
  
  // Check if we have data
  const hasData = data &&
    (typeof data === "object" || Array.isArray(data)) &&
    (Array.isArray(data) ? data.length > 0 : Object.keys(data as object).length > 0);
  
  // Render functions - memoized for performance
  const renderItem = useCallback(({ item }: { item: FlatDataItem }) => (
    <VirtualizedItem item={item} onToggleExpanded={toggleExpanded} />
  ), [toggleExpanded]);
  
  const keyExtractor = useCallback((item: FlatDataItem) => item.id, []);
  
  const toggleMainExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Render raw mode
  if (rawMode) {
    if (!hasData) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={STABLE_STYLES.noDataText}>No data available</Text>
        </View>
      );
    }
    
    return (
      <View style={{ flex: 1 }}>
        {isProcessing ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={STABLE_STYLES.loadingText}>Processing data...</Text>
          </View>
        ) : (
          <FlashList
            sentry-label="ignore devtools data explorer list"
            data={flatData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={averageItemSize}
            getItemType={(item) => item.type}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={STABLE_STYLES.listContent}
          />
        )}
      </View>
    );
  }
  
  // Render standard mode with no data
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
  
  // Render standard mode with data
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
              <Text style={STABLE_STYLES.loadingText}>Processing data...</Text>
            </View>
          ) : (
            <View style={{ height: Math.min(flatData.length * averageItemSize, 400) }}>
              <FlashList
                sentry-label="ignore devtools data explorer collapsed list"
                data={flatData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={averageItemSize}
                getItemType={(item) => item.type}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={STABLE_STYLES.listContent}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

// ============================================================================
// END OF REFACTORED VIRTUALIZEDDATAEXPLORER
// ============================================================================