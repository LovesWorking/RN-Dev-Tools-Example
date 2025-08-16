/**
 * ThemedClaudeModal60FPS
 * A themed wrapper around ClaudeModal60FPSClean that maintains 60FPS performance
 * while applying cyberpunk and other themes
 * 
 * Features:
 * - Maintains all 60FPS optimizations from ClaudeModal60FPSClean
 * - Applies theme styling without compromising performance
 * - Cyberpunk glitch effects when enabled
 * - Custom header support for cyberpunk theme
 */

import React, { useMemo, useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { ClaudeModal60FPSClean } from "./ClaudeModal60FPSClean";
import { useTheme, useThemeAnimations } from "../_themes/DevToolsThemeContext";
import { CyberpunkModalHeader } from "./CyberpunkModalHeader";

interface ThemedClaudeModal60FPSProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: {
    title?: string;
    subtitle?: string;
    customContent?: React.ReactNode;
    showToggleButton?: boolean;
    hideCloseButton?: boolean;
  };
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  animatedHeight?: Animated.Value;
  initialMode?: "bottomSheet" | "floating";
  onModeChange?: (mode: "bottomSheet" | "floating") => void;
  enableGlitchEffects?: boolean;
  persistenceKey?: string;
  enablePersistence?: boolean;
}

export function ThemedClaudeModal60FPS({
  children,
  header,
  enableGlitchEffects = true,
  onModeChange,
  initialMode = "bottomSheet",
  ...props
}: ThemedClaudeModal60FPSProps) {
  const theme = useTheme();
  const animations = useThemeAnimations();
  
  // Animation values for cyberpunk effects
  const glitchOpacity = useRef(new Animated.Value(0)).current;
  const scanlineY = useRef(new Animated.Value(-100)).current;
  const borderGlow = useRef(new Animated.Value(0.3)).current;

  // Track current mode for toggle
  const [currentMode, setCurrentMode] = React.useState(initialMode);

  // Start cyberpunk animations if enabled
  useEffect(() => {
    if (theme.name === "cyberpunk" && animations.glitchEnabled && enableGlitchEffects && props.visible) {
      // Scanline animation
      const scanlineAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanlineY, {
            toValue: 1000,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanlineY, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      // Border glow pulse
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(borderGlow, {
            toValue: 0.8,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(borderGlow, {
            toValue: 0.3,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ])
      );

      // Random glitch effect
      const startRandomGlitch = () => {
        const nextGlitchDelay = 3000 + Math.random() * 5000;
        
        setTimeout(() => {
          Animated.sequence([
            Animated.timing(glitchOpacity, {
              toValue: 0.8,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(glitchOpacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          
          if (props.visible) {
            startRandomGlitch();
          }
        }, nextGlitchDelay);
      };

      scanlineAnimation.start();
      glowAnimation.start();
      startRandomGlitch();

      return () => {
        scanlineAnimation.stop();
        glowAnimation.stop();
        scanlineY.setValue(-100);
        borderGlow.setValue(0.3);
        glitchOpacity.setValue(0);
      };
    }
  }, [props.visible, theme.name, animations.glitchEnabled, animations.borderGlowEnabled, enableGlitchEffects]);

  // Apply theme styles optimized for performance
  const themedStyles = useMemo(() => {
    const isCyberpunk = theme.name === "cyberpunk";
    
    return {
      container: {
        backgroundColor: isCyberpunk 
          ? "rgba(15, 15, 35, 0.98)" // Cyberpunk dark background
          : theme.colors.backgroundModal,
        borderColor: isCyberpunk 
          ? "#00ffcc" // Cyberpunk cyan border
          : theme.colors.border,
        borderWidth: isCyberpunk ? 2 : 1,
        borderRadius: isCyberpunk ? 16 : 14,
        shadowColor: isCyberpunk 
          ? "#00ffcc" // Cyberpunk glow
          : theme.colors.shadow,
        shadowOffset: { width: 0, height: isCyberpunk ? 0 : 4 },
        shadowOpacity: isCyberpunk ? 0.8 : 0.3,
        shadowRadius: isCyberpunk ? 20 : 8,
        elevation: isCyberpunk ? 20 : 16,
        overflow: "hidden",
      },
      content: {
        backgroundColor: isCyberpunk 
          ? "transparent" 
          : theme.colors.modalContent,
        flex: 1,
      },
    };
  }, [theme]);

  const handleModeChange = (mode: "bottomSheet" | "floating") => {
    setCurrentMode(mode);
    onModeChange?.(mode);
  };

  const handleToggleMode = () => {
    const newMode = currentMode === "floating" ? "bottomSheet" : "floating";
    handleModeChange(newMode);
  };

  // For cyberpunk theme, we need custom header
  const shouldUseCustomHeader = theme.name === "cyberpunk";

  // Enhanced header configuration for ClaudeModal60FPSClean
  const modalHeader = useMemo(() => {
    // Pass through the header config - ClaudeModal60FPSClean now supports customContent
    return {
      ...header,
      showToggleButton: header?.showToggleButton !== false, // Default to true
    };
  }, [header]);

  // Wrap children with theme-specific effects
  const themedChildren = useMemo(() => {
    let content = children;
    
    // Add scanline effect for cyberpunk theme
    if (theme.name === "cyberpunk" && animations.scanlineEnabled) {
      return (
        <View style={{ flex: 1, position: "relative" }}>
          {content}
          {/* Scanline effect */}
          <Animated.View
            style={[
              styles.scanline,
              {
                transform: [{ translateY: scanlineY }],
                backgroundColor: "#00ffcc",
                opacity: 0.15,
              },
            ]}
            pointerEvents="none"
          />
          {/* Glitch overlay */}
          {animations.glitchEnabled && (
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: "#ff00ff",
                  opacity: glitchOpacity,
                },
              ]}
              pointerEvents="none"
            />
          )}
        </View>
      );
    }

    return content;
  }, [
    children, 
    theme.name, 
    animations.scanlineEnabled, 
    animations.glitchEnabled,
    scanlineY, 
    glitchOpacity,
    shouldUseCustomHeader, 
    header, 
    handleToggleMode, 
    props.onClose, 
    currentMode
  ]);

  return (
    <ClaudeModal60FPSClean
      {...props}
      header={modalHeader}
      styles={themedStyles}
      initialMode={initialMode}
      onModeChange={handleModeChange}
    >
      {themedChildren}
    </ClaudeModal60FPSClean>
  );
}

const styles = StyleSheet.create({
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
  },
});

export default ThemedClaudeModal60FPS;