/**
 * Themed Claude Modal
 * A wrapper around ClaudeModalPure that applies the current theme
 * 
 * Features:
 * - Automatic theme application
 * - Cyberpunk glitch effects when enabled
 * - Smooth theme transitions
 * - Maintains all original modal functionality
 */

import React, { useMemo, useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { ClaudeModal, ClaudeModalProps } from "./ClaudeModalPure";
import { useTheme, useThemeAnimations } from "../_themes/DevToolsThemeContext";

interface ThemedClaudeModalProps extends Omit<ClaudeModalProps, "styles"> {
  // Allow style overrides if needed
  styleOverrides?: ClaudeModalProps["styles"];
  // Enable glitch effects for cyberpunk theme
  enableGlitchEffects?: boolean;
}

export function ThemedClaudeModal({
  children,
  header,
  styleOverrides,
  enableGlitchEffects = true,
  ...props
}: ThemedClaudeModalProps) {
  const theme = useTheme();
  const animations = useThemeAnimations();
  
  // Animation values for cyberpunk effects
  const glitchOpacity = useRef(new Animated.Value(0)).current;
  const scanlineY = useRef(new Animated.Value(-100)).current;
  const borderGlow = useRef(new Animated.Value(0.3)).current;

  // Start cyberpunk animations if enabled
  useEffect(() => {
    if (animations.glitchEnabled && enableGlitchEffects && props.visible) {
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
  }, [props.visible, animations.glitchEnabled, enableGlitchEffects]);

  // Apply theme styles
  const themedStyles = useMemo(() => {
    const baseStyles: ClaudeModalProps["styles"] = {
      container: {
        backgroundColor: theme.name === "cyberpunk" ? "transparent" : undefined,
      },
      modal: {
        backgroundColor: theme.colors.backgroundModal,
        borderColor: theme.colors.border,
        borderWidth: theme.name === "cyberpunk" ? 1.5 : 1,
        borderRadius: theme.name === "cyberpunk" ? 16 : 14,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: theme.name === "cyberpunk" ? 0 : 4 },
        shadowOpacity: theme.name === "cyberpunk" ? 0.8 : 0.3,
        shadowRadius: theme.name === "cyberpunk" ? 20 : 8,
        elevation: theme.name === "cyberpunk" ? 20 : 16,
        overflow: "hidden",
      },
      header: {
        backgroundColor: theme.colors.modalHeader,
        borderBottomColor: theme.colors.modalHeaderBorder,
        borderBottomWidth: 1,
        borderTopLeftRadius: theme.name === "cyberpunk" ? 16 : 14,
        borderTopRightRadius: theme.name === "cyberpunk" ? 16 : 14,
      },
      headerTitle: {
        color: theme.colors.text,
        fontSize: theme.name === "cyberpunk" ? 14 : 16,
        fontWeight: theme.name === "cyberpunk" ? "700" : "600",
        fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
        letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
        textTransform: theme.name === "cyberpunk" ? "uppercase" : undefined,
      },
      headerSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: theme.name === "cyberpunk" ? "500" : "400",
        fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
        letterSpacing: theme.name === "cyberpunk" ? 0.5 : undefined,
      },
      content: {
        backgroundColor: theme.colors.modalContent,
        flex: 1,
      },
      dragIndicator: {
        backgroundColor: theme.colors.modalDragIndicator,
        width: theme.name === "cyberpunk" ? 40 : 32,
        height: theme.name === "cyberpunk" ? 4 : 3,
        borderRadius: theme.name === "cyberpunk" ? 2 : 1.5,
      },
    };

    // Merge with any style overrides
    if (styleOverrides) {
      return {
        ...baseStyles,
        ...styleOverrides,
      };
    }

    return baseStyles;
  }, [theme, styleOverrides]);

  // Enhanced header with cyberpunk styling
  const themedHeader = useMemo(() => {
    if (!header) return undefined;

    // Add cyberpunk text effects to header
    if (theme.name === "cyberpunk" && header.customContent) {
      return {
        ...header,
        customContent: (
          <View style={{ flex: 1, position: "relative" }}>
            {header.customContent}
            {/* Glitch overlay for header text */}
            {animations.glitchEnabled && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    opacity: glitchOpacity,
                    backgroundColor: theme.colors.glitchPrimary,
                    mixBlendMode: "screen",
                  },
                ]}
                pointerEvents="none"
              />
            )}
          </View>
        ),
      };
    }

    return header;
  }, [header, theme, animations.glitchEnabled, glitchOpacity]);

  // Wrap children with theme-specific effects
  const themedChildren = useMemo(() => {
    if (theme.name === "cyberpunk" && animations.scanlineEnabled) {
      return (
        <View style={{ flex: 1, position: "relative" }}>
          {children}
          {/* Scanline effect */}
          <Animated.View
            style={[
              styles.scanline,
              {
                transform: [{ translateY: scanlineY }],
                backgroundColor: theme.colors.primary,
              },
            ]}
            pointerEvents="none"
          />
          {/* Grid pattern overlay */}
          <View style={styles.gridOverlay} pointerEvents="none">
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`h-${i}`}
                style={[
                  styles.gridLineHorizontal,
                  {
                    top: `${i * 5}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={`v-${i}`}
                style={[
                  styles.gridLineVertical,
                  {
                    left: `${i * 5}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      );
    }

    return children;
  }, [children, theme, animations.scanlineEnabled, scanlineY]);

  // Apply animated border glow for cyberpunk theme
  const animatedModalStyle = useMemo(() => {
    if (theme.name === "cyberpunk" && animations.borderGlowEnabled) {
      return {
        borderColor: borderGlow.interpolate({
          inputRange: [0.3, 0.8],
          outputRange: [theme.colors.border, theme.colors.borderActive],
        }),
        shadowColor: borderGlow.interpolate({
          inputRange: [0.3, 0.8],
          outputRange: [theme.colors.shadow, theme.colors.shadowGlow],
        }),
      };
    }
    return {};
  }, [theme, animations.borderGlowEnabled, borderGlow]);

  return (
    <ClaudeModal
      {...props}
      header={themedHeader}
      styles={themedStyles}
    >
      {themedChildren}
    </ClaudeModal>
  );
}

const styles = StyleSheet.create({
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.2,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
  },
});