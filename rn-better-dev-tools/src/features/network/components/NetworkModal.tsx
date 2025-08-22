import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";
import {
  Globe,
  Trash2,
  Power,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  X,
  Link,
} from "lucide-react-native";
import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { NetworkEventItemCompact } from "./NetworkEventItemCompact";
import { NetworkFilterView } from "./NetworkFilterView";
import { TickProvider } from "../../sentry/hooks/useTickEveryMinute";
import { NetworkEventDetailView } from "./NetworkEventDetailView";
import { NetworkDevTestMode } from "./NetworkDevTestMode";
import { useNetworkEvents } from "../hooks/useNetworkEvents";
import type { NetworkEvent } from "../types";

interface NetworkModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
}

// Decompose by Responsibility: Extract empty state component
function EmptyState({ isEnabled }: { isEnabled: boolean }) {
  return (
    <View style={styles.emptyState}>
      <Globe size={32} color="#374151" />
      <Text style={styles.emptyTitle}>No network events</Text>
      <Text style={styles.emptyText}>
        {isEnabled
          ? "Network requests will appear here"
          : "Enable interception to start capturing"}
      </Text>
    </View>
  );
}

function NetworkModalInner({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
}: NetworkModalProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const theme = useTheme();
  const {
    events,
    stats,
    filter,
    setFilter,
    clearEvents,
    isEnabled,
    toggleInterception,
  } = useNetworkEvents();

  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [showFilterView, setShowFilterView] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [ignoredDomains, setIgnoredDomains] = useState<Set<string>>(new Set());
  const [ignoredUrls, setIgnoredUrls] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlashList<NetworkEvent>>(null);
  const hasLoadedFilters = useRef(false);

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  // Load persisted filters on mount
  useEffect(() => {
    if (!visible || hasLoadedFilters.current) return;

    const loadFilters = async () => {
      try {
        const { default: AsyncStorage } = await import(
          "@react-native-async-storage/async-storage"
        );

        // Load ignored domains
        const storedDomains = await AsyncStorage.getItem(
          devToolsStorageKeys.network.ignoredDomains()
        );
        if (storedDomains) {
          const domains = JSON.parse(storedDomains) as string[];
          setIgnoredDomains(new Set(domains));
        }

        // Load ignored URLs
        const storedUrls = await AsyncStorage.getItem(
          devToolsStorageKeys.network.ignoredUrls()
        );
        if (storedUrls) {
          const urls = JSON.parse(storedUrls) as string[];
          setIgnoredUrls(new Set(urls));
        }

        hasLoadedFilters.current = true;
      } catch (error) {
        console.warn("Failed to load network filters:", error);
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

        // Save ignored domains
        const domains = Array.from(ignoredDomains);
        await AsyncStorage.setItem(
          devToolsStorageKeys.network.ignoredDomains(),
          JSON.stringify(domains)
        );

        // Save ignored URLs
        const urls = Array.from(ignoredUrls);
        await AsyncStorage.setItem(
          devToolsStorageKeys.network.ignoredUrls(),
          JSON.stringify(urls)
        );
      } catch (error) {
        console.warn("Failed to save network filters:", error);
      }
    };

    saveFilters();
  }, [ignoredDomains, ignoredUrls]);

  // Simple handlers - no useCallback needed per rule2
  const handleEventPress = (event: NetworkEvent) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilter((prev) => ({ ...prev, searchText: text }));
  };

  // Filter events based on ignored patterns
  const filteredEvents = useMemo(() => {
    if (ignoredDomains.size === 0 && ignoredUrls.size === 0) return events;

    return events.filter((event) => {
      const url = event.url.toLowerCase();

      // Check domain filters
      if (ignoredDomains.size > 0) {
        try {
          const urlObj = new URL(event.url);
          const hostname = urlObj.hostname.toLowerCase();
          if (
            Array.from(ignoredDomains).some((domain) =>
              hostname.includes(domain.toLowerCase())
            )
          ) {
            return false;
          }
        } catch {
          // If URL parsing fails, check as string
        }
      }

      // Check URL pattern filters
      if (ignoredUrls.size > 0) {
        if (
          Array.from(ignoredUrls).some((pattern) =>
            url.includes(pattern.toLowerCase())
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [events, ignoredDomains, ignoredUrls]);

  // FlashList optimization - only keep what's needed for FlashList performance
  const ESTIMATED_ITEM_SIZE = 52;
  const keyExtractor = (item: NetworkEvent) => item.id;
  const getItemType = () => "network-event";

  // Keep renderItem memoized for FlashList performance (justified by FlashList docs)
  const renderItem = useMemo(() => {
    return ({ item }: { item: NetworkEvent }) => (
      <NetworkEventItemCompact event={item} onPress={handleEventPress} />
    );
  }, []); // Empty deps OK - handleEventPress defined inline

  // Compact header with actions (like Sentry/Storage modals)
  const renderHeaderContent = () => {
    if (showDevMode) {
      return (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => setShowDevMode(false)}
            color={theme.colors.text}
          />
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
                fontFamily:
                  theme.name === "cyberpunk" ? "monospace" : undefined,
                fontSize: theme.name === "cyberpunk" ? 14 : 14,
                fontWeight: theme.name === "cyberpunk" ? "700" : "500",
                letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
                textTransform:
                  theme.name === "cyberpunk" ? "uppercase" : undefined,
              },
            ]}
          >
            {theme.name === "cyberpunk" ? "// DEV TEST MODE" : "Dev Test Mode"}
          </Text>
        </View>
      );
    }
    if (showFilterView) {
      return (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => setShowFilterView(false)}
            color={theme.colors.text}
          />
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
                fontFamily:
                  theme.name === "cyberpunk" ? "monospace" : undefined,
                fontSize: theme.name === "cyberpunk" ? 14 : 14,
                fontWeight: theme.name === "cyberpunk" ? "700" : "500",
                letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
                textTransform:
                  theme.name === "cyberpunk" ? "uppercase" : undefined,
              },
            ]}
          >
            {theme.name === "cyberpunk" ? "// FILTERS" : "Filters"}
          </Text>
        </View>
      );
    }

    // Don't show main header action buttons when viewing event details
    if (selectedEvent) {
      return (
        <View style={styles.headerContainer}>
          <BackButton onPress={handleBack} color={theme.colors.text} />
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
                fontFamily:
                  theme.name === "cyberpunk" ? "monospace" : undefined,
                fontSize: theme.name === "cyberpunk" ? 14 : 14,
                fontWeight: theme.name === "cyberpunk" ? "700" : "500",
                letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
                textTransform:
                  theme.name === "cyberpunk" ? "uppercase" : undefined,
              },
            ]}
          >
            {theme.name === "cyberpunk"
              ? "// REQUEST DETAILS"
              : "Request Details"}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.headerContainer}>
        {onBack ? (
          <BackButton onPress={onBack} color={theme.colors.text} />
        ) : null}

        <View style={styles.headerStats}>
          <Text
            style={[
              styles.headerStatsText,
              {
                color: theme.colors.text,
                fontFamily:
                  theme.name === "cyberpunk" ? "monospace" : undefined,
                fontSize: theme.name === "cyberpunk" ? 11 : 12,
                letterSpacing: theme.name === "cyberpunk" ? 0.5 : undefined,
              },
            ]}
          >
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "REQUEST" : "REQUESTS"}
          </Text>
          {events.length - filteredEvents.length > 0 ? (
            <Text
              style={[
                styles.headerFilteredText,
                {
                  color: "#F59E0B",
                  fontFamily:
                    theme.name === "cyberpunk" ? "monospace" : undefined,
                  fontSize: theme.name === "cyberpunk" ? 10 : 11,
                },
              ]}
            >
              ({events.length - filteredEvents.length} HIDDEN)
            </Text>
          ) : null}
          {isEnabled ? (
            <View
              style={[
                styles.listeningIndicator,
                {
                  backgroundColor:
                    theme.name === "cyberpunk"
                      ? theme.colors.networkColor
                      : "#10B981",
                },
              ]}
            />
          ) : null}
        </View>

        {/* Action buttons in header */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            sentry-label="ignore dev mode"
            onPress={() => setShowDevMode(true)}
            style={[
              styles.headerActionButton,
              showDevMode && styles.activeDevButton,
            ]}
          >
            <Zap size={14} color={showDevMode ? "#EF4444" : "#6B7280"} />
          </TouchableOpacity>

          <TouchableOpacity
            sentry-label="ignore filter"
            onPress={() => setShowFilterView(true)}
            style={[
              styles.headerActionButton,
              (filter.status || filter.method || filter.contentType) &&
                styles.activeFilterButton,
            ]}
          >
            <Filter
              size={14}
              color={
                filter.status || filter.method || filter.contentType
                  ? "#8B5CF6"
                  : "#6B7280"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            sentry-label="ignore toggle interception"
            onPress={toggleInterception}
            style={[
              styles.headerActionButton,
              isEnabled ? styles.startButton : styles.stopButton,
            ]}
          >
            <Power size={14} color={isEnabled ? "#10B981" : "#EF4444"} />
          </TouchableOpacity>

          <TouchableOpacity
            sentry-label="ignore clear events"
            onPress={clearEvents}
            style={styles.headerActionButton}
            disabled={events.length === 0}
          >
            <Trash2
              size={14}
              color={events.length > 0 ? "#6B7280" : "#374151"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Search size={14} color="#9CA3AF" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search URL, method, error..."
        placeholderTextColor="#6B7280"
        value={searchText}
        onChangeText={handleSearch}
        sentry-label="ignore network search"
        accessibilityLabel="Search network requests"
      />
      {searchText.length > 0 ? (
        <TouchableOpacity
          onPress={() => handleSearch("")}
          sentry-label="ignore clear search"
        >
          <X size={16} color="#9CA3AF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.network.modal();

  if (!visible) return null;

  // Show detail view if an event is selected
  if (selectedEvent) {
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
      >
        <View style={styles.container}>
          <NetworkEventDetailView
            event={selectedEvent}
            onBack={handleBack}
            ignoredDomains={ignoredDomains}
            ignoredUrls={ignoredUrls}
            onToggleDomain={(domain) => {
              const newDomains = new Set(ignoredDomains);
              if (newDomains.has(domain)) {
                newDomains.delete(domain);
              } else {
                newDomains.add(domain);
              }
              setIgnoredDomains(newDomains);
            }}
            onToggleUrl={(url) => {
              const newUrls = new Set(ignoredUrls);
              if (newUrls.has(url)) {
                newUrls.delete(url);
              } else {
                newUrls.add(url);
              }
              setIgnoredUrls(newUrls);
            }}
          />
        </View>
      </ClaudeModal60FPSClean>
    );
  }

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
    >
      <View style={styles.container}>
        {/* Show dev mode if active */}
        {showDevMode ? (
          <NetworkDevTestMode onClose={() => setShowDevMode(false)} />
        ) : showFilterView ? (
          <NetworkFilterView
            events={events}
            filter={filter}
            onFilterChange={setFilter}
            onClose={() => setShowFilterView(false)}
            ignoredDomains={ignoredDomains}
            ignoredUrls={ignoredUrls}
            onToggleDomain={(domain) => {
              const newDomains = new Set(ignoredDomains);
              if (newDomains.has(domain)) {
                newDomains.delete(domain);
              } else {
                newDomains.add(domain);
              }
              setIgnoredDomains(newDomains);
            }}
            onAddDomain={(domain) => {
              const newDomains = new Set(ignoredDomains);
              newDomains.add(domain);
              setIgnoredDomains(newDomains);
            }}
            onToggleUrl={(url) => {
              const newUrls = new Set(ignoredUrls);
              if (newUrls.has(url)) {
                newUrls.delete(url);
              } else {
                newUrls.add(url);
              }
              setIgnoredUrls(newUrls);
            }}
            onAddUrl={(url) => {
              const newUrls = new Set(ignoredUrls);
              newUrls.add(url);
              setIgnoredUrls(newUrls);
            }}
          />
        ) : (
          <>
            {renderSearchBar()}

            {/* Compact stats bar - clickable for quick filtering */}
            <View style={styles.statsBar}>
              <TouchableOpacity
                style={[
                  styles.statChip,
                  filter.status === "success" && styles.statChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "success" ? undefined : "success",
                  })
                }
              >
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.statValue}>{stats.successfulRequests}</Text>
                <Text style={styles.statLabel}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statChip,
                  filter.status === "error" && styles.statChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "error" ? undefined : "error",
                  })
                }
              >
                <XCircle size={12} color="#EF4444" />
                <Text style={[styles.statValue, styles.errorText]}>
                  {stats.failedRequests}
                </Text>
                <Text style={styles.statLabel}>ERR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statChip,
                  filter.status === "pending" && styles.statChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "pending" ? undefined : "pending",
                  })
                }
              >
                <Clock size={12} color="#F59E0B" />
                <Text style={[styles.statValue, styles.pendingText]}>
                  {stats.pendingRequests}
                </Text>
                <Text style={styles.statLabel}>WAIT</Text>
              </TouchableOpacity>
            </View>

            {!isEnabled ? (
              <View style={styles.disabledBanner}>
                <Power size={14} color="#F59E0B" />
                <Text style={styles.disabledText}>
                  Network interception is disabled
                </Text>
              </View>
            ) : null}

            {/* Use FlashList for performance */}
            {filteredEvents.length > 0 ? (
              <FlashList
                ref={flatListRef}
                data={filteredEvents}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemType={getItemType}
                estimatedItemSize={ESTIMATED_ITEM_SIZE}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator
                removeClippedSubviews
                onEndReachedThreshold={0.8}
                renderScrollComponent={ScrollView}
                sentry-label="ignore network events list"
              />
            ) : (
              <EmptyState isEnabled={isEnabled} />
            )}
          </>
        )}
      </View>
    </ClaudeModal60FPSClean>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
  },
  // Compact header styles matching Sentry/Storage modals
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    minHeight: 32,
    paddingLeft: 4,
  },
  headerTitle: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerStatsText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  headerFilteredText: {
    fontSize: 11,
    color: "#F59E0B",
    fontWeight: "500",
    marginLeft: 4,
  },
  listeningIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  headerActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: "auto",
    marginRight: 4,
  },
  headerActionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  stopButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  activeFilterButton: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  activeDevButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  activeIgnoreButton: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  detailHeaderActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: "auto",
    marginRight: 4,
  },
  // Search bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    marginLeft: 6,
  },
  // Stats bar
  statsBar: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  statChipActive: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  errorText: {
    color: "#EF4444",
  },
  pendingText: {
    color: "#F59E0B",
  },
  disabledBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  disabledText: {
    color: "#F59E0B",
    fontSize: 11,
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },
});

// Export with TickProvider wrapper
export function NetworkModal(props: NetworkModalProps) {
  return (
    <TickProvider>
      <NetworkModalInner {...props} />
    </TickProvider>
  );
}
