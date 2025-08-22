import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Query, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";
import Explorer from "./query-browser/Explorer";
import QueryDetails from "./query-browser/QueryDetails";
import ActionButton from "./query-browser/ActionButton";
import { getQueryStatusLabel } from "../utils/getQueryStatusLabel";
import { useActionButtons } from "../hooks/useActionButtons";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { DataViewer } from "./shared/DataViewer";

interface ActionButtonConfig {
  label: string;
  bgColorClass: "btnRefetch" | "btnTriggerLoading" | "btnTriggerLoadiError";
  textColorClass: "btnRefetch" | "btnTriggerLoading" | "btnTriggerLoadiError";
  disabled: boolean;
  onPress: () => void;
}

interface DataEditorModeProps {
  selectedQuery: Query;
  isFloatingMode: boolean;
}

export function DataEditorMode({
  selectedQuery,
  isFloatingMode,
}: DataEditorModeProps) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const actionButtons = useActionButtons(selectedQuery, queryClient);

  return (
    <>
      <ScrollView
        accessibilityLabel="Data editor mode"
        accessibilityHint="View data editor mode"
        sentry-label="ignore data editor mode"
        style={styles.explorerScrollContainer}
        contentContainerStyle={styles.explorerScrollContent}
      >
        {/* Data Explorer Section - Moved to top for immediate data editing */}
        <View style={styles.section}>
          <DataExplorer
            visible={!!selectedQuery.state.data}
            selectedQuery={selectedQuery}
          />
          <DataEmptyState
            visible={!selectedQuery.state.data}
            selectedQuery={selectedQuery}
          />
        </View>

        {/* Query Details Section */}
        <View style={styles.section}>
          <QueryDetails query={selectedQuery} />
        </View>

        {/* Query Explorer Section - Non-editable viewer */}
        <View style={styles.section}>
          <View style={styles.queryExplorerContainer}>
            <Text style={styles.queryExplorerHeader}>Query Explorer</Text>
            <View style={styles.queryExplorerContent}>
              <DataViewer
                title=""
                data={selectedQuery}
                maxDepth={10}
                rawMode={true}
                showTypeFilter={true}
                initialExpanded={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Footer with Safe Area */}
      <View
        style={[
          styles.actionFooter,
          { paddingBottom: isFloatingMode ? 0 : insets.bottom + 8 },
        ]}
      >
        <View style={styles.actionsGrid}>
          {actionButtons.map((action: ActionButtonConfig, index: number) => (
            <ActionButton
              sentry-label={`ignore action button ${action.label}`}
              key={index}
              onClick={action.onPress}
              text={action.label}
              bgColorClass={action.bgColorClass}
              _textColorClass={action.textColorClass}
              disabled={action.disabled}
            />
          ))}
        </View>
      </View>
    </>
  );
}

function DataExplorer({
  visible,
  selectedQuery,
}: {
  visible: boolean;
  selectedQuery: Query;
}) {
  if (!visible) return null;
  return (
    <View style={styles.dataContainer}>
      <Text style={styles.dataHeader}>Data Editor</Text>
      <View style={styles.dataContent}>
        <Explorer
          key={selectedQuery.queryHash}
          editable={true}
          label="Data"
          value={selectedQuery.state.data}
          defaultExpanded={["Data"]}
          activeQuery={selectedQuery}
        />
      </View>
    </View>
  );
}

function DataEmptyState({
  visible,
  selectedQuery,
}: {
  visible: boolean;
  selectedQuery: Query;
}) {
  if (!visible) return null;
  const getEmptyStateContent = () => {
    if (
      selectedQuery.state.status === "pending" ||
      getQueryStatusLabel(selectedQuery) === "fetching"
    ) {
      return {
        title:
          selectedQuery.state.status === "pending"
            ? "Loading..."
            : "Refetching...",
        description: "Please wait while the query is being executed.",
      };
    }

    if (selectedQuery.state.status === "error") {
      return {
        title: "Query Error",
        description:
          selectedQuery.state.error?.message ||
          "An error occurred while fetching data.",
      };
    }

    return {
      title: "No Data Available",
      description:
        "This query has no data to edit. Try refetching the query first.",
    };
  };

  const { title, description } = getEmptyStateContent();

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Explorer section
  explorerScrollContainer: {
    flex: 1,
  },
  explorerScrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  // Section layout matching QueryInformation
  section: {
    marginBottom: 16,
  },

  // Empty states matching main dev tools
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    color: gameUIColors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    color: gameUIColors.secondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },

  // Action footer matching main dev tools exactly
  actionFooter: {
    borderTopWidth: 1,
    borderTopColor: gameUIColors.primary + "0F", // Match DevToolsHeader border
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: gameUIColors.background,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6, // Reduced from 8
    justifyContent: "space-between",
  },
  // Query Explorer styled container matching QueryDetails
  queryExplorerContainer: {
    minWidth: 200,
    backgroundColor: gameUIColors.panel + "D9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.info + "4D",
    overflow: "hidden",
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  queryExplorerHeader: {
    backgroundColor: gameUIColors.info + "1A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "600",
    fontSize: 12,
    color: gameUIColors.info,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.info + "33",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  queryExplorerContent: {
    padding: 8,
  },
  // Data section with green accent - editable/success theme
  dataContainer: {
    minWidth: 200,
    backgroundColor: gameUIColors.panel + "D9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.info + "4D",
    overflow: "hidden",
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 8,
  },
  dataHeader: {
    backgroundColor: gameUIColors.info + "1A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "600",
    fontSize: 12,
    color: gameUIColors.info,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.info + "33",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  dataContent: {
    padding: 8,
  },
});
