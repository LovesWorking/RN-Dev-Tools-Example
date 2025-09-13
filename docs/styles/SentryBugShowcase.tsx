import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SentryBugIcon } from "@/rn-better-dev-tools/icons/SentryBugIcon";
// Color presets
const BugColors = {
  red: "#FF3366",
  purple: "#9945FF",
  orange: "#FF8800",
  pink: "#FF45FF",
  cyan: "#00D4FF",
  green: "#00FF88",
};

// Demo Component
export const SentryBugShowcase: React.FC = () => {
  const variants = ["circuit", "matrix", "glitch", "nodes", "grid"] as const;
  const colors = Object.keys(BugColors) as (keyof typeof BugColors)[];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SENTRY BUG ICONS</Text>
      <Text style={styles.subtitle}>Cyberpunk Bug Variations</Text>

      {/* Hero Showcase - All Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ ALL VARIANTS</Text>
        <View style={styles.heroGrid}>
          {variants.map((variant) => (
            <View key={variant} style={styles.iconBox}>
              <View style={styles.darkBg}>
                <SentryBugIcon
                  size={60}
                  variant={variant}
                  color={BugColors.red}
                  glowColor={BugColors.red}
                />
              </View>
              <Text style={styles.variantName}>{variant?.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Color Spectrum */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌈 COLOR SPECTRUM - CIRCUIT</Text>
        <View style={styles.colorGrid}>
          {colors.map((colorKey) => (
            <View key={colorKey} style={styles.colorBox}>
              <View style={[styles.darkBg, styles.colorBgBox]}>
                <SentryBugIcon
                  size={50}
                  variant="circuit"
                  color={BugColors[colorKey]}
                  glowColor={BugColors[colorKey]}
                />
              </View>
              <Text style={styles.colorName}>{colorKey.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Variant x Color Matrix */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 VARIANT × COLOR MATRIX</Text>
        {variants.map((variant) => (
          <View key={variant} style={styles.variantRow}>
            <Text style={styles.variantLabel}>{variant?.toUpperCase()}</Text>
            <View style={styles.variantColors}>
              {["red", "purple", "cyan", "orange"].map((color) => (
                <View key={color} style={[styles.darkBg, styles.miniBox]}>
                  <SentryBugIcon
                    size={32}
                    variant={variant}
                    color={BugColors[color as keyof typeof BugColors]}
                    glowColor={BugColors[color as keyof typeof BugColors]}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "monospace",
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#888",
    marginBottom: 20,
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  iconBox: {
    width: "30%",
    alignItems: "center",
  },
  darkBg: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 90,
  },
  variantName: {
    color: "#666",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "monospace",
    textAlign: "center",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorBox: {
    width: "30%",
    alignItems: "center",
    marginBottom: 10,
  },
  colorBgBox: {
    width: "100%",
    aspectRatio: 1,
  },
  colorName: {
    color: "#555",
    fontSize: 10,
    marginTop: 5,
    fontFamily: "monospace",
  },
  variantRow: {
    marginBottom: 20,
  },
  variantLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  variantColors: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  miniBox: {
    padding: 10,
    minWidth: 52,
    minHeight: 52,
  },
});

export default SentryBugShowcase;
