import { Tabs } from "expo-router";
import React from "react";
import { Platform, Animated, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Custom tab bar background that adapts to Pokémon colors
const DynamicTabBarBackground = ({ color }: { color: string }) => {
  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%",
        backgroundColor: color,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    />
  );
};

// Create a store to share Pokémon data across components
// Add this in a new file: store/pokemonStore.ts
// For now we'll define it here so you can copy it to the right place
const createPokemonStore = () => {
  let listeners: (() => void)[] = [];
  let currentPokemonType: string | null = null;

  return {
    setPokemonType: (type: string | null) => {
      currentPokemonType = type;
      listeners.forEach((listener) => listener());
    },
    getPokemonType: () => currentPokemonType,
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
};

export const pokemonStore = createPokemonStore();
export const usePokemonStore = () => {
  const [pokemonType, setPokemonType] = React.useState(
    pokemonStore.getPokemonType()
  );

  React.useEffect(() => {
    return pokemonStore.subscribe(() => {
      setPokemonType(pokemonStore.getPokemonType());
    });
  }, []);

  return pokemonType;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const pokemonType = usePokemonStore();

  // Get color based on Pokemon type
  const getTypeColor = (type: string | null) => {
    if (!type) return isDark ? "#1D3D47" : "#A1CEDC";

    const typeColors: Record<string, string> = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return typeColors[type] || "#68A090";
  };

  // Calculate if text should be black or white based on background brightness
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate brightness (YIQ equation)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white based on brightness
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  // Get the colors based on current Pokémon type
  const tabBarColor = getTypeColor(pokemonType);
  const iconColor = getContrastColor(tabBarColor);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: iconColor,
        tabBarInactiveTintColor: `${iconColor}99`,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <DynamicTabBarBackground color={tabBarColor} />,
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          height: 60,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="pokeball" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
