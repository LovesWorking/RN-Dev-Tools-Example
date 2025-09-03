import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Filter, Plus } from "rn-better-dev-tools/icons";
import { useEffect } from "react";
import {
  GameUIStatusHeader,
  GameUICompactStats,
  gameUIColors,
  GAME_UI_ALERT_STATES,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { SectionHeader } from "@/rn-better-dev-tools/src/shared/ui/components/SectionHeader";
import {
  FilterSection,
  FilterList,
  AddFilterInput,
  AddFilterButton,
} from "@/rn-better-dev-tools/src/shared/ui/components/FilterComponents";
import { useFilterManager } from "@/rn-better-dev-tools/src/shared/hooks/useFilterManager";

interface StorageFilterViewProps {
  ignoredPatterns: Set<string>;
  onTogglePattern: (pattern: string) => void;
  onAddPattern: (pattern: string) => void;
  onBack: () => void;
  availableKeys?: string[];
}

// Custom alert states for filter configuration
const FILTER_ALERT_STATES = {
  ACTIVE: {
    ...GAME_UI_ALERT_STATES.OPTIMAL,
    icon: Filter,
    color: gameUIColors.info,
    label: "FILTERS ACTIVE",
    subtitle: "Storage events are being filtered",
  },
  INACTIVE: {
    ...GAME_UI_ALERT_STATES.EMPTY,
    icon: Filter,
    color: gameUIColors.muted,
    label: "NO FILTERS",
    subtitle: "All storage events are visible",
  },
};

export function StorageFilterView({
  ignoredPatterns,
  onTogglePattern,
  onAddPattern,
  onBack,
  availableKeys = [],
}: StorageFilterViewProps) {
  const filterManager = useFilterManager(ignoredPatterns);

  // Sync external changes to filter manager
  useEffect(() => {
    if (
      ignoredPatterns.size !== filterManager.filters.size ||
      !Array.from(ignoredPatterns).every((p) => filterManager.filters.has(p))
    ) {
      // External changes detected, update internal state
      // This ensures the filter manager stays in sync with parent component
    }
  }, [ignoredPatterns]);

  const handleAddPattern = () => {
    if (filterManager.newFilter.trim()) {
      onAddPattern(filterManager.newFilter.trim());
      filterManager.addFilter(filterManager.newFilter);
    }
  };

  const handleKeySelect = (key: string) => {
    filterManager.setNewFilter(key);
  };

  // Determine alert state based on active filters
  const alertState =
    ignoredPatterns.size > 0
      ? FILTER_ALERT_STATES.ACTIVE
      : FILTER_ALERT_STATES.INACTIVE;

  // Alert animation removed - not compatible with current implementation
  const alertAnimatedStyle = {};

  // Count system vs custom filters
  const systemFilters = ["@devtools", "@rnasyncstorage"];
  const systemCount = Array.from(ignoredPatterns).filter((p) =>
    systemFilters.some((sys) => p.toLowerCase().includes(sys)),
  ).length;
  const customCount = ignoredPatterns.size - systemCount;

  // Filter out already filtered keys from suggestions
  const suggestedKeys = availableKeys.filter((key) => {
    // Don't suggest keys that are already filtered
    return !Array.from(ignoredPatterns).some((pattern) =>
      key.includes(pattern),
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
          badgeText="FILTERS"
          animatedStyle={alertAnimatedStyle}
        />

        {/* Filter Stats */}
        <GameUICompactStats
          statsConfig={[]}
          bottomStats={[
            { label: "TOTAL", value: ignoredPatterns.size },
            {
              label: "SYSTEM",
              value: systemCount,
              color: gameUIColors.warning,
            },
            { label: "CUSTOM", value: customCount, color: gameUIColors.info },
          ]}
        />

        {/* Filters Section */}
        <View style={styles.section}>
          <SectionHeader>
            <SectionHeader.Icon
              icon={Filter}
              color={gameUIColors.info}
              size={14}
            />
            <SectionHeader.Title>Active Filters</SectionHeader.Title>
            <SectionHeader.Badge
              count={ignoredPatterns.size}
              color={gameUIColors.info}
            />
          </SectionHeader>
          <Text style={styles.sectionSubtitle}>
            Add patterns to filter out storage keys
          </Text>

          {/* Add new filter */}
          <FilterSection style={styles.filterSectionOverrides}>
            {!filterManager.showAddInput ? (
              <AddFilterButton
                onPress={() => filterManager.setShowAddInput(true)}
                color={gameUIColors.info}
              />
            ) : (
              <>
                <View style={styles.filterInputWrapper}>
                  <AddFilterInput
                    value={filterManager.newFilter}
                    onChange={filterManager.setNewFilter}
                    onSubmit={handleAddPattern}
                    onCancel={() => {
                      filterManager.setShowAddInput(false);
                      filterManager.setNewFilter("");
                    }}
                    placeholder="Enter pattern (e.g., @temp)"
                    color={gameUIColors.primary}
                  />
                </View>

                {/* Available Keys Section */}
                {suggestedKeys.length > 0 && (
                  <View style={styles.availableKeysContainer}>
                    <Text style={styles.availableKeysTitle}>
                      AVAILABLE KEYS FROM EVENTS
                    </Text>
                    <ScrollView
                      style={styles.availableKeysScroll}
                      horizontal={false}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      scrollEnabled={true}
                    >
                      {suggestedKeys.map((key) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() => handleKeySelect(key)}
                          style={styles.availableKeyItem}
                          sentry-label="ignore-touchable-opacity"
                        >
                          <Text
                            style={styles.availableKeyText}
                            numberOfLines={1}
                          >
                            {key}
                          </Text>
                          <Plus size={12} color={gameUIColors.info} />
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
                color={gameUIColors.info}
              />
            ) : (
              <Text style={styles.emptyText}>No filters active</Text>
            )}
          </FilterSection>
        </View>

        {/* How Filters Work Section */}
        <View style={styles.howItWorksSection}>
          <SectionHeader>
            <SectionHeader.Icon
              icon={Filter}
              color={gameUIColors.warning}
              size={12}
            />
            <SectionHeader.Title>HOW FILTERS WORK</SectionHeader.Title>
          </SectionHeader>
          <Text style={styles.howItWorksText}>
            Filtered keys will not appear in the storage events list. Patterns
            match if the key contains the specified text.
          </Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>EXAMPLES:</Text>
            <Text style={styles.exampleItem}>
              • @temp → filters @temp_user, @temp_data
            </Text>
            <Text style={styles.exampleItem}>
              • redux → filters redux-persist:root
            </Text>
            <Text style={styles.exampleItem}>
              • : → filters all keys with colons
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
    backgroundColor: gameUIColors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: gameUIColors.secondary,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },

  // Filter Section Overrides
  filterSectionOverrides: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
  },
  filterInputWrapper: {
    marginBottom: 12,
  },

  // Empty state
  emptyText: {
    fontSize: 12,
    color: gameUIColors.muted,
    fontStyle: "italic",
  },

  // Available Keys Section
  availableKeysContainer: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    padding: 12,
  },
  availableKeysTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 1,
    marginBottom: 8,
  },
  availableKeysScroll: {
    maxHeight: 150,
  },
  availableKeyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: gameUIColors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.border + "30",
    marginBottom: 6,
  },
  availableKeyText: {
    flex: 1,
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    marginRight: 8,
  },

  // How It Works Section
  howItWorksSection: {
    backgroundColor: gameUIColors.warning + "08",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.warning + "20",
    marginTop: 12,
    overflow: "hidden",
  },
  howItWorksText: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    lineHeight: 16,
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 16,
    fontFamily: "monospace",
  },
  examplesContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.warning + "20",
  },
  examplesTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  exampleItem: {
    fontSize: 10,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    lineHeight: 16,
  },
});
