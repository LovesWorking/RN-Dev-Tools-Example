import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { GitBranch, Minus, Plus, Edit3 } from "rn-better-dev-tools/icons";
import {
  parseValue,
  formatValue,
  getTypeColor,
  flattenObject,
} from "@/rn-better-dev-tools/src/shared/utils/valueFormatting";

interface CompactDiffViewerProps {
  oldValue: unknown;
  newValue: unknown;
}

interface FlattenedItem {
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
  type: "SAME" | "CHANGE" | "CREATE" | "REMOVE";
}

export function CompactDiffViewer({
  oldValue,
  newValue,
}: CompactDiffViewerProps) {
  const { flattenedData, changedPaths } = useMemo(() => {
    const oldParsed = parseValue(oldValue);
    const newParsed = parseValue(newValue);

    const oldFlat = flattenObject(oldParsed);
    const newFlat = flattenObject(newParsed);

    // Get all unique paths
    const allPaths = new Set([
      ...Object.keys(oldFlat),
      ...Object.keys(newFlat),
    ]);
    const sortedPaths = Array.from(allPaths).sort();

    // Track which paths have changes
    const changes = new Set<string>();
    const items: FlattenedItem[] = [];

    sortedPaths.forEach((path) => {
      const oldVal = oldFlat[path];
      const newVal = newFlat[path];

      let type: FlattenedItem["type"] = "SAME";
      if (!(path in oldFlat)) {
        type = "CREATE";
        changes.add(path);
      } else if (!(path in newFlat)) {
        type = "REMOVE";
        changes.add(path);
      } else if (oldVal !== newVal) {
        type = "CHANGE";
        changes.add(path);
      }

      items.push({
        path,
        oldValue: oldVal,
        newValue: newVal,
        type,
      });
    });

    return { flattenedData: items, changedPaths: changes };
  }, [oldValue, newValue]);

  if (changedPaths.size === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GitBranch size={12} color={gameUIColors.info} />
        <Text style={styles.title}>CHANGES</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{changedPaths.size}</Text>
        </View>
      </View>

      {/* Side by Side Comparison */}
      <View style={styles.comparisonContainer}>
        {/* OLD Column */}
        <View style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>OLD</Text>
          </View>
          <ScrollView
            style={styles.columnContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {flattenedData.map((item, index) => (
              <View
                key={`old-${index}`}
                style={[styles.row, item.type !== "SAME" && styles.rowChanged]}
              >
                <Text style={styles.path} numberOfLines={1}>
                  {item.path}:
                </Text>
                {item.type === "CREATE" ? (
                  <Text style={styles.emptyValue}>-</Text>
                ) : (
                  <Text
                    style={[
                      styles.value,
                      { color: getTypeColor(item.oldValue) },
                      item.type === "REMOVE" && styles.removedValue,
                    ]}
                    numberOfLines={1}
                  >
                    {formatValue(item.oldValue)}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* NEW Column */}
        <View style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>NEW</Text>
          </View>
          <ScrollView
            style={styles.columnContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {flattenedData.map((item, index) => (
              <View
                key={`new-${index}`}
                style={[styles.row, item.type !== "SAME" && styles.rowChanged]}
              >
                <Text style={styles.path} numberOfLines={1}>
                  {item.path}:
                </Text>
                {item.type === "REMOVE" ? (
                  <Text style={styles.emptyValue}>-</Text>
                ) : (
                  <Text
                    style={[
                      styles.value,
                      { color: getTypeColor(item.newValue) },
                      item.type === "CREATE" && styles.addedValue,
                    ]}
                    numberOfLines={1}
                  >
                    {formatValue(item.newValue)}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Plus size={10} color={gameUIColors.success} />
          <Text style={styles.legendText}>Added</Text>
        </View>
        <View style={styles.legendItem}>
          <Edit3 size={10} color={gameUIColors.warning} />
          <Text style={styles.legendText}>Changed</Text>
        </View>
        <View style={styles.legendItem}>
          <Minus size={10} color={gameUIColors.error} />
          <Text style={styles.legendText}>Removed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: gameUIColors.info + "20",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 16,
    alignItems: "center",
  },
  countText: {
    fontSize: 9,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
  },
  comparisonContainer: {
    flexDirection: "row",
    backgroundColor: gameUIColors.panel + "30",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
    maxHeight: 200,
    overflow: "hidden",
  },
  column: {
    flex: 1,
  },
  columnHeader: {
    backgroundColor: gameUIColors.background + "60",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },
  columnTitle: {
    fontSize: 9,
    fontWeight: "700",
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  columnContent: {
    padding: 6,
  },
  divider: {
    width: 1,
    backgroundColor: gameUIColors.border + "30",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 4,
    minHeight: 18,
    alignItems: "center",
  },
  rowChanged: {
    backgroundColor: gameUIColors.warning + "08",
    borderRadius: 2,
    marginVertical: 1,
  },
  path: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    marginRight: 4,
    minWidth: 80,
  },
  value: {
    fontSize: 9,
    fontFamily: "monospace",
    flex: 1,
  },
  emptyValue: {
    fontSize: 9,
    color: gameUIColors.muted + "50",
    fontFamily: "monospace",
  },
  addedValue: {
    fontWeight: "600",
  },
  removedValue: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "10",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendText: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
});
