import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Database,
  Clock,
  Hash,
  BarChart3,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  GitBranch,
  Plus,
  Minus,
  Edit3,
} from "lucide-react-native";
import { AsyncStorageEvent } from "../utils/AsyncStorageListener";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import { DataViewer } from "../../react-query/components/shared/DataViewer";
import { 
  gameUIColors, 
  GameUICollapsibleSection 
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { copyToClipboard } from "@/rn-better-dev-tools/src/shared/clipboard/copyToClipboard";
// TODO: Add diff library
// import diff from "diff";
// import type { Difference } from "diff";
const diff = null as any;
type Difference = any;

interface StorageKeyConversation {
  key: string;
  lastEvent: AsyncStorageEvent;
  events: AsyncStorageEvent[];
  totalOperations: number;
  currentValue: unknown;
  valueType:
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "undefined"
    | "object"
    | "array";
}

interface StorageEventDetailContentProps {
  conversation: StorageKeyConversation;
  activeTab?: DetailTab;
}

interface KeyStats {
  totalOperations: number;
  setCount: number;
  removeCount: number;
  mergeCount: number;
  firstSeen: Date;
  lastSeen: Date;
  latestEvent: AsyncStorageEvent | null;
  currentValue: unknown;
  history: {
    action: string;
    value: unknown;
    timestamp: Date;
  }[];
  valueChanges: {
    from: unknown;
    to: unknown;
    timestamp: Date;
    action: string;
  }[];
}

type DetailTab = "overview" | "history" | "changes";

export function StorageEventDetailContent({
  conversation,
  activeTab = "overview",
}: StorageEventDetailContentProps) {
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null);
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [expandedValueChanges, setExpandedValueChanges] = useState(false);
  const [expandedChangeItems, setExpandedChangeItems] = useState<number[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!conversation) return;

    const key = conversation.key;
    const allKeyEvents = conversation.events.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    if (allKeyEvents.length === 0) return;

    // Build history and detect value changes
    const history: KeyStats["history"] = [];
    const valueChanges: KeyStats["valueChanges"] = [];
    let previousValue: unknown;
    let currentValue: unknown;

    allKeyEvents.forEach((e) => {
      const value = e.data?.value;

      history.push({
        action: e.action,
        value: value,
        timestamp: e.timestamp,
      });

      if (e.action === "setItem" || e.action === "mergeItem") {
        if (previousValue !== undefined && previousValue !== value) {
          valueChanges.push({
            from: previousValue,
            to: value,
            timestamp: e.timestamp,
            action: e.action,
          });
        }
        previousValue = value;
        currentValue = value;
      } else if (e.action === "removeItem") {
        if (previousValue !== undefined) {
          valueChanges.push({
            from: previousValue,
            to: null,
            timestamp: e.timestamp,
            action: e.action,
          });
        }
        previousValue = null;
        currentValue = null;
      }
    });

    const latestEvent = allKeyEvents[allKeyEvents.length - 1];

    const stats: KeyStats = {
      totalOperations: allKeyEvents.length,
      setCount: allKeyEvents.filter((e) => e.action === "setItem").length,
      removeCount: allKeyEvents.filter((e) => e.action === "removeItem").length,
      mergeCount: allKeyEvents.filter((e) => e.action === "mergeItem").length,
      firstSeen: allKeyEvents[0].timestamp,
      lastSeen: latestEvent.timestamp,
      latestEvent: latestEvent,
      currentValue: currentValue,
      history: history.reverse(), // Show most recent first
      valueChanges: valueChanges.reverse(),
    };

    setKeyStats(stats);
  }, [conversation]);

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

  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ms = date.getMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "setItem":
        return gameUIColors.success;
      case "removeItem":
        return gameUIColors.error;
      case "mergeItem":
        return gameUIColors.info;
      default:
        return gameUIColors.muted;
    }
  };

  const handleExportEvents = async () => {
    if (!keyStats) return;

    const allData = {
      key: conversation.key,
      currentValue: keyStats.currentValue,
      statistics: {
        totalOperations: keyStats.totalOperations,
        setCount: keyStats.setCount,
        removeCount: keyStats.removeCount,
        mergeCount: keyStats.mergeCount,
        firstSeen: keyStats.firstSeen.toISOString(),
        lastSeen: keyStats.lastSeen.toISOString(),
      },
      valueChanges: keyStats.valueChanges.map((change) => ({
        from: change.from,
        to: change.to,
        timestamp: change.timestamp.toISOString(),
        action: change.action,
      })),
      operationHistory: keyStats.history.map((item) => ({
        action: item.action,
        value: item.value,
        timestamp: item.timestamp.toISOString(),
      })),
    };

    await copyToClipboard(allData);
  };

  const toggleValueChange = (index: number) => {
    setExpandedChangeItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const renderDiff = (oldValue: unknown, newValue: unknown) => {
    // Parse values if they're strings
    const oldParsed = parseValue(oldValue);
    const newParsed = parseValue(newValue);

    // Only show diff for objects and arrays
    if (
      (!oldParsed || typeof oldParsed !== "object") &&
      (!newParsed || typeof newParsed !== "object")
    ) {
      return null;
    }

    // Calculate the differences
    let differences: Difference[] = [];
    try {
      differences = diff(
        oldParsed || {},
        newParsed || {},
        { cyclesFix: true }
      );
    } catch (error) {
      console.warn("Failed to calculate diff:", error);
      return null;
    }

    if (differences.length === 0) {
      return null;
    }

    const getDiffIcon = (type: string) => {
      switch (type) {
        case "CREATE":
          return <Plus size={12} color={gameUIColors.success} />;
        case "REMOVE":
          return <Minus size={12} color={gameUIColors.error} />;
        case "CHANGE":
          return <Edit3 size={12} color={gameUIColors.warning} />;
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

    const formatPath = (path: (string | number)[]) => {
      return path.map((p, i) => {
        if (typeof p === "number") {
          return `[${p}]`;
        }
        if (i === 0) {
          return p;
        }
        return `.${p}`;
      }).join("");
    };

    const formatValue = (value: any) => {
      if (value === null) return "null";
      if (value === undefined) return "undefined";
      if (typeof value === "string") return `"${value}"`;
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return `[${value.length} items]`;
        }
        return `{${Object.keys(value).length} keys}`;
      }
      return String(value);
    };

    return (
      <View style={styles.diffSection}>
        <View style={styles.diffHeader}>
          <GitBranch size={14} color={gameUIColors.info} />
          <Text style={styles.diffTitle}>DIFF</Text>
          <View style={styles.diffCountBadge}>
            <Text style={styles.diffCountText}>{differences.length}</Text>
          </View>
        </View>
        
        <View style={styles.diffContent}>
          {differences.slice(0, 10).map((diff, index) => (
            <View key={index} style={styles.diffItem}>
              <View style={styles.diffItemHeader}>
                {getDiffIcon(diff.type)}
                <Text 
                  style={[
                    styles.diffType,
                    { color: getDiffColor(diff.type) }
                  ]}
                >
                  {diff.type}
                </Text>
                <Text style={styles.diffPath}>
                  {formatPath(diff.path)}
                </Text>
              </View>
              
              <View style={styles.diffValues}>
                {diff.type === "CHANGE" && (
                  <>
                    <View style={styles.diffValueRow}>
                      <Text style={styles.diffValueLabel}>OLD:</Text>
                      <Text style={[styles.diffValue, { color: gameUIColors.optional }]}>
                        {formatValue((diff as any).oldValue)}
                      </Text>
                    </View>
                    <View style={styles.diffValueRow}>
                      <Text style={styles.diffValueLabel}>NEW:</Text>
                      <Text style={[styles.diffValue, { color: gameUIColors.success }]}>
                        {formatValue(diff.value)}
                      </Text>
                    </View>
                  </>
                )}
                {diff.type === "CREATE" && (
                  <View style={styles.diffValueRow}>
                    <Text style={styles.diffValueLabel}>VALUE:</Text>
                    <Text style={[styles.diffValue, { color: gameUIColors.success }]}>
                      {formatValue(diff.value)}
                    </Text>
                  </View>
                )}
                {diff.type === "REMOVE" && (
                  <View style={styles.diffValueRow}>
                    <Text style={styles.diffValueLabel}>REMOVED:</Text>
                    <Text style={[styles.diffValue, { color: gameUIColors.error }]}>
                      {formatValue((diff as any).oldValue)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
          
          {differences.length > 10 && (
            <Text style={styles.moreText}>
              +{differences.length - 10} more changes
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderValueContent = (value: unknown, label: string, labelColor?: string) => {
    const parsed = parseValue(value);
    const type = parsed === null ? "null" 
      : parsed === undefined ? "undefined"
      : Array.isArray(parsed) ? "array"
      : typeof parsed;

    return (
      <View style={styles.valueContent}>
        <View style={styles.valueHeader}>
          {label && (
            <Text style={[styles.valueLabel, labelColor && { color: labelColor }]}>
              {label}
            </Text>
          )}
          <View style={[styles.typeBadge, { backgroundColor: gameUIColors.muted + "20" }]}>
            <Text style={styles.typeText}>{type.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.valueBox}>
          {type === "object" || type === "array" ? (
            parsed && ((Array.isArray(parsed) && parsed.length > 0) || 
                      (typeof parsed === "object" && Object.keys(parsed).length > 0)) ? (
              <DataViewer 
                title="" 
                data={parsed} 
                showTypeFilter={false}
              />
            ) : (
              <Text style={styles.valueText}>
                {type === "array" ? "[]" : "{}"}
              </Text>
            )
          ) : (
            <Text style={styles.valueText}>
              {parsed === null ? "null"
                : parsed === undefined ? "undefined"
                : type === "string" ? `"${parsed}"`
                : String(parsed)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!keyStats) return null;

  const latestEvent = keyStats.latestEvent || conversation.lastEvent;

  const renderOverview = () => (
    <>
      {/* Export Button */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          onPress={handleExportEvents}
          style={styles.exportButton}
          sentry-label="ignore export all data"
        >
          <Download size={14} color={gameUIColors.info} />
          <Text style={styles.exportText}>EXPORT EVENTS</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Event Overview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Database size={16} color={gameUIColors.success} />
          <Text style={styles.sectionTitle}>Latest Event</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Last Action</Text>
            <View
              style={[
                styles.actionBadge,
                {
                  backgroundColor: `${getActionColor(latestEvent.action)}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: getActionColor(latestEvent.action) },
                ]}
              >
                {latestEvent.action.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.timeValue}>
              {formatTimestamp(latestEvent.timestamp)} ({formatRelativeTime(latestEvent.timestamp)})
            </Text>
          </View>
        </View>
      </View>

      {/* Current Value */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Hash size={16} color={gameUIColors.info} />
          <Text style={styles.sectionTitle}>Current Value</Text>
        </View>
        <View style={styles.card}>
          {renderValueContent(keyStats.currentValue, "VALUE")}
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={16} color={gameUIColors.optional} />
          <Text style={styles.sectionTitle}>Statistics</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{keyStats.totalOperations}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: gameUIColors.success }]}>
                {keyStats.setCount}
              </Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: gameUIColors.error }]}>
                {keyStats.removeCount}
              </Text>
              <Text style={styles.statLabel}>Removes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: gameUIColors.info }]}>
                {keyStats.mergeCount}
              </Text>
              <Text style={styles.statLabel}>Merges</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>First Seen</Text>
            <Text style={styles.timeValue}>
              {formatTimestamp(keyStats.firstSeen)} ({formatRelativeTime(keyStats.firstSeen)})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={styles.timeValue}>
              {formatTimestamp(keyStats.lastSeen)} ({formatRelativeTime(keyStats.lastSeen)})
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderChanges = () => (

    <View style={styles.fullPageSection}>
      {keyStats.valueChanges.length > 0 ? (
        <>
          {keyStats.valueChanges.map((change, index) => (
                <View key={index} style={styles.changeContainer}>
                  <TouchableOpacity
                    onPress={() => toggleValueChange(index)}
                    style={styles.changeHeader}
                    sentry-label="ignore value change toggle"
                  >
                    <View style={styles.changeHeaderLeft}>
                      <AlertCircle size={14} color={gameUIColors.warning} />
                      <Text style={styles.changeTime}>
                        {formatTimestamp(change.timestamp)} ({formatRelativeTime(change.timestamp)})
                      </Text>
                      <View
                        style={[
                          styles.changeActionBadge,
                          { backgroundColor: `${getActionColor(change.action)}15` }
                        ]}
                      >
                        <Text
                          style={[
                            styles.changeActionText,
                            { color: getActionColor(change.action) }
                          ]}
                        >
                          {change.action.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    {expandedChangeItems.includes(index) ? (
                      <ChevronUp size={14} color={gameUIColors.muted} />
                    ) : (
                      <ChevronDown size={14} color={gameUIColors.muted} />
                    )}
                  </TouchableOpacity>

                  {expandedChangeItems.includes(index) && (
                    <View style={styles.changeDetails}>
                      <View style={styles.changeValueSection}>
                        {renderValueContent(change.from, "PREVIOUS VALUE", gameUIColors.optional)}
                      </View>
                      
                      <View style={styles.changeArrowContainer}>
                        <Text style={styles.changeArrow}>↓</Text>
                      </View>
                      
                      <View style={styles.changeValueSection}>
                        {renderValueContent(change.to, "NEW VALUE", gameUIColors.success)}
                      </View>
                      
                      {/* DIFF Section */}
                      {renderDiff(change.from, change.to)}
                    </View>
                  )}
                </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyState}>
          <AlertCircle size={32} color={gameUIColors.muted} />
          <Text style={styles.emptyText}>No value changes recorded</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      sentry-label="ignore storage event detail scroll"
    >
      {activeTab === "overview" && renderOverview()}
      {activeTab === "changes" && renderChanges()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  fullPageSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 12,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: gameUIColors.info + "15",
    borderWidth: 1,
    borderColor: gameUIColors.info + "30",
  },
  exportText: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
  },
  collapsibleWrapper: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.panel,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },
  sectionTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
    color: gameUIColors.primary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameUIColors.success + "20",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: gameUIColors.success,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.success,
    fontFamily: "monospace",
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.background,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  timeValue: {
    fontSize: 10,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: gameUIColors.primary,
    fontFamily: "monospace",
  },
  statLabel: {
    fontSize: 10,
    color: gameUIColors.secondary,
    marginTop: 4,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: gameUIColors.border + "20",
    marginVertical: 12,
  },
  moreText: {
    fontSize: 11,
    color: gameUIColors.secondary,
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  changeContainer: {
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "10",
  },
  changeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: gameUIColors.warning + "10",
    borderLeftWidth: 3,
    borderLeftColor: gameUIColors.warning + "40",
  },
  changeHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  changeTime: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
  },
  changeActionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  changeActionText: {
    fontSize: 9,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  changeDetails: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: gameUIColors.warning + "05",
    borderTopWidth: 1,
    borderTopColor: gameUIColors.warning + "15",
  },
  changeValueSection: {
    marginBottom: 6,
  },
  changeArrowContainer: {
    alignItems: "center",
    marginVertical: 4,
  },
  changeArrow: {
    fontSize: 16,
    color: gameUIColors.secondary,
  },
  valueContent: {
    marginTop: 4,
  },
  valueHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "600",
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  valueBox: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border + "30",
    padding: 8,
  },
  valueText: {
    fontSize: 12,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  diffSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "20",
    paddingTop: 12,
  },
  diffHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  diffTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  diffCountBadge: {
    backgroundColor: gameUIColors.info + "20",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 16,
    alignItems: "center",
  },
  diffCountText: {
    fontSize: 9,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
  },
  diffContent: {
    backgroundColor: gameUIColors.panel + "50",
    borderRadius: 6,
    padding: 8,
  },
  diffItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "10",
  },
  diffItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  diffType: {
    fontSize: 9,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  diffPath: {
    fontSize: 10,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
    flex: 1,
  },
  diffValues: {
    paddingLeft: 18,
  },
  diffValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 2,
  },
  diffValueLabel: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    minWidth: 50,
  },
  diffValue: {
    fontSize: 10,
    fontFamily: "monospace",
    flex: 1,
  },
});