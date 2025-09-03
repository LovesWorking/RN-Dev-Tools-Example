import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  GitBranch,
  Minus,
  Plus,
  Edit3,
  ChevronDown,
  ChevronRight,
} from "rn-better-dev-tools/icons";
import { objectDiff, type DiffItem } from "../utils/objectDiff";
import { DataViewer } from "../../react-query/components/shared/DataViewer";

interface CollapsibleDiffViewerProps {
  oldValue: unknown;
  newValue: unknown;
}

interface FlattenedDiff {
  path: string;
  type: "CREATE" | "REMOVE" | "CHANGE";
  oldValue?: any;
  newValue?: any;
}

export function CollapsibleDiffViewer({
  oldValue,
  newValue,
}: CollapsibleDiffViewerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const parseValue = (value: unknown): unknown => {
    if (value === null || value === undefined) return value;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  const flattened = useMemo(() => {
    const oldParsed = parseValue(oldValue);
    const newParsed = parseValue(newValue);

    // Only show diff for objects and arrays
    if (
      (!oldParsed || typeof oldParsed !== "object") &&
      (!newParsed || typeof newParsed !== "object")
    ) {
      return [];
    }

    // Calculate the differences
    let differences: DiffItem[] = [];
    try {
      differences = objectDiff(oldParsed || {}, newParsed || {});
    } catch (error) {
      console.warn("Failed to calculate diff:", error);
      return [];
    }

    // Convert to flattened format with readable paths
    const flatDiffs: FlattenedDiff[] = differences.map((diff) => {
      const pathString =
        diff.path.length === 0
          ? "root"
          : diff.path
              .map((segment, index) => {
                if (typeof segment === "number") {
                  return `[${segment}]`;
                }
                return index === 0 ? segment : `.${segment}`;
              })
              .join("");

      return {
        path: pathString,
        type: diff.type,
        oldValue: diff.oldValue,
        newValue: diff.value,
      };
    });

    // Sort by path for better readability
    return flatDiffs.sort((a, b) => a.path.localeCompare(b.path));
  }, [oldValue, newValue]);

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const formatValue = (value: any): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return `[Array: ${value.length} items]`;
      }
      return `{Object: ${Object.keys(value).length} keys}`;
    }
    return String(value);
  };

  const getTypeColor = (value: any): string => {
    if (value === null) return gameUIColors.dataTypes.null;
    if (value === undefined) return gameUIColors.dataTypes.undefined;
    const type = typeof value;
    switch (type) {
      case "string":
        return gameUIColors.dataTypes.string;
      case "number":
        return gameUIColors.dataTypes.number;
      case "boolean":
        return gameUIColors.dataTypes.boolean;
      case "object":
        return Array.isArray(value)
          ? gameUIColors.dataTypes.array
          : gameUIColors.dataTypes.object;
      default:
        return gameUIColors.primary;
    }
  };

  const getDiffIcon = (type: string) => {
    switch (type) {
      case "CREATE":
        return <Plus size={11} color={gameUIColors.success} />;
      case "REMOVE":
        return <Minus size={11} color={gameUIColors.error} />;
      case "CHANGE":
        return <Edit3 size={11} color={gameUIColors.warning} />;
      default:
        return null;
    }
  };

  const getDiffColor = (type: string) => {
    switch (type) {
      case "CREATE":
        return gameUIColors.success;
      case "REMOVE":
        return gameUIColors.error;
      case "CHANGE":
        return gameUIColors.warning;
      default:
        return gameUIColors.muted;
    }
  };

  if (flattened.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <GitBranch size={12} color={gameUIColors.info} />
          <Text style={styles.title}>
            Found {flattened.length} change{flattened.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.typeSummary}>
          {(() => {
            const created = flattened.filter((d) => d.type === "CREATE").length;
            const changed = flattened.filter((d) => d.type === "CHANGE").length;
            const removed = flattened.filter((d) => d.type === "REMOVE").length;

            return (
              <>
                {created > 0 && (
                  <View style={styles.typeCount}>
                    <Plus size={10} color={gameUIColors.success} />
                    <Text style={styles.typeCountText}>{created}</Text>
                  </View>
                )}
                {changed > 0 && (
                  <View style={styles.typeCount}>
                    <Edit3 size={10} color={gameUIColors.warning} />
                    <Text style={styles.typeCountText}>{changed}</Text>
                  </View>
                )}
                {removed > 0 && (
                  <View style={styles.typeCount}>
                    <Minus size={10} color={gameUIColors.error} />
                    <Text style={styles.typeCountText}>{removed}</Text>
                  </View>
                )}
              </>
            );
          })()}
        </View>
      </View>

      {/* Diff List */}
      <View style={styles.listContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {flattened.map((diff, index) => {
            const isExpanded = expandedPaths.has(diff.path);

            return (
              <View key={index} style={styles.diffItem}>
                <TouchableOpacity
                  style={styles.diffHeader}
                  onPress={() => togglePath(diff.path)}
                  activeOpacity={0.7}
                >
                  <View style={styles.headerContent}>
                    {isExpanded ? (
                      <ChevronDown size={12} color={gameUIColors.muted} />
                    ) : (
                      <ChevronRight size={12} color={gameUIColors.muted} />
                    )}
                    {getDiffIcon(diff.type)}
                    <Text style={styles.path} numberOfLines={1}>
                      {diff.path}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getDiffColor(diff.type) + "15" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        { color: getDiffColor(diff.type) },
                      ]}
                    >
                      {diff.type === "CREATE"
                        ? "NEW"
                        : diff.type === "REMOVE"
                          ? "DEL"
                          : "CHG"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    {diff.type === "CHANGE" && (
                      <View style={styles.valuesContainer}>
                        {/* PREV value */}
                        <View style={styles.valueSection}>
                          <Text
                            style={[
                              styles.valueLabel,
                              { color: gameUIColors.optional },
                            ]}
                          >
                            PREV:
                          </Text>
                          {typeof diff.oldValue === "object" &&
                          diff.oldValue !== null ? (
                            <View style={styles.dataViewerContainer}>
                              <DataViewer
                                title=""
                                data={diff.oldValue}
                                maxDepth={5}
                                rawMode={true}
                                showTypeFilter={false}
                                initialExpanded={false}
                              />
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.value,
                                { color: getTypeColor(diff.oldValue) },
                              ]}
                            >
                              {formatValue(diff.oldValue)}
                            </Text>
                          )}
                        </View>
                        {/* CUR value */}
                        <View style={styles.valueSection}>
                          <Text
                            style={[
                              styles.valueLabel,
                              { color: gameUIColors.success },
                            ]}
                          >
                            CUR:
                          </Text>
                          {typeof diff.newValue === "object" &&
                          diff.newValue !== null ? (
                            <View style={styles.dataViewerContainer}>
                              <DataViewer
                                title=""
                                data={diff.newValue}
                                maxDepth={5}
                                rawMode={true}
                                showTypeFilter={false}
                                initialExpanded={false}
                              />
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.value,
                                { color: getTypeColor(diff.newValue) },
                              ]}
                            >
                              {formatValue(diff.newValue)}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                    {diff.type === "CREATE" && (
                      <View style={styles.valuesContainer}>
                        <View style={styles.valueSection}>
                          <Text
                            style={[
                              styles.valueLabel,
                              { color: gameUIColors.success },
                            ]}
                          >
                            ADDED:
                          </Text>
                          {typeof diff.newValue === "object" &&
                          diff.newValue !== null ? (
                            <View style={styles.dataViewerContainer}>
                              <DataViewer
                                title=""
                                data={diff.newValue}
                                maxDepth={5}
                                rawMode={true}
                                showTypeFilter={false}
                                initialExpanded={false}
                              />
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.value,
                                { color: getTypeColor(diff.newValue) },
                              ]}
                            >
                              {formatValue(diff.newValue)}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                    {diff.type === "REMOVE" && (
                      <View style={styles.valuesContainer}>
                        <View style={styles.valueSection}>
                          <Text
                            style={[
                              styles.valueLabel,
                              { color: gameUIColors.error },
                            ]}
                          >
                            REMOVED:
                          </Text>
                          {typeof diff.oldValue === "object" &&
                          diff.oldValue !== null ? (
                            <View style={styles.dataViewerContainer}>
                              <DataViewer
                                title=""
                                data={diff.oldValue}
                                maxDepth={5}
                                rawMode={true}
                                showTypeFilter={false}
                                initialExpanded={false}
                              />
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.value,
                                { color: getTypeColor(diff.oldValue) },
                              ]}
                            >
                              {formatValue(diff.oldValue)}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    maxHeight: 250,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
  },
  typeSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: gameUIColors.background + "40",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeCountText: {
    fontSize: 9,
    fontWeight: "600",
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  listContainer: {
    backgroundColor: gameUIColors.panel + "30",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
    padding: 4,
  },
  diffItem: {
    marginBottom: 2,
  },
  diffHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: gameUIColors.background + "40",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 28,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  path: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    minWidth: 32,
    alignItems: "center",
  },
  typeText: {
    fontSize: 8,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  expandedContent: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 24,
    backgroundColor: gameUIColors.background + "20",
    borderRadius: 4,
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: gameUIColors.border + "30",
  },
  valuesContainer: {
    gap: 12,
  },
  valueSection: {
    gap: 6,
  },
  valueLabel: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    fontFamily: "monospace",
    paddingLeft: 4,
    lineHeight: 14,
  },
  dataViewerContainer: {
    marginTop: 4,
    marginLeft: -4, // Compensate for DataViewer's internal padding
    maxHeight: 200,
  },
});
