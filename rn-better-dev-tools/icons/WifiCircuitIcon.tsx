import React from "react";
import { View, ViewStyle } from "react-native";
import { IconBackground } from "./shared/IconBackground";

interface WifiIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  strength?: 0 | 1 | 2 | 3 | 4;
  colorPreset?: "cyan" | "green" | "purple" | "pink" | "yellow" | "orange";
  variant?: "circuit" | "matrix" | "glitch" | "nodes" | "grid";
  noBackground?: boolean;
  showSlash?: boolean;
}

const ColorPresets = {
  cyan: { color: "#00D4FF", glow: "#00D4FF" },
  green: { color: "#00FF88", glow: "#00FF88" },
  purple: { color: "#9945FF", glow: "#9945FF" },
  pink: { color: "#FF45FF", glow: "#FF45FF" },
  yellow: { color: "#FFD700", glow: "#FFD700" },
  orange: { color: "#FF8800", glow: "#FF8800" },
};

export const WifiCircuitIcon: React.FC<WifiIconProps> = ({
  size = 24,
  color,
  glowColor,
  strength = 4,
  colorPreset = "cyan",
  variant = "nodes",
  noBackground = true,
  showSlash = false,
}) => {
  const scale = size / 60;
  const strokeWidth = 2.5 * scale;
  const isOff = strength === 0;

  // Use preset colors if no custom colors provided
  const baseColor = color || ColorPresets[colorPreset].color;
  const baseGlow = glowColor || ColorPresets[colorPreset].glow;
  const activeColor = isOff ? "#333" : baseColor;
  const activeGlow = isOff ? "#333" : baseGlow;

  const iconContent = (
    <>
      {/* Central dot */}
      <View
        style={
          {
            position: "absolute",
            width: 5 * scale,
            height: 5 * scale,
            borderRadius: 2.5 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 2.5 * scale,
            top: size * 0.7,
            opacity: strength > 0 ? 1 : 0.3,
          } as ViewStyle
        }
      />

      {/* WiFi signal arcs - proper cone shape */}
      {/* Small arc */}
      {strength >= 1 && (
        <View
          style={
            {
              position: "absolute",
              width: 15 * scale,
              height: 15 * scale,
              borderRadius: 7.5 * scale,
              borderWidth: strokeWidth,
              borderColor: activeColor,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              left: size / 2 - 7.5 * scale,
              top: size * 0.55,
              transform: [{ rotate: "180deg" }],
              opacity: strength >= 1 ? 0.9 : 0.3,
            } as ViewStyle
          }
        />
      )}

      {/* Medium arc */}
      {strength >= 2 && (
        <View
          style={
            {
              position: "absolute",
              width: 30 * scale,
              height: 30 * scale,
              borderRadius: 15 * scale,
              borderWidth: strokeWidth,
              borderColor: activeColor,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              left: size / 2 - 15 * scale,
              top: size * 0.45,
              transform: [{ rotate: "180deg" }],
              opacity: strength >= 2 ? 0.8 : 0.3,
            } as ViewStyle
          }
        />
      )}

      {/* Large arc */}
      {strength >= 3 && (
        <View
          style={
            {
              position: "absolute",
              width: 45 * scale,
              height: 45 * scale,
              borderRadius: 22.5 * scale,
              borderWidth: strokeWidth,
              borderColor: activeColor,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              left: size / 2 - 22.5 * scale,
              top: size * 0.35,
              transform: [{ rotate: "180deg" }],
              opacity: strength >= 3 ? 0.7 : 0.3,
            } as ViewStyle
          }
        />
      )}

      {/* Extra large arc for full strength */}
      {strength >= 4 && (
        <View
          style={
            {
              position: "absolute",
              width: 60 * scale,
              height: 60 * scale,
              borderRadius: 30 * scale,
              borderWidth: strokeWidth,
              borderColor: activeColor,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              left: size / 2 - 30 * scale,
              top: size * 0.25,
              transform: [{ rotate: "180deg" }],
              opacity: 0.6,
            } as ViewStyle
          }
        />
      )}

      {/* Data flow dots on arcs */}
      {strength > 0 &&
        [
          { x: 0.35, y: 0.5, show: strength >= 2 },
          { x: 0.65, y: 0.5, show: strength >= 2 },
          { x: 0.25, y: 0.4, show: strength >= 3 },
          { x: 0.75, y: 0.4, show: strength >= 3 },
          { x: 0.15, y: 0.3, show: strength >= 4 },
          { x: 0.85, y: 0.3, show: strength >= 4 },
        ].map(
          (dot, i) =>
            dot.show && (
              <View
                key={`dot-${i}`}
                style={
                  {
                    position: "absolute",
                    width: 1.5 * scale,
                    height: 1.5 * scale,
                    borderRadius: 0.75 * scale,
                    backgroundColor: activeGlow,
                    left: dot.x * size - 0.75 * scale,
                    top: dot.y * size,
                    opacity: 0.6,
                  } as ViewStyle
                }
              />
            )
        )}

      {/* Slash overlay for off/disabled visual */}
      {showSlash && (
        <View
          style={
            {
              position: "absolute",
              width: size * 0.9, // span most of the icon width
              height: strokeWidth * 1.6, // slightly thicker for visibility
              backgroundColor: activeColor,
              left: size * 0.05,
              top: size * 0.4 - (strokeWidth * 1.6) / 2, // center vertically
              opacity: 0.9,
              transform: [{ rotate: "45deg" }],
              borderRadius: strokeWidth,
              zIndex: 10,
              pointerEvents: "none",
            } as ViewStyle
          }
        />
      )}
    </>
  );

  if (noBackground) {
    return (
      <View
        style={
          {
            width: size,
            height: size,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          } as ViewStyle
        }
      >
        {iconContent}
      </View>
    );
  }

  return (
    <IconBackground size={size} glowColor={activeGlow} variant={variant}>
      {iconContent}
    </IconBackground>
  );
};

// Export aliases for compatibility
export const WifiIcon = WifiCircuitIcon;
export const WifiOffIcon: React.FC<WifiIconProps> = (props) => (
  <WifiCircuitIcon {...props} strength={4} showSlash />
);
