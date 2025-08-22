import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import ClaudeModal60FPSClean, { type ModalMode } from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { StorageBrowserMode } from "./StorageBrowserMode";
import { RequiredStorageKey } from "../types";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";
import { HardDrive, Database, Pause, Play, Trash2, Filter, Activity, Clock } from "lucide-react-native";
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
import { formatRelativeTime } from "../utils/formatRelativeTime";
import { StorageEventDetailContent } from "./StorageEventDetailContent";
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
  const [selectedConversation, setSelectedConversation] = useState<StorageKeyConversation | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [detailTab, setDetailTab] = useState<"overview" | "changes">("overview");
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
        const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
        const storedFilters = await AsyncStorage.getItem(devToolsStorageKeys.storage.eventFilters());
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
        const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
        const filters = Array.from(ignoredPatterns);
        await AsyncStorage.setItem(devToolsStorageKeys.storage.eventFilters(), JSON.stringify(filters));
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

  const handleClearEvents = useCallback(() => {
    setEvents([]);
    setSelectedConversation(null);
  }, []);

  const handleConversationPress = useCallback(
    (conversation: StorageKeyConversation) => {
      setSelectedConversation(conversation);
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

  // FlashList optimization constants
  const ESTIMATED_ITEM_SIZE = 80;
  const END_REACHED_THRESHOLD = 0.8;

  // Stable keyExtractor for FlashList
  const keyExtractor = useCallback((item: StorageKeyConversation) => {
    return item.key;
  }, []);

  // Stable getItemType for FlashList optimization
  const getItemType = useCallback(() => {
    return "conversation";
  }, []);

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
              {item.totalOperations} operation{item.totalOperations !== 1 ? "s" : ""}
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
        </View>
      );
    }

    // Show detail view with tabs
    if (selectedConversation) {
      const keyStats = selectedConversation.events.length;
      const valueChanges = selectedConversation.events.filter(e => 
        e.action === "setItem" || e.action === "mergeItem" || e.action === "removeItem"
      ).length;

      return (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => {
              setSelectedConversation(null);
              setDetailTab("overview");
            }}
            color={gameUIColors.primary}
            size={16}
          />
          
          <View style={styles.tabNavigationContainer}>
            <TouchableOpacity
              onPress={() => setDetailTab("overview")}
              style={[
                styles.tabButton,
                detailTab === "overview" && styles.tabButtonActive,
              ]}
            >
              <Database size={12} color={detailTab === "overview" ? gameUIColors.storage : gameUIColors.secondary} />
              <Text style={[
                styles.tabButtonText,
                detailTab === "overview" ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
              ]}>
                Overview
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDetailTab("changes")}
              style={[
                styles.tabButton,
                detailTab === "changes" && styles.tabButtonActive,
              ]}
            >
              <Activity size={12} color={detailTab === "changes" ? gameUIColors.warning : gameUIColors.secondary} />
              <Text style={[
                styles.tabButtonText,
                detailTab === "changes" ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
              ]}>
                Changes
              </Text>
              <View style={[styles.eventBadge, { backgroundColor: gameUIColors.warning + "20" }]}>
                <Text style={[styles.eventBadgeText, { color: gameUIColors.warning }]}>
                  {keyStats}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Main header with tabs
    return (
      <View style={styles.headerContainer}>
        {onBack && <BackButton onPress={onBack} color={gameUIColors.primary} size={16} />}
        
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
            <HardDrive size={14} color={activeTab === "browser" ? gameUIColors.storage : gameUIColors.secondary} />
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
            <Activity size={14} color={activeTab === "events" ? gameUIColors.storage : gameUIColors.secondary} />
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
        <StorageEventDetailContent
          conversation={selectedConversation}
          activeTab={detailTab}
        />
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
          <Database size={48} color={gameUIColors.muted} />
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
      <FlashList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <ClaudeModal60FPSClean
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: renderHeaderContent()
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
     styles={{}}>
      {renderContent()}
    </ClaudeModal60FPSClean>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    minHeight: 32,
    paddingHorizontal: 12,
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
    justifyContent: "space-evenly",
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
    marginLeft: "auto",
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
});