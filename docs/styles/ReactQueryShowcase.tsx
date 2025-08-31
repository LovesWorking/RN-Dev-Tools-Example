import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ReactQueryIcon } from "@/rn-better-dev-tools/icons/ReactQueryIcon";

// Color presets
const QueryColors = {
  red: "#FF3366",
  orange: "#FF8800",
  yellow: "#FFD700",
  purple: "#9945FF",
  cyan: "#00D4FF",
  pink: "#FF45FF",
};

// Demo Component
export const ReactQueryShowcase: React.FC = () => {
  const colors = Object.keys(QueryColors) as (keyof typeof QueryColors)[];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>REACT QUERY ICON</Text>
      <Text style={styles.subtitle}>Hexagon with Orbital Lines</Text>

      {/* Hero Display */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ MAIN ICON</Text>
        <View style={styles.heroBox}>
          <View style={styles.darkBg}>
            <ReactQueryIcon
              size={80}
              color={QueryColors.red}
              glowColor={QueryColors.red}
            />
          </View>
          <Text style={styles.description}>
            Hexagon center with 3 orbital lines at 0°, 60°, and -60°
          </Text>
        </View>
      </View>

      {/* Color Variations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌈 COLOR VARIATIONS</Text>
        <View style={styles.colorGrid}>
          {colors.map((colorKey) => (
            <View key={colorKey} style={styles.colorBox}>
              <View style={[styles.darkBg, styles.colorBgBox]}>
                <ReactQueryIcon
                  size={60}
                  color={QueryColors[colorKey]}
                  glowColor={QueryColors[colorKey]}
                />
              </View>
              <Text style={styles.colorName}>{colorKey.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Size Variations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📏 SIZE VARIATIONS</Text>
        <View style={styles.sizeRow}>
          {[24, 32, 48, 64].map((size) => (
            <View key={size} style={styles.sizeBox}>
              <View style={[styles.darkBg, { padding: 10 }]}>
                <ReactQueryIcon
                  size={size}
                  color={QueryColors.red}
                  glowColor={QueryColors.red}
                />
              </View>
              <Text style={styles.sizeLabel}>{size}px</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Implementation Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>📝 IMPLEMENTATION NOTES</Text>
        <Text style={styles.notesText}>
          • Hexagon: 3 rectangles at 0°, 60°, -60° overlapping{'\n'}
          • Orbital lines: Views with borderRadius for capsule shape{'\n'}
          • Lines positioned at same angles as hexagon sides{'\n'}
          • Circuit background from reusable component{'\n'}
          • No SVG dependencies - pure React Native Views
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "monospace",
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#888",
    marginBottom: 20,
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  heroBox: {
    alignItems: "center",
  },
  darkBg: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    color: "#666",
    fontSize: 12,
    marginTop: 15,
    fontFamily: "monospace",
    textAlign: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  colorBox: {
    width: "30%",
    alignItems: "center",
  },
  colorBgBox: {
    width: "100%",
    aspectRatio: 1,
  },
  colorName: {
    color: "#555",
    fontSize: 10,
    marginTop: 8,
    fontFamily: "monospace",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10,
  },
  sizeBox: {
    alignItems: "center",
  },
  sizeLabel: {
    color: "#555",
    fontSize: 10,
    marginTop: 8,
    fontFamily: "monospace",
  },
  notesSection: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 20,
  },
  notesTitle: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "monospace",
  },
  notesText: {
    color: "#555",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "monospace",
  },
});

export default ReactQueryShowcase;