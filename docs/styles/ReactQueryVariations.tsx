import React from "react";
import { View, Text, ScrollView, StyleSheet, ViewStyle } from "react-native";

// Color for all variations
const activeColor = "#FF3366";
const activeGlow = "#FF3366";

// Variation 1: Single filled hexagon (simpler approach)
const ReactQueryV1: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Orbital lines first (behind) */}
      {/* Horizontal line */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.25 * scale,
            opacity: 0.8,
          } as ViewStyle
        }
      />

      {/* Top-right line (60deg) */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.8,
          } as ViewStyle
        }
      />

      {/* Top-left line (-60deg) */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.8,
          } as ViewStyle
        }
      />

      {/* Hexagon - using 6 triangular segments */}
      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 10 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 5 * scale,
            transform: [{ rotate: "45deg" }],
          } as ViewStyle
        }
      />
    </View>
  );
};

// Variation 2: Thinner lines with better hexagon
const ReactQueryV2: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Thinner orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: activeColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: activeColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: activeColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      {/* Better hexagon using wider rectangles */}
      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.5 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.5 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.5 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />
    </View>
  );
};

// Variation 3: Smaller hexagon, longer lines
const ReactQueryV3: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Longer orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 24 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: 0,
            top: size / 2 - 1 * scale,
            opacity: 0.85,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 24 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: 0,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.85,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 24 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: 0,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.85,
          } as ViewStyle
        }
      />

      {/* Smaller hexagon */}
      <View
        style={
          {
            position: "absolute",
            width: 7 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 3.5 * scale,
            top: size / 2 - 1.25 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 7 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 3.5 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 7 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 3.5 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />
    </View>
  );
};

// Variation 4: Circle center instead of hexagon (simplified)
const ReactQueryV4: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      {/* Circle center (simpler than hexagon) */}
      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 8 * scale,
            borderRadius: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 4 * scale,
          } as ViewStyle
        }
      />
    </View>
  );
};

// Variation 5: Using borders for hexagon outline
const ReactQueryV5: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            opacity: 0.8,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.8,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.8,
          } as ViewStyle
        }
      />

      {/* Hexagon with thicker overlap */}
      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />
    </View>
  );
};

// Variation 6: Adjusted proportions
const ReactQueryV6: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Orbital lines with better proportions */}
      <View
        style={
          {
            position: "absolute",
            width: 18 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 9 * scale,
            top: size / 2 - 1.25 * scale,
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 18 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 9 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 18 * scale,
            height: 2.5 * scale,
            backgroundColor: activeColor,
            borderRadius: 1.25 * scale,
            left: size / 2 - 9 * scale,
            top: size / 2 - 1.25 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 0.9,
          } as ViewStyle
        }
      />

      {/* Hexagon with adjusted dimensions */}
      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.75 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.75 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.75 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />
    </View>
  );
};

// Main showcase component
export const ReactQueryVariations: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>REACT QUERY VARIATIONS</Text>
      <Text style={styles.subtitle}>
        Choose the best match for the original
      </Text>

      <View style={styles.grid}>
        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV1 size={60} />
          </View>
          <Text style={styles.label}>V1: Square Center</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV2 size={60} />
          </View>
          <Text style={styles.label}>V2: Thinner Lines</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV3 size={60} />
          </View>
          <Text style={styles.label}>V3: Small Hex</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV4 size={60} />
          </View>
          <Text style={styles.label}>V4: Circle Center</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV5 size={60} />
          </View>
          <Text style={styles.label}>V5: Thick Hex</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryV6 size={60} />
          </View>
          <Text style={styles.label}>V6: Adjusted</Text>
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>ADJUSTMENTS TO TRY:</Text>
        <Text style={styles.notesText}>
          • Hexagon width/height ratio{"\n"}• Line thickness (thinner might look
          better){"\n"}• Line length vs hexagon size{"\n"}• Opacity values{"\n"}
          • Border radius on lines for rounder ends
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
    fontSize: 28,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  box: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
  },
  darkBg: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    aspectRatio: 1,
  },
  label: {
    color: "#666",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "monospace",
    textAlign: "center",
  },
  notesSection: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
    marginTop: 20,
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

export default ReactQueryVariations;
