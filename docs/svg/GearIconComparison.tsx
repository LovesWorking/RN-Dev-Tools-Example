import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

// Game UI Color Palette
const gameUIColors = {
  background: "#f8f9fa",
  primary: "#059669",
  secondary: "#0891b2",
  muted: "#718096",
};

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Version 1: Star Burst - 6 spokes (from original v3)
const GearV1 = ({ size = 48, color = "#059669" }: IconProps) => {
  const scale = size / 24;
  const centerX = size / 2;
  const centerY = size / 2;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: "absolute",
          width: 17 * scale,
          height: 17 * scale,
          borderRadius: 8.5 * scale,
          backgroundColor: color,
          top: 3.5 * scale,
          left: 3.5 * scale,
        }}
      />
      {[0, 60, 120].map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 4 * scale,
            height: 21 * scale,
            backgroundColor: color,
            left: centerX - 2 * scale,
            top: 1.5 * scale,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      ))}
      <View
        style={{
          position: "absolute",
          width: 5.5 * scale,
          height: 5.5 * scale,
          borderRadius: 2.75 * scale,
          backgroundColor: gameUIColors.background,
          top: centerY - 2.75 * scale,
          left: centerX - 2.75 * scale,
        }}
      />
    </View>
  );
};

// Version 2: Dotted Teeth (from GearsIcon.tsx)
const GearV2 = ({ size = 48, color = "#059669" }: IconProps) => {
  const scale = size / 24;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      {/* Main gear circle */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 8 * scale,
          backgroundColor: color,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />

      {/* Dots as teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            borderRadius: 1.5 * scale,
            backgroundColor: color,
            top: centerY - 1.5 * scale,
            left: centerX - 1.5 * scale,
            transform: [
              { translateX: Math.cos((angle * Math.PI) / 180) * 10 * scale },
              { translateY: Math.sin((angle * Math.PI) / 180) * 10 * scale },
            ],
          }}
        />
      ))}

      {/* Center hole */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          backgroundColor: gameUIColors.background,
          top: centerY - 3 * scale,
          left: centerX - 3 * scale,
        }}
      />
    </View>
  );
};

// Version 3: Settings Gear - 8 teeth (from GearsIcon.tsx)
const GearV3 = ({ size = 48, color = "#059669" }: IconProps) => {
  const scale = size / 24;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      {/* Main gear circle */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 8 * scale,
          backgroundColor: color,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />

      {/* 8 gear teeth for settings icon */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 20 * scale,
            height: 4 * scale,
            backgroundColor: color,
            left: 2 * scale,
            top: centerY - 2 * scale,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      ))}

      {/* Center hole */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          backgroundColor: gameUIColors.background,
          top: centerY - 3 * scale,
          left: centerX - 3 * scale,
        }}
      />
    </View>
  );
};

export const GearIconComparison = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gear Icon Variations</Text>
      <Text style={styles.subtitle}>Best 3 Designs</Text>

      <View style={styles.grid}>
        <View style={styles.iconItem}>
          <View style={styles.iconBox}>
            <GearV1 size={48} color={gameUIColors.primary} />
          </View>
          <Text style={styles.iconLabel}>v1</Text>
          <Text style={styles.iconName}>Star 6 Spokes</Text>
        </View>

        <View style={styles.iconItem}>
          <View style={styles.iconBox}>
            <GearV2 size={48} color={gameUIColors.primary} />
          </View>
          <Text style={styles.iconLabel}>v2</Text>
          <Text style={styles.iconName}>Dotted Teeth</Text>
        </View>

        <View style={styles.iconItem}>
          <View style={styles.iconBox}>
            <GearV3 size={48} color={gameUIColors.primary} />
          </View>
          <Text style={styles.iconLabel}>v3</Text>
          <Text style={styles.iconName}>Settings Gear</Text>
        </View>
      </View>

      {/* Size Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size Comparison (v3 - Settings)</Text>
        <View style={styles.sizeRow}>
          <View style={styles.sizeItem}>
            <GearV3 size={16} color={gameUIColors.primary} />
            <Text style={styles.sizeLabel}>16px</Text>
          </View>
          <View style={styles.sizeItem}>
            <GearV3 size={24} color={gameUIColors.primary} />
            <Text style={styles.sizeLabel}>24px</Text>
          </View>
          <View style={styles.sizeItem}>
            <GearV3 size={32} color={gameUIColors.primary} />
            <Text style={styles.sizeLabel}>32px</Text>
          </View>
          <View style={styles.sizeItem}>
            <GearV3 size={48} color={gameUIColors.primary} />
            <Text style={styles.sizeLabel}>48px</Text>
          </View>
        </View>
      </View>

      {/* Color Variations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Variations (v3)</Text>
        <View style={styles.colorRow}>
          <GearV3 size={32} color={gameUIColors.primary} />
          <GearV3 size={32} color={gameUIColors.secondary} />
          <GearV3 size={32} color="#7c3aed" />
          <GearV3 size={32} color="#dc2626" />
          <GearV3 size={32} color="#f59e0b" />
          <GearV3 size={32} color="#10b981" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a202c",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: gameUIColors.muted,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  iconItem: {
    alignItems: "center",
  },
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: "#e6fffa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#b2f5ea",
  },
  iconLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginBottom: 2,
  },
  iconName: {
    fontSize: 12,
    color: gameUIColors.muted,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2d3748",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  sizeItem: {
    alignItems: "center",
  },
  sizeLabel: {
    fontSize: 11,
    color: gameUIColors.muted,
    marginTop: 8,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default GearIconComparison;
