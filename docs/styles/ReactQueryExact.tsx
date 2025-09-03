import React from "react";
import { View, Text, ScrollView, StyleSheet, ViewStyle } from "react-native";

// Exact colors from React Query logo
const hexagonColor = "#FFD700"; // Yellow/gold for center
const orbitalColor = "#FF5A5F"; // Red/coral for orbital lines
const borderColor = "#00D9FF"; // Cyan/blue for borders

// Version matching exact logo colors and proportions
const ReactQueryExact: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Blue border circles for background effect */}
      <View
        style={
          {
            position: "absolute",
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: size * 0.45,
            borderWidth: 0.5 * scale,
            borderColor: borderColor,
            left: size * 0.05,
            top: size * 0.05,
            opacity: 0.3,
          } as ViewStyle
        }
      />

      {/* Red/Pink Orbital lines - BEHIND hexagon */}
      {/* Horizontal line */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale, // Fully rounded ends
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            opacity: 1,
          } as ViewStyle
        }
      />

      {/* Top-right diagonal line (60deg) */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 1,
          } as ViewStyle
        }
      />

      {/* Top-left diagonal line (-60deg) */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 1,
          } as ViewStyle
        }
      />

      {/* Yellow Hexagon - ON TOP */}
      {/* Using 3 rectangles to form hexagon */}
      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.5 * scale,
            opacity: 1,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.5 * scale,
            transform: [{ rotate: "60deg" }],
            opacity: 1,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 3 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.5 * scale,
            transform: [{ rotate: "-60deg" }],
            opacity: 1,
          } as ViewStyle
        }
      />
    </View>
  );
};

// Version 2: Trying different hexagon approach
const ReactQueryExactV2: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Blue glow/border effect */}
      <View
        style={
          {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: borderColor,
            opacity: 0.05,
          } as ViewStyle
        }
      />

      {/* Red Orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 1.8 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 0.9 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 - 0.9 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />

      {/* Yellow Hexagon - wider rectangles for better fill */}
      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3.5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.75 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3.5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.75 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 9 * scale,
            height: 3.5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4.5 * scale,
            top: size / 2 - 1.75 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />

      {/* Blue accent dots at line ends */}
      {[
        { x: 0.04, y: 0.5 },
        { x: 0.96, y: 0.5 },
        { x: 0.22, y: 0.18 },
        { x: 0.78, y: 0.18 },
        { x: 0.22, y: 0.82 },
        { x: 0.78, y: 0.82 },
      ].map((dot, i) => (
        <View
          key={i}
          style={
            {
              position: "absolute",
              width: 2 * scale,
              height: 2 * scale,
              borderRadius: 1 * scale,
              backgroundColor: borderColor,
              left: dot.x * size - scale,
              top: dot.y * size - scale,
              opacity: 0.5,
            } as ViewStyle
          }
        />
      ))}
    </View>
  );
};

// Version 3: Even thicker hexagon for better coverage
const ReactQueryExactV3: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Red Orbital lines first */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 2.2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1.1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 1.1 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />

      {/* Yellow Hexagon - much thicker for solid fill */}
      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2.5 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2.5 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 10 * scale,
            height: 5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2.5 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />

      {/* Blue border ring */}
      <View
        style={
          {
            position: "absolute",
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: size * 0.425,
            borderWidth: 0.8 * scale,
            borderColor: borderColor,
            left: size * 0.075,
            top: size * 0.075,
            opacity: 0.4,
          } as ViewStyle
        }
      />
    </View>
  );
};

// Version 4: Using a simpler approach - filled circle for center
const ReactQueryExactV4: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {/* Red Orbital lines */}
      <View
        style={
          {
            position: "absolute",
            width: 21 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10.5 * scale,
            top: size / 2 - 1 * scale,
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 21 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10.5 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "60deg" }],
          } as ViewStyle
        }
      />

      <View
        style={
          {
            position: "absolute",
            width: 21 * scale,
            height: 2 * scale,
            backgroundColor: orbitalColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10.5 * scale,
            top: size / 2 - 1 * scale,
            transform: [{ rotate: "-60deg" }],
          } as ViewStyle
        }
      />

      {/* Yellow circle (simplified hexagon) */}
      <View
        style={
          {
            position: "absolute",
            width: 7 * scale,
            height: 7 * scale,
            borderRadius: 3.5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 3.5 * scale,
            top: size / 2 - 3.5 * scale,
          } as ViewStyle
        }
      />

      {/* Blue decorative elements */}
      <View
        style={
          {
            position: "absolute",
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            borderWidth: 0.5 * scale,
            borderColor: borderColor,
            left: size * 0.1,
            top: size * 0.1,
            opacity: 0.3,
          } as ViewStyle
        }
      />
    </View>
  );
};

// Main showcase component
export const ReactQueryExactShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>REACT QUERY EXACT COLORS</Text>
      <Text style={styles.subtitle}>Yellow hex, red lines, blue borders</Text>

      <View style={styles.grid}>
        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryExact size={80} />
          </View>
          <Text style={styles.label}>V1: Standard Hex</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryExactV2 size={80} />
          </View>
          <Text style={styles.label}>V2: Wider Hex + Dots</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryExactV3 size={80} />
          </View>
          <Text style={styles.label}>V3: Thick Hex Fill</Text>
        </View>

        <View style={styles.box}>
          <View style={styles.darkBg}>
            <ReactQueryExactV4 size={80} />
          </View>
          <Text style={styles.label}>V4: Circle Center</Text>
        </View>
      </View>

      <View style={styles.colorReference}>
        <Text style={styles.colorTitle}>COLOR REFERENCE:</Text>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorSwatch, { backgroundColor: hexagonColor }]}
          />
          <Text style={styles.colorText}>Hexagon: {hexagonColor}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorSwatch, { backgroundColor: orbitalColor }]}
          />
          <Text style={styles.colorText}>Lines: {orbitalColor}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorSwatch, { backgroundColor: borderColor }]}
          />
          <Text style={styles.colorText}>Border: {borderColor}</Text>
        </View>
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
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
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
  colorReference: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
    marginTop: 20,
  },
  colorTitle: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    fontFamily: "monospace",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  colorText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "monospace",
  },
});

export default ReactQueryExactShowcase;
