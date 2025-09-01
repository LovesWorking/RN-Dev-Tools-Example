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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter,
} from "rn-better-dev-tools/icons";
import { AsyncStorageEvent } from "../utils/AsyncStorageListener";
import { formatRelativeTime } from "@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime";
import { DataViewer } from "../../react-query/components/shared/DataViewer";
import {
  gameUIColors,
  GameUICollapsibleSection,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { copyToClipboard } from "@/rn-better-dev-tools/src/shared/clipboard/copyToClipboard";
import { ThemedSplitView } from "./DiffViewer/modes/ThemedSplitView";
import { diffThemes } from "./DiffViewer/themes/diffThemes";
import { useSafeAreaInsets } from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";

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
  activeTab?: "current" | "diff";
  selectedEventIndex?: number;
  onEventIndexChange?: (index: number) => void;
  ignoredPatterns?: Set<string>;
  onTogglePattern?: (pattern: string) => void;
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


export function StorageEventDetailContent({
  conversation,
  activeTab = "current",
  selectedEventIndex = 0,
  onEventIndexChange = () => {},
  ignoredPatterns = new Set(),
  onTogglePattern = () => {},
}: StorageEventDetailContentProps) {
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null);
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [expandedValueChanges, setExpandedValueChanges] = useState(false);
  const [expandedChangeItems, setExpandedChangeItems] = useState<number[]>([]);
  const [expandedCurrentValue, setExpandedCurrentValue] = useState(true);
  const [expandedRecentChanges, setExpandedRecentChanges] = useState(true);
  const [expandedChangeValues, setExpandedChangeValues] = useState<{[key: number]: boolean}>({});
  const [expandedChangeDiffs, setExpandedChangeDiffs] = useState<{[key: number]: boolean}>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!conversation) return;

    const key = conversation.key;
    const allKeyEvents = conversation.events.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
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
    setExpandedChangeItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };


  const renderValueContent = (
    value: unknown,
    label: string,
    labelColor?: string,
  ) => {
    const parsed = parseValue(value);
    const type =
      parsed === null
        ? "null"
        : parsed === undefined
          ? "undefined"
          : Array.isArray(parsed)
            ? "array"
            : typeof parsed;

    return (
      <View style={styles.valueContent}>
        <View style={styles.valueHeader}>
          {label && (
            <Text
              style={[styles.valueLabel, labelColor && { color: labelColor }]}
            >
              {label}
            </Text>
          )}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: gameUIColors.muted + "20" },
            ]}
          >
            <Text style={styles.typeText}>{type.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.valueBox}>
          {type === "object" || type === "array" ? (
            parsed &&
            ((Array.isArray(parsed) && parsed.length > 0) ||
              (typeof parsed === "object" &&
                Object.keys(parsed).length > 0)) ? (
              <DataViewer title="" data={parsed} showTypeFilter={false} />
            ) : (
              <Text style={styles.valueText}>
                {type === "array" ? "[]" : "{}"}
              </Text>
            )
          ) : (
            <Text style={styles.valueText}>
              {parsed === null
                ? "null"
                : parsed === undefined
                  ? "undefined"
                  : type === "string"
                    ? `"${parsed}"`
                    : String(parsed)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!keyStats) return null;

  const latestEvent = keyStats.latestEvent || conversation.lastEvent;

  // Old render functions removed - now using simplified tab structure
  

  // Render current value tab
  const renderCurrentValue = () => {
    if (!keyStats) return null;
    
    // Get the value at the selected event
    const setItemChanges = keyStats.valueChanges.filter(change => change.action === "setItem");
    const changeIndex = Math.min(selectedEventIndex, setItemChanges.length - 1);
    const selectedChange = setItemChanges[changeIndex];
    const valueToShow = selectedChange ? selectedChange.to : keyStats.currentValue;
    
    return (
      <View style={styles.fullPageSection}>
        <View style={styles.card}>
          {renderValueContent(valueToShow, "CURRENT VALUE")}
        </View>
      </View>
    );
  };

  // Render diff tab
  const renderDiff = () => {
    if (!keyStats || keyStats.valueChanges.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertCircle size={32} color={gameUIColors.muted} />
          <Text style={styles.emptyText}>No changes to display</Text>
        </View>
      );
    }

    // Use the selected event index to show the right change
    const setItemChanges = keyStats.valueChanges.filter(change => change.action === "setItem");
    const changeIndex = Math.min(selectedEventIndex, setItemChanges.length - 1);
    const selectedChange = setItemChanges[changeIndex] || setItemChanges[0];
    
    return (
      <View style={styles.fullPageSection}>
        <ThemedSplitView
          oldValue={parseValue(selectedChange.from)}
          newValue={parseValue(selectedChange.to)}
          differences={[]}
          theme={diffThemes.gitClassic}
          options={{
            hideLineNumbers: false,
            disableWordDiff: false,
            showDiffOnly: false,
            compareMethod: 'words',
            contextLines: 3,
            lineOffset: 0,
          }}
          showThemeName={false}
        />
      </View>
    );
  };

  // Get total events for navigation - look at all value changes
  const navigationItems = keyStats?.valueChanges || [];
  const totalEvents = navigationItems.length;
  
  // Debug log
  console.log('Navigation Debug:', {
    totalEvents,
    selectedEventIndex,
    hasKeyStats: !!keyStats,
    valueChanges: keyStats?.valueChanges?.length || 0,
    conversationEvents: conversation.events.length,
    navigationItems: navigationItems.length
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        sentry-label="ignore storage event detail scroll"
      >
        {activeTab === "current" && renderCurrentValue()}
        {activeTab === "diff" && renderDiff()}
      </ScrollView>
      
      {/* Bottom Navigation - Show for testing (normally totalEvents > 1) */}
      {true && (
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            onPress={() => onEventIndexChange(Math.max(0, selectedEventIndex - 1))}
            disabled={selectedEventIndex === 0}
            style={[styles.navButton, selectedEventIndex === 0 && styles.navButtonDisabled]}
          >
            <ChevronLeft 
              size={20} 
              color={selectedEventIndex === 0 ? gameUIColors.muted : gameUIColors.primary} 
            />
            <Text style={[styles.navButtonText, selectedEventIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <View style={styles.eventCounterContainer}>
            <Text style={styles.eventCounter}>
              Event {selectedEventIndex + 1} of {totalEvents}
            </Text>
            <Text style={styles.eventTimestamp}>
              {formatRelativeTime(navigationItems[selectedEventIndex]?.timestamp)}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onEventIndexChange(Math.min(totalEvents - 1, selectedEventIndex + 1))}
            disabled={selectedEventIndex === totalEvents - 1}
            style={[styles.navButton, selectedEventIndex === totalEvents - 1 && styles.navButtonDisabled]}
          >
            <Text style={[styles.navButtonText, selectedEventIndex === totalEvents - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <ChevronRight 
              size={20} 
              color={selectedEventIndex === totalEvents - 1 ? gameUIColors.muted : gameUIColors.primary} 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  scrollContainer: {
    flex: 1,
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
  
  // Filter Button
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "20",
    marginTop: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: gameUIColors.info + "12",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: gameUIColors.info + "25",
  },
  filterButtonActive: {
    backgroundColor: gameUIColors.warning + "12",
    borderColor: gameUIColors.warning + "25",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: gameUIColors.info,
    letterSpacing: 0.3,
  },
  filterButtonTextActive: {
    color: gameUIColors.warning,
  },
  filterHintText: {
    fontSize: 11,
    color: gameUIColors.secondary,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.panel + "40",
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "40",
  },
  
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: gameUIColors.panel + "60",
    minWidth: 100,
    justifyContent: "center",
  },
  
  navButtonDisabled: {
    opacity: 0.3,
  },
  
  navButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: gameUIColors.primary,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  
  navButtonTextDisabled: {
    color: gameUIColors.muted,
  },
  
  eventCounterContainer: {
    alignItems: "center",
  },
  
  eventCounter: {
    fontSize: 14,
    fontWeight: "700",
    color: gameUIColors.primary,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  
  eventTimestamp: {
    fontSize: 11,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    marginTop: 2,
  },
});
