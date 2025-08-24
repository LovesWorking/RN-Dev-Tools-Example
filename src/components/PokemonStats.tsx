import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { getStatBarColor } from "../utils/pokemonTypeColors";

interface Stat {
  name: string;
  value: number;
}

interface PokemonStatsProps {
  stats: Stat[];
}

export function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <>
      <ThemedText style={styles.sectionTitle}>Base Stats</ThemedText>
      <ThemedView style={styles.container}>
        {stats.map((stat) => (
          <StatRow key={stat.name} stat={stat} />
        ))}
      </ThemedView>
    </>
  );
}

function StatRow({ stat }: { stat: Stat }) {
  const barWidth = Math.min(100, (stat.value / 255) * 100);
  const barColor = getStatBarColor(stat.value);

  return (
    <ThemedView style={styles.statRow}>
      <ThemedText style={styles.statName}>
        {stat.name.replace("-", " ")}
      </ThemedText>
      <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
      <ThemedView style={styles.statBarContainer}>
        <ThemedView
          style={[
            styles.statBar,
            { width: `${barWidth}%`, backgroundColor: barColor },
          ]}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 12,
    marginTop: 10,
  },
  container: {
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
});