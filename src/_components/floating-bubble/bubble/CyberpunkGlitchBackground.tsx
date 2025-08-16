import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get("window");

// Frontend/Mobile dev memes and inside jokes

const GLITCH_TEXTS = [
  // --- The Eternal Truths ---
  "WORKS_ON_MY_MACHINE",
  "NODE_MODULES_BLACK_HOLE",
  "DELETING_NODE_MODULES_TO_APPEASE_THE_GODS",

  // --- JavaScript's Beautiful Chaos ---
  "UNDEFINED_IS_NOT_A_FUNCTION",
  "JAVASCRIPT_WAS_A_MISTAKE", // But it's our mistake

  // --- React's Infinite Loop of Pain ---
  "USE_EFFECT_INFINITE_LOOP_IN_PROGRESS",
  "HYDRATION_FAILED_DRINK_MORE_WATER",
  "EXHAUSTIVE_DEPS_WANTS_BLOOD",
  "MY_DEPENDENCY_ARRAY_IS_LYING_TO_ME",
  "STRICT_MODE_RAN_TWICE",
  "LIFTING_STATE_TO_THE_STRATOSPHERE",
  "STALE_CLOSURE_FROM_A_HAPPIER_TIME",

  // --- CSS Reality Check ---
  "Z_INDEX_999999_CLUB",
  "FLEXBOX_CENTER_AND_PRAY",
  "MOBILE_SAFARI_100VH_TRAP",
  "SAFARI_IS_THE_NEW_IE",

  // --- React Native Bridge to Nowhere ---
  "XCODE_IS_UPDATING_SEE_YOU_NEXT_WEEK",
  "THIS_WORKS_ON_IOS_BUT_EXPLODES_ON_ANDROID",
  "METRO_BUNDLER_STUCK_AT_99",
  "SHAKING_DEVICE_FURIOUSLY_TO_OPEN_MENU",
  "THE_BRIDGE_IS_ON_FIRE",
  "KEYBOARD_AVOIDINGVIEW_AVOIDS_NOTHING",

  // --- NPM Dependency Hell ---
  "DOWNLOADING_THE_ENTIRE_INTERNET_AGAIN",
  "NPM_AUDIT_10000_VULNS",
  "PEER_DEPENDENCY_HELL",
  "LEFT_PAD_FLASHBACK",

  // --- Build Tools & Config ---
  "WEBPACK_BUNDLE_BIGGER_THAN_APP",
  "ESLINT_DISABLE_NEXT_LINE_FOREVER",
  "PRETTIER_REFORMATTED_THE_WORLD",

  // --- The Human Experience ---
  "YELLING_AT_MY_RUBBER_DUCK",
  "THIS_IS_LEGACY_CODE_I_WROTE_YESTERDAY",
  "TODO_REWRITE_THIS_FROM_SCRATCH",
  "MERGE_CONFLICT_IN_MY_SOUL",
  "DEBUGGING_WITH_CONSOLE_LOG_ALERT",

  // --- The Golden Ones That Hit Different ---
  "SENDING_PROPS_TO_THE_EARTHS_CORE",
  "MY_PROJECT_WEIGHS_MORE_THAN_A_SMALL_MOON",
  "REDUX_BOILERPLATE_FACTORY_INITIALIZING",
  "RECONCILING_WITH_MY_POOR_CHOICES",
  "NODE_MODULES_HAS_ACHIEVED_SENTIENCE",
  "FEATURE_NOT_A_BUG",
];
interface ScanlineProps {
  delay: number;
}

const Scanline: React.FC<ScanlineProps> = ({ delay }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 200,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 100,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.scanline,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

interface GlitchTextProps {
  text: string;
  index: number;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const randomX = Math.random() * (width - 150);
  const randomY = Math.random() * height;

  useEffect(() => {
    const startDelay = index * 500 + Math.random() * 2000;

    const glitchAnimation = () => {
      Animated.sequence([
        // Appear with glitch
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
        // Glitch effect
        Animated.parallel([
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 5,
              duration: 20,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -5,
              duration: 20,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 3,
              duration: 20,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 20,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Hold
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Disappear with glitch
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Wait before next cycle
        Animated.timing(opacity, {
          toValue: 0,
          duration: 5000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
      ]).start(() => glitchAnimation());
    };

    setTimeout(glitchAnimation, startDelay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.glitchTextContainer,
        {
          left: randomX,
          top: randomY,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <Text style={styles.glitchText}>{text}</Text>
      <Text style={styles.glitchTextShadow}>{text}</Text>
    </Animated.View>
  );
};

interface DataStreamProps {
  side: "left" | "right";
  delay: number;
}

const DataStream: React.FC<DataStreamProps> = ({ side, delay }) => {
  const translateY = useRef(new Animated.Value(-height * 0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const xPosition = side === "left" ? 20 : width - 40;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: height * 1.5,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -height * 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.05,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.05,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }, delay);
  }, []);

  const binaryString = Array(50)
    .fill(0)
    .map(() => (Math.random() > 0.5 ? "1" : "0"))
    .join("\n");

  return (
    <Animated.View
      style={[
        styles.dataStream,
        {
          [side]: xPosition - 20,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.binaryText}>{binaryString}</Text>
    </Animated.View>
  );
};

interface GridLineProps {
  horizontal: boolean;
  position: number;
}

const GridLine: React.FC<GridLineProps> = ({ horizontal, position }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.03,
          duration: 2000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.08,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.03,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.01,
          duration: 2000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.gridLine,
        horizontal
          ? {
              top: position,
              left: 0,
              right: 0,
              height: 1,
            }
          : {
              left: position,
              top: 0,
              bottom: 0,
              width: 1,
            },
        { opacity },
      ]}
    />
  );
};

export const CyberpunkGlitchBackground: React.FC = React.memo(() => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Grid lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <GridLine key={`h-${i}`} horizontal position={(i + 1) * (height / 6)} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <GridLine
          key={`v-${i}`}
          horizontal={false}
          position={(i + 1) * (width / 6)}
        />
      ))}

      {/* Data streams on sides */}
      <DataStream side="left" delay={0} />
      <DataStream side="right" delay={2000} />

      {/* Glitch text elements - randomly select and display */}
      {Array.from({ length: 10 }).map((_, index) => {
        const randomText =
          GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)];
        return <GlitchText key={index} text={randomText} index={index} />;
      })}

      {/* Scanning lines */}
      <Scanline delay={0} />
      <Scanline delay={1500} />
      <Scanline delay={3000} />

      {/* Digital noise overlay */}
      <View style={styles.noiseOverlay} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#00FFFF",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  glitchTextContainer: {
    position: "absolute",
  },
  glitchText: {
    color: "#00FFFF",
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 1,
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  glitchTextShadow: {
    position: "absolute",
    top: 1,
    left: 1,
    color: "#FF006E",
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 0.5,
  },
  dataStream: {
    position: "absolute",
    width: 20,
    height: height * 2,
  },
  binaryText: {
    color: "#00FF00",
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 14,
    letterSpacing: 2,
    textAlign: "center",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#00FFFF",
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.02,
  },
});

export default CyberpunkGlitchBackground;
