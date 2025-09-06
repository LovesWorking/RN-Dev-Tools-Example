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
  GAME_UI_ALERT_STATES,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";
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
    color: macOSColors.semantic.info,
    label: "FILTERS ACTIVE",
    subtitle: "Storage events are being filtered",
  },
  INACTIVE: {
    ...GAME_UI_ALERT_STATES.EMPTY,
    icon: Filter,
    color: macOSColors.text.muted,
    label: "NO FILTERS",
    subtitle: "All storage events are visible",
  },
};

export function StorageFilterView({
  ignoredPatterns,
  onTogglePattern,
  onAddPattern,
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
  }, [ignoredPatterns, filterManager.filters]);

  const handleAddPattern = () => {
    if (filterManager.newFilter.trim()) {
      onAddPattern(filterManager.newFilter.trim());
      filterManager.addFilter(filterManager.newFilter);
    }
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

        {/* Add Filter Section */}
        <View style={styles.section}>
          {!filterManager.showAddInput ? (
            <AddFilterButton
              onPress={() => filterManager.setShowAddInput(true)}
              color={macOSColors.semantic.info}
            />
          ) : (
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
                color={macOSColors.text.primary}
              />
            </View>
          )}
        </View>

        {/* Active Filters Section */}
        <View style={styles.activeFiltersSection}>
          <SectionHeader>
            <SectionHeader.Icon
              icon={Filter}
              color={macOSColors.semantic.info}
              size={12}
            />
            <SectionHeader.Title>ACTIVE FILTERS</SectionHeader.Title>
            <SectionHeader.Badge
              count={ignoredPatterns.size}
              color={macOSColors.semantic.info}
            />
          </SectionHeader>
          <ScrollView 
            style={styles.activeFiltersContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {ignoredPatterns.size > 0 ? (
              <FilterList
                filters={ignoredPatterns}
                onRemoveFilter={onTogglePattern}
                color={macOSColors.semantic.info}
              />
            ) : (
              <Text style={styles.emptyStateText}>
                No filters active. Add patterns to filter out storage keys.
              </Text>
            )}
          </ScrollView>
        </View>

        {/* Available Keys Section - Always Show */}
        <View style={styles.availableKeysSection}>
          <SectionHeader>
            <SectionHeader.Icon
              icon={Plus}
              color={macOSColors.semantic.info}
              size={12}
            />
            <SectionHeader.Title>AVAILABLE KEYS FROM EVENTS</SectionHeader.Title>
            <SectionHeader.Badge
              count={suggestedKeys.length}
              color={macOSColors.semantic.info}
            />
          </SectionHeader>
          <ScrollView
            style={styles.availableKeysScroll}
            horizontal={false}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            scrollEnabled={true}
          >
            {suggestedKeys.length > 0 ? (
              suggestedKeys.map((key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    onAddPattern(key);
                    filterManager.addFilter(key);
                  }}
                  style={styles.availableKeyItem}
                  sentry-label="ignore-touchable-opacity"
                >
                  <Text
                    style={styles.availableKeyText}
                    numberOfLines={1}
                  >
                    {key}
                  </Text>
                  <Plus size={12} color={macOSColors.semantic.info} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyStateText}>
                No keys available. Keys from storage events will appear here.
              </Text>
            )}
          </ScrollView>
        </View>

        {/* How Filters Work Section */}
        <View style={styles.howItWorksSection}>
          <SectionHeader>
            <SectionHeader.Icon
              icon={Filter}
              color={macOSColors.text.secondary}
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
    backgroundColor: macOSColors.background.base,
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
    marginBottom: 8,
  },
  filterInputWrapper: {
    marginBottom: 4,
  },

  // Active Filters Section
  activeFiltersSection: {
    backgroundColor: macOSColors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: macOSColors.border.default + "50",
    marginTop: 8,
    overflow: "hidden",
  },
  activeFiltersContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    maxHeight: 200,
  },
  emptyStateText: {
    fontSize: 11,
    color: macOSColors.text.muted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },

  // Available Keys Section
  availableKeysSection: {
    backgroundColor: macOSColors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: macOSColors.border.default + "50",
    marginTop: 12,
    overflow: "hidden",
  },
  availableKeysScroll: {
    maxHeight: 150,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  availableKeyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: macOSColors.background.input,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: macOSColors.border.input,
    marginBottom: 6,
  },
  availableKeyText: {
    flex: 1,
    fontSize: 11,
    color: macOSColors.text.primary,
    fontFamily: "monospace",
    marginRight: 8,
  },

  // How It Works Section
  howItWorksSection: {
    backgroundColor: macOSColors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: macOSColors.border.default + "50",
    marginTop: 12,
    overflow: "hidden",
  },
  howItWorksText: {
    fontSize: 11,
    color: macOSColors.text.secondary,
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
    borderTopColor: macOSColors.border.default + "50",
  },
  examplesTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: macOSColors.text.muted,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  exampleItem: {
    fontSize: 10,
    color: macOSColors.text.muted,
    fontFamily: "monospace",
    lineHeight: 16,
  },
});
