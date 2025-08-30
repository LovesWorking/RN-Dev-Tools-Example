import React from "react";
import { View } from "react-native";

interface EnvLaptopIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  variant?: "quantum" | "cosmic" | "stellar";
}

export const EnvLaptopIcon: React.FC<EnvLaptopIconProps> = ({
  size = 24,
  color = "#00FF88",
  glowColor = "#00FF88",
  variant = "quantum",
}) => {
  const scale = size / 24;

  // Helper function to create a glow layer
  const createGlowLayer = (width: number, height: number, opacity: number, blur?: number) => ({
    position: "absolute" as const,
    width: width * scale,
    height: height * scale,
    backgroundColor: glowColor,
    opacity,
    borderRadius: blur ? blur * scale : 0,
  });

  // Color presets for different environments
  const colorPresets = {
    cyan: "#00D4FF",
    green: "#00FF88",
    purple: "#9945FF",
    pink: "#FF45FF",
    yellow: "#FFD700",
    orange: "#FF8800",
    blue: "#4545FF",
    red: "#FF3366",
  };

  const renderVariant = () => {
    switch (variant) {
      case "quantum":
        return (
          <>
            {/* Quantum particles */}
            {[
              { x: 3, y: 3, size: 0.8 },
              { x: 19, y: 3, size: 0.8 },
              { x: 5, y: 10, size: 0.6 },
              { x: 17, y: 10, size: 0.6 },
            ].map((p, i) => (
              <View key={i} style={{
                position: "absolute",
                width: p.size * scale,
                height: p.size * scale,
                borderRadius: p.size * scale / 2,
                backgroundColor: glowColor,
                left: p.x * scale,
                top: p.y * scale,
                opacity: 0.4 + (i * 0.1),
              }} />
            ))}

            {/* Quantum field background */}
            <View style={{
              ...createGlowLayer(20, 12, 0.05),
              left: 2 * scale,
              top: 3 * scale,
              borderRadius: 2 * scale,
            }} />

            {/* Laptop screen with quantum glow */}
            <View style={{
              position: "absolute",
              width: 20 * scale,
              height: 12 * scale,
              borderWidth: 1.5 * scale,
              borderColor: color,
              borderRadius: 2 * scale,
              left: 2 * scale,
              top: 3 * scale,
              backgroundColor: "transparent",
            }}>
              {/* Screen quantum effect */}
              <View style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: glowColor,
                opacity: 0.1,
              }} />
              
              {/* Terminal lines effect */}
              {[0.3, 0.5, 0.7].map((y, i) => (
                <View key={i} style={{
                  position: "absolute",
                  width: (10 + i * 2) * scale,
                  height: 0.5 * scale,
                  backgroundColor: glowColor,
                  opacity: 0.3,
                  left: 2 * scale,
                  top: y * 12 * scale,
                }} />
              ))}
            </View>

            {/* Laptop base */}
            <View style={{
              position: "absolute",
              width: 24 * scale,
              height: 1 * scale,
              backgroundColor: color,
              left: 0,
              bottom: 6 * scale,
            }} />

            {/* Keyboard area with quantum dots */}
            <View style={{
              position: "absolute",
              width: 22 * scale,
              height: 4 * scale,
              borderWidth: 1 * scale,
              borderColor: color,
              backgroundColor: "transparent",
              left: 1 * scale,
              bottom: 1 * scale,
            }}>
              {/* Quantum keyboard dots */}
              {[
                { x: 2, y: 1 },
                { x: 6, y: 1 },
                { x: 10, y: 1 },
                { x: 14, y: 1 },
                { x: 18, y: 1 },
                { x: 4, y: 2.5 },
                { x: 8, y: 2.5 },
                { x: 12, y: 2.5 },
                { x: 16, y: 2.5 },
              ].map((dot, i) => (
                <View key={i} style={{
                  position: "absolute",
                  width: 1 * scale,
                  height: 1 * scale,
                  borderRadius: 0.5 * scale,
                  backgroundColor: glowColor,
                  left: dot.x * scale,
                  top: dot.y * scale,
                  opacity: 0.5,
                }} />
              ))}
            </View>
          </>
        );

      case "cosmic":
        return (
          <>
            {/* Cosmic stars */}
            {[
              { x: 4, y: 2, size: 0.5 },
              { x: 18, y: 4, size: 0.7 },
              { x: 6, y: 8, size: 0.5 },
              { x: 16, y: 10, size: 0.6 },
              { x: 10, y: 5, size: 0.8 },
            ].map((star, i) => (
              <View key={i} style={{
                position: "absolute",
                width: star.size * scale,
                height: star.size * scale,
                borderRadius: star.size * scale / 2,
                backgroundColor: glowColor,
                left: star.x * scale,
                top: star.y * scale,
                opacity: 0.3 + (i * 0.15),
              }} />
            ))}

            {/* Cosmic nebula background */}
            <View style={{
              position: "absolute",
              width: 24 * scale,
              height: 16 * scale,
              borderRadius: 8 * scale,
              backgroundColor: glowColor,
              opacity: 0.03,
              left: 0,
              top: 2 * scale,
            }} />

            {/* Laptop screen */}
            <View style={{
              position: "absolute",
              width: 20 * scale,
              height: 12 * scale,
              borderWidth: 1.5 * scale,
              borderColor: color,
              borderRadius: 2 * scale,
              left: 2 * scale,
              top: 3 * scale,
              backgroundColor: "transparent",
            }}>
              {/* Cosmic matrix effect */}
              {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
                <View key={i} style={{
                  position: "absolute",
                  width: 0.5 * scale,
                  height: (4 + i * 2) * scale,
                  backgroundColor: glowColor,
                  opacity: 0.2,
                  left: x * 20 * scale,
                  top: (2 + i) * scale,
                }} />
              ))}
            </View>

            {/* Base */}
            <View style={{
              position: "absolute",
              width: 24 * scale,
              height: 1 * scale,
              backgroundColor: color,
              left: 0,
              bottom: 6 * scale,
            }} />

            {/* Keyboard */}
            <View style={{
              position: "absolute",
              width: 22 * scale,
              height: 4 * scale,
              borderWidth: 1 * scale,
              borderColor: color,
              backgroundColor: "transparent",
              left: 1 * scale,
              bottom: 1 * scale,
            }} />
          </>
        );

      case "stellar":
        return (
          <>
            {/* Stellar constellation points */}
            {[
              { x: 5, y: 4, size: 1 },
              { x: 8, y: 6, size: 0.8 },
              { x: 15, y: 5, size: 1 },
              { x: 18, y: 7, size: 0.8 },
              { x: 12, y: 8, size: 0.6 },
            ].map((point, i) => (
              <View key={i} style={{
                position: "absolute",
                width: point.size * scale,
                height: point.size * scale,
                borderRadius: point.size * scale / 2,
                borderWidth: 0.5 * scale,
                borderColor: glowColor,
                backgroundColor: "transparent",
                left: point.x * scale,
                top: point.y * scale,
                opacity: 0.4 + (i * 0.1),
              }} />
            ))}

            {/* Constellation lines */}
            <View style={{
              position: "absolute",
              width: 10 * scale,
              height: 0.3 * scale,
              backgroundColor: glowColor,
              opacity: 0.2,
              left: 5 * scale,
              top: 5 * scale,
              transform: [{ rotate: "20deg" }],
            }} />
            <View style={{
              position: "absolute",
              width: 8 * scale,
              height: 0.3 * scale,
              backgroundColor: glowColor,
              opacity: 0.2,
              left: 12 * scale,
              top: 6 * scale,
              transform: [{ rotate: "-15deg" }],
            }} />

            {/* Laptop screen */}
            <View style={{
              position: "absolute",
              width: 20 * scale,
              height: 12 * scale,
              borderWidth: 1.5 * scale,
              borderColor: color,
              borderRadius: 2 * scale,
              left: 2 * scale,
              top: 3 * scale,
              backgroundColor: "transparent",
            }}>
              {/* Stellar grid */}
              {[0.25, 0.5, 0.75].map((pos, i) => (
                <React.Fragment key={i}>
                  <View style={{
                    position: "absolute",
                    width: "100%",
                    height: 0.3 * scale,
                    backgroundColor: glowColor,
                    opacity: 0.1,
                    top: pos * 12 * scale,
                  }} />
                  <View style={{
                    position: "absolute",
                    width: 0.3 * scale,
                    height: "100%",
                    backgroundColor: glowColor,
                    opacity: 0.1,
                    left: pos * 20 * scale,
                  }} />
                </React.Fragment>
              ))}
            </View>

            {/* Base */}
            <View style={{
              position: "absolute",
              width: 24 * scale,
              height: 1 * scale,
              backgroundColor: color,
              left: 0,
              bottom: 6 * scale,
            }} />

            {/* Keyboard */}
            <View style={{
              position: "absolute",
              width: 22 * scale,
              height: 4 * scale,
              borderWidth: 1 * scale,
              borderColor: color,
              backgroundColor: "transparent",
              left: 1 * scale,
              bottom: 1 * scale,
            }} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {renderVariant()}
    </View>
  );
};

// Simplified Server/Laptop icon for standard use
export const ServerIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: any) => {
  return (
    <EnvLaptopIcon
      size={size}
      color={color}
      glowColor={color}
      variant="quantum"
      {...props}
    />
  );
};

export const LaptopIcon = ServerIcon;