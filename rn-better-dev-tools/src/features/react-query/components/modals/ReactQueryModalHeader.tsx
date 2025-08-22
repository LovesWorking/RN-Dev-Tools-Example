import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Query, Mutation } from "@tanstack/react-query";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface ReactQueryModalHeaderProps {
  selectedQuery?: Query;
  selectedMutation?: Mutation;
  activeTab: "queries" | "mutations";
  onTabChange: (tab: "queries" | "mutations") => void;
  onBack: () => void;
}

export function ReactQueryModalHeader({
  selectedQuery,
  selectedMutation,
  activeTab,
  onTabChange,
  onBack,
}: ReactQueryModalHeaderProps) {
  // Simple function to get query display text
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

  const getItemText = (item: Query | Mutation) => {
    if ("queryKey" in item) {
      return getQueryText(item);
    } else {
      return item.options.mutationKey
        ? (Array.isArray(item.options.mutationKey)
            ? item.options.mutationKey
            : [item.options.mutationKey]
          )
            .filter((k) => k != null)
            .map((k) => String(k))
            .join(" › ") || `Mutation #${item.mutationId}`
        : `Mutation #${item.mutationId}`;
    }
  };

  return (
    <View style={styles.container}>
      {selectedQuery || selectedMutation ? (
        <View style={styles.detailsView}>
          <BackButton
            onPress={onBack}
            color={gameUIColors.primary}
            size={16}
            accessibilityLabel="Back to list"
            accessibilityHint="Return to list view"
          />
          <Text style={styles.queryText} numberOfLines={1}>
            {getItemText(selectedQuery ?? selectedMutation!)}
          </Text>
        </View>
      ) : (
        <View style={styles.browserView}>
          <View style={styles.tabNavigationContainer}>
            <TouchableOpacity
              sentry-label="ignore user interaction"
              accessibilityLabel="Queries"
              accessibilityHint="View queries"
              onPress={() => onTabChange("queries")}
              style={[
                styles.tabButton,
                activeTab === "queries"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "queries"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                Queries
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              sentry-label="ignore user interaction"
              onPress={() => onTabChange("mutations")}
              style={[
                styles.tabButton,
                activeTab === "mutations"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "mutations"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                Mutations
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  detailsView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 8,
  },

  browserView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },

  tabNavigationContainer: {
    flexDirection: "row",
    backgroundColor: gameUIColors.panel,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    justifyContent: "space-evenly",
  },

  tabButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 1,
  },

  tabButtonActive: {
    backgroundColor: gameUIColors.info + "20",
    borderWidth: 1,
    borderColor: gameUIColors.info + "40",
  },

  tabButtonInactive: {
    backgroundColor: "transparent",
  },

  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },

  tabButtonTextActive: {
    color: gameUIColors.info,
  },

  tabButtonTextInactive: {
    color: gameUIColors.muted,
  },

  queryText: {
    flex: 1,
    color: gameUIColors.primary,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace",
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
});
