import React from "react";
import { View, ViewStyle } from "react-native";
import { IconBackground } from "./shared/IconBackground";

interface EnvLaptopIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  colorPreset?: "green" | "cyan" | "purple" | "pink" | "yellow" | "orange";
  variant?: "circuit" | "matrix" | "glitch" | "nodes" | "grid";
  noBackground?: boolean;
}

const ColorPresets = {
  green: { color: "#00FF88", glow: "#00FF88" },
  cyan: { color: "#00D4FF", glow: "#00D4FF" },
  purple: { color: "#9945FF", glow: "#9945FF" },
  pink: { color: "#FF45FF", glow: "#FF45FF" },
  yellow: { color: "#FFD700", glow: "#FFD700" },
  orange: { color: "#FF8800", glow: "#FF8800" },
};

export const EnvLaptopIcon: React.FC<EnvLaptopIconProps> = ({
  size = 24,
  color,
  glowColor,
  colorPreset = "green",
  variant = "circuit",
  noBackground = true,
}) => {
  const scale = noBackground ? size / 24 : size / 40;

  // Use preset colors if no custom colors provided
  const activeColor = color || ColorPresets[colorPreset].color;
  const activeGlow = glowColor || ColorPresets[colorPreset].glow;

  const iconContent = (
    <>
      {/* Laptop base/keyboard */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 8 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 + 4 * scale,
            opacity: 0.85,
          } as ViewStyle
        }
      >
        {/* Keyboard keys */}
        {[
          [3, 1.5],
          [6, 1.5],
          [9, 1.5],
          [12, 1.5],
          [15, 1.5],
          [3, 3.5],
          [6, 3.5],
          [9, 3.5],
          [12, 3.5],
          [15, 3.5],
          [5, 5.5],
          [10, 5.5],
          [14, 5.5],
        ].map(([x, y], i) => (
          <View
            key={i}
            style={
              {
                position: "absolute",
                width: 2 * scale,
                height: 1 * scale,
                backgroundColor: "#000",
                opacity: 0.3,
                left: x * scale,
                top: y * scale,
                borderRadius: 0.2 * scale,
              } as ViewStyle
            }
          />
        ))}
      </View>

      {/* Base glow */}
      <View
        style={
          {
            position: "absolute",
            width: 22 * scale,
            height: 10 * scale,
            backgroundColor: activeGlow,
            borderRadius: 1 * scale,
            left: size / 2 - 11 * scale,
            top: size / 2 + 3 * scale,
            opacity: 0.15,
          } as ViewStyle
        }
      />

      {/* Laptop screen */}
      <View
        style={
          {
            position: "absolute",
            width: 18 * scale,
            height: 12 * scale,
            backgroundColor: activeColor,
            borderRadius: 1 * scale,
            left: size / 2 - 9 * scale,
            top: size / 2 - 10 * scale,
            opacity: 0.9,
          } as ViewStyle
        }
      >
        {/* Screen inner */}
        <View
          style={
            {
              position: "absolute",
              width: 16 * scale,
              height: 10 * scale,
              backgroundColor: "#000",
              opacity: 0.5,
              left: 1 * scale,
              top: 1 * scale,
              borderRadius: 0.5 * scale,
            } as ViewStyle
          }
        />

        {/* Code lines on screen */}
        {[2, 4, 6, 8].map((y, i) => (
          <View
            key={i}
            style={
              {
                position: "absolute",
                width: (10 - i * 2) * scale,
                height: 0.5 * scale,
                backgroundColor: activeGlow,
                opacity: 0.6,
                left: 2 * scale,
                top: y * scale,
              } as ViewStyle
            }
          />
        ))}
      </View>

      {/* Screen glow */}
      <View
        style={
          {
            position: "absolute",
            width: 20 * scale,
            height: 14 * scale,
            backgroundColor: activeGlow,
            borderRadius: 1 * scale,
            left: size / 2 - 10 * scale,
            top: size / 2 - 11 * scale,
            opacity: 0.1,
          } as ViewStyle
        }
      />

      {/* Power indicator */}
      <View
        style={
          {
            position: "absolute",
            width: 2 * scale,
            height: 1 * scale,
            backgroundColor: activeGlow,
            borderRadius: 0.5 * scale,
            left: size / 2 - 1 * scale,
            top: size / 2 + 10 * scale,
            opacity: 0.8,
          } as ViewStyle
        }
      />

      {/* Circuit data dots on screen */}
      {[
        { x: 0.25, y: 0.3 },
        { x: 0.75, y: 0.3 },
        { x: 0.5, y: 0.5 },
        { x: 0.3, y: 0.7 },
        { x: 0.7, y: 0.7 },
      ].map((dot, i) => (
        <View
          key={`screen-dot-${i}`}
          style={
            {
              position: "absolute",
              width: 1 * scale,
              height: 1 * scale,
              borderRadius: 0.5 * scale,
              backgroundColor: activeGlow,
              left: size / 2 - 9 * scale + dot.x * 18 * scale,
              top: size / 2 - 10 * scale + dot.y * 12 * scale,
              opacity: 0.4,
            } as ViewStyle
          }
        />
      ))}
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
export const ServerIcon = EnvLaptopIcon;
export const LaptopIcon = EnvLaptopIcon;
