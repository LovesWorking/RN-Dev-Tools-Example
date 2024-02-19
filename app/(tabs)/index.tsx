import React, { useState } from "react";
import { StyleSheet, TextInput, Button, Image } from "react-native";
import { View, Text } from "@/components/Themed";
import { useQuery } from "@tanstack/react-query";
import { usePokemon } from "../_hooks/usePokemon ";

export default function TabOneScreen() {
  const [pokemonName, setPokemonName] = useState("pikachu");
  const [inputValue, setInputValue] = useState("");

  const { data, error, isLoading } = usePokemon(pokemonName);

  const handleSearch = () => {
    setPokemonName(inputValue.trim().toLowerCase());
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder="Enter Pokémon name"
      />
      <Button title="Find" onPress={handleSearch} />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>An error occurred</Text>
      ) : (
        <>
          {data?.sprites?.front_default && (
            <Image
              source={{ uri: data.sprites.front_default }}
              style={styles.image}
            />
          )}
          <Text style={styles.title}>Name: {data?.name}</Text>
          <Text>Height: {data?.height}</Text>
          <Text>Weight: {data?.weight}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
