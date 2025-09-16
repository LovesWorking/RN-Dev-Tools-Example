import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { getTypeColor } from "../utils/pokemonTypeColors";

interface PokemonTypesProps {
  types: string[];
}

export function PokemonTypes({ types }: PokemonTypesProps) {
  return (
    <ThemedView style={styles.container}>
      {types.map((type) => (
        <ThemedView
          key={type}
          style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
        >
          <ThemedText style={styles.typeText}>{type}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
