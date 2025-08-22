import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryStatusCount from "@/rn-better-dev-tools/src/features/react-query/components/query-browser/QueryStatusCount";
import MutationStatusCount from "@/rn-better-dev-tools/src/features/react-query/components/query-browser/MutationStatusCount";

const queryClient = new QueryClient();

export default function TestFilters() {
  const [queryFilter, setQueryFilter] = React.useState<string | null>(null);
  const [mutationFilter, setMutationFilter] = React.useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Minimal Filter Buttons Design</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Query Filters:</Text>
            <View style={styles.filterContainer}>
              <QueryStatusCount
                activeFilter={queryFilter}
                onFilterChange={setQueryFilter}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mutation Filters:</Text>
            <View style={styles.filterContainer}>
              <MutationStatusCount
                activeFilter={mutationFilter}
                onFilterChange={setMutationFilter}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.info}>
              Active Query Filter: {queryFilter || "None"}
            </Text>
            <Text style={styles.info}>
              Active Mutation Filter: {mutationFilter || "None"}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00D4FF",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#00D4FF",
    marginBottom: 10,
    fontWeight: "600",
  },
  filterContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.2)",
  },
  info: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 5,
  },
});