import { ScrollView, View, Text, StyleSheet } from "react-native";
export const ReactNativeShapesShowcase = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Native Shapes Gallery - 41 Shapes</Text>
      <View style={styles.grid}>
        {/* 1. Square */}
        <View style={styles.shapeContainer}>
          <View style={styles.square} />
          <Text style={styles.shapeLabel}>Square</Text>
        </View>

        {/* 2. Rectangle */}
        <View style={styles.shapeContainer}>
          <View style={styles.rectangle} />
          <Text style={styles.shapeLabel}>Rectangle</Text>
        </View>

        {/* 3. Circle */}
        <View style={styles.shapeContainer}>
          <View style={styles.circle} />
          <Text style={styles.shapeLabel}>Circle</Text>
        </View>

        {/* 4. Oval */}
        <View style={styles.shapeContainer}>
          <View style={styles.oval} />
          <Text style={styles.shapeLabel}>Oval</Text>
        </View>

        {/* 5. Triangle Up */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleUp} />
          <Text style={styles.shapeLabel}>Triangle Up</Text>
        </View>

        {/* 6. Triangle Down */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleDown} />
          <Text style={styles.shapeLabel}>Triangle Down</Text>
        </View>

        {/* 7. Triangle Left */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleLeft} />
          <Text style={styles.shapeLabel}>Triangle Left</Text>
        </View>

        {/* 8. Triangle Right */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleRight} />
          <Text style={styles.shapeLabel}>Triangle Right</Text>
        </View>

        {/* 9. Triangle Top Left */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleTopLeft} />
          <Text style={styles.shapeLabel}>Triangle Top Left</Text>
        </View>

        {/* 10. Triangle Top Right */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleTopRight} />
          <Text style={styles.shapeLabel}>Triangle Top Right</Text>
        </View>

        {/* 11. Triangle Bottom Left */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleBottomLeft} />
          <Text style={styles.shapeLabel}>Triangle Bottom Left</Text>
        </View>

        {/* 12. Triangle Bottom Right */}
        <View style={styles.shapeContainer}>
          <View style={styles.triangleBottomRight} />
          <Text style={styles.shapeLabel}>Triangle Bottom Right</Text>
        </View>

        {/* 13. Curved Tail Arrow */}
        <View style={styles.shapeContainer}>
          <View style={styles.curvedTailArrowContainer}>
            <View style={styles.curvedTailArrow} />
            <View style={styles.curvedTailArrowAfter} />
          </View>
          <Text style={styles.shapeLabel}>Curved Tail Arrow</Text>
        </View>

        {/* 14. Trapezoid */}
        <View style={styles.shapeContainer}>
          <View style={styles.trapezoid} />
          <Text style={styles.shapeLabel}>Trapezoid</Text>
        </View>

        {/* 15. Parallelogram */}
        <View style={styles.shapeContainer}>
          <View style={styles.parallelogramTop} />
          <Text style={styles.shapeLabel}>Parallelogram</Text>
        </View>

        {/* 16. Star (6 points) */}
        <View style={styles.shapeContainer}>
          <View style={styles.starSixContainer}>
            <View style={styles.starSixTop} />
            <View style={styles.starSixBottom} />
          </View>
          <Text style={styles.shapeLabel}>Star (6-pt)</Text>
        </View>

        {/* 17. Star (5 points) */}
        <View style={styles.shapeContainer}>
          <View style={styles.starFiveContainer}>
            <View style={styles.starFive} />
            <View style={styles.starFiveBefore} />
            <View style={styles.starFiveAfter} />
          </View>
          <Text style={styles.shapeLabel}>Star (5-pt)</Text>
        </View>

        {/* 18. Pentagon */}
        <View style={styles.shapeContainer}>
          <View style={styles.pentagonContainer}>
            <View style={styles.pentagonTop} />
            <View style={styles.pentagonBottom} />
          </View>
          <Text style={styles.shapeLabel}>Pentagon</Text>
        </View>

        {/* 19. Hexagon */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonBefore} />
            <View style={styles.hexagonMain} />
            <View style={styles.hexagonAfter} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon</Text>
        </View>

        {/* 20. Octagon */}
        <View style={styles.shapeContainer}>
          <View style={styles.octagonContainer}>
            <View style={styles.octagonBefore} />
            <View style={styles.octagonMain} />
            <View style={styles.octagonAfter} />
            <View
              style={[
                styles.octagonAfter,
                { transform: [{ rotate: "45deg" }] },
              ]}
            />
          </View>
          <Text style={styles.shapeLabel}>Octagon</Text>
        </View>

        {/* 21. Heart */}
        <View style={styles.shapeContainer}>
          <View style={styles.heartContainer}>
            <View style={styles.heart}>
              <View style={styles.heartBefore} />
              <View style={styles.heartAfter} />
            </View>
          </View>
          <Text style={styles.shapeLabel}>Heart</Text>
        </View>

        {/* 22. Infinity */}
        <View style={styles.shapeContainer}>
          <View style={styles.infinityContainer}>
            <View style={styles.infinityBefore} />
            <View style={styles.infinityAfter} />
          </View>
          <Text style={styles.shapeLabel}>Infinity</Text>
        </View>

        {/* 23. Diamond Square */}
        <View style={styles.shapeContainer}>
          <View style={styles.diamondSquare} />
          <Text style={styles.shapeLabel}>Diamond Square</Text>
        </View>

        {/* 24. Diamond Shield */}
        <View style={styles.shapeContainer}>
          <View style={styles.diamondShieldContainer}>
            <View style={styles.diamondShieldTop} />
            <View style={styles.diamondShieldBottom} />
          </View>
          <Text style={styles.shapeLabel}>Diamond Shield</Text>
        </View>

        {/* 25. Diamond Narrow */}
        <View style={styles.shapeContainer}>
          <View style={styles.diamondNarrowContainer}>
            <View style={styles.diamondNarrowTop} />
            <View style={styles.diamondNarrowBottom} />
          </View>
          <Text style={styles.shapeLabel}>Diamond Narrow</Text>
        </View>

        {/* 26. Cut Diamond */}
        <View style={styles.shapeContainer}>
          <View style={styles.cutDiamondContainer}>
            <View style={styles.cutDiamondTop} />
            <View style={styles.cutDiamondBottom} />
          </View>
          <Text style={styles.shapeLabel}>Cut Diamond</Text>
        </View>

        {/* 27. Egg */}
        <View style={styles.shapeContainer}>
          <View style={styles.egg} />
          <Text style={styles.shapeLabel}>Egg</Text>
        </View>

        {/* 28. Pac-Man */}
        <View style={styles.shapeContainer}>
          <View style={styles.pacman} />
          <Text style={styles.shapeLabel}>Pac-Man</Text>
        </View>

        {/* 29. Talk Bubble */}
        <View style={styles.shapeContainer}>
          <View style={styles.talkBubbleContainer}>
            <View style={styles.talkBubbleSquare} />
            <View style={styles.talkBubbleTriangle} />
          </View>
          <Text style={styles.shapeLabel}>Talk Bubble</Text>
        </View>

        {/* 30. 12 Point Burst */}
        <View style={styles.shapeContainer}>
          <View style={styles.burst12Container}>
            <View style={styles.burst12} />
            <View style={styles.burst12Before} />
            <View style={styles.burst12After} />
          </View>
          <Text style={styles.shapeLabel}>12-Pt Burst</Text>
        </View>

        {/* 31. 8 Point Burst */}
        <View style={styles.shapeContainer}>
          <View style={styles.burst8Container}>
            <View style={styles.burst8} />
            <View style={styles.burst8After} />
          </View>
          <Text style={styles.shapeLabel}>8-Pt Burst</Text>
        </View>

        {/* 32. Yin Yang */}
        <View style={styles.shapeContainer}>
          <View style={styles.yinYangContainer}>
            <View style={styles.yinYang} />
            <View style={styles.yinYangBefore} />
            <View style={styles.yinYangAfter} />
          </View>
          <Text style={styles.shapeLabel}>Yin Yang</Text>
        </View>

        {/* 33. Badge Ribbon */}
        <View style={styles.shapeContainer}>
          <View style={styles.badgeRibbon}>
            <View style={styles.badgeRibbonCircle} />
            <View style={styles.badgeRibbonNeg140} />
            <View style={styles.badgeRibbon140} />
          </View>
          <Text style={styles.shapeLabel}>Badge Ribbon</Text>
        </View>

        {/* 34. TV Screen */}
        <View style={styles.shapeContainer}>
          <View style={styles.tvscreen}>
            <View style={styles.tvscreenMain} />
            <View style={styles.tvscreenTop} />
            <View style={styles.tvscreenBottom} />
            <View style={styles.tvscreenLeft} />
            <View style={styles.tvscreenRight} />
          </View>
          <Text style={styles.shapeLabel}>TV Screen</Text>
        </View>

        {/* 35. Chevron */}
        <View style={styles.shapeContainer}>
          <View style={styles.chevronContainer}>
            <View style={styles.chevronMain} />
            <View style={[styles.chevronBefore, { top: -20, left: 0 }]} />
            <View
              style={[
                styles.chevronBefore,
                { top: -20, right: 0, transform: [{ scaleX: -1 }] },
              ]}
            />
            <View
              style={[
                styles.chevronBefore,
                { bottom: -20, left: 0, transform: [{ scale: -1 }] },
              ]}
            />
            <View
              style={[
                styles.chevronBefore,
                { bottom: -20, right: 0, transform: [{ scaleY: -1 }] },
              ]}
            />
          </View>
          <Text style={styles.shapeLabel}>Chevron</Text>
        </View>

        {/* 36. Magnifying Glass */}
        <View style={styles.shapeContainer}>
          <View style={styles.magnifyingGlass}>
            <View style={styles.magnifyingGlassCircle} />
            <View style={styles.magnifyingGlassStick} />
          </View>
          <Text style={styles.shapeLabel}>Magnifying Glass</Text>
        </View>

        {/* 37. Facebook Icon */}
        <View style={styles.shapeContainer}>
          <View style={styles.facebook}>
            <View style={styles.facebookMain}>
              <View style={styles.facebookCurve} />
              <View style={styles.facebookBefore} />
              <View style={styles.facebookAfter} />
              <View style={styles.facebookRedCover} />
            </View>
          </View>
          <Text style={styles.shapeLabel}>Facebook</Text>
        </View>

        {/* 38. Flag */}
        <View style={styles.shapeContainer}>
          <View style={styles.flag}>
            <View style={styles.flagTop} />
            <View style={styles.flagBottom} />
          </View>
          <Text style={styles.shapeLabel}>Flag</Text>
        </View>

        {/* 39. Cone */}
        <View style={styles.shapeContainer}>
          <View style={styles.cone} />
          <Text style={styles.shapeLabel}>Cone</Text>
        </View>

        {/* 40. Cross */}
        <View style={styles.shapeContainer}>
          <View style={styles.crossContainer}>
            <View style={styles.crossVertical} />
            <View style={styles.crossHorizontal} />
          </View>
          <Text style={styles.shapeLabel}>Cross</Text>
        </View>

        {/* 41. Base */}
        <View style={styles.shapeContainer}>
          <View style={styles.baseContainer}>
            <View style={styles.baseTop} />
            <View style={styles.baseBottom} />
          </View>
          <Text style={styles.shapeLabel}>Base</Text>
        </View>

        {/* 42. Hexagon (3 overlapping rectangles) */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonFilledContainer}>
            <View style={styles.hexagonRect1} />
            <View style={styles.hexagonRect2} />
            <View style={styles.hexagonRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon</Text>
        </View>

        {/* 43. Hexagon with Rounded Corners */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonRoundedContainer}>
            <View style={styles.hexagonRoundedRect1} />
            <View style={styles.hexagonRoundedRect2} />
            <View style={styles.hexagonRoundedRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Rounded</Text>
        </View>

        {/* 44. Diamond (Square rotated 45°) */}
        <View style={styles.shapeContainer}>
          <View style={styles.diamond} />
          <Text style={styles.shapeLabel}>Diamond</Text>
        </View>

        {/* 45. Octagon (2 overlapping squares) */}
        <View style={styles.shapeContainer}>
          <View style={styles.octagonSimpleContainer}>
            <View style={styles.octagonSquare1} />
            <View style={styles.octagonSquare2} />
          </View>
          <Text style={styles.shapeLabel}>Octagon</Text>
        </View>

        {/* 46. Star (Many overlapping rectangles) */}
        <View style={styles.shapeContainer}>
          <View style={styles.starContainer}>
            {[0, 36, 72, 108, 144].map((angle) => (
              <View
                key={angle}
                style={[
                  styles.starRay,
                  { transform: [{ rotate: `${angle}deg` }] },
                ]}
              />
            ))}
          </View>
          <Text style={styles.shapeLabel}>Star</Text>
        </View>

        {/* 47. Hexagon Thick (Thicker rectangles for better fill) */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonThickContainer}>
            <View style={styles.hexagonThickRect1} />
            <View style={styles.hexagonThickRect2} />
            <View style={styles.hexagonThickRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Thick</Text>
        </View>

        {/* 48. Hexagon Wide (Very wide rectangles) */}
        <View style={styles.shapeContainer}>
          <View style={styles.hexagonWideContainer}>
            <View style={styles.hexagonWideRect1} />
            <View style={styles.hexagonWideRect2} />
            <View style={styles.hexagonWideRect3} />
          </View>
          <Text style={styles.shapeLabel}>Hexagon Wide</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 24,
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  shapeContainer: {
    width: 110,
    height: 110,
    margin: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  shapeLabel: {
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
    color: "#64748b",
    position: "absolute",
    bottom: 6,
    fontWeight: "500",
  },

  // 1. Square
  square: {
    width: 100,
    height: 100,
    backgroundColor: "#ef4444",
  },

  // 2. Rectangle
  rectangle: {
    width: 100 * 2,
    height: 100,
    backgroundColor: "#3b82f6",
  },

  // 3. Circle
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: "#10b981",
  },

  // 4. Oval
  oval: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f59e0b",
    transform: [{ scaleX: 2 }],
  },

  // 5. Triangle Up
  triangleUp: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#8b5cf6",
  },

  // 6. Triangle Down
  triangleDown: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#06b6d4",
    transform: [{ rotate: "180deg" }],
  },

  // 7. Triangle Left
  triangleLeft: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#f97316",
    transform: [{ rotate: "-90deg" }],
  },

  // 8. Triangle Right
  triangleRight: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ec4899",
    transform: [{ rotate: "90deg" }],
  },

  // 9. Triangle Top Left
  triangleTopLeft: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "#22c55e",
  },

  // 10. Triangle Top Right
  triangleTopRight: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "#6366f1",
    transform: [{ rotate: "90deg" }],
  },

  // 11. Triangle Bottom Left
  triangleBottomLeft: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "#eab308",
    transform: [{ rotate: "270deg" }],
  },

  // 12. Triangle Bottom Right
  triangleBottomRight: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "#dc2626",
    transform: [{ rotate: "180deg" }],
  },

  // 13. Curved Tail Arrow
  curvedTailArrowContainer: {
    backgroundColor: "transparent",
    overflow: "visible",
    width: 30,
    height: 25,
  },
  curvedTailArrow: {
    backgroundColor: "transparent",
    position: "absolute",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 3,
    borderTopColor: "#a855f7",
    borderStyle: "solid",
    borderTopLeftRadius: 12,
    top: 1,
    left: 0,
    width: 20,
    height: 20,
    transform: [{ rotate: "45deg" }],
  },
  curvedTailArrowAfter: {
    backgroundColor: "transparent",
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderTopColor: "transparent",
    borderRightWidth: 9,
    borderRightColor: "#a855f7",
    borderStyle: "solid",
    transform: [{ rotate: "10deg" }],
    position: "absolute",
    bottom: 9,
    right: 3,
    overflow: "visible",
  },

  // 14. Trapezoid
  trapezoid: {
    width: 200,
    height: 0,
    borderBottomWidth: 100,
    borderBottomColor: "#14b8a6",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderStyle: "solid",
  },

  // 15. Parallelogram
  parallelogramContainer: {
    width: 150,
    height: 100,
  },
  parallelogramTop: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#f59e0b",
    width: 150,
    height: 100,
  },
  parallelogramBottom: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },

  // 16. Star (6 points)
  starSixContainer: {
    width: 100,
    height: 100,
  },
  starSixTop: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0ea5e9",
    top: 0,
    left: 0,
  },
  starSixBottom: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#0ea5e9",
    transform: [{ rotate: "180deg" }],
    top: 25,
    left: 0,
  },

  // 17. Star (5 points)
  starFiveContainer: {
    width: 150,
    height: 150,
  },
  starFive: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#eab308",
    top: -45,
    left: 37,
  },
  starFiveBefore: {
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
    top: 0,
    borderStyle: "solid",
    borderRightWidth: 100,
    borderRightColor: "transparent",
    borderBottomWidth: 70,
    borderBottomColor: "#eab308",
    borderLeftWidth: 100,
    borderLeftColor: "transparent",
    transform: [{ rotate: "35deg" }],
  },
  starFiveAfter: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: -25,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderRightWidth: 100,
    borderRightColor: "transparent",
    borderBottomWidth: 70,
    borderBottomColor: "#eab308",
    borderLeftWidth: 100,
    borderLeftColor: "transparent",
    transform: [{ rotate: "-35deg" }],
  },

  // 18. Pentagon
  pentagonContainer: {
    backgroundColor: "transparent",
  },
  pentagonTop: {
    position: "absolute",
    height: 0,
    width: 0,
    top: -35,
    left: 0,
    borderStyle: "solid",
    borderBottomColor: "#c084fc",
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderLeftWidth: 45,
    borderRightColor: "transparent",
    borderRightWidth: 45,
    borderTopWidth: 0,
    borderTopColor: "transparent",
  },
  pentagonBottom: {
    width: 90,
    borderBottomColor: "#c084fc",
    borderBottomWidth: 0,
    borderLeftColor: "transparent",
    borderLeftWidth: 18,
    borderRightColor: "transparent",
    borderRightWidth: 18,
    borderTopColor: "#c084fc",
    borderTopWidth: 50,
  },

  // 19. Hexagon
  hexagonContainer: {
    width: 100,
    height: 55,
  },
  hexagonBefore: {
    position: "absolute",
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderBottomWidth: 25,
    borderBottomColor: "#16a34a",
  },
  hexagonMain: {
    width: 100,
    height: 55,
    backgroundColor: "#16a34a",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderTopWidth: 25,
    borderTopColor: "#16a34a",
  },

  // 20. Octagon
  octagonContainer: {},
  octagonBefore: {
    width: 42,
    height: 100,
    backgroundColor: "#ea580c",
  },
  octagonMain: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 42,
    height: 100,
    backgroundColor: "#ea580c",
    transform: [{ rotate: "90deg" }],
  },
  octagonAfter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 42,
    height: 100,
    backgroundColor: "#ea580c",
    transform: [{ rotate: "-45deg" }],
  },

  // 21. Heart
  heartContainer: {
    width: 50,
    height: 50,
  },
  heart: {
    width: 50,
    height: 50,
  },
  heartBefore: {
    width: 30,
    height: 45,
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#dc2626",
    transform: [{ rotate: "-45deg" }],
    left: 5,
  },
  heartAfter: {
    width: 30,
    height: 45,
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#dc2626",
    transform: [{ rotate: "45deg" }],
    right: 5,
  },

  // 22. Infinity
  infinityContainer: {
    width: 80,
    height: 100,
  },
  infinityBefore: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderWidth: 20,
    borderColor: "#2563eb",
    borderStyle: "solid",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 0,
    transform: [{ rotate: "-135deg" }],
  },
  infinityAfter: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderWidth: 20,
    borderColor: "#2563eb",
    borderStyle: "solid",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    transform: [{ rotate: "-135deg" }],
  },

  // 23. Diamond Square
  diamondSquare: {
    width: 50,
    height: 50,
    backgroundColor: "#d97706",
    transform: [{ rotate: "45deg" }],
  },

  // 24. Diamond Shield
  diamondShieldContainer: {
    width: 100,
    height: 100,
  },
  diamondShieldTop: {
    width: 0,
    height: 0,
    borderTopWidth: 50,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderLeftWidth: 50,
    borderRightColor: "transparent",
    borderRightWidth: 50,
    borderBottomColor: "#7c3aed",
    borderBottomWidth: 20,
  },
  diamondShieldBottom: {
    width: 0,
    height: 0,
    borderTopWidth: 70,
    borderTopColor: "#7c3aed",
    borderLeftColor: "transparent",
    borderLeftWidth: 50,
    borderRightColor: "transparent",
    borderRightWidth: 50,
    borderBottomColor: "transparent",
    borderBottomWidth: 50,
  },

  // 25. Diamond Narrow
  diamondNarrowContainer: {
    width: 100,
    height: 100,
  },
  diamondNarrowTop: {
    width: 0,
    height: 0,
    borderTopWidth: 50,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderLeftWidth: 50,
    borderRightColor: "transparent",
    borderRightWidth: 50,
    borderBottomColor: "#059669",
    borderBottomWidth: 70,
  },
  diamondNarrowBottom: {
    width: 0,
    height: 0,
    borderTopWidth: 70,
    borderTopColor: "#059669",
    borderLeftColor: "transparent",
    borderLeftWidth: 50,
    borderRightColor: "transparent",
    borderRightWidth: 50,
    borderBottomColor: "transparent",
    borderBottomWidth: 50,
  },

  // 26. Cut Diamond
  cutDiamondContainer: {
    width: 100,
    height: 100,
  },
  cutDiamondTop: {
    width: 100,
    height: 0,
    borderTopWidth: 0,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderLeftWidth: 25,
    borderRightColor: "transparent",
    borderRightWidth: 25,
    borderBottomColor: "#1d4ed8",
    borderBottomWidth: 25,
  },
  cutDiamondBottom: {
    width: 0,
    height: 0,
    borderTopWidth: 70,
    borderTopColor: "#1d4ed8",
    borderLeftColor: "transparent",
    borderLeftWidth: 50,
    borderRightColor: "transparent",
    borderRightWidth: 50,
    borderBottomColor: "transparent",
    borderBottomWidth: 0,
  },

  // 27. Egg
  egg: {
    width: 126,
    height: 180,
    backgroundColor: "#fbbf24",
    borderTopLeftRadius: 108,
    borderTopRightRadius: 108,
    borderBottomLeftRadius: 95,
    borderBottomRightRadius: 95,
  },

  // 28. Pac-Man
  pacman: {
    width: 0,
    height: 0,
    borderTopWidth: 60,
    borderTopColor: "#facc15",
    borderLeftColor: "#facc15",
    borderLeftWidth: 60,
    borderRightColor: "transparent",
    borderRightWidth: 60,
    borderBottomColor: "#facc15",
    borderBottomWidth: 60,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
  },

  // 29. Talk Bubble
  talkBubbleContainer: {
    backgroundColor: "transparent",
  },
  talkBubbleSquare: {
    width: 120,
    height: 80,
    backgroundColor: "#38bdf8",
    borderRadius: 10,
  },
  talkBubbleTriangle: {
    position: "absolute",
    left: -26,
    top: 26,
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderTopWidth: 13,
    borderRightWidth: 26,
    borderRightColor: "#38bdf8",
    borderBottomWidth: 13,
    borderBottomColor: "transparent",
  },

  // 30. 12 Point Burst
  burst12Container: {},
  burst12: {
    width: 80,
    height: 80,
    backgroundColor: "#f97316",
  },
  burst12Before: {
    width: 80,
    height: 80,
    position: "absolute",
    backgroundColor: "#f97316",
    top: 0,
    right: 0,
    transform: [{ rotate: "30deg" }],
  },
  burst12After: {
    width: 80,
    height: 80,
    position: "absolute",
    backgroundColor: "#f97316",
    top: 0,
    right: 0,
    transform: [{ rotate: "60deg" }],
  },

  // 31. 8 Point Burst
  burst8Container: {},
  burst8: {
    width: 80,
    height: 80,
    backgroundColor: "#ef4444",
    transform: [{ rotate: "20deg" }],
  },
  burst8After: {
    width: 80,
    height: 80,
    position: "absolute",
    backgroundColor: "#ef4444",
    top: 0,
    left: 0,
    transform: [{ rotate: "155deg" }],
  },

  // 32. Yin Yang
  yinYangContainer: {},
  yinYang: {
    width: 100,
    height: 100,
    borderColor: "#000000",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 50,
    borderRightWidth: 2,
    borderRadius: 50,
  },
  yinYangBefore: {
    position: "absolute",
    top: 24,
    left: 0,
    borderColor: "#000000",
    borderWidth: 24,
    borderRadius: 30,
  },
  yinYangAfter: {
    position: "absolute",
    top: 24,
    right: 2,
    backgroundColor: "#000000",
    borderColor: "white",
    borderWidth: 25,
    borderRadius: 30,
  },

  // 33. Badge Ribbon
  badgeRibbon: {},
  badgeRibbonCircle: {
    width: 100,
    height: 100,
    backgroundColor: "#b91c1c",
    borderRadius: 50,
  },
  badgeRibbon140: {
    backgroundColor: "transparent",
    borderBottomWidth: 70,
    borderBottomColor: "#b91c1c",
    borderLeftWidth: 40,
    borderLeftColor: "transparent",
    borderRightWidth: 40,
    borderRightColor: "transparent",
    position: "absolute",
    top: 70,
    right: -10,
    transform: [{ rotate: "140deg" }],
  },
  badgeRibbonNeg140: {
    backgroundColor: "transparent",
    borderBottomWidth: 70,
    borderBottomColor: "#b91c1c",
    borderLeftWidth: 40,
    borderLeftColor: "transparent",
    borderRightWidth: 40,
    borderRightColor: "transparent",
    position: "absolute",
    top: 70,
    left: -10,
    transform: [{ rotate: "-140deg" }],
  },

  // 34. TV Screen
  tvscreen: {},
  tvscreenMain: {
    width: 150,
    height: 75,
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  tvscreenTop: {
    width: 73,
    height: 70,
    backgroundColor: "#1f2937",
    position: "absolute",
    top: -26,
    left: 39,
    borderRadius: 35,
    transform: [{ scaleX: 2 }, { scaleY: 0.5 }],
  },
  tvscreenBottom: {
    width: 73,
    height: 70,
    backgroundColor: "#1f2937",
    position: "absolute",
    bottom: -26,
    left: 39,
    borderRadius: 35,
    transform: [{ scaleX: 2 }, { scaleY: 0.5 }],
  },
  tvscreenLeft: {
    width: 20,
    height: 38,
    backgroundColor: "#1f2937",
    position: "absolute",
    left: -7,
    top: 18,
    borderRadius: 35,
    transform: [{ scaleX: 0.5 }, { scaleY: 2 }],
  },
  tvscreenRight: {
    width: 20,
    height: 38,
    backgroundColor: "#1f2937",
    position: "absolute",
    right: -7,
    top: 18,
    borderRadius: 35,
    transform: [{ scaleX: 0.5 }, { scaleY: 2 }],
  },

  // 35. Chevron
  chevronContainer: {
    width: 150,
    height: 50,
  },
  chevronMain: {
    width: 150,
    height: 50,
    backgroundColor: "#15803d",
  },
  chevronBefore: {
    backgroundColor: "transparent",
    borderTopWidth: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 75,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
    borderLeftColor: "#15803d",
    position: "absolute",
    top: -20,
    left: 0,
  },
  chevronAfter: {
    display: "none",
  },

  // 36. Magnifying Glass
  magnifyingGlass: {},
  magnifyingGlassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 15,
    borderColor: "#374151",
  },
  magnifyingGlassStick: {
    position: "absolute",
    right: -20,
    bottom: -10,
    backgroundColor: "#374151",
    width: 50,
    height: 10,
    transform: [{ rotate: "45deg" }],
  },

  // 37. Facebook Icon
  facebook: {
    width: 100,
    height: 110,
  },
  facebookMain: {
    backgroundColor: "#1877f2",
    width: 100,
    height: 110,
    borderRadius: 5,
    borderColor: "#1877f2",
    borderTopWidth: 15,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  facebookRedCover: {
    width: 10,
    height: 20,
    backgroundColor: "#1877f2",
    position: "absolute",
    right: 0,
    top: 5,
  },
  facebookCurve: {
    width: 50,
    borderWidth: 20,
    borderTopWidth: 20,
    borderTopColor: "white",
    borderBottomColor: "transparent",
    borderLeftColor: "white",
    borderRightColor: "transparent",
    borderRadius: 20,
    position: "absolute",
    right: -8,
    top: 5,
  },
  facebookBefore: {
    position: "absolute",
    backgroundColor: "white",
    width: 20,
    height: 70,
    bottom: 0,
    right: 22,
  },
  facebookAfter: {
    position: "absolute",
    width: 55,
    top: 50,
    height: 20,
    backgroundColor: "white",
    right: 5,
  },

  // 38. Flag
  flag: {},
  flagTop: {
    width: 110,
    height: 56,
    backgroundColor: "#dc2626",
  },
  flagBottom: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderBottomWidth: 13,
    borderBottomColor: "transparent",
    borderLeftWidth: 55,
    borderLeftColor: "#dc2626",
    borderRightWidth: 55,
    borderRightColor: "#dc2626",
  },

  // 39. Cone
  cone: {
    width: 0,
    height: 0,
    borderLeftWidth: 55,
    borderLeftColor: "transparent",
    borderRightWidth: 55,
    borderRightColor: "transparent",
    borderTopWidth: 100,
    borderTopColor: "#f97316",
    borderRadius: 55,
  },

  // 40. Cross
  crossContainer: {},
  crossVertical: {
    backgroundColor: "#1f2937",
    height: 100,
    width: 20,
  },
  crossHorizontal: {
    backgroundColor: "#1f2937",
    height: 20,
    width: 100,
    position: "absolute",
    left: -40,
    top: 40,
  },

  // 41. Base
  baseContainer: {},
  baseTop: {
    borderBottomWidth: 35,
    borderBottomColor: "#64748b",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    height: 0,
    width: 0,
    left: 0,
    top: -35,
    position: "absolute",
  },
  baseBottom: {
    backgroundColor: "#64748b",
    height: 55,
    width: 100,
  },

  // 42. Hexagon (3 overlapping rectangles)
  hexagonFilledContainer: {
    width: 50,
    height: 50,
    position: "relative",
  },
  hexagonRect1: {
    width: 50,
    height: 28,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 11,
  },
  hexagonRect2: {
    width: 50,
    height: 28,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 11,
    transform: [{ rotate: "60deg" }],
  },
  hexagonRect3: {
    width: 50,
    height: 28,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 11,
    transform: [{ rotate: "-60deg" }],
  },

  // 43. Hexagon with Rounded Corners (like React Query)
  hexagonRoundedContainer: {
    width: 50,
    height: 50,
    position: "relative",
  },
  hexagonRoundedRect1: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    borderRadius: 4,
    position: "absolute",
    top: 10.5,
  },
  hexagonRoundedRect2: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    borderRadius: 4,
    position: "absolute",
    top: 10.5,
    transform: [{ rotate: "60deg" }],
  },
  hexagonRoundedRect3: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    borderRadius: 4,
    position: "absolute",
    top: 10.5,
    transform: [{ rotate: "-60deg" }],
  },

  // 44. Diamond (Square rotated 45°)
  diamond: {
    width: 40,
    height: 40,
    backgroundColor: "#a78bfa",
    transform: [{ rotate: "45deg" }],
    marginTop: 5,
  },

  // 45. Octagon (2 overlapping squares)
  octagonSimpleContainer: {
    width: 50,
    height: 50,
    position: "relative",
  },
  octagonSquare1: {
    width: 35,
    height: 35,
    backgroundColor: "#34d399",
    position: "absolute",
    top: 7.5,
    left: 7.5,
  },
  octagonSquare2: {
    width: 35,
    height: 35,
    backgroundColor: "#34d399",
    position: "absolute",
    top: 7.5,
    left: 7.5,
    transform: [{ rotate: "45deg" }],
  },

  // 46. Star (Many overlapping rectangles)
  starContainer: {
    width: 50,
    height: 50,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  starRay: {
    width: 50,
    height: 3,
    backgroundColor: "#f87171",
    position: "absolute",
    top: 23.5,
  },

  // 47. Hexagon Thick (Thicker rectangles for better fill)
  hexagonThickContainer: {
    width: 50,
    height: 50,
    position: "relative",
  },
  hexagonThickRect1: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10.5,
  },
  hexagonThickRect2: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10.5,
    transform: [{ rotate: "60deg" }],
  },
  hexagonThickRect3: {
    width: 50,
    height: 29,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 10.5,
    transform: [{ rotate: "-60deg" }],
  },

  // 48. Hexagon Wide (Very wide rectangles)
  hexagonWideContainer: {
    width: 50,
    height: 50,
    position: "relative",
  },
  hexagonWideRect1: {
    width: 58,
    height: 33,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 8.5,
    left: -4,
  },
  hexagonWideRect2: {
    width: 58,
    height: 33,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 8.5,
    left: -4,
    transform: [{ rotate: "60deg" }],
  },
  hexagonWideRect3: {
    width: 58,
    height: 33,
    backgroundColor: "#fbbf24",
    position: "absolute",
    top: 8.5,
    left: -4,
    transform: [{ rotate: "-60deg" }],
  },
});
