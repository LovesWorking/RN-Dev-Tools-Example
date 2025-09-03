import React from "react";
import { StyleSheet, View } from "react-native";

import { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import { ListItem } from "../../../shared/ui/components";

import { LogEntryHeader } from "@/rn-better-dev-tools/src/features/log-dump/components/LogEntryHeader";
import { LogEntrySentryBadge } from "./LogEntrySentryBadge";
import { SentryEventMessage } from "./SentryEventMessage";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface SentryEventLogEntryItemProps {
  entry: ConsoleTransportEntry;
  onSelectEntry: (entry: ConsoleTransportEntry) => void;
}

// Memoized leaf component to prevent unnecessary re-renders in FlatList [[memory:4875251]]
export const SentryEventLogEntryItem = React.memo<SentryEventLogEntryItemProps>(
  ({ entry, onSelectEntry }) => {
    return (
      <ListItem
        onPress={() => onSelectEntry(entry)}
        style={styles.listItem}
      >
        <ListItem.Header>
          <LogEntryHeader entry={entry} />
        </ListItem.Header>
        
        <ListItem.Content>
          <LogEntrySentryBadge metadata={entry.metadata} />
          <SentryEventMessage entry={entry} />
        </ListItem.Content>
      </ListItem>
    );
  },
);

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
});