import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

interface EnvItemProps {
  name: string;
  value: string | undefined;
  isPublic: boolean;
}

const EnvItem: React.FC<EnvItemProps> = ({ name, value, isPublic }) => {
  return (
    <ThemedView
      style={[
        styles.envItem,
        { borderLeftColor: isPublic ? "#22c55e" : "#f59e0b" },
      ]}
    >
      <ThemedView style={styles.envHeader}>
        <Ionicons
          name={isPublic ? "globe" : "lock-closed"}
          size={16}
          color={isPublic ? "#22c55e" : "#f59e0b"}
        />
        <ThemedText style={styles.envName}>{name}</ThemedText>
        <ThemedView
          style={[
            styles.badge,
            { backgroundColor: isPublic ? "#22c55e" : "#f59e0b" },
          ]}
        >
          <ThemedText style={styles.badgeText}>
            {isPublic ? "PUBLIC" : "PRIVATE"}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.envValue}>{value || "Not set"}</ThemedText>
    </ThemedView>
  );
};

export const EnvDemo: React.FC = () => {
  // Get all environment variables that start with EXPO_PUBLIC_
  const publicEnvVars = Object.entries(process.env)
    .filter(([key]) => key.startsWith("EXPO_PUBLIC_"))
    .sort(([a], [b]) => a.localeCompare(b));

  // Some private environment variables for demo
  const privateEnvVars: [string, string | undefined][] = [
    ["NODE_ENV", process.env.NODE_ENV],
    ["SECRET_KEY", process.env.SECRET_KEY],
    ["DATABASE_URL", process.env.DATABASE_URL],
    ["API_SECRET", process.env.API_SECRET],
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Environment Variables</ThemedText>
      <ThemedText style={styles.description}>
        Environment variables are automatically synced with DevTools. Public
        variables (EXPO_PUBLIC_*) are visible to the client, while private
        variables are only available server-side.
      </ThemedText>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Public Environment Variables */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.subsectionTitle}>
            Public Variables ({publicEnvVars.length})
          </ThemedText>
          {publicEnvVars.length > 0 ? (
            publicEnvVars.map(([key, value]) => (
              <EnvItem key={key} name={key} value={value} isPublic={true} />
            ))
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons name="information-circle" size={24} color="#666" />
              <ThemedText style={styles.emptyText}>
                No public environment variables found. Add variables starting
                with EXPO_PUBLIC_ to see them here.
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Private Environment Variables */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.subsectionTitle}>
            Private Variables (Demo)
          </ThemedText>
          {privateEnvVars.map(([key, value]) => (
            <EnvItem key={key} name={key} value={value} isPublic={false} />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    marginBottom: 20,
    maxHeight: 400, // Limit height to prevent taking too much space
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  envItem: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  envHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  envName: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
    fontFamily: "monospace",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  envValue: {
    fontSize: 13,
    fontFamily: "monospace",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 6,
    borderRadius: 4,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
