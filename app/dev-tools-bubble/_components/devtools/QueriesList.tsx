import React, { useState } from "react";
import { Query } from "@tanstack/react-query";
import { FlatList, View, StyleSheet, SafeAreaView, Text } from "react-native";
import QueryRow from "./QueryRow";
import useAllQueries from "../_hooks/useAllQueries";
import QueryInformation from "./QueryInformation";

interface Props {
  selectedQuery: Query | undefined;
  setSelectedQuery: React.Dispatch<React.SetStateAction<Query | undefined>>;
}

export default function QueriesList({
  selectedQuery,
  setSelectedQuery,
}: Props) {
  // Holds all queries
  const allQueries = useAllQueries();

  // Function to handle query selection
  const handleQuerySelect = (query: Query) => {
    // If deselecting (i.e., clicking the same query), just update the state
    if (query === selectedQuery) {
      setSelectedQuery(undefined);
      return;
    }
    setSelectedQuery(query); // Update the selected query
  };

  const renderItem = ({ item }: { item: Query }) => (
    <QueryRow
      query={item}
      isSelected={selectedQuery === item}
      onSelect={handleQuerySelect}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        {allQueries.length > 0 ? (
          <FlatList
            data={allQueries}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              `${JSON.stringify(item.queryKey)}-${index}`
            }
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No queries found</Text>
          </View>
        )}
      </View>
      {selectedQuery && (
        <View style={styles.queryInformation}>
          <QueryInformation
            selectedQuery={selectedQuery}
            setSelectedQuery={setSelectedQuery}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    height: "25%",
    backgroundColor: "#ffffff",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
  queryInformation: {
    height: "75%",
  },
});
