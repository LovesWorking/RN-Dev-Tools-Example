import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Query, Mutation } from "@tanstack/react-query";
import { Database, Activity } from "lucide-react-native";

// Import shared Game UI components
import {
  GameUIStatusHeader,
  GameUICollapsibleSection,
  gameUIColors,
  useGameUIAlertState,
  GAME_UI_ALERT_STATES,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

// Import React Query specific components
import { GameUIQueryStats } from "./GameUIQueryStats";
import { GameUIQueryDetails } from "./GameUIQueryDetails";
import QueryBrowser from "./query-browser/QueryBrowser";
import MutationsList from "./query-browser/MutationsList";
import useAllQueries from "../hooks/useAllQueries";
import useAllMutations from "../hooks/useAllMutations";
import useQueryStatusCounts from "../hooks/useQueryStatusCounts";
import { useMutationStatusCounts } from "../hooks/useQueryStatusCounts";

// Custom alert states for React Query
const REACT_QUERY_ALERT_STATES = {
  ...GAME_UI_ALERT_STATES,
  OPTIMAL: {
    ...GAME_UI_ALERT_STATES.OPTIMAL,
    label: "CACHE HEALTHY",
    subtitle: "All queries fresh & active",
  },
  WARNING: {
    ...GAME_UI_ALERT_STATES.WARNING,
    label: "CACHE STALE",
    subtitle: "Some queries need refresh",
  },
  ERROR: {
    ...GAME_UI_ALERT_STATES.ERROR,
    label: "QUERY ERRORS",
    subtitle: "Failed queries detected",
  },
  CRITICAL: {
    ...GAME_UI_ALERT_STATES.CRITICAL,
    label: "CACHE FAILURE",
    subtitle: "Multiple query failures",
  },
};

interface GameUIReactQueryBrowserProps {
  activeTab?: "queries" | "mutations";
  onTabChange?: (tab: "queries" | "mutations") => void;
}

export function GameUIReactQueryBrowser({
  activeTab = "queries",
  onTabChange,
}: GameUIReactQueryBrowserProps) {
  // State
  const [selectedQuery, setSelectedQuery] = useState<Query | undefined>();
  const [selectedMutation, setSelectedMutation] = useState<Mutation | undefined>();
  const [queryFilter, setQueryFilter] = useState<string | null>(null);
  const [mutationFilter, setMutationFilter] = useState<string | null>(null);
  const [queriesExpanded, setQueriesExpanded] = useState(true);
  const [mutationsExpanded, setMutationsExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  // Hooks
  const queries = useAllQueries();
  const { mutations } = useAllMutations();
  const queryStats = useQueryStatusCounts();
  const mutationStats = useMutationStatusCounts();

  // Calculate overall stats for alert state
  const overallStats = useMemo(() => {
    const totalQueries = queries.length;
    const totalMutations = mutations.length;
    const errorQueries = queries.filter(q => q.state.status === "error").length;
    const errorMutations = mutations.filter(m => m.state.status === "error").length;
    const staleQueries = queryStats.stale;
    
    return {
      totalCount: totalQueries + totalMutations,
      requiredCount: totalQueries, // Consider queries as "required"
      missingCount: 0, // Not applicable for React Query
      wrongValueCount: errorQueries + errorMutations,
      wrongTypeCount: 0, // Not applicable
      presentRequiredCount: queryStats.fresh,
      optionalCount: totalMutations,
    };
  }, [queries, mutations, queryStats]);

  // Use alert state hook
  const { alertConfig, alertAnimatedStyle } = useGameUIAlertState(
    overallStats,
    REACT_QUERY_ALERT_STATES
  );

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundGrid} />

      {/* Status Header */}
      <GameUIStatusHeader
        alertConfig={alertConfig}
        badgeText="LIVE"
        animatedStyle={alertAnimatedStyle}
      />

      {/* Query Stats */}
      {activeTab === "queries" && (
        <GameUIQueryStats
          type="queries"
          stats={queryStats}
          activeFilter={queryFilter}
          onFilterChange={setQueryFilter}
        />
      )}

      {/* Mutation Stats */}
      {activeTab === "mutations" && (
        <GameUIQueryStats
          type="mutations"
          stats={mutationStats}
          activeFilter={mutationFilter}
          onFilterChange={setMutationFilter}
        />
      )}

      {/* Queries Section */}
      <GameUICollapsibleSection
        icon={Database}
        iconColor={gameUIColors.info}
        title="QUERIES"
        count={queries.length}
        subtitle="Data fetching operations and cache state"
        expanded={queriesExpanded}
        onToggle={() => setQueriesExpanded(!queriesExpanded)}
      >
        <View style={styles.browserContainer}>
          <QueryBrowser
            selectedQuery={selectedQuery}
            onQuerySelect={setSelectedQuery}
            activeFilter={queryFilter}
            queries={queries}
            emptyStateMessage="No queries active. Start fetching data to see queries here."
          />
        </View>
      </GameUICollapsibleSection>

      {/* Mutations Section */}
      <GameUICollapsibleSection
        icon={Activity}
        iconColor={gameUIColors.warning}
        title="MUTATIONS"
        count={mutations.length}
        subtitle="Data modification operations"
        expanded={mutationsExpanded}
        onToggle={() => setMutationsExpanded(!mutationsExpanded)}
      >
        <View style={styles.browserContainer}>
          <MutationsList
            selectedMutation={selectedMutation}
            setSelectedMutation={setSelectedMutation}
            activeFilter={mutationFilter}
          />
        </View>
      </GameUICollapsibleSection>

      {/* Details Section */}
      {(selectedQuery || selectedMutation) && (
        <GameUICollapsibleSection
          icon={Database}
          iconColor={gameUIColors.storage}
          title={selectedQuery ? "QUERY DETAILS" : "MUTATION DETAILS"}
          count={0}
          subtitle={selectedQuery ? "Selected query information" : "Selected mutation information"}
          expanded={detailsExpanded}
          onToggle={() => setDetailsExpanded(!detailsExpanded)}
        >
          <GameUIQueryDetails
            query={selectedQuery}
            mutation={selectedMutation}
            type={selectedQuery ? "query" : "mutation"}
          />
        </GameUICollapsibleSection>
      )}

      {/* Tech Footer */}
      <Text style={styles.techFooter}>
        // TANSTACK REACT QUERY DEVTOOLS
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  backgroundGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    backgroundColor: gameUIColors.info,
  },
  browserContainer: {
    maxHeight: 300,
    marginTop: 8,
  },
  techFooter: {
    fontSize: 8,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
    opacity: 0.5,
  },
});