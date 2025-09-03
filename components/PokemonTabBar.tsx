import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { PokemonTheme } from "../constants/PokemonTheme";

const { width } = Dimensions.get("window");

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const tabIcons: Record<string, any> = {
  index: { name: "flash", gradient: PokemonTheme.gradients.electric },
  explore: { name: "compass", gradient: PokemonTheme.gradients.water },
  storage: { name: "cube", gradient: PokemonTheme.gradients.psychic },
};

export function PokemonTabBar({ state, descriptors, navigation }: TabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * (width / state.routes.length),
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  const handlePress = (route: any, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Bounce animation
    Animated.sequence([
      Animated.spring(scaleAnims[index], {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <LinearGradient
          colors={["rgba(10, 14, 39, 0.7)", "rgba(10, 14, 39, 0.9)"]}
          style={styles.gradientBg}
        />

        {/* Animated Pokeball indicator */}
        <Animated.View
          style={[
            styles.pokeball,
            {
              transform: [{ translateX }],
              width: width / state.routes.length,
            },
          ]}
        >
          <LinearGradient
            colors={PokemonTheme.gradients.aurora}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pokeballGradient}
          />
        </Animated.View>

        <View style={styles.tabContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const icon = tabIcons[route.name] || {
              name: "help",
              gradient: PokemonTheme.gradients.dark,
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => handlePress(route, index)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.iconContainer,
                    { transform: [{ scale: scaleAnims[index] }] },
                  ]}
                >
                  {isFocused ? (
                    <LinearGradient
                      colors={icon.gradient}
                      style={styles.iconGradient}
                    >
                      <Ionicons name={icon.name} size={28} color="#FFFFFF" />
                    </LinearGradient>
                  ) : (
                    <Ionicons
                      name={icon.name}
                      size={24}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  )}
                </Animated.View>

                <Text style={[styles.label, isFocused && styles.labelActive]}>
                  {options.title || route.name}
                </Text>

                {isFocused && <View style={styles.glowDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "transparent",
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  tabContainer: {
    flexDirection: "row",
    flex: 1,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    ...PokemonTheme.shadows.neon("#FFD700"),
  },
  label: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  labelActive: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  pokeball: {
    position: "absolute",
    top: 15,
    height: 4,
    zIndex: -1,
  },
  pokeballGradient: {
    flex: 1,
    borderRadius: 2,
  },
  glowDot: {
    position: "absolute",
    bottom: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFD700",
    ...PokemonTheme.shadows.neon("#FFD700"),
  },
});
