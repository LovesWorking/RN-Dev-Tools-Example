import { View, Text, StyleSheet } from "react-native";
import { Query } from "@tanstack/react-query";
import { getQueryStatusLabel } from "../../utils/getQueryStatusLabel";
import { ListItem } from "../../../../shared/ui/components";
import { StatusBadge, CountBadge } from "../../../../shared/ui/components/Badge";
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
  const status = getQueryStatusLabel(query);
  const observerCount = query.getObserversCount();
  const isDisabled = query.isDisabled();
  const queryHash = getQueryText(query);

  return (
    <ListItem
      onPress={() => onSelect(query)}
      style={[styles.queryRow, isSelected && styles.selectedQueryRow]}
    >
      <View style={styles.rowContent}>
        <View style={styles.statusSection}>
          <StatusBadge status={status} size="small" />
          <ListItem.Metadata style={styles.observerText}>
            {observerCount} observer{observerCount !== 1 ? "s" : ""}
          </ListItem.Metadata>
        </View>

        <View style={styles.querySection}>
          <ListItem.Title style={styles.queryHash} numberOfLines={1}>
            {queryHash}
          </ListItem.Title>
          {isDisabled && (
            <ListItem.Metadata style={styles.disabledText}>
              Disabled
            </ListItem.Metadata>
          )}
        </View>

        <View style={styles.badgeSection}>
          <CountBadge count={observerCount} size="small" />
        </View>
      </View>
    </ListItem>
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
  observerText: {
    fontSize: 10,
    marginTop: 1,
  },
  querySection: {
    flex: 2,
    paddingHorizontal: 12,
  },
  queryHash: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 16,
  },
  badgeSection: {
    alignItems: "flex-end",
  },
  disabledText: {
    color: gameUIColors.error,
    fontWeight: "500",
    marginTop: 2,
  },
});

export default QueryRow;