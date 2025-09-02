import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import PureModal, { ModalTheme } from "./PureModal";

// Import game UI colors from your app
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";

// Dark theme - matches your app's existing theme
const darkTheme: ModalTheme = {
  colors: {
    background: "rgba(8, 12, 21, 0.98)",  // Dark background
    surface: "rgba(16, 22, 35, 0.95)",    // Slightly lighter surface
    text: "#FFFFFF",                      // White text
    textSecondary: "#B8BFC9",             // Muted text
    backdrop: "rgba(0, 0, 0, 0.85)",      // Dark backdrop
    handle: "#7A8599",                    // Muted handle
    border: "rgba(0, 184, 230, 0.2)",     // Cyan border with opacity
    primary: "#00B8E6",                   // Cyan primary
    error: "#FF5252",                     // Red error
    success: "#4AFF9F",                   // Green success
    muted: "#7A8599",                     // Muted gray
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  shadows: {
    sm: {
      shadowColor: gameUIColors.info,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    md: {
      shadowColor: gameUIColors.info,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    lg: {
      shadowColor: gameUIColors.info,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 16,
    },
  },
};

// Light theme - light version of your app's theme
const lightTheme: ModalTheme = {
  colors: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    text: "#1A1A1A",
    textSecondary: "#666666",
    backdrop: "rgba(0, 0, 0, 0.3)",
    handle: "#CCCCCC",
    border: "#E0E0E0",
    primary: "#0074A3",      // Darker version of gameUIColors.info
    error: "#CC0000",        // Darker version of gameUIColors.error
    success: "#00A852",      // Darker version of gameUIColors.success
    muted: "#999999",
  },
  spacing: darkTheme.spacing,
  radii: darkTheme.radii,
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },
};

export default function PureModalExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"bottomSheet" | "floating">("bottomSheet")
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  const getTheme = () => currentTheme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === "dark" ? "#0A0E15" : "#F0F0F0" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: currentTheme === "dark" ? "#FFF" : "#000" }]}>Pure Modal Example</Text>
        
        {/* Theme Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme === "dark" ? "#B8BFC9" : "#666" }]}>Theme</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.themeButton, 
                currentTheme === "light" && styles.activeTheme,
                { 
                  marginRight: 5,
                  backgroundColor: currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "#FFF"
                }
              ]}
              onPress={() => setCurrentTheme("light")}
            >
              <Text style={{ color: currentTheme === "dark" ? "#FFF" : "#000" }}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton, 
                currentTheme === "dark" && styles.activeTheme,
                { 
                  marginLeft: 5,
                  backgroundColor: currentTheme === "dark" ? "rgba(0,184,230,0.2)" : "#FFF"
                }
              ]}
              onPress={() => setCurrentTheme("dark")}
            >
              <Text style={{ color: currentTheme === "dark" ? "#00B8E6" : "#000" }}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Single Modal Trigger */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentTheme === "dark" ? "#00B8E6" : "#0074A3" }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Open Modal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Single Modal - switches between modes */}
      <PureModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        snapPoints={modalMode === "bottomSheet" ? [200, "50%", "90%"] : undefined}
        initialSnapIndex={1}
        enablePanDownToClose={modalMode === "bottomSheet"}
        draggable={modalMode === "floating"}
        resizable={modalMode === "floating"}
        initialPosition={modalMode === "floating" ? { x: 50, y: 100 } : undefined}
        initialSize={modalMode === "floating" ? { width: 320, height: 400 } : undefined}
        theme={getTheme()}
        header={{
          title: modalMode === "bottomSheet" ? "Bottom Sheet" : "Floating Window",
          subtitle: modalMode === "bottomSheet" 
            ? "Drag to resize • Swipe down to close" 
            : "Drag header to move • Corners to resize",
        }}
        onModeChange={(newMode) => setModalMode(newMode as "bottomSheet" | "floating")}
        persistenceKey="example-modal"
        enablePersistence
      >
        <ScrollView style={styles.modalContent}>
          {/* Stats Section */}
          <View style={[styles.statsContainer, { backgroundColor: `${getTheme().colors.primary}10` }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getTheme().colors.primary }]}>60 FPS</Text>
              <Text style={[styles.statLabel, { color: getTheme().colors.textSecondary }]}>Performance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getTheme().colors.success }]}>Pure JS</Text>
              <Text style={[styles.statLabel, { color: getTheme().colors.textSecondary }]}>No Native</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getTheme().colors.error }]}>45KB</Text>
              <Text style={[styles.statLabel, { color: getTheme().colors.textSecondary }]}>Bundle Size</Text>
            </View>
          </View>

          {/* Features List */}
          <Text style={[styles.featureSectionTitle, { color: getTheme().colors.text }]}>
            Features
          </Text>
          <View style={styles.featureList}>
            {[
              { icon: "✨", title: "Smooth Animations", desc: "Native driver animations" },
              { icon: "🎨", title: "Themeable", desc: "Full customization support" },
              { icon: "📱", title: "Cross Platform", desc: "iOS, Android, and Web" },
              { icon: "🎯", title: "Gesture Support", desc: "Drag, resize, and swipe" },
              { icon: "💾", title: "State Persistence", desc: "Remember user preferences" },
            ].map((feature, i) => (
              <View key={i} style={[styles.featureItem, { 
                backgroundColor: getTheme().colors.surface,
                borderLeftColor: getTheme().colors.primary,
              }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.featureTitle, { color: getTheme().colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDesc, { color: getTheme().colors.textSecondary }]}>
                    {feature.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </PureModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
  },
  themeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeTheme: {
    borderColor: "#00B8E6",
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    paddingTop: 20,
  },
  
  // Stats Section
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  
  // Features Section
  featureSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginHorizontal: 20,
    letterSpacing: -0.3,
  },
  featureList: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
  },
  
});