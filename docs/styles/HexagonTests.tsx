import React from "react";
import { View, Text, ScrollView, StyleSheet, ViewStyle } from "react-native";

const hexagonColor = "#FFD700"; // Yellow for visibility

// Test 1: Much thicker rectangles
const HexagonTest1: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Using very thick rectangles */}
      <View style={{
        position: "absolute",
        width: 12 * scale,
        height: 7 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 6 * scale,
        top: size / 2 - 3.5 * scale,
      } as ViewStyle} />
      
      <View style={{
        position: "absolute",
        width: 12 * scale,
        height: 7 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 6 * scale,
        top: size / 2 - 3.5 * scale,
        transform: [{ rotate: "60deg" }],
      } as ViewStyle} />
      
      <View style={{
        position: "absolute",
        width: 12 * scale,
        height: 7 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 6 * scale,
        top: size / 2 - 3.5 * scale,
        transform: [{ rotate: "-60deg" }],
      } as ViewStyle} />
    </View>
  );
};

// Test 2: Square rotated 45 degrees (diamond shape as simplified hex)
const HexagonTest2: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      <View style={{
        position: "absolute",
        width: 10 * scale,
        height: 10 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 5 * scale,
        top: size / 2 - 5 * scale,
        transform: [{ rotate: "45deg" }],
      } as ViewStyle} />
    </View>
  );
};

// Test 3: Using 6 triangles (approximated with rotated rectangles)
const HexagonTest3: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Center fill */}
      <View style={{
        position: "absolute",
        width: 8 * scale,
        height: 8 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 4 * scale,
        top: size / 2 - 4 * scale,
        borderRadius: 2 * scale,
      } as ViewStyle} />
      
      {/* Additional rectangles to form points */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 8 * scale,
            height: 3 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 1.5 * scale,
            transform: [{ rotate: `${angle}deg` }],
          } as ViewStyle}
        />
      ))}
    </View>
  );
};

// Test 4: Multiple overlapping circles to approximate hexagon
const HexagonTest4: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Main center circle */}
      <View style={{
        position: "absolute",
        width: 10 * scale,
        height: 10 * scale,
        borderRadius: 5 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 5 * scale,
        top: size / 2 - 5 * scale,
      } as ViewStyle} />
      
      {/* Top and bottom rectangles to create flat edges */}
      <View style={{
        position: "absolute",
        width: 8 * scale,
        height: 10 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 4 * scale,
        top: size / 2 - 5 * scale,
      } as ViewStyle} />
    </View>
  );
};

// Test 5: Using very wide, short rectangles
const HexagonTest5: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      <View style={{
        position: "absolute",
        width: 14 * scale,
        height: 8 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 7 * scale,
        top: size / 2 - 4 * scale,
      } as ViewStyle} />
      
      <View style={{
        position: "absolute",
        width: 14 * scale,
        height: 8 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 7 * scale,
        top: size / 2 - 4 * scale,
        transform: [{ rotate: "60deg" }],
      } as ViewStyle} />
      
      <View style={{
        position: "absolute",
        width: 14 * scale,
        height: 8 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 7 * scale,
        top: size / 2 - 4 * scale,
        transform: [{ rotate: "-60deg" }],
      } as ViewStyle} />
    </View>
  );
};

// Test 6: Using trapezoid-like shapes (rectangles with different positioning)
const HexagonTest6: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Base rectangle */}
      <View style={{
        position: "absolute",
        width: 10 * scale,
        height: 6 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 5 * scale,
        top: size / 2 - 3 * scale,
      } as ViewStyle} />
      
      {/* Diagonal rectangles with offset */}
      <View style={{
        position: "absolute",
        width: 10 * scale,
        height: 6 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 5 * scale,
        top: size / 2 - 3 * scale,
        transform: [{ rotate: "60deg" }],
      } as ViewStyle} />
      
      <View style={{
        position: "absolute",
        width: 10 * scale,
        height: 6 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 5 * scale,
        top: size / 2 - 3 * scale,
        transform: [{ rotate: "120deg" }],
      } as ViewStyle} />
    </View>
  );
};

// Test 7: Many thin slices
const HexagonTest7: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Create many thin rectangles at small angle increments */}
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 10 * scale,
            height: 5 * scale,
            backgroundColor: hexagonColor,
            left: size / 2 - 5 * scale,
            top: size / 2 - 2.5 * scale,
            transform: [{ rotate: `${angle}deg` }],
            opacity: 0.8,
          } as ViewStyle}
        />
      ))}
    </View>
  );
};

// Test 8: Octagon (8-sided, closer to circle but simpler than hexagon)
const HexagonTest8: React.FC<{ size: number }> = ({ size }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, position: "relative", backgroundColor: '#222' }}>
      {/* Square base */}
      <View style={{
        position: "absolute",
        width: 7 * scale,
        height: 7 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 3.5 * scale,
        top: size / 2 - 3.5 * scale,
      } as ViewStyle} />
      
      {/* Rotated square to create octagon */}
      <View style={{
        position: "absolute",
        width: 7 * scale,
        height: 7 * scale,
        backgroundColor: hexagonColor,
        left: size / 2 - 3.5 * scale,
        top: size / 2 - 3.5 * scale,
        transform: [{ rotate: "45deg" }],
      } as ViewStyle} />
    </View>
  );
};

// Main showcase component
export const HexagonTests: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>HEXAGON SHAPE TESTS</Text>
      <Text style={styles.subtitle}>Finding the best way to create a filled hexagon</Text>

      <View style={styles.grid}>
        <View style={styles.box}>
          <HexagonTest1 size={80} />
          <Text style={styles.label}>Test 1: Thick Rects</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest2 size={80} />
          <Text style={styles.label}>Test 2: Diamond</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest3 size={80} />
          <Text style={styles.label}>Test 3: 6 Triangles</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest4 size={80} />
          <Text style={styles.label}>Test 4: Circle + Rect</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest5 size={80} />
          <Text style={styles.label}>Test 5: Very Wide</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest6 size={80} />
          <Text style={styles.label}>Test 6: 3x 120°</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest7 size={80} />
          <Text style={styles.label}>Test 7: Many Slices</Text>
        </View>

        <View style={styles.box}>
          <HexagonTest8 size={80} />
          <Text style={styles.label}>Test 8: Octagon</Text>
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>NOTES:</Text>
        <Text style={styles.notesText}>
          • React Native Views can't create true polygons{'\n'}
          • We need to approximate with rectangles/circles{'\n'}
          • The star pattern happens when rectangles are too thin{'\n'}
          • Wider rectangles = better fill but less hex-like{'\n'}
          • Diamond (Test 2) or Octagon (Test 8) might be best compromise
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
    gap: 10,
  },
  box: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
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

export default HexagonTests;