import React from "react";
import { View, ViewStyle } from "react-native";
import { IconBackground } from "./shared/IconBackground";

interface SentryBugIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  colorPreset?: "red" | "purple" | "orange" | "pink" | "cyan" | "green";
  variant?: "circuit" | "matrix" | "glitch" | "nodes" | "grid";
  noBackground?: boolean;
}

const ColorPresets = {
  red: { color: "#FF3366", glow: "#FF3366" },
  purple: { color: "#9945FF", glow: "#9945FF" },
  orange: { color: "#FF8800", glow: "#FF8800" },
  pink: { color: "#FF45FF", glow: "#FF45FF" },
  cyan: { color: "#00D4FF", glow: "#00D4FF" },
  green: { color: "#00FF88", glow: "#00FF88" },
};

export const SentryBugIcon: React.FC<SentryBugIconProps> = ({
  size = 24,
  color,
  glowColor,
  colorPreset = "red",
  variant = "circuit",
  noBackground = true,
}) => {
  const scale = noBackground ? size / 24 : size / 60;

  // Use preset colors if no custom colors provided
  const activeColor = color || ColorPresets[colorPreset].color;
  const activeGlow = glowColor || ColorPresets[colorPreset].glow;

  const iconContent = (
    <>
      {/* Bug body - main oval */}
      <View
        style={
          {
            position: "absolute",
            width: 12 * scale,
            height: 14 * scale,
            borderRadius: 6 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 6 * scale,
            top: size / 2 - 5 * scale,
            opacity: 0.9,
          } as ViewStyle
        }
      />

      {/* Bug head */}
      <View
        style={
          {
            position: "absolute",
            width: 8 * scale,
            height: 6 * scale,
            borderRadius: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 4 * scale,
            top: size / 2 - 9 * scale,
            opacity: 0.95,
          } as ViewStyle
        }
      />

      {/* Bug body glow */}
      <View
        style={
          {
            position: "absolute",
            width: 14 * scale,
            height: 16 * scale,
            borderRadius: 7 * scale,
            backgroundColor: activeGlow,
            left: size / 2 - 7 * scale,
            top: size / 2 - 6 * scale,
            opacity: 0.15,
          } as ViewStyle
        }
      />

      {/* Bug legs - 6 total */}
      {/* Left side legs */}
      {[0.3, 0.5, 0.7].map((y, i) => (
        <View
          key={`left-leg-${i}`}
          style={
            {
              position: "absolute",
              width: 4 * scale,
              height: 0.8 * scale,
              backgroundColor: activeColor,
              left: size / 2 - 10 * scale,
              top: size / 2 - 4 * scale + y * 10 * scale,
              transform: [{ rotate: "-20deg" }],
              opacity: 0.8,
            } as ViewStyle
          }
        />
      ))}

      {/* Right side legs */}
      {[0.3, 0.5, 0.7].map((y, i) => (
        <View
          key={`right-leg-${i}`}
          style={
            {
              position: "absolute",
              width: 4 * scale,
              height: 0.8 * scale,
              backgroundColor: activeColor,
              right: size / 2 - 10 * scale,
              top: size / 2 - 4 * scale + y * 10 * scale,
              transform: [{ rotate: "20deg" }],
              opacity: 0.8,
            } as ViewStyle
          }
        />
      ))}

      {/* Antennae */}
      <View
        style={
          {
            position: "absolute",
            width: 0.5 * scale,
            height: 4 * scale,
            backgroundColor: activeColor,
            left: size / 2 - 2 * scale,
            top: size / 2 - 11 * scale,
            transform: [{ rotate: "-15deg" }],
            opacity: 0.7,
          } as ViewStyle
        }
      />
      <View
        style={
          {
            position: "absolute",
            width: 0.5 * scale,
            height: 4 * scale,
            backgroundColor: activeColor,
            right: size / 2 - 2 * scale,
            top: size / 2 - 11 * scale,
            transform: [{ rotate: "15deg" }],
            opacity: 0.7,
          } as ViewStyle
        }
      />

      {/* Antenna tips */}
      <View
        style={
          {
            position: "absolute",
            width: 1.5 * scale,
            height: 1.5 * scale,
            borderRadius: 0.75 * scale,
            backgroundColor: activeGlow,
            left: size / 2 - 3 * scale,
            top: size / 2 - 12 * scale,
            opacity: 0.6,
          } as ViewStyle
        }
      />
      <View
        style={
          {
            position: "absolute",
            width: 1.5 * scale,
            height: 1.5 * scale,
            borderRadius: 0.75 * scale,
            backgroundColor: activeGlow,
            right: size / 2 - 3 * scale,
            top: size / 2 - 12 * scale,
            opacity: 0.6,
          } as ViewStyle
        }
      />

      {/* Data dots on bug body - circuit style */}
      {[0.35, 0.5, 0.65].map((y, i) => (
        <View
          key={`dot-${i}`}
          style={
            {
              position: "absolute",
              width: 1 * scale,
              height: 1 * scale,
              borderRadius: 0.5 * scale,
              backgroundColor: "#fff",
              left: size / 2 - 0.5 * scale,
              top: y * size,
              opacity: 0.3,
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
