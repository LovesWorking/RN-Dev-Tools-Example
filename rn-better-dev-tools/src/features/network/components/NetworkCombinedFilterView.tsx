import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Filter,
  X,
  Plus,
  Check,
  Globe,
  Link,
  Activity,
} from "rn-better-dev-tools/icons";
import { useState, useEffect } from "react";
import {
  GameUIStatusHeader,
  GameUICompactStats,
  gameUIColors,
  GAME_UI_ALERT_STATES,
  useGameUIAlertState,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  FilterSection,
  FilterList,
  AddFilterInput,
  AddFilterButton,
} from "@/rn-better-dev-tools/src/shared/ui/components/FilterComponents";
import { TabSelector } from "@/rn-better-dev-tools/src/shared/ui/components/TabSelector";
import { useFilterManager } from "@/rn-better-dev-tools/src/shared/hooks/useFilterManager";

interface NetworkCombinedFilterViewProps {
  ignoredDomains: Set<string>;
  ignoredUrls: Set<string>;
  onToggleDomain: (domain: string) => void;
  onAddDomain: (domain: string) => void;
  onToggleUrl: (url: string) => void;
  onAddUrl: (url: string) => void;
  onBack: () => void;
  availableDomains?: string[];
  availableUrls?: string[];
}

type TabType = "domains" | "urls";

// Custom alert states for filter configuration
const FILTER_ALERT_STATES = {
  ACTIVE: {
    ...GAME_UI_ALERT_STATES.OPTIMAL,
    icon: Filter,
    color: gameUIColors.network,
    label: "FILTERS ACTIVE",
    subtitle: "Network requests are being filtered",
  },
  INACTIVE: {
    ...GAME_UI_ALERT_STATES.EMPTY,
    icon: Filter,
    color: gameUIColors.muted,
    label: "NO FILTERS",
    subtitle: "All network requests are visible",
  },
};

export function NetworkCombinedFilterView({
  ignoredDomains,
  ignoredUrls,
  onToggleDomain,
  onAddDomain,
  onToggleUrl,
  onAddUrl,
  onBack,
  availableDomains = [],
  availableUrls = [],
}: NetworkCombinedFilterViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("domains");

  // Create two separate filter managers for domains and URLs
  // We'll use them just for the UI state (showAddInput, newFilter) and let the parent manage the actual filters
  const domainFilterManager = useFilterManager(new Set());
  const urlFilterManager = useFilterManager(new Set());

  // Get the current filter manager and handlers based on active tab
  const currentFilterManager =
    activeTab === "domains" ? domainFilterManager : urlFilterManager;
  const currentFilters = activeTab === "domains" ? ignoredDomains : ignoredUrls;
  const currentOnAdd = activeTab === "domains" ? onAddDomain : onAddUrl;
  const currentOnToggle =
    activeTab === "domains" ? onToggleDomain : onToggleUrl;

  const totalFilters = ignoredDomains.size + ignoredUrls.size;

  const handleAddPattern = () => {
    if (currentFilterManager.newFilter.trim()) {
      currentOnAdd(currentFilterManager.newFilter.trim());
      currentFilterManager.setNewFilter("");
      currentFilterManager.setShowAddInput(false);
    }
  };

  const handlePatternSelect = (pattern: string) => {
    currentFilterManager.setNewFilter(pattern);
  };

  // Determine alert state based on active filters
  const alertState =
    totalFilters > 0
      ? FILTER_ALERT_STATES.ACTIVE
      : FILTER_ALERT_STATES.INACTIVE;

  // Alert animation removed - not compatible with current implementation
  const alertAnimatedStyle = {};

  // Get current patterns and available options based on tab
  const availablePatterns =
    activeTab === "domains" ? availableDomains : availableUrls;

  // Filter out already filtered patterns from suggestions
  const suggestedPatterns = availablePatterns.filter((pattern) => {
    return !Array.from(currentFilters).some((ignored) =>
      pattern.includes(ignored),
    );
  });

  // Count common vs custom filters for domains
  const commonDomains = [
    "localhost",
    "127.0.0.1",
    "analytics",
    "sentry",
    "crashlytics",
  ];
  const commonDomainCount = Array.from(ignoredDomains).filter((p) =>
    commonDomains.some((common) => p.toLowerCase().includes(common)),
  ).length;
  const customDomainCount = ignoredDomains.size - commonDomainCount;

  const tabs = [
    {
      key: "domains",
      label: `Domains${ignoredDomains.size > 0 ? ` (${ignoredDomains.size})` : ""}`,
    },
    {
      key: "urls",
      label: `URLs${ignoredUrls.size > 0 ? ` (${ignoredUrls.size})` : ""}`,
    },
  ];

  const renderHeaderContent = () => {
    return (
      <View style={styles.headerContainer}>
        <TabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeaderContent()}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Header */}
        <GameUIStatusHeader
          alertConfig={alertState}
          badgeText="FILTERS"
          animatedStyle={alertAnimatedStyle}
        />

        {/* Filter Stats */}
        <GameUICompactStats
          statsConfig={[]}
          bottomStats={
            activeTab === "domains"
              ? [
                  { label: "TOTAL", value: ignoredDomains.size },
                  {
                    label: "COMMON",
                    value: commonDomainCount,
                    color: gameUIColors.warning,
                  },
                  {
                    label: "CUSTOM",
                    value: customDomainCount,
                    color: gameUIColors.info,
                  },
                ]
              : [
                  { label: "DOMAINS", value: ignoredDomains.size },
                  { label: "URLS", value: ignoredUrls.size },
                  {
                    label: "TOTAL",
                    value: totalFilters,
                    color: gameUIColors.network,
                  },
                ]
          }
        />

        {/* Filters Section */}
        <FilterSection>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "domains"
                ? "Ignored Domains"
                : "Ignored URL Patterns"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {activeTab === "domains"
                ? "Filter requests by domain hostname"
                : "Filter requests by URL patterns"}
            </Text>
          </View>

          {/* Add new filter */}
          {!currentFilterManager.showAddInput ? (
            <AddFilterButton
              onPress={() => currentFilterManager.setShowAddInput(true)}
              color={gameUIColors.network}
            />
          ) : (
            <>
              <AddFilterInput
                value={currentFilterManager.newFilter}
                onChange={currentFilterManager.setNewFilter}
                onSubmit={handleAddPattern}
                onCancel={() => {
                  currentFilterManager.setShowAddInput(false);
                  currentFilterManager.setNewFilter("");
                }}
                placeholder={
                  activeTab === "domains"
                    ? "Enter domain (e.g., api.example.com)"
                    : "Enter URL pattern (e.g., /analytics)"
                }
                color={gameUIColors.network}
              />

              {/* Available Patterns Section */}
              {suggestedPatterns.length > 0 && (
                <View style={styles.availableContainer}>
                  <Text style={styles.availableTitle}>
                    {activeTab === "domains"
                      ? "DOMAINS FROM RECENT REQUESTS"
                      : "URLS FROM RECENT REQUESTS"}
                  </Text>
                  <ScrollView
                    style={styles.availableScroll}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {suggestedPatterns.map((pattern) => (
                      <TouchableOpacity
                        key={pattern}
                        onPress={() => handlePatternSelect(pattern)}
                        style={styles.availableItem}
                      >
                        {activeTab === "domains" ? (
                          <Globe size={12} color={gameUIColors.secondary} />
                        ) : (
                          <Link size={12} color={gameUIColors.secondary} />
                        )}
                        <Text style={styles.availableText} numberOfLines={1}>
                          {pattern}
                        </Text>
                        <Plus size={12} color={gameUIColors.network} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* Filter List */}
          <FilterList
            filters={currentFilters}
            onRemoveFilter={currentOnToggle}
            color={gameUIColors.network}
          />

          {currentFilters.size === 0 && (
            <Text style={styles.emptyText}>
              No {activeTab === "domains" ? "domains" : "URL patterns"} filtered
            </Text>
          )}
        </FilterSection>

        {/* How Filters Work Section */}
        <View style={styles.howItWorksSection}>
          <View style={styles.howItWorksHeader}>
            <Filter size={12} color={gameUIColors.warning} />
            <Text style={styles.howItWorksTitle}>HOW FILTERS WORK</Text>
          </View>
          <Text style={styles.howItWorksText}>
            {activeTab === "domains"
              ? "Domain filters match the hostname of the URL. Filtered domains will not appear in the network requests list."
              : "URL filters match any part of the full URL path. Use partial matches for flexible filtering."}
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>EXAMPLES:</Text>
            {activeTab === "domains" ? (
              <>
                <Text style={styles.exampleItem}>
                  • api.github.com → filters all GitHub API calls
                </Text>
                <Text style={styles.exampleItem}>
                  • localhost → filters local development requests
                </Text>
                <Text style={styles.exampleItem}>
                  • analytics → filters Google Analytics, Firebase, etc.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.exampleItem}>
                  • /analytics → filters all analytics endpoints
                </Text>
                <Text style={styles.exampleItem}>
                  • /api/v1 → filters API v1 endpoints
                </Text>
                <Text style={styles.exampleItem}>
                  • .png → filters all PNG image requests
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.backdrop,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  availableContainer: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  availableTitle: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  availableScroll: {
    flex: 1,
  },
  availableItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "33",
  },
  availableText: {
    flex: 1,
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
  },
  emptyText: {
    fontSize: 11,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    fontStyle: "italic",
  },
  howItWorksSection: {
    backgroundColor: gameUIColors.warning + "0D",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.warning + "1A",
  },
  howItWorksHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  howItWorksTitle: {
    fontSize: 10,
    color: gameUIColors.warning,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  howItWorksText: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    marginBottom: 8,
    lineHeight: 16,
  },
  examplesContainer: {
    marginTop: 4,
  },
  examplesTitle: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    marginBottom: 4,
  },
  exampleItem: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    marginBottom: 2,
    paddingLeft: 8,
  },
});
