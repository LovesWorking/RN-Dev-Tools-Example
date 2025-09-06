import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SectionHeader } from "@/rn-better-dev-tools/src/shared/ui/components/SectionHeader";
import {
  FilterSection,
  FilterList,
  AddFilterInput,
  AddFilterButton,
} from "@/rn-better-dev-tools/src/shared/ui/components/FilterComponents";
import { useFilterManager } from "@/rn-better-dev-tools/src/shared/hooks/useFilterManager";
import {
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  FileJson,
  FileText,
  Image,
  Film,
  Music,
  Filter,
  Link,
  Plus,
} from "rn-better-dev-tools/icons";
import type { NetworkEvent } from "../types";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";

interface NetworkFilter {
  status?: "all" | "success" | "error" | "pending";
  method?: string[];
  contentType?: string[];
  searchText?: string;
}

interface NetworkFilterViewProps {
  events: NetworkEvent[];
  filter: NetworkFilter;
  onFilterChange: (filter: NetworkFilter) => void;
  ignoredDomains?: Set<string>;
  ignoredUrls?: Set<string>;
  onToggleDomain?: (domain: string) => void;
  onAddDomain?: (domain: string) => void;
  onToggleUrl?: (url: string) => void;
  onAddUrl?: (url: string) => void;
  // Optional external control of active tab; if provided, internal tabs are hidden
  activeTab?: TabType;
}

type TabType = "filters" | "domains" | "urls";

// Get content type from headers with color
function getContentType(event: NetworkEvent): { type: string; color: string } {
  const headers = event.responseHeaders || event.requestHeaders;
  const contentType =
    headers?.["content-type"] || headers?.["Content-Type"] || "";

  if (contentType.includes("json"))
    return { type: "JSON", color: macOSColors.semantic.info };
  if (contentType.includes("xml"))
    return { type: "XML", color: macOSColors.semantic.success };
  if (contentType.includes("html"))
    return { type: "HTML", color: macOSColors.semantic.warning };
  if (contentType.includes("text"))
    return { type: "TEXT", color: macOSColors.semantic.success };
  if (contentType.includes("image"))
    return { type: "IMAGE", color: macOSColors.semantic.error };
  if (contentType.includes("video"))
    return { type: "VIDEO", color: macOSColors.semantic.error };
  if (contentType.includes("audio"))
    return { type: "AUDIO", color: macOSColors.semantic.debug };
  if (contentType.includes("form"))
    return { type: "FORM", color: macOSColors.semantic.info };
  return { type: "OTHER", color: macOSColors.text.muted };
}

export function NetworkFilterView({
  events,
  filter,
  onFilterChange,
  ignoredDomains = new Set(),
  ignoredUrls = new Set(),
  onToggleDomain = () => {},
  onAddDomain = () => {},
  onToggleUrl = () => {},
  onAddUrl = () => {},
  activeTab: controlledActiveTab,
}: NetworkFilterViewProps) {
  const [internalActiveTab, setInternalActiveTab] =
    useState<TabType>("filters");
  const activeTab = controlledActiveTab ?? internalActiveTab;

  // Use filter managers for domains and URLs
  const domainFilterManager = useFilterManager(ignoredDomains);
  const urlFilterManager = useFilterManager(ignoredUrls);

  // Calculate counts for each filter option
  const statusCounts = {
    all: events.length,
    success: events.filter((e) => e.status && e.status >= 200 && e.status < 300)
      .length,
    error: events.filter((e) => e.error || (e.status && e.status >= 400))
      .length,
    pending: events.filter((e) => !e.status && !e.error).length,
  };

  const methodCounts = events.reduce((acc, event) => {
    acc[event.method] = (acc[event.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contentTypeCounts = events.reduce((acc, event) => {
    const { type } = getContentType(event);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract domains and URLs from ALL events (not just filtered)
  // This ensures we show all available options for filtering
  const allEvents = events || []; // Using the events passed from parent which should be all events

  const availableDomains = [
    ...new Set(
      allEvents
        .map((e) => {
          try {
            const url = new URL(e.url);
            return url.hostname;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[]
    ),
  ];

  const availableUrls = [
    ...new Set(
      allEvents
        .map((e) => {
          try {
            const url = new URL(e.url);
            return url.pathname;
          } catch {
            const match = e.url.match(/\/[^?#]*/);
            return match ? match[0] : null;
          }
        })
        .filter(Boolean) as string[]
    ),
  ];

  // Get color for content type
  const getContentTypeColor = (type: string) => {
    const testEvent = events.find((e) => getContentType(e).type === type);
    return testEvent ? getContentType(testEvent).color : macOSColors.text.muted;
  };

  const handleStatusFilter = (
    status: "all" | "success" | "error" | "pending"
  ) => {
    if (status === "all") {
      onFilterChange({ ...filter, status: undefined });
    } else {
      onFilterChange({ ...filter, status });
    }
  };

  const handleMethodFilter = (method: string) => {
    const currentMethods = filter.method || [];
    if (currentMethods.includes(method)) {
      const newMethods = currentMethods.filter((m) => m !== method);
      onFilterChange({
        ...filter,
        method: newMethods.length > 0 ? newMethods : undefined,
      });
    } else {
      onFilterChange({ ...filter, method: [method] });
    }
  };

  const handleContentTypeFilter = (type: string) => {
    const currentTypes = filter.contentType || [];
    if (currentTypes.includes(type)) {
      const newTypes = currentTypes.filter((t) => t !== type);
      onFilterChange({
        ...filter,
        contentType: newTypes.length > 0 ? newTypes : undefined,
      });
    } else {
      onFilterChange({ ...filter, contentType: [type] });
    }
  };

  const handleAddDomainPattern = () => {
    if (domainFilterManager.newFilter.trim()) {
      onAddDomain(domainFilterManager.newFilter.trim());
      domainFilterManager.addFilter(domainFilterManager.newFilter);
    }
  };

  const handleAddUrlPattern = () => {
    if (urlFilterManager.newFilter.trim()) {
      onAddUrl(urlFilterManager.newFilter.trim());
      urlFilterManager.addFilter(urlFilterManager.newFilter);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "pending":
        return Clock;
      default:
        return Globe;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "JSON":
        return FileJson;
      case "HTML":
      case "XML":
      case "TEXT":
        return FileText;
      case "IMAGE":
        return Image;
      case "VIDEO":
        return Film;
      case "AUDIO":
        return Music;
      default:
        return Globe;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return macOSColors.semantic.success;
      case "POST":
        return macOSColors.semantic.info;
      case "PUT":
        return macOSColors.semantic.warning;
      case "DELETE":
        return macOSColors.semantic.error;
      case "PATCH":
        return macOSColors.semantic.success;
      default:
        return macOSColors.text.muted;
    }
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => setInternalActiveTab("filters")}
        style={[
          styles.tabButton,
          activeTab === "filters"
            ? styles.tabButtonActive
            : styles.tabButtonInactive,
        ]}
      >
        <Filter
          size={14}
          color={
            activeTab === "filters" ? macOSColors.semantic.info : macOSColors.text.muted
          }
        />
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "filters"
              ? styles.tabButtonTextActive
              : styles.tabButtonTextInactive,
          ]}
        >
          Filters
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setInternalActiveTab("domains")}
        style={[
          styles.tabButton,
          activeTab === "domains"
            ? styles.tabButtonActive
            : styles.tabButtonInactive,
        ]}
      >
        <Globe
          size={14}
          color={
            activeTab === "domains" ? macOSColors.semantic.info : macOSColors.text.muted
          }
        />
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
        onPress={() => setInternalActiveTab("urls")}
        style={[
          styles.tabButton,
          activeTab === "urls"
            ? styles.tabButtonActive
            : styles.tabButtonInactive,
        ]}
      >
        <Link
          size={14}
          color={
            activeTab === "urls" ? macOSColors.semantic.info : macOSColors.text.muted
          }
        />
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
  );

  const renderFiltersContent = () => (
    <View style={styles.filtersContainer}>
      {/* Status Filters */}
      <View style={styles.section}>
        <SectionHeader>
          <SectionHeader.Title>STATUS</SectionHeader.Title>
        </SectionHeader>
        <View style={styles.filterGrid}>
          {(["all", "success", "error", "pending"] as const).map((status) => {
            const Icon = getStatusIcon(status);
            const isActive =
              filter.status === status || (!filter.status && status === "all");
            const count = statusCounts[status];

            return (
              <TouchableOpacity
                key={status}
                style={[styles.filterCard, isActive && styles.activeFilterCard]}
                onPress={() => handleStatusFilter(status)}
              >
                <View
                  style={[
                    styles.filterIconContainer,
                    {
                      backgroundColor:
                        status === "success"
                          ? macOSColors.semantic.successBackground
                          : status === "error"
                          ? macOSColors.semantic.errorBackground
                          : status === "pending"
                          ? macOSColors.semantic.warningBackground
                          : macOSColors.semantic.infoBackground,
                      borderColor:
                        status === "success"
                          ? macOSColors.semantic.success + "33"
                          : status === "error"
                          ? macOSColors.semantic.error + "33"
                          : status === "pending"
                          ? macOSColors.semantic.warning + "33"
                          : macOSColors.semantic.info + "33",
                    },
                  ]}
                >
                  <Icon
                    size={22}
                    color={
                      status === "success"
                        ? macOSColors.semantic.success
                        : status === "error"
                        ? macOSColors.semantic.error
                        : status === "pending"
                        ? macOSColors.semantic.warning
                        : macOSColors.semantic.info
                    }
                  />
                </View>
                <Text style={styles.filterLabel}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    {
                      color:
                        status === "success"
                          ? macOSColors.semantic.success
                          : status === "error"
                          ? macOSColors.semantic.error
                          : status === "pending"
                          ? macOSColors.semantic.warning
                          : macOSColors.semantic.info,
                    },
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Method Filters */}
      {Object.keys(methodCounts).length > 0 && (
        <View style={styles.section}>
          <SectionHeader>
            <SectionHeader.Title>METHOD</SectionHeader.Title>
          </SectionHeader>
          <View style={styles.filterGrid}>
            {Object.entries(methodCounts).map(([method, count]) => {
              const isActive = filter.method?.includes(method);
              const color = getMethodColor(method);

              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.filterCard,
                    isActive && styles.activeFilterCard,
                  ]}
                  onPress={() => handleMethodFilter(method)}
                >
                  <View
                    style={[
                      styles.methodBadge,
                      {
                        backgroundColor: `${color}15`,
                        borderColor: `${color}30`,
                      },
                    ]}
                  >
                    <Text style={[styles.methodText, { color }]}>{method}</Text>
                  </View>
                  <Text style={[styles.filterCount, { color }]}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Content Type Filters */}
      {Object.keys(contentTypeCounts).length > 0 && (
        <View style={styles.section}>
          <SectionHeader>
            <SectionHeader.Title>CONTENT TYPE</SectionHeader.Title>
          </SectionHeader>
          <View style={styles.filterGrid}>
            {Object.entries(contentTypeCounts).map(([type, count]) => {
              const Icon = getContentTypeIcon(type);
              const isActive = filter.contentType?.includes(type);

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterCard,
                    isActive && styles.activeFilterCard,
                  ]}
                  onPress={() => handleContentTypeFilter(type)}
                >
                  <View
                    style={[
                      styles.filterIconContainer,
                      {
                        backgroundColor: `${getContentTypeColor(type)}12`,
                        borderColor: `${getContentTypeColor(type)}20`,
                      },
                    ]}
                  >
                    <Icon size={18} color={getContentTypeColor(type)} />
                  </View>
                  <Text style={styles.filterLabel}>{type}</Text>
                  <Text
                    style={[
                      styles.filterCount,
                      { color: getContentTypeColor(type) },
                    ]}
                  >
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  const renderIgnorePatterns = (
    patterns: Set<string>,
    available: string[],
    onToggle: (pattern: string) => void,
    type: "domains" | "urls"
  ) => {
    const currentPatterns = patterns;
    // Filter out patterns that are already in the ignore list
    const suggestedPatterns = available.filter(
      (pattern) => !currentPatterns.has(pattern)
    );

    const filterManager =
      type === "domains" ? domainFilterManager : urlFilterManager;
    const handleAddPattern =
      type === "domains" ? handleAddDomainPattern : handleAddUrlPattern;

    return (
      <View style={styles.ignoreSection}>
        {/* Add new pattern */}
        <FilterSection style={styles.filterSectionOverrides}>
          {!filterManager.showAddInput ? (
            <AddFilterButton
              onPress={() => filterManager.setShowAddInput(true)}
              color={macOSColors.semantic.info}
            />
          ) : (
            <AddFilterInput
              value={filterManager.newFilter}
              onChange={filterManager.setNewFilter}
              onSubmit={handleAddPattern}
              onCancel={() => {
                filterManager.setShowAddInput(false);
                filterManager.setNewFilter("");
              }}
              placeholder={
                type === "domains"
                  ? "Enter domain (e.g., api.example.com)"
                  : "Enter URL pattern (e.g., /analytics)"
              }
              color={macOSColors.text.primary}
            />
          )}

          {/* Suggested patterns - Always show if we have suggestions */}
          {suggestedPatterns.length > 0 ? (
            <View
              style={[
                styles.suggestedContainer,
                !filterManager.showAddInput && { marginTop: 12 },
              ]}
            >
              <Text style={styles.suggestedTitle}>
                {type === "domains"
                  ? "DOMAINS FROM REQUESTS"
                  : "URLS FROM REQUESTS"}
              </Text>
              <ScrollView
                style={styles.suggestedScroll}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {suggestedPatterns.length > 0 ? (
                  suggestedPatterns.map((pattern) => (
                    <TouchableOpacity
                      key={pattern}
                      onPress={() => {
                        if (filterManager.showAddInput) {
                          filterManager.setNewFilter(pattern);
                        } else {
                          onToggle(pattern);
                        }
                      }}
                      style={styles.suggestedItem}
                    >
                      {type === "domains" ? (
                        <Globe size={14} color={macOSColors.text.secondary} />
                      ) : (
                        <Link size={14} color={macOSColors.text.secondary} />
                      )}
                      <Text style={styles.suggestedText} numberOfLines={1}>
                        {pattern}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (filterManager.showAddInput) {
                            filterManager.setNewFilter(pattern);
                          } else {
                            onToggle(pattern);
                          }
                        }}
                        style={styles.addIconButton}
                      >
                        <Plus size={16} color={macOSColors.semantic.info} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No suggestions available</Text>
                )}
              </ScrollView>
            </View>
          ) : (
            // Show a message if no patterns available
            available.length === 0 && (
              <View style={[styles.suggestedContainer, { marginTop: 12 }]}>
                <Text style={styles.suggestedTitle}>
                  {type === "domains"
                    ? "NO DOMAINS AVAILABLE"
                    : "NO URLS AVAILABLE"}
                </Text>
                <Text style={styles.emptyText}>
                  Make some network requests to see{" "}
                  {type === "domains" ? "domains" : "URLs"} here
                </Text>
              </View>
            )
          )}

          {/* Active patterns */}
          {currentPatterns.size > 0 ? (
            <FilterList
              filters={currentPatterns}
              onRemoveFilter={onToggle}
              color={macOSColors.semantic.info}
            />
          ) : (
            <Text style={styles.emptyText}>
              No {type === "domains" ? "domains" : "URL patterns"} ignored
            </Text>
          )}
        </FilterSection>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {controlledActiveTab == null && renderTabs()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "filters" && renderFiltersContent()}
        {activeTab === "domains" &&
          renderIgnorePatterns(
            ignoredDomains,
            availableDomains,
            onToggleDomain,
            "domains"
          )}
        {activeTab === "urls" &&
          renderIgnorePatterns(ignoredUrls, availableUrls, onToggleUrl, "urls")}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: macOSColors.background.base,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: macOSColors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: macOSColors.border.default,
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
    backgroundColor: macOSColors.semantic.infoBackground,
    borderColor: macOSColors.semantic.info,
  },
  tabButtonInactive: {
    backgroundColor: macOSColors.background.hover,
    borderColor: macOSColors.border.default,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: macOSColors.semantic.info,
  },
  tabButtonTextInactive: {
    color: macOSColors.text.muted,
  },
  tabBadge: {
    backgroundColor: macOSColors.semantic.info + "40",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 9,
    color: macOSColors.semantic.info,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtersContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterCard: {
    backgroundColor: macOSColors.background.card,
    borderRadius: 12,
    padding: 14,
    minWidth: 104,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: macOSColors.border.default,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  activeFilterCard: {
    backgroundColor: macOSColors.semantic.infoBackground,
    borderColor: macOSColors.semantic.info + "66",
    borderWidth: 1.5,
    shadowColor: macOSColors.semantic.info,
    shadowOpacity: 0.2,
  },
  filterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: macOSColors.semantic.infoBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: macOSColors.semantic.info + "26",
  },
  filterLabel: {
    fontSize: 11,
    color: macOSColors.text.secondary,
    marginBottom: 6,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  filterCount: {
    fontSize: 18,
    fontWeight: "700",
    color: macOSColors.text.primary,
    fontFamily: "monospace",
  },
  methodBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: macOSColors.border.default,
  },
  methodText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontFamily: "monospace",
  },
  // Ignore patterns styles
  ignoreSection: {
    flex: 1,
    paddingTop: 8,
  },
  filterSectionOverrides: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
  },
  suggestedContainer: {
    backgroundColor: macOSColors.background.hover,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: macOSColors.border.default,
  },
  suggestedTitle: {
    fontSize: 10,
    color: macOSColors.text.muted,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  suggestedScroll: {
    maxHeight: 250,
  },
  suggestedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: macOSColors.background.input,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: macOSColors.border.input,
  },
  suggestedText: {
    flex: 1,
    fontSize: 12,
    color: macOSColors.text.primary,
    fontFamily: "monospace",
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 11,
    color: macOSColors.text.muted,
    fontStyle: "italic",
    padding: 12,
    textAlign: "center",
  },
  addIconButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: macOSColors.semantic.infoBackground,
  },
});
