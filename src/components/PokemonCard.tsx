import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { getTypeColor } from "../utils/pokemonTypeColors";

const { width } = Dimensions.get("window");

interface PokemonCardProps {
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

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainType = pokemon.types[0];
  const gradientColors =
    PokemonTheme.gradients[mainType as keyof typeof PokemonTheme.gradients] ||
    PokemonTheme.gradients.normal;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            {
              rotateY: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["90deg", "0deg"],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Animated glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
            },
          ]}
        />

        {/* Glass overlay */}
        <BlurView intensity={20} tint="light" style={styles.glassOverlay}>
          <View style={styles.cardContent}>
            {/* Pokemon Number */}
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>
                #{String(pokemon.id).padStart(3, "0")}
              </Text>
            </View>

            {/* Pokemon Image with holographic effect */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: pokemon.image }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
                style={styles.holographicOverlay}
              />
            </View>

            {/* Pokemon Name */}
            <Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text>

            {/* Type Badges */}
            <View style={styles.typesContainer}>
              {pokemon.types.map((type) => (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(type) },
                  ]}
                >
                  <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            {/* Stats Preview */}
            <View style={styles.statsPreview}>
              {pokemon.stats.slice(0, 3).map((stat) => (
                <View key={stat.name} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>
                    {stat.name.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Decorative elements */}
            <View style={styles.cornerDecoration} />
            <View
              style={[styles.cornerDecoration, styles.cornerDecorationBottom]}
            />
          </View>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 480,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    ...PokemonTheme.shadows.card,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 30,
    padding: 2,
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
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
    position: "relative",
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
    opacity: 0.4,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
  statsPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    padding: 15,
  },
  statItem: {
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
  cornerDecoration: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderTopLeftRadius: 10,
  },
  cornerDecorationBottom: {
    top: undefined,
    left: undefined,
    bottom: 10,
    right: 10,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 10,
  },
  glowEffect: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    ...PokemonTheme.shadows.neon("#FFFFFF"),
  },
});
