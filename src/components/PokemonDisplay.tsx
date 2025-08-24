import { StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { PokemonTypes } from "./PokemonTypes";
import { PokemonInfo } from "./PokemonInfo";
import { PokemonStats } from "./PokemonStats";

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

interface PokemonDisplayProps {
  data: PokemonData | null;
  isLoading: boolean;
  isChanging: boolean;
  error: any;
}

export function PokemonDisplay({
  data,
  isLoading,
  isChanging,
  error,
}: PokemonDisplayProps) {
  if (isLoading || isChanging) {
    return <LoadingState isChanging={isChanging} />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!data) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.pokemonId}>#{data.id}</ThemedText>
      <ThemedText style={styles.pokemonName}>{data.name}</ThemedText>
      
      <PokemonTypes types={data.types} />
      <PokemonInfo height={data.height} weight={data.weight} />
      <PokemonStats stats={data.stats} />
    </ThemedView>
  );
}

function LoadingState({ isChanging }: { isChanging: boolean }) {
  return (
    <ThemedView style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <ThemedText style={styles.statusText}>
        {isChanging ? "Catching Pokémon..." : "Loading..."}
      </ThemedText>
    </ThemedView>
  );
}

function ErrorState() {
  return (
    <ThemedView style={styles.centerContainer}>
      <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
      <ThemedText style={styles.statusText}>
        Pokémon not found! Try another name.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    height: 300,
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  pokemonId: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  pokemonName: {
    marginTop: 10,
    paddingTop: 10,
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 12,
  },
});