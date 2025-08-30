import React from "react";
import { View, StyleSheet } from "react-native";
import { gameUIColors } from "../src/shared/ui/gameUI/constants/gameUIColors";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: any;
}

// Core helper components with proper sizing
const PureSvg = ({
  width,
  height,
  viewBox,
  children,
  style,
  ...props
}: any) => {
  const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
  const scaleX = width / vbWidth;
  const scaleY = height / vbHeight;

  return (
    <View
      style={[
        {
          width,
          height,
          position: "relative",
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          transform: [{ scaleX }, { scaleY }],
          transformOrigin: "top left",
          width: vbWidth,
          height: vbHeight,
        }}
      >
        {children}
      </View>
    </View>
  );
};

const PureLine = ({ x1, y1, x2, y2, stroke, strokeWidth = 2 }: any) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <View
      style={{
        position: "absolute",
        left: x1,
        top: y1 - strokeWidth / 2,
        width: length,
        height: strokeWidth,
        backgroundColor: stroke,
        transform: [{ rotate: `${angle}deg` }],
        transformOrigin: "left center",
      }}
    />
  );
};

const PureCircle = ({ cx, cy, r, fill, stroke, strokeWidth = 2 }: any) => {
  const diameter = r * 2;
  return (
    <View
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - r,
        width: diameter,
        height: diameter,
        borderRadius: r,
        backgroundColor: fill || "transparent",
        borderColor: stroke,
        borderWidth: stroke ? strokeWidth : 0,
      }}
    />
  );
};

const PureRect = ({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth = 2,
  rx = 0,
}: any) => (
  <View
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      backgroundColor: fill || "transparent",
      borderColor: stroke,
      borderWidth: stroke ? strokeWidth : 0,
      borderRadius: rx,
    }}
  />
);

// IMPROVED WIFI ICON - Using cone shape for perfect WiFi arcs
export const WifiIcon = ({
  size = 1,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) => {
  const strength = 4;
  const scale = 45 / 60;
  strokeWidth = 3 * scale;
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
          zIndex: 10,
        }}
      />

      {/* Arcs with rotation to show more curve */}
      {strength >= 2 && (
        <View
          style={{
            position: "absolute",
            bottom: -8 * scale, // Move down to show more arc
            left: size / 2 - 10 * scale,
            transform: [{ rotate: "180deg" }], // Rotate to show bottom half
          }}
        >
          <View
            style={{
              width: 20 * scale,
              height: 20 * scale,
              borderRadius: 10 * scale,
              borderWidth: strokeWidth * scale,
              borderColor: color,
              borderTopColor: "transparent", // Hide top after rotation
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
            }}
          />
        </View>
      )}

      {strength >= 3 && (
        <View
          style={{
            position: "absolute",
            bottom: -14 * scale,
            left: size / 2 - 17 * scale,
            transform: [{ rotate: "180deg" }],
          }}
        >
          <View
            style={{
              width: 34 * scale,
              height: 34 * scale,
              borderRadius: 17 * scale,
              borderWidth: strokeWidth * scale,
              borderColor: color,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
            }}
          />
        </View>
      )}

      {strength >= 4 && (
        <View
          style={{
            position: "absolute",
            bottom: -22 * scale,
            left: size / 2 - 25 * scale,
            transform: [{ rotate: "180deg" }],
          }}
        >
          <View
            style={{
              width: 50 * scale,
              height: 50 * scale,
              borderRadius: 25 * scale,
              borderWidth: strokeWidth * scale,
              borderColor: color,
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
            }}
          />
        </View>
      )}
    </View>
  );
};

export const WifiOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Outer WiFi arc - perfect cone shape */}
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 5,
        width: 0,
        height: 0,
        borderLeftWidth: 9,
        borderLeftColor: "transparent",
        borderRightWidth: 9,
        borderRightColor: "transparent",
        borderBottomWidth: 8,
        borderBottomColor: color,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
      }}
    />

    {/* Middle WiFi arc with background to create gap */}
    <View
      style={{
        position: "absolute",
        left: 6.5,
        top: 9,
        width: 0,
        height: 0,
        borderLeftWidth: 5.5,
        borderLeftColor: "transparent",
        borderRightWidth: 5.5,
        borderRightColor: "transparent",
        borderBottomWidth: 5,
        borderBottomColor: "#f5f5f5",
        borderTopLeftRadius: 5.5,
        borderTopRightRadius: 5.5,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 9.5,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderLeftColor: "transparent",
        borderRightWidth: 5,
        borderRightColor: "transparent",
        borderBottomWidth: 4.5,
        borderBottomColor: color,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    />

    {/* Inner WiFi arc with background to create gap */}
    <View
      style={{
        position: "absolute",
        left: 9.5,
        top: 13,
        width: 0,
        height: 0,
        borderLeftWidth: 2.5,
        borderLeftColor: "transparent",
        borderRightWidth: 2.5,
        borderRightColor: "transparent",
        borderBottomWidth: 2.5,
        borderBottomColor: "#f5f5f5",
        borderTopLeftRadius: 2.5,
        borderTopRightRadius: 2.5,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 13.5,
        width: 0,
        height: 0,
        borderLeftWidth: 2,
        borderLeftColor: "transparent",
        borderRightWidth: 2,
        borderRightColor: "transparent",
        borderBottomWidth: 2,
        borderBottomColor: color,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
      }}
    />

    {/* WiFi signal dot */}
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 18,
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: color,
      }}
    />

    {/* Diagonal line through to indicate "off" */}
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 3,
        width: strokeWidth,
        height: 22,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
        transformOrigin: "top left",
      }}
    />
  </PureSvg>
);

// IMPROVED SETTINGS ICON - Better gear teeth
export const SettingsIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Center circle */}
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />

    {/* Gear teeth - top */}
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 1,
        width: 4,
        height: 5,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />

    {/* Gear teeth - bottom */}
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 18,
        width: 4,
        height: 5,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />

    {/* Gear teeth - left */}
    <View
      style={{
        position: "absolute",
        left: 1,
        top: 10,
        width: 5,
        height: 4,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />

    {/* Gear teeth - right */}
    <View
      style={{
        position: "absolute",
        left: 18,
        top: 10,
        width: 5,
        height: 4,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />

    {/* Diagonal teeth */}
    <View
      style={{
        position: "absolute",
        left: 5.5,
        top: 5.5,
        width: 3,
        height: 3,
        backgroundColor: color,
        borderRadius: 0.5,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 15.5,
        top: 5.5,
        width: 3,
        height: 3,
        backgroundColor: color,
        borderRadius: 0.5,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 5.5,
        top: 15.5,
        width: 3,
        height: 3,
        backgroundColor: color,
        borderRadius: 0.5,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 15.5,
        top: 15.5,
        width: 3,
        height: 3,
        backgroundColor: color,
        borderRadius: 0.5,
        transform: [{ rotate: "45deg" }],
      }}
    />
  </PureSvg>
);

// IMPROVED CLOUD ICON
export const CloudIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Main cloud body */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 11,
        width: 16,
        height: 8,
        borderRadius: 4,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Left bump */}
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 9,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Top bump */}
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Right bump */}
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 8,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Cover internal lines */}
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 11,
        width: 10,
        height: 6,
        backgroundColor: "white",
      }}
    />
  </PureSvg>
);

// IMPROVED PHONE ICON
export const PhoneIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Phone handset shape using curved path simulation */}
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 3,
        width: 14,
        height: 18,
        borderRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ rotate: "-25deg" }],
      }}
    />
    {/* Earpiece */}
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 5,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }}
    />
    {/* Mouthpiece */}
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 15,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

// IMPROVED VOLUME ICON
export const VolumeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Speaker cone */}
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 9,
        width: 4,
        height: 6,
        backgroundColor: color,
      }}
    />

    {/* Speaker triangle */}
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 8,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderLeftColor: color,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      }}
    />

    {/* Sound waves */}
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 9,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: "transparent",
        borderRightColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 15,
        top: 6,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: strokeWidth,
        borderColor: "transparent",
        borderRightColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// IMPROVED EYE ICON
export const EyeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Eye shape */}
    <View
      style={{
        position: "absolute",
        left: 1,
        top: 8,
        width: 22,
        height: 8,
        borderRadius: 11,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ scaleY: 2 }],
      }}
    />
    {/* Iris */}
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Pupil */}
    <PureCircle cx={12} cy={12} r={1} fill={color} />
  </PureSvg>
);

export const EyeOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Eye shape */}
    <View
      style={{
        position: "absolute",
        left: 1,
        top: 8,
        width: 22,
        height: 8,
        borderRadius: 11,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ scaleY: 2 }],
      }}
    />
    {/* Iris */}
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Diagonal line */}
    <PureLine
      x1={1}
      y1={1}
      x2={23}
      y2={23}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED REFRESH ICON
export const RefreshCwIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Top arc */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: strokeWidth,
        borderColor: color,
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        backgroundColor: "transparent",
        transform: [{ rotate: "-45deg" }],
      }}
    />

    {/* Bottom arc */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: strokeWidth,
        borderColor: color,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        backgroundColor: "transparent",
        transform: [{ rotate: "135deg" }],
      }}
    />

    {/* Top arrow */}
    <View
      style={{
        position: "absolute",
        left: 17,
        top: 3,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
      }}
    />

    {/* Bottom arrow */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 17,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: color,
      }}
    />
  </PureSvg>
);

// IMPROVED SHIELD ICON
export const ShieldIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Shield body */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 3,
        width: 16,
        height: 14,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Shield point */}
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 16,
        width: 2,
        height: 6,
        backgroundColor: color,
      }}
    />
    {/* Check mark */}
    <PureLine
      x1={8}
      y1={11}
      x2={11}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={14}
      x2={16}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED PALETTE ICON
export const PaletteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Palette shape */}
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Thumb hole */}
    <View
      style={{
        position: "absolute",
        left: 15,
        top: 15,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "white",
        borderWidth: strokeWidth,
        borderColor: color,
      }}
    />
    {/* Paint dots */}
    <PureCircle cx={7} cy={7} r={1.5} fill={color} />
    <PureCircle cx={14} cy={6} r={1.5} fill={color} />
    <PureCircle cx={6} cy={13} r={1.5} fill={color} />
    <PureCircle cx={11} cy={11} r={1.5} fill={color} />
  </PureSvg>
);

// IMPROVED HAND ICON
export const HandIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Palm */}
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 10,
        width: 12,
        height: 10,
        borderRadius: 6,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Fingers */}
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 5,
        width: 2.5,
        height: 8,
        borderRadius: 1.25,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 3,
        width: 2.5,
        height: 10,
        borderRadius: 1.25,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 4,
        width: 2.5,
        height: 9,
        borderRadius: 1.25,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 17,
        top: 7,
        width: 2.5,
        height: 7,
        borderRadius: 1.25,
        backgroundColor: color,
      }}
    />
    {/* Thumb */}
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 11,
        width: 2.5,
        height: 5,
        borderRadius: 1.25,
        backgroundColor: color,
        transform: [{ rotate: "-40deg" }],
      }}
    />
  </PureSvg>
);

// Copy all the rest of the existing icons from the original file...
// (I'll include the key ones that are visible in your screenshots)

export const ActivityIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={12}
      x2={7}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7}
      y1={12}
      x2={10}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={6}
      x2={14}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={18}
      x2={17}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={17}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const DatabaseIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const scale = 23 / 30;
  return (
    <View
      style={{
        width: size,
        height: size * 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Stack of cylinders */}
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            width: 24 * scale,
            height: 10 * scale,
            backgroundColor: color,
            borderRadius: 5 * scale,
            top: index * 10 * scale,
            opacity: 1 - index * 0.15,
          }}
        />
      ))}

      {/* Divider lines */}
      {[1, 2].map((index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            width: 24 * scale,
            height: 1 * scale,
            backgroundColor: "#fff",
            top: index * 10 * scale - 0.5 * scale,
          }}
        />
      ))}
    </View>
  );
};

export const BugIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const scale = 20 / 30;
  return (
    <View
      style={{
        width: size * 1.5,
        height: size * 1,
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
        {/* Bug body - oval shape */}
        <View
          style={{
            width: 20 * scale,
            height: 26 * scale,
            backgroundColor: color,
            borderRadius: 10 * scale,
            // Create oval/egg shape
            borderTopLeftRadius: 10 * scale,
            borderTopRightRadius: 10 * scale,
            borderBottomLeftRadius: 12 * scale,
            borderBottomRightRadius: 12 * scale,
          }}
        />

        {/* Head */}
        <View
          style={{
            position: "absolute",
            width: 12 * scale,
            height: 8 * scale,
            backgroundColor: color,
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
          }}
        />

        {/* Eyes (white dots on head) */}
        <View
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            backgroundColor: "#fff",
            borderRadius: 1.5 * scale,
            top: -2 * scale,
            left: 6 * scale,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 3 * scale,
            height: 3 * scale,
            backgroundColor: "#fff",
            borderRadius: 1.5 * scale,
            top: -2 * scale,
            right: 6 * scale,
          }}
        />

        {/* Legs - 6 total */}
        {[0, 1, 2].map((index) => (
          <React.Fragment key={index}>
            {/* Left leg */}
            <View
              style={{
                position: "absolute",
                width: 8 * scale,
                height: 2 * scale,
                backgroundColor: color,
                top: (6 + index * 6) * scale,
                left: -6 * scale,
                transform: [{ rotate: "-45deg" }],
              }}
            />
            {/* Right leg */}
            <View
              style={{
                position: "absolute",
                width: 8 * scale,
                height: 2 * scale,
                backgroundColor: color,
                top: (6 + index * 6) * scale,
                right: -6 * scale,
                transform: [{ rotate: "45deg" }],
              }}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
export const ServerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const scale = 20 / 30;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Screen */}
      <View
        style={{
          width: 28 * scale,
          height: 18 * scale,
          backgroundColor: color,
          borderRadius: 2 * scale,
          marginBottom: -2 * scale,
        }}
      />

      {/* Screen display */}
      <View
        style={{
          position: "absolute",
          width: 24 * scale,
          height: 14 * scale,
          backgroundColor: "#fff",
          borderRadius: 1 * scale,
          top: 11 * scale,
          opacity: 0.2,
        }}
      />

      {/* Base */}
      <View
        style={{
          width: 36 * scale,
          height: 3 * scale,
          backgroundColor: color,
          borderRadius: 1 * scale,
        }}
      />

      {/* Notch/opening indicator */}
      <View
        style={{
          position: "absolute",
          width: 8 * scale,
          height: 1 * scale,
          backgroundColor: "#fff",
          bottom: 17 * scale,
          opacity: 0.3,
        }}
      />
    </View>
  );
};

export const GlobeIcon = ({
  size = 24,
  color = gameUIColors.env,
  strokeWidth = 2,
  ...props
}: IconProps) => {
  color = gameUIColors.env;
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

export const XIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={6}
      y1={6}
      x2={18}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={6}
      x2={6}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED CHECK CIRCLE ICON
export const CheckCircle2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Check mark */}
    <PureLine
      x1={8}
      y1={12}
      x2={11}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={15}
      x2={16}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED X CIRCLE ICON
export const XCircleIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* X marks */}
    <PureLine
      x1={8}
      y1={8}
      x2={16}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={8}
      x2={8}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED FILE CODE ICON
export const FileCodeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* File body */}
    <PureRect
      x={4}
      y={2}
      width={12}
      height={20}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* File corner */}
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 2,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: color,
        borderTopColor: "transparent",
      }}
    />
    <PureLine
      x1={14}
      y1={6}
      x2={18}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Code brackets */}
    <PureLine
      x1={8}
      y1={10}
      x2={6}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={6}
      y1={12}
      x2={8}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={10}
      x2={14}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={12}
      x2={12}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED FILE TEXT ICON
export const FileTextIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* File body */}
    <PureRect
      x={4}
      y={2}
      width={12}
      height={20}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* File corner */}
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 2,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: color,
        borderTopColor: "transparent",
      }}
    />
    <PureLine
      x1={14}
      y1={6}
      x2={18}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Text lines */}
    <PureLine
      x1={7}
      y1={10}
      x2={13}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7}
      y1={13}
      x2={13}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7}
      y1={16}
      x2={10}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED FILE JSON ICON
export const FileJsonIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* File body */}
    <PureRect
      x={4}
      y={2}
      width={12}
      height={20}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* File corner */}
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 2,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: color,
        borderTopColor: "transparent",
      }}
    />
    <PureLine
      x1={14}
      y1={6}
      x2={18}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* JSON braces */}
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 10,
        width: 3,
        height: 8,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRightWidth: 0,
        backgroundColor: "transparent",
        borderRadius: 1,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 10,
        width: 3,
        height: 8,
        borderWidth: strokeWidth,
        borderColor: color,
        borderLeftWidth: 0,
        backgroundColor: "transparent",
        borderRadius: 1,
      }}
    />
  </PureSvg>
);

// IMPROVED TEST TUBE ICON
export const TestTube2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Test tube body */}
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 8,
        width: 6,
        height: 12,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Test tube top */}
    <PureRect
      x={7}
      y={3}
      width={10}
      height={3}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Liquid */}
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 15,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }}
    />
    {/* Bubble */}
    <PureCircle cx={11.5} cy={12} r={0.5} fill={color} />
  </PureSvg>
);

// IMPROVED FLASK ICON
export const FlaskConicalIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Flask neck */}
    <PureRect
      x={10}
      y={3}
      width={4}
      height={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Flask top */}
    <PureRect
      x={8}
      y={2}
      width={8}
      height={2}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Flask body (triangle shape) */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 9,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 11,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
        borderStyle: "solid",
      }}
    />
    {/* Inner triangle for outline effect */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 11,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 7,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "white",
        borderStyle: "solid",
      }}
    />
    {/* Liquid */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 15,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
        borderStyle: "solid",
      }}
    />
  </PureSvg>
);

// IMPROVED TRASH ICON
export const Trash2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Trash can body */}
    <PureRect
      x={5}
      y={7}
      width={14}
      height={14}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Top rim */}
    <PureLine
      x1={3}
      y1={7}
      x2={21}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Handle */}
    <PureRect
      x={9}
      y={3}
      width={6}
      height={4}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Vertical lines */}
    <PureLine
      x1={10}
      y1={11}
      x2={10}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={11}
      x2={14}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED HASH ICON
export const HashIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Horizontal lines */}
    <PureLine
      x1={4}
      y1={9}
      x2={20}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={15}
      x2={20}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Vertical lines */}
    <PureLine
      x1={10}
      y1={3}
      x2={8}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={3}
      x2={14}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED USERS ICON
export const UsersIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* First user head */}
    <PureCircle cx={9} cy={8} r={3} stroke={color} strokeWidth={strokeWidth} />
    {/* First user body */}
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 14,
        width: 10,
        height: 6,
        borderRadius: 5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    {/* Second user head */}
    <PureCircle cx={16} cy={7} r={2} stroke={color} strokeWidth={strokeWidth} />
    {/* Second user body */}
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 12,
        width: 6,
        height: 8,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// IMPROVED BOX ICON
export const BoxIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Box base */}
    <PureRect
      x={3}
      y={8}
      width={18}
      height={13}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Box top */}
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 3,
        width: 12,
        height: 8,
        backgroundColor: "transparent",
        borderWidth: strokeWidth,
        borderColor: color,
        transform: [{ skewX: "-30deg" }],
      }}
    />
    {/* Top face lines */}
    <PureLine
      x1={3}
      y1={8}
      x2={6}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={8}
      x2={18}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Center divide */}
    <PureLine
      x1={12}
      y1={8}
      x2={12}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED KEY ICON
export const KeyIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Key head */}
    <PureCircle cx={8} cy={8} r={6} stroke={color} strokeWidth={strokeWidth} />
    {/* Key shaft */}
    <PureLine
      x1={14}
      y1={8}
      x2={21}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Key teeth */}
    <PureLine
      x1={18}
      y1={12}
      x2={20}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={14}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Key hole */}
    <PureCircle cx={8} cy={8} r={2} fill={color} />
  </PureSvg>
);

// IMPROVED ROUTE ICON
export const RouteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Start point */}
    <PureCircle cx={6} cy={6} r={3} stroke={color} strokeWidth={strokeWidth} />
    {/* End point */}
    <PureCircle
      cx={18}
      cy={18}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Route path */}
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 6,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        backgroundColor: "transparent",
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 12,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        backgroundColor: "transparent",
        transform: [{ rotate: "45deg" }],
      }}
    />
  </PureSvg>
);

// IMPROVED TRIANGLE ALERT ICON
export const TriangleAlertIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Triangle */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 3,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 17,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
        borderStyle: "solid",
      }}
    />
    {/* Inner triangle for outline */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 5,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 13,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "white",
        borderStyle: "solid",
      }}
    />
    {/* Exclamation line */}
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 10,
        width: 2,
        height: 6,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
    {/* Exclamation dot */}
    <PureCircle cx={12} cy={18} r={1} fill={color} />
  </PureSvg>
);

// IMPROVED UNLOCK ICON
export const UnlockIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Lock body */}
    <PureRect
      x={6}
      y={11}
      width={12}
      height={10}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Open shackle */}
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 5,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        borderBottomColor: "transparent",
        backgroundColor: "transparent",
      }}
    />
    {/* Keyhole */}
    <PureCircle cx={12} cy={16} r={1.5} fill={color} />
  </PureSvg>
);

// IMPROVED IMAGE ICON
export const ImageIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Image frame */}
    <PureRect
      x={3}
      y={3}
      width={18}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Sun/circle */}
    <PureCircle
      cx={8.5}
      cy={8.5}
      r={1.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Mountain peaks */}
    <PureLine
      x1={3}
      y1={21}
      x2={9}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={15}
      x2={15}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={21}
      x2={21}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED FILM ICON
export const FilmIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Film strip */}
    <PureRect
      x={2}
      y={3}
      width={20}
      height={18}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Film holes left */}
    <PureRect x={4} y={5} width={2} height={2} fill={color} />
    <PureRect x={4} y={9} width={2} height={2} fill={color} />
    <PureRect x={4} y={13} width={2} height={2} fill={color} />
    <PureRect x={4} y={17} width={2} height={2} fill={color} />
    {/* Film holes right */}
    <PureRect x={18} y={5} width={2} height={2} fill={color} />
    <PureRect x={18} y={9} width={2} height={2} fill={color} />
    <PureRect x={18} y={13} width={2} height={2} fill={color} />
    <PureRect x={18} y={17} width={2} height={2} fill={color} />
    {/* Center frame */}
    <PureRect
      x={8}
      y={7}
      width={8}
      height={10}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED MUSIC ICON
export const MusicIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Music note stem */}
    <PureLine
      x1={9}
      y1={18}
      x2={9}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={15}
      x2={16}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Connection line */}
    <PureLine
      x1={9}
      y1={5}
      x2={16}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={9}
      x2={16}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Note heads */}
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 16,
        width: 6,
        height: 4,
        borderRadius: 3,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 13,
        width: 6,
        height: 4,
        borderRadius: 3,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

// IMPROVED TIMER ICON
export const TimerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Clock face */}
    <PureCircle
      cx={12}
      cy={13}
      r={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Wind-up key */}
    <PureLine
      x1={10}
      y1={2}
      x2={14}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={2}
      x2={12}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Clock hands */}
    <PureLine
      x1={12}
      y1={13}
      x2={12}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={13}
      x2={15}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Center dot */}
    <PureCircle cx={12} cy={13} r={1} fill={color} />
  </PureSvg>
);

// IMPROVED SMARTPHONE ICON
export const SmartphoneIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Phone body */}
    <PureRect
      x={7}
      y={2}
      width={10}
      height={20}
      rx={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Screen */}
    <PureRect
      x={9}
      y={4}
      width={6}
      height={14}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Home button */}
    <PureCircle cx={12} cy={20} r={1} fill={color} />
  </PureSvg>
);

// IMPROVED LAYERS ICON
export const LayersIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Bottom layer */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 16,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: color,
      }}
    />
    {/* Middle layer */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 12,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: color,
      }}
    />
    {/* Top layer */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 8,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: color,
      }}
    />
  </PureSvg>
);

// IMPROVED NAVIGATION ICON
export const NavigationIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Compass needle */}
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 3,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 18,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
        transform: [{ rotate: "15deg" }],
      }}
    />
    {/* Center point */}
    <PureCircle cx={12} cy={12} r={1.5} fill={color} />
  </PureSvg>
);

// IMPROVED TOUCHPAD ICON
export const TouchpadIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Trackpad body */}
    <PureRect
      x={3}
      y={6}
      width={18}
      height={12}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Center divider */}
    <PureLine
      x1={12}
      y1={14}
      x2={12}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Touch area */}
    <PureRect
      x={6}
      y={9}
      width={12}
      height={5}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// IMPROVED BAR CHART ICON
export const AlertCircleIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={8}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 15,
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

export const AlertTriangleIcon = TriangleAlertIcon;

export const CheckIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={5}
      y1={12}
      x2={10}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={17}
      x2={19}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CheckCircleIcon = CheckCircle2Icon;

export const ChevronDownIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={6}
      y1={9}
      x2={12}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={15}
      x2={18}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ChevronLeftIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={15}
      y1={6}
      x2={9}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={12}
      x2={15}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ChevronRightIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={9}
      y1={6}
      x2={15}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={12}
      x2={9}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ChevronUpIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={6}
      y1={15}
      x2={12}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={9}
      x2={18}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ClockIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={6}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={16}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CopyIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={8}
      y={8}
      width={12}
      height={12}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 12,
        height: 12,
        borderRadius: 1,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

export const DownloadIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={3}
      x2={12}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={11}
      x2={12}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={11}
      x2={12}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={17}
      x2={20}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={17}
      x2={4}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={17}
      x2={20}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={21}
      x2={20}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const FilterIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 4,
        width: 14,
        height: 3,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 10,
        width: 10,
        height: 3,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 16,
        width: 6,
        height: 3,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

export const GitBranchIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={6}
      y1={3}
      x2={6}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={6} cy={18} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={18} cy={6} r={3} stroke={color} strokeWidth={strokeWidth} />
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 8,
        width: 9,
        height: strokeWidth,
        backgroundColor: color,
        transform: [{ rotate: "-30deg" }],
        transformOrigin: "left center",
      }}
    />
  </PureSvg>
);

export const LinkIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 7,
        width: 7,
        height: 10,
        borderRadius: 3.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ rotate: "-45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 7,
        width: 7,
        height: 10,
        borderRadius: 3.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ rotate: "45deg" }],
      }}
    />
  </PureSvg>
);

export const PauseIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect x={6} y={4} width={4} height={16} rx={1} fill={color} />
    <PureRect x={14} y={4} width={4} height={16} rx={1} fill={color} />
  </PureSvg>
);

export const PlayIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 4,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: color,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      }}
    />
  </PureSvg>
);

export const PlusIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={5}
      x2={12}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={12}
      x2={19}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const TrashIcon = Trash2Icon;

export const UploadIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={15}
      x2={12}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={7}
      x2={12}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={7}
      x2={12}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={17}
      x2={20}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={17}
      x2={4}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={17}
      x2={20}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={21}
      x2={20}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ZapIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 2,
        width: 0,
        height: 0,
        borderRightWidth: 6,
        borderBottomWidth: 10,
        borderRightColor: "transparent",
        borderBottomColor: color,
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 12,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderTopWidth: 10,
        borderLeftColor: "transparent",
        borderTopColor: color,
      }}
    />
    <PureLine
      x1={13}
      y1={2}
      x2={11}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={10}
      x2={13}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const UserIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={12} cy={7} r={4} stroke={color} strokeWidth={strokeWidth} />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 14,
        width: 14,
        height: 7,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        borderBottomColor: "transparent",
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

export const LockIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={5}
      y={11}
      width={14}
      height={10}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 4,
        width: 10,
        height: 9,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderWidth: strokeWidth,
        borderColor: color,
        borderBottomColor: "transparent",
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 15,
        width: 2,
        height: 3,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

export const PowerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={2}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 7,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        borderTopColor: "transparent",
        backgroundColor: "transparent",
        transform: [{ rotate: "40deg" }],
      }}
    />
  </PureSvg>
);

export const SearchIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={11}
      cy={11}
      r={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16.5}
      y1={16.5}
      x2={21}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const InfoIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={11}
      x2={12}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 7,
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: color,
      }}
    />
  </PureSvg>
);

export const MinusIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={5}
      y1={12}
      x2={19}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const BarChart3Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Y axis */}
    <PureLine
      x1={3}
      y1={3}
      x2={3}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* X axis */}
    <PureLine
      x1={3}
      y1={21}
      x2={21}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Bars */}
    <PureRect x={7} y={12} width={3} height={9} fill={color} />
    <PureRect x={12} y={8} width={3} height={13} fill={color} />
    <PureRect x={17} y={15} width={3} height={6} fill={color} />
  </PureSvg>
);

// IMPROVED HARD DRIVE ICON
export const HardDriveIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    {/* Drive body */}
    <PureRect
      x={3}
      y={6}
      width={18}
      height={12}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Drive separator */}
    <PureLine
      x1={3}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Power LED */}
    <PureCircle cx={6} cy={15} r={1} fill={color} />
    {/* Activity LED */}
    <PureCircle cx={9} cy={15} r={0.5} fill={color} />
    {/* Cables */}
    <PureLine
      x1={18}
      y1={9}
      x2={21}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={15}
      x2={21}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

const styles = StyleSheet.create({
  cone: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderTopWidth: 50,
    borderTopColor: "#059669",
    borderRadius: 25,
  },
});
