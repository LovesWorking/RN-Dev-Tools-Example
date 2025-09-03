import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { pokemonNames, searchPokemon } from "@/src/data/pokemonNames";
import { useQueryClient } from "@tanstack/react-query";
import { PokemonCardSwipeable } from "./components/PokemonCardSwipeable";
import {
  RnBetterDevToolsBubble,
  UserRole,
  Environment,
} from "@/rn-better-dev-tools/src";
import {
  createEnvVarConfig,
  envVar,
} from "@/rn-better-dev-tools/src/features/env";
import { useSafeAreaInsets } from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";
// import { IconShowcase } from "@/docs/svg/IconShowCase";
// import { ReactNativeShapesShowcase } from "@/docs/svg/ReactNativeShapesShowcase";
import { StorageDiffTest } from "@/components/StorageDiffTest";
// import { AutoDiffTest } from "@/components/AutoDiffTest";
// import { DiffThemeShowcase } from "@/rn-better-dev-tools/src/features/storage/components/DiffViewer/DiffThemeShowcase";
// import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

// Import TestStorageDiff for testing
// import { TestStorageDiff } from "@/components/TestStorageDiff";
// Import TestDiffViewer for testing diff viewer fixes
// import { TestDiffViewer } from "@/components/TestDiffViewer";

// Import PureModalExample for testing
// import PureModalExample from "@/rn-better-dev-tools/src/components/modals/PureModal/PureModalExample";

const { width, height } = Dimensions.get("window");

// Get random Pokemon from our database
function getRandomPokemonNames(count: number): string[] {
  const shuffled = [...pokemonNames].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Temporarily replace with TestStorageDiff for testing
export default function TestScreen() {
  // return <StorageDiffTest />; // Storage diff test component
  // return <PureModalExample />;
  // return <TestDiffViewer />; // Testing diff viewer fixes
  // return <StorageDiffTest />; // Testing storage diff
  return <PokemonScreen />; // Main app screen
}

// ---------------------------------------------------------------------------
// DevTools Filter Buttons Variations Showcase
// ---------------------------------------------------------------------------

// Commented out unused code to fix linting
/*
type ToolKey = "query" | "env" | "sentry" | "storage" | "wifi" | "network";

const TOOL_META: Record<
  ToolKey,
  { title: string; desc: string; color: string }
> = {
  query: {
    title: "QUERY",
    desc: "React Query inspector",
    color: gameUIColors.query,
  },
  env: {
    title: "ENV",
    desc: "Environment variables debugger",
    color: gameUIColors.env,
  },
  sentry: {
    title: "SENTRY",
    desc: "Sentry events viewer",
    color: gameUIColors.debug,
  },
  storage: {
    title: "STORAGE",
    desc: "AsyncStorage browser",
    color: gameUIColors.storage,
  },
  wifi: {
    title: "WIFI",
    desc: "RQ online toggle",
    color: gameUIColors.network,
  },
  network: {
    title: "NETWORK",
    desc: "Network request logger",
    color: gameUIColors.network,
  },
};
*/

// Commented out unused component
/*
interface CardVariantProps {
  label: string;
  desc: string;
  color: string;
  variant: number; // 0 = original, 1..10 = new styles
}

const ToolCardVariant = memo(function ToolCardVariant({
  label,
  desc,
  color,
  variant,
}: CardVariantProps) {
  const [enabled, setEnabled] = useState(true);

  // base shared styles
  const BaseLeftAccent = (
    <View
      style={{
        width: 5,
        height: 28,
        borderRadius: 3,
        marginRight: 12,
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
      }}
    />
  );

  const Title = (
    <Text
      style={{
        color: "#DCE7FF",
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 0.8,
      }}
    >
      {label}
    </Text>
  );

  const Subtitle = (
    <Text style={{ color: "#93A3C7", fontSize: 11 }}>{desc}</Text>
  );

  const Toggle = (
    <Switch
      value={enabled}
      onValueChange={setEnabled}
      thumbColor={enabled ? color : "#4B566B"}
      trackColor={{ false: "#2A3244", true: `${color}40` }}
      ios_backgroundColor="#2A3244"
    />
  );

  // Completely different toggle styles for variety
  const PillToggle = (
    <TouchableOpacity
      onPress={() => setEnabled(!enabled)}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: enabled ? `${color}33` : "#1b2334",
        borderWidth: 1,
        borderColor: enabled ? `${color}88` : "#2a3550",
      }}
    >
      <Text
        style={{
          color: enabled ? color : "#8CA2C8",
          fontWeight: "700",
          fontSize: 11,
        }}
      >
        {enabled ? "ON" : "OFF"}
      </Text>
    </TouchableOpacity>
  );

  const RadioToggle = (
    <TouchableOpacity
      onPress={() => setEnabled(!enabled)}
      activeOpacity={0.8}
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: enabled ? color : "#415172",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {enabled ? (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: color,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );

  const CheckboxToggle = (
    <TouchableOpacity
      onPress={() => setEnabled(!enabled)}
      activeOpacity={0.8}
      style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: enabled ? color : "#415172",
        backgroundColor: enabled ? `${color}22` : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {enabled ? <Ionicons name="checkmark" size={16} color={color} /> : null}
    </TouchableOpacity>
  );

  // container by variant
  const container = (() => {
    switch (variant) {
      case 0: // Original-like baseline
        return (
          <View
            style={{
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#121827",
              borderWidth: 1,
              borderColor: "#2A344A",
              padding: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {BaseLeftAccent}
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              {Toggle}
            </View>
          </View>
        );
      case 1: // Compact chip row with icon + chevron
        return (
          <View
            style={{
              borderRadius: 999,
              paddingVertical: 10,
              paddingHorizontal: 14,
              backgroundColor: "#0F172A",
              borderWidth: 1,
              borderColor: "#25324A",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: `${color}26`,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: `${color}66`,
                }}
              >
                <Ionicons name="flash" size={16} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#E6EEFF", fontWeight: "800" }}>
                  {label}
                </Text>
                <Text
                  style={{ color: "#7F91B2", fontSize: 11 }}
                  numberOfLines={1}
                >
                  {desc}
                </Text>
              </View>
              {PillToggle}
              <Ionicons name="chevron-forward" size={18} color="#7F91B2" />
            </View>
          </View>
        );
      case 2: // Large gradient tile with big icon and pill toggle
        return (
          <LinearGradient
            colors={["#0B1222", "#0F1931"]}
            style={{
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: `${color}3d`,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${color}26`,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: `${color}66`,
                }}
              >
                <Ionicons name="layers" size={20} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              {PillToggle}
            </View>
          </LinearGradient>
        );
      case 3: // Soft gradient tile
        return (
          <View
            style={{
              borderRadius: 14,
              backgroundColor: "#0B1329",
              borderWidth: 1,
              borderColor: `${color}55`,
              padding: 14,
            }}
          >
            // Cut corners
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 16,
                height: 16,
                backgroundColor: "#0B1329",
                transform: [{ rotate: "45deg" }],
                marginRight: -8,
                marginTop: -8,
                borderColor: `${color}66`,
                borderRightWidth: 1,
                borderTopWidth: 1,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {BaseLeftAccent}
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              {RadioToggle}
            </View>
          </View>
        );
      case 4: // Dashed wireframe + glow corners
        return (
          <View
            style={{
              borderRadius: 12,
              padding: 14,
              backgroundColor: "#0C1222",
              borderWidth: 1,
              borderColor: `${color}44`,
            }}
          >
            // Ticket notches
            <View
              style={{
                position: "absolute",
                top: 12,
                left: -8,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#020617",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 12,
                right: -8,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#020617",
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                left: 6,
                bottom: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: `${color}66`,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {BaseLeftAccent}
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              {CheckboxToggle}
            </View>
          </View>
        );
      case 5: // Minimal outline, compact
        return (
          <View
            style={{
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 14,
              backgroundColor: "#0B1120",
              borderWidth: 1,
              borderColor: "#1F2A44",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="code-slash"
                size={18}
                color={color}
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#7F91B2" />
            </View>
            <View style={{ marginTop: 10, alignItems: "flex-end" }}>
              {PillToggle}
            </View>
          </View>
        );
      case 6: // Split gradient background
        return (
          <View
            style={{
              borderRadius: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: `${color}33`,
              flexDirection: "row",
            }}
          >
            <LinearGradient
              colors={[`${color}33`, `${color}11`]}
              style={{ width: 80 }}
            />
            <View style={{ flex: 1, padding: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 34,
                    borderRadius: 6,
                    marginRight: 12,
                    backgroundColor: `${color}AA`,
                  }}
                />
                <View style={{ flex: 1 }}>
                  {Title}
                  {Subtitle}
                </View>
                {RadioToggle}
              </View>
            </View>
          </View>
        );
      case 7: // Holographic sheen overlay
        return (
          <View
            style={{
              borderRadius: 16,
              padding: 14,
              backgroundColor: "#0D1224",
              borderWidth: 1,
              borderColor: "#20304F",
            }}
          >
            <LinearGradient
              colors={["#FFFFFF08", "#00FFFF06", "#FF00FF06"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 16,
              }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: `${color}22`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="construct" size={18} color={color} />
              </View>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                {Title}
                {Subtitle}
              </View>
            </View>
            <View style={{ marginTop: 12, alignItems: "flex-end" }}>
              {PillToggle}
            </View>
          </View>
        );
      case 8: // Elevated card with top accent line
        return (
          <View
            style={{
              borderRadius: 12,
              padding: 14,
              backgroundColor: "#0B1120",
              borderWidth: 1,
              borderColor: "#21304A",
              shadowColor: color,
              shadowOpacity: 0.5,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 18,
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 3,
                backgroundColor: color,
                opacity: 0.6,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
            <View
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                transform: [{ rotate: "-20deg" }],
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 6,
                  backgroundColor: `${color}55`,
                  borderRadius: 3,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 6,
                  height: 24,
                  borderRadius: 4,
                  marginRight: 10,
                  backgroundColor: color,
                }}
              />
              <View style={{ flex: 1 }}>
                {Title}
                {Subtitle}
              </View>
              {RadioToggle}
            </View>
          </View>
        );
      case 9: // Frosted glass tile
        return (
          <View style={{ borderRadius: 16, overflow: "hidden" }}>
            <BlurView intensity={24} tint="dark" style={{}}>
              <View
                style={{
                  padding: 14,
                  backgroundColor: "rgba(16,22,36,0.65)",
                  borderWidth: 1,
                  borderColor: `${color}33`,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    backgroundColor: color,
                    opacity: 0.3,
                  }}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="cloud-outline"
                    size={18}
                    color={color}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    {Title}
                    {Subtitle}
                  </View>
                  {CheckboxToggle}
                </View>
              </View>
            </BlurView>
          </View>
        );
      case 10: // Compact pill row
        return (
          <View
            style={{
              borderRadius: 999,
              paddingVertical: 10,
              paddingHorizontal: 14,
              backgroundColor: "#0E1629",
              borderWidth: 1,
              borderColor: `${color}44`,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: color,
                  marginRight: 10,
                }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    color: "#DCE7FF",
                    fontSize: 13,
                    fontWeight: "800",
                    letterSpacing: 0.6,
                  }}
                >
                  {label}
                </Text>
                <Text style={{ color: "#93A3C7", fontSize: 11 }}>{desc}</Text>
              </View>
              {PillToggle}
            </View>
          </View>
        );
      default:
        return null;
    }
  })();

  return container;
});
*/
// function VariantRow({ title, variant }: { title: string; variant: number }) {
//   const m = TOOL_META.query; // Showcase using QUERY tool for consistency
//   return (
//     <View style={{ marginBottom: 12 }}>
//       <Text style={{ color: "#8EA2C8", fontSize: 12, marginBottom: 6 }}>
//         {title}
//       </Text>
//       <ToolCardVariant
//         label={m.title}
//         desc={m.desc}
//         color={m.color}
//         variant={variant}
//       />
//     </View>
//   );
// }

// Original PokemonScreen component
// export default function PokemonScreen() {
function PokemonScreen() {
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();

  // Auto-open React Query modal for testing - removed due to Event not available in React Native
  const [pokemonStack, setPokemonStack] = useState(() => [
    "pikachu",
    "charizard",
    "blastoise",
    "gengar",
    "dragonite",
    "mewtwo",
    "lucario",
    "garchomp",
    "greninja",
    "mimikyu",
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [currentPokemonType, setCurrentPokemonType] =
    useState<string>("electric");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Only keep essential animations for effects
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const cardGlowAnim = useRef(new Animated.Value(0)).current;

  // Bubble particles for background effect
  const bubbleAnims = useRef(
    Array(20)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 50),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(Math.random() * 0.6 + 0.3),
        wobble: new Animated.Value(0),
      }))
  ).current;

  useEffect(() => {
    // Floating animation for cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect - continuous smooth animation with holographic feel
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();

    // Card glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(cardGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate bubbles with simpler logic
    bubbleAnims.forEach((bubble, index) => {
      const duration = 6000 + Math.random() * 2000;
      const delay = index * 300;

      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(bubble.y, {
              toValue: -100,
              duration,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(bubble.opacity, {
                toValue: 0.3,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.opacity, {
                toValue: 0,
                duration: 1000,
                delay: duration - 2000,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(bubble.y, {
            toValue: height + 50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search with haptic feedback
  function handleSearch() {
    if (inputValue.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setPokemonStack([inputValue.trim().toLowerCase(), ...pokemonStack]);
      setCurrentIndex(0);
      setInputValue("");

      // Trigger success animation
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  // Get random Pokemon with animation feedback
  const getRandomPokemon = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const randomPokemon = getRandomPokemonNames(1)[0];
    setPokemonStack((prev) => [randomPokemon, ...prev]);
    setCurrentIndex(0);

    // Trigger dice roll animation
    Animated.sequence([
      Animated.timing(cardGlowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardGlowAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardGlowAnim]);

  // Refill stack when getting low
  useEffect(() => {
    if (pokemonStack.length - currentIndex < 5) {
      const newPokemon = getRandomPokemonNames(5);
      setPokemonStack((prev) => [...prev, ...newPokemon]);
    }
  }, [currentIndex, pokemonStack.length]);

  // Handle input change with autocomplete
  const handleInputChange = useCallback((text: string) => {
    setInputValue(text);

    if (text.length >= 1) {
      const results = searchPokemon(text);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, []);

  // Select a suggestion
  const selectSuggestion = useCallback(
    (pokemon: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setPokemonStack([pokemon, ...pokemonStack]);
      setCurrentIndex(0);
      setInputValue("");
      setShowSuggestions(false);
      setSuggestions([]);
    },
    [pokemonStack]
  );
  const userRole: UserRole = "admin";
  const environment: Environment = "local";
  const requiredEnvVars = createEnvVarConfig([
    // 🟢 GREEN - Valid variables
    envVar("EXPO_PUBLIC_API_URL").exists(), // ✓ Exists

    envVar("EXPO_PUBLIC_DEBUG_MODE")
      .withType("boolean")
      .withDescription("Enable debug logging")
      .build(), // ✓ Correct type

    envVar("EXPO_PUBLIC_MAX_RETRIES").withType("number").build(), // ✓ Correct type

    envVar("EXPO_PUBLIC_ENVIRONMENT").withValue("development").build(), // ✓ Correct value

    // 🟠 ORANGE - Wrong values (exists but incorrect)
    envVar("EXPO_PUBLIC_API_VERSION")
      .withValue("v2")
      .withDescription("API version (should be v2)")
      .build(), // ⚠ Wrong value

    envVar("EXPO_PUBLIC_REGION").withValue("us-east-1").build(), // ⚠ Wrong value

    // 🔴 RED - Wrong types (exists but wrong type)
    envVar("EXPO_PUBLIC_FEATURE_FLAGS")
      .withDescription("Feature flags configuration object")
      .withType("object")
      .build(), // ⚠ Wrong type

    envVar("EXPO_PUBLIC_PORT").withType("number").build(), // ⚠ Wrong type

    // 🔴 RED - Missing variables
    envVar("EXPO_PUBLIC_SENTRY_DSN").exists(), // ⚠ Missing

    envVar("EXPO_PUBLIC_ANALYTICS_KEY")
      .withDescription("Analytics service API key")
      .withType("string")
      .build(), // ⚠ Missing

    envVar("EXPO_PUBLIC_ENABLE_TELEMETRY").withType("boolean").build(), // ⚠ Missing
  ]);
  return (
    <View style={styles.container}>
      <RnBetterDevToolsBubble
        queryClient={queryClient}
        environment={environment}
        userRole={userRole}
        requiredEnvVars={requiredEnvVars}
      />
      {/* Premium Animated Background */}
      <LinearGradient
        colors={["#0A0E27", "#1a1f3a", "#2d1b69"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated Background Orbs */}
      <Animated.View
        style={[
          styles.backgroundOrb,
          styles.orb1,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [-10, 0],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(147,51,234,0.3)", "transparent"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.backgroundOrb,
          styles.orb2,
          {
            transform: [
              {
                translateX: floatAnim.interpolate({
                  inputRange: [-10, 0],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(59,130,246,0.3)", "transparent"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      {/* Dynamic colored bubbles based on Pokemon */}
      {bubbleAnims.map((bubble, index) => {
        const getBubbleColor = (type: string, idx: number) => {
          const baseColors = {
            fire: "239, 68, 68",
            water: "59, 130, 246",
            grass: "34, 197, 94",
            electric: "250, 204, 21",
            psychic: "236, 72, 153",
            ice: "165, 243, 252",
            dragon: "147, 51, 234",
            dark: "75, 85, 99",
            fairy: "244, 114, 182",
            normal: "203, 213, 225",
          };
          const rgb =
            baseColors[type as keyof typeof baseColors] || baseColors.normal;
          const opacity = 0.3 + (idx % 3) * 0.05;
          return `rgba(${rgb}, ${opacity})`;
        };

        const color = getBubbleColor(currentPokemonType, index);

        return (
          <Animated.View
            key={`bubble-${index}`}
            style={[
              styles.bubble,
              {
                transform: [
                  { translateX: Animated.add(bubble.x || 0, bubble.wobble) },
                  { translateY: bubble.y },
                  { scale: bubble.scale },
                ],
                opacity: bubble.opacity,
                left: (index * 9) % width,
                backgroundColor: color,
                borderColor: color.replace("0.3", "0.5"),
              },
            ]}
          />
        );
      })}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 25,
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        {/* === DevTools Filter Buttons Variations Showcase === */}

        {/* <ReactNativeShapesShowcase />
        <IconShowcase /> */}
        <StorageDiffTest />

        {/* Icon Variations Gallery */}
        {/* <IconVariationsGallery /> */}
        {/* <RandomShapeGenerator /> */}
        {/* <UniversalShapeEditor /> */}
        {/* <GearsIconDemo /> */}
        {/* <WifiIconDemo /> */}
        {/* <IconComparison /> */}
        {/* <GearIconComparison /> */}
        {/* <StorageIconShowcase /> */}
        {/* <SentryBugShowcase /> */}
        {/* <ReactQueryShowcase /> */}
        {/* <ReactQueryVariations /> */}
        {/* <ReactQueryExactShowcase /> */}
        {/* <ReactNativeShapesShowcase /> */}
        {/* <ReactLogoShapesShowcase /> */}
        {/* <HexagonShowcase /> */}
        {/* Premium Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [
                {
                  scale: floatAnim.interpolate({
                    inputRange: [-10, 0],
                    outputRange: [1.02, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,215,0,0.1)", "transparent"]}
            style={styles.headerGlow}
          />
          <View style={styles.titleContainer}>
            <View style={styles.titleBadge}>
              <LinearGradient
                colors={["#FFD700", "#FFA500", "#FF6347"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.titleGradient}
              >
                <Text style={styles.titleSmall}>ULTIMATE</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>POKÉDEX</Text>
            <View style={styles.titleAccent}>
              <Animated.View
                style={[
                  styles.pulsingDot,
                  {
                    opacity: cardGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: cardGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.subtitle}>Gotta Catch &apos;Em All!</Text>
        </Animated.View>

        {/* Premium Search Section */}
        <View style={styles.searchSection}>
          <Animated.View
            style={[
              styles.searchContainer,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [-10, 0],
                      outputRange: [-2, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Glowing border effect */}
            <Animated.View
              style={[
                styles.searchGlowBorder,
                {
                  opacity: shimmerAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 0.8, 0.3],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={["#FFD700", "#FF69B4", "#00CED1", "#FFD700"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glowGradient}
              />
            </Animated.View>

            <BlurView intensity={40} tint="dark" style={styles.searchBlur}>
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
                style={styles.searchGradientOverlay}
              >
                <View style={styles.inputWrapper}>
                  {/* Animated Search Icon */}
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: shimmerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <Ionicons
                      name="search-circle"
                      size={24}
                      color="rgba(255,215,0,0.7)"
                    />
                  </Animated.View>

                  <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder="Name or Number"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    onSubmitEditing={handleSearch}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />

                  {/* Premium Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={handleSearch}
                      activeOpacity={0.7}
                      style={styles.actionButton}
                    >
                      <LinearGradient
                        colors={["#4A90E2", "#357ABD"]}
                        style={styles.gradientButton}
                      >
                        <Ionicons name="search" size={18} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={getRandomPokemon}
                      activeOpacity={0.7}
                      style={styles.actionButton}
                    >
                      <Animated.View
                        style={{
                          transform: [
                            {
                              rotate: cardGlowAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "180deg"],
                              }),
                            },
                          ],
                        }}
                      >
                        <LinearGradient
                          colors={["#FFD700", "#FFA500"]}
                          style={styles.gradientButton}
                        >
                          <Ionicons name="dice" size={18} color="#FFFFFF" />
                        </LinearGradient>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <Animated.View style={styles.suggestionsContainer}>
                <BlurView
                  intensity={30}
                  tint="dark"
                  style={styles.suggestionsBlur}
                >
                  {suggestions.map((pokemon, index) => (
                    <TouchableOpacity
                      key={pokemon}
                      style={[
                        styles.suggestionItem,
                        index === suggestions.length - 1 &&
                          styles.lastSuggestion,
                      ]}
                      onPress={() => selectSuggestion(pokemon)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.suggestionContent}>
                        <Ionicons
                          name="sparkles"
                          size={14}
                          color="rgba(255,215,0,0.6)"
                        />
                        <Text style={styles.suggestionText}>
                          {pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="rgba(255,255,255,0.3)"
                      />
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {/* Pokemon Card Stack */}
        <View style={styles.cardStackContainer}>
          <View
            style={{ width: width - 60, height: 430, position: "relative" }}
          >
            {pokemonStack
              .slice(currentIndex, currentIndex + 3)
              .map((pokemonId, stackIndex) => {
                const actualIndex = currentIndex + stackIndex;
                return (
                  <PokemonCardSwipeable
                    key={`${pokemonId}-${actualIndex}`}
                    pokemonId={pokemonId}
                    index={stackIndex}
                    isActive={stackIndex === 0}
                    onSwipe={() => {
                      if (stackIndex === 0) {
                        setCurrentIndex((prev) => prev + 1);
                        // Add a new random Pokemon to the end of the stack
                        const newPokemon = getRandomPokemonNames(1);
                        setPokemonStack((prev) => [...prev, ...newPokemon]);
                      }
                    }}
                    onTypeChange={setCurrentPokemonType}
                    shimmerAnim={shimmerAnim}
                    floatAnim={floatAnim}
                    cardGlowAnim={cardGlowAnim}
                  />
                );
              })
              .reverse()}
          </View>
        </View>

        {/* Card Stack Indicator */}
        <View style={styles.stackIndicator}>
          {[0, 1, 2].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === 0 && styles.activeDot,
                i === 0 && {
                  transform: [
                    {
                      scale: cardGlowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 25,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  headerGlow: {
    position: "absolute",
    top: -20,
    left: -50,
    right: -50,
    height: 100,
    opacity: 0.3,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleBadge: {
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  titleGradient: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  titleSmall: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  titleAccent: {
    marginLeft: 10,
    position: "relative",
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,215,0,0.6)",
    fontStyle: "italic",
    letterSpacing: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: "900",
    color: "#FFD700",
    letterSpacing: 3,
    textShadowColor: "#FF6347",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 15,
  },
  searchSection: {
    marginHorizontal: 15,
    marginBottom: 20,
    zIndex: 9998,
  },
  searchContainer: {
    position: "relative",
    zIndex: 9999,
  },
  searchGlowBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 26,
  },
  searchGradientOverlay: {
    flex: 1,
    borderRadius: 24,
  },
  searchBlur: {
    height: 52,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(20,20,40,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stackIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cardStackContainer: {
    height: 460,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 0,
    zIndex: 1,
  },
  bubble: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  backgroundOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  orb1: {
    top: -100,
    left: -100,
  },
  orb2: {
    bottom: -100,
    right: -100,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 150,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    zIndex: 10000,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 100,
  },
  suggestionsBlur: {
    backgroundColor: "rgba(20,20,40,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
    borderRadius: 16,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  lastSuggestion: {
    borderBottomWidth: 0,
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
