import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";
import { CompactRow } from "@/rn-better-dev-tools/src/shared/ui/components/CompactRow";

export type StorageFilterType = "all" | "missing" | "issues";
export type StorageTypeFilter = "all" | "async" | "mmkv" | "secure";

interface StorageFilterCardsProps {
  stats: {
    totalCount: number;
    requiredCount: number;
    optionalCount: number;
    presentRequiredCount: number;
    missingCount: number;
    wrongValueCount: number;
    wrongTypeCount: number;
    devToolsCount: number;
    asyncCount?: number;
    mmkvCount?: number;
    secureCount?: number;
  };
  healthPercentage: number;
  healthStatus: string;
  healthColor: string;
  activeFilter?: StorageFilterType;
  onFilterChange?: (filter: StorageFilterType) => void;
  activeStorageType?: StorageTypeFilter;
  onStorageTypeChange?: (type: StorageTypeFilter) => void;
}

export function StorageFilterCards({
  stats,
  healthPercentage,
  healthStatus,
  healthColor,
  activeFilter = "all",
  onFilterChange,
  activeStorageType = "all",
  onStorageTypeChange,
}: StorageFilterCardsProps) {
  const issuesCount = stats.missingCount + stats.wrongValueCount + stats.wrongTypeCount;
  
  return (
    <View style={styles.container}>
      {/* System Status Card */}
      <CompactRow
        statusDotColor={healthColor}
        statusLabel="Storage"
        statusSublabel={healthStatus.toLowerCase()}
        primaryText="Persistent Data Layer"
        secondaryText={`${healthPercentage}% healthy`}
        customBadge={
          <View style={[styles.percentBadge, { borderColor: healthColor + "40", backgroundColor: healthColor + "10" }]}>
            <Text style={[styles.percentText, { color: healthColor }]}>
              {healthPercentage}%
            </Text>
          </View>
        }
      />
      
      {/* Stats Grid - Filter cards */}
      <View style={styles.statsGrid}>
        <TouchableOpacity 
          style={[
            styles.statCard, 
            { borderColor: macOSColors.border.default },
            activeFilter === "all" && [
              styles.activeCard,
              {
                backgroundColor: macOSColors.semantic.infoBackground,
                borderColor: macOSColors.semantic.info,
                shadowColor: macOSColors.semantic.info,
              }
            ]
          ]}
          onPress={() => onFilterChange?.("all")}
          activeOpacity={0.8}
        >
          <View style={[styles.statDot, { backgroundColor: macOSColors.semantic.info }]} />
          <Text style={[styles.statValue, { color: macOSColors.semantic.info }]}>
            {stats.totalCount}
          </Text>
          <Text style={styles.statLabel}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.statCard, 
            { borderColor: macOSColors.border.default },
            activeFilter === "missing" && [
              styles.activeCard,
              {
                backgroundColor: macOSColors.semantic.errorBackground,
                borderColor: macOSColors.semantic.error,
                shadowColor: macOSColors.semantic.error,
              }
            ]
          ]}
          onPress={() => onFilterChange?.("missing")}
          activeOpacity={0.8}
        >
          <View style={[styles.statDot, { backgroundColor: macOSColors.semantic.error }]} />
          <Text style={[styles.statValue, { color: macOSColors.semantic.error }]}>
            {stats.missingCount}
          </Text>
          <Text style={styles.statLabel}>Missing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.statCard, 
            { borderColor: macOSColors.border.default },
            activeFilter === "issues" && [
              styles.activeCard,
              {
                backgroundColor: macOSColors.semantic.warningBackground,
                borderColor: macOSColors.semantic.warning,
                shadowColor: macOSColors.semantic.warning,
              }
            ]
          ]}
          onPress={() => onFilterChange?.("issues")}
          activeOpacity={0.8}
        >
          <View style={[styles.statDot, { backgroundColor: macOSColors.semantic.warning }]} />
          <Text style={[styles.statValue, { color: macOSColors.semantic.warning }]}>
            {issuesCount}
          </Text>
          <Text style={styles.statLabel}>Issues</Text>
        </TouchableOpacity>
      </View>
      
      {/* Storage Type Filter Cards - Smaller */}
      {onStorageTypeChange && (
        <View style={styles.storageTypeGrid}>
          <TouchableOpacity 
            style={[
              styles.storageTypeCard, 
              { borderColor: macOSColors.border.default },
              activeStorageType === "all" && [
                styles.activeStorageCard,
                {
                  backgroundColor: macOSColors.background.hover,
                  borderColor: macOSColors.text.secondary,
                }
              ]
            ]}
            onPress={() => onStorageTypeChange?.("all")}
            activeOpacity={0.8}
          >
            <Text style={[styles.storageTypeLabel, activeStorageType === "all" && { color: macOSColors.text.primary }]}>All Types</Text>
            <Text style={[styles.storageTypeValue, { color: macOSColors.text.secondary }]}>
              {stats.totalCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.storageTypeCard, 
              { borderColor: macOSColors.border.default },
              activeStorageType === "async" && [
                styles.activeStorageCard,
                {
                  backgroundColor: macOSColors.semantic.warningBackground,
                  borderColor: macOSColors.semantic.warning,
                }
              ]
            ]}
            onPress={() => onStorageTypeChange?.("async")}
            activeOpacity={0.8}
          >
            <Text style={[styles.storageTypeLabel, activeStorageType === "async" && { color: macOSColors.semantic.warning }]}>Async</Text>
            <Text style={[styles.storageTypeValue, { color: macOSColors.semantic.warning }]}>
              {stats.asyncCount || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.storageTypeCard, 
              { borderColor: macOSColors.border.default },
              activeStorageType === "mmkv" && [
                styles.activeStorageCard,
                {
                  backgroundColor: macOSColors.semantic.infoBackground,
                  borderColor: macOSColors.semantic.info,
                }
              ]
            ]}
            onPress={() => onStorageTypeChange?.("mmkv")}
            activeOpacity={0.8}
          >
            <Text style={[styles.storageTypeLabel, activeStorageType === "mmkv" && { color: macOSColors.semantic.info }]}>MMKV</Text>
            <Text style={[styles.storageTypeValue, { color: macOSColors.semantic.info }]}>
              {stats.mmkvCount || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.storageTypeCard, 
              { borderColor: macOSColors.border.default },
              activeStorageType === "secure" && [
                styles.activeStorageCard,
                {
                  backgroundColor: macOSColors.semantic.successBackground,
                  borderColor: macOSColors.semantic.success,
                }
              ]
            ]}
            onPress={() => onStorageTypeChange?.("secure")}
            activeOpacity={0.8}
          >
            <Text style={[styles.storageTypeLabel, activeStorageType === "secure" && { color: macOSColors.semantic.success }]}>Secure</Text>
            <Text style={[styles.storageTypeValue, { color: macOSColors.semantic.success }]}>
              {stats.secureCount || 0}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: macOSColors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    top: 8,
    right: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "monospace",
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 9,
    color: macOSColors.text.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    fontWeight: "600",
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  percentText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
  },
  activeCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ scale: 1.01 }],
  },
  
  // Storage Type Filter Cards
  storageTypeGrid: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  storageTypeCard: {
    flex: 1,
    backgroundColor: macOSColors.background.card,
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  storageTypeLabel: {
    fontSize: 8,
    color: macOSColors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    fontWeight: "600",
    marginBottom: 2,
  },
  storageTypeValue: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    lineHeight: 16,
  },
  activeStorageCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});