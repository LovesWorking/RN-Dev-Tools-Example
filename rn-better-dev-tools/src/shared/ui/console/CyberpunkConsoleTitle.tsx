import React from "react";
import { View } from "react-native";
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  Rect,
  Line,
} from "react-native-svg";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

export function CyberpunkConsoleTitle() {
  return (
    <View style={{ height: 30, width: 280 }}>
      <Svg viewBox="0 0 280 30" style={{ width: "100%", height: "100%" }}>
        <Defs>
          {/* Cyan gradient for main text */}
          <LinearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gameUIColors.info} stopOpacity="1" />
            <Stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#00BFFF" stopOpacity="1" />
          </LinearGradient>

          {/* Glow effect */}
          <Filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="2" result="coloredBlur" />
            <FeMerge>
              <FeMergeNode in="coloredBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>

        {/* Background accent line */}
        <Line
          x1={0}
          y1={15}
          x2={15}
          y2={15}
          stroke={gameUIColors.info}
          strokeWidth={0.5}
          opacity={0.4}
        />
        <Line
          x1={265}
          y1={15}
          x2={280}
          y2={15}
          stroke={gameUIColors.info}
          strokeWidth={0.5}
          opacity={0.4}
        />

        {/* // slashes */}
        <SvgText
          x={5}
          y={22}
          fill={gameUIColors.critical}
          fontSize={16}
          fontWeight="bold"
          fontFamily="monospace"
          opacity={0.9}
        >
          //
        </SvgText>

        {/* Main text */}
        <SvgText
          x={25}
          y={22}
          fill="url(#textGradient)"
          fontSize={14}
          fontWeight="900"
          fontFamily="monospace"
          letterSpacing={2}
          filter="url(#textGlow)"
        >
          DEV_TOOLS_CONSOLE
        </SvgText>

        {/* Accent brackets */}
        <SvgText
          x={235}
          y={20}
          fill={gameUIColors.critical}
          fontSize={12}
          fontWeight="bold"
          fontFamily="monospace"
          opacity={0.6}
        >
          [*]
        </SvgText>

        {/* Bottom accent line */}
        <Rect
          x={25}
          y={24}
          width={180}
          height={0.5}
          fill={gameUIColors.info}
          opacity={0.3}
        />
      </Svg>
    </View>
  );
}
