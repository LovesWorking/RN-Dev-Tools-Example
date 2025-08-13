import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

// Define the color mappings following the app's design system - vibrant cool tones
const buttonConfigs = {
  btnRefetch: {
    color: "#10F981",
    backgroundColor: "rgba(16, 249, 129, 0.15)",
    borderColor: "rgba(16, 249, 129, 0.35)",
    textColor: "#10F981",
  },
  btnInvalidate: {
    color: "#FFA500",
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    borderColor: "rgba(255, 165, 0, 0.35)",
    textColor: "#FFA500",
  },
  btnReset: {
    color: "#64748B",
    backgroundColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "rgba(100, 116, 139, 0.35)",
    textColor: "#94A3B8",
  },
  btnRemove: {
    color: "#FF4757",
    backgroundColor: "rgba(255, 71, 87, 0.15)",
    borderColor: "rgba(255, 71, 87, 0.35)",
    textColor: "#FF4757",
  },
  btnTriggerLoading: {
    color: "#06B6D4",
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderColor: "rgba(6, 182, 212, 0.35)",
    textColor: "#06B6D4",
  },
  btnTriggerLoadiError: {
    color: "#FF6348",
    backgroundColor: "rgba(255, 99, 72, 0.15)",
    borderColor: "rgba(255, 99, 72, 0.35)",
    textColor: "#FF6348",
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
            ? "rgba(107, 114, 128, 0.1)"
            : config.backgroundColor,
          borderColor: disabled
            ? "rgba(107, 114, 128, 0.2)"
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
          { backgroundColor: disabled ? "#6B7280" : config.color },
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: disabled ? "#6B7280" : config.textColor },
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
    shadowColor: "#FFFFFF",
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
