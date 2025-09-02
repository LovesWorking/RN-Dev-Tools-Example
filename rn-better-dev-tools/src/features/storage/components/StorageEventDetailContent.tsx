import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "rn-better-dev-tools/icons";
import { AsyncStorageEvent } from "../utils/AsyncStorageListener";
import { formatRelativeTime } from "@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime";
import { DataViewer } from "../../react-query/components/shared/DataViewer";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { ThemedSplitView } from "./DiffViewer/modes/ThemedSplitView";
import { diffThemes } from "./DiffViewer/themes/diffThemes";

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
  // If true, do not render the internal sticky footer (use external modal footer)
  disableInternalFooter?: boolean;
}

export function StorageEventDetailContent({
  conversation,
  activeTab = "current",
  selectedEventIndex = 0,
  onEventIndexChange = () => {},
  disableInternalFooter = false,
}: StorageEventDetailContentProps) {
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

  const renderValueContent = (value: unknown, label: string) => {
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
          <Text style={styles.valueLabel}>{label}</Text>
          <View style={[styles.typeBadge]}>
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

  // Get all events sorted by time
  const navigationItems = conversation.events.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  const totalEvents = navigationItems.length;

  // Render current value tab
  const renderCurrentValue = () => {
    const selectedEvent = navigationItems[selectedEventIndex];
    const valueToShow = selectedEvent?.data?.value ?? conversation.currentValue;

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
    if (navigationItems.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertCircle size={32} color={gameUIColors.muted} />
          <Text style={styles.emptyText}>No changes to display</Text>
        </View>
      );
    }

    const selectedEvent = navigationItems[selectedEventIndex];
    const previousEvent =
      selectedEventIndex > 0 ? navigationItems[selectedEventIndex - 1] : null;

    const currentValue = selectedEvent?.data?.value;
    const previousValue = previousEvent?.data?.value ?? null;

    return (
      <View style={styles.fullPageSection}>
        <ThemedSplitView
          oldValue={parseValue(previousValue)}
          newValue={parseValue(currentValue)}
          differences={[]}
          theme={diffThemes.gitClassic}
          options={{
            hideLineNumbers: false,
            disableWordDiff: false,
            showDiffOnly: false,
            compareMethod: "words",
            contextLines: 3,
            lineOffset: 0,
          }}
          showThemeName={false}
        />
      </View>
    );
  };

  return (
    <>
      <View
        style={[
          styles.contentOnly,
          {
            flex: 1,
            paddingBottom: !disableInternalFooter && totalEvents > 1 ? 80 : 0,
          },
        ]}
      >
        {activeTab === "current" && renderCurrentValue()}
        {activeTab === "diff" && renderDiff()}
      </View>

      {/* Bottom Navigation - Fixed at bottom */}
      {totalEvents > 1 && !disableInternalFooter && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            onPress={() => onEventIndexChange(Math.max(0, selectedEventIndex - 1))}
            disabled={selectedEventIndex === 0}
            style={[styles.navButton, selectedEventIndex === 0 && styles.navButtonDisabled]}
          >
            <ChevronLeft
              size={20}
              color={selectedEventIndex === 0 ? gameUIColors.muted : gameUIColors.primary}
            />
            <Text
              style={[
                styles.navButtonText,
                selectedEventIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
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
            style={[
              styles.navButton,
              selectedEventIndex === totalEvents - 1 && styles.navButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.navButtonText,
                selectedEventIndex === totalEvents - 1 && styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <ChevronRight
              size={20}
              color={selectedEventIndex === totalEvents - 1 ? gameUIColors.muted : gameUIColors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

// External footer component to be rendered by the modal outside the ScrollView
export function StorageEventDetailFooter({
  conversation,
  selectedEventIndex = 0,
  onEventIndexChange = () => {},
}: {
  conversation: StorageKeyConversation;
  selectedEventIndex?: number;
  onEventIndexChange?: (index: number) => void;
}) {
  const navigationItems = conversation.events.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  const totalEvents = navigationItems.length;

  if (totalEvents <= 1) return null;

  return (
    <View style={styles.externalFooterBar}>
      <TouchableOpacity
        onPress={() => onEventIndexChange(Math.max(0, selectedEventIndex - 1))}
        disabled={selectedEventIndex === 0}
        style={[styles.navButton, selectedEventIndex === 0 && styles.navButtonDisabled]}
      >
        <ChevronLeft
          size={20}
          color={selectedEventIndex === 0 ? gameUIColors.muted : gameUIColors.primary}
        />
        <Text
          style={[
            styles.navButtonText,
            selectedEventIndex === 0 && styles.navButtonTextDisabled,
          ]}
        >
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
        style={[
          styles.navButton,
          selectedEventIndex === totalEvents - 1 && styles.navButtonDisabled,
        ]}
      >
        <Text
          style={[
            styles.navButtonText,
            selectedEventIndex === totalEvents - 1 && styles.navButtonTextDisabled,
          ]}
        >
          Next
        </Text>
        <ChevronRight
          size={20}
          color={selectedEventIndex === totalEvents - 1 ? gameUIColors.muted : gameUIColors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentOnly: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.background,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  // Same styling as stickyFooter but without absolute positioning.
  externalFooterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.background,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "40",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 14,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: gameUIColors.border + "30",
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
    backgroundColor: gameUIColors.muted + "20",
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
