import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from "rn-better-dev-tools/icons";
import { AsyncStorageEvent } from "../utils/AsyncStorageListener";
import { formatRelativeTime } from "@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime";
import { DataViewer } from "../../react-query/components/shared/DataViewer";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { ThemedSplitView } from "./DiffViewer/modes/ThemedSplitView";
import { diffThemes } from "./DiffViewer/themes/diffThemes";
import { computeLineDiff, DiffType } from "../utils/lineDiff";
import { TreeDiffViewer } from "./DiffViewer/TreeDiffViewer";
import { parseValue } from "@/rn-better-dev-tools/src/shared/utils/valueFormatting";

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
  // Compare-any-two state for Diff tab
  const [leftIndex, setLeftIndex] = useState<number>(
    Math.max(0, selectedEventIndex - 1),
  );
  const [rightIndex, setRightIndex] = useState<number>(selectedEventIndex);
  const [isLeftPickerOpen, setIsLeftPickerOpen] = useState(false);
  const [isRightPickerOpen, setIsRightPickerOpen] = useState(false);
  const [diffViewerTab, setDiffViewerTab] = useState<"split" | "tree">("tree");

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
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
  const totalEvents = navigationItems.length;

  // Keep compare indices synced to selection
  useEffect(() => {
    const newRight = Math.min(totalEvents - 1, Math.max(0, selectedEventIndex));
    const newLeft = Math.max(0, Math.min(newRight - 1, selectedEventIndex - 1));
    setLeftIndex(newLeft);
    setRightIndex(newRight);
  }, [selectedEventIndex, totalEvents]);

  // Precise time HH:MM:SS.mmm
  const formatTimeWithMs = useCallback((date: Date): string => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");
    return `${h}:${m}:${s}.${ms}`;
  }, []);

  const bumpLeft = (delta: number) => {
    if (totalEvents < 2) return;
    let next = Math.max(0, Math.min(totalEvents - 2, leftIndex + delta));
    if (next >= rightIndex) next = Math.max(0, rightIndex - 1);
    setLeftIndex(next);
  };

  const bumpRight = (delta: number) => {
    if (totalEvents < 2) return;
    let next = Math.max(1, Math.min(totalEvents - 1, rightIndex + delta));
    if (next <= leftIndex) next = Math.min(totalEvents - 1, leftIndex + 1);
    setRightIndex(next);
  };

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

    const leftEvent =
      navigationItems[Math.max(0, Math.min(totalEvents - 1, leftIndex))];
    const rightEvent =
      navigationItems[Math.max(0, Math.min(totalEvents - 1, rightIndex))];
    const previousValue = leftEvent?.data?.value ?? null;
    const currentValue = rightEvent?.data?.value;

    return (
      <View style={styles.fullPageSection}>
        {/* Diff Viewer Tabs */}
        <View style={styles.diffViewerTabs}>
          <TouchableOpacity
            style={[
              styles.diffViewerTab,
              diffViewerTab === "split" && styles.diffViewerTabActive,
            ]}
            onPress={() => setDiffViewerTab("split")}
          >
            <Text
              style={[
                styles.diffViewerTabText,
                diffViewerTab === "split" && styles.diffViewerTabTextActive,
              ]}
            >
              SPLIT VIEW
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.diffViewerTab,
              diffViewerTab === "tree" && styles.diffViewerTabActive,
            ]}
            onPress={() => setDiffViewerTab("tree")}
          >
            <Text
              style={[
                styles.diffViewerTabText,
                diffViewerTab === "tree" && styles.diffViewerTabTextActive,
              ]}
            >
              TREE VIEW
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compare picker row */}
        {totalEvents > 0 && (
          <View style={styles.compareBar}>
            {/* PREV side */}
            <View style={styles.compareSide}>
              <Text
                style={[styles.compareLabel, { color: gameUIColors.optional }]}
              >
                PREV
              </Text>
              <View style={styles.compareControls}>
                <TouchableOpacity
                  onPress={() => bumpLeft(-1)}
                  disabled={leftIndex <= 0}
                  style={[
                    styles.compareBtn,
                    leftIndex <= 0 && styles.compareBtnDisabled,
                  ]}
                >
                  <ChevronLeft
                    size={14}
                    color={
                      leftIndex <= 0
                        ? gameUIColors.muted
                        : gameUIColors.secondary
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compareMeta}
                  onPress={() => setIsLeftPickerOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.compareIndex}>
                    #{leftIndex + 1} / {totalEvents}
                  </Text>
                  <Text style={styles.compareTime}>
                    {formatTimeWithMs(leftEvent.timestamp)}
                  </Text>
                  <Text style={styles.compareRelative}>
                    ({formatRelativeTime(leftEvent.timestamp)})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => bumpLeft(1)}
                  disabled={leftIndex >= rightIndex - 1}
                  style={[
                    styles.compareBtn,
                    leftIndex >= rightIndex - 1 && styles.compareBtnDisabled,
                  ]}
                >
                  <ChevronRight
                    size={14}
                    color={
                      leftIndex >= rightIndex - 1
                        ? gameUIColors.muted
                        : gameUIColors.secondary
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.compareDivider} />

            {/* CUR side */}
            <View style={styles.compareSide}>
              <Text
                style={[styles.compareLabel, { color: gameUIColors.success }]}
              >
                CUR
              </Text>
              <View style={styles.compareControls}>
                <TouchableOpacity
                  onPress={() => bumpRight(-1)}
                  disabled={rightIndex <= leftIndex + 1}
                  style={[
                    styles.compareBtn,
                    rightIndex <= leftIndex + 1 && styles.compareBtnDisabled,
                  ]}
                >
                  <ChevronLeft
                    size={14}
                    color={
                      rightIndex <= leftIndex + 1
                        ? gameUIColors.muted
                        : gameUIColors.secondary
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compareMeta}
                  onPress={() => setIsRightPickerOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.compareIndex}>
                    #{rightIndex + 1} / {totalEvents}
                  </Text>
                  <Text style={styles.compareTime}>
                    {formatTimeWithMs(rightEvent.timestamp)}
                  </Text>
                  <Text style={styles.compareRelative}>
                    ({formatRelativeTime(rightEvent.timestamp)})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => bumpRight(1)}
                  disabled={rightIndex >= totalEvents - 1}
                  style={[
                    styles.compareBtn,
                    rightIndex >= totalEvents - 1 && styles.compareBtnDisabled,
                  ]}
                >
                  <ChevronRight
                    size={14}
                    color={
                      rightIndex >= totalEvents - 1
                        ? gameUIColors.muted
                        : gameUIColors.secondary
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {diffViewerTab === "split" && (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
            <ThemedSplitView
              oldValue={parseValue(previousValue)}
              newValue={parseValue(currentValue)}
              differences={[]}
              theme={diffThemes.devToolsDefault}
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
          </ScrollView>
        )}

        {diffViewerTab === "tree" && (
          <TreeDiffViewer
            oldValue={parseValue(previousValue)}
            newValue={parseValue(currentValue)}
          />
        )}
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

      {(isLeftPickerOpen || isRightPickerOpen) && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={() => {
              setIsLeftPickerOpen(false);
              setIsRightPickerOpen(false);
            }}
          />
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                Select {isLeftPickerOpen ? "PREV" : "CUR"} Event
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsLeftPickerOpen(false);
                  setIsRightPickerOpen(false);
                }}
                style={styles.pickerClose}
                accessibilityLabel="Close event picker"
              >
                <X size={16} color={gameUIColors.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerDivider} />

            <ScrollView
              style={styles.pickerScroll}
              contentContainerStyle={styles.pickerList}
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              {navigationItems.map((item, idx) => {
                const disabled = isLeftPickerOpen
                  ? idx >= rightIndex
                  : idx <= leftIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={disabled}
                    onPress={() => {
                      if (isLeftPickerOpen) {
                        setLeftIndex(Math.min(idx, rightIndex - 1));
                        setIsLeftPickerOpen(false);
                      } else {
                        setRightIndex(Math.max(idx, leftIndex + 1));
                        setIsRightPickerOpen(false);
                      }
                    }}
                    style={[
                      styles.pickerItem,
                      disabled && styles.pickerItemDisabled,
                    ]}
                  >
                    <Text style={styles.pickerIndex}>#{idx + 1}</Text>
                    <Text style={styles.pickerTime}>
                      {formatTimeWithMs(item.timestamp)}
                    </Text>
                    <Text style={styles.pickerRelative}>
                      ({formatRelativeTime(item.timestamp)})
                    </Text>
                    {(() => {
                      const targetOld = isLeftPickerOpen
                        ? item
                        : navigationItems[leftIndex];
                      const targetNew = isLeftPickerOpen
                        ? navigationItems[rightIndex]
                        : item;
                      const oldVal = parseValue(targetOld.data?.value);
                      const newVal = parseValue(targetNew.data?.value);
                      const diffs = computeLineDiff(oldVal, newVal, {
                        compareMethod: "words",
                        disableWordDiff: false,
                        showDiffOnly: false,
                        contextLines: 0,
                      });
                      const added = diffs.filter(
                        (d) => d.type === DiffType.ADDED,
                      ).length;
                      const removed = diffs.filter(
                        (d) => d.type === DiffType.REMOVED,
                      ).length;
                      const modified = diffs.filter(
                        (d) => d.type === DiffType.MODIFIED,
                      ).length;
                      return (
                        <View style={styles.pickerCounts}>
                          <Text
                            style={[
                              styles.pickerCountText,
                              {
                                color:
                                  diffThemes.devToolsDefault.summaryAddedText,
                              },
                            ]}
                          >
                            +{added}
                          </Text>
                          <Text
                            style={[
                              styles.pickerCountText,
                              {
                                color:
                                  diffThemes.devToolsDefault.summaryRemovedText,
                              },
                            ]}
                          >
                            -{removed}
                          </Text>
                          <Text
                            style={[
                              styles.pickerCountText,
                              {
                                color:
                                  diffThemes.devToolsDefault
                                    .summaryModifiedText,
                              },
                            ]}
                          >
                            ~{modified}
                          </Text>
                        </View>
                      );
                    })()}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Bottom Navigation - Fixed at bottom */}
      {totalEvents > 1 && !disableInternalFooter && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            onPress={() =>
              onEventIndexChange(Math.max(0, selectedEventIndex - 1))
            }
            disabled={selectedEventIndex === 0}
            style={[
              styles.navButton,
              selectedEventIndex === 0 && styles.navButtonDisabled,
            ]}
          >
            <ChevronLeft
              size={20}
              color={
                selectedEventIndex === 0
                  ? gameUIColors.muted
                  : gameUIColors.primary
              }
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
              {formatRelativeTime(
                navigationItems[selectedEventIndex]?.timestamp,
              )}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              onEventIndexChange(
                Math.min(totalEvents - 1, selectedEventIndex + 1),
              )
            }
            disabled={selectedEventIndex === totalEvents - 1}
            style={[
              styles.navButton,
              selectedEventIndex === totalEvents - 1 &&
                styles.navButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.navButtonText,
                selectedEventIndex === totalEvents - 1 &&
                  styles.navButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <ChevronRight
              size={20}
              color={
                selectedEventIndex === totalEvents - 1
                  ? gameUIColors.muted
                  : gameUIColors.primary
              }
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
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
  const totalEvents = navigationItems.length;

  if (totalEvents <= 1) return null;

  return (
    <View style={styles.externalFooterBar}>
      <TouchableOpacity
        onPress={() => onEventIndexChange(Math.max(0, selectedEventIndex - 1))}
        disabled={selectedEventIndex === 0}
        style={[
          styles.navButton,
          selectedEventIndex === 0 && styles.navButtonDisabled,
        ]}
      >
        <ChevronLeft
          size={20}
          color={
            selectedEventIndex === 0 ? gameUIColors.muted : gameUIColors.primary
          }
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
        onPress={() =>
          onEventIndexChange(Math.min(totalEvents - 1, selectedEventIndex + 1))
        }
        disabled={selectedEventIndex === totalEvents - 1}
        style={[
          styles.navButton,
          selectedEventIndex === totalEvents - 1 && styles.navButtonDisabled,
        ]}
      >
        <Text
          style={[
            styles.navButtonText,
            selectedEventIndex === totalEvents - 1 &&
              styles.navButtonTextDisabled,
          ]}
        >
          Next
        </Text>
        <ChevronRight
          size={20}
          color={
            selectedEventIndex === totalEvents - 1
              ? gameUIColors.muted
              : gameUIColors.primary
          }
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
    flex: 1,
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
  // Compare picker styles
  compareBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: gameUIColors.panel + "40",
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    gap: 8,
  },
  compareSide: {
    flex: 1,
  },
  compareLabel: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  compareControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compareBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: gameUIColors.blackTint2,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  compareBtnDisabled: {
    opacity: 0.4,
  },
  compareMeta: {
    flex: 1,
  },
  compareTime: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
  },
  compareIndex: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  compareRelative: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  compareDivider: {
    width: 1,
    height: 34,
    backgroundColor: gameUIColors.border + "40",
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerCard: {
    width: "86%",
    maxHeight: 320,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "60",
    padding: 12,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerClose: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: gameUIColors.blackTint2,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  pickerDivider: {
    height: 1,
    backgroundColor: gameUIColors.border + "40",
    marginVertical: 8,
  },
  pickerScroll: {
    maxHeight: 260,
  },
  pickerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: gameUIColors.primary,
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  pickerList: {
    gap: 4,
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: gameUIColors.blackTint2,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  pickerItemDisabled: {
    opacity: 0.4,
  },
  pickerIndex: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    width: 40,
  },
  pickerTime: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    flex: 1,
  },
  pickerRelative: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  pickerCounts: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  pickerCountText: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  diffViewerTabs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: gameUIColors.panel + "40",
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 8,
    gap: 4,
  },
  diffViewerTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  diffViewerTabActive: {
    backgroundColor: gameUIColors.primary + "20",
    borderWidth: 1,
    borderColor: gameUIColors.primary + "40",
  },
  diffViewerTabText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "600",
    color: gameUIColors.secondary,
    letterSpacing: 0.5,
  },
  diffViewerTabTextActive: {
    color: gameUIColors.primary,
  },
});
