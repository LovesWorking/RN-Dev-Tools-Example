import {
  EventListItem,
  MethodBadge,
  StatusIndicator,
  TimeDisplay,
} from "../../../shared/ui/components";
import type { NetworkEvent } from "../types";

interface NetworkEventItemProps {
  event: NetworkEvent;
  onPress: (event: NetworkEvent) => void;
}

function getStatus(
  event: NetworkEvent,
): "success" | "error" | "warning" | "pending" {
  if (event.error) return "error";
  if (!event.status) return "pending";
  if (event.status >= 200 && event.status < 300) return "success";
  if (event.status >= 400) return "error";
  return "warning";
}

export function NetworkEventItem({ event, onPress }: NetworkEventItemProps) {
  const status = getStatus(event);
  const displayUrl = event.path || event.url.replace(/^https?:\/\/[^/]+/, "");

  return (
    <EventListItem onPress={() => onPress(event)}>
      <EventListItem.Header>
        <MethodBadge method={event.method} size="small" />
        <StatusIndicator.Dot status={status} animated={status === "pending"} />
        <EventListItem.Timestamp time={event.timestamp} />
      </EventListItem.Header>

      <EventListItem.Main>
        <EventListItem.Title>{displayUrl}</EventListItem.Title>
        {event.error && (
          <EventListItem.Description>{event.error}</EventListItem.Description>
        )}
      </EventListItem.Main>

      <EventListItem.Metadata>
        {event.status && (
          <StatusIndicator.Text
            status={status}
            label={String(event.status)}
            size="small"
          />
        )}
        {event.duration && (
          <TimeDisplay.Duration milliseconds={event.duration} />
        )}
        {event.requestSize && event.requestSize > 1024 && (
          <EventListItem.Size bytes={event.requestSize} />
        )}
        {event.responseSize && event.responseSize > 1024 && (
          <EventListItem.Size bytes={event.responseSize} />
        )}
      </EventListItem.Metadata>
    </EventListItem>
  );
}
