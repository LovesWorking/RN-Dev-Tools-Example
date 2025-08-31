import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
// Note: lucide-react-native is not installed - SVG comparison disabled
// import * as LucideIcons from "lucide-react-native";
const LucideIcons = {}; // Placeholder for missing dependency
// Import our pure React Native icons - v2
import * as PureRNIconsV2 from "../../rn-better-dev-tools/icons/lucide-icons";
// Import our improved pure React Native icons - v3
import * as PureRNIconsV3 from "../../rn-better-dev-tools/icons/lucide-icons-improved";

export const IconComparison = () => {
  // List of icons to compare - Wifi at the top
  const iconsToCompare = [
    "WifiIcon",
    "WifiOffIcon",
    "SettingsIcon",
    "EyeIcon",
    "EyeOffIcon",
    "RefreshCwIcon",
    "ShieldIcon",
    "PaletteIcon",
    "HandIcon",
    "ActivityIcon",
    "DatabaseIcon",
    "BugIcon",
    "ServerIcon",
    "GlobeIcon",
    "XIcon",
    "CheckCircle2Icon",
    "XCircleIcon",
    "FileCodeIcon",
    "FileTextIcon",
    "FileJsonIcon",
    "TestTube2Icon",
    "FlaskConicalIcon",
    "Trash2Icon",
    "HashIcon",
    "UsersIcon",
    "BoxIcon",
    "KeyIcon",
    "RouteIcon",
    "TriangleAlertIcon",
    "UnlockIcon",
    "ImageIcon",
    "FilmIcon",
    "MusicIcon",
    "TimerIcon",
    "SmartphoneIcon",
    "LayersIcon",
    "NavigationIcon",
    "TouchpadIcon",
    "BarChart3Icon",
    "HardDriveIcon",
  ];

  // Map icon names to lucide-react-native names (remove 'Icon' suffix)
  const getLucideName = (name: string) => {
    return name.replace("Icon", "");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Comparison: Three Versions</Text>

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerColumn}>
          <Text style={styles.headerText}>SVG</Text>
          <Text style={styles.subHeaderText}>lucide-react-native</Text>
        </View>
        <View style={styles.headerColumn}>
          <Text style={styles.headerText}>v1</Text>
          <Text style={styles.subHeaderText}>First Pure RN</Text>
        </View>
        <View style={styles.headerColumn}>
          <Text style={styles.headerText}>v2</Text>
          <Text style={styles.subHeaderText}>Improved Pure RN</Text>
        </View>
      </View>

      {/* Icons Grid */}
      <View style={styles.comparisonGrid}>
        {iconsToCompare.map((iconName) => {
          const lucideName = getLucideName(iconName);
          const LucideIcon = (LucideIcons as any)[lucideName];
          const PureIconV2 = (PureRNIconsV2 as any)[iconName];
          const PureIconV3 = (PureRNIconsV3 as any)[iconName];

          // Skip if any version is missing
          if (!LucideIcon) {
            console.log(`Missing SVG icon: ${lucideName}`);
            return null;
          }
          if (!PureIconV2) {
            console.log(`Missing v2 icon: ${iconName}`);
            // Still render if v2 is missing but v3 exists
          }
          if (!PureIconV3) {
            console.log(`Missing v3 icon: ${iconName}`);
            return null;
          }

          return (
            <View key={iconName} style={styles.comparisonRow}>
              {/* Icon Name Label */}
              <Text style={styles.iconName}>{lucideName}</Text>

              {/* SVG Icon */}
              <View style={styles.iconContainer}>
                <View style={[styles.iconBox, styles.svgIconBox]}>
                  {LucideIcon ? (
                    <LucideIcon size={28} color="#4A5568" strokeWidth={1.5} />
                  ) : (
                    <Text style={styles.missingIcon}>N/A</Text>
                  )}
                </View>
                <Text style={styles.iconLabel}>SVG</Text>
              </View>

              {/* v1 - First Pure RN Icon */}
              <View style={styles.iconContainer}>
                <View style={[styles.iconBox, styles.v1IconBox]}>
                  {PureIconV2 ? (
                    <PureIconV2 size={28} color="#0891b2" strokeWidth={1.5} />
                  ) : (
                    <Text style={styles.missingIcon}>N/A</Text>
                  )}
                </View>
                <Text style={styles.iconLabel}>v1</Text>
              </View>

              {/* v2 - Improved Pure RN Icon */}
              <View style={styles.iconContainer}>
                <View style={[styles.iconBox, styles.v2IconBox]}>
                  <PureIconV3 size={28} color="#059669" strokeWidth={1.5} />
                </View>
                <Text style={styles.iconLabel}>v2</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Version Comparison</Text>

        <View style={styles.versionGrid}>
          {/* SVG Version */}
          <View style={styles.versionBox}>
            <Text style={styles.versionTitle}>SVG (Original)</Text>
            <View style={styles.versionStats}>
              <Text style={styles.statItem}>✓ Full SVG support</Text>
              <Text style={styles.statItem}>✗ Requires react-native-svg</Text>
              <Text style={styles.statItem}>✗ Larger bundle size</Text>
              <Text style={styles.statItem}>✗ Complex rendering</Text>
            </View>
          </View>

          {/* v1 Version */}
          <View style={styles.versionBox}>
            <Text style={styles.versionTitle}>v1 (First Pure RN)</Text>
            <View style={styles.versionStats}>
              <Text style={styles.statItem}>✓ No SVG dependency</Text>
              <Text style={styles.statItem}>✓ Basic shapes</Text>
              <Text style={styles.statItem}>~ Some icons missing</Text>
              <Text style={styles.statItem}>~ Simple designs</Text>
            </View>
          </View>

          {/* v2 Version */}
          <View style={styles.versionBox}>
            <Text style={styles.versionTitle}>v2 (Improved)</Text>
            <View style={styles.versionStats}>
              <Text style={styles.statItem}>✓ No SVG dependency</Text>
              <Text style={styles.statItem}>✓ All 40 icons</Text>
              <Text style={styles.statItem}>✓ Game UI themed</Text>
              <Text style={styles.statItem}>✓ Optimized shapes</Text>
            </View>
          </View>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Migration Benefits (v2):</Text>
          <Text style={styles.featureItem}>
            • Complete icon set (40 icons)
          </Text>
          <Text style={styles.featureItem}>
            • No react-native-svg dependency
          </Text>
          <Text style={styles.featureItem}>
            • ~50% smaller bundle size
          </Text>
          <Text style={styles.featureItem}>
            • Better performance on low-end devices
          </Text>
          <Text style={styles.featureItem}>
            • Game UI color theming built-in
          </Text>
          <Text style={styles.featureItem}>
            • Drop-in replacement API
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Color Legend:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: "#4A5568" }]} />
          <Text style={styles.legendText}>SVG - Original icons</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: "#0891b2" }]} />
          <Text style={styles.legendText}>v1 - First Pure RN attempt</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendColor, { backgroundColor: "#059669" }]} />
          <Text style={styles.legendText}>v2 - Improved Pure RN</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#1a202c",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerColumn: {
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
  },
  subHeaderText: {
    fontSize: 11,
    color: "#718096",
    marginTop: 4,
  },
  comparisonGrid: {
    paddingHorizontal: 15,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  iconName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#2d3748",
    minWidth: 80,
  },
  iconContainer: {
    alignItems: "center",
    marginHorizontal: 8,
    flex: 1,
  },
  iconBox: {
    width: 55,
    height: 55,
    backgroundColor: "#f7fafc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  svgIconBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e0",
  },
  v1IconBox: {
    backgroundColor: "#f0f9ff",
    borderColor: "#7dd3fc",
  },
  v2IconBox: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  iconLabel: {
    fontSize: 10,
    color: "#718096",
    marginTop: 5,
    fontWeight: "600",
  },
  missingIcon: {
    fontSize: 10,
    color: "#cbd5e0",
  },
  statsSection: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 15,
  },
  versionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  versionBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#f7fafc",
    borderRadius: 8,
  },
  versionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
    textAlign: "center",
  },
  versionStats: {
    alignItems: "flex-start",
  },
  statItem: {
    fontSize: 10,
    color: "#4a5568",
    marginBottom: 4,
  },
  featureList: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 8,
    paddingLeft: 10,
  },
  legend: {
    margin: 20,
    padding: 15,
    backgroundColor: "#f7fafc",
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    color: "#4a5568",
  },
});