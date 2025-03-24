import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import { usePokemon } from "../_hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { pokemonStore } from "./_layout";

export const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState("pikachu");
  const [inputValue, setInputValue] = useState("");
  const { data, error, isLoading } = usePokemon(pokemonName);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Track when we're intentionally loading a new Pokémon
  const [isChangingPokemon, setIsChangingPokemon] = useState(false);

  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsChangingPokemon(true);
      setPokemonName(inputValue.trim().toLowerCase());
    }
  };

  const getRandomPokemon = () => {
    setIsChangingPokemon(true);
    // Pokémon IDs range from 1 to approximately 1010 in the latest generations
    const randomId = Math.floor(Math.random() * 1010) + 1;
    setPokemonName(randomId.toString());
    setInputValue(""); // Clear the input field
  };

  // Reset loading state when data changes
  useEffect(() => {
    if (data && isChangingPokemon) {
      setIsChangingPokemon(false);
    }
  }, [data]);

  // Update shared store when Pokémon changes
  useEffect(() => {
    if (data?.types?.length) {
      pokemonStore.setPokemonType(data.types[0]);
    }
  }, [data]);

  // Get color based on Pokemon type
  const getTypeColor = (type: string) => {
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

  // Get header color based on Pokemon types
  const getHeaderColor = () => {
    if (!data?.types?.length) return { light: "#A1CEDC", dark: "#1D3D47" };
    const mainType = data.types[0];
    const color = getTypeColor(mainType);
    return {
      light: color,
      dark: isDark ? `${color}99` : color, // Add transparency for dark mode
    };
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={getHeaderColor()}
      headerImage={
        data?.image && !isLoading && !isChangingPokemon ? (
          <Image
            source={{ uri: data.image }}
            style={styles.pokemonHeaderImage}
            resizeMode="contain"
          />
        ) : (
          <ThemedView style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#ffffff" : "#000000"}
            />
            <ThemedText style={styles.loaderText}>
              {isChangingPokemon ? "Catching Pokémon..." : "Loading..."}
            </ThemedText>
          </ThemedView>
        )
      }
    >
      <ThemedView style={styles.container}>
        {/* Search and Random Buttons */}
        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Enter Pokémon name"
            placeholderTextColor="#888"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading || isChangingPokemon}
            opacity={isLoading || isChangingPokemon ? 0.7 : 1}
          >
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </ThemedView>

        {/* Random Button */}
        <TouchableOpacity
          style={[
            styles.randomButton,
            (isLoading || isChangingPokemon) && styles.disabledButton,
          ]}
          onPress={getRandomPokemon}
        >
          <Ionicons
            name="shuffle"
            size={22}
            color="#fff"
            style={styles.buttonIcon}
          />
          <ThemedText style={styles.buttonText}>
            {isChangingPokemon ? "Searching..." : "Random Pokémon"}
          </ThemedText>
        </TouchableOpacity>

        {/* Pokemon Content */}
        {isLoading || isChangingPokemon ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <ThemedText style={styles.loadingText}>
              {isChangingPokemon ? "Catching Pokémon..." : "Loading..."}
            </ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
            <ThemedText style={styles.errorText}>
              Pokémon not found! Try another name.
            </ThemedText>
          </ThemedView>
        ) : (
          data && (
            <ThemedView style={styles.pokemonContainer}>
              <ThemedText style={styles.pokemonId}>#{data.id}</ThemedText>
              <ThemedText style={styles.pokemonName}>{data.name}</ThemedText>

              {/* Types */}
              <ThemedView style={styles.typesContainer}>
                {data.types.map((type) => (
                  <ThemedView
                    key={type}
                    style={[
                      styles.typeTag,
                      { backgroundColor: getTypeColor(type) },
                    ]}
                  >
                    <ThemedText style={styles.typeText}>{type}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>

              {/* Basic Info */}
              <ThemedView style={styles.infoContainer}>
                <ThemedView style={styles.infoItem}>
                  <ThemedText style={styles.infoValue}>
                    {data.height} m
                  </ThemedText>
                  <ThemedText style={styles.infoLabel}>Height</ThemedText>
                </ThemedView>
                <ThemedView style={styles.infoItem}>
                  <ThemedText style={styles.infoValue}>
                    {data.weight} kg
                  </ThemedText>
                  <ThemedText style={styles.infoLabel}>Weight</ThemedText>
                </ThemedView>
              </ThemedView>

              {/* Stats */}
              <ThemedText style={styles.sectionTitle}>Base Stats</ThemedText>
              <ThemedView style={styles.statsContainer}>
                {data.stats.map((stat) => (
                  <ThemedView key={stat.name} style={styles.statRow}>
                    <ThemedText style={styles.statName}>
                      {stat.name.replace("-", " ")}
                    </ThemedText>
                    <ThemedText style={styles.statValue}>
                      {stat.value}
                    </ThemedText>
                    <ThemedView style={styles.statBarContainer}>
                      <ThemedView
                        style={[
                          styles.statBar,
                          {
                            width: `${Math.min(
                              100,
                              (stat.value / 255) * 100
                            )}%`,
                            backgroundColor:
                              stat.value > 90
                                ? "#78C850"
                                : stat.value > 50
                                ? "#6890F0"
                                : "#F08030",
                          },
                        ]}
                      />
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          )
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  pokemonHeaderImage: {
    height: 300,
    width: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
  container: {
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#3b82f6",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    height: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    height: 300,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  pokemonContainer: {
    width: "100%",
    alignItems: "center",
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
  typesContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  typeTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  infoItem: {
    alignItems: "center",
    width: "45%",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 12,
    marginTop: 10,
  },
  statsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  statName: {
    width: 100,
    fontSize: 14,
    textTransform: "capitalize",
  },
  statValue: {
    width: 40,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 10,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
  },
  randomButton: {
    backgroundColor: "#22c55e", // Green shade
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loaderContainer: {
    height: 300,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default HomeScreen;
