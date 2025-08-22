import React from "react";
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

const QueryStatus: React.FC<QueryStatusProps> = ({
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
        text: gameUIColors.success 
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
        text: gameUIColors.info 
      },
      purple: {
        bg: gameUIColors.storage + "26",
        border: gameUIColors.storage + "59",
        dot: gameUIColors.storage,
        text: gameUIColors.storage,
      },
      red: { 
        bg: gameUIColors.error + "26", 
        border: gameUIColors.error + "59",
        dot: gameUIColors.error, 
        text: gameUIColors.error 
      },
      gray: { 
        bg: gameUIColors.muted + "26", 
        border: gameUIColors.muted + "59",
        dot: gameUIColors.muted, 
        text: gameUIColors.muted 
      },
    };
    return colorMap[colorName] || colorMap.gray;
  };

  const statusColors = getStatusColors(color);

  // Create active style based on the status color - React Query DevTools style
  const activeStyle = isActive
    ? {
        backgroundColor: gameUIColors.primary + "1F",
        transform: [{ scale: 1.05 }],
      }
    : {};

  return (
    <TouchableOpacity
      sentry-label="ignore devtools query status"
      style={[
        styles.queryStatusTag,
        activeStyle,
      ]}
      disabled={!onPress}
      onPress={onPress}
      onPressIn={onTouchStart}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: statusColors.dot },
        ]}
      />
      {showLabel && (
        <Text
          style={[styles.label]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      )}

      {count > 0 && (
        <Text
          style={[
            styles.count,
            { color: statusColors.dot },
          ]}
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
    backgroundColor: gameUIColors.primary + "0F", // Light background like React Query DevTools
    borderRadius: 12, // Pill shape
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 24,
    gap: 6,
    borderWidth: 0, // No border for clean look
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: gameUIColors.secondary, // Neutral text color
    textTransform: "capitalize", // Not all caps like RQ DevTools
    fontFamily: "system",
  },
  count: {
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    marginRight: 4,
    fontFamily: "system",
  },
});

export default QueryStatus;
