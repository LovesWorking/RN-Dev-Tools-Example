import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { EnvLaptopIcon } from "@/rn-better-dev-tools/icons/EnvLaptopIcon";
import { WifiCircuitIcon } from "@/rn-better-dev-tools/icons/WifiCircuitIcon";
import { StorageStackIcon } from "@/rn-better-dev-tools/icons/StorageStackIcon";
import { SentryBugIcon } from "@/rn-better-dev-tools/icons/SentryBugIcon";
import { ReactQueryIcon } from "@/rn-better-dev-tools/icons/ReactQueryIcon";

const CyberpunkIconGallery: React.FC = () => {
  const iconSize = 60;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CYBERPUNK ICON GALLERY</Text>
      <Text style={styles.subtitle}>React Native Dev Tools Collection</Text>

      <View style={styles.grid}>
        {/* ENV Laptop Icons */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="matrix" />
          </View>
          <Text style={styles.iconLabel}>ENV Laptop</Text>
          <Text style={styles.iconVariant}>Quantum</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="circuit" />
          </View>
          <Text style={styles.iconLabel}>ENV Laptop</Text>
          <Text style={styles.iconVariant}>Cosmic</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="glitch" />
          </View>
          <Text style={styles.iconLabel}>ENV Laptop</Text>
          <Text style={styles.iconVariant}>Stellar</Text>
        </View>

        {/* WiFi Icons */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <WifiCircuitIcon size={iconSize} variant="nodes" />
          </View>
          <Text style={styles.iconLabel}>WiFi</Text>
          <Text style={styles.iconVariant}>Nodes</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <WifiCircuitIcon size={iconSize} variant="grid" />
          </View>
          <Text style={styles.iconLabel}>WiFi</Text>
          <Text style={styles.iconVariant}>Grid</Text>
        </View>

        {/* Storage Icon */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <StorageStackIcon size={iconSize} />
          </View>
          <Text style={styles.iconLabel}>Storage</Text>
          <Text style={styles.iconVariant}>Stack</Text>
        </View>

        {/* Sentry Bug Icon */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <SentryBugIcon size={iconSize} />
          </View>
          <Text style={styles.iconLabel}>Sentry</Text>
          <Text style={styles.iconVariant}>Bug</Text>
        </View>

        {/* React Query Icon */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <ReactQueryIcon size={iconSize} />
          </View>
          <Text style={styles.iconLabel}>React Query</Text>
          <Text style={styles.iconVariant}>Default</Text>
        </View>
      </View>

      {/* Color Variations Section */}
      <Text style={styles.sectionTitle}>COLOR VARIATIONS</Text>
      
      <View style={styles.colorGrid}>
        {/* ENV with different colors */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="matrix" color="cyan" />
          </View>
          <Text style={styles.iconLabel}>ENV</Text>
          <Text style={styles.iconVariant}>Cyan</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="matrix" color="purple" />
          </View>
          <Text style={styles.iconLabel}>ENV</Text>
          <Text style={styles.iconVariant}>Purple</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={iconSize} variant="matrix" color="green" />
          </View>
          <Text style={styles.iconLabel}>ENV</Text>
          <Text style={styles.iconVariant}>Green</Text>
        </View>

        {/* WiFi with different colors */}
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <WifiCircuitIcon size={iconSize} variant="nodes" color="blue" />
          </View>
          <Text style={styles.iconLabel}>WiFi</Text>
          <Text style={styles.iconVariant}>Blue</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <WifiCircuitIcon size={iconSize} variant="nodes" color="orange" />
          </View>
          <Text style={styles.iconLabel}>WiFi</Text>
          <Text style={styles.iconVariant}>Orange</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <WifiCircuitIcon size={iconSize} variant="nodes" color="pink" />
          </View>
          <Text style={styles.iconLabel}>WiFi</Text>
          <Text style={styles.iconVariant}>Pink</Text>
        </View>
      </View>

      {/* Size Variations */}
      <Text style={styles.sectionTitle}>SIZE VARIATIONS</Text>
      
      <View style={styles.sizeGrid}>
        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={30} variant="matrix" />
          </View>
          <Text style={styles.iconLabel}>Small</Text>
          <Text style={styles.iconVariant}>30px</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={45} variant="matrix" />
          </View>
          <Text style={styles.iconLabel}>Medium</Text>
          <Text style={styles.iconVariant}>45px</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={60} variant="matrix" />
          </View>
          <Text style={styles.iconLabel}>Large</Text>
          <Text style={styles.iconVariant}>60px</Text>
        </View>

        <View style={styles.iconCard}>
          <View style={styles.iconContainer}>
            <EnvLaptopIcon size={80} variant="matrix" />
          </View>
          <Text style={styles.iconLabel}>XL</Text>
          <Text style={styles.iconVariant}>80px</Text>
        </View>
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
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 2,
    fontFamily: "monospace",
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#00ffff",
    marginTop: 30,
    marginBottom: 20,
    letterSpacing: 1.5,
    fontFamily: "monospace",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
    marginBottom: 30,
  },
  iconCard: {
    width: "31%",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.2)",
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 10,
    fontFamily: "monospace",
    fontWeight: "600",
    textAlign: "center",
  },
  iconVariant: {
    color: "#00ffff",
    fontSize: 10,
    marginTop: 4,
    fontFamily: "monospace",
    textAlign: "center",
    opacity: 0.8,
  },
});

export default CyberpunkIconGallery;