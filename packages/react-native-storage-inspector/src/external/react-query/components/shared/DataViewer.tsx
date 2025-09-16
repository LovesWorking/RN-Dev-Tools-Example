import { View, Text, StyleSheet } from "react-native";

interface DataViewerProps {
  data: unknown;
  expanded?: boolean;
  maxHeight?: number;
}

/**
 * DataViewer component for displaying data in a formatted way
 * TODO: This is a placeholder - copy the actual implementation from react-query feature
 */
export const DataViewer: React.FC<DataViewerProps> = ({
  data,
  expanded = false,
  maxHeight = 200,
}) => {
  const displayValue = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);

  return (
    <View style={[styles.container, { maxHeight: expanded ? undefined : maxHeight }]}>
      <Text style={styles.text}>{displayValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    overflow: "hidden",
  },
  text: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#333",
  },
});
