import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Filter, X, Plus, Check } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  GameUIStatusHeader,
  GameUICompactStats,
  gameUIColors,
  GAME_UI_ALERT_STATES,
  useGameUIAlertState,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

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
  const [showAddInput, setShowAddInput] = useState(false);
  const [newPattern, setNewPattern] = useState("");

  const handleAddPattern = () => {
    if (newPattern.trim()) {
      onAddPattern(newPattern.trim());
      setNewPattern("");
      setShowAddInput(false);
    }
  };

  const handleShowAddInput = () => {
    setShowAddInput(true);
  };

  const handleKeySelect = (key: string) => {
    setNewPattern(key);
  };

  // Determine alert state based on active filters
  const alertState =
    ignoredPatterns.size > 0
      ? FILTER_ALERT_STATES.ACTIVE
      : FILTER_ALERT_STATES.INACTIVE;

  const { animatedStyle } = useGameUIAlertState(alertState);

  // Count system vs custom filters
  const systemFilters = ["@devtools", "@rnasyncstorage"];
  const systemCount = Array.from(ignoredPatterns).filter((p) =>
    systemFilters.some((sys) => p.toLowerCase().includes(sys))
  ).length;
  const customCount = ignoredPatterns.size - systemCount;

  // Filter out already filtered keys from suggestions
  const suggestedKeys = availableKeys.filter((key) => {
    // Don't suggest keys that are already filtered
    return !Array.from(ignoredPatterns).some((pattern) =>
      key.includes(pattern)
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
          animatedStyle={animatedStyle}
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Filters</Text>
            <Text style={styles.sectionSubtitle}>
              Add patterns to filter out storage keys
            </Text>
          </View>

          {/* Add new filter */}
          {!showAddInput ? (
            <TouchableOpacity
              onPress={handleShowAddInput}
              style={styles.addButton}
              sentry-label="ignore-touchable-opacity"
            >
              <Plus size={14} color={gameUIColors.info} />
              <Text style={styles.addButtonText}>Add Filter</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.addInputContainer}>
                <TextInput
                  sentry-label="ignore-textinput"
                  style={styles.addInput}
                  value={newPattern}
                  onChangeText={setNewPattern}
                  placeholder="Enter pattern (e.g., @temp)"
                  placeholderTextColor={gameUIColors.muted}
                  autoFocus
                  onSubmitEditing={handleAddPattern}
                  accessibilityLabel="ignore-textinput"
                />
                <TouchableOpacity
                  onPress={handleAddPattern}
                  style={styles.confirmButton}
                  sentry-label="ignore-touchable-opacity"
                >
                  <Check size={14} color={gameUIColors.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddInput(false);
                    setNewPattern("");
                  }}
                  style={styles.cancelButton}
                  sentry-label="ignore-touchable-opacity"
                >
                  <X size={14} color={gameUIColors.error} />
                </TouchableOpacity>
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
                        <Text style={styles.availableKeyText} numberOfLines={1}>
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
          <View style={styles.filterList}>
            {Array.from(ignoredPatterns).map((pattern) => (
              <TouchableOpacity
                key={pattern}
                onPress={() => onTogglePattern(pattern)}
                style={styles.filterBadge}
                sentry-label="ignore-touchable-opacity"
              >
                <Text style={styles.filterBadgeText}>{pattern}</Text>
                <TouchableOpacity
                  onPress={() => onTogglePattern(pattern)}
                  style={styles.filterBadgeRemove}
                  sentry-label="ignore-touchable-opacity"
                >
                  <X size={10} color={gameUIColors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {ignoredPatterns.size === 0 && (
              <Text style={styles.emptyText}>No filters active</Text>
            )}
          </View>
        </View>

        {/* How Filters Work Section */}
        <View style={styles.howItWorksSection}>
          <View style={styles.howItWorksHeader}>
            <Filter size={12} color={gameUIColors.warning} />
            <Text style={styles.howItWorksTitle}>HOW FILTERS WORK</Text>
          </View>
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
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: gameUIColors.secondary,
  },

  // Add Button
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 12,
    color: gameUIColors.info,
    fontWeight: "500",
  },

  // Input Container
  addInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  addInput: {
    flex: 1,
    height: 36,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "60",
    paddingHorizontal: 12,
    fontSize: 12,
    color: gameUIColors.primary,
  },
  confirmButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: gameUIColors.success + "15",
    borderWidth: 1,
    borderColor: gameUIColors.success + "40",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: gameUIColors.error + "15",
    borderWidth: 1,
    borderColor: gameUIColors.error + "40",
    alignItems: "center",
    justifyContent: "center",
  },

  // Filter List
  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 6,
    backgroundColor: gameUIColors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  filterBadgeText: {
    fontSize: 11,
    color: gameUIColors.primary,
    marginRight: 6,
  },
  filterBadgeRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: gameUIColors.background,
    alignItems: "center",
    justifyContent: "center",
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
    padding: 16,
    backgroundColor: gameUIColors.warning + "08",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.warning + "20",
    marginTop: 12,
  },
  howItWorksHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  howItWorksTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: gameUIColors.warning,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  howItWorksText: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    lineHeight: 16,
    marginBottom: 12,
    fontFamily: "monospace",
  },
  examplesContainer: {
    paddingTop: 8,
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
