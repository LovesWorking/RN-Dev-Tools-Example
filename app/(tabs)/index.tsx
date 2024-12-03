import { Image, StyleSheet, Button, TextInput } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { usePokemon } from "../_hooks/usePokemon ";
export default function HomeScreen() {
  const [pokemonName, setPokemonName] = useState("pikachu");
  const [inputValue, setInputValue] = useState("");
  const { data, error, isLoading } = usePokemon(pokemonName);
  const handleSearch = () => {
    setPokemonName(inputValue.trim().toLowerCase());
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder="Enter Pokémon name"
        />
        <Button title="Find" onPress={handleSearch} />

        {isLoading ? (
          <ThemedText>Loading...</ThemedText>
        ) : error ? (
          <ThemedText>An error occurred</ThemedText>
        ) : (
          <>
            {data?.sprites?.front_default && (
              <Image
                source={{ uri: data.sprites.front_default }}
                style={styles.image}
              />
            )}
            <ThemedText style={styles.title}>Name: {data?.name}</ThemedText>
            <ThemedText>Height: {data?.height}</ThemedText>
            <ThemedText>Weight: {data?.weight}</ThemedText>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
