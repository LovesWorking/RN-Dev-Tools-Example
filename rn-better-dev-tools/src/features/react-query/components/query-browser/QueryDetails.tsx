import { Query } from "@tanstack/react-query";
import QueryDetailsChip from "./QueryDetailsChip";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface Props {
  query: Query | undefined;
}
export default function QueryDetails({ query }: Props) {
  if (query === undefined) {
    return null;
  }
  // Convert the timestamp to a Date object and format it
  const lastUpdated = new Date(query.state.dataUpdatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <View style={styles.minWidth}>
      <Text style={styles.headerText}>Query Details</Text>
      <View style={styles.row}>
        <ScrollView
          sentry-label="ignore devtools query details scroll"
          horizontal
          style={styles.flexOne}
        >
          <Text style={styles.queryKeyText}>
            {displayValue(query.queryKey, true)}
          </Text>
        </ScrollView>
        <QueryDetailsChip query={query} />
      </View>
      <View style={styles.row}>
        <Text style={styles.labelText}>Observers:</Text>
        <Text style={styles.valueText}>{`${query.getObserversCount()}`}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.labelText}>Last Updated:</Text>
        <Text style={styles.valueText}>{`${lastUpdated}`}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  minWidth: {
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
  headerText: {
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.muted + "66",
  },
  flexOne: {
    flex: 1,
    marginRight: 8,
  },
  queryKeyText: {
    fontSize: 12,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    lineHeight: 18,
    flexShrink: 1,
    backgroundColor: gameUIColors.info + "1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.info + "4D",
  },
  labelText: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  valueText: {
    fontSize: 12,
    color: gameUIColors.primaryLight,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    fontFamily: "monospace",
  },
});
