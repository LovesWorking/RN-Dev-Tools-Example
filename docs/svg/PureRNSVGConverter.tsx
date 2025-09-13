/**
 * Pure React Native SVG Converter
 * Converts SVG elements to pure React Native Views without native dependencies
 */

import { View, Text, Image } from "react-native";

// ============================================================================
// Base Components - Building blocks for SVG elements
// ============================================================================

interface PureCircleProps {
  cx: number;
  cy: number;
  r: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export const PureCircle: React.FC<PureCircleProps> = ({
  cx,
  cy,
  r,
  stroke,
  strokeWidth = 0,
  fill = "transparent",
}) => {
  const diameter = r * 2;
  return (
    <View
      style={{
        position: "absolute",
        left: cx - r - strokeWidth / 2,
        top: cy - r - strokeWidth / 2,
        width: diameter,
        height: diameter,
        borderRadius: r,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth,
      }}
    />
  );
};

interface PureLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth?: number;
}

export const PureLine: React.FC<PureLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth = 2,
}) => {
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
      }}
    />
  );
};

interface PureRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

export const PureRect: React.FC<PureRectProps> = ({
  x,
  y,
  width,
  height,
  rx = 0,
  ry,
  stroke,
  strokeWidth = 0,
  fill = "transparent",
}) => (
  <View
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      backgroundColor: fill,
      borderRadius: rx || ry || 0,
      borderColor: stroke,
      borderWidth: strokeWidth,
    }}
  />
);

interface PurePolylineProps {
  points: string;
  stroke: string;
  strokeWidth?: number;
}

export const PurePolyline: React.FC<PurePolylineProps> = ({
  points,
  stroke,
  strokeWidth = 2,
}) => {
  const pointsArray = points.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  const lines: React.ReactElement[] = [];

  for (let i = 0; i < pointsArray.length - 1; i++) {
    lines.push(
      <PureLine
        key={i}
        x1={pointsArray[i].x}
        y1={pointsArray[i].y}
        x2={pointsArray[i + 1].x}
        y2={pointsArray[i + 1].y}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }

  return <>{lines}</>;
};

interface PurePolygonProps {
  points: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const PurePolygon: React.FC<PurePolygonProps> = ({
  points,
  fill = "transparent",
  stroke,
  strokeWidth = 0,
}) => {
  // Parse points
  const pointsArray = points.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });

  // For triangles only - CSS triangle technique
  if (pointsArray.length === 3) {
    // Calculate triangle dimensions
    const minX = Math.min(...pointsArray.map((p) => p.x));
    const maxX = Math.max(...pointsArray.map((p) => p.x));
    const minY = Math.min(...pointsArray.map((p) => p.y));
    const maxY = Math.max(...pointsArray.map((p) => p.y));
    const width = maxX - minX;
    const height = maxY - minY;

    return (
      <View
        style={{
          position: "absolute",
          left: minX,
          top: minY,
          width: 0,
          height: 0,
          borderLeftWidth: width / 2,
          borderRightWidth: width / 2,
          borderBottomWidth: height,
          borderStyle: "solid",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: fill || stroke,
        }}
      />
    );
  }

  // For other polygons, draw outline with lines
  const lines: React.ReactElement[] = [];
  for (let i = 0; i < pointsArray.length; i++) {
    const next = (i + 1) % pointsArray.length;
    lines.push(
      <PureLine
        key={i}
        x1={pointsArray[i].x}
        y1={pointsArray[i].y}
        x2={pointsArray[next].x}
        y2={pointsArray[next].y}
        stroke={stroke || "black"}
        strokeWidth={strokeWidth}
      />
    );
  }

  return <>{lines}</>;
};

// ============================================================================
// Path Parser - Converts simple SVG paths to line segments
// ============================================================================

interface PathSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function parseSimplePath(d: string): PathSegment[] | null {
  const commands = d.match(/[MLHVZmlhvz][^MLHVZmlhvz]*/gi);
  if (!commands) return null;

  const segments: PathSegment[] = [];
  let currentX = 0,
    currentY = 0;
  let startX = 0,
    startY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const isRelative = type === type.toLowerCase();
    const args = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter((a) => a)
      .map(Number);

    switch (type.toUpperCase()) {
      case "M": // Move to
        if (isRelative) {
          currentX += args[0];
          currentY += args[1];
        } else {
          currentX = args[0];
          currentY = args[1];
        }
        startX = currentX;
        startY = currentY;

        // Handle implicit line commands after M
        for (let i = 2; i < args.length; i += 2) {
          const nextX = isRelative ? currentX + args[i] : args[i];
          const nextY = isRelative ? currentY + args[i + 1] : args[i + 1];
          segments.push({
            x1: currentX,
            y1: currentY,
            x2: nextX,
            y2: nextY,
          });
          currentX = nextX;
          currentY = nextY;
        }
        break;

      case "L": // Line to
        for (let i = 0; i < args.length; i += 2) {
          const nextX = isRelative ? currentX + args[i] : args[i];
          const nextY = isRelative ? currentY + args[i + 1] : args[i + 1];
          segments.push({
            x1: currentX,
            y1: currentY,
            x2: nextX,
            y2: nextY,
          });
          currentX = nextX;
          currentY = nextY;
        }
        break;

      case "H": // Horizontal line
        for (const x of args) {
          const nextX = isRelative ? currentX + x : x;
          segments.push({
            x1: currentX,
            y1: currentY,
            x2: nextX,
            y2: currentY,
          });
          currentX = nextX;
        }
        break;

      case "V": // Vertical line
        for (const y of args) {
          const nextY = isRelative ? currentY + y : y;
          segments.push({
            x1: currentX,
            y1: currentY,
            x2: currentX,
            y2: nextY,
          });
          currentY = nextY;
        }
        break;

      case "Z": // Close path
        if (currentX !== startX || currentY !== startY) {
          segments.push({
            x1: currentX,
            y1: currentY,
            x2: startX,
            y2: startY,
          });
          currentX = startX;
          currentY = startY;
        }
        break;

      default:
        // Unsupported command (curves, arcs, etc.)
        console.warn(`Unsupported SVG path command: ${type}`);
        return null;
    }
  }

  return segments;
}

interface PurePathProps {
  d: string;
  stroke?: string;
  strokeWidth?: number;
}

export const PurePath: React.FC<PurePathProps> = ({
  d,
  stroke = "black",
  strokeWidth = 2,
}) => {
  const segments = parseSimplePath(d);

  if (!segments) {
    return (
      <View style={{ padding: 10, backgroundColor: "#f0f0f0" }}>
        <Text style={{ fontSize: 10, color: "#666" }}>
          Complex path not supported
        </Text>
      </View>
    );
  }

  return (
    <>
      {segments.map((seg, index) => (
        <PureLine
          key={index}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ))}
    </>
  );
};

// ============================================================================
// Icon Wrapper Component
// ============================================================================

interface PureSvgProps {
  width: number;
  height: number;
  viewBox?: string;
  children: React.ReactNode;
}

export const PureSvg: React.FC<PureSvgProps> = ({
  width,
  height,
  viewBox,
  children,
}) => {
  // Parse viewBox for scaling
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (viewBox) {
    const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
    const scaleX = width / vw;
    const scaleY = height / vh;
    scale = Math.min(scaleX, scaleY);
    translateX = -vx * scale;
    translateY = -vy * scale;
  }

  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <View
        style={{
          transform: [{ translateX }, { translateY }, { scale }],
        }}
      >
        {children}
      </View>
    </View>
  );
};

// ============================================================================
// Example Icon Implementations
// ============================================================================

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const PlusIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="M5 12h14" stroke={color} strokeWidth={strokeWidth} />
    <PurePath d="M12 5v14" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const CheckIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="M20 6 9 17l-5-5" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const XIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="M18 6 6 18" stroke={color} strokeWidth={strokeWidth} />
    <PurePath d="m6 6 12 12" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const MinusIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="M5 12h14" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const AlertCircleIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
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
    <PureLine
      x1={12}
      y1={16}
      x2={12.01}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CheckCircleIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="m9 12 2 2 4-4" stroke={color} strokeWidth={strokeWidth} />
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ChevronDownIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="m6 9 6 6 6-6" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const ChevronUpIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="m18 15-6-6-6 6" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const ChevronLeftIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="m15 18-6-6 6-6" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const ChevronRightIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="m9 18 6-6-6-6" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const HashIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
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

export const PauseIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PureRect
      x={14}
      y={3}
      width={5}
      height={18}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={5}
      y={3}
      width={5}
      height={18}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const InfoIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    <PurePath d="M12 16v-4" stroke={color} strokeWidth={strokeWidth} />
    <PurePath d="M12 8h.01" stroke={color} strokeWidth={strokeWidth} />
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// ============================================================================
// Network, Storage, and Infrastructure Icons
// ============================================================================

export const WifiIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => {
  return (
    <PureSvg width={size} height={size} viewBox="0 0 24 24">
      {/* WiFi signal waves - using arcs approximated with lines */}
      {/* Outer wave */}
      <PurePath
        d="M2 8.82a15 15 0 0 1 20 0"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Middle wave */}
      <PurePath
        d="M5 12.859a10 10 0 0 1 14 0"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Inner wave */}
      <PurePath
        d="M8.5 16.429a5 5 0 0 1 7 0"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Signal dot */}
      <PureCircle
        cx={12}
        cy={20}
        r={0.5}
        fill={color}
        stroke={color}
        strokeWidth={0}
      />
    </PureSvg>
  );
};

export const WifiOffIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* WiFi waves (partial) */}
    <PurePath
      d="M8.5 16.429a5 5 0 0 1 7 0"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PurePath
      d="M5 12.859a10 10 0 0 1 5.17-2.69"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PurePath
      d="M19 12.859a10 10 0 0 0-2.007-1.523"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Signal dot */}
    <PureCircle
      cx={12}
      cy={20}
      r={0.5}
      fill={color}
      stroke={color}
      strokeWidth={0}
    />
    {/* Slash line */}
    <PurePath d="m2 2 20 20" stroke={color} strokeWidth={strokeWidth} />
  </PureSvg>
);

export const DatabaseIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => {
  const scale = size / 24;

  return (
    <PureSvg width={size} height={size} viewBox="0 0 24 24">
      {/* Database cylinder shape - simplified version */}
      {/* Top ellipse */}
      <View
        style={{
          position: "absolute",
          left: 3 * scale,
          top: 5 * scale,
          width: 18 * scale,
          height: 6 * scale,
          borderRadius: 9 * scale,
          borderColor: color,
          borderWidth: strokeWidth,
          backgroundColor: "transparent",
        }}
      />
      {/* Middle section */}
      <PureLine
        x1={3}
        y1={8}
        x2={3}
        y2={16}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={21}
        y1={8}
        x2={21}
        y2={16}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Middle ellipse */}
      <View
        style={{
          position: "absolute",
          left: 3 * scale,
          top: 12 * scale,
          width: 18 * scale,
          height: 6 * scale,
          borderRadius: 9 * scale,
          borderColor: color,
          borderWidth: strokeWidth,
          backgroundColor: "transparent",
        }}
      />
      {/* Bottom section */}
      <PureLine
        x1={3}
        y1={15}
        x2={3}
        y2={19}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={21}
        y1={15}
        x2={21}
        y2={19}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Bottom curve */}
      <View
        style={{
          position: "absolute",
          left: 3 * scale,
          top: 16 * scale,
          width: 18 * scale,
          height: 6 * scale,
          borderRadius: 9 * scale,
          borderColor: color,
          borderWidth: strokeWidth,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        }}
      />
    </PureSvg>
  );
};

export const ServerIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Top server unit */}
    <PureRect
      x={2}
      y={2}
      width={20}
      height={8}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Bottom server unit */}
    <PureRect
      x={2}
      y={14}
      width={20}
      height={8}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Server indicators - dots */}
    <PureCircle cx={6} cy={6} r={0.5} fill={color} />
    <PureCircle cx={6} cy={18} r={0.5} fill={color} />
  </PureSvg>
);

export const HardDriveIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Hard drive body - simplified as rectangle */}
    <PureRect
      x={2}
      y={4}
      width={20}
      height={16}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Divider line */}
    <PureLine
      x1={2}
      y1={12}
      x2={22}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Status indicators */}
    <PureCircle cx={6} cy={16} r={0.5} fill={color} />
    <PureCircle cx={10} cy={16} r={0.5} fill={color} />
  </PureSvg>
);

export const GlobeIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Globe circle */}
    <PureCircle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Equator line */}
    <PureLine
      x1={2}
      y1={12}
      x2={22}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Meridian - approximated with ellipse shape using border radius */}
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 2,
        width: 10,
        height: 20,
        borderRadius: 5,
        borderColor: color,
        borderWidth: strokeWidth,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

export const ShieldIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => {
  // Shield shape approximated with lines

  return (
    <PureSvg width={size} height={size} viewBox="0 0 24 24">
      {/* Shield outline - simplified version */}
      {/* Top edges */}
      <PureLine
        x1={12}
        y1={2}
        x2={4}
        y2={6}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={12}
        y1={2}
        x2={20}
        y2={6}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Side edges */}
      <PureLine
        x1={4}
        y1={6}
        x2={4}
        y2={13}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={20}
        y1={6}
        x2={20}
        y2={13}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Bottom point */}
      <PureLine
        x1={4}
        y1={13}
        x2={12}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={20}
        y1={13}
        x2={12}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </PureSvg>
  );
};

// Simplified Network Icon (using Globe as base)
export const NetworkIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Central node */}
    <PureCircle cx={12} cy={12} r={3} fill={color} />
    {/* Connected nodes */}
    <PureCircle cx={5} cy={5} r={2} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={19} cy={5} r={2} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={5} cy={19} r={2} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle
      cx={19}
      cy={19}
      r={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Connection lines */}
    <PureLine
      x1={12}
      y1={12}
      x2={5}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={19}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={5}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={19}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Environment Icon (using Settings gear simplified)
export const EnvIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Simplified environment/settings shape */}
    {/* Outer hexagon approximated with lines */}
    <PureLine
      x1={12}
      y1={2}
      x2={19}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={6}
      x2={19}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={14}
      x2={12}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={18}
      x2={5}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={14}
      x2={5}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={6}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Center circle */}
    <PureCircle
      cx={12}
      cy={10}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Storage Icon (filing cabinet style)
export const StorageIconPure: React.FC<IconProps> = ({
  size = 24,
  color = "black",
  strokeWidth = 2,
}) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24">
    {/* Storage drawers */}
    <PureRect
      x={3}
      y={2}
      width={18}
      height={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={3}
      y={9}
      width={18}
      height={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={3}
      y={16}
      width={18}
      height={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Drawer handles */}
    <PureLine
      x1={10}
      y1={5}
      x2={14}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={12}
      x2={14}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={19}
      x2={14}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// ============================================================================
// Icon Registry for Dynamic Selection
// ============================================================================

export const PURE_RN_ICONS = {
  plus: PlusIconPure,
  check: CheckIconPure,
  x: XIconPure,
  minus: MinusIconPure,
  "alert-circle": AlertCircleIconPure,
  "check-circle": CheckCircleIconPure,
  "chevron-down": ChevronDownIconPure,
  "chevron-up": ChevronUpIconPure,
  "chevron-left": ChevronLeftIconPure,
  "chevron-right": ChevronRightIconPure,
  hash: HashIconPure,
  pause: PauseIconPure,
  info: InfoIconPure,
  // Network & Infrastructure Icons
  wifi: WifiIconPure,
  "wifi-off": WifiOffIconPure,
  database: DatabaseIconPure,
  server: ServerIconPure,
  "hard-drive": HardDriveIconPure,
  globe: GlobeIconPure,
  shield: ShieldIconPure,
  network: NetworkIconPure,
  env: EnvIconPure,
  storage: StorageIconPure,
};

// ============================================================================
// Main Icon Component with Fallback
// ============================================================================

interface DynamicIconProps extends IconProps {
  name: string;
  fallbackImage?: any; // Image source for complex icons
}

export const PureRNIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 24,
  color = "black",
  strokeWidth = 2,
  fallbackImage,
}) => {
  const IconComponent = PURE_RN_ICONS[name as keyof typeof PURE_RN_ICONS];

  if (IconComponent) {
    return (
      <IconComponent size={size} color={color} strokeWidth={strokeWidth} />
    );
  }

  if (fallbackImage) {
    return (
      <Image
        source={fallbackImage}
        style={{
          width: size,
          height: size,
          tintColor: color,
        }}
        resizeMode="contain"
      />
    );
  }

  // Fallback placeholder
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 10, color: "#666" }}>?</Text>
    </View>
  );
};

// ============================================================================
// Demo Component
// ============================================================================

export const PureRNSVGDemo: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Pure RN SVG Icons Demo
      </Text>

      {/* Featured Network & Infrastructure Icons */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Network & Infrastructure Icons (Requested)
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <WifiIconPure size={48} color="#2196F3" strokeWidth={3} />
          <Text>WiFi</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <NetworkIconPure size={48} color="#4CAF50" strokeWidth={3} />
          <Text>Network</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <EnvIconPure size={48} color="#FF9800" strokeWidth={3} />
          <Text>Environment</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <StorageIconPure size={48} color="#9C27B0" strokeWidth={3} />
          <Text>Storage</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <ShieldIconPure size={48} color="#F44336" strokeWidth={3} />
          <Text>Shield/Sentry</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <DatabaseIconPure size={48} color="#00BCD4" strokeWidth={3} />
          <Text>Database</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <ServerIconPure size={48} color="#607D8B" strokeWidth={3} />
          <Text>Server</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <GlobeIconPure size={48} color="#3F51B5" strokeWidth={3} />
          <Text>Globe</Text>
        </View>
      </View>

      {/* Basic Icons */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Basic Icons
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <PlusIconPure size={32} color="blue" strokeWidth={2} />
          <Text style={{ fontSize: 10 }}>Plus</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <CheckIconPure size={32} color="green" strokeWidth={2} />
          <Text style={{ fontSize: 10 }}>Check</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <XIconPure size={32} color="red" strokeWidth={2} />
          <Text style={{ fontSize: 10 }}>X</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <AlertCircleIconPure size={32} color="orange" strokeWidth={2} />
          <Text style={{ fontSize: 10 }}>Alert</Text>
        </View>
      </View>

      {/* All Icons Grid */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        All Available Icons ({Object.keys(PURE_RN_ICONS).length} total)
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}>
        {Object.keys(PURE_RN_ICONS).map((name) => (
          <View key={name} style={{ alignItems: "center", width: 60 }}>
            <PureRNIcon name={name} size={24} color="#333" strokeWidth={2} />
            <Text style={{ fontSize: 9, marginTop: 4, textAlign: "center" }}>
              {name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PureRNSVGDemo;
