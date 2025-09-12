import { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import type { NetworkEvent } from "../types";

export interface SimpleNetworkModalProps {
  visible: boolean;
  onClose: () => void;
  events: NetworkEvent[];
  onClearEvents?: () => void;
}

export const SimpleNetworkModal: React.FC<SimpleNetworkModalProps> = ({
  visible,
  onClose,
  events,
  onClearEvents,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredEvents = useMemo(() => {
    if (!searchText) return events;

    const searchLower = searchText.toLowerCase();
    return events.filter((event) => {
      return (
        event.url.toLowerCase().includes(searchLower) ||
        event.method.toLowerCase().includes(searchLower) ||
        event.status?.toString().includes(searchLower) ||
        event.host?.toLowerCase().includes(searchLower)
      );
    });
  }, [events, searchText]);

  const getStatusColor = (status?: number) => {
    if (!status) return "#999";
    if (status >= 200 && status < 300) return "#4CAF50";
    if (status >= 300 && status < 400) return "#FF9800";
    if (status >= 400 && status < 500) return "#F44336";
    if (status >= 500) return "#9C27B0";
    return "#999";
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "-";
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const renderEventItem = ({ item }: { item: NetworkEvent }) => {
    const isSelected = selectedEvent?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.eventItem, isSelected && styles.eventItemSelected]}
        onPress={() => setSelectedEvent(item)}
      >
        <View style={styles.eventRow}>
          <Text style={[styles.method, { color: getStatusColor(item.status) }]}>
            {item.method}
          </Text>
          <Text style={styles.status}>{item.status || "..."}</Text>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
        <Text style={styles.url} numberOfLines={1}>
          {item.url}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDetailView = (): JSX.Element => {
    if (!selectedEvent) {
      return (
        <View style={styles.detailEmpty}>
          <Text style={styles.detailEmptyText}>
            Select an event to view details
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.detailScroll}>
        <>
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>General</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>URL:</Text>
              <Text style={styles.detailValue}>{selectedEvent.url}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method:</Text>
              <Text style={styles.detailValue}>{selectedEvent.method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: getStatusColor(selectedEvent.status) },
                ]}
              >
                {selectedEvent.status || "Pending"}{" "}
                {selectedEvent.statusText || ""}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>
                {formatDuration(selectedEvent.duration)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Response Size:</Text>
              <Text style={styles.detailValue}>
                {formatSize(selectedEvent.responseSize)}
              </Text>
            </View>
          </View>

          {selectedEvent.requestHeaders &&
            Object.keys(selectedEvent.requestHeaders).length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Request Headers</Text>
                {Object.entries(selectedEvent.requestHeaders).map(
                  ([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{key}:</Text>
                      <Text style={styles.detailValue}>{String(value)}</Text>
                    </View>
                  )
                )}
              </View>
            )}

          {selectedEvent.responseHeaders &&
            Object.keys(selectedEvent.responseHeaders).length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Response Headers</Text>
                {Object.entries(selectedEvent.responseHeaders).map(
                  ([key, value]) => (
                    <View key={key} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{key}:</Text>
                      <Text style={styles.detailValue}>{String(value)}</Text>
                    </View>
                  )
                )}
              </View>
            )}

          {selectedEvent.requestData && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Request Body</Text>
              <Text style={styles.jsonText}>
                {JSON.stringify(selectedEvent.requestData, null, 2)}
              </Text>
            </View>
          )}

          {selectedEvent.responseData && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Response Body</Text>
              <Text style={styles.jsonText}>
                {JSON.stringify(selectedEvent.responseData, null, 2)}
              </Text>
            </View>
          )}

          {selectedEvent.error && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Error</Text>
              <Text style={styles.errorText}>{selectedEvent.error}</Text>
            </View>
          )}
        </>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Network Inspector</Text>
          <View style={styles.headerButtons}>
            {onClearEvents && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onClearEvents}
              >
                <Text style={styles.headerButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <Text style={styles.headerButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by URL, method, or status..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.listContainer}>
            <FlatList
              data={filteredEvents}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {searchText ? "No matching events" : "No network events"}
                  </Text>
                </View>
              }
            />
          </View>

          <View style={styles.detailContainer}>{renderDetailView()}</View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  headerButtonText: {
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    height: 36,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
  },
  content: {
    flex: 1,
    flexDirection: Platform.select({ web: "row", default: "column" }),
  },
  listContainer: {
    flex: Platform.select({ web: 0.4, default: 1 }),
    borderRightWidth: Platform.select({ web: 1, default: 0 }),
    borderRightColor: "#e0e0e0",
  },
  detailContainer: {
    flex: Platform.select({ web: 0.6, default: 1 }),
  },
  eventItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  eventItemSelected: {
    backgroundColor: "#f5f5f5",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  method: {
    fontSize: 12,
    fontWeight: "600",
    width: 60,
  },
  status: {
    fontSize: 12,
    color: "#666",
    width: 40,
  },
  duration: {
    fontSize: 12,
    color: "#999",
    marginLeft: "auto",
  },
  url: {
    fontSize: 12,
    color: "#333",
  },
  detailScroll: {
    flex: 1,
  },
  detailEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  detailEmptyText: {
    fontSize: 14,
    color: "#999",
  },
  detailSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    width: 100,
  },
  detailValue: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  jsonText: {
    fontSize: 11,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    color: "#333",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
  },
});
