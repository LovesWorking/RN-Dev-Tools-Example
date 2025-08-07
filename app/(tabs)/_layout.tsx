import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { PokemonTabBar } from "@/components/PokemonTabBar";
import { LinearGradient } from "expo-linear-gradient";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { create } from "zustand";

// Store for sharing Pokemon data between tabs
interface PokemonStore {
  currentPokemonType: string;
  setPokemonType: (type: string) => void;
}

export const pokemonStore = create<PokemonStore>((set) => ({
  currentPokemonType: "electric",
  setPokemonType: (type) => set({ currentPokemonType: type }),
}));

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[PokemonTheme.colors.darkBg, '#1a1f3a', '#0A0E27']}
        style={{ flex: 1 }}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' }, // Hide default tab bar
          }}
          tabBar={(props) => <PokemonTabBar {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Pokédex",
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
            }}
          />
          <Tabs.Screen
            name="storage"
            options={{
              title: "Storage",
            }}
          />
        </Tabs>
      </LinearGradient>
    </View>
  );
}