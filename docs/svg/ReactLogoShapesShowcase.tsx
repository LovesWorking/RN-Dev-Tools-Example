import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const REACT_BLUE = "#61DAFB";
const DARK_BG = "#20232a";

export const ReactLogoShapesShowcase = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Logo Shape Components</Text>

      {/* Row 1: Nucleus Variations */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Nucleus - Small</Text>
          <View style={styles.nucleusSmall} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Nucleus - Medium</Text>
          <View style={styles.nucleusMedium} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Nucleus - Large</Text>
          <View style={styles.nucleusLarge} />
        </View>
      </View>

      {/* Row 2: Basic Ellipse Variations */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Ellipse - Horizontal</Text>
          <View style={styles.ellipseHorizontal} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Ellipse - Vertical</Text>
          <View style={styles.ellipseVertical} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Ellipse - Diagonal</Text>
          <View style={styles.ellipseDiagonal} />
        </View>
      </View>

      {/* Row 3: Border-Only Ellipses (Orbits) */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit - Thin</Text>
          <View style={styles.orbitThin} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit - Medium</Text>
          <View style={styles.orbitMedium} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit - Thick</Text>
          <View style={styles.orbitThick} />
        </View>
      </View>

      {/* Row 4: Rotated Orbits */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit 0°</Text>
          <View style={[styles.orbitBase, styles.orbit0deg]} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit 60°</Text>
          <View style={[styles.orbitBase, styles.orbit60deg]} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Orbit -60°</Text>
          <View style={[styles.orbitBase, styles.orbitMinus60deg]} />
        </View>
      </View>

      {/* Row 5: Scale Experiments */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Circle to Ellipse X</Text>
          <View style={styles.circleToEllipseX} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Circle to Ellipse Y</Text>
          <View style={styles.circleToEllipseY} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Perfect Circle Ring</Text>
          <View style={styles.perfectCircleRing} />
        </View>
      </View>

      {/* Row 6: Combined Layers Preview */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Two Orbits</Text>
          <View style={styles.previewContainer}>
            <View style={[styles.orbitPreview, styles.orbitPreview1]} />
            <View style={[styles.orbitPreview, styles.orbitPreview2]} />
          </View>
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Three Orbits</Text>
          <View style={styles.previewContainer}>
            <View style={[styles.orbitPreview, styles.orbitPreview1]} />
            <View style={[styles.orbitPreview, styles.orbitPreview2]} />
            <View style={[styles.orbitPreview, styles.orbitPreview3]} />
          </View>
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>With Nucleus</Text>
          <View style={styles.previewContainer}>
            <View style={[styles.orbitPreview, styles.orbitPreview1]} />
            <View style={[styles.orbitPreview, styles.orbitPreview2]} />
            <View style={[styles.orbitPreview, styles.orbitPreview3]} />
            <View style={styles.nucleusPreview} />
          </View>
        </View>
      </View>

      {/* Row 7: Alternative Approaches */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Solid Ellipse</Text>
          <View style={styles.solidEllipse} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Dashed Border</Text>
          <View style={styles.dashedBorderEllipse} />
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>With Shadow</Text>
          <View style={styles.ellipseWithShadow} />
        </View>
      </View>

      {/* Row 8: Size Variations */}
      <View style={styles.row}>
        <View style={styles.shapeBox}>
          <Text style={styles.label}>Mini Logo</Text>
          <View style={styles.miniContainer}>
            <View style={[styles.miniOrbit, styles.miniOrbit1]} />
            <View style={[styles.miniOrbit, styles.miniOrbit2]} />
            <View style={[styles.miniOrbit, styles.miniOrbit3]} />
            <View style={styles.miniNucleus} />
          </View>
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Standard Logo</Text>
          <View style={styles.standardContainer}>
            <View style={[styles.standardOrbit, styles.standardOrbit1]} />
            <View style={[styles.standardOrbit, styles.standardOrbit2]} />
            <View style={[styles.standardOrbit, styles.standardOrbit3]} />
            <View style={styles.standardNucleus} />
          </View>
        </View>

        <View style={styles.shapeBox}>
          <Text style={styles.label}>Large Logo</Text>
          <View style={styles.largeContainer}>
            <View style={[styles.largeOrbit, styles.largeOrbit1]} />
            <View style={[styles.largeOrbit, styles.largeOrbit2]} />
            <View style={[styles.largeOrbit, styles.largeOrbit3]} />
            <View style={styles.largeNucleus} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  shapeBox: {
    width: 110,
    height: 110,
    backgroundColor: DARK_BG,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontSize: 10,
    marginBottom: 8,
    textAlign: "center",
    position: "absolute",
    top: 5,
  },

  // Nucleus Variations
  nucleusSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: REACT_BLUE,
  },
  nucleusMedium: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: REACT_BLUE,
  },
  nucleusLarge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: REACT_BLUE,
  },

  // Basic Ellipses - More accurate lens/bubble shape
  ellipseHorizontal: {
    width: 90,
    height: 24,
    borderRadius: 12, // Half of height for perfect oval ends
    backgroundColor: REACT_BLUE,
  },
  ellipseVertical: {
    width: 24,
    height: 90,
    borderRadius: 12,
    backgroundColor: REACT_BLUE,
  },
  ellipseDiagonal: {
    width: 85,
    height: 26,
    borderRadius: 13,
    backgroundColor: REACT_BLUE,
    transform: [{ rotate: "45deg" }],
  },

  // Border-Only Orbits - Thinner, more lens-like
  orbitThin: {
    width: 90,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  orbitMedium: {
    width: 90,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  orbitThick: {
    width: 90,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },

  // Rotated Orbits - More stretched
  orbitBase: {
    width: 90,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  orbit0deg: {
    transform: [{ rotate: "0deg" }],
  },
  orbit60deg: {
    transform: [{ rotate: "60deg" }],
  },
  orbitMinus60deg: {
    transform: [{ rotate: "-60deg" }],
  },

  // Scale Experiments - Better lens proportions
  circleToEllipseX: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
    transform: [{ scaleX: 2 }, { scaleY: 0.5 }],
  },
  circleToEllipseY: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
    transform: [{ scaleX: 1.8 }, { scaleY: 0.4 }],
  },
  perfectCircleRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },

  // Preview Container
  previewContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  orbitPreview: {
    position: "absolute",
    width: 75,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  orbitPreview1: {
    transform: [{ rotate: "0deg" }],
  },
  orbitPreview2: {
    transform: [{ rotate: "60deg" }],
  },
  orbitPreview3: {
    transform: [{ rotate: "-60deg" }],
  },
  nucleusPreview: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: REACT_BLUE,
    position: "absolute",
    zIndex: 2,
  },

  // Alternative Approaches
  solidEllipse: {
    width: 80,
    height: 30,
    borderRadius: 15,
    backgroundColor: REACT_BLUE,
    opacity: 0.3,
  },
  dashedBorderEllipse: {
    width: 80,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  ellipseWithShadow: {
    width: 80,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
    shadowColor: REACT_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  // Mini Size
  miniContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  miniOrbit: {
    position: "absolute",
    width: 38,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  miniOrbit1: {
    transform: [{ rotate: "0deg" }],
  },
  miniOrbit2: {
    transform: [{ rotate: "60deg" }],
  },
  miniOrbit3: {
    transform: [{ rotate: "-60deg" }],
  },
  miniNucleus: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: REACT_BLUE,
    position: "absolute",
    zIndex: 2,
  },

  // Standard Size
  standardContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  standardOrbit: {
    position: "absolute",
    width: 58,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  standardOrbit1: {
    transform: [{ rotate: "0deg" }],
  },
  standardOrbit2: {
    transform: [{ rotate: "60deg" }],
  },
  standardOrbit3: {
    transform: [{ rotate: "-60deg" }],
  },
  standardNucleus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: REACT_BLUE,
    position: "absolute",
    zIndex: 2,
  },

  // Large Size
  largeContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  largeOrbit: {
    position: "absolute",
    width: 78,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.2,
    borderColor: REACT_BLUE,
    backgroundColor: "transparent",
  },
  largeOrbit1: {
    transform: [{ rotate: "0deg" }],
  },
  largeOrbit2: {
    transform: [{ rotate: "60deg" }],
  },
  largeOrbit3: {
    transform: [{ rotate: "-60deg" }],
  },
  largeNucleus: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: REACT_BLUE,
    position: "absolute",
    zIndex: 2,
  },
});
