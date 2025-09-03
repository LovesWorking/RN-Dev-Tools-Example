import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import {
  Globe,
  Trash2,
  Power,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "rn-better-dev-tools/icons";
import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";
import { TabSelector } from "@/rn-better-dev-tools/src/shared/ui/components/TabSelector";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";
import { NetworkEventItemCompact } from "./NetworkEventItemCompact";
import { NetworkFilterView } from "./NetworkFilterView";
import { TickProvider } from "../../sentry/hooks/useTickEveryMinute";
import { NetworkEventDetailView } from "./NetworkEventDetailView";
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
      <Globe size={32} color={gameUIColors.muted} />
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

  const handleModeChange = useCallback((_mode: ModalMode) => {
    // Mode changes handled by ClaudeModal60FPSClean
  }, []);

  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [showFilterView, setShowFilterView] = useState(false);
  const [filterViewTab, setFilterViewTab] = useState<
    "filters" | "domains" | "urls"
  >("filters");
  const [searchText, setSearchText] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const [ignoredDomains, setIgnoredDomains] = useState<Set<string>>(new Set());
  const [ignoredUrls, setIgnoredUrls] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList<NetworkEvent>>(null);
  const hasLoadedFilters = useRef(false);

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
          devToolsStorageKeys.network.ignoredDomains(),
        );
        if (storedDomains) {
          const domains = JSON.parse(storedDomains) as string[];
          setIgnoredDomains(new Set(domains));
        }

        // Load ignored URLs
        const storedUrls = await AsyncStorage.getItem(
          devToolsStorageKeys.network.ignoredUrls(),
        );
        if (storedUrls) {
          const urls = JSON.parse(storedUrls) as string[];
          setIgnoredUrls(new Set(urls));
        }

        hasLoadedFilters.current = true;
      } catch (error) {
        // Silently fail - filters will use defaults
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
          JSON.stringify(domains),
        );

        // Save ignored URLs
        const urls = Array.from(ignoredUrls);
        await AsyncStorage.setItem(
          devToolsStorageKeys.network.ignoredUrls(),
          JSON.stringify(urls),
        );
      } catch (error) {
        // Silently fail - filters will remain in memory
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

  useEffect(() => {
    if (isSearchActive) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isSearchActive]);

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
              hostname.includes(domain.toLowerCase()),
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
            url.includes(pattern.toLowerCase()),
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [events, ignoredDomains, ignoredUrls]);

  // FlatList optimization - only keep what's needed for FlatList performance
  const ESTIMATED_ITEM_SIZE = 52;
  const keyExtractor = (item: NetworkEvent) => item.id;

  // Keep renderItem memoized for FlatList performance (justified by FlatList docs)
  const renderItem = useMemo(() => {
    return ({ item }: { item: NetworkEvent }) => (
      <NetworkEventItemCompact event={item} onPress={handleEventPress} />
    );
  }, []); // Empty deps OK - handleEventPress defined inline

  // Compact header with actions (like Sentry/Storage modals)
  const renderHeaderContent = () => {
    // Filter view header with tabs
    if (showFilterView) {
      const filterTabs = [
        { key: "filters" as const, label: "Filters" },
        { key: "domains" as const, label: "Domains" },
        { key: "urls" as const, label: "URLs" },
      ];

      return (
        <ModalHeader>
          <ModalHeader.Navigation onBack={() => setShowFilterView(false)} />
          <ModalHeader.Content title="" noMargin>
            <TabSelector
              tabs={filterTabs}
              activeTab={filterViewTab}
              onTabChange={(tab) =>
                setFilterViewTab(tab as "filters" | "domains" | "urls")
              }
            />
          </ModalHeader.Content>
          <ModalHeader.Actions onClose={onClose} />
        </ModalHeader>
      );
    }

    // Event detail view header
    if (selectedEvent) {
      return (
        <ModalHeader>
          <ModalHeader.Navigation onBack={handleBack} />
          <ModalHeader.Content title="Request Details" centered />
          <ModalHeader.Actions onClose={onClose} />
        </ModalHeader>
      );
    }

    // Main list view header with search and filters
    return (
      <ModalHeader>
        {onBack && <ModalHeader.Navigation onBack={onBack} />}
        <ModalHeader.Content title="">
          {isSearchActive ? (
            <View style={styles.headerSearchContainer}>
              <Search size={14} color={gameUIColors.secondary} />
              <TextInput
                ref={searchInputRef}
                style={styles.headerSearchInput}
                placeholder="Search URL, method, error..."
                placeholderTextColor={gameUIColors.muted}
                value={searchText}
                onChangeText={handleSearch}
                onSubmitEditing={() => setIsSearchActive(false)}
                onBlur={() => setIsSearchActive(false)}
                sentry-label="ignore network search header"
                accessibilityLabel="Search network requests"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              {searchText.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    handleSearch("");
                    setIsSearchActive(false);
                  }}
                  sentry-label="ignore clear search header"
                  style={styles.headerSearchClear}
                >
                  <X size={14} color={gameUIColors.secondary} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={styles.headerChipRow}>
              <TouchableOpacity
                style={[
                  styles.headerChip,
                  filter.status === "success" && styles.headerChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "success" ? undefined : "success",
                  })
                }
              >
                <CheckCircle size={12} color={gameUIColors.success} />
                <Text
                  style={[
                    styles.headerChipValue,
                    { color: gameUIColors.success },
                  ]}
                >
                  {stats.successfulRequests}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.headerChip,
                  filter.status === "error" && styles.headerChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "error" ? undefined : "error",
                  })
                }
              >
                <XCircle size={12} color={gameUIColors.error} />
                <Text
                  style={[
                    styles.headerChipValue,
                    { color: gameUIColors.error },
                  ]}
                >
                  {stats.failedRequests}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.headerChip,
                  filter.status === "pending" && styles.headerChipActive,
                ]}
                onPress={() =>
                  setFilter({
                    ...filter,
                    status: filter.status === "pending" ? undefined : "pending",
                  })
                }
              >
                <Clock size={12} color={gameUIColors.warning} />
                <Text
                  style={[
                    styles.headerChipValue,
                    { color: gameUIColors.warning },
                  ]}
                >
                  {stats.pendingRequests}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ModalHeader.Content>
        <ModalHeader.Actions onClose={onClose}>
          <TouchableOpacity
            sentry-label="ignore open search"
            onPress={() => setIsSearchActive(true)}
            style={styles.headerActionButton}
          >
            <Search size={14} color={gameUIColors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            sentry-label="ignore filter"
            onPress={() => {
              setFilterViewTab("filters");
              setShowFilterView(true);
            }}
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
                  ? gameUIColors.network
                  : gameUIColors.muted
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
            <Power
              size={14}
              color={isEnabled ? gameUIColors.success : gameUIColors.error}
            />
          </TouchableOpacity>

          <TouchableOpacity
            sentry-label="ignore clear events"
            onPress={clearEvents}
            style={styles.headerActionButton}
            disabled={events.length === 0}
          >
            <Trash2
              size={14}
              color={
                events.length > 0 ? gameUIColors.muted : gameUIColors.blackTint3
              }
            />
          </TouchableOpacity>
        </ModalHeader.Actions>
      </ModalHeader>
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Search size={14} color={gameUIColors.secondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search URL, method, error..."
        placeholderTextColor={gameUIColors.muted}
        value={searchText}
        onChangeText={handleSearch}
        sentry-label="ignore network search"
        accessibilityLabel="Search network requests"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchText.length > 0 ? (
        <TouchableOpacity
          onPress={() => handleSearch("")}
          sentry-label="ignore clear search"
        >
          <X size={16} color={gameUIColors.secondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.network.modal();

  if (!visible) return null;

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
        {/* Show detail view if event is selected */}
        {selectedEvent ? (
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
        ) : showFilterView ? (
          <NetworkFilterView
            events={events}
            filter={filter}
            onFilterChange={setFilter}
            activeTab={filterViewTab}
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
            {!isEnabled ? (
              <View style={styles.disabledBanner}>
                <Power size={14} color={gameUIColors.warning} />
                <Text style={styles.disabledText}>
                  Network interception is disabled
                </Text>
              </View>
            ) : null}

            {/* Use FlatList for performance */}
            {filteredEvents.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={filteredEvents}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator
                removeClippedSubviews
                onEndReachedThreshold={0.8}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                scrollEnabled={false}
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
    backgroundColor: gameUIColors.background,
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
    color: gameUIColors.primaryLight,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  headerStats: {
    display: "none",
  },
  headerStatsText: {
    fontSize: 12,
    color: gameUIColors.muted,
    fontWeight: "500",
  },
  headerFilteredText: {
    fontSize: 11,
    color: gameUIColors.warning,
    fontWeight: "500",
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: "auto",
    marginRight: 4,
  },
  headerCenterArea: {
    flex: 1,
    marginHorizontal: 8,
  },
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameUIColors.blackTint2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerSearchInput: {
    flex: 1,
    color: gameUIColors.primaryLight,
    fontSize: 13,
    marginLeft: 6,
    paddingVertical: 2,
  },
  headerSearchClear: {
    marginLeft: 6,
    padding: 4,
  },
  headerChipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: gameUIColors.blackTint3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  headerChipActive: {
    backgroundColor: `${gameUIColors.network}26`,
    borderColor: `${gameUIColors.network}66`,
  },
  headerChipValue: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  headerActionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: gameUIColors.blackTint2,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  // Shared navbar styles (matching React Query modal)
  tabNavigationContainer: {
    flexDirection: "row",
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    justifyContent: "space-evenly",
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  tabButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 1,
  },
  tabButtonActive: {
    backgroundColor: gameUIColors.info + "20",
    borderWidth: 1,
    borderColor: gameUIColors.info + "40",
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
  },
  tabButtonTextActive: {
    color: gameUIColors.info,
  },
  tabButtonTextInactive: {
    color: gameUIColors.muted,
  },
  startButton: {
    backgroundColor: `${gameUIColors.success}1A`,
    borderColor: `${gameUIColors.success}33`,
  },
  stopButton: {
    backgroundColor: `${gameUIColors.error}1A`,
    borderColor: `${gameUIColors.error}33`,
  },
  activeFilterButton: {
    backgroundColor: `${gameUIColors.network}1A`,
    borderColor: `${gameUIColors.network}33`,
  },
  activeIgnoreButton: {
    backgroundColor: `${gameUIColors.warning}1A`,
    borderColor: `${gameUIColors.warning}33`,
  },
  detailHeaderActions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: "auto",
    marginRight: 4,
  },
  // Search bar - minimal design with theme colors
  searchContainer: {
    display: "none",
  },
  searchInput: {},
  // Stats bar - minimal design
  statsBar: {
    display: "none",
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: gameUIColors.blackTint3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  statChipActive: {
    backgroundColor: `${gameUIColors.network}26`,
    borderColor: `${gameUIColors.network}66`,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  statLabel: {
    fontSize: 10,
    color: gameUIColors.muted,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  disabledBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: `${gameUIColors.warning}1A`,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${gameUIColors.warning}33`,
  },
  disabledText: {
    color: gameUIColors.warning,
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
    color: gameUIColors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    color: gameUIColors.muted,
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
