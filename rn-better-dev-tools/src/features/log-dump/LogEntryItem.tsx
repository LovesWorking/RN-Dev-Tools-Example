import { StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "rn-better-dev-tools/icons";

import { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import { ListItem } from "../../shared/ui/components";
import { StatusBadge } from "../../shared/ui/components/Badge";

import { formatTimestamp, getTypeColor, getTypeIcon } from "./utils";

interface LogEntryItemProps {
  entry: ConsoleTransportEntry;
  onSelectEntry: (entry: ConsoleTransportEntry) => void;
}

const getLevelStatus = (level: string) => {
  switch (level) {
    case "error":
      return "error";
    case "warn":
      return "warning";
    case "info":
      return "info";
    case "debug":
      return "pending";
    default:
      return "inactive";
  }
};

export const LogEntryItem = ({ entry, onSelectEntry }: LogEntryItemProps) => {
  const IconComponent = getTypeIcon(entry.type);
  const typeColor = getTypeColor(entry.type);

  return (
    <ListItem onPress={() => onSelectEntry(entry)} style={styles.container}>
      {/* Header row with type, level and time */}
      <ListItem.Header style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Type indicator */}
          <View
            style={[
              styles.typeIndicator,
              { backgroundColor: `${typeColor}15` },
            ]}
          >
            <IconComponent size={12} color={typeColor} />
            <Text style={[styles.typeText, { color: typeColor }]}>
              {entry.type}
            </Text>
          </View>

          {/* Level indicator using StatusBadge */}
          <StatusBadge status={getLevelStatus(entry.level)} size="small" />
        </View>

        <View style={styles.headerRight}>
          <ListItem.Metadata>
            {formatTimestamp(entry.timestamp)}
          </ListItem.Metadata>
          <ChevronRight size={12} color="#6B7280" />
        </View>
      </ListItem.Header>

      {/* Message preview */}
      <ListItem.Content>
        <Text style={styles.message} numberOfLines={3}>
          {String(entry.message)}
        </Text>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  message: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
});
