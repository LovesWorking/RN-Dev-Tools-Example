import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface SearchControlsProps {
  inputValue: string;
  onInputChange: (text: string) => void;
  onSearch: () => void;
  onRandom: () => void;
  isDisabled: boolean;
  isSearching: boolean;
}

export function SearchControls({
  inputValue,
  onInputChange,
  onSearch,
  onRandom,
  isDisabled,
  isSearching,
}: SearchControlsProps) {
  return (
    <>
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onInputChange}
          value={inputValue}
          placeholder="Enter Pokémon name"
          placeholderTextColor="#888"
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity
          style={[styles.searchButton, isDisabled && styles.disabled]}
          onPress={onSearch}
          disabled={isDisabled}
        >
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </ThemedView>

      <TouchableOpacity
        style={[styles.randomButton, isDisabled && styles.disabled]}
        onPress={onRandom}
        disabled={isDisabled}
      >
        <Ionicons name="shuffle" size={22} color="#fff" style={styles.buttonIcon} />
        <ThemedText style={styles.buttonText}>
          {isSearching ? "Searching..." : "Random Pokémon"}
        </ThemedText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
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
  randomButton: {
    backgroundColor: "#22c55e",
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
  disabled: {
    opacity: 0.7,
  },
});