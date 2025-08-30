import { View } from "react-native";

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

// Icons with proper sizing and proportions
export const SaveIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={3}
      y={3}
      width={18}
      height={18}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureRect
      x={7}
      y={3}
      width={10}
      height={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect x={14} y={4} width={2} height={3} fill={color} />
    <PureRect
      x={7}
      y={13}
      width={10}
      height={8}
      stroke={color}
      strokeWidth={strokeWidth}
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

// Improved Send Icon (paper airplane style)
export const SendIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={22}
      y1={2}
      x2={2}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={12}
      x2={22}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={2}
      x2={11}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={13}
      x2={11}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={22}
      x2={16}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Settings Icon (gear shape)
export const SettingsIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Gear teeth using rectangles */}
    <PureRect x={10} y={1} width={4} height={5} fill={color} />
    <PureRect x={10} y={18} width={4} height={5} fill={color} />
    <PureRect x={1} y={10} width={5} height={4} fill={color} />
    <PureRect x={18} y={10} width={5} height={4} fill={color} />
    {/* Diagonal teeth */}
    <View
      style={{
        position: "absolute",
        left: 16,
        top: 4,
        width: 4,
        height: 4,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 4,
        height: 4,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 16,
        width: 4,
        height: 4,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        width: 4,
        height: 4,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
  </PureSvg>
);

export const ShareIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={18} cy={5} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={6} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle
      cx={18}
      cy={19}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8.5}
      y1={10.5}
      x2={15.5}
      y2={6.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8.5}
      y1={13.5}
      x2={15.5}
      y2={17.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Shield Icon
export const ShieldIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 4,
        width: 18,
        height: 16,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={12}
      y1={4}
      x2={12}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ShoppingCartIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={9} cy={21} r={1.5} fill={color} />
    <PureCircle cx={20} cy={21} r={1.5} fill={color} />
    <PureLine
      x1={1}
      y1={1}
      x2={5}
      y2={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={1}
      x2={7}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7}
      y1={7}
      x2={20}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={7}
      x2={18}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={17}
      x2={8}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={17}
      x2={7}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Star Icon
export const StarIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={2}
      x2={15}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={9}
      x2={22}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={9}
      x2={17}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={17}
      y1={14}
      x2={19}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={22}
      x2={12}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={18}
      x2={5}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={22}
      x2={7}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7}
      y1={14}
      x2={2}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={9}
      x2={9}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={9}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Tag Icon
export const TagIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 11,
        height: 11,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={13}
      y1={2}
      x2={22}
      y2={11}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={11}
      x2={13}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={13}
      y1={22}
      x2={2}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={7} cy={7} r={1.5} fill={color} />
  </PureSvg>
);

export const TrashIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={6}
      x2={21}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={5}
      y={6}
      width={14}
      height={14}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
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
    <PureLine
      x1={8}
      y1={3}
      x2={16}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const TrendingUpIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={17}
      x2={9}
      y2={11}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={11}
      x2={13}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={13}
      y1={15}
      x2={22}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={17}
      y1={6}
      x2={22}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={6}
      x2={22}
      y2={11}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

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
      x1={12}
      y1={3}
      x2={8}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={3}
      x2={16}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={21}
      x2={21}
      y2={21}
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
    <PureCircle cx={12} cy={8} r={5} stroke={color} strokeWidth={strokeWidth} />
    <View
      style={{
        position: "absolute",
        left: 4,
        top: 14,
        width: 16,
        height: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// Improved Volume Icon
export const VolumeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 8,
        width: 0,
        height: 0,
        borderRightWidth: 6,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderRightColor: color,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
      }}
    />
    <PureRect x={8} y={8} width={3} height={8} fill={color} />
    <View
      style={{
        position: "absolute",
        left: 14,
        top: 9,
        width: 4,
        height: 6,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        borderTopWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 17,
        top: 7,
        width: 5,
        height: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderTopWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// Completely redesigned WiFi Icon - signal waves style
export const WifiIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={12} cy={19} r={2} fill={color} />
    <PureLine
      x1={9}
      y1={15}
      x2={10}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={15}
      x2={14}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={6}
      y1={11}
      x2={7.5}
      y2={12.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={11}
      x2={16.5}
      y2={12.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={5}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={7}
      x2={19}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const WifiOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={12} cy={19} r={2} fill={color} />
    <PureLine
      x1={9}
      y1={15}
      x2={10}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={15}
      x2={14}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={6}
      y1={11}
      x2={7.5}
      y2={12.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={11}
      x2={16.5}
      y2={12.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={5}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={7}
      x2={19}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={2}
      x2={22}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth * 1.5}
    />
  </PureSvg>
);

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

export const ZapIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={13}
      y1={2}
      x2={4}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={14}
      x2={10}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={14}
      x2={11}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={22}
      x2={20}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={10}
      x2={14}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={10}
      x2={13}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Additional improved icons

export const CheckCircle2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={12} cy={12} r={10} fill={color} />
    <PureLine
      x1={16}
      y1={9}
      x2={11}
      y2={14}
      stroke="white"
      strokeWidth={strokeWidth * 1.5}
    />
    <PureLine
      x1={11}
      y1={14}
      x2={8}
      y2={11}
      stroke="white"
      strokeWidth={strokeWidth * 1.5}
    />
  </PureSvg>
);

export const EyeOffIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 7,
        width: 20,
        height: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={1}
      y1={1}
      x2={23}
      y2={23}
      stroke={color}
      strokeWidth={strokeWidth * 1.5}
    />
  </PureSvg>
);

export const FileCodeIcon = ({
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
        top: 2,
        width: 14,
        height: 20,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 2,
        width: 0,
        height: 0,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderBottomColor: color,
        borderLeftColor: "transparent",
      }}
    />
    <PureLine
      x1={10}
      y1={13}
      x2={8}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={15}
      x2={10}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={13}
      x2={16}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={15}
      x2={14}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const FileTextIcon = ({
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
        top: 2,
        width: 14,
        height: 20,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 2,
        width: 0,
        height: 0,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderBottomColor: color,
        borderLeftColor: "transparent",
      }}
    />
    <PureLine
      x1={8}
      y1={13}
      x2={16}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={16}
      x2={16}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={19}
      x2={13}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const FlaskConicalIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={9}
      y1={2}
      x2={15}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={2}
      x2={10}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={2}
      x2={14}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={8}
      x2={4}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={8}
      x2={20}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={20}
      x2={20}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 15,
        width: 10,
        height: 5,
        backgroundColor: color,
        opacity: 0.3,
      }}
    />
  </PureSvg>
);

export const HardDriveIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={2}
      y={12}
      width={20}
      height={8}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 5,
        width: 20,
        height: 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle cx={6} cy={16} r={1} fill={color} />
    <PureCircle cx={18} cy={16} r={1} fill={color} />
  </PureSvg>
);

// Improved Palette Icon
export const PaletteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
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
    <View
      style={{
        position: "absolute",
        left: 15,
        top: 15,
        width: 7,
        height: 7,
        borderTopLeftRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        backgroundColor: "transparent",
      }}
    />
    <PureCircle cx={6.5} cy={6.5} r={1.5} fill={color} />
    <PureCircle cx={17.5} cy={6.5} r={1.5} fill={color} />
    <PureCircle cx={6.5} cy={12.5} r={1.5} fill={color} />
    <PureCircle cx={12} cy={10} r={1.5} fill={color} />
  </PureSvg>
);

export const ServerIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={2}
      y={2}
      width={20}
      height={8}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={2}
      y={14}
      width={20}
      height={8}
      rx={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={6} cy={6} r={1} fill={color} />
    <PureCircle cx={6} cy={18} r={1} fill={color} />
    <PureLine
      x1={10}
      y1={6}
      x2={18}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={18}
      x2={18}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const TestTube2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={14}
      y1={2}
      x2={10}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={2}
      x2={14}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={10}
      y1={2}
      x2={10}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 6,
        width: 4,
        height: 15,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderColor: color,
        borderWidth: strokeWidth,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 10 + strokeWidth,
        top: 14,
        width: 4 - strokeWidth * 2,
        height: 7 - strokeWidth,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        backgroundColor: color,
        opacity: 0.3,
      }}
    />
  </PureSvg>
);

export const Trash2Icon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={6}
      x2={21}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 6,
        width: 14,
        height: 14,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
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
    <PureLine
      x1={9}
      y1={3}
      x2={15}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={3}
      x2={9}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={3}
      x2={15}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

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
    <PureLine
      x1={15}
      y1={9}
      x2={9}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={9}
      x2={15}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const HashIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
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

export const UsersIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={9} cy={7} r={4} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={17} cy={7} r={3} stroke={color} strokeWidth={strokeWidth} />
    <View
      style={{
        position: "absolute",
        left: 1,
        top: 14,
        width: 16,
        height: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 11,
        top: 13,
        width: 12,
        height: 9,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderTopWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// Improved Box Icon
export const BoxIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={2}
      x2={21}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={7}
      x2={21}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={17}
      x2={12}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={3}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={17}
      x2={3}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={21}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={2}
      x2={12}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Hand Icon
export const HandIcon = ({
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
        top: 11,
        width: 10,
        height: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={8}
      y1={11}
      x2={8}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={11}
      y1={11}
      x2={11}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={14}
      y1={11}
      x2={14}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={17}
      y1={13}
      x2={17}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 13,
        width: 4,
        height: 6,
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ rotate: "-20deg" }],
      }}
    />
  </PureSvg>
);

// Improved Key Icon
export const KeyIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={7} cy={15} r={5} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={7} cy={15} r={2} fill={color} />
    <PureLine
      x1={12}
      y1={15}
      x2={22}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={8}
      x2={19}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={5}
      x2={19}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const RouteIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={6} cy={19} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureRect
      x={15}
      y={2}
      width={6}
      height={6}
      rx={1}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={19}
      x2={15}
      y2={19}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={15}
      y1={19}
      x2={15}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={9}
      y1={5}
      x2={15}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 5,
        width: 9,
        height: 14,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

export const TriangleAlertIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={3}
      x2={3}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={20}
      x2={21}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={20}
      x2={12}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={9}
      x2={12}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={12} cy={17} r={1} fill={color} />
  </PureSvg>
);

export const UnlockIcon = ({
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
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 2,
        width: 10,
        height: 11,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle cx={12} cy={16} r={1} fill={color} />
  </PureSvg>
);

export const FileJsonIcon = ({
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
        top: 2,
        width: 14,
        height: 20,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 2,
        width: 0,
        height: 0,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderBottomColor: color,
        borderLeftColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 12,
        width: 3,
        height: 5,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderTopWidth: strokeWidth,
        borderColor: color,
        borderRadius: 1,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

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

export const AirplayIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={5}
      y={4}
      width={14}
      height={10}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <View
      style={{
        position: "absolute",
        left: 12 - 4,
        top: 19,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: color,
      }}
    />
  </PureSvg>
);

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
    <PureCircle cx={12} cy={16} r={1} fill={color} />
  </PureSvg>
);

export const AlertTriangleIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={3}
      x2={3}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={20}
      x2={21}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={20}
      x2={12}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={9}
      x2={12}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={12} cy={17} r={1} fill={color} />
  </PureSvg>
);

export const ArchiveIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={3}
      y={3}
      width={18}
      height={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={4}
      y={8}
      width={16}
      height={12}
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
  </PureSvg>
);

export const ArrowDownIcon = ({
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
      x1={12}
      y1={19}
      x2={7}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={19}
      x2={17}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ArrowLeftIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={19}
      y1={12}
      x2={5}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={12}
      x2={10}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={5}
      y1={12}
      x2={10}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ArrowRightIcon = ({
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
    <PureLine
      x1={19}
      y1={12}
      x2={14}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={12}
      x2={14}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ArrowUpIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={19}
      x2={12}
      y2={5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={5}
      x2={7}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={5}
      x2={17}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Bell Icon
export const BellIcon = ({
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
        height: 12,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureRect
      x={5}
      y={10}
      width={14}
      height={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={18}
      x2={21}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 19,
        width: 6,
        height: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// Improved Bookmark Icon
export const BookmarkIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={5}
      y={3}
      width={14}
      height={18}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureLine
      x1={5}
      y1={21}
      x2={12}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={19}
      y1={21}
      x2={12}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Bug Icon
export const BugIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 6,
        width: 8,
        height: 12,
        borderRadius: 4,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={12}
      y1={9}
      x2={12}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={6}
      x2={8}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={6}
      x2={16}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={12}
      x2={8}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={12}
      x2={16}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={18}
      x2={8}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={18}
      x2={16}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CalendarIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={3}
      y={4}
      width={18}
      height={18}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureLine
      x1={8}
      y1={2}
      x2={8}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={2}
      x2={16}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={10}
      x2={21}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CameraIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={2}
      y={7}
      width={20}
      height={14}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureCircle
      cx={12}
      cy={13}
      r={4}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 3,
        width: 6,
        height: 4,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

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
      x2={20}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const CheckCircleIcon = ({
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

// Improved Cloud Icon
export const CloudIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 6,
        width: 11,
        height: 11,
        borderRadius: 5.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 10,
        width: 14,
        height: 10,
        borderRadius: 5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureRect x={5} y={15} width={14} height={5} fill="white" />
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
      x={9}
      y={9}
      width={13}
      height={13}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 2,
        width: 13,
        height: 13,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderRightColor: "transparent",
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);

// Improved Database Icon
export const DatabaseIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 3,
        width: 18,
        height: 6,
        borderRadius: 9,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={3}
      y1={9}
      x2={3}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={9}
      x2={21}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 12,
        width: 18,
        height: 6,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 18,
        width: 18,
        height: 6,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        borderColor: color,
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
      x1={12}
      y1={15}
      x2={8}
      y2={11}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={15}
      x2={16}
      y2={11}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={21}
      x2={21}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Edit Icon
export const EditIcon = ({
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
        width: 3,
        height: 12,
        backgroundColor: "transparent",
        transform: [{ rotate: "45deg" }],
        transformOrigin: "center",
      }}
    >
      <PureRect
        x={0}
        y={0}
        width={3}
        height={9}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 9,
          width: 0,
          height: 0,
          borderLeftWidth: 1.5,
          borderRightWidth: 1.5,
          borderTopWidth: 3,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
        }}
      />
    </View>
    <PureLine
      x1={3}
      y1={21}
      x2={21}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const ExternalLinkIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={7}
      y={7}
      width={14}
      height={14}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureLine
      x1={15}
      y1={3}
      x2={21}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={3}
      x2={21}
      y2={9}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={3}
      x2={11}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const EyeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 2,
        top: 7,
        width: 20,
        height: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const FileIcon = ({
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
        top: 2,
        width: 14,
        height: 20,
        borderWidth: strokeWidth,
        borderColor: color,
        borderRadius: 2,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 13,
        top: 2,
        width: 0,
        height: 0,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderBottomColor: color,
        borderLeftColor: "transparent",
      }}
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
        left: 3,
        top: 4,
        width: 0,
        height: 0,
        borderTopWidth: 4,
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderTopColor: color,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 8,
        width: 0,
        height: 0,
        borderTopWidth: 4,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopColor: color,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 9,
        top: 12,
        width: 0,
        height: 0,
        borderTopWidth: 4,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopColor: color,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
      }}
    />
    <PureRect x={10} y={16} width={4} height={4} fill={color} />
  </PureSvg>
);

export const FolderIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 3,
        width: 7,
        height: 4,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 0,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureRect
      x={3}
      y={7}
      width={18}
      height={13}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
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
    <PureCircle cx={6} cy={6} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle cx={6} cy={18} r={3} stroke={color} strokeWidth={strokeWidth} />
    <PureCircle
      cx={18}
      cy={18}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={6}
      y1={9}
      x2={6}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 6,
        top: 10,
        width: 6,
        height: 5,
        borderTopRightRadius: 5,
        borderTopWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={12}
      y1={10}
      x2={18}
      y2={10}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={18}
      y1={10}
      x2={18}
      y2={15}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const GlobeIcon = ({
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
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 2,
        width: 8,
        height: 20,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        borderRadius: 4,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={2}
      y1={12}
      x2={22}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Heart Icon
export const HeartIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 4.5,
        top: 5,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 12.5,
        top: 5,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={4}
      y1={11}
      x2={12}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={11}
      x2={12}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Home Icon
export const HomeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={9}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={9}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={9}
      x2={4}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={9}
      x2={20}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={22}
      x2={20}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureRect
      x={9}
      y={15}
      width={6}
      height={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Inbox Icon
export const InboxIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={4}
      y1={4}
      x2={4}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={20}
      y1={4}
      x2={20}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={4}
      x2={8}
      y2={4}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={4}
      x2={20}
      y2={4}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={20}
      x2={20}
      y2={20}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={4}
      y1={14}
      x2={8}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={16}
      y1={14}
      x2={20}
      y2={14}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 8,
        top: 12,
        width: 8,
        height: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
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
      y1={16}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={12} cy={8} r={1} fill={color} />
  </PureSvg>
);

// Improved Link Icon
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
        left: 8,
        top: 7,
        width: 8,
        height: 10,
        borderRadius: 5,
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
        width: 8,
        height: 10,
        borderRadius: 5,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
        transform: [{ rotate: "45deg" }],
      }}
    />
  </PureSvg>
);

export const ListIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={8}
      y1={6}
      x2={21}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={18}
      x2={21}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureCircle cx={4} cy={6} r={1} fill={color} />
    <PureCircle cx={4} cy={12} r={1} fill={color} />
    <PureCircle cx={4} cy={18} r={1} fill={color} />
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
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <View
      style={{
        position: "absolute",
        left: 7,
        top: 3,
        width: 10,
        height: 8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle cx={12} cy={16} r={1} fill={color} />
  </PureSvg>
);

export const LogOutIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <View
      style={{
        position: "absolute",
        left: 3,
        top: 3,
        width: 10,
        height: 18,
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
        borderTopWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderBottomWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={3}
      y1={3}
      x2={8}
      y2={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={21}
      x2={8}
      y2={21}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={8}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={12}
      x2={17}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={12}
      x2={17}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const MailIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureRect
      x={2}
      y={4}
      width={20}
      height={16}
      stroke={color}
      strokeWidth={strokeWidth}
      rx={2}
    />
    <PureLine
      x1={2}
      y1={4}
      x2={12}
      y2={13}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={13}
      x2={22}
      y2={4}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved MapPin Icon
export const MapPinIcon = ({
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
        top: 3,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureCircle
      cx={12}
      cy={10}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={17}
      x2={12}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={8}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={16}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const MenuIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={3}
      y1={6}
      x2={21}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={18}
      x2={21}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

export const MicIcon = ({
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
        top: 3,
        width: 6,
        height: 11,
        borderRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <PureLine
      x1={12}
      y1={19}
      x2={12}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <View
      style={{
        position: "absolute",
        left: 5,
        top: 10,
        width: 14,
        height: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomWidth: strokeWidth,
        borderLeftWidth: strokeWidth,
        borderRightWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
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

export const MoreHorizontalIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureCircle cx={5} cy={12} r={2} fill={color} />
    <PureCircle cx={12} cy={12} r={2} fill={color} />
    <PureCircle cx={19} cy={12} r={2} fill={color} />
  </PureSvg>
);

export const MoveIcon = ({
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
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={12}
      x2={22}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={2}
      x2={8}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={2}
      x2={16}
      y2={6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={8}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={16}
      y2={18}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={12}
      x2={6}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={2}
      y1={12}
      x2={6}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={12}
      x2={18}
      y2={8}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={22}
      y1={12}
      x2={18}
      y2={16}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </PureSvg>
);

// Improved Package/Box Icon
export const PackageIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}: IconProps) => (
  <PureSvg width={size} height={size} viewBox="0 0 24 24" {...props}>
    <PureLine
      x1={12}
      y1={2}
      x2={3}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={3}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={17}
      x2={12}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={22}
      x2={21}
      y2={17}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={17}
      x2={21}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={21}
      y1={7}
      x2={12}
      y2={2}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={3}
      y1={7}
      x2={12}
      y2={12}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={21}
      y2={7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={12}
      y1={12}
      x2={12}
      y2={22}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <PureLine
      x1={7.5}
      y1={4.5}
      x2={16.5}
      y2={9.5}
      stroke={color}
      strokeWidth={strokeWidth}
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
    <PureRect x={6} y={4} width={4} height={16} fill={color} rx={1} />
    <PureRect x={14} y={4} width={4} height={16} fill={color} rx={1} />
  </PureSvg>
);

// Improved Phone Icon
export const PhoneIcon = ({
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
        top: 3,
        width: 7,
        height: 7,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 1,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 12,
        top: 14,
        width: 7,
        height: 7,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 1,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 3,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
    <View
      style={{
        position: "absolute",
        left: 10,
        top: 8,
        width: 4,
        height: 8,
        borderTopLeftRadius: 2,
        borderBottomRightRadius: 2,
        borderWidth: strokeWidth,
        borderColor: color,
        backgroundColor: "transparent",
      }}
    />
  </PureSvg>
);
