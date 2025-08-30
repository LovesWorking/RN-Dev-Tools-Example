import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";

// Game UI Color Palette - Using your exact colors
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
  color?: string;
  strokeWidth?: number;
  style?: any;
}

// Helper to get color from variant
const getColor = (color?: string) => {
  if (!color || color === "currentColor") return gameUIColors.primary;
  return color;
};

// 1. WifiIcon - Perfect arcs already done
export const WifiIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Center dot */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 3 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: c,
          bottom: 4 * scale,
          left: size / 2 - 1.5 * scale,
        }}
      />
      {/* WiFi arcs */}
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: (6 + i * 6) * scale,
            height: (6 + i * 6) * scale,
            borderRadius: (3 + i * 3) * scale,
            borderWidth: strokeWidth,
            borderTopColor: c,
            borderRightColor: c,
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
            bottom: 4 * scale,
            left: size / 2 - (3 + i * 3) * scale,
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
    </View>
  );
};

// 2. WifiOffIcon - WiFi with slash through it
export const WifiOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Center dot with reduced opacity */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 3 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: c,
          bottom: 4 * scale,
          left: size / 2 - 1.5 * scale,
          opacity: 0.4,
        }}
      />
      {/* WiFi arcs with reduced opacity */}
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: (6 + i * 6) * scale,
            height: (6 + i * 6) * scale,
            borderRadius: (3 + i * 3) * scale,
            borderWidth: strokeWidth,
            borderTopColor: c,
            borderRightColor: c,
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
            bottom: 4 * scale,
            left: size / 2 - (3 + i * 3) * scale,
            opacity: 0.3 - i * 0.05,
          }}
        />
      ))}
      {/* Diagonal slash */}
      <View
        style={{
          position: "absolute",
          width: size * 1.1,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          left: -size * 0.05,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

// 3. SettingsIcon - Star burst with thin spokes and filled center
export const SettingsIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      {/* Main gear body - filled circle */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 8 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />
      
      {/* Thin spokes creating star burst effect */}
      {/* Vertical bar */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 22 * scale,
          backgroundColor: c,
          left: centerX - 1.5 * scale,
          top: 1 * scale,
        }}
      />
      
      {/* Horizontal bar */}
      <View
        style={{
          position: "absolute",
          width: 22 * scale,
          height: 3 * scale,
          backgroundColor: c,
          left: 1 * scale,
          top: centerY - 1.5 * scale,
        }}
      />
      
      {/* Diagonal bar 1 (45 degrees) */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 22 * scale,
          backgroundColor: c,
          left: centerX - 1.5 * scale,
          top: 1 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
      
      {/* Diagonal bar 2 (-45 degrees) */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 22 * scale,
          backgroundColor: c,
          left: centerX - 1.5 * scale,
          top: 1 * scale,
          transform: [{ rotate: "-45deg" }],
        }}
      />
      
      {/* Center filled circle */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: 4 * scale,
          backgroundColor: c,
          top: centerY - 4 * scale,
          left: centerX - 4 * scale,
        }}
      />
    </View>
  );
};

// 4. EyeIcon - Eye shape
export const EyeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Eye outline - almond shape */}
      <View
        style={{
          position: "absolute",
          width: 22 * scale,
          height: 14 * scale,
          borderRadius: 7 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 5 * scale,
          left: 1 * scale,
        }}
      />
      {/* Iris */}
      <View
        style={{
          position: "absolute",
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 5 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 7 * scale,
          left: 7 * scale,
        }}
      />
      {/* Pupil */}
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          backgroundColor: c,
          top: 10 * scale,
          left: 10 * scale,
        }}
      />
    </View>
  );
};

// 5. EyeOffIcon - Eye with slash
export const EyeOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Eye outline with reduced opacity */}
      <View
        style={{
          position: "absolute",
          width: 22 * scale,
          height: 14 * scale,
          borderRadius: 7 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 5 * scale,
          left: 1 * scale,
          opacity: 0.5,
        }}
      />
      {/* Iris with reduced opacity */}
      <View
        style={{
          position: "absolute",
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 5 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 7 * scale,
          left: 7 * scale,
          opacity: 0.5,
        }}
      />
      {/* Diagonal slash */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
};

// 6. RefreshCwIcon - Circular arrows
export const RefreshCwIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Two curved arrows forming circle */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 8 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          top: 4 * scale,
          left: 4 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
      {/* Arrow tips */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderLeftWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 6 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          top: 3 * scale,
          right: 4 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderLeftWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderTopWidth: 6 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: c,
          bottom: 3 * scale,
          left: 4 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

// 7. ShieldIcon - Shield shape
export const ShieldIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Shield body */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 19 * scale,
          borderTopLeftRadius: 2 * scale,
          borderTopRightRadius: 2 * scale,
          borderBottomLeftRadius: 8 * scale,
          borderBottomRightRadius: 8 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 2 * scale,
          left: 4 * scale,
        }}
      />
      {/* Shield point */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderLeftWidth: 8 * scale,
          borderRightWidth: 8 * scale,
          borderTopWidth: 4 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: c,
          bottom: 2 * scale,
          left: 4 * scale,
        }}
      />
      {/* Check mark */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 6 * scale,
          borderBottomWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: c,
          transform: [{ rotate: "45deg" }],
          top: 8 * scale,
          left: 8 * scale,
        }}
      />
    </View>
  );
};

// 8. PaletteIcon - Artist palette
export const PaletteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Palette shape */}
      <View
        style={{
          position: "absolute",
          width: 20 * scale,
          height: 20 * scale,
          borderRadius: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 2 * scale,
          left: 2 * scale,
        }}
      />
      {/* Thumb hole */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          backgroundColor: gameUIColors.background,
          right: 3 * scale,
          bottom: 3 * scale,
        }}
      />
      {/* Paint dots */}
      {[
        [6, 6, gameUIColors.error],
        [14, 6, gameUIColors.warning],
        [6, 12, gameUIColors.success],
        [10, 10, gameUIColors.info],
      ].map(([x, y, dotColor], i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            borderRadius: 1.5 * scale,
            backgroundColor: dotColor as string,
            left: (x as number) * scale,
            top: (y as number) * scale,
          }}
        />
      ))}
    </View>
  );
};

// 9. HandIcon - Hand shape
export const HandIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Palm */}
      <View
        style={{
          position: "absolute",
          width: 12 * scale,
          height: 14 * scale,
          borderRadius: 6 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          bottom: 3 * scale,
          left: 6 * scale,
        }}
      />
      {/* Fingers */}
      {[
        [7, 3, 7],
        [10, 2, 9],
        [13, 3, 8],
        [16, 5, 6],
      ].map(([x, y, h], i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 2.5 * scale,
            height: h * scale,
            borderRadius: 1.25 * scale,
            backgroundColor: c,
            top: y * scale,
            left: x * scale,
          }}
        />
      ))}
      {/* Thumb */}
      <View
        style={{
          position: "absolute",
          width: 2.5 * scale,
          height: 5 * scale,
          borderRadius: 1.25 * scale,
          backgroundColor: c,
          top: 9 * scale,
          left: 5 * scale,
          transform: [{ rotate: "-30deg" }],
        }}
      />
    </View>
  );
};

// 10. ActivityIcon - Pulse line
export const ActivityIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Base line */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
        }}
      />
      {/* Pulse spikes */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 10 * scale,
          backgroundColor: c,
          top: 7 * scale,
          left: 7 * scale,
          transform: [{ rotate: "-20deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 16 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: 11 * scale,
          transform: [{ rotate: "15deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 10 * scale,
          backgroundColor: c,
          top: 7 * scale,
          right: 7 * scale,
          transform: [{ rotate: "20deg" }],
        }}
      />
    </View>
  );
};

// 11. DatabaseIcon - Cylinder stack
export const DatabaseIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          {/* Cylinder top ellipse */}
          <View
            style={{
              position: "absolute",
              width: 18 * scale,
              height: 18 * scale,
              borderRadius: 9 * scale,
              borderWidth: strokeWidth,
              borderColor: c,
              top: (3 + i * 6) * scale,
              left: 3 * scale,
              transform: [{ scaleY: 0.35 }],
            }}
          />
          {/* Cylinder sides */}
          {i < 2 && (
            <>
              <View
                style={{
                  position: "absolute",
                  width: strokeWidth,
                  height: 6 * scale,
                  backgroundColor: c,
                  top: (6 + i * 6) * scale,
                  left: 3 * scale,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: strokeWidth,
                  height: 6 * scale,
                  backgroundColor: c,
                  top: (6 + i * 6) * scale,
                  right: 3 * scale,
                }}
              />
            </>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// 12. BugIcon - Bug shape
export const BugIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Body */}
      <View
        style={{
          position: "absolute",
          width: 10 * scale,
          height: 14 * scale,
          borderRadius: 5 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 7 * scale,
          left: 7 * scale,
        }}
      />
      {/* Head */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: 9 * scale,
        }}
      />
      {/* Antennae */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 4 * scale,
          backgroundColor: c,
          top: 2 * scale,
          left: 10 * scale,
          transform: [{ rotate: "-20deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 4 * scale,
          backgroundColor: c,
          top: 2 * scale,
          right: 10 * scale,
          transform: [{ rotate: "20deg" }],
        }}
      />
      {/* Legs */}
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <View
            style={{
              position: "absolute",
              width: 5 * scale,
              height: strokeWidth,
              backgroundColor: c,
              top: (9 + i * 3) * scale,
              left: 2 * scale,
              transform: [{ rotate: "-30deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 5 * scale,
              height: strokeWidth,
              backgroundColor: c,
              top: (9 + i * 3) * scale,
              right: 2 * scale,
              transform: [{ rotate: "30deg" }],
            }}
          />
        </React.Fragment>
      ))}
    </View>
  );
};

// 13. ServerIcon - Server rack
export const ServerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {[0, 1].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 18 * scale,
            height: 8 * scale,
            borderRadius: 2 * scale,
            borderWidth: strokeWidth,
            borderColor: c,
            top: (2 + i * 10) * scale,
            left: 3 * scale,
          }}
        >
          {/* LEDs */}
          <View
            style={{
              position: "absolute",
              width: 2 * scale,
              height: 2 * scale,
              borderRadius: 1 * scale,
              backgroundColor: c,
              top: 3 * scale,
              left: 2 * scale,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 2 * scale,
              height: 2 * scale,
              borderRadius: 1 * scale,
              backgroundColor: c,
              top: 3 * scale,
              left: 6 * scale,
            }}
          />
        </View>
      ))}
      {/* Connection line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 4 * scale,
          backgroundColor: c,
          top: 10 * scale,
          left: size / 2 - strokeWidth / 2,
        }}
      />
    </View>
  );
};

// 14. GlobeIcon - Already perfect from example
export const GlobeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Main globe circle */}
      <View
        style={{
          position: "absolute",
          width: 20 * scale,
          height: 20 * scale,
          borderRadius: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 2 * scale,
          left: 2 * scale,
        }}
      />
      {/* Vertical meridian */}
      <View
        style={{
          position: "absolute",
          width: 20 * scale,
          height: 20 * scale,
          borderRadius: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 2 * scale,
          left: 2 * scale,
          transform: [{ scaleX: 0.4 }],
        }}
      />
      {/* Horizontal equator */}
      <View
        style={{
          position: "absolute",
          width: 20 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          left: 2 * scale,
        }}
      />
    </View>
  );
};

// 15. XIcon - Close/X
export const XIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          left: 3 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          left: 3 * scale,
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
};

// 16. CheckCircle2Icon - Checkmark in a circle
export const CheckCircle2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Circle border */}
      <View
        style={{
          position: "absolute",
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: c,
          top: strokeWidth,
          left: strokeWidth,
        }}
      />
      {/* Checkmark - left part */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 7 * scale,
          backgroundColor: c,
          top: 11 * scale,
          left: 7 * scale,
          transform: [{ rotate: "-45deg" }],
        }}
      />
      {/* Checkmark - right part */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 11 * scale,
          backgroundColor: c,
          top: 8 * scale,
          left: 10 * scale,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

// 17. XCircleIcon - X in a circle
export const XCircleIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Circle border */}
      <View
        style={{
          position: "absolute",
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: c,
          top: strokeWidth,
          left: strokeWidth,
        }}
      />
      {/* X - first line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 10 * scale,
          backgroundColor: c,
          top: 7 * scale,
          left: size / 2 - strokeWidth / 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
      {/* X - second line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 10 * scale,
          backgroundColor: c,
          top: 7 * scale,
          left: size / 2 - strokeWidth / 2,
          transform: [{ rotate: "-45deg" }],
        }}
      />
    </View>
  );
};

// 18. FileCodeIcon - File with code brackets
export const FileCodeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* File outline */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: 18 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 3 * scale,
          left: 5 * scale,
        }}
      />
      {/* Folded corner */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderTopWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderTopColor: c,
          borderRightColor: "transparent",
          top: 3 * scale,
          right: 5 * scale,
        }}
      />
      {/* Code bracket < */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 3 * scale,
          backgroundColor: c,
          top: 11 * scale,
          left: 8 * scale,
          transform: [{ rotate: "-35deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 3 * scale,
          backgroundColor: c,
          top: 13 * scale,
          left: 8 * scale,
          transform: [{ rotate: "35deg" }],
        }}
      />
      {/* Code bracket > */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 3 * scale,
          backgroundColor: c,
          top: 11 * scale,
          right: 8 * scale,
          transform: [{ rotate: "35deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 3 * scale,
          backgroundColor: c,
          top: 13 * scale,
          right: 8 * scale,
          transform: [{ rotate: "-35deg" }],
        }}
      />
    </View>
  );
};

// 19. FileTextIcon - File with text lines
export const FileTextIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* File outline */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: 18 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 3 * scale,
          left: 5 * scale,
        }}
      />
      {/* Folded corner */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderTopWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderTopColor: c,
          borderRightColor: "transparent",
          top: 3 * scale,
          right: 5 * scale,
        }}
      />
      {/* Text lines */}
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 8 * scale,
            height: strokeWidth,
            backgroundColor: c,
            top: (9 + i * 3) * scale,
            left: 8 * scale,
          }}
        />
      ))}
    </View>
  );
};

// 20. FileJsonIcon - File with { } for JSON
export const FileJsonIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* File outline */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: 18 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 3 * scale,
          left: 5 * scale,
        }}
      />
      {/* Folded corner */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderTopWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderTopColor: c,
          borderRightColor: "transparent",
          top: 3 * scale,
          right: 5 * scale,
        }}
      />
      {/* { symbol */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 6 * scale,
          borderLeftWidth: strokeWidth,
          borderTopWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: c,
          borderTopLeftRadius: 2 * scale,
          borderBottomLeftRadius: 2 * scale,
          top: 9 * scale,
          left: 8 * scale,
        }}
      />
      {/* } symbol */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 6 * scale,
          borderRightWidth: strokeWidth,
          borderTopWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: c,
          borderTopRightRadius: 2 * scale,
          borderBottomRightRadius: 2 * scale,
          top: 9 * scale,
          right: 8 * scale,
        }}
      />
    </View>
  );
};

// 21. TestTube2Icon - Test tube/flask
export const TestTube2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Flask body */}
      <View
        style={{
          position: "absolute",
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 5 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          bottom: 3 * scale,
          left: size / 2 - 5 * scale,
        }}
      />
      {/* Flask neck */}
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: 8 * scale,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: c,
          top: 3 * scale,
          left: size / 2 - 2 * scale,
        }}
      />
      {/* Flask top */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 3 * scale,
          left: size / 2 - 4 * scale,
        }}
      />
      {/* Liquid */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 3 * scale,
          backgroundColor: c,
          opacity: 0.3,
          borderRadius: 3 * scale,
          bottom: 5 * scale,
          left: size / 2 - 3 * scale,
        }}
      />
      {/* Bubble */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: c,
          opacity: 0.5,
          bottom: 9 * scale,
          left: size / 2 + 1 * scale,
        }}
      />
    </View>
  );
};

// 22. FlaskConicalIcon - Alternative flask/test tube
export const FlaskConicalIcon = TestTube2Icon;

// 23. Trash2Icon - Trash can
export const Trash2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Lid */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 6 * scale,
          left: 5 * scale,
        }}
      />
      {/* Handle */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 2 * scale,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: c,
          borderTopLeftRadius: 2 * scale,
          borderTopRightRadius: 2 * scale,
          top: 3 * scale,
          left: size / 2 - 3 * scale,
        }}
      />
      {/* Can body */}
      <View
        style={{
          position: "absolute",
          width: 12 * scale,
          height: 12 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 8 * scale,
          left: 6 * scale,
        }}
      />
      {/* Vertical lines */}
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: strokeWidth,
            height: 6 * scale,
            backgroundColor: c,
            top: 11 * scale,
            left: (9 + i * 3) * scale,
          }}
        />
      ))}
    </View>
  );
};

// 24. HashIcon - Hash/pound symbol
export const HashIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Vertical lines */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 14 * scale,
          backgroundColor: c,
          top: 5 * scale,
          left: 8 * scale,
          transform: [{ skewX: "-10deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 14 * scale,
          backgroundColor: c,
          top: 5 * scale,
          right: 8 * scale,
          transform: [{ skewX: "-10deg" }],
        }}
      />
      {/* Horizontal lines */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 8 * scale,
          left: 5 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: strokeWidth,
          backgroundColor: c,
          bottom: 8 * scale,
          left: 5 * scale,
        }}
      />
    </View>
  );
};

// 25. UsersIcon - Multiple people
export const UsersIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Left person - head */}
      <View
        style={{
          position: "absolute",
          width: 5 * scale,
          height: 5 * scale,
          borderRadius: 2.5 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />
      {/* Left person - body */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 6 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderTopLeftRadius: 4 * scale,
          borderTopRightRadius: 4 * scale,
          borderBottomWidth: 0,
          top: 12 * scale,
          left: 2.5 * scale,
        }}
      />
      {/* Right person - head */}
      <View
        style={{
          position: "absolute",
          width: 5 * scale,
          height: 5 * scale,
          borderRadius: 2.5 * scale,
          backgroundColor: c,
          top: 4 * scale,
          right: 4 * scale,
        }}
      />
      {/* Right person - body */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 6 * scale,
          backgroundColor: c,
          borderTopLeftRadius: 4 * scale,
          borderTopRightRadius: 4 * scale,
          top: 12 * scale,
          right: 2.5 * scale,
        }}
      />
    </View>
  );
};

// 26. BoxIcon - 3D box/package
export const BoxIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Top face */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 8 * scale,
          borderRightWidth: 8 * scale,
          borderBottomWidth: 5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          top: 4 * scale,
          left: 4 * scale,
          opacity: 0.8,
        }}
      />
      {/* Front face */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 9 * scale,
          left: 4 * scale,
        }}
      />
      {/* Tape/seam line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 10 * scale,
          backgroundColor: c,
          top: 9 * scale,
          left: size / 2 - strokeWidth / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 5 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: size / 2 - strokeWidth / 2,
          transform: [{ rotate: "-20deg" }],
        }}
      />
    </View>
  );
};

// 27. KeyIcon - Key
export const KeyIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Key head (circle) */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: 4 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />
      {/* Key hole */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: c,
          top: 7 * scale,
          left: 7 * scale,
        }}
      />
      {/* Key shaft */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: size / 2 - strokeWidth / 2,
          left: 10 * scale,
        }}
      />
      {/* Key teeth */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 3 * scale,
          backgroundColor: c,
          top: size / 2,
          right: 6 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 2 * scale,
          backgroundColor: c,
          top: size / 2,
          right: 4 * scale,
        }}
      />
    </View>
  );
};

// 28. RouteIcon - Route/path
export const RouteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Start point */}
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: 5 * scale,
        }}
      />
      {/* End point */}
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          bottom: 4 * scale,
          right: 5 * scale,
        }}
      />
      {/* Path line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 6 * scale,
          backgroundColor: c,
          top: 8 * scale,
          left: 7 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 13 * scale,
          left: 7 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 5 * scale,
          backgroundColor: c,
          top: 13 * scale,
          right: 7 * scale,
        }}
      />
    </View>
  );
};

// 29. TriangleAlertIcon - Warning triangle
export const TriangleAlertIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Triangle */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 10 * scale,
          borderRightWidth: 10 * scale,
          borderBottomWidth: 16 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          top: 4 * scale,
          left: 2 * scale,
        }}
      />
      {/* Inner triangle (to create border effect) */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 8 * scale,
          borderRightWidth: 8 * scale,
          borderBottomWidth: 13 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: gameUIColors.background,
          top: 6 * scale,
          left: 4 * scale,
        }}
      />
      {/* Exclamation mark - line */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 6 * scale,
          backgroundColor: c,
          top: 8 * scale,
          left: size / 2 - strokeWidth / 2,
        }}
      />
      {/* Exclamation mark - dot */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: strokeWidth,
          borderRadius: strokeWidth / 2,
          backgroundColor: c,
          bottom: 6 * scale,
          left: size / 2 - strokeWidth / 2,
        }}
      />
    </View>
  );
};

// 30. UnlockIcon - Open padlock
export const UnlockIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Lock body */}
      <View
        style={{
          position: "absolute",
          width: 12 * scale,
          height: 8 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          bottom: 4 * scale,
          left: 6 * scale,
        }}
      />
      {/* Keyhole */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 3 * scale,
          backgroundColor: c,
          bottom: 7 * scale,
          left: size / 2 - 1 * scale,
        }}
      />
      {/* Shackle (open) */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 7 * scale,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: c,
          borderTopLeftRadius: 4 * scale,
          borderTopRightRadius: 4 * scale,
          top: 4 * scale,
          left: 4 * scale,
        }}
      />
    </View>
  );
};

// 31. ImageIcon - Image/photo
export const ImageIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Frame */}
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: 14 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 5 * scale,
          left: 3 * scale,
        }}
      />
      {/* Sun/circle */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 3 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: c,
          top: 8 * scale,
          left: 7 * scale,
        }}
      />
      {/* Mountain 1 */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 4 * scale,
          borderRightWidth: 4 * scale,
          borderBottomWidth: 4 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          bottom: 5 * scale,
          left: 5 * scale,
        }}
      />
      {/* Mountain 2 */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 3 * scale,
          borderRightWidth: 3 * scale,
          borderBottomWidth: 3 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          opacity: 0.7,
          bottom: 5 * scale,
          right: 6 * scale,
        }}
      />
    </View>
  );
};

// 32. FilmIcon - Film/video
export const FilmIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Film strip */}
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: 16 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 4 * scale,
          left: 3 * scale,
        }}
      />
      {/* Perforations left */}
      {[0, 1, 2, 3].map((i) => (
        <View
          key={`left-${i}`}
          style={{
            position: "absolute",
            width: 2 * scale,
            height: 2 * scale,
            backgroundColor: c,
            top: (6 + i * 3) * scale,
            left: 5 * scale,
          }}
        />
      ))}
      {/* Perforations right */}
      {[0, 1, 2, 3].map((i) => (
        <View
          key={`right-${i}`}
          style={{
            position: "absolute",
            width: 2 * scale,
            height: 2 * scale,
            backgroundColor: c,
            top: (6 + i * 3) * scale,
            right: 5 * scale,
          }}
        />
      ))}
      {/* Play triangle */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 4 * scale,
          borderTopWidth: 3 * scale,
          borderBottomWidth: 3 * scale,
          borderLeftColor: c,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          top: 9 * scale,
          left: 10 * scale,
        }}
      />
    </View>
  );
};

// 33. MusicIcon - Music note
export const MusicIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Note stem */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 12 * scale,
          backgroundColor: c,
          top: 4 * scale,
          right: 8 * scale,
        }}
      />
      {/* Flag */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 4 * scale,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: c,
          borderTopRightRadius: 3 * scale,
          top: 4 * scale,
          right: 8 * scale,
        }}
      />
      {/* Note head 1 */}
      <View
        style={{
          position: "absolute",
          width: 5 * scale,
          height: 4 * scale,
          borderRadius: 2.5 * scale,
          backgroundColor: c,
          bottom: 5 * scale,
          left: 6 * scale,
        }}
      />
      {/* Note head 2 */}
      <View
        style={{
          position: "absolute",
          width: 5 * scale,
          height: 4 * scale,
          borderRadius: 2.5 * scale,
          backgroundColor: c,
          bottom: 5 * scale,
          right: 6 * scale,
        }}
      />
    </View>
  );
};

// 34. TimerIcon - Timer/stopwatch
export const TimerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Clock face */}
      <View
        style={{
          position: "absolute",
          width: 16 * scale,
          height: 16 * scale,
          borderRadius: 8 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 6 * scale,
          left: 4 * scale,
        }}
      />
      {/* Top button */}
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 3 * scale,
          left: 10 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 1 * scale,
          top: 2 * scale,
          left: 11 * scale,
        }}
      />
      {/* Clock hands */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 6 * scale,
          backgroundColor: c,
          top: 10 * scale,
          left: size / 2 - strokeWidth / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: strokeWidth,
          backgroundColor: c,
          top: 14 * scale,
          left: size / 2 - strokeWidth / 2,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
};

// 35. SmartphoneIcon - Mobile phone
export const SmartphoneIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Phone body */}
      <View
        style={{
          position: "absolute",
          width: 12 * scale,
          height: 20 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 2 * scale,
          left: 6 * scale,
        }}
      />
      {/* Screen */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 14 * scale,
          backgroundColor: c,
          opacity: 0.2,
          top: 4 * scale,
          left: 8 * scale,
        }}
      />
      {/* Home button */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: c,
          bottom: 3 * scale,
          left: size / 2 - 1 * scale,
        }}
      />
    </View>
  );
};

// 36. LayersIcon - Stacked layers
export const LayersIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Bottom layer */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 9 * scale,
          borderRightWidth: 9 * scale,
          borderBottomWidth: 5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          opacity: 0.3,
          bottom: 4 * scale,
          left: 3 * scale,
        }}
      />
      {/* Middle layer */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 9 * scale,
          borderRightWidth: 9 * scale,
          borderBottomWidth: 5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          opacity: 0.6,
          bottom: 8 * scale,
          left: 3 * scale,
        }}
      />
      {/* Top layer */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 9 * scale,
          borderRightWidth: 9 * scale,
          borderBottomWidth: 5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: c,
          top: 4 * scale,
          left: 3 * scale,
        }}
      />
    </View>
  );
};

// 37. NavigationIcon - Navigation/map marker
export const NavigationIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Map fold effect */}
      <View
        style={{
          position: "absolute",
          width: 14 * scale,
          height: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 7 * scale,
          left: 2 * scale,
          transform: [{ skewY: "-10deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 10 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderLeftWidth: 0,
          top: 7 * scale,
          right: 2 * scale,
          transform: [{ skewY: "10deg" }],
        }}
      />
      {/* Location marker */}
      <View
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: 3 * scale,
          borderRightWidth: 3 * scale,
          borderTopWidth: 5 * scale,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: c,
          top: 8 * scale,
          left: 9 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 4 * scale,
          height: 4 * scale,
          borderRadius: 2 * scale,
          backgroundColor: c,
          top: 6 * scale,
          left: 10 * scale,
        }}
      />
    </View>
  );
};

// 38. TouchpadIcon - Touchpad/trackpad
export const TouchpadIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Touchpad frame */}
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: 14 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 5 * scale,
          left: 3 * scale,
        }}
      />
      {/* Touch indicator */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 3 * scale,
          borderRadius: 1.5 * scale,
          backgroundColor: c,
          opacity: 0.5,
          top: 10 * scale,
          left: 8 * scale,
        }}
      />
      {/* Touch ripple */}
      <View
        style={{
          position: "absolute",
          width: 6 * scale,
          height: 6 * scale,
          borderRadius: 3 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          opacity: 0.3,
          top: 8.5 * scale,
          left: 6.5 * scale,
        }}
      />
    </View>
  );
};

// 39. BarChart3Icon - Bar chart
export const BarChart3Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* X axis */}
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: strokeWidth,
          backgroundColor: c,
          bottom: 4 * scale,
          left: 3 * scale,
        }}
      />
      {/* Y axis */}
      <View
        style={{
          position: "absolute",
          width: strokeWidth,
          height: 16 * scale,
          backgroundColor: c,
          top: 4 * scale,
          left: 3 * scale,
        }}
      />
      {/* Bar 1 */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 8 * scale,
          backgroundColor: c,
          bottom: 4 * scale,
          left: 6 * scale,
        }}
      />
      {/* Bar 2 */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 12 * scale,
          backgroundColor: c,
          bottom: 4 * scale,
          left: 11 * scale,
        }}
      />
      {/* Bar 3 */}
      <View
        style={{
          position: "absolute",
          width: 3 * scale,
          height: 6 * scale,
          backgroundColor: c,
          bottom: 4 * scale,
          left: 16 * scale,
        }}
      />
    </View>
  );
};

// 40. HardDriveIcon - Hard drive/storage
export const HardDriveIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const c = getColor(color);
  const scale = size / 24;

  return (
    <View style={{ width: size, height: size }}>
      {/* Drive body */}
      <View
        style={{
          position: "absolute",
          width: 18 * scale,
          height: 12 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          borderRadius: 2 * scale,
          top: 6 * scale,
          left: 3 * scale,
        }}
      />
      {/* Disk platter */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: 4 * scale,
          borderWidth: strokeWidth,
          borderColor: c,
          top: 8 * scale,
          left: 5 * scale,
        }}
      />
      {/* Center spindle */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: c,
          top: 11 * scale,
          left: 8 * scale,
        }}
      />
      {/* Status LED */}
      <View
        style={{
          position: "absolute",
          width: 2 * scale,
          height: 2 * scale,
          borderRadius: 1 * scale,
          backgroundColor: c,
          top: 11 * scale,
          right: 5 * scale,
        }}
      />
    </View>
  );
};

// Export all icons as a collection for easy testing
export const AllIcons = {
  WifiIcon,
  WifiOffIcon,
  SettingsIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
  ShieldIcon,
  PaletteIcon,
  HandIcon,
  ActivityIcon,
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  GlobeIcon,
  XIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FileCodeIcon,
  FileTextIcon,
  FileJsonIcon,
  TestTube2Icon,
  FlaskConicalIcon,
  Trash2Icon,
  HashIcon,
  UsersIcon,
  BoxIcon,
  KeyIcon,
  RouteIcon,
  TriangleAlertIcon,
  UnlockIcon,
  ImageIcon,
  FilmIcon,
  MusicIcon,
  TimerIcon,
  SmartphoneIcon,
  LayersIcon,
  NavigationIcon,
  TouchpadIcon,
  BarChart3Icon,
  HardDriveIcon,
};