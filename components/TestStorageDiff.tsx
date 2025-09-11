import { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { StorageEventDetailContent } from "@/rn-better-dev-tools/src/features/storage/components/StorageEventDetailContent";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

const mockConversation = {
  key: "test_key",
  lastEvent: {
    timestamp: new Date(),
    action: "setItem" as const,
    data: {
      key: "test_key",
      value: JSON.stringify({
        user: { name: "Jane Smith", email: "jane@example.com", age: 28 },
        settings: { theme: "dark", notifications: true },
        items: ["item3", "item4", "item5"],
      }),
    },
  },
  events: [
    {
      timestamp: new Date(Date.now() - 60000),
      action: "setItem" as const,
      data: {
        key: "test_key",
        value: JSON.stringify({
          user: { name: "John Doe", email: "john@example.com", age: 25 },
          settings: { theme: "light", notifications: false },
          items: ["item1", "item2"],
        }),
      },
    },
    {
      timestamp: new Date(),
      action: "setItem" as const,
      data: {
        key: "test_key",
        value: JSON.stringify({
          user: { name: "Jane Smith", email: "jane@example.com", age: 28 },
          settings: { theme: "dark", notifications: true },
          items: ["item3", "item4", "item5"],
        }),
      },
    },
  ],
  totalOperations: 2,
  currentValue: {
    user: { name: "Jane Smith", email: "jane@example.com", age: 28 },
    settings: { theme: "dark", notifications: true },
    items: ["item3", "item4", "item5"],
  },
  valueType: "object" as const,
};

export function TestStorageDiff() {
  const [activeTab, setActiveTab] = useState<"current" | "diff">("diff");
  const [selectedEventIndex, setSelectedEventIndex] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Storage Diff Viewer Test</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "current" && styles.tabActive]}
            onPress={() => setActiveTab("current")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "current" && styles.tabTextActive,
              ]}
            >
              CURRENT VALUE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "diff" && styles.tabActive]}
            onPress={() => setActiveTab("diff")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "diff" && styles.tabTextActive,
              ]}
            >
              DIFF
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StorageEventDetailContent
        conversation={mockConversation}
        selectedEventIndex={selectedEventIndex}
        onEventIndexChange={setSelectedEventIndex}
        disableInternalFooter={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: gameUIColors.panel,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "40",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: gameUIColors.primary,
    fontFamily: "monospace",
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: gameUIColors.blackTint2,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: gameUIColors.primary + "20",
    borderWidth: 1,
    borderColor: gameUIColors.primary + "40",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: gameUIColors.secondary,
    fontFamily: "monospace",
  },
  tabTextActive: {
    color: gameUIColors.primary,
  },
});
