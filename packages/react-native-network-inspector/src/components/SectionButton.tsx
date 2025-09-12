import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface SectionButtonProps {
  id: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  accentColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  disabled?: boolean;
  testID?: string;
}

export const SectionButton: React.FC<SectionButtonProps> = ({
  id,
  title,
  subtitle,
  onPress,
  accentColor = "#007AFF",
  style,
  titleStyle,
  subtitleStyle,
  disabled = false,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID || `section-button-${id}`}
      style={[
        styles.container,
        { borderColor: accentColor },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: accentColor }, subtitleStyle]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.indicator}>
          <Text style={[styles.chevron, { color: accentColor }]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.8,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  chevron: {
    fontSize: 24,
    fontWeight: "300",
  },
});
