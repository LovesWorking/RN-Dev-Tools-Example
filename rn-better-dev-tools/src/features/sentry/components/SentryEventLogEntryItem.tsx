import React from "react";

import { ConsoleTransportEntry } from "@/rn-better-dev-tools/src/shared/logger/types";
import { EventListItem } from "../../../shared/ui/components";

import { LogEntryHeader } from "@/rn-better-dev-tools/src/features/log-dump/components/LogEntryHeader";
import { LogEntrySentryBadge } from "./LogEntrySentryBadge";
import { SentryEventMessage } from "./SentryEventMessage";

interface SentryEventLogEntryItemProps {
  entry: ConsoleTransportEntry;
  onSelectEntry: (entry: ConsoleTransportEntry) => void;
}

export const SentryEventLogEntryItem = React.memo<SentryEventLogEntryItemProps>(
  ({ entry, onSelectEntry }) => {
    return (
      <EventListItem onPress={() => onSelectEntry(entry)}>
        <EventListItem.Header>
          <LogEntryHeader entry={entry} />
        </EventListItem.Header>
        
        <EventListItem.Main>
          <LogEntrySentryBadge metadata={entry.metadata} />
          <SentryEventMessage entry={entry} />
        </EventListItem.Main>
      </EventListItem>
    );
  },
);