import React from "react";
import { View } from "react-native";

interface WifiIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  variant?: "nodes" | "grid";
  strength?: 0 | 1 | 2 | 3 | 4;
}

export const WifiCircuitIcon: React.FC<WifiIconProps> = ({
  size = 24,
  color = "#00D4FF",
  glowColor = "#00D4FF",
  variant = "nodes",
  strength = 4,
}) => {
  const scale = size / 60;
  const strokeWidth = 2.5 * scale;
  const isOff = strength === 0;
  const activeColor = isOff ? "#333" : color;
  const activeGlow = isOff ? "#333" : glowColor;

  const renderVariant = () => {
    switch (variant) {
      case "nodes":
        return (
          <>
            {/* Connected circuit nodes forming a network */}
            {strength > 0 && (
              <>
                {/* Connection lines */}
                <View style={{
                  position: "absolute",
                  width: size * 0.4,
                  height: 0.5 * scale,
                  backgroundColor: activeGlow,
                  opacity: 0.2,
                  left: size * 0.3,
                  top: size * 0.25,
                  transform: [{ rotate: "20deg" }],
                }} />
                <View style={{
                  position: "absolute",
                  width: size * 0.4,
                  height: 0.5 * scale,
                  backgroundColor: activeGlow,
                  opacity: 0.2,
                  left: size * 0.3,
                  top: size * 0.25,
                  transform: [{ rotate: "-20deg" }],
                }} />
                <View style={{
                  position: "absolute",
                  width: 0.5 * scale,
                  height: size * 0.3,
                  backgroundColor: activeGlow,
                  opacity: 0.2,
                  left: size / 2 - 0.25 * scale,
                  top: size * 0.25,
                }} />
              </>
            )}

            {/* Network nodes */}
            {[
              { x: size * 0.5, y: size * 0.25, size: 3, opacity: 1 },
              { x: size * 0.3, y: size * 0.35, size: 2, opacity: 0.8 },
              { x: size * 0.7, y: size * 0.35, size: 2, opacity: 0.8 },
              { x: size * 0.2, y: size * 0.45, size: 1.5, opacity: 0.6 },
              { x: size * 0.8, y: size * 0.45, size: 1.5, opacity: 0.6 },
              { x: size * 0.5, y: size * 0.5, size: 2.5, opacity: 0.9 },
            ].map((node, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  width: node.size * scale,
                  height: node.size * scale,
                  borderRadius: node.size * scale / 2,
                  backgroundColor: activeColor,
                  left: node.x - node.size * scale / 2,
                  top: node.y - node.size * scale / 2,
                  opacity: node.opacity * (strength / 4),
                }}
              />
            ))}

            {/* WiFi Arcs */}
            {strength >= 2 && (
              <View style={{
                position: "absolute",
                bottom: -8 * scale,
                left: size / 2 - 10 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 20 * scale,
                  height: 20 * scale,
                  borderRadius: 10 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {strength >= 3 && (
              <View style={{
                position: "absolute",
                bottom: -14 * scale,
                left: size / 2 - 17 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 34 * scale,
                  height: 34 * scale,
                  borderRadius: 17 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {strength >= 4 && (
              <View style={{
                position: "absolute",
                bottom: -22 * scale,
                left: size / 2 - 25 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 50 * scale,
                  height: 50 * scale,
                  borderRadius: 25 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {/* Center node */}
            <View style={{
              position: "absolute",
              width: 5 * scale,
              height: 5 * scale,
              borderRadius: 2.5 * scale,
              backgroundColor: activeColor,
              bottom: 0,
              left: size / 2 - 2.5 * scale,
              zIndex: 10,
            }} />
          </>
        );

      case "grid":
        return (
          <>
            {/* Grid pattern background */}
            {strength > 0 && (
              <>
                {/* Horizontal lines */}
                {[0.2, 0.35, 0.5, 0.65].map((y, i) => (
                  <View
                    key={`h-${i}`}
                    style={{
                      position: "absolute",
                      width: size * 0.7,
                      height: 0.5 * scale,
                      backgroundColor: activeGlow,
                      opacity: 0.1,
                      left: size * 0.15,
                      top: size * y,
                    }}
                  />
                ))}
                {/* Vertical lines */}
                {[0.25, 0.4, 0.5, 0.6, 0.75].map((x, i) => (
                  <View
                    key={`v-${i}`}
                    style={{
                      position: "absolute",
                      width: 0.5 * scale,
                      height: size * 0.5,
                      backgroundColor: activeGlow,
                      opacity: 0.1,
                      left: size * x,
                      top: size * 0.2,
                    }}
                  />
                ))}
                {/* Grid intersection points */}
                {[
                  { x: 0.25, y: 0.35 },
                  { x: 0.5, y: 0.35 },
                  { x: 0.75, y: 0.35 },
                  { x: 0.4, y: 0.5 },
                  { x: 0.6, y: 0.5 },
                ].map((point, i) => (
                  <View
                    key={`p-${i}`}
                    style={{
                      position: "absolute",
                      width: 2 * scale,
                      height: 2 * scale,
                      borderRadius: 1 * scale,
                      backgroundColor: activeGlow,
                      left: size * point.x - 1 * scale,
                      top: size * point.y - 1 * scale,
                      opacity: 0.4,
                    }}
                  />
                ))}
              </>
            )}

            {/* WiFi Arcs */}
            {strength >= 2 && (
              <View style={{
                position: "absolute",
                bottom: -8 * scale,
                left: size / 2 - 10 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 20 * scale,
                  height: 20 * scale,
                  borderRadius: 10 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {strength >= 3 && (
              <View style={{
                position: "absolute",
                bottom: -14 * scale,
                left: size / 2 - 17 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 34 * scale,
                  height: 34 * scale,
                  borderRadius: 17 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {strength >= 4 && (
              <View style={{
                position: "absolute",
                bottom: -22 * scale,
                left: size / 2 - 25 * scale,
                transform: [{ rotate: "180deg" }],
              }}>
                <View style={{
                  width: 50 * scale,
                  height: 50 * scale,
                  borderRadius: 25 * scale,
                  borderWidth: strokeWidth,
                  borderColor: activeColor,
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }} />
              </View>
            )}

            {/* Grid center dot */}
            <View style={{
              position: "absolute",
              width: 4 * scale,
              height: 4 * scale,
              borderRadius: 2 * scale,
              backgroundColor: activeColor,
              bottom: 0.5 * scale,
              left: size / 2 - 2 * scale,
              zIndex: 10,
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

// Simplified version for standard use (matching lucide-icons interface)
export const WifiIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: any) => {
  return (
    <WifiCircuitIcon
      size={size}
      color={color}
      glowColor={color}
      variant="nodes"
      strength={4}
      {...props}
    />
  );
};

export const WifiOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: any) => {
  return (
    <WifiCircuitIcon
      size={size}
      color={color}
      glowColor={color}
      variant="nodes"
      strength={0}
      {...props}
    />
  );
};