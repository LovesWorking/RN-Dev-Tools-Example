import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { CloseButton } from "@/rn-better-dev-tools/src/shared/ui/components/CloseButton";
import { StorageBrowserMode } from "./StorageBrowserMode";
import { RequiredStorageKey } from "../types";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HardDrive,
  Database,
  Pause,
  Play,
  Trash2,
  Filter,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight,
  Key,
} from "rn-better-dev-tools/icons";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  startListening,
  stopListening,
  addListener,
  AsyncStorageEvent,
  isListening as checkIsListening,
} from "../utils/AsyncStorageListener";
import { formatRelativeTime } from "@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime";
import {
  StorageEventDetailContent,
  StorageEventDetailFooter,
} from "./StorageEventDetailContent";
import { StorageFilterView } from "./StorageFilterView";
import { ValueTypeBadge } from "@/rn-better-dev-tools/src/shared/ui/components/ValueTypeBadge";

interface StorageModalWithTabsProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  requiredStorageKeys?: RequiredStorageKey[];
}

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

type TabType = "browser" | "events";

export function StorageModalWithTabs({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
  requiredStorageKeys = [],
}: StorageModalWithTabsProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const [activeTab, setActiveTab] = useState<TabType>("browser");
  const theme = useTheme();

  // Event Listener state
  const [events, setEvents] = useState<AsyncStorageEvent[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedConversationKey, setSelectedConversationKey] = useState<
    string | null
  >(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [detailTab, setDetailTab] = useState<"current" | "diff">("current");
  const [ignoredPatterns, setIgnoredPatterns] = useState<Set<string>>(
    new Set(["@RNAsyncStorage", "redux-persist", "@devtools", "persist:"])
  );
  const lastEventRef = useRef<AsyncStorageEvent | null>(null);
  const hasLoadedFilters = useRef(false);

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  // Timer removed - using useTickEveryMinute hook instead

  // Load persisted filters on mount
  useEffect(() => {
    if (!visible || hasLoadedFilters.current) return;

    const loadFilters = async () => {
      try {
        const { default: AsyncStorage } = await import(
          "@react-native-async-storage/async-storage"
        );
        const storedFilters = await AsyncStorage.getItem(
          devToolsStorageKeys.storage.eventFilters()
        );
        if (storedFilters) {
          const filters = JSON.parse(storedFilters) as string[];
          setIgnoredPatterns(new Set(filters));
        }
        hasLoadedFilters.current = true;
      } catch (error) {
        console.warn("Failed to load storage event filters:", error);
      }
    };

    loadFilters();
  }, [visible]);

  // Save filters when they change
  useEffect(() => {
    if (!hasLoadedFilters.current) return; // Don't save on initial load

    const saveFilters = async () => {
      try {
        const { default: AsyncStorage } = await import(
          "@react-native-async-storage/async-storage"
        );
        const filters = Array.from(ignoredPatterns);
        await AsyncStorage.setItem(
          devToolsStorageKeys.storage.eventFilters(),
          JSON.stringify(filters)
        );
      } catch (error) {
        console.warn("Failed to save storage event filters:", error);
      }
    };

    saveFilters();
  }, [ignoredPatterns]);

  // Event listener setup
  useEffect(() => {
    if (!visible) return;

    // Check if already listening
    const listening = checkIsListening();
    setIsListening(listening);

    // Set up event listener
    const unsubscribe = addListener((event) => {
      lastEventRef.current = event;
      setEvents((prev) => {
        const updated = [event, ...prev];
        return updated.slice(0, 500);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [visible]);

  const handleToggleListening = useCallback(async () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      await startListening();
      setIsListening(true);
    }
  }, [isListening]);

  // Format precise time like HH:MM:SS.mmm
  const formatTimeWithMs = useCallback((date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }, []);

  const handleClearEvents = useCallback(() => {
    setEvents([]);
    setSelectedConversationKey(null);
  }, []);

  const handleConversationPress = useCallback(
    (conversation: StorageKeyConversation) => {
      setSelectedConversationKey(conversation.key);
      setSelectedEventIndex(0);
      setDetailTab("current");
    },
    []
  );

  const handleTogglePattern = useCallback((pattern: string) => {
    setIgnoredPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(pattern)) {
        next.delete(pattern);
      } else {
        next.add(pattern);
      }
      return next;
    });
  }, []);

  const handleAddPattern = useCallback((pattern: string) => {
    setIgnoredPatterns((prev) => new Set([...prev, pattern]));
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

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

  const getValueType = (
    value: unknown
  ): StorageKeyConversation["valueType"] => {
    const parsed = parseValue(value);
    if (parsed === null) return "null";
    if (parsed === undefined) return "undefined";
    if (Array.isArray(parsed)) return "array";
    if (typeof parsed === "boolean") return "boolean";
    if (typeof parsed === "number") return "number";
    if (typeof parsed === "string") return "string";
    if (typeof parsed === "object") return "object";
    return "undefined";
  };

  // Get all unique keys from events (including filtered ones for filter view)
  const allEventKeys = useMemo(() => {
    const keys = new Set<string>();
    events.forEach((event) => {
      if (event.data?.key) {
        keys.add(event.data.key);
      }
    });
    return Array.from(keys).sort();
  }, [events]);

  // Group events by key and create conversations
  const conversations = useMemo(() => {
    const keyMap = new Map<string, StorageKeyConversation>();

    events.forEach((event) => {
      if (!event.data?.key) return;

      const key = event.data.key;

      // Filter out keys that match ignored patterns
      const shouldIgnore = Array.from(ignoredPatterns).some((pattern) =>
        key.includes(pattern)
      );

      if (shouldIgnore) return;

      const existing = keyMap.get(key);

      if (!existing) {
        keyMap.set(key, {
          key,
          lastEvent: event,
          events: [event],
          totalOperations: 1,
          currentValue: event.data.value,
          valueType: getValueType(event.data.value),
        });
      } else {
        existing.events.push(event);
        existing.totalOperations++;

        // Update last event if this one is newer
        if (event.timestamp > existing.lastEvent.timestamp) {
          existing.lastEvent = event;
          existing.currentValue = event.data.value;
          existing.valueType = getValueType(event.data.value);
        }
      }
    });

    // Convert to array and sort by last updated
    return Array.from(keyMap.values()).sort(
      (a, b) =>
        b.lastEvent.timestamp.getTime() - a.lastEvent.timestamp.getTime()
    );
  }, [events, ignoredPatterns]);

  // Get the live selected conversation from the current conversations array
  const selectedConversation = useMemo(() => {
    if (!selectedConversationKey) return null;
    return conversations.find((c) => c.key === selectedConversationKey) || null;
  }, [selectedConversationKey, conversations]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "setItem":
      case "multiSet":
        return gameUIColors.success;
      case "removeItem":
      case "multiRemove":
      case "clear":
        return gameUIColors.error;
      case "mergeItem":
      case "multiMerge":
        return gameUIColors.info;
      default:
        return gameUIColors.muted;
    }
  };

  // FlatList optimization constants
  const ESTIMATED_ITEM_SIZE = 80;
  const END_REACHED_THRESHOLD = 0.8;

  // Stable keyExtractor for FlatList
  const keyExtractor = useCallback((item: StorageKeyConversation) => {
    return item.key;
  }, []);

  // Removed getItemType as it's FlatList-specific

  // Create stable ref for event handler
  const selectConversationRef = useRef<
    ((conversation: StorageKeyConversation) => void) | undefined
  >(undefined);
  selectConversationRef.current = handleConversationPress;

  // Stable renderItem with ref pattern
  const renderConversationItem = useCallback(
    ({ item }: { item: StorageKeyConversation }) => {
      return (
        <TouchableOpacity
          onPress={() => selectConversationRef.current?.(item)}
          style={styles.conversationItem}
        >
          <View style={styles.conversationHeader}>
            <Text style={styles.keyText} numberOfLines={1}>
              {item.key}
            </Text>
            <Text
              style={[
                styles.actionText,
                { color: getActionColor(item.lastEvent.action) },
              ]}
            >
              {item.lastEvent.action}
            </Text>
          </View>
          <View style={styles.conversationDetails}>
            <ValueTypeBadge type={item.valueType} />
            <Text style={styles.operationCount}>
              {item.totalOperations} operation
              {item.totalOperations !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.timestamp}>
              {formatRelativeTime(item.lastEvent.timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    []
  );

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.storage.modal();

  const renderHeaderContent = () => {
    // Show filters
    if (showFilters) {
      return (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => setShowFilters(false)}
            color={gameUIColors.primary}
            size={16}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            Filters
          </Text>
          <View style={{ marginLeft: "auto" }}>
            <CloseButton onPress={onClose} />
          </View>
        </View>
      );
    }

    // Show detail view with tabs
    if (selectedConversation) {
      return (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => {
              setSelectedConversationKey(null);
              setSelectedEventIndex(0);
              setDetailTab("current");
            }}
            color={gameUIColors.primary}
            size={16}
          />

          <View style={styles.tabNavigationContainer}>
            <TouchableOpacity
              onPress={() => setDetailTab("current")}
              style={[
                styles.tabButton,
                detailTab === "current" && styles.tabButtonActive,
              ]}
            >
              <Database
                size={12}
                color={
                  detailTab === "current"
                    ? gameUIColors.info
                    : gameUIColors.secondary
                }
              />
              <Text
                style={[
                  styles.tabButtonText,
                  detailTab === "current"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                Current Value
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDetailTab("diff")}
              style={[
                styles.tabButton,
                detailTab === "diff" && styles.tabButtonActive,
              ]}
            >
              <Activity
                size={12}
                color={
                  detailTab === "diff"
                    ? gameUIColors.warning
                    : gameUIColors.secondary
                }
              />
              <Text
                style={[
                  styles.tabButtonText,
                  detailTab === "diff"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                Diff
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <CloseButton onPress={onClose} />
          </View>
        </View>
      );
    }

    // Main header with tabs
    return (
      <View style={styles.headerContainer}>
        {onBack && (
          <BackButton onPress={onBack} color={gameUIColors.primary} size={16} />
        )}

        <View style={styles.tabNavigationContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("browser")}
            style={[
              styles.tabButton,
              activeTab === "browser"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <HardDrive
              size={14}
              color={
                activeTab === "browser"
                  ? gameUIColors.storage
                  : gameUIColors.secondary
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "browser"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              Storage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("events")}
            style={[
              styles.tabButton,
              activeTab === "events"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Activity
              size={14}
              color={
                activeTab === "events"
                  ? gameUIColors.storage
                  : gameUIColors.secondary
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "events"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              Events
            </Text>
            {events.length > 0 && activeTab !== "events" && (
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>{events.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action buttons for Events tab */}
        {activeTab === "events" && !showFilters && !selectedConversation && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleToggleFilters}
              style={[
                styles.iconButton,
                ignoredPatterns.size > 0 && styles.activeFilterButton,
              ]}
            >
              <Filter
                size={14}
                color={
                  ignoredPatterns.size > 0
                    ? gameUIColors.optional
                    : gameUIColors.secondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleListening}
              style={[styles.iconButton, isListening && styles.activeButton]}
            >
              {isListening ? (
                <Pause size={14} color={gameUIColors.success} />
              ) : (
                <Play size={14} color={gameUIColors.success} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClearEvents}
              style={styles.iconButton}
            >
              <Trash2 size={14} color={gameUIColors.error} />
            </TouchableOpacity>
          </View>
        )}

        {/* Always show a close button on the far right */}
        <View style={{ marginLeft: "auto" }}>
          <CloseButton onPress={onClose} />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (activeTab === "browser") {
      return (
        <StorageBrowserMode
          selectedQuery={undefined}
          onQuerySelect={() => {}}
          requiredStorageKeys={requiredStorageKeys}
        />
      );
    }

    // Events tab content
    if (selectedConversation) {
      return (
        <View style={styles.contentWrapper}>
          <View style={styles.keyNameHeader}>
            <HardDrive size={16} color={gameUIColors.storage} />
            <Text style={styles.keyNameHeaderText} numberOfLines={1}>
              {selectedConversation.key}
            </Text>
          </View>
          {/* Last updated timestamp under the key */}
          <View style={styles.keyMetaRow}>
            <Text style={styles.keyMetaTime}>
              {formatTimeWithMs(selectedConversation.lastEvent.timestamp)}
            </Text>
            <Text style={styles.keyMetaRelative}>
              ({formatRelativeTime(selectedConversation.lastEvent.timestamp)})
            </Text>
          </View>
          <StorageEventDetailContent
            conversation={selectedConversation}
            activeTab={detailTab}
            selectedEventIndex={selectedEventIndex}
            onEventIndexChange={setSelectedEventIndex}
            disableInternalFooter={true}
          />
        </View>
      );
    }

    if (showFilters) {
      return (
        <StorageFilterView
          ignoredPatterns={ignoredPatterns}
          onTogglePattern={handleTogglePattern}
          onAddPattern={handleAddPattern}
          onBack={() => setShowFilters(false)}
          availableKeys={allEventKeys}
        />
      );
    }

    if (conversations.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Database size={48} color={gameUIColors.muted} noBackground={true} />
          <Text style={styles.emptyTitle}>
            {isListening ? "No storage events yet" : "Event listener is paused"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {isListening
              ? "Storage operations will appear here"
              : "Press play to start monitoring"}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        scrollEnabled={false}
      />
    );
  };

  const footerNode = selectedConversation ? (
    <StorageEventDetailFooter
      conversation={selectedConversation}
      selectedEventIndex={selectedEventIndex}
      onEventIndexChange={setSelectedEventIndex}
    />
  ) : null;

  return (
    <ClaudeModal60FPSClean
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: renderHeaderContent(),
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
      styles={{}}
      footer={footerNode}
      footerHeight={footerNode ? 68 : 0}
    >
      {renderContent()}
    </ClaudeModal60FPSClean>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerTitle: {
    color: gameUIColors.primary,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  tabNavigationContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    height: 32,
    alignItems: "center",
  },

  tabButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 1,
    flexDirection: "row",
    gap: 4,
  },

  tabButtonActive: {
    backgroundColor: gameUIColors.storage + "20",
    borderWidth: 1,
    borderColor: gameUIColors.storage + "40",
  },

  tabButtonInactive: {
    backgroundColor: "transparent",
  },

  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontFamily: "monospace",
    textTransform: "uppercase",
    color: gameUIColors.secondary, // Default color
  },

  tabButtonTextActive: {
    color: gameUIColors.primary,
  },

  tabButtonTextInactive: {
    color: gameUIColors.secondary,
  },

  eventBadge: {
    backgroundColor: gameUIColors.error + "20",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 16,
    alignItems: "center",
  },

  eventBadgeText: {
    color: gameUIColors.error,
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },

  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: gameUIColors.panel + "40",
  },

  activeButton: {
    backgroundColor: gameUIColors.success + "26",
  },

  activeFilterButton: {
    backgroundColor: gameUIColors.optional + "26",
  },

  conversationItem: {
    padding: 12,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    marginHorizontal: 16,
  },

  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  keyText: {
    color: gameUIColors.primary,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
    fontFamily: "monospace",
  },

  actionText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },

  conversationDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  operationCount: {
    color: gameUIColors.secondary,
    fontSize: 11,
    flex: 1,
    fontFamily: "monospace",
  },

  timestamp: {
    color: gameUIColors.muted,
    fontSize: 11,
    fontFamily: "monospace",
  },

  separator: {
    height: 8,
  },

  listContent: {
    paddingVertical: 16,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  emptyTitle: {
    color: gameUIColors.primary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  emptySubtitle: {
    color: gameUIColors.secondary,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "monospace",
  },

  eventNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },

  navButton: {
    padding: 4,
    borderRadius: 4,
  },

  navButtonDisabled: {
    opacity: 0.3,
  },

  eventCounter: {
    color: gameUIColors.primary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace",
    paddingHorizontal: 8,
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  keyNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: gameUIColors.panel + "40",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.storage + "20",
    height: 28,
  },

  keyNameText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: gameUIColors.storage,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },

  contentWrapper: {
    flex: 1,
  },

  keyNameHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.panel + "40",
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },

  keyNameHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.storage,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },

  keyMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: gameUIColors.panel + "40",
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "10",
  },
  keyMetaTime: {
    color: gameUIColors.primary,
    fontSize: 12,
    fontFamily: "monospace",
  },
  keyMetaRelative: {
    color: gameUIColors.secondary,
    fontSize: 12,
    fontFamily: "monospace",
  },
});
