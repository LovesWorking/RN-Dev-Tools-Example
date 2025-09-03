import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Filter, Plus, Globe } from "rn-better-dev-tools/icons";
import {
  FilterSection,
  FilterList,
  AddFilterInput,
  AddFilterButton,
} from "@/rn-better-dev-tools/src/shared/ui/components/FilterComponents";
import { useFilterManager } from "@/rn-better-dev-tools/src/shared/hooks/useFilterManager";
import {
  GameUIStatusHeader,
  GameUICompactStats,
  gameUIColors,
  GAME_UI_ALERT_STATES,
  useGameUIAlertState,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface NetworkIgnoreFilterViewProps {
  ignoredPatterns: Set<string>;
  onTogglePattern: (pattern: string) => void;
  onAddPattern: (pattern: string) => void;
  onBack: () => void;
  availableDomains?: string[];
}

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

export function NetworkIgnoreFilterView({
  ignoredPatterns,
  onTogglePattern,
  onAddPattern,
  onBack,
  availableDomains = [],
}: NetworkIgnoreFilterViewProps) {
  const filterManager = useFilterManager(ignoredPatterns);

  const handleAddPattern = () => {
    if (filterManager.newFilter.trim()) {
      onAddPattern(filterManager.newFilter.trim());
      filterManager.addFilter(filterManager.newFilter);
    }
  };

  const handleDomainSelect = (domain: string) => {
    filterManager.setNewFilter(domain);
  };

  // Determine alert state based on active filters
  const alertState =
    ignoredPatterns.size > 0
      ? FILTER_ALERT_STATES.ACTIVE
      : FILTER_ALERT_STATES.INACTIVE;

  // Alert animation removed - not compatible with current implementation
  const alertAnimatedStyle = {};

  // Count common vs custom filters
  const commonDomains = [
    "localhost",
    "127.0.0.1",
    "analytics",
    "sentry",
    "crashlytics",
  ];
  const commonCount = Array.from(ignoredPatterns).filter((p) =>
    commonDomains.some((common) => p.toLowerCase().includes(common)),
  ).length;
  const customCount = ignoredPatterns.size - commonCount;

  // Filter out already filtered domains from suggestions
  const suggestedDomains = availableDomains.filter((domain) => {
    // Don't suggest domains that are already filtered
    return !Array.from(ignoredPatterns).some((pattern) =>
      domain.includes(pattern),
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        sentry-label="ignore-scrollview"
      >
        {/* Status Header */}
        <GameUIStatusHeader
          alertConfig={alertState}
          badgeText="IGNORE"
          animatedStyle={alertAnimatedStyle}
        />

        {/* Filter Stats */}
        <GameUICompactStats
          statsConfig={[]}
          bottomStats={[
            { label: "TOTAL", value: ignoredPatterns.size },
            {
              label: "COMMON",
              value: commonCount,
              color: gameUIColors.warning,
            },
            { label: "CUSTOM", value: customCount, color: gameUIColors.info },
          ]}
        />

        {/* Filters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ignored Domains/URLs</Text>
            <Text style={styles.sectionSubtitle}>
              Add patterns to filter out network requests
            </Text>
          </View>

          {/* Add new filter */}
          <FilterSection style={styles.filterSectionOverrides}>
            {!filterManager.showAddInput ? (
              <AddFilterButton
                onPress={() => filterManager.setShowAddInput(true)}
                color={gameUIColors.network}
              />
            ) : (
              <>
                <AddFilterInput
                  value={filterManager.newFilter}
                  onChange={filterManager.setNewFilter}
                  onSubmit={handleAddPattern}
                  onCancel={() => {
                    filterManager.setShowAddInput(false);
                    filterManager.setNewFilter("");
                  }}
                  placeholder="Enter domain or URL pattern"
                  color={gameUIColors.primary}
                />

                {/* Available Domains Section */}
                {suggestedDomains.length > 0 && (
                  <View style={styles.availableDomainsContainer}>
                    <Text style={styles.availableDomainsTitle}>
                      DOMAINS FROM RECENT REQUESTS
                    </Text>
                    <ScrollView
                      style={styles.availableDomainsScroll}
                      horizontal={false}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      scrollEnabled={true}
                    >
                      {suggestedDomains.map((domain) => (
                        <TouchableOpacity
                          key={domain}
                          onPress={() => handleDomainSelect(domain)}
                          style={styles.availableDomainItem}
                          sentry-label="ignore-touchable-opacity"
                        >
                          <Globe size={12} color={gameUIColors.secondary} />
                          <Text
                            style={styles.availableDomainText}
                            numberOfLines={1}
                          >
                            {domain}
                          </Text>
                          <Plus size={12} color={gameUIColors.network} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}

            {/* Filter badges */}
            {ignoredPatterns.size > 0 ? (
              <FilterList
                filters={ignoredPatterns}
                onRemoveFilter={onTogglePattern}
                color={gameUIColors.network}
              />
            ) : (
              <Text style={styles.emptyText}>No filters active</Text>
            )}
          </FilterSection>
        </View>

        {/* How Filters Work Section */}
        <View style={styles.howItWorksSection}>
          <View style={styles.howItWorksHeader}>
            <Filter size={12} color={gameUIColors.warning} />
            <Text style={styles.howItWorksTitle}>HOW FILTERS WORK</Text>
          </View>
          <Text style={styles.howItWorksText}>
            Filtered URLs will not appear in the network requests list. Patterns
            match if the URL contains the specified text.
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>EXAMPLES:</Text>
            <Text style={styles.exampleItem}>
              • api.github.com → filters all GitHub API calls
            </Text>
            <Text style={styles.exampleItem}>
              • analytics → filters Google Analytics, Firebase, etc.
            </Text>
            <Text style={styles.exampleItem}>
              • localhost → filters local development requests
            </Text>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    padding: 16,
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
  filterSectionOverrides: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
  },
  availableDomainsContainer: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  availableDomainsTitle: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  availableDomainsScroll: {
    flex: 1,
  },
  availableDomainItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "33",
  },
  availableDomainText: {
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
