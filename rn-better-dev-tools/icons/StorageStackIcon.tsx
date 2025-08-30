import React from "react";
import { View, ViewStyle } from "react-native";

interface StorageStackIconProps {
  size?: number;
  color?: string;
  glowColor?: string;
  colorPreset?: "yellow" | "cyan" | "green" | "purple" | "pink" | "orange";
}

const ColorPresets = {
  yellow: { color: "#FFD700", glow: "#FFD700" },
  cyan: { color: "#00D4FF", glow: "#00D4FF" },
  green: { color: "#00FF88", glow: "#00FF88" },
  purple: { color: "#9945FF", glow: "#9945FF" },
  pink: { color: "#FF45FF", glow: "#FF45FF" },
  orange: { color: "#FF8800", glow: "#FF8800" },
};

export const StorageStackIcon: React.FC<StorageStackIconProps> = ({
  size = 24,
  color,
  glowColor,
  colorPreset = "yellow",
}) => {
  const scale = size / 24;
  
  // Use preset colors if no custom colors provided
  const activeColor = color || ColorPresets[colorPreset].color;
  const activeGlow = glowColor || ColorPresets[colorPreset].glow;

  return (
    <View style={{ width: size, height: size, position: "relative" } as ViewStyle}>
      {/* Background glow effect */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: activeGlow,
          opacity: 0.05,
        } as ViewStyle}
      />
      
      {/* Outer ring glow */}
      <View
        style={{
          position: "absolute",
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: (size * 0.9) / 2,
          borderWidth: 0.5 * scale,
          borderColor: activeGlow,
          opacity: 0.1,
          left: size * 0.05,
          top: size * 0.05,
        } as ViewStyle}
      />
      
      {/* Starry particles around the edges */}
      {[
        { x: 0.1, y: 0.1, size: 1 },
        { x: 0.9, y: 0.1, size: 1.2 },
        { x: 0.05, y: 0.3, size: 0.8 },
        { x: 0.95, y: 0.35, size: 1 },
        { x: 0.08, y: 0.6, size: 1.2 },
        { x: 0.92, y: 0.65, size: 0.8 },
        { x: 0.15, y: 0.85, size: 1 },
        { x: 0.85, y: 0.9, size: 1.2 },
        { x: 0.05, y: 0.5, size: 0.6 },
        { x: 0.95, y: 0.55, size: 0.6 },
        { x: 0.12, y: 0.95, size: 0.8 },
        { x: 0.88, y: 0.08, size: 0.8 },
      ].map((star, i) => (
        <View
          key={`star-${i}`}
          style={{
            position: "absolute",
            width: star.size * scale,
            height: star.size * scale,
            borderRadius: (star.size * scale) / 2,
            backgroundColor: activeGlow,
            left: star.x * size - (star.size * scale) / 2,
            top: star.y * size - (star.size * scale) / 2,
            opacity: 0.3 + (i % 3) * 0.2,
          } as ViewStyle}
        />
      ))}
      
      {/* Additional tiny stars for depth */}
      {[
        { x: 0.18, y: 0.05, size: 0.4 },
        { x: 0.82, y: 0.03, size: 0.4 },
        { x: 0.03, y: 0.2, size: 0.3 },
        { x: 0.97, y: 0.25, size: 0.4 },
        { x: 0.02, y: 0.75, size: 0.3 },
        { x: 0.98, y: 0.8, size: 0.4 },
        { x: 0.08, y: 0.92, size: 0.3 },
        { x: 0.92, y: 0.95, size: 0.3 },
      ].map((star, i) => (
        <View
          key={`tiny-star-${i}`}
          style={{
            position: "absolute",
            width: star.size * scale,
            height: star.size * scale,
            borderRadius: (star.size * scale) / 2,
            backgroundColor: activeGlow,
            left: star.x * size - (star.size * scale) / 2,
            top: star.y * size - (star.size * scale) / 2,
            opacity: 0.2 + (i % 2) * 0.1,
          } as ViewStyle}
        />
      ))}
      
      {/* Three database cylinders stacked */}
      {[0.15, 0.4, 0.65].map((y, index) => (
        <React.Fragment key={index}>
          {/* Cylinder shadow/glow */}
          <View
            style={{
              position: "absolute",
              width: 18 * scale,
              height: 8 * scale,
              borderRadius: 4 * scale,
              backgroundColor: activeGlow,
              left: 3 * scale,
              top: y * size - scale,
              opacity: 0.1,
            } as ViewStyle}
          />
          
          {/* Main cylinder body */}
          <View
            style={{
              position: "absolute",
              width: 16 * scale,
              height: 6 * scale,
              borderRadius: 3 * scale,
              backgroundColor: activeColor,
              left: 4 * scale,
              top: y * size,
              opacity: 0.9 - index * 0.1,
            } as ViewStyle}
          />
          
          {/* Top surface highlight */}
          <View
            style={{
              position: "absolute",
              width: 14 * scale,
              height: 2 * scale,
              borderRadius: 1 * scale,
              backgroundColor: "#fff",
              left: 5 * scale,
              top: y * size + 0.5 * scale,
              opacity: 0.15,
            } as ViewStyle}
          />
          
          {/* Side edge glow */}
          <View
            style={{
              position: "absolute",
              width: 16 * scale,
              height: 6 * scale,
              borderRadius: 3 * scale,
              borderWidth: 0.5 * scale,
              borderColor: activeGlow,
              backgroundColor: "transparent",
              left: 4 * scale,
              top: y * size,
              opacity: 0.3,
            } as ViewStyle}
          />
        </React.Fragment>
      ))}
      
      {/* Connection lines between layers */}
      {[0.275, 0.525].map((y, i) => (
        <View
          key={`connection-${i}`}
          style={{
            position: "absolute",
            width: 0.5 * scale,
            height: 6 * scale,
            backgroundColor: activeGlow,
            left: size / 2 - 0.25 * scale,
            top: y * size,
            opacity: 0.3,
          } as ViewStyle}
        />
      ))}
      
      {/* Circuit nodes around stack */}
      {[
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.2 },
        { x: 0.15, y: 0.5 },
        { x: 0.85, y: 0.5 },
        { x: 0.2, y: 0.8 },
        { x: 0.8, y: 0.8 },
      ].map((node, i) => (
        <React.Fragment key={`node-${i}`}>
          {/* Node connection line */}
          <View
            style={{
              position: "absolute",
              width: Math.abs(0.5 - node.x) * size,
              height: 0.3 * scale,
              backgroundColor: activeGlow,
              left: Math.min(node.x * size, size / 2),
              top: node.y * size,
              opacity: 0.1,
            } as ViewStyle}
          />
          
          {/* Node point */}
          <View
            style={{
              position: "absolute",
              width: 2 * scale,
              height: 2 * scale,
              borderRadius: 1 * scale,
              backgroundColor: activeGlow,
              left: node.x * size - scale,
              top: node.y * size - scale,
              opacity: 0.5,
            } as ViewStyle}
          />
        </React.Fragment>
      ))}
      
      {/* Data dots on cylinders */}
      {[0.15, 0.4, 0.65].map((y, layerIndex) => 
        [0.35, 0.5, 0.65].map((x, i) => (
          <View
            key={`dot-${layerIndex}-${i}`}
            style={{
              position: "absolute",
              width: 1 * scale,
              height: 1 * scale,
              borderRadius: 0.5 * scale,
              backgroundColor: activeGlow,
              left: x * size,
              top: y * size + 2.5 * scale,
              opacity: 0.6,
            } as ViewStyle}
          />
        ))
      )}
    </View>
  );
};