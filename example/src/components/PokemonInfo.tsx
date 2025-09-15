import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface PokemonInfoProps {
  height: number;
  weight: number;
}

export function PokemonInfo({ height, weight }: PokemonInfoProps) {
  return (
    <ThemedView style={styles.container}>
      <InfoItem value={`${height} m`} label="Height" />
      <InfoItem value={`${weight} kg`} label="Weight" />
    </ThemedView>
  );
}

function InfoItem({ value, label }: { value: string; label: string }) {
  return (
    <ThemedView style={styles.infoItem}>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
