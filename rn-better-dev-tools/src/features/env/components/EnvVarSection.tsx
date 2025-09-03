import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { EnvVarInfo } from "../types";
import { CyberpunkEnvVarCard } from "./CyberpunkEnvVarCard";
import { SectionHeader } from "@/rn-better-dev-tools/src/shared/ui/components/SectionHeader";

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
        <SectionHeader>
          <SectionHeader.Title>{title}</SectionHeader.Title>
          <SectionHeader.Badge count={0} color="#00FFFF" />
        </SectionHeader>
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
        <SectionHeader>
          <SectionHeader.Title>{title}</SectionHeader.Title>
          <SectionHeader.Badge count={count} color="#00FFFF" />
        </SectionHeader>
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
