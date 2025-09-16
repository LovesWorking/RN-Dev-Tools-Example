import { View, Text, ScrollView, StyleSheet } from "react-native";
const HexagonShowcase: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hexagon Variations</Text>

      <View style={styles.grid}>
        {/* Original Hexagon (3 overlapping rectangles) */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonRect1} />
            <View style={styles.hexagonRect2} />
            <View style={styles.hexagonRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon</Text>
        </View>

        {/* Hexagon with Rounded Corners */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonRoundedRect1} />
            <View style={styles.hexagonRoundedRect2} />
            <View style={styles.hexagonRoundedRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Rounded</Text>
        </View>

        {/* Hexagon Thick */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonThickRect1} />
            <View style={styles.hexagonThickRect2} />
            <View style={styles.hexagonThickRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Thick</Text>
        </View>

        {/* Hexagon Wide */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonWideRect1} />
            <View style={styles.hexagonWideRect2} />
            <View style={styles.hexagonWideRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Wide</Text>
        </View>

        {/* Hexagon Super Smooth */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonSmoothRect1} />
            <View style={styles.hexagonSmoothRect2} />
            <View style={styles.hexagonSmoothRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Smooth</Text>
        </View>

        {/* Hexagon Pills (Maximum smoothness) */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonPillRect1} />
            <View style={styles.hexagonPillRect2} />
            <View style={styles.hexagonPillRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Pills</Text>
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
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  shapeContainer: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 20,
  },
  shapeLabel: {
    color: "#666",
    fontSize: 12,
    marginTop: 12,
    fontFamily: "monospace",
    textAlign: "center",
  },
  hexagonContainer: {
    width: 60,
    height: 60,
    position: "relative",
  },

  // Basic Hexagon
  hexagonRect1: {
    width: 60,
    height: 34,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 13,
  },
  hexagonRect2: {
    width: 60,
    height: 34,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 13,
    transform: [{ rotate: "60deg" }],
  },
  hexagonRect3: {
    width: 60,
    height: 34,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 13,
    transform: [{ rotate: "-60deg" }],
  },

  // Rounded Hexagon
  hexagonRoundedRect1: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    borderRadius: 8,
    position: "absolute",
    top: 12.5,
  },
  hexagonRoundedRect2: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    borderRadius: 8,
    position: "absolute",
    top: 12.5,
    transform: [{ rotate: "60deg" }],
  },
  hexagonRoundedRect3: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    borderRadius: 8,
    position: "absolute",
    top: 12.5,
    transform: [{ rotate: "-60deg" }],
  },

  // Thick Hexagon
  hexagonThickRect1: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 12.5,
  },
  hexagonThickRect2: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 12.5,
    transform: [{ rotate: "60deg" }],
  },
  hexagonThickRect3: {
    width: 60,
    height: 35,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 12.5,
    transform: [{ rotate: "-60deg" }],
  },

  // Wide Hexagon
  hexagonWideRect1: {
    width: 70,
    height: 40,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10,
    left: -5,
  },
  hexagonWideRect2: {
    width: 70,
    height: 40,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10,
    left: -5,
    transform: [{ rotate: "60deg" }],
  },
  hexagonWideRect3: {
    width: 70,
    height: 40,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10,
    left: -5,
    transform: [{ rotate: "-60deg" }],
  },

  // Super Smooth Hexagon
  hexagonSmoothRect1: {
    width: 62,
    height: 36,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    position: "absolute",
    top: 12,
    left: -1,
  },
  hexagonSmoothRect2: {
    width: 62,
    height: 36,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    position: "absolute",
    top: 12,
    left: -1,
    transform: [{ rotate: "60deg" }],
  },
  hexagonSmoothRect3: {
    width: 62,
    height: 36,
    backgroundColor: "#fbbf24",
    borderRadius: 10,
    position: "absolute",
    top: 12,
    left: -1,
    transform: [{ rotate: "-60deg" }],
  },

  // Pills Hexagon (Maximum roundness)
  hexagonPillRect1: {
    width: 64,
    height: 38,
    backgroundColor: "#fbbf24",
    borderRadius: 19, // Half of height for pill shape
    position: "absolute",
    top: 11,
    left: -2,
  },
  hexagonPillRect2: {
    width: 64,
    height: 38,
    backgroundColor: "#fbbf24",
    borderRadius: 19,
    position: "absolute",
    top: 11,
    left: -2,
    transform: [{ rotate: "60deg" }],
  },
  hexagonPillRect3: {
    width: 64,
    height: 38,
    backgroundColor: "#fbbf24",
    borderRadius: 19,
    position: "absolute",
    top: 11,
    left: -2,
    transform: [{ rotate: "-60deg" }],
  },
});

export default HexagonShowcase;
