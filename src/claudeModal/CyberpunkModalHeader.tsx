import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle, Line, Text as SvgText, Defs, Pattern, Filter, FeGaussianBlur, FeMerge, FeMergeNode, LinearGradient, Stop } from "react-native-svg";
import { CyberpunkExpandButton, CyberpunkCloseButton } from "./CyberpunkControlButtons";

interface CyberpunkModalHeaderProps {
  title?: string;
  customContent?: ReactNode;
  showToggleButton?: boolean;
  hideCloseButton?: boolean;
  onToggleMode?: () => void;
  onClose?: () => void;
  mode?: "floating" | "bottomSheet";
  panHandlers?: any; // Pan handlers for dragging
}

export function CyberpunkModalHeader({
  title,
  customContent,
  showToggleButton = false,
  hideCloseButton = false,
  onToggleMode,
  onClose,
  mode = "bottomSheet",
  panHandlers,
}: CyberpunkModalHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Cyberpunk header SVG background */}
      <View style={styles.svgContainer}>
        <Svg viewBox="0 -5 400 65" style={styles.svg} preserveAspectRatio="none">
          <Defs>
            {/* Bright gradient for main accent */}
            <LinearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
              <Stop offset="50%" stopColor="#00BFFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0080FF" stopOpacity="1" />
            </LinearGradient>
            
            {/* Hot pink accent gradient */}
            <LinearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#FF0080" stopOpacity="0.8" />
            </LinearGradient>
            
            {/* Grid pattern - more visible */}
            <Pattern
              id="gridPattern"
              x={0}
              y={0}
              width={10}
              height={10}
              patternUnits="userSpaceOnUse"
            >
              <Path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#00FFFF"
                strokeWidth={0.3}
                opacity={0.2}
              />
            </Pattern>
            
            {/* Subtle glow filter */}
            <Filter id="electricGlow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <FeMerge>
                <FeMergeNode in="coloredBlur" />
                <FeMergeNode in="SourceGraphic" />
              </FeMerge>
            </Filter>
            
            <Filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation="2" result="coloredBlur" />
              <FeMerge>
                <FeMergeNode in="coloredBlur" />
                <FeMergeNode in="SourceGraphic" />
              </FeMerge>
            </Filter>
          </Defs>
          
          {/* Dark background with angular cuts */}
          <Path
            d="M 20 10 L 380 10 L 398 28 L 398 60 L 2 60 L 2 28 Z"
            fill="#000000"
            fillOpacity={0.95}
          />
          
          {/* Secondary background layer for depth */}
          <Path
            d="M 22 12 L 378 12 L 396 30 L 396 58 L 4 58 L 4 30 Z"
            fill="#0A0A0F"
            fillOpacity={0.98}
          />
          
          {/* Grid texture overlay */}
          <Path
            d="M 20 10 L 380 10 L 398 28 L 398 60 L 2 60 L 2 28 Z"
            fill="url(#gridPattern)"
            opacity={0.3}
          />
          
          {/* MAIN FRAME - BRIGHT CYAN BORDER */}
          <Path
            d="M 20 10 L 380 10 L 398 28 L 398 60 L 2 60 L 2 28 Z"
            fill="none"
            stroke="#00FFFF"
            strokeWidth={3}
            opacity={1}
            filter="url(#strongGlow)"
          />
          
          {/* INNER FRAME - GRADIENT BORDER */}
          <Path
            d="M 22 12 L 378 12 L 396 30 L 396 58 L 4 58 L 4 30 Z"
            fill="none"
            stroke="url(#cyberGradient)"
            strokeWidth={1.5}
            opacity={0.8}
            filter="url(#electricGlow)"
          />
          
          {/* Top edge accent - BRIGHT AND VISIBLE */}
          <Line x1={20} y1={10} x2={380} y2={10} stroke="#00FFFF" strokeWidth={4} opacity={1} filter="url(#strongGlow)" />
          
          {/* Angular corner highlights - FULLY VISIBLE */}
          <Line x1={380} y1={10} x2={398} y2={28} stroke="#00FFFF" strokeWidth={4} opacity={1} filter="url(#strongGlow)" />
          <Line x1={20} y1={10} x2={2} y2={28} stroke="#00FFFF" strokeWidth={4} opacity={1} filter="url(#strongGlow)" />
          
          {/* Corner accent dots */}
          <Circle cx={10} cy={30} r={2} fill="#FF00FF" opacity={0.8} filter="url(#electricGlow)" />
          <Circle cx={390} cy={30} r={2} fill="#FF00FF" opacity={0.8} filter="url(#electricGlow)" />
          
          
          {/* Grabber handle - more visible position */}
          <Rect
            x={170}
            y={15}
            width={60}
            height={12}
            rx={6}
            ry={6}
            fill="#000000"
            opacity={1}
          />
          <Rect
            x={170}
            y={15}
            width={60}
            height={12}
            rx={6}
            ry={6}
            fill="none"
            stroke="#00FFFF"
            strokeWidth={1}
            opacity={0.8}
            filter="url(#electricGlow)"
          />
          
          {/* Bottom accent lines - subtle */}
          <Line
            x1={20}
            y1={55}
            x2={80}
            y2={55}
            stroke="url(#cyberGradient)"
            strokeWidth={0.5}
            opacity={0.4}
          />
          <Line
            x1={320}
            y1={55}
            x2={380}
            y2={55}
            stroke="url(#cyberGradient)"
            strokeWidth={0.5}
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* Draggable area overlay for grabber */}
      {panHandlers && (
        <View 
          style={{
            position: 'absolute',
            top: 10,
            left: '35%',
            right: '35%',
            height: 25,
            zIndex: 1000,
          }}
          {...panHandlers}
        />
      )}

      {/* Content overlay */}
      <View style={styles.contentContainer}>
        <View style={styles.contentRow}>
          {/* Title or custom content */}
          <View style={styles.titleContainer}>
            {customContent ? (
              customContent
            ) : title ? (
              <Text style={styles.title}>{title}</Text>
            ) : null}
          </View>

          {/* Control buttons */}
          <View style={styles.controls}>
            {showToggleButton && (
              <CyberpunkExpandButton onPress={onToggleMode} mode={mode} />
            )}
            {!hideCloseButton && (
              <CyberpunkCloseButton onPress={onClose} />
            )}
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    position: "relative",
    overflow: "visible",
    marginHorizontal: -14,
    marginTop: -14,
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    color: "#00FFFF",
    fontFamily: "monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  controls: {
    flexDirection: "row",
    gap: 6,
    marginRight: 10,
  },
  statusText: {
    position: "absolute",
    right: 75,
    top: 32,
    fontSize: 9,
    fontFamily: "monospace",
    color: "#00FF88",
    fontWeight: "bold",
    opacity: 1,
    textShadowColor: "#00FF88",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  leftAccentText: {
    position: "absolute",
    left: 5,
    top: 25,
    fontSize: 16,
    color: "#FF00FF",
    opacity: 0.6,
  },
  rightAccentText: {
    position: "absolute",
    right: 5,
    top: 25,
    fontSize: 16,
    color: "#FF00FF",
    opacity: 0.6,
  },
});