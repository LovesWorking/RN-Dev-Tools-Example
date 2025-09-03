import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface QueryStatusProps {
  label: string;
  color: "green" | "yellow" | "gray" | "blue" | "purple" | "red";
  count: number;
  showLabel?: boolean;
  isActive?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onTouchStart?: (event: GestureResponderEvent) => void;
}

type ColorName = "green" | "yellow" | "gray" | "blue" | "purple" | "red";

const QueryStatus: FC<QueryStatusProps> = ({
  label,
  color,
  count,
  showLabel = true,
  isActive = false,
  onPress,
  onTouchStart,
}) => {
  // Game UI color mapping for status indicators - matching ActionButton style
  const getStatusColors = (colorName: ColorName) => {
    const colorMap = {
      green: {
        bg: gameUIColors.success + "26",
        border: gameUIColors.success + "59",
        dot: gameUIColors.success,
        text: gameUIColors.success,
      },
      yellow: {
        bg: gameUIColors.warning + "26",
        border: gameUIColors.warning + "59",
        dot: gameUIColors.warning,
        text: gameUIColors.warning,
      },
      blue: {
        bg: gameUIColors.info + "26",
        border: gameUIColors.info + "59",
        dot: gameUIColors.info,
        text: gameUIColors.info,
      },
      purple: {
        bg: gameUIColors.optional + "26",
        border: gameUIColors.optional + "59",
        dot: gameUIColors.optional,
        text: gameUIColors.optional,
      },
      red: {
        bg: gameUIColors.error + "26",
        border: gameUIColors.error + "59",
        dot: gameUIColors.error,
        text: gameUIColors.error,
      },
      gray: {
        bg: gameUIColors.muted + "26",
        border: gameUIColors.muted + "59",
        dot: gameUIColors.muted,
        text: gameUIColors.muted,
      },
    };
    return colorMap[colorName] || colorMap.gray;
  };

  const statusColors = getStatusColors(color);

  return (
    <TouchableOpacity
      sentry-label="ignore devtools query status"
      style={[
        styles.queryStatusTag,
        isActive && {
          backgroundColor: statusColors.dot + "15",
          borderColor: statusColors.dot + "40",
        },
      ]}
      disabled={!onPress}
      onPress={onPress}
      onPressIn={onTouchStart}
      activeOpacity={0.7}
    >
      <View style={[styles.dot, { backgroundColor: statusColors.dot }]} />
      {showLabel && (
        <Text style={[styles.label]} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
      )}

      {count > 0 && (
        <Text
          style={[styles.count, { color: statusColors.dot }]}
          numberOfLines={1}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  queryStatusTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 26,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: gameUIColors.secondary,
    fontFamily: "system",
  },
  count: {
    fontSize: 11,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    marginLeft: "auto",
    fontFamily: "system",
  },
});

export default QueryStatus;
