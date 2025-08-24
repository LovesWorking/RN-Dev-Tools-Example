import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { getTypeColor } from "@/src/utils/pokemonTypeColors";

const { width } = Dimensions.get("window");

interface FloatingPokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    image: string;
    height: number;
    weight: number;
    stats: { name: string; value: number }[];
  };
}

export function FloatingPokemonCard({ pokemon }: FloatingPokemonCardProps) {
  // Multiple animation values for complex effects
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const orbAnimations = useRef(
    Array(6)
      .fill(0)
      .map(() => ({
        rotate: new Animated.Value(0),
        scale: new Animated.Value(1),
      })),
  ).current;

  useEffect(() => {
    // Entry animation with bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 30,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // 3D rotation animation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rotateX, {
            toValue: 0.05,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateX, {
            toValue: -0.05,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateY, {
            toValue: 0.1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateY, {
            toValue: -0.1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();

    // Orbiting elements
    orbAnimations.forEach((orb, index) => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(orb.rotate, {
            toValue: 1,
            duration: 10000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(orb.scale, {
              toValue: 1.5,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(orb.scale, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainType = pokemon.types[0];
  const gradientColors =
    PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] ||
    PokemonTheme.gradients.normal;

  return (
    <View style={styles.container}>
      {/* Orbiting particles */}
      {orbAnimations.map((orb, index) => (
        <Animated.View
          key={index}
          style={[
            styles.orbitingParticle,
            {
              transform: [
                {
                  rotate: orb.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                { scale: orb.scale },
              ],
              left: width / 2 - 100 + Math.cos((index * Math.PI) / 3) * 150,
              top: 200 + Math.sin((index * Math.PI) / 3) * 150,
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.particleGradient}
          />
        </Animated.View>
      ))}

      <Animated.View
        style={[
          styles.cardWrapper,
          {
            transform: [
              { translateY: floatAnim },
              { scale: scaleAnim },
              {
                rotateX: rotateX.interpolate({
                  inputRange: [-0.05, 0.05],
                  outputRange: ["-3deg", "3deg"],
                }),
              },
              {
                rotateY: rotateY.interpolate({
                  inputRange: [-0.1, 0.1],
                  outputRange: ["-5deg", "5deg"],
                }),
              },
              { perspective: 1000 },
            ],
          },
        ]}
      >
        {/* Multiple glow layers */}
        <Animated.View
          style={[
            styles.glowLayer1,
            {
              opacity: glowAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowLayer2,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.5, 0.8],
              }),
            },
          ]}
        />

        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Animated shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width, width],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>

          <BlurView intensity={20} tint="light" style={styles.glassOverlay}>
            <View style={styles.cardContent}>
              {/* Holographic number badge */}
              <View style={styles.numberBadge}>
                <LinearGradient
                  colors={PokemonTheme.gradients.aurora}
                  style={styles.numberGradient}
                >
                  <Text style={styles.numberText}>
                    #{String(pokemon.id).padStart(3, "0")}
                  </Text>
                </LinearGradient>
              </View>

              {/* Pokemon Image with effects */}
              <View style={styles.imageContainer}>
                <Animated.Image
                  source={{ uri: pokemon.image }}
                  style={[
                    styles.pokemonImage,
                    {
                      transform: [
                        {
                          scale: glowAnim.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [1, 1.1],
                          }),
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
                {/* Holographic overlay */}
                <Animated.View
                  style={[
                    styles.holographicOverlay,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 0.6, 0],
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0.5)",
                      "transparent",
                    ]}
                    style={StyleSheet.absoluteFillObject}
                  />
                </Animated.View>
              </View>

              {/* Animated name with rainbow effect */}
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                }}
              >
                <Text style={styles.pokemonName}>
                  {pokemon.name.toUpperCase()}
                </Text>
              </Animated.View>

              {/* Animated type badges */}
              <View style={styles.typesContainer}>
                {pokemon.types.map((type, index) => (
                  <Animated.View
                    key={type}
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeColor(type) },
                      {
                        transform: [
                          {
                            scale: glowAnim.interpolate({
                              inputRange: [0.3, 1],
                              outputRange: [1, 1.1],
                              extrapolate: "clamp",
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                  </Animated.View>
                ))}
              </View>

              {/* Animated stats */}
              <View style={styles.statsContainer}>
                {pokemon.stats.slice(0, 3).map((stat, index) => (
                  <Animated.View
                    key={stat.name}
                    style={[
                      styles.statItem,
                      {
                        transform: [
                          {
                            translateY: floatAnim.interpolate({
                              inputRange: [-20, 0],
                              outputRange: [index * -2, index * 2],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(255,255,255,0.1)",
                        "rgba(255,255,255,0.05)",
                      ]}
                      style={styles.statGradient}
                    >
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>
                        {stat.name.slice(0, 3).toUpperCase()}
                      </Text>
                    </LinearGradient>
                  </Animated.View>
                ))}
              </View>

              {/* Energy lines */}
              <View style={styles.energyLineTop} />
              <View style={styles.energyLineBottom} />
            </View>
          </BlurView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 520,
    alignItems: "center",
    marginVertical: 20,
  },
  cardWrapper: {
    width: width - 40,
    height: 480,
    borderRadius: 30,
  },
  glowLayer1: {
    position: "absolute",
    top: -30,
    left: -30,
    right: -30,
    bottom: -30,
    borderRadius: 50,
    backgroundColor: "#FFD700",
    ...PokemonTheme.shadows.neon("#FFD700"),
  },
  glowLayer2: {
    position: "absolute",
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 40,
    backgroundColor: "#FF00FF",
    ...PokemonTheme.shadows.neon("#FF00FF"),
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 30,
    padding: 2,
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
  },
  glassOverlay: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  numberBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  numberGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  imageContainer: {
    width: 220,
    height: 220,
    marginTop: 30,
    marginBottom: 20,
  },
  pokemonImage: {
    width: "100%",
    height: "100%",
  },
  holographicOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 15,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  statItem: {
    borderRadius: 15,
    overflow: "hidden",
  },
  statGradient: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  energyLineTop: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1,
  },
  energyLineBottom: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 1,
  },
  orbitingParticle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
