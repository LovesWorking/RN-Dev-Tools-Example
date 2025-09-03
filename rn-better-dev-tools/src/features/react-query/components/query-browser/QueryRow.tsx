import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Query } from "@tanstack/react-query";
import { getQueryStatusLabel } from "../../utils/getQueryStatusLabel";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

const getQueryText = (query: Query) => {
  if (!query?.queryKey) return "Unknown Query";
  const keys = Array.isArray(query.queryKey)
    ? query.queryKey
    : [query.queryKey];
  return (
    keys
      .filter((k) => k != null)
      .map((k) => String(k))
      .join(" › ") || "Unknown Query"
  );
};

interface QueryRowProps {
  query: Query;
  isSelected: boolean;
  onSelect: (query: Query) => void;
}

const QueryRow: React.FC<QueryRowProps> = ({ query, isSelected, onSelect }) => {
  // Game UI status color mapping
  const getStatusHexColor = (status: string): string => {
    switch (status) {
      case "fresh":
        return gameUIColors.success;
      case "stale":
        return gameUIColors.warning;
      case "inactive":
        return gameUIColors.muted;
      case "fetching":
        return gameUIColors.info;
      case "paused":
        return gameUIColors.storage;
      default:
        return gameUIColors.secondary;
    }
  };

  const status = getQueryStatusLabel(query);
  const observerCount = query.getObserversCount();
  const isDisabled = query.isDisabled();
  const queryHash = getQueryText(query);

  return (
    <TouchableOpacity
      sentry-label="ignore devtools query row"
      style={[styles.queryRow, isSelected && styles.selectedQueryRow]}
      onPress={() => onSelect(query)}
      activeOpacity={0.8}
      accessibilityLabel={`Query key ${queryHash}`}
      accessibilityState={{ selected: isSelected }}
    >
      {/* Status indicator and content in one row */}
      <View style={styles.rowContent}>
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusHexColor(status) },
            ]}
          />
          <View style={styles.statusInfo}>
            <Text
              style={[styles.statusLabel, { color: getStatusHexColor(status) }]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
            <Text style={styles.observerText}>
              {observerCount} observer{observerCount !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View style={styles.querySection}>
          <Text style={styles.queryHash}>{queryHash}</Text>
          {isDisabled && <Text style={styles.disabledText}>Disabled</Text>}
        </View>

        <View style={styles.badgeSection}>
          <Text
            style={[styles.statusBadge, { color: getStatusHexColor(status) }]}
          >
            {observerCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  queryRow: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    marginHorizontal: 8,
    marginVertical: 3,
    padding: 12,
    transform: [{ scale: 1 }],
  },
  selectedQueryRow: {
    backgroundColor: gameUIColors.info + "15",
    borderColor: gameUIColors.info + "50",
    transform: [{ scale: 1.01 }],
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
  },
  observerText: {
    fontSize: 10,
    color: gameUIColors.muted,
    marginTop: 1,
  },
  querySection: {
    flex: 2,
    paddingHorizontal: 12,
  },
  queryHash: {
    fontFamily: "monospace",
    fontSize: 12,
    color: gameUIColors.primary,
    lineHeight: 16,
  },
  badgeSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  disabledText: {
    fontSize: 10,
    color: gameUIColors.error,
    fontWeight: "500",
    marginTop: 2,
  },
});

export default QueryRow;
