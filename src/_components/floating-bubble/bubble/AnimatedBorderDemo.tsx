import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { AnimatedCyberpunkBorderBox } from "@/src/_sections/react-query/components/query-browser/svgs";

export function AnimatedBorderDemo() {
  const animations = [
    {
      type: "pulse",
      label: "PULSE",
      sublabel: "GLOW",
      color: "#FF006E",
      secondary: "#FF4081",
      accent: "#FF80AB",
    },
    {
      type: "scan",
      label: "SCAN",
      sublabel: "LINE",
      color: "#00FFFF",
      secondary: "#00E5FF",
      accent: "#84FFFF",
    },
    {
      type: "glitch",
      label: "GLITCH",
      sublabel: "EFFECT",
      color: "#00FF88",
      secondary: "#00E676",
      accent: "#69F0AE",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Animated Cyberpunk Borders</Text>
      
      <View style={styles.grid}>
        {animations.map((anim, index) => (
          <View key={index} style={styles.buttonContainer}>
            <AnimatedCyberpunkBorderBox
              color={anim.color}
              secondaryColor={anim.secondary}
              accentColor={anim.accent}
              animationType={anim.type}
            />
            
            <View style={styles.content}>
              <Text style={[styles.label, { color: anim.color }]}>
                {anim.label}
              </Text>
              <Text style={[styles.sublabel, { color: anim.accent }]}>
                {anim.sublabel}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.description}>
        These animated borders demonstrate different SVG animation techniques:
        {'\n\n'}
        • PULSE: Gradient opacity animation with pulsing corner accents
        {'\n'}
        • SCAN: Moving scan line with gradient overlay
        {'\n'}
        • GLITCH: Random displacement and color shifting
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF006E',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  buttonContainer: {
    width: 105,
    height: 65,
    marginBottom: 20,
    position: 'relative',
  },
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  sublabel: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'monospace',
    opacity: 0.7,
    marginTop: -2,
  },
  description: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 30,
    lineHeight: 20,
    opacity: 0.8,
  },
});