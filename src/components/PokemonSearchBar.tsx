import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { PokemonTheme } from "@/constants/PokemonTheme";

interface PokemonSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onRandom: () => void;
  isLoading: boolean;
}

export function PokemonSearchBar({
  value,
  onChangeText,
  onSearch,
  onRandom,
  isLoading,
}: PokemonSearchBarProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSearch();
  };

  const handleRandomPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onRandom();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: bounceAnim }],
        },
      ]}
    >
      {/* Search Input Container */}
      <View style={styles.searchContainer}>
        <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
            style={styles.gradientOverlay}
          />

          <View style={styles.inputWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="rgba(255, 255, 255, 0.5)"
            />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              placeholder="Search Pokémon..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              onSubmitEditing={handleSearchPress}
              returnKeyType="search"
            />

            {/* Search Button */}
            <TouchableOpacity
              onPress={handleSearchPress}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={PokemonTheme.gradients.electric}
                style={styles.searchButton}
              >
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Animated Glow Effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </View>

      {/* Random Pokemon Button */}
      <TouchableOpacity
        onPress={handleRandomPress}
        disabled={isLoading}
        activeOpacity={0.8}
        style={styles.randomButtonWrapper}
      >
        <LinearGradient
          colors={PokemonTheme.gradients.rainbow}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.randomButton}
        >
          <View style={styles.randomContent}>
            <Ionicons name="shuffle" size={24} color="#FFFFFF" />
            <View style={styles.randomTextContainer}>
              <Text style={styles.sparkle}>✨</Text>
              <View style={styles.randomText}>
                <Text style={styles.randomLabel}>SURPRISE ME!</Text>
              </View>
              <Text style={styles.sparkle}>✨</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    height: 60,
    marginBottom: 15,
    position: "relative",
  },
  blurContainer: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...PokemonTheme.shadows.neon("#FFD700"),
  },
  glowEffect: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 40,
    backgroundColor: "#FFD700",
    ...PokemonTheme.shadows.neon("#FFD700"),
  },
  randomButtonWrapper: {
    height: 55,
  },
  randomButton: {
    flex: 1,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
    ...PokemonTheme.shadows.card,
  },
  randomContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  randomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  randomText: {
    marginHorizontal: 8,
  },
  randomLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  sparkle: {
    fontSize: 16,
  },
});
