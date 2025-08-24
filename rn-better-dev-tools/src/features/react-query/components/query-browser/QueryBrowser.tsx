import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  ViewStyle,
} from "react-native";
import { Query } from "@tanstack/react-query";
import QueryRow from "./QueryRow";
import useAllQueries from "../../hooks/useAllQueries";
import { getQueryStatusLabel } from "../../utils/getQueryStatusLabel";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface Props {
  selectedQuery: Query | undefined;
  onQuerySelect: (query: Query | undefined) => void;
  activeFilter?: string | null;
  emptyStateMessage?: string;
  contentContainerStyle?: ViewStyle;
  queries?: Query[]; // Optional external queries to override useAllQueries
}

// Stable module-scope functions to prevent FlatList view recreation [[memory:4875251]]
interface ExtraData {
  selectedQuery: Query | undefined;
  handleQuerySelect: (query: Query) => void;
  filteredQueries: Query[];
}

const renderItem = ({
  item,
  extraData,
}: {
  item: Query;
  extraData?: ExtraData;
}) => (
  <QueryRow
    query={item}
    isSelected={extraData?.selectedQuery?.queryHash === item.queryHash}
    onSelect={extraData?.handleQuerySelect ?? (() => {})}
  />
);

// Key extractor for FlatList optimization [[memory:4875251]]
const keyExtractor = (item: Query) => item.queryHash;

export default function QueryBrowser({
  selectedQuery,
  onQuerySelect,
  activeFilter,
  emptyStateMessage,
  contentContainerStyle,
  queries: externalQueries,
}: Props) {
  // Holds all queries using the working hook, or use external queries if provided
  const internalQueries = useAllQueries();
  const allQueries = externalQueries ?? internalQueries;

  // Filter queries based on active filter - same logic as working implementation
  const filteredQueries = React.useMemo(() => {
    if (!activeFilter) {
      return allQueries;
    }

    return allQueries.filter((query) => {
      const status = getQueryStatusLabel(query);
      return status === activeFilter;
    });
  }, [allQueries, activeFilter]);

  // Function to handle query selection with stable comparison - exact same logic as working version
  const handleQuerySelect = React.useCallback(
    (query: Query) => {
      // Compare queries by their queryKey and queryHash for stable selection
      const isCurrentlySelected = selectedQuery?.queryHash === query.queryHash;

      if (isCurrentlySelected) {
        onQuerySelect(undefined); // Deselect
        return;
      }
      onQuerySelect(query);
    },
    [selectedQuery?.queryHash, onQuerySelect],
  );

  if (filteredQueries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {emptyStateMessage ||
            (activeFilter
              ? `No ${activeFilter} queries found`
              : "No queries found")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listWrapper}>
      <FlatList
        sentry-label="ignore devtools query browser list"
        data={filteredQueries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle || styles.listContent}
        showsVerticalScrollIndicator
        removeClippedSubviews
        extraData={{
          selectedQuery,
          handleQuerySelect,
          filteredQueries,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 16,
    backgroundColor: gameUIColors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: gameUIColors.panel,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  emptyText: {
    color: gameUIColors.muted,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
});
