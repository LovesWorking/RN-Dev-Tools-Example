import React, { useRef } from "react";
import { Pressable, View, StyleSheet, Animated } from "react-native";
import Svg, { Path, Rect, Line, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode, G } from "react-native-svg";

interface CyberpunkExpandButtonProps {
  onPress?: () => void;
  mode: "floating" | "bottomSheet";
}

export function CyberpunkExpandButton({ onPress, mode }: CyberpunkExpandButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Svg viewBox="0 0 32 32" style={{ width: 26, height: 26 }}>
          <Defs>
            <LinearGradient id="expandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#00BFFF" stopOpacity="1" />
          </LinearGradient>
          
          <Filter id="expandGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <FeMerge>
              <FeMergeNode in="coloredBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        
        {/* Background frame */}
        <Path
          d="M 4 8 L 8 4 L 24 4 L 28 8 L 28 24 L 24 28 L 8 28 L 4 24 Z"
          fill="rgba(0, 255, 255, 0.1)"
          stroke="url(#expandGradient)"
          strokeWidth={1.5}
          filter="url(#expandGlow)"
        />
        
        {/* Inner border */}
        <Path
          d="M 6 9 L 9 6 L 23 6 L 26 9 L 26 23 L 23 26 L 9 26 L 6 23 Z"
          fill="none"
          stroke="#00FFFF"
          strokeWidth={0.5}
          opacity={0.5}
        />
        
        {mode === "floating" ? (
          // Minimize icon - corners pointing inward
          <G>
            {/* Top left arrow */}
            <Line x1={10} y1={14} x2={14} y2={14} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={14} y1={14} x2={14} y2={10} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Top right arrow */}
            <Line x1={22} y1={14} x2={18} y2={14} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={18} y1={14} x2={18} y2={10} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Bottom left arrow */}
            <Line x1={10} y1={18} x2={14} y2={18} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={14} y1={18} x2={14} y2={22} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Bottom right arrow */}
            <Line x1={22} y1={18} x2={18} y2={18} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={18} y1={18} x2={18} y2={22} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
          </G>
        ) : (
          // Maximize icon - corners pointing outward
          <G>
            {/* Top left arrow */}
            <Line x1={14} y1={10} x2={10} y2={10} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={10} y1={10} x2={10} y2={14} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Top right arrow */}
            <Line x1={18} y1={10} x2={22} y2={10} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={22} y1={10} x2={22} y2={14} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Bottom left arrow */}
            <Line x1={14} y1={22} x2={10} y2={22} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={10} y1={22} x2={10} y2={18} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            
            {/* Bottom right arrow */}
            <Line x1={18} y1={22} x2={22} y2={22} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
            <Line x1={22} y1={22} x2={22} y2={18} stroke="#00FFFF" strokeWidth={2} filter="url(#expandGlow)" />
          </G>
        )}
        
        {/* Corner accents */}
        <Rect x={4} y={4} width={2} height={2} fill="#00FFFF" opacity={0.6} />
        <Rect x={26} y={4} width={2} height={2} fill="#00FFFF" opacity={0.6} />
        <Rect x={4} y={26} width={2} height={2} fill="#00FFFF" opacity={0.6} />
        <Rect x={26} y={26} width={2} height={2} fill="#00FFFF" opacity={0.6} />
      </Svg>
      </Animated.View>
    </Pressable>
  );
}

interface CyberpunkCloseButtonProps {
  onPress?: () => void;
}

export function CyberpunkCloseButton({ onPress }: CyberpunkCloseButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Svg viewBox="0 0 32 32" style={{ width: 26, height: 26 }}>
          <Defs>
            <LinearGradient id="closeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF0080" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF00FF" stopOpacity="1" />
          </LinearGradient>
          
          <Filter id="closeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <FeMerge>
              <FeMergeNode in="coloredBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        
        {/* Background frame */}
        <Path
          d="M 4 8 L 8 4 L 24 4 L 28 8 L 28 24 L 24 28 L 8 28 L 4 24 Z"
          fill="rgba(255, 0, 128, 0.1)"
          stroke="url(#closeGradient)"
          strokeWidth={1.5}
          filter="url(#closeGlow)"
        />
        
        {/* Inner border */}
        <Path
          d="M 6 9 L 9 6 L 23 6 L 26 9 L 26 23 L 23 26 L 9 26 L 6 23 Z"
          fill="none"
          stroke="#FF0080"
          strokeWidth={0.5}
          opacity={0.5}
        />
        
        {/* X icon */}
        <G>
          <Line x1={11} y1={11} x2={21} y2={21} stroke="#FF0080" strokeWidth={2.5} strokeLinecap="round" filter="url(#closeGlow)" />
          <Line x1={21} y1={11} x2={11} y2={21} stroke="#FF0080" strokeWidth={2.5} strokeLinecap="round" filter="url(#closeGlow)" />
        </G>
        
        {/* Corner accents */}
        <Rect x={4} y={4} width={2} height={2} fill="#FF00FF" opacity={0.6} />
        <Rect x={26} y={4} width={2} height={2} fill="#FF00FF" opacity={0.6} />
        <Rect x={4} y={26} width={2} height={2} fill="#FF00FF" opacity={0.6} />
        <Rect x={26} y={26} width={2} height={2} fill="#FF00FF" opacity={0.6} />
      </Svg>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});