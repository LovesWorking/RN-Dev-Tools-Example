import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { EnvLaptopIcon } from "@/rn-better-dev-tools/icons/EnvLaptopIcon";
import { WifiCircuitIcon } from "@/rn-better-dev-tools/icons/WifiCircuitIcon";
import { StorageStackIcon } from "@/rn-better-dev-tools/icons/StorageStackIcon";
import { SentryBugIcon } from "@/rn-better-dev-tools/icons/SentryBugIcon";
import { ReactQueryIcon } from "@/rn-better-dev-tools/icons/ReactQueryIcon";
import { IconBackground } from "@/rn-better-dev-tools/icons/shared/IconBackground";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/gameUIColors";
import * as LucideIcons from "@/rn-better-dev-tools/icons/lucide-icons";

const IconVariationsGallery: React.FC = () => {
  const iconSize = 50;

  // Icons that need work (shown at top for review)
  const needsWorkIcons = [
    { name: "🔧 WifiOff", Component: LucideIcons.WifiOffIcon },
    { name: "🔧 Settings", Component: LucideIcons.SettingsIcon },
    { name: "🔧 Cloud", Component: LucideIcons.CloudIcon },
    { name: "🔧 Phone", Component: LucideIcons.PhoneIcon },
    { name: "🔧 Volume", Component: LucideIcons.VolumeIcon },
    { name: "🔧 Eye", Component: LucideIcons.EyeIcon },
    { name: "🔧 EyeOff", Component: LucideIcons.EyeOffIcon },
    { name: "🔧 RefreshCw", Component: LucideIcons.RefreshCwIcon },
    { name: "🔧 Shield", Component: LucideIcons.ShieldIcon },
    { name: "🔧 Palette", Component: LucideIcons.PaletteIcon },
    { name: "🔧 Hand", Component: LucideIcons.HandIcon },
    { name: "🔧 Database", Component: LucideIcons.DatabaseIcon },
    { name: "🔧 FileCode", Component: LucideIcons.FileCodeIcon },
    { name: "🔧 FileJson", Component: LucideIcons.FileJsonIcon },
    { name: "🔧 TestTube2", Component: LucideIcons.TestTube2Icon },
    { name: "🔧 FlaskConical", Component: LucideIcons.FlaskConicalIcon },
    { name: "🔧 Box", Component: LucideIcons.BoxIcon },
    { name: "🔧 Key", Component: LucideIcons.KeyIcon },
    { name: "🔧 Route", Component: LucideIcons.RouteIcon },
    { name: "🔧 TriangleAlert", Component: LucideIcons.TriangleAlertIcon },
    { name: "🔧 Unlock", Component: LucideIcons.UnlockIcon },
    { name: "🔧 Image", Component: LucideIcons.ImageIcon },
    { name: "🔧 Film", Component: LucideIcons.FilmIcon },
    { name: "🔧 Music", Component: LucideIcons.MusicIcon },
    { name: "🔧 Timer", Component: LucideIcons.TimerIcon },
    { name: "🔧 Smartphone", Component: LucideIcons.SmartphoneIcon },
    { name: "🔧 Layers", Component: LucideIcons.LayersIcon },
    { name: "🔧 Navigation", Component: LucideIcons.NavigationIcon },
    { name: "🔧 Touchpad", Component: LucideIcons.TouchpadIcon },
    { name: "🔧 Filter", Component: LucideIcons.FilterIcon },
    { name: "🔧 GitBranch", Component: LucideIcons.GitBranchIcon },
    { name: "🔧 Link", Component: LucideIcons.LinkIcon },
    { name: "🔧 Zap", Component: LucideIcons.ZapIcon },
    { name: "🔧 Power", Component: LucideIcons.PowerIcon },
  ];

  // Approved icons (shown at bottom)
  const approvedIcons = [
    { name: "✅ Wifi", Component: LucideIcons.WifiIcon },
    { name: "✅ Activity", Component: LucideIcons.ActivityIcon },
    { name: "✅ Bug", Component: LucideIcons.BugIcon },
    { name: "✅ Server", Component: LucideIcons.ServerIcon },
    { name: "✅ Globe", Component: LucideIcons.GlobeIcon },
    { name: "✅ X", Component: LucideIcons.XIcon },
    { name: "✅ XCircle", Component: LucideIcons.XCircleIcon },
    { name: "✅ Check", Component: LucideIcons.CheckIcon },
    { name: "✅ CheckCircle2", Component: LucideIcons.CheckCircle2Icon },
    { name: "✅ CheckCircle", Component: LucideIcons.CheckCircleIcon },
    { name: "✅ FileText", Component: LucideIcons.FileTextIcon },
    { name: "✅ Trash2", Component: LucideIcons.Trash2Icon },
    { name: "✅ Trash", Component: LucideIcons.TrashIcon },
    { name: "✅ Hash", Component: LucideIcons.HashIcon },
    { name: "✅ Users", Component: LucideIcons.UsersIcon },
    { name: "✅ AlertCircle", Component: LucideIcons.AlertCircleIcon },
    { name: "✅ AlertTriangle", Component: LucideIcons.AlertTriangleIcon },
    { name: "✅ ChevronDown", Component: LucideIcons.ChevronDownIcon },
    { name: "✅ ChevronLeft", Component: LucideIcons.ChevronLeftIcon },
    { name: "✅ ChevronRight", Component: LucideIcons.ChevronRightIcon },
    { name: "✅ ChevronUp", Component: LucideIcons.ChevronUpIcon },
    { name: "✅ Clock", Component: LucideIcons.ClockIcon },
    { name: "✅ Copy", Component: LucideIcons.CopyIcon },
    { name: "✅ Download", Component: LucideIcons.DownloadIcon },
    { name: "✅ Pause", Component: LucideIcons.PauseIcon },
    { name: "✅ Play", Component: LucideIcons.PlayIcon },
    { name: "✅ Plus", Component: LucideIcons.PlusIcon },
    { name: "✅ Upload", Component: LucideIcons.UploadIcon },
    { name: "✅ User", Component: LucideIcons.UserIcon },
    { name: "✅ Lock", Component: LucideIcons.LockIcon },
    { name: "✅ Info", Component: LucideIcons.InfoIcon },
    { name: "✅ Search", Component: LucideIcons.SearchIcon },
    { name: "✅ HardDrive", Component: LucideIcons.HardDriveIcon },
    { name: "✅ Minus", Component: LucideIcons.MinusIcon },
    { name: "✅ BarChart3", Component: LucideIcons.BarChart3Icon },
  ];

  // Combine all icons with needs work first
  const lucideIconList = [...needsWorkIcons, ...approvedIcons];

  // Use game UI colors for the themes
  const gameColors = [
    { name: "Success", color: gameUIColors.success },
    { name: "Warning", color: gameUIColors.warning },
    { name: "Error", color: gameUIColors.error },
    { name: "Info", color: gameUIColors.info },
    { name: "Critical", color: gameUIColors.critical },
    { name: "Optional", color: gameUIColors.optional },
    { name: "Env", color: gameUIColors.env },
    { name: "Storage", color: gameUIColors.storage },
    { name: "Query", color: gameUIColors.query },
    { name: "Debug", color: gameUIColors.debug },
    { name: "Network", color: gameUIColors.network },
  ];

  // Neon glow colors
  const neonColors = [
    { name: "Neon 1", color: gameUIColors.neonGlow.primary },
    { name: "Neon 2", color: gameUIColors.neonGlow.secondary },
    { name: "Neon 3", color: gameUIColors.neonGlow.tertiary },
  ];

  // Data type colors for additional variety
  const dataTypeColors = [
    { name: "Object", color: gameUIColors.dataTypes.object },
    { name: "Array", color: gameUIColors.dataTypes.array },
    { name: "String", color: gameUIColors.dataTypes.string },
    { name: "Number", color: gameUIColors.dataTypes.number },
    { name: "Boolean", color: gameUIColors.dataTypes.boolean },
    { name: "Function", color: gameUIColors.dataTypes.function },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ICON VARIATIONS</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Background Variants Showcase - Just the backgrounds */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>BACKGROUND PATTERNS</Text>
          <Text style={styles.variantLabel}>
            All Available Background Variants (No Icon)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <View
                style={{
                  width: iconSize,
                  height: iconSize,
                  position: "relative",
                }}
              >
                <IconBackground
                  size={iconSize}
                  glowColor="#00D4FF"
                  variant="circuit"
                />
              </View>
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <View
                style={{
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: "transparent",
                }}
              >
                <IconBackground
                  size={iconSize}
                  glowColor="#FF00FF"
                  variant="matrix"
                />
              </View>
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <View
                style={{
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: "transparent",
                }}
              >
                <IconBackground
                  size={iconSize}
                  glowColor="#00FF88"
                  variant="glitch"
                />
              </View>
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <View
                style={{
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: "transparent",
                }}
              >
                <IconBackground
                  size={iconSize}
                  glowColor="#FFD700"
                  variant="nodes"
                />
              </View>
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <View
                style={{
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: "transparent",
                }}
              >
                <IconBackground
                  size={iconSize}
                  glowColor="#FF3366"
                  variant="grid"
                />
              </View>
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>
        </View>

        {/* ENV Laptop Icon Row - Moved to top for testing */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>ENV LAPTOP</Text>

          {/* Background Variations */}
          <Text style={styles.variantLabel}>Background Variants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <EnvLaptopIcon size={iconSize} variant="circuit" />
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <EnvLaptopIcon size={iconSize} variant="matrix" />
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <EnvLaptopIcon size={iconSize} variant="glitch" />
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <EnvLaptopIcon size={iconSize} variant="nodes" />
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <EnvLaptopIcon size={iconSize} variant="grid" />
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>

          {/* Color Variations */}
          <Text style={styles.variantLabel}>Color Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {gameColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <EnvLaptopIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* WiFi Icon Row */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>WIFI</Text>

          {/* Background Variations */}
          <Text style={styles.variantLabel}>Background Variants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <WifiCircuitIcon size={iconSize} variant="circuit" />
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <WifiCircuitIcon size={iconSize} variant="matrix" />
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <WifiCircuitIcon size={iconSize} variant="glitch" />
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <WifiCircuitIcon size={iconSize} variant="nodes" />
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <WifiCircuitIcon size={iconSize} variant="grid" />
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>

          {/* Color Variations */}
          <Text style={styles.variantLabel}>Color Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {gameColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <WifiCircuitIcon
                  size={iconSize}
                  variant="nodes"
                  color={item.color}
                />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Storage Icon Row */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>STORAGE</Text>

          {/* Background Variations */}
          <Text style={styles.variantLabel}>Background Variants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <StorageStackIcon size={iconSize} variant="circuit" />
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <StorageStackIcon size={iconSize} variant="matrix" />
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <StorageStackIcon size={iconSize} variant="glitch" />
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <StorageStackIcon size={iconSize} variant="nodes" />
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <StorageStackIcon size={iconSize} variant="grid" />
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>

          {/* Color Variations */}
          <Text style={styles.variantLabel}>Color Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {gameColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <StorageStackIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sentry Bug Icon Row */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>SENTRY BUG</Text>

          {/* Background Variations */}
          <Text style={styles.variantLabel}>Background Variants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <SentryBugIcon size={iconSize} variant="circuit" />
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <SentryBugIcon size={iconSize} variant="matrix" />
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <SentryBugIcon size={iconSize} variant="glitch" />
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <SentryBugIcon size={iconSize} variant="nodes" />
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <SentryBugIcon size={iconSize} variant="grid" />
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>

          {/* Color Variations */}
          <Text style={styles.variantLabel}>Color Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {gameColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <SentryBugIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* React Query Icon Row */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>REACT QUERY</Text>

          {/* Background Variations */}
          <Text style={styles.variantLabel}>Background Variants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            <View style={styles.iconCard}>
              <ReactQueryIcon size={iconSize} variant="circuit" />
              <Text style={styles.iconLabel}>Circuit</Text>
            </View>
            <View style={styles.iconCard}>
              <ReactQueryIcon size={iconSize} variant="matrix" />
              <Text style={styles.iconLabel}>Matrix</Text>
            </View>
            <View style={styles.iconCard}>
              <ReactQueryIcon size={iconSize} variant="glitch" />
              <Text style={styles.iconLabel}>Glitch</Text>
            </View>
            <View style={styles.iconCard}>
              <ReactQueryIcon size={iconSize} variant="nodes" />
              <Text style={styles.iconLabel}>Nodes</Text>
            </View>
            <View style={styles.iconCard}>
              <ReactQueryIcon size={iconSize} variant="grid" />
              <Text style={styles.iconLabel}>Grid</Text>
            </View>
          </ScrollView>

          {/* Color Variations */}
          <Text style={styles.variantLabel}>Color Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {gameColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <ReactQueryIcon size={iconSize} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Neon Glow Colors Showcase */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>NEON GLOW VARIANTS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {neonColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <EnvLaptopIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
            {neonColors.map((item) => (
              <View key={`wifi-${item.name}`} style={styles.iconCard}>
                <WifiCircuitIcon
                  size={iconSize}
                  variant="nodes"
                  color={item.color}
                />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
            {neonColors.map((item) => (
              <View key={`storage-${item.name}`} style={styles.iconCard}>
                <StorageStackIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Data Type Colors Showcase */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>DATA TYPE COLORS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.row}
          >
            {dataTypeColors.map((item) => (
              <View key={item.name} style={styles.iconCard}>
                <EnvLaptopIcon size={iconSize} color={item.color} />
                <Text style={styles.iconLabel}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ALL LUCIDE ICONS SECTION */}
        <View style={styles.iconSection}>
          <Text style={styles.sectionTitle}>ALL LUCIDE ICONS LIBRARY</Text>
          <Text style={styles.variantLabel}>
            Complete collection of {lucideIconList.length} Lucide icons
          </Text>

          {/* Display icons in groups with different themes */}
          {lucideIconList.map(({ name, Component }) => (
            <View key={name} style={styles.lucideIconGroup}>
              <Text style={styles.lucideIconName}>{name}</Text>
              
              {/* Color Variations */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.row}
              >
                {/* Default color */}
                <View style={styles.iconCard}>
                  <Component size={iconSize} color={gameUIColors.primary} />
                  <Text style={styles.iconLabel}>Primary</Text>
                </View>
                
                {/* Game UI theme colors */}
                {gameColors.slice(0, 6).map((theme) => (
                  <View key={`${name}-${theme.name}`} style={styles.iconCard}>
                    <Component size={iconSize} color={theme.color} />
                    <Text style={styles.iconLabel}>{theme.name}</Text>
                  </View>
                ))}
                
                {/* Neon colors */}
                {neonColors.map((neon) => (
                  <View key={`${name}-${neon.name}`} style={styles.iconCard}>
                    <Component size={iconSize} color={neon.color} />
                    <Text style={styles.iconLabel}>{neon.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: gameUIColors.info,
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
    fontFamily: "monospace",
    textShadowColor: gameUIColors.info,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  iconSection: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: gameUIColors.primary,
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 1.5,
    fontFamily: "monospace",
  },
  variantLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: gameUIColors.info,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  row: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  iconCard: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: gameUIColors.blackTint2,
    borderRadius: 10,
    padding: 12,
    width: 80,
    height: 80,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  iconLabel: {
    color: gameUIColors.muted,
    fontSize: 9,
    marginTop: 6,
    fontFamily: "monospace",
    textAlign: "center",
    textTransform: "capitalize",
  },
  lucideIconGroup: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  lucideIconName: {
    fontSize: 14,
    fontWeight: "700",
    color: gameUIColors.success,
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "monospace",
  },
});

export default IconVariationsGallery;
