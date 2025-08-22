import { Query } from "@tanstack/react-query";
import { getQueryStatusLabel } from "../../utils/getQueryStatusLabel";
import { Text, View, StyleSheet } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface Props {
  query: Query;
}

const backgroundColors = {
  fresh: gameUIColors.success + "1A",
  stale: gameUIColors.warning + "1A",
  fetching: gameUIColors.info + "1A",
  paused: gameUIColors.storage + "1A",
  noObserver: gameUIColors.muted + "1A",
  error: gameUIColors.error + "1A",
  inactive: gameUIColors.muted + "1A",
};

const borderColors = {
  fresh: gameUIColors.success + "33",
  stale: gameUIColors.warning + "33",
  fetching: gameUIColors.info + "33",
  paused: gameUIColors.storage + "33",
  noObserver: gameUIColors.muted + "33",
  error: gameUIColors.error + "33",
  inactive: gameUIColors.muted + "33",
};

const textColors = {
  fresh: gameUIColors.success,
  stale: gameUIColors.warning,
  fetching: gameUIColors.info,
  paused: gameUIColors.storage,
  noObserver: gameUIColors.muted,
  error: gameUIColors.error,
  inactive: gameUIColors.muted,
};
type QueryStatus =
  | "fresh"
  | "stale"
  | "fetching"
  | "paused"
  | "noObserver"
  | "error"
  | "inactive";

export default function QueryDetailsChip({ query }: Props) {
  const status = getQueryStatusLabel(query) as QueryStatus;
  const backgroundColor = backgroundColors[status];
  const borderColor = borderColors[status];
  const textColor = textColors[status];

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{status}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "monospace",
  },
});
