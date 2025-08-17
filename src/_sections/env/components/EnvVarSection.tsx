import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { EnvVarInfo } from "../types";
import { CyberpunkEnvVarCard } from "./CyberpunkEnvVarCard";

interface EnvVarSectionProps {
  title: string;
  count: number;
  vars: EnvVarInfo[];
  emptyMessage: string;
}

export function EnvVarSection({
  title,
  count,
  vars,
  emptyMessage,
}: EnvVarSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = useCallback((key: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  if (vars.length === 0 && title === "Required Variables") {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>0</Text>
        </View>
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  if (vars.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      {title !== "" && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{count}</Text>
        </View>
      )}
      <View style={styles.sectionContent}>
        {vars.map((envVar, index) => (
          <CyberpunkEnvVarCard
            key={envVar.key}
            envVar={envVar}
            isExpanded={expandedCards.has(envVar.key)}
            onToggle={() => toggleCardExpansion(envVar.key)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 255, 0.15)",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#00FFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    opacity: 0.95,
  },
  sectionCount: {
    color: "#00FFFF",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(0, 255, 255, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.25)",
    fontFamily: "monospace",
  },
  sectionContent: {
    gap: 8,
  },
  emptySection: {
    padding: 20,
    backgroundColor: "rgba(0, 255, 255, 0.02)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.1)",
    alignItems: "center",
  },
  emptySectionText: {
    color: "#00FFFF",
    fontSize: 11,
    textAlign: "center",
    fontFamily: "monospace",
    opacity: 0.6,
    letterSpacing: 0.5,
  },
});
