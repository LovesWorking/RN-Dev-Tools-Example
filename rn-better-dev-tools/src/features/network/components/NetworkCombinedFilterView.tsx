import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Filter, X, Plus, Check, Globe, Link, Activity } from "lucide-react-native";
import { useState } from "react";
import {
  GameUIStatusHeader,
  GameUICompactStats,
  gameUIColors,
  GAME_UI_ALERT_STATES,
  useGameUIAlertState,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

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
  const [showAddInput, setShowAddInput] = useState(false);
  const [newPattern, setNewPattern] = useState("");

  const totalFilters = ignoredDomains.size + ignoredUrls.size;

  const handleAddPattern = () => {
    if (newPattern.trim()) {
      if (activeTab === "domains") {
        onAddDomain(newPattern.trim());
      } else {
        onAddUrl(newPattern.trim());
      }
      setNewPattern("");
      setShowAddInput(false);
    }
  };

  const handlePatternSelect = (pattern: string) => {
    setNewPattern(pattern);
  };

  // Determine alert state based on active filters
  const alertState =
    totalFilters > 0
      ? FILTER_ALERT_STATES.ACTIVE
      : FILTER_ALERT_STATES.INACTIVE;

  const { animatedStyle } = useGameUIAlertState(alertState);

  // Get current patterns and available options based on tab
  const currentPatterns = activeTab === "domains" ? ignoredDomains : ignoredUrls;
  const availablePatterns = activeTab === "domains" ? availableDomains : availableUrls;
  const onTogglePattern = activeTab === "domains" ? onToggleDomain : onToggleUrl;

  // Filter out already filtered patterns from suggestions
  const suggestedPatterns = availablePatterns.filter((pattern) => {
    return !Array.from(currentPatterns).some((ignored) =>
      pattern.includes(ignored)
    );
  });

  // Count common vs custom filters for domains
  const commonDomains = ["localhost", "127.0.0.1", "analytics", "sentry", "crashlytics"];
  const commonDomainCount = Array.from(ignoredDomains).filter((p) =>
    commonDomains.some((common) => p.toLowerCase().includes(common))
  ).length;
  const customDomainCount = ignoredDomains.size - commonDomainCount;

  const renderHeaderContent = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Tab buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("domains")}
            style={[
              styles.tabButton,
              activeTab === "domains"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Globe size={14} color={activeTab === "domains" ? gameUIColors.network : gameUIColors.secondary} />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "domains"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              Domains
            </Text>
            {ignoredDomains.size > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{ignoredDomains.size}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab("urls")}
            style={[
              styles.tabButton,
              activeTab === "urls"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Link size={14} color={activeTab === "urls" ? gameUIColors.network : gameUIColors.secondary} />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "urls"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              URLs
            </Text>
            {ignoredUrls.size > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{ignoredUrls.size}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
          animatedStyle={animatedStyle}
        />

        {/* Filter Stats */}
        <GameUICompactStats
          statsConfig={[]}
          bottomStats={
            activeTab === "domains"
              ? [
                  { label: "TOTAL", value: ignoredDomains.size },
                  { label: "COMMON", value: commonDomainCount, color: gameUIColors.warning },
                  { label: "CUSTOM", value: customDomainCount, color: gameUIColors.info },
                ]
              : [
                  { label: "DOMAINS", value: ignoredDomains.size },
                  { label: "URLS", value: ignoredUrls.size },
                  { label: "TOTAL", value: totalFilters, color: gameUIColors.network },
                ]
          }
        />

        {/* Filters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "domains" ? "Ignored Domains" : "Ignored URL Patterns"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {activeTab === "domains" 
                ? "Filter requests by domain hostname"
                : "Filter requests by URL patterns"}
            </Text>
          </View>

          {/* Add new filter */}
          {!showAddInput ? (
            <TouchableOpacity
              onPress={() => setShowAddInput(true)}
              style={styles.addButton}
            >
              <Plus size={14} color={gameUIColors.network} />
              <Text style={styles.addButtonText}>
                Add {activeTab === "domains" ? "Domain" : "URL Pattern"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.addInputContainer}>
                <TextInput
                  style={styles.addInput}
                  value={newPattern}
                  onChangeText={setNewPattern}
                  placeholder={
                    activeTab === "domains" 
                      ? "Enter domain (e.g., api.example.com)"
                      : "Enter URL pattern (e.g., /analytics)"
                  }
                  placeholderTextColor={gameUIColors.muted}
                  autoFocus
                  onSubmitEditing={handleAddPattern}
                />
                <TouchableOpacity
                  onPress={handleAddPattern}
                  style={styles.confirmButton}
                >
                  <Check size={14} color={gameUIColors.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddInput(false);
                    setNewPattern("");
                  }}
                  style={styles.cancelButton}
                >
                  <X size={14} color={gameUIColors.error} />
                </TouchableOpacity>
              </View>

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

          {/* Filter badges */}
          <View style={styles.filterList}>
            {Array.from(currentPatterns).map((pattern) => (
              <TouchableOpacity
                key={pattern}
                onPress={() => onTogglePattern(pattern)}
                style={styles.filterBadge}
              >
                <Text style={styles.filterBadgeText}>{pattern}</Text>
                <TouchableOpacity
                  onPress={() => onTogglePattern(pattern)}
                  style={styles.filterBadgeRemove}
                >
                  <X size={10} color={gameUIColors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {currentPatterns.size === 0 && (
              <Text style={styles.emptyText}>
                No {activeTab === "domains" ? "domains" : "URL patterns"} filtered
              </Text>
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
  tabContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  tabButtonActive: {
    backgroundColor: gameUIColors.network + "1A",
    borderColor: gameUIColors.network + "66",
  },
  tabButtonInactive: {
    backgroundColor: gameUIColors.panel,
    borderColor: gameUIColors.border,
  },
  tabButtonText: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tabButtonTextActive: {
    color: gameUIColors.network,
  },
  tabButtonTextInactive: {
    color: gameUIColors.secondary,
  },
  tabBadge: {
    backgroundColor: gameUIColors.network + "33",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 9,
    color: gameUIColors.network,
    fontFamily: "monospace",
    fontWeight: "700",
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    backgroundColor: gameUIColors.network + "1A",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.network + "33",
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 11,
    color: gameUIColors.network,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  addInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  addInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.network + "66",
    color: gameUIColors.primary,
    fontSize: 12,
    fontFamily: "monospace",
  },
  confirmButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: gameUIColors.success + "1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: gameUIColors.success + "33",
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: gameUIColors.error + "1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: gameUIColors.error + "33",
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
  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: gameUIColors.network + "1A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.network + "33",
  },
  filterBadgeText: {
    fontSize: 11,
    color: gameUIColors.network,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  filterBadgeRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: gameUIColors.background + "66",
    alignItems: "center",
    justifyContent: "center",
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