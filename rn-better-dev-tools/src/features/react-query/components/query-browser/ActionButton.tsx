import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

// Define the color mappings using Game UI colors
const buttonConfigs = {
  btnRefetch: {
    color: gameUIColors.success,
    backgroundColor: gameUIColors.success + "26",
    borderColor: gameUIColors.success + "59",
    textColor: gameUIColors.success,
  },
  btnInvalidate: {
    color: gameUIColors.warning,
    backgroundColor: gameUIColors.warning + "26",
    borderColor: gameUIColors.warning + "59",
    textColor: gameUIColors.warning,
  },
  btnReset: {
    color: gameUIColors.secondary,
    backgroundColor: gameUIColors.secondary + "26",
    borderColor: gameUIColors.secondary + "59",
    textColor: gameUIColors.secondary,
  },
  btnRemove: {
    color: gameUIColors.error,
    backgroundColor: gameUIColors.error + "26",
    borderColor: gameUIColors.error + "59",
    textColor: gameUIColors.error,
  },
  btnTriggerLoading: {
    color: gameUIColors.info,
    backgroundColor: gameUIColors.info + "26",
    borderColor: gameUIColors.info + "59",
    textColor: gameUIColors.info,
  },
  btnTriggerLoadiError: {
    color: gameUIColors.optional,
    backgroundColor: gameUIColors.optional + "26",
    borderColor: gameUIColors.optional + "59",
    textColor: gameUIColors.optional,
  },
};

interface Props {
  onClick: () => void;
  text: string;
  bgColorClass: keyof typeof buttonConfigs;
  _textColorClass: keyof typeof buttonConfigs;
  disabled: boolean;
}

export default function ActionButton({
  onClick,
  text,
  _textColorClass,
  bgColorClass,
  disabled,
}: Props) {
  // Get the button configuration
  const config = buttonConfigs[bgColorClass];

  return (
    <TouchableOpacity
      sentry-label="ignore devtools action button"
      disabled={disabled}
      onPress={onClick}
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? gameUIColors.muted + "1A"
            : config.backgroundColor,
          borderColor: disabled
            ? gameUIColors.muted + "33"
            : config.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: disabled ? gameUIColors.muted : config.color },
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: disabled ? gameUIColors.muted : config.textColor },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6, // rectangular button shape
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 32,
    minWidth: 80,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    shadowColor: gameUIColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
});
