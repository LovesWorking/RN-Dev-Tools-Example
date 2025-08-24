import { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { usePokemon } from "@/src/hooks/usePokemon";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { getTypeColor } from "@/src/utils/pokemonTypeColors";

const { width } = Dimensions.get("window");
const AnimatedReanimatedView = ReanimatedAnimated.View;

interface PokemonCardSwipeableProps {
  pokemonId: string;
  index: number;
  isActive: boolean;
  onSwipe: () => void;
  shimmerAnim: any;
  floatAnim: any;
  cardGlowAnim: any;
  onTypeChange?: (type: string) => void;
}

export function PokemonCardSwipeable({
  pokemonId,
  index,
  isActive,
  onSwipe,
  shimmerAnim,
  floatAnim,
  cardGlowAnim,
  onTypeChange,
}: PokemonCardSwipeableProps) {
  const { data, isLoading } = usePokemon(pokemonId);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(index === 0 ? 1 : 1 - index * 0.05);
  const gestureRotation = useSharedValue(0);
  const opacity = useSharedValue(index === 0 ? 1 : index < 3 ? 0.8 : 0);

  useEffect(() => {
    if (index === 0) {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
    } else if (index === 1) {
      scale.value = withSpring(0.95);
      translateY.value = withSpring(8);
      translateX.value = withSpring(8);
      opacity.value = withSpring(0.9);
    } else if (index === 2) {
      scale.value = withSpring(0.9);
      translateY.value = withSpring(16);
      translateX.value = withSpring(16);
      opacity.value = withSpring(0.8);
    } else {
      opacity.value = withSpring(0);
    }
  }, [index, scale, translateY, translateX, opacity]);

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => isActive,
      onPanResponderGrant: () => {
        // Stop any ongoing animations when starting a gesture
        if (isActive) {
          'worklet';
        }
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (!isActive) return;

        translateX.value = gestureState.dx;
        translateY.value = gestureState.dy / 4 + index * -10;

        gestureRotation.value = interpolate(
          gestureState.dx,
          [-width, 0, width],
          [-30, 0, 30]
        );

        opacity.value = interpolate(
          Math.abs(gestureState.dx),
          [0, width],
          [1, 0.3]
        );
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (!isActive) return;

        const SWIPE_THRESHOLD = width * 0.3;
        const VELOCITY_THRESHOLD = 0.5;

        const shouldSwipe =
          Math.abs(gestureState.dx) > SWIPE_THRESHOLD ||
          Math.abs(gestureState.vx) > VELOCITY_THRESHOLD;

        if (shouldSwipe) {
          const direction = gestureState.dx > 0 ? 1 : -1;

          translateX.value = withTiming(width * 1.5 * direction, {
            duration: 300,
          });
          translateY.value = withTiming(-100, { duration: 300 });
          gestureRotation.value = withTiming(direction * 45, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 }, () => {
            'worklet';
            // Call onSwipe after animation completes
          });

          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setTimeout(() => {
            onSwipe();
          }, 300);
        } else {
          // Reset to proper positions based on index
          if (index === 0) {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            gestureRotation.value = withSpring(0);
            opacity.value = withSpring(1);
          } else if (index === 1) {
            translateX.value = withSpring(8);
            translateY.value = withSpring(8);
            gestureRotation.value = withSpring(0);
            opacity.value = withSpring(0.9);
          } else if (index === 2) {
            translateX.value = withSpring(16);
            translateY.value = withSpring(16);
            gestureRotation.value = withSpring(0);
            opacity.value = withSpring(0.8);
          }
        }
      },
    }),
    [isActive, index, onSwipe]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${gestureRotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: 100 - index * 10,
    elevation: 20 - index * 2,
  }));

  const mainType = data?.types?.[0] || "normal";
  const gradientColors =
    PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] ||
    PokemonTheme.gradients.normal;

  useEffect(() => {
    if (isActive && data?.types?.[0] && onTypeChange) {
      onTypeChange(data.types[0]);
    }
  }, [isActive, data?.types, onTypeChange]);

  if (isLoading || !data) {
    return (
      <AnimatedReanimatedView style={[styles.pokemonCard, animatedStyle]}>
        <LinearGradient
          colors={PokemonTheme.gradients.dark}
          style={styles.cardGradient}
        >
          <BlurView intensity={20} tint="light" style={styles.cardContent}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </BlurView>
        </LinearGradient>
      </AnimatedReanimatedView>
    );
  }

  return (
    <AnimatedReanimatedView
      style={[styles.pokemonCard, animatedStyle]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: floatAnim }],
        }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <HolographicShimmer shimmerAnim={shimmerAnim} />
          <PrismaticLayer shimmerAnim={shimmerAnim} />

          <BlurView intensity={10} tint="light" style={styles.cardContent}>
            <CardFrame />
            <CardHeader data={data} />
            <ArtFrame mainType={mainType} data={data} cardGlowAnim={cardGlowAnim} />
            <TypeBadges types={data.types} />
            <AttackMoves mainType={mainType} data={data} />
            <BottomStats data={data} mainType={mainType} />
            <CardSetInfo data={data} />
            <Text style={styles.copyright}>©2024 Pokémon TCG</Text>
            {isActive && <SwipeHints shimmerAnim={shimmerAnim} />}
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </AnimatedReanimatedView>
  );
}

function HolographicShimmer({ shimmerAnim }: { shimmerAnim: any }) {
  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [
            {
              translateX: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-width * 1.5, width * 1.5],
              }),
            },
            { rotate: "25deg" },
            { scaleY: 3 },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[
          "transparent",
          "transparent",
          "rgba(255,182,193,0.15)",
          "rgba(255,218,185,0.2)",
          "rgba(255,255,224,0.25)",
          "rgba(144,238,144,0.2)",
          "rgba(173,216,230,0.25)",
          "rgba(221,160,221,0.2)",
          "rgba(255,182,193,0.15)",
          "transparent",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.1, 0.25, 0.35, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1]}
        style={styles.shimmerGradient}
      />
    </Animated.View>
  );
}

function PrismaticLayer({ shimmerAnim }: { shimmerAnim: any }) {
  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          transform: [
            {
              translateX: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-width * 1.2, width * 1.2],
              }),
            },
            { rotate: "-15deg" },
            { scaleY: 2.5 },
          ],
          opacity: shimmerAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.3, 0],
          }),
        },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,0,255,0.1)",
          "rgba(0,255,255,0.1)",
          "rgba(255,255,0,0.1)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shimmerGradient}
      />
    </Animated.View>
  );
}

function CardFrame() {
  return (
    <View style={styles.cardFrame}>
      <View style={styles.cardFrameInner} />
    </View>
  );
}

function CardHeader({ data }: { data: any }) {
  return (
    <View style={styles.cardHeader}>
      <Text style={styles.pokemonNameHeader}>
        {data.name.toUpperCase()}
      </Text>
      <View style={styles.hpContainer}>
        <Text style={styles.hpText}>HP</Text>
        <Text style={styles.hpValue}>
          {data.stats.find((s: any) => s.name === "hp")?.value || 100}
        </Text>
      </View>
    </View>
  );
}

function ArtFrame({ mainType, data, cardGlowAnim }: any) {
  return (
    <View style={styles.artFrame}>
      <LinearGradient
        colors={[
          `${getTypeColor(mainType)}22`,
          "transparent",
          `${getTypeColor(mainType)}11`,
        ]}
        style={styles.artBackground}
      />
      <View style={styles.imageContainer}>
        {data.image && (
          <Animated.Image
            source={{ uri: data.image }}
            style={[
              styles.pokemonImage,
              {
                transform: [
                  {
                    scale: cardGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.08],
                    }),
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />
        )}
        <View style={styles.sparkleContainer}>
          <View style={[styles.sparkle, { top: 5, left: 5 }]} />
          <View style={[styles.sparkle, { top: 20, right: 15 }]} />
          <View style={[styles.sparkle, { bottom: 15, left: 20 }]} />
          <View style={[styles.sparkle, { bottom: 5, right: 5 }]} />
        </View>
      </View>
      <Text style={styles.stageName}>Basic Pokémon</Text>
    </View>
  );
}

function TypeBadges({ types }: { types: string[] }) {
  return (
    <View style={styles.typesContainer}>
      {types.map((type: string) => (
        <LinearGradient
          key={type}
          colors={[getTypeColor(type), `${getTypeColor(type)}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.typeBadge}
        >
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </LinearGradient>
      ))}
    </View>
  );
}

function AttackMoves({ mainType, data }: any) {
  return (
    <View style={styles.movesContainer}>
      <View style={styles.moveRow}>
        <View style={styles.energyBadge}>
          <View
            style={[
              styles.energyIcon,
              { backgroundColor: getTypeColor(mainType) },
            ]}
          />
        </View>
        <Text style={styles.moveName}>Quick Attack</Text>
        <Text style={styles.moveDamage}>
          {data.stats.find((s: any) => s.name === "attack")?.value || 50}
        </Text>
      </View>
      <View style={styles.moveRow}>
        <View style={styles.energyBadge}>
          <View
            style={[
              styles.energyIcon,
              { backgroundColor: getTypeColor(mainType) },
            ]}
          />
          <View
            style={[
              styles.energyIcon,
              { backgroundColor: getTypeColor(mainType) },
            ]}
          />
        </View>
        <Text style={styles.moveName}>Special Attack</Text>
        <Text style={styles.moveDamage}>
          {(data.stats.find((s: any) => s.name === "attack")?.value || 50) * 2}
        </Text>
      </View>
    </View>
  );
}

function BottomStats({ data, mainType }: any) {
  return (
    <View style={styles.bottomStats}>
      <View style={styles.weaknessResistance}>
        <Text style={styles.statMiniLabel}>Weakness</Text>
        <View
          style={[
            styles.typeMini,
            {
              backgroundColor: getTypeColor(data.types[1] || mainType),
            },
          ]}
        />
      </View>
      <View style={styles.weaknessResistance}>
        <Text style={styles.statMiniLabel}>Retreat</Text>
        <View style={styles.retreatCost}>
          <Text style={styles.retreatText}>⚪⚪</Text>
        </View>
      </View>
    </View>
  );
}

function CardSetInfo({ data }: { data: any }) {
  return (
    <View style={styles.cardSetInfo}>
      <Text style={styles.cardSetText}>1st Edition</Text>
      <Text style={styles.raritySymbol}>★</Text>
      <Text style={styles.cardNumber}>{data.id}/151</Text>
    </View>
  );
}

function SwipeHints({ shimmerAnim }: { shimmerAnim: any }) {
  return (
    <>
      <Animated.View
        style={[
          styles.swipeHint,
          styles.swipeHintLeft,
          {
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.4, 0],
            }),
          },
        ]}
      >
        <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.5)" />
      </Animated.View>

      <Animated.View
        style={[
          styles.swipeHint,
          styles.swipeHintRight,
          {
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.4, 0],
            }),
          },
        ]}
      >
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  pokemonCard: {
    position: "absolute",
    width: width - 60,
    height: 430,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 25,
    padding: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  shimmer: {
    position: "absolute",
    top: -50,
    left: -200,
    right: -200,
    bottom: -50,
    width: 300,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    paddingBottom: 35,
    paddingHorizontal: 15,
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardFrame: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: 18,
    borderWidth: 6,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  cardFrameInner: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    marginTop: 3,
    marginBottom: 3,
    width: "85%",
    alignSelf: "center",
  },
  pokemonNameHeader: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  hpText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255,100,100,1)",
  },
  hpValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  artFrame: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    padding: 6,
    marginHorizontal: 0,
    marginTop: 3,
    marginBottom: 3,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  artBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  stageName: {
    fontSize: 9,
    color: "rgba(255,255,255,0.6)",
    marginTop: 5,
    fontStyle: "italic",
  },
  imageContainer: {
    width: 130,
    height: 130,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sparkle: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 3,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  pokemonImage: {
    width: 120,
    height: 120,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    paddingHorizontal: 0,
    alignSelf: "center",
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: 100,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  movesContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 0,
    marginBottom: 6,
    gap: 6,
    width: "85%",
    alignSelf: "center",
  },
  moveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  energyBadge: {
    flexDirection: "row",
    gap: 3,
  },
  energyIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  moveName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  moveDamage: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    minWidth: 35,
    textAlign: "right",
  },
  bottomStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 0,
    marginBottom: 8,
    marginTop: 3,
    width: "60%",
    alignSelf: "center",
  },
  weaknessResistance: {
    alignItems: "center",
  },
  statMiniLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 3,
  },
  typeMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  retreatCost: {
    flexDirection: "row",
  },
  retreatText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
  },
  cardSetInfo: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSetText: {
    color: "rgba(255,215,0,0.6)",
    fontSize: 8,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  raritySymbol: {
    fontSize: 12,
    color: "rgba(255,215,0,0.8)",
  },
  cardNumber: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 8,
    fontWeight: "600",
  },
  copyright: {
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    fontSize: 6,
    color: "rgba(255,255,255,0.3)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
  },
  swipeHint: {
    position: "absolute",
    top: "45%",
    marginTop: -10,
    zIndex: 20,
  },
  swipeHintLeft: {
    left: 10,
  },
  swipeHintRight: {
    right: 10,
  },
});