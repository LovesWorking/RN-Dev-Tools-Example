import { View, Text, ScrollView, StyleSheet } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import type { DiffItem } from "../../../utils/objectDiff";

interface UnifiedDiffViewProps {
  oldValue: any;
  newValue: any;
  differences: DiffItem[];
  debugMode?: boolean;
}

export function UnifiedDiffView({
  oldValue,
  newValue,
  differences,
  debugMode,
}: UnifiedDiffViewProps) {
  const formatPath = (path: (string | number)[]): string => {
    if (path.length === 0) return "@root";
    return (
      "@" +
      path
        .map((segment, index) => {
          if (typeof segment === "number") {
            return `[${segment}]`;
          }
          return index === 0 ? segment : `.${segment}`;
        })
        .join("")
    );
  };

  const formatValue = (value: any): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  // Group differences by path and sort
  const sortedDiffs = [...differences].sort((a, b) => {
    const pathA = formatPath(a.path);
    const pathB = formatPath(b.path);
    return pathA.localeCompare(pathB);
  });

  return (
    <View style={[styles.container, debugMode && styles.debugUnified]}>
      {debugMode && <Text style={styles.debugLabel}>UNIFIED MODE</Text>}

      <View style={styles.header}>
        <Text style={styles.headerText}>--- PREV</Text>
        <Text style={styles.headerText}>+++ CUR</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.diffContainer}>
          {sortedDiffs.map((diff, index) => {
            const path = formatPath(diff.path);

            return (
              <View key={index} style={styles.diffBlock}>
                <View style={styles.pathHeader}>
                  <Text style={styles.pathText}>{path}</Text>
                </View>

                {diff.type === "REMOVE" && (
                  <View style={styles.lineContainer}>
                    <Text style={styles.lineNumber}>-</Text>
                    <View style={[styles.lineContent, styles.removeLine]}>
                      <Text style={styles.removeText}>
                        {formatValue(diff.oldValue)}
                      </Text>
                    </View>
                  </View>
                )}

                {diff.type === "CREATE" && (
                  <View style={styles.lineContainer}>
                    <Text style={styles.lineNumber}>+</Text>
                    <View style={[styles.lineContent, styles.addLine]}>
                      <Text style={styles.addText}>
                        {formatValue(diff.value)}
                      </Text>
                    </View>
                  </View>
                )}

                {diff.type === "CHANGE" && (
                  <>
                    <View style={styles.lineContainer}>
                      <Text style={styles.lineNumber}>-</Text>
                      <View style={[styles.lineContent, styles.removeLine]}>
                        <Text style={styles.removeText}>
                          {formatValue(diff.oldValue)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lineContainer}>
                      <Text style={styles.lineNumber}>+</Text>
                      <View style={[styles.lineContent, styles.addLine]}>
                        <Text style={styles.addText}>
                          {formatValue(diff.value)}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={[styles.statText, { color: gameUIColors.success }]}>
            +{differences.filter((d) => d.type === "CREATE").length}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statText, { color: gameUIColors.error }]}>
            -{differences.filter((d) => d.type === "REMOVE").length}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statText, { color: gameUIColors.warning }]}>
            ~{differences.filter((d) => d.type === "CHANGE").length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },
  debugUnified: {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    borderWidth: 2,
    borderColor: "yellow",
  },
  debugLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "yellow",
    color: "black",
    fontSize: 10,
    padding: 2,
    zIndex: 999,
  },
  header: {
    backgroundColor: gameUIColors.background + "60",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.secondary,
    fontWeight: "600",
  },
  scrollContainer: {
    backgroundColor: gameUIColors.panel + "30",
    borderRadius: 6,
    padding: 8,
  },
  diffContainer: {
    gap: 8,
  },
  diffBlock: {
    backgroundColor: gameUIColors.background + "40",
    borderRadius: 4,
    overflow: "hidden",
  },
  pathHeader: {
    backgroundColor: gameUIColors.info + "10",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },
  pathText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.info,
    fontWeight: "600",
  },
  lineContainer: {
    flexDirection: "row",
    minHeight: 24,
  },
  lineNumber: {
    width: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.muted,
    textAlign: "center",
  },
  lineContent: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeLine: {
    backgroundColor: gameUIColors.error + "10",
  },
  addLine: {
    backgroundColor: gameUIColors.success + "10",
  },
  removeText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.error,
  },
  addText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.success,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
    paddingVertical: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "700",
  },
});
