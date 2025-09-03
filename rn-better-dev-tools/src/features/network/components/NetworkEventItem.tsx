import { View, Text, StyleSheet } from "react-native";
import { AlertCircle, CheckCircle, Clock } from "rn-better-dev-tools/icons";
import { ListItem } from "../../../shared/ui/components";
import { MethodBadge } from "../../../shared/ui/components/Badge";
import type { NetworkEvent } from "../types";
import { formatBytes, formatDuration } from "../utils/formatting";

interface NetworkEventItemProps {
  event: NetworkEvent;
  onPress: (event: NetworkEvent) => void;
}

// Helper function moved outside component for better performance
function getStatusColor(status?: number, error?: string) {
  if (error) return "#EF4444";
  if (!status) return "#F59E0B";
  if (status >= 200 && status < 300) return "#10B981";
  if (status >= 300 && status < 400) return "#3B82F6";
  if (status >= 400) return "#EF4444";
  return "#6B7280";
}

export function NetworkEventItem({ event, onPress }: NetworkEventItemProps) {
  const statusColor = getStatusColor(event.status, event.error);
  const isPending = !event.status && !event.error;

  // Extract just the path for compact display
  const displayUrl = event.path || event.url.replace(/^https?:\/\/[^/]+/, "");

  // Determine if we need to show size info
  const showSizeInfo =
    (event.requestSize && event.requestSize > 1024) ||
    (event.responseSize && event.responseSize > 1024);

  return (
    <ListItem
      onPress={() => onPress(event)}
      style={styles.listItem}
    >
      <View style={styles.mainRow}>
        {/* Method badge */}
        <MethodBadge method={event.method} size="small" />

        {/* URL */}
        <Text style={styles.urlText} numberOfLines={1}>
          {displayUrl}
        </Text>

        {/* Status/Duration */}
        <View style={styles.rightSection}>
          {event.duration ? (
            <Text style={styles.durationText}>
              {formatDuration(event.duration)}
            </Text>
          ) : null}

          {/* Status icon and code */}
          <View style={styles.statusContainer}>
            {isPending ? (
              <Clock size={12} color="#F59E0B" />
            ) : event.error ? (
              <AlertCircle size={12} color="#EF4444" />
            ) : (
              <CheckCircle size={12} color={statusColor} />
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {event.status
                ? String(event.status)
                : event.error
                  ? "ERR"
                  : "..."}
            </Text>
          </View>
        </View>
      </View>

      {/* Show error message if present */}
      {event.error ? (
        <Text style={styles.errorText} numberOfLines={1}>
          {event.error}
        </Text>
      ) : null}

      {/* Size and timestamp info */}
      {showSizeInfo ? (
        <View style={styles.sizeRow}>
          <ListItem.Metadata>
            {new Date(event.timestamp).toLocaleTimeString()}
          </ListItem.Metadata>
          <View style={styles.sizeContainer}>
            {event.requestSize ? (
              <Text style={styles.sizeText}>
                ↑ {formatBytes(event.requestSize)}
              </Text>
            ) : null}
            {event.responseSize ? (
              <Text style={styles.sizeText}>
                ↓ {formatBytes(event.responseSize)}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(139, 92, 246, 0.3)",
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  urlText: {
    fontSize: 12,
    color: "#E5E7EB",
    flex: 1,
    fontFamily: "monospace",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  durationText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 10,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 48,
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 48,
  },
  sizeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  sizeText: {
    fontSize: 9,
    color: "#9CA3AF",
    fontFamily: "monospace",
  },
});