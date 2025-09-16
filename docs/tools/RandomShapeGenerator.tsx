import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const SHAPE_SIZE = (screenWidth - 60) / 4; // 4 shapes per row with padding

interface ShapeStyle {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  borderStyle?: "solid" | "dotted" | "dashed";
  opacity?: number;
  transform?: any[];
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

// Color palettes for interesting combinations
const COLOR_PALETTES = [
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ["#DDA0DD", "#98D8C8", "#FFD700", "#F06292", "#AED581"],
  ["#FF5722", "#795548", "#607D8B", "#4CAF50", "#03A9F4"],
  ["#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3"],
  ["#FF9800", "#FF5722", "#F44336", "#E91E63", "#9C27B0"],
  ["#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39"],
  ["#FFC107", "#FF9800", "#FF5722", "#FF6347", "#FFD700"],
  ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#6C5CE7"],
  ["#2D3436", "#636E72", "#B2BEC3", "#DFE6E9", "#74B9FF"],
  ["#FAB1A0", "#FF7675", "#FD79A8", "#FDCB6E", "#55EFC4"],
];

const getRandomColor = () => {
  const palette =
    COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  return palette[Math.floor(Math.random() * palette.length)];
};

const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomShape = (): ShapeStyle => {
  let shape: ShapeStyle = {};

  // Base dimensions
  const baseSize = getRandomInt(20, 80);
  shape.width = baseSize;
  shape.height = getRandomInt(20, 80);

  // 20% chance of no background (border only shapes)
  if (Math.random() > 0.2) {
    shape.backgroundColor = getRandomColor();
    shape.opacity = getRandomFloat(0.3, 1);
  } else {
    shape.backgroundColor = "transparent";
  }

  // Border properties (60% chance)
  if (Math.random() > 0.4) {
    const borderType = Math.random();

    if (borderType < 0.3) {
      // Uniform border
      shape.borderWidth = getRandomInt(1, 8);
      shape.borderColor = getRandomColor();
    } else if (borderType < 0.6) {
      // Different borders on each side
      shape.borderTopWidth = getRandomInt(0, 10);
      shape.borderBottomWidth = getRandomInt(0, 10);
      shape.borderLeftWidth = getRandomInt(0, 10);
      shape.borderRightWidth = getRandomInt(0, 10);

      if (Math.random() > 0.5) {
        // Same color for all borders
        const color = getRandomColor();
        shape.borderTopColor = color;
        shape.borderBottomColor = color;
        shape.borderLeftColor = color;
        shape.borderRightColor = color;
      } else {
        // Different colors
        shape.borderTopColor = getRandomColor();
        shape.borderBottomColor = getRandomColor();
        shape.borderLeftColor = getRandomColor();
        shape.borderRightColor = getRandomColor();
      }
    } else {
      // Triangle-like shapes with borders
      shape.width = 0;
      shape.height = 0;
      shape.backgroundColor = "transparent";
      shape.borderStyle = "solid";
      shape.borderLeftWidth = getRandomInt(20, 50);
      shape.borderRightWidth = getRandomInt(20, 50);
      shape.borderBottomWidth = getRandomInt(30, 70);
      shape.borderLeftColor =
        Math.random() > 0.5 ? "transparent" : getRandomColor();
      shape.borderRightColor =
        Math.random() > 0.5 ? "transparent" : getRandomColor();
      shape.borderBottomColor = getRandomColor();
    }

    // Border style (20% chance of non-solid)
    if (Math.random() > 0.8) {
      shape.borderStyle = Math.random() > 0.5 ? "dashed" : "dotted";
    }
  }

  // Border radius (70% chance)
  if (Math.random() > 0.3 && shape.width && shape.height) {
    const radiusType = Math.random();

    if (radiusType < 0.4) {
      // Uniform radius
      shape.borderRadius = getRandomInt(
        0,
        Math.min(shape.width, shape.height) / 2
      );
    } else if (radiusType < 0.7) {
      // Different radius on each corner
      shape.borderTopLeftRadius = getRandomInt(0, 50);
      shape.borderTopRightRadius = getRandomInt(0, 50);
      shape.borderBottomLeftRadius = getRandomInt(0, 50);
      shape.borderBottomRightRadius = getRandomInt(0, 50);
    } else {
      // Circle or oval
      shape.borderRadius = Math.min(shape.width, shape.height) / 2;
    }
  }

  // Transform (40% chance)
  if (Math.random() > 0.6) {
    const transforms: any[] = [];

    // Rotation
    if (Math.random() > 0.5) {
      transforms.push({ rotate: `${getRandomInt(-180, 180)}deg` });
    }

    // Scale
    if (Math.random() > 0.7) {
      if (Math.random() > 0.5) {
        transforms.push({ scale: getRandomFloat(0.5, 1.5) });
      } else {
        transforms.push({ scaleX: getRandomFloat(0.5, 2) });
        transforms.push({ scaleY: getRandomFloat(0.5, 2) });
      }
    }

    // Skew (rare)
    if (Math.random() > 0.9) {
      transforms.push({ skewX: `${getRandomInt(-30, 30)}deg` });
      transforms.push({ skewY: `${getRandomInt(-30, 30)}deg` });
    }

    if (transforms.length > 0) {
      shape.transform = transforms;
    }
  }

  // Shadow (iOS) or Elevation (Android) - 30% chance
  if (Math.random() > 0.7) {
    shape.shadowColor = getRandomColor();
    shape.shadowOffset = {
      width: getRandomInt(-10, 10),
      height: getRandomInt(-10, 10),
    };
    shape.shadowOpacity = getRandomFloat(0.2, 0.8);
    shape.shadowRadius = getRandomInt(2, 15);
    shape.elevation = getRandomInt(2, 10);
  }

  return shape;
};

export const RandomShapeGenerator = () => {
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [selectedShape, setSelectedShape] = useState<ShapeStyle | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Generate 100 random shapes
  const shapes = useMemo(() => {
    return Array.from({ length: 100 }, () => generateRandomShape());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regenerateKey]);

  const regenerateShapes = useCallback(() => {
    setRegenerateKey((prev) => prev + 1);
    setSelectedShape(null);
    setSelectedIndex(null);
  }, []);

  const copyShapeStyle = useCallback((shape: ShapeStyle, index: number) => {
    setSelectedShape(shape);
    setSelectedIndex(index);

    // Clean up undefined values
    const cleanStyle = Object.entries(shape).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof ShapeStyle] = value;
      }
      return acc;
    }, {} as ShapeStyle);

    const output = `// Shape #${index + 1}
const shapeStyle = ${JSON.stringify(cleanStyle, null, 2).replace(/"([^"]+)":/g, "$1:")};`;

    Clipboard.setString(output);
    Alert.alert(
      "Shape Copied!",
      `Shape #${index + 1} style has been copied to clipboard`,
      [{ text: "OK" }]
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with regenerate button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Random Shape Generator</Text>
          <Text style={styles.subtitle}>Tap any shape to copy its style</Text>
        </View>
        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={regenerateShapes}
        >
          <Text style={styles.regenerateButtonText}>🎲 Regenerate</Text>
        </TouchableOpacity>
      </View>

      {/* Selected shape preview */}
      {selectedShape && (
        <View style={styles.selectedPreview}>
          <Text style={styles.selectedTitle}>
            Selected: Shape #{(selectedIndex || 0) + 1}
          </Text>
          <View style={styles.selectedShapeContainer}>
            <View style={[styles.selectedShapeWrapper]}>
              <View style={selectedShape} />
            </View>
          </View>
          <ScrollView style={styles.selectedCode} horizontal>
            <Text style={styles.codeText}>
              {JSON.stringify(selectedShape, null, 2)}
            </Text>
          </ScrollView>
        </View>
      )}

      {/* Grid of random shapes */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.grid}>
          {shapes.map((shape, index) => (
            <TouchableOpacity
              key={`${regenerateKey}-${index}`}
              style={[
                styles.shapeContainer,
                selectedIndex === index && styles.selectedShapeHighlight,
              ]}
              onPress={() => copyShapeStyle(shape, index)}
              activeOpacity={0.7}
            >
              <View style={styles.shapeWrapper}>
                <View style={shape} />
              </View>
              <Text style={styles.shapeNumber}>#{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fun stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          🎨{" "}
          {
            shapes.filter(
              (s) => s.backgroundColor && s.backgroundColor !== "transparent"
            ).length
          }{" "}
          colored
        </Text>
        <Text style={styles.statsText}>
          ⭕ {shapes.filter((s) => s.borderWidth || s.borderTopWidth).length}{" "}
          bordered
        </Text>
        <Text style={styles.statsText}>
          🔄 {shapes.filter((s) => s.transform).length} transformed
        </Text>
        <Text style={styles.statsText}>
          🌟 {shapes.filter((s) => s.shadowColor).length} with shadow
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#16213e",
    borderBottomWidth: 1,
    borderBottomColor: "#0f3460",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  regenerateButton: {
    backgroundColor: "#e94560",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  regenerateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedPreview: {
    backgroundColor: "#0f3460",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#16213e",
  },
  selectedTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedShapeContainer: {
    height: 100,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedShapeWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCode: {
    maxHeight: 100,
    backgroundColor: "#000",
    borderRadius: 5,
    padding: 10,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#61DAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  shapeContainer: {
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    padding: 5,
  },
  selectedShapeHighlight: {
    backgroundColor: "#0f346044",
    borderRadius: 10,
  },
  shapeWrapper: {
    flex: 1,
    backgroundColor: "#2a2a3e",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a3a4e",
    overflow: "hidden",
  },
  shapeNumber: {
    position: "absolute",
    bottom: 8,
    right: 8,
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#0f3460",
  },
  statsText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
});
