import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ChevronRight } from "rn-better-dev-tools/icons";

import { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import { ListItem } from "../../../shared/ui/components";
import { TypeBadge } from "../../../shared/ui/components/Badge";
import {
  getLevelBorderColor,
  getTypeIcon,
  getTypeColor,
} from "@/rn-better-dev-tools/src/features/log-dump/utils";
import { formatRelativeTime } from "@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime";
import { useTickEveryMinute } from "../hooks/useTickEveryMinute";
import { formatEventMessage } from "../utils/eventParsers";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface SentryEventLogEntryItemProps {
  entry: ConsoleTransportEntry;
  onSelectEntry: (entry: ConsoleTransportEntry) => void;
}

// Compact version of the event card - single line layout [[memory:4875251]]
export const SentryEventLogEntryItem = React.memo<SentryEventLogEntryItemProps>(
  ({ entry, onSelectEntry }) => {
    const tick = useTickEveryMinute();
    const IconComponent = getTypeIcon(entry.type);
    const typeColor = getTypeColor(entry.type);
    const levelColor = getLevelBorderColor(entry.level);

    return (
      <ListItem
        onPress={() => onSelectEntry(entry)}
        style={[styles.container, { borderLeftColor: levelColor }]}
      >
        {/* Left section: Type icon only */}
        <View style={styles.leftSection}>
          <View
            style={[styles.typeIcon, { backgroundColor: `${typeColor}15` }]}
          >
            {IconComponent && <IconComponent size={14} color={typeColor} />}
          </View>
        </View>

        {/* Middle section: Message only */}
        <View style={styles.middleSection}>
          <Text style={styles.message} numberOfLines={2}>
            {formatEventMessage(entry)}
          </Text>
        </View>

        {/* Right section: Badge, timestamp and chevron */}
        <View style={styles.rightSection}>
          <View style={styles.rightContent}>
            {entry.metadata.sentryEventType ? (
              <TypeBadge
                type={String(entry.metadata.sentryEventType)}
                color={gameUIColors.storage}
                size="small"
                style={styles.badge}
              />
            ) : null}
            <ListItem.Metadata>
              {formatRelativeTime(entry.timestamp, tick)}
            </ListItem.Metadata>
          </View>
          <ChevronRight size={14} color={gameUIColors.muted} />
        </View>
      </ListItem>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    paddingLeft: 8,
    marginBottom: 4,
    marginHorizontal: 16,
    minHeight: 36,
    borderLeftWidth: 3,
    borderLeftColor: "transparent", // Will be overridden by inline style
  },
  leftSection: {
    alignItems: "center",
    marginRight: 8,
  },
  typeIcon: {
    padding: 3,
    borderRadius: 4,
  },

  middleSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 8,
    paddingVertical: 2,
  },
  badge: {
    marginBottom: 2,
    alignSelf: "flex-end",
  },
  message: {
    color: gameUIColors.primaryLight,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
