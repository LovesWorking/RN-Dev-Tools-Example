import React, { useState, useMemo, useCallback, useRef } from "react";
import { JsonValue } from "../../types/types";
import { Query, QueryKey, useQueryClient } from "@tanstack/react-query";
import { updateNestedDataByPath } from "../../utils/updateNestedDataByPath";
import { displayValue } from "../../../../_shared/utils/displayValue";
import deleteItem from "../../utils/actions/deleteItem";
import Svg, { Path } from "react-native-svg";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { copyToClipboard } from "../../../../_shared/clipboard/copyToClipboard";
import { CyberpunkInput } from "../shared/CyberpunkInput";

// Stable constants to prevent re-renders [[memory:4875251]]
const CHUNK_SIZE = 100;
const HIT_SLOP_OPTIMIZED = { top: 8, bottom: 8, left: 8, right: 8 };

const EXPANDER_SIZE = 14;

// Optimized chunking function moved to module scope [[memory:4875251]]
const chunkArray = <T extends { label: string; value: JsonValue }>(
  array: T[],
  size: number = CHUNK_SIZE
): T[][] => {
  if (size < 1 || array.length === 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
// Memoized Expander component for performance [[memory:4875251]]
const Expander = React.memo(
  ({
    expanded,
    isFocused = false,
  }: {
    expanded: boolean;
    isFocused?: boolean;
  }) => {
    return (
      <View
        style={[
          styles.expanderIcon,
          expanded ? styles.expanded : styles.collapsed,
        ]}
      >
        <Svg
          width={EXPANDER_SIZE}
          height={EXPANDER_SIZE}
          viewBox="0 0 24 24"
          fill="none"
        >
          <Path
            d={expanded ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"}
            stroke={isFocused ? "#00FFFF" : "#9CA3AF"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }
);
type CopyState = "NoCopy" | "SuccessCopy" | "ErrorCopy";

// Memoized CopyButton component optimized with ref pattern [[memory:4875251]]
const CopyButton = React.memo(
  ({ value, isFocused = false }: { value: JsonValue; isFocused?: boolean }) => {
    const [copyState, setCopyState] = useState<CopyState>("NoCopy");
    const valueRef = useRef(value);
    valueRef.current = value;

    const handleCopy = useCallback(async () => {
      try {
        // Use ref to avoid stale closures [[memory:4875251]]
        const copied = await copyToClipboard(valueRef.current);
        if (copied) {
          setCopyState("SuccessCopy");
          setTimeout(() => setCopyState("NoCopy"), 1500);
        } else {
          setCopyState("ErrorCopy");
          setTimeout(() => setCopyState("NoCopy"), 1500);
        }
      } catch (error) {
        console.error("Copy failed:", error);
        setCopyState("ErrorCopy");
        setTimeout(() => setCopyState("NoCopy"), 1500);
      }
    }, []); // No dependencies needed anymore

    return (
      <TouchableOpacity
        sentry-label="ignore devtools copy button"
        style={[styles.buttonStyle, isFocused && styles.buttonStyleFocused]}
        aria-label={
          copyState === "NoCopy"
            ? "Copy object to clipboard"
            : copyState === "SuccessCopy"
            ? "Object copied to clipboard"
            : "Error copying object to clipboard"
        }
        onPress={copyState === "NoCopy" ? handleCopy : undefined}
        hitSlop={HIT_SLOP_OPTIMIZED}
        activeOpacity={0.7}
      >
        {copyState === "NoCopy" && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              stroke={isFocused ? "#06B6D4" : "#64748B"}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
        {copyState === "SuccessCopy" && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 11l3 3 8-8"
              stroke="#10B981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M20 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h9"
              stroke="#10B981"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
        {copyState === "ErrorCopy" && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"
              stroke="#EF4444"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>
    );
  }
);

// Memoized DeleteItemButton component [[memory:4875251]]
const DeleteItemButton = React.memo(
  ({
    dataPath,
    activeQuery,
    isFocused = false,
  }: {
    dataPath: string[];
    activeQuery: Query<unknown, Error, unknown, QueryKey> | undefined;
    isFocused?: boolean;
  }) => {
    const queryClient = useQueryClient();
    const dataPathRef = useRef(dataPath);
    const activeQueryRef = useRef(activeQuery);
    dataPathRef.current = dataPath;
    activeQueryRef.current = activeQuery;

    const handleDelete = useCallback(() => {
      if (!activeQueryRef.current) return;
      deleteItem({
        queryClient,
        activeQuery: activeQueryRef.current,
        dataPath: dataPathRef.current,
      });
    }, [queryClient]);

    if (!activeQuery) return null;

    return (
      <TouchableOpacity
        sentry-label="ignore devtools explorer delete button"
        onPress={handleDelete}
        style={[styles.deleteButton, isFocused && styles.deleteButtonFocused]}
        accessibilityLabel="Delete item"
        hitSlop={HIT_SLOP_OPTIMIZED}
        activeOpacity={0.7}
      >
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 3h6M3 6h18m-2 0l-.701 10.52c-.105 1.578-.158 2.367-.499 2.965a3 3 0 01-1.298 1.215c-.62.3-1.41.3-2.993.3h-3.018c-1.582 0-2.373 0-2.993-.3A3 3 0 016.2 19.485c-.34-.598-.394-1.387-.499-2.966L5 6m5 4.5v5m4-5v5"
            stroke={isFocused ? "#06B6D4" : "#64748B"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    );
  }
);
// Memoized ClearArrayButton component [[memory:4875251]]
const ClearArrayButton = React.memo(
  ({
    dataPath,
    activeQuery,
    isFocused = false,
  }: {
    dataPath: string[];
    activeQuery: Query<unknown, Error, unknown, QueryKey> | undefined;
    isFocused?: boolean;
  }) => {
    const queryClient = useQueryClient();
    const dataPathRef = useRef(dataPath);
    const activeQueryRef = useRef(activeQuery);
    dataPathRef.current = dataPath;
    activeQueryRef.current = activeQuery;

    const handleClear = useCallback(() => {
      if (!activeQueryRef.current) return;
      const oldData = activeQueryRef.current.state.data as unknown as JsonValue;
      const newData = updateNestedDataByPath(oldData, dataPathRef.current, []);
      queryClient.setQueryData(activeQueryRef.current.queryKey, newData);
    }, [queryClient]);

    if (!activeQuery) return null;

    return (
      <TouchableOpacity
        sentry-label="ignore devtools explorer clear button"
        style={[styles.clearButton, isFocused && styles.clearButtonFocused]}
        aria-label="Remove all items"
        onPress={handleClear}
        hitSlop={HIT_SLOP_OPTIMIZED}
        activeOpacity={0.7}
      >
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 10H7m14-6H7m14 12H7m14 6H7M3 10h.01M3 6h.01M3 14h.01M3 18h.01"
            stroke={isFocused ? "#06B6D4" : "#64748B"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    );
  }
);
// Memoized ToggleValueButton with pre-computed styles [[memory:4875251]]
const ToggleValueButton = React.memo(
  ({
    dataPath,
    activeQuery,
    value,
  }: {
    dataPath: string[];
    activeQuery: Query<unknown, Error, unknown, QueryKey> | undefined;
    value: JsonValue;
  }) => {
    const queryClient = useQueryClient();
    const dataPathRef = useRef(dataPath);
    const activeQueryRef = useRef(activeQuery);
    const valueRef = useRef(value);
    dataPathRef.current = dataPath;
    activeQueryRef.current = activeQuery;
    valueRef.current = value;

    const handleClick = useCallback(() => {
      if (!activeQueryRef.current) return;
      const oldData = activeQueryRef.current.state.data as unknown as JsonValue;
      const currentValue =
        typeof valueRef.current === "boolean" ? valueRef.current : false;
      const newData = updateNestedDataByPath(
        oldData,
        dataPathRef.current,
        !currentValue
      );
      queryClient.setQueryData(activeQueryRef.current.queryKey, newData);
    }, [queryClient]);

    if (!activeQuery) return null;

    // Pre-compute styles based on value state [[memory:4875251]]
    const iconStyle = value ? styles.toggleIconTrue : styles.toggleIconFalse;
    const badgeStyle = value ? styles.toggleBadgeTrue : styles.toggleBadgeFalse;
    const textStyle = value ? styles.toggleTextTrue : styles.toggleTextFalse;

    return (
      <TouchableOpacity
        sentry-label="ignore devtools explorer toggle button"
        style={styles.modernToggleButton}
        onPress={handleClick}
        hitSlop={HIT_SLOP_OPTIMIZED}
        activeOpacity={0.8}
      >
        <View style={styles.toggleIconContainer}>
          <View style={[styles.toggleIconSmall, iconStyle]} />
        </View>
        <View style={styles.toggleContent}>
          <Text style={styles.toggleLabel}>{displayValue(value)}</Text>
        </View>
        <View style={[styles.toggleBadge, badgeStyle]}>
          <Text style={[styles.toggleBadgeText, textStyle]}>
            {value ? "TRUE" : "FALSE"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);
type Props = {
  editable?: boolean;
  label: string;
  value: JsonValue;
  defaultExpanded?: string[];
  activeQuery?: Query<unknown, Error, unknown, QueryKey> | undefined;
  dataPath?: string[];
  itemsDeletable?: boolean;
};
// Optimized Explorer component following rule2 guidelines [[memory:4875251]]
export default function Explorer({
  editable,
  label,
  value,
  defaultExpanded,
  activeQuery,
  dataPath,
  itemsDeletable,
}: Props) {
  const queryClient = useQueryClient();
  const [isRowFocused, setIsRowFocused] = useState(false);

  // Determine if this is a main section
  const isMainSection = useMemo(() => {
    const upperLabel = label.toUpperCase();
    return [
      "DATA",
      "QUERY",
      "QUERYKEY",
      "TYPES",
      "STATS",
      "OPTIONS",
      "OBSERVERS",
    ].includes(upperLabel);
  }, [label]);

  // Explorer's section is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(
    (defaultExpanded || []).includes(label)
  );
  // Remove unnecessary useCallback - simple state setter [[memory:4875251]]
  const toggleExpanded = () => setIsExpanded((old) => !old);
  const [expandedPages, setExpandedPages] = useState<number[]>([]);

  // Optimized subEntries computation with early returns and limited processing [[memory:4875251]]
  const subEntries = useMemo(() => {
    // Early return for primitive values to avoid unnecessary computation
    if (value === null || value === undefined || typeof value !== "object") {
      return [];
    }

    if (Array.isArray(value)) {
      // Limit array processing for performance [[memory:4875251]]
      const limitedValue = (
        value.length > 1000 ? value.slice(0, 1000) : value
      ) as JsonValue[];
      return limitedValue.map(
        (d: JsonValue, i): { label: string; value: JsonValue } => ({
          label: i.toString(),
          value: d,
        })
      );
    }

    if (value instanceof Map) {
      // Limit Map entries for performance
      const entries = Array.from(value.entries()).slice(0, 1000);
      return entries.map(([key, val]): { label: string; value: JsonValue } => ({
        label: key.toString(),
        value: val,
      }));
    }

    if (value instanceof Set) {
      // Limit Set entries for performance
      const entries = Array.from(value).slice(0, 1000);
      return entries.map((val, i): { label: string; value: JsonValue } => ({
        label: i.toString(),
        value: val,
      }));
    }

    // Handle regular objects with key limiting
    const entries = Object.entries(value as Record<string, JsonValue>).slice(
      0,
      1000
    );
    return entries.map(([key, val]): { label: string; value: JsonValue } => ({
      label: key,
      value: val,
    }));
  }, [value]);

  // Optimized valueType computation with early returns [[memory:4875251]]
  const valueType = useMemo(() => {
    if (Array.isArray(value)) return "array";
    if (value === null || typeof value !== "object") return typeof value;
    if (value instanceof Map || value instanceof Set) return "Iterable";
    return "object";
  }, [value]);

  // Optimized chunking with stable chunk size [[memory:4875251]]
  const subEntryPages = useMemo(() => {
    return chunkArray(subEntries, CHUNK_SIZE);
  }, [subEntries]);

  const currentDataPath = dataPath ?? [];

  // Optimize handleChange using refs to avoid dependency arrays [[memory:4875251]]
  const activeQueryRef = useRef(activeQuery);
  const dataPathRef = useRef(currentDataPath);
  const valueTypeRef = useRef(valueType);
  activeQueryRef.current = activeQuery;
  dataPathRef.current = currentDataPath;
  valueTypeRef.current = valueType;

  const handleChange = useCallback(
    (isNumber: boolean, newValue: string) => {
      if (!activeQueryRef.current) return;
      const oldData = activeQueryRef.current.state.data as unknown as JsonValue;
      if (isNumber && isNaN(Number(newValue))) return;
      const updatedValue =
        valueTypeRef.current === "number" ? Number(newValue) : newValue;
      const newData = updateNestedDataByPath(
        oldData,
        dataPathRef.current,
        updatedValue
      );
      queryClient.setQueryData(activeQueryRef.current.queryKey, newData);
    },
    [queryClient]
  );

  return (
    <View style={styles.minWidthWrapper}>
      <View style={styles.fullWidthMarginRight}>
        {subEntryPages.length > 0 && (
          <>
            <View
              style={[
                styles.flexRowItemsCenterGap,
                isMainSection && styles.flexRowItemsCenterGapMain,
              ]}
            >
              <TouchableOpacity
                sentry-label="ignore devtools explorer expander button"
                style={styles.expanderButton}
                onPress={toggleExpanded}
                hitSlop={HIT_SLOP_OPTIMIZED}
                activeOpacity={0.6}
              >
                <Expander expanded={isExpanded} isFocused={isRowFocused} />
                <Text
                  style={[
                    styles.labelText,
                    isRowFocused && styles.labelTextFocused,
                    isMainSection && styles.labelTextMain,
                  ]}
                >
                  {label.toUpperCase()}
                </Text>
                <Text style={styles.textGray500}>{`${
                  String(valueType).toLowerCase() === "iterable"
                    ? "(Iterable) "
                    : ""
                }${subEntries.length} ${
                  subEntries.length > 1 ? `items` : `item`
                }`}</Text>
              </TouchableOpacity>
              {editable && (
                <View style={styles.flexRowGapItemsCenter}>
                  <CopyButton value={value} isFocused={isRowFocused} />
                  {itemsDeletable && activeQuery !== undefined && (
                    <DeleteItemButton
                      activeQuery={activeQuery}
                      dataPath={currentDataPath}
                      isFocused={isRowFocused}
                    />
                  )}
                  {valueType === "array" && activeQuery !== undefined && (
                    <ClearArrayButton
                      activeQuery={activeQuery}
                      dataPath={currentDataPath}
                      isFocused={isRowFocused}
                    />
                  )}
                </View>
              )}
            </View>
            {isExpanded && (
              <>
                {subEntryPages.length === 1 && (
                  <View
                    style={[
                      styles.singleEntryContainer,
                      isMainSection && styles.singleEntryContainerMain,
                    ]}
                  >
                    {subEntries.map((entry, index) => (
                      <Explorer
                        key={entry.label + index}
                        defaultExpanded={defaultExpanded}
                        label={entry.label}
                        value={entry.value}
                        editable={editable}
                        dataPath={[...currentDataPath, entry.label]}
                        activeQuery={activeQuery}
                        itemsDeletable={
                          valueType === "array" ||
                          valueType === "Iterable" ||
                          valueType === "object"
                        }
                      />
                    ))}
                  </View>
                )}
                {subEntryPages.length > 1 && (
                  <View style={styles.multiEntryContainer}>
                    {subEntryPages.map((entries, index) => (
                      <View key={index}>
                        <View style={styles.relativeOutlineNone}>
                          <TouchableOpacity
                            sentry-label="ignore devtools explorer page toggle"
                            onPress={() =>
                              setExpandedPages((old) =>
                                old.includes(index)
                                  ? old.filter((d) => d !== index)
                                  : [...old, index]
                              )
                            }
                            style={styles.pageExpanderButton}
                            hitSlop={HIT_SLOP_OPTIMIZED}
                          >
                            <Expander
                              expanded={expandedPages.includes(index)}
                            />
                            <Text style={styles.pageRangeText}>
                              [{index * CHUNK_SIZE}...
                              {index * CHUNK_SIZE + CHUNK_SIZE - 1}]
                            </Text>
                          </TouchableOpacity>
                          {expandedPages.includes(index) && (
                            <View style={styles.entriesContainer}>
                              {entries.map((entry) => (
                                <Explorer
                                  key={entry.label}
                                  defaultExpanded={defaultExpanded}
                                  label={entry.label}
                                  value={entry.value}
                                  editable={editable}
                                  dataPath={[...currentDataPath, entry.label]}
                                  activeQuery={activeQuery}
                                />
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}
        {subEntryPages.length === 0 && (
          <View style={styles.flexRowGapFullWidth}>
            {editable &&
            activeQuery !== undefined &&
            (valueType === "string" ||
              valueType === "number" ||
              valueType === "boolean") ? (
              <>
                {editable &&
                  activeQuery &&
                  (valueType === "string" || valueType === "number") && (
                    <View style={styles.nebulaInputWrapper}>
                      <CyberpunkInput
                        label={label}
                        accessibilityLabel="Data input field for editing values"
                        style={[
                          valueType === "number"
                            ? styles.textNumber
                            : styles.textString,
                        ]}
                        keyboardType={
                          valueType === "number" ? "numeric" : "default"
                        }
                        value={
                          value === null || value === undefined
                            ? ""
                            : value.toString()
                        }
                        onChangeText={(newValue) =>
                          handleChange(valueType === "number", newValue)
                        }
                        onFocus={() => setIsRowFocused(true)}
                        onBlur={() => setIsRowFocused(false)}
                        showNumberControls={valueType === "number"}
                        onIncrement={() =>
                          handleChange(
                            true,
                            String(typeof value === "number" ? value + 1 : 1)
                          )
                        }
                        onDecrement={() =>
                          handleChange(
                            true,
                            String(typeof value === "number" ? value - 1 : -1)
                          )
                        }
                        showDeleteButton={itemsDeletable}
                        onDelete={() => {
                          deleteItem({
                            queryClient,
                            activeQuery,
                            dataPath: currentDataPath,
                          });
                        }}
                      />
                    </View>
                  )}
                {valueType === "boolean" && (
                  <ToggleValueButton
                    activeQuery={activeQuery}
                    dataPath={currentDataPath}
                    value={value}
                  />
                )}
              </>
            ) : (
              <>
                <Text style={styles.text344054}>{label.toUpperCase()}</Text>
                <Text style={styles.displayValueText}>
                  {displayValue(value)}
                </Text>
              </>
            )}
            {editable &&
              itemsDeletable &&
              activeQuery !== undefined &&
              valueType !== "string" &&
              valueType !== "number" && (
                <DeleteItemButton
                  activeQuery={activeQuery}
                  dataPath={currentDataPath}
                  isFocused={isRowFocused}
                />
              )}
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "rgba(50, 50, 50, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.6)",
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    position: "relative",
  },
  buttonStyleFocused: {
    borderColor: "rgba(0, 255, 255, 0.6)",
    backgroundColor: "rgba(0, 255, 255, 0.05)",
  },
  deleteButton: {
    backgroundColor: "rgba(0, 255, 255, 0.05)",
    borderColor: "rgba(0, 255, 255, 0.2)",
    borderWidth: 1,
    borderRadius: 3,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    position: "relative",
  },
  deleteButtonFocused: {
    borderColor: "rgba(0, 255, 255, 0.6)",
    backgroundColor: "rgba(0, 255, 255, 0.1)",
  },
  clearButton: {
    backgroundColor: "rgba(50, 50, 50, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.6)",
    borderRadius: 3,
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    position: "relative",
    zIndex: 10,
  },
  clearButtonFocused: {
    borderColor: "rgba(0, 255, 255, 0.6)",
    backgroundColor: "rgba(0, 255, 255, 0.05)",
  },
  expanderIcon: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  expanded: {
    transform: [{ rotate: "0deg" }],
  },
  collapsed: {
    transform: [{ rotate: "0deg" }],
  },
  minWidthWrapper: {
    minWidth: 200,
    fontSize: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginVertical: 1,
  },
  fullWidthMarginRight: {
    position: "relative",
    width: "100%",
    marginRight: 1,
  },
  flexRowItemsCenterGap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 1,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  flexRowItemsCenterGapMain: {
    backgroundColor: "rgba(20, 20, 25, 0.4)",
    borderLeftWidth: 2,
    borderLeftColor: "rgba(148, 163, 184, 0.3)",
  },
  expanderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 6,
    borderWidth: 0,
    minHeight: 28,
  },
  labelText: {
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "600",
    marginRight: 6,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  labelTextFocused: {
    color: "#00FFFF",
  },
  labelTextMain: {
    color: "#CBD5E1",
    fontSize: 11,
  },
  textGray500: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "monospace",
  },
  pageRangeText: {
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  flexRowGapItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 4,
  },
  singleEntryContainer: {
    marginLeft: 4,
    marginTop: 2,
    paddingLeft: 4,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(100, 100, 100, 0.3)",
  },
  singleEntryContainerMain: {
    borderLeftColor: "rgba(148, 163, 184, 0.25)",
  },
  multiEntryContainer: {
    marginLeft: 4,
    marginTop: 2,
    paddingLeft: 4,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(100, 100, 100, 0.3)",
  },
  multiEntryContainerMain: {
    borderLeftColor: "rgba(148, 163, 184, 0.25)",
  },
  relativeOutlineNone: {
    position: "relative",
  },
  pageExpanderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
    borderRadius: 4,
    borderWidth: 0,
    marginBottom: 4,
    minHeight: 28,
  },
  entriesContainer: {
    marginLeft: 4,
    paddingLeft: 4,
    marginTop: 2,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(100, 100, 100, 0.3)",
  },
  textNumber: {
    color: "#60A5FA",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  textString: {
    color: "#E5E7EB",
    fontFamily: "monospace",
  },
  flexRowGapFullWidth: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginVertical: 2,
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  text344054: {
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 10,
    minWidth: 60,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  numberInputButtons: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -18 }],
    flexDirection: "row",
    gap: 4,
    zIndex: 10,
  },
  touchableButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(107, 114, 128, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  touchableButtonFocused: {
    borderColor: "#00FFFF",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  nebulaInputWrapper: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  displayValueText: {
    flex: 1,
    color: "#E5E5E5",
    fontWeight: "400",
    fontFamily: "monospace",
    fontSize: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.6)",
    minHeight: 34,
  },
  // New redesigned styles (kept for future use)
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 44,
    gap: 12,
  },
  dataLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
    minWidth: 80,
    flexShrink: 0,
  },
  dataValueContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithActions: {
    flex: 1,
    position: "relative",
  },
  numberControls: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -16 }],
    flexDirection: "column",
    gap: 2,
  },
  numberButton: {
    width: 32,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  readOnlyValue: {
    color: "#E5E7EB",
    fontSize: 13,
    fontFamily: "monospace",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
    paddingLeft: 8,
  },
  booleanContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flex: 1,
  },
  booleanText: {
    marginLeft: 8,
    color: "#F59E0B",
    fontWeight: "500",
    fontFamily: "monospace",
  },
  modernToggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 2,
    flex: 1,
    minHeight: 34,
  },
  toggleIconContainer: {
    marginRight: 6,
  },
  toggleIcon: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  },
  toggleIconSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toggleContent: {
    flex: 1,
    minWidth: 0,
  },
  toggleLabel: {
    color: "#E5E7EB",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.3,
  },
  toggleStatus: {
    color: "#9CA3AF",
    fontSize: 11,
  },
  toggleBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  toggleBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "monospace",
  },
  // Pre-computed toggle icon styles to avoid inline objects [[memory:4875251]]
  toggleIconTrue: {
    backgroundColor: "#00FFFF",
  },
  toggleIconFalse: {
    backgroundColor: "#6B7280",
  },
  // Pre-computed toggle badge styles [[memory:4875251]]
  toggleBadgeTrue: {
    backgroundColor: "rgba(0, 255, 255, 0.1)",
    borderColor: "rgba(0, 255, 255, 0.3)",
  },
  toggleBadgeFalse: {
    backgroundColor: "rgba(100, 100, 100, 0.1)",
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  // Pre-computed toggle text styles [[memory:4875251]]
  toggleTextTrue: {
    color: "#00FFFF",
    fontWeight: "600",
  },
  toggleTextFalse: {
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
