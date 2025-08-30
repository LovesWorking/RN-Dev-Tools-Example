import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";

// Game UI Color Palette
const gameUIColors = {
  // Fixed backgrounds
  background: "rgba(8, 12, 21, 0.98)",
  panel: "rgba(16, 22, 35, 0.98)",
  backdrop: "rgba(0, 0, 0, 0.85)",
  buttonBackground: "rgba(12, 16, 26, 0.9)",
  pureBlack: "#000000",

  // Fixed text colors
  primary: "#FFFFFF",
  primaryLight: "#F1F5F9",

  // Theme colors
  border: "#00B8E666",
  blackTint1: "rgba(8, 12, 21, 0.95)",
  blackTint2: "rgba(16, 22, 35, 0.9)",
  blackTint3: "rgba(24, 32, 48, 0.85)",

  // Status Colors
  success: "#4AFF9F",
  warning: "#FFEB3B",
  error: "#FF5252",
  info: "#00B8E6",
  critical: "#FF00FF",
  optional: "#9D4EDD",

  // Tool Colors
  env: "#4AFF9F",
  storage: "#FFEB3B",
  query: "#00B8E6",
  debug: "#FF5252",
  network: "#9D4EDD",

  // Text
  secondary: "#B8BFC9",
  muted: "#7A8599",

  // Neon
  neonGlow: {
    primary: "#00D4FF",
    secondary: "#FF00FF",
    tertiary: "#4AFF9F",
  },
} as const;

interface IconProps {
  size?: number;
  variant?:
    | "env"
    | "storage"
    | "query"
    | "debug"
    | "network"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "critical";
}

/**
 * WiFi Icon with game theme colors
 */
export const WifiIcon: React.FC<IconProps> = ({
  size = 60,
  variant = "network",
}) => {
  const color = gameUIColors[variant];
  const scale = size / 60;
  const strength = 4;

  return (
    <View style={{ position: "relative", width: size, height: size }}>
      {/* Center dot */}
      <View
        style={{
          position: "absolute",
          width: 5 * scale,
          height: 5 * scale,
          borderRadius: 2.5 * scale,
          backgroundColor: color,
          bottom: 0,
          left: size / 2 - 2.5 * scale,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4 * scale,
        }}
      />

      {/* Arcs with glow effect */}
      {strength >= 2 && (
        <View
          style={{
            position: "absolute",
            bottom: 3 * scale,
            left: size / 2 - 10 * scale,
          }}
        >
          <View
            style={{
              width: 20 * scale,
              height: 20 * scale,
              borderRadius: 10 * scale,
              borderWidth: 2 * scale,
              borderTopColor: color,
              borderRightColor: color,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 3 * scale,
            }}
          />
        </View>
      )}

      {strength >= 3 && (
        <View
          style={{
            position: "absolute",
            bottom: 3 * scale,
            left: size / 2 - 17 * scale,
            opacity: 0.8,
          }}
        >
          <View
            style={{
              width: 34 * scale,
              height: 34 * scale,
              borderRadius: 17 * scale,
              borderWidth: 2 * scale,
              borderTopColor: color,
              borderRightColor: color,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          />
        </View>
      )}

      {strength >= 4 && (
        <View
          style={{
            position: "absolute",
            bottom: 3 * scale,
            left: size / 2 - 25 * scale,
            opacity: 0.6,
          }}
        >
          <View
            style={{
              width: 50 * scale,
              height: 50 * scale,
              borderRadius: 25 * scale,
              borderWidth: 2 * scale,
              borderTopColor: color,
              borderRightColor: color,
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          />
        </View>
      )}
    </View>
  );
};

/**
 * Bug Icon with game theme colors
 */
export const BugIcon: React.FC<IconProps> = ({
  size = 30,
  variant = "debug",
}) => {
  const color = gameUIColors[variant];
  const scale = size / 30;

  return (
    <View
      style={{
        width: size * 1.5,
        height: size * 1.5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          transform: [{ rotate: "20deg" }],
          position: "relative",
        }}
      >
        {/* Bug body */}
        <View
          style={{
            width: 20 * scale,
            height: 26 * scale,
            backgroundColor: gameUIColors.blackTint2,
            borderWidth: 2 * scale,
            borderColor: color,
            borderRadius: 10 * scale,
            borderTopLeftRadius: 10 * scale,
            borderTopRightRadius: 10 * scale,
            borderBottomLeftRadius: 12 * scale,
            borderBottomRightRadius: 12 * scale,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4 * scale,
          }}
        />

        {/* Head */}
        <View
          style={{
            position: "absolute",
            width: 12 * scale,
            height: 8 * scale,
            backgroundColor: gameUIColors.blackTint3,
            borderWidth: 2 * scale,
            borderColor: color,
            borderRadius: 6 * scale,
            top: -4 * scale,
            left: 4 * scale,
          }}
        />

        {/* Antennae */}
        <View
          style={{
            position: "absolute",
            width: 2 * scale,
            height: 8 * scale,
            backgroundColor: color,
            top: -10 * scale,
            left: 6 * scale,
            transform: [{ rotate: "-15deg" }],
            opacity: 0.8,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 2 * scale,
            height: 8 * scale,
            backgroundColor: color,
            top: -10 * scale,
            right: 6 * scale,
            transform: [{ rotate: "15deg" }],
            opacity: 0.8,
          }}
        />

        {/* Eyes with glow */}
        <View
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            backgroundColor: color,
            borderRadius: 1.5 * scale,
            top: -2 * scale,
            left: 6 * scale,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 2 * scale,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            backgroundColor: color,
            borderRadius: 1.5 * scale,
            top: -2 * scale,
            right: 6 * scale,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 2 * scale,
          }}
        />

        {/* Legs */}
        {[0, 1, 2].map((index) => (
          <React.Fragment key={index}>
            <View
              style={{
                position: "absolute",
                width: 8 * scale,
                height: 2 * scale,
                backgroundColor: color,
                top: (6 + index * 6) * scale,
                left: -6 * scale,
                transform: [{ rotate: "-45deg" }],
                opacity: 0.7,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 8 * scale,
                height: 2 * scale,
                backgroundColor: color,
                top: (6 + index * 6) * scale,
                right: -6 * scale,
                transform: [{ rotate: "45deg" }],
                opacity: 0.7,
              }}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

/**
 * Globe Icon with game theme colors
 */
export const GlobeIcon: React.FC<IconProps> = ({
  size = 24,
  variant = "env",
}) => {
  const color = gameUIColors[variant];
  const scale = size / 24;
  const globeSize = 18 * scale;

  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Main globe with glow */}
      <View
        style={{
          position: "absolute",
          width: globeSize,
          height: globeSize,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: globeSize / 2,
          top: (size - globeSize) / 2,
          left: (size - globeSize) / 2,
          backgroundColor: gameUIColors.blackTint1,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 4 * scale,
        }}
      />

      {/* Vertical meridian */}
      <View
        style={{
          position: "absolute",
          width: globeSize,
          height: globeSize,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: globeSize / 2,
          top: (size - globeSize) / 2,
          left: (size - globeSize) / 2,
          transform: [{ scaleX: 0.45 }],
          opacity: 0.6,
        }}
      />

      {/* Horizontal equator */}
      <View
        style={{
          position: "absolute",
          width: globeSize,
          height: globeSize,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: globeSize / 2,
          top: (size - globeSize) / 2,
          left: (size - globeSize) / 2,
          transform: [{ scaleX: 1.33 }, { scaleY: 0.6 }],
          opacity: 0.6,
        }}
      />
    </View>
  );
};

/**
 * Database Icon with game theme colors
 */
export const DatabaseIcon: React.FC<IconProps> = ({
  size = 30,
  variant = "storage",
}) => {
  const color = gameUIColors[variant];
  const scale = size / 30;
  const width = 24 * scale;
  const segmentHeight = 8 * scale;

  return (
    <View
      style={{
        width: size,
        height: size * 1.3,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Top cap with glow */}
      <View
        style={{
          position: "absolute",
          width: width,
          height: width,
          borderRadius: width / 2,
          borderWidth: 2 * scale,
          borderColor: color,
          backgroundColor: gameUIColors.blackTint2,
          top: 0,
          transform: [{ scaleY: 0.3 }],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 3 * scale,
        }}
      />

      {/* Cylinder segments */}
      {[0, 1, 2].map((index) => (
        <View key={index}>
          {/* Side walls */}
          <View
            style={{
              position: "absolute",
              width: width,
              height: segmentHeight,
              borderLeftWidth: 2 * scale,
              borderRightWidth: 2 * scale,
              borderColor: color,
              backgroundColor: gameUIColors.blackTint1,
              top: (index + 1) * segmentHeight - 2 * scale,
              opacity: 1 - index * 0.1,
            }}
          />

          {/* Segment divider */}
          {index < 2 && (
            <View
              style={{
                position: "absolute",
                width: width,
                height: width,
                borderRadius: width / 2,
                borderWidth: 1 * scale,
                borderColor: color,
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                top: (index + 1) * segmentHeight + segmentHeight / 2,
                transform: [{ scaleY: 0.3 }],
                opacity: 0.5,
              }}
            />
          )}
        </View>
      ))}

      {/* Bottom cap */}
      <View
        style={{
          position: "absolute",
          width: width,
          height: width,
          borderRadius: width / 2,
          borderWidth: 2 * scale,
          borderColor: color,
          borderTopColor: "transparent",
          backgroundColor: gameUIColors.blackTint3,
          top: segmentHeight * 3 - 2 * scale,
          transform: [{ scaleY: 0.3 }],
        }}
      />
    </View>
  );
};

/**
 * Laptop Icon with game theme colors
 */
export const LaptopIcon: React.FC<IconProps> = ({
  size = 40,
  variant = "query",
}) => {
  const color = gameUIColors[variant];
  const scale = size / 40;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Screen with glow */}
      <View
        style={{
          position: "absolute",
          width: 28 * scale,
          height: 20 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: 2 * scale,
          backgroundColor: gameUIColors.blackTint1,
          top: 6 * scale,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4 * scale,
        }}
      />

      {/* Screen display */}
      <View
        style={{
          position: "absolute",
          width: 24 * scale,
          height: 16 * scale,
          backgroundColor: `${color}15`,
          top: 8 * scale,
          borderRadius: 1 * scale,
        }}
      />

      {/* Camera dot */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: color,
          top: 4 * scale,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 2 * scale,
        }}
      />

      {/* Keyboard base */}
      <View
        style={{
          position: "absolute",
          width: 34 * scale,
          height: 10 * scale,
          borderWidth: 2 * scale,
          borderColor: color,
          borderRadius: 2 * scale,
          backgroundColor: gameUIColors.blackTint2,
          bottom: 10 * scale,
          borderTopWidth: 0,
          transform: [{ scaleY: 0.8 }, { translateY: -2 * scale }],
        }}
      />

      {/* Keyboard keys glow effect */}
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          bottom: 14 * scale,
          gap: 2 * scale,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 6 * scale,
              height: 1.5 * scale,
              backgroundColor: color,
              opacity: 0.3,
            }}
          />
        ))}
      </View>

      {/* Trackpad */}
      <View
        style={{
          position: "absolute",
          width: 12 * scale,
          height: 4 * scale,
          borderWidth: 1 * scale,
          borderColor: color,
          bottom: 11 * scale,
          opacity: 0.5,
        }}
      />
    </View>
  );
};

// Demo component
export const GameThemedIconsDemo: React.FC = () => {
  return (
    <ScrollView style={styles.demoContainer}>
      <Text style={styles.title}>Game Themed Icons</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <WifiIcon size={40} variant="network" />
            <Text style={styles.label}>Network</Text>
          </View>
          <View style={styles.iconWrapper}>
            <WifiIcon size={40} variant="info" />
            <Text style={styles.label}>Info</Text>
          </View>
          <View style={styles.iconWrapper}>
            <WifiIcon size={40} variant="success" />
            <Text style={styles.label}>Success</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <BugIcon size={30} variant="debug" />
            <Text style={styles.label}>Debug</Text>
          </View>
          <View style={styles.iconWrapper}>
            <BugIcon size={30} variant="error" />
            <Text style={styles.label}>Error</Text>
          </View>
          <View style={styles.iconWrapper}>
            <BugIcon size={30} variant="critical" />
            <Text style={styles.label}>Critical</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environment Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <GlobeIcon size={40} variant="env" />
            <Text style={styles.label}>Environment</Text>
          </View>
          <View style={styles.iconWrapper}>
            <GlobeIcon size={40} variant="query" />
            <Text style={styles.label}>Query</Text>
          </View>
          <View style={styles.iconWrapper}>
            <GlobeIcon size={40} variant="network" />
            <Text style={styles.label}>Network</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <DatabaseIcon size={35} variant="storage" />
            <Text style={styles.label}>Storage</Text>
          </View>
          <View style={styles.iconWrapper}>
            <DatabaseIcon size={35} variant="warning" />
            <Text style={styles.label}>Warning</Text>
          </View>
          <View style={styles.iconWrapper}>
            <DatabaseIcon size={35} variant="success" />
            <Text style={styles.label}>Success</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Query Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <LaptopIcon size={40} variant="query" />
            <Text style={styles.label}>Query</Text>
          </View>
          <View style={styles.iconWrapper}>
            <LaptopIcon size={40} variant="info" />
            <Text style={styles.label}>Info</Text>
          </View>
          <View style={styles.iconWrapper}>
            <LaptopIcon size={40} variant="network" />
            <Text style={styles.label}>Network</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Variants</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <WifiIcon size={35} variant="success" />
            <Text style={[styles.label, { color: gameUIColors.success }]}>
              Success
            </Text>
          </View>
          <View style={styles.iconWrapper}>
            <WifiIcon size={35} variant="warning" />
            <Text style={[styles.label, { color: gameUIColors.warning }]}>
              Warning
            </Text>
          </View>
          <View style={styles.iconWrapper}>
            <WifiIcon size={35} variant="error" />
            <Text style={[styles.label, { color: gameUIColors.error }]}>
              Error
            </Text>
          </View>
          <View style={styles.iconWrapper}>
            <WifiIcon size={35} variant="critical" />
            <Text style={[styles.label, { color: gameUIColors.critical }]}>
              Critical
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  demoContainer: {
    flex: 1,
    backgroundColor: gameUIColors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: gameUIColors.primary,
  },
  section: {
    backgroundColor: gameUIColors.panel,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: gameUIColors.primaryLight,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  iconWrapper: {
    alignItems: "center",
    margin: 10,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: gameUIColors.secondary,
  },
});

export default GameThemedIconsDemo;
