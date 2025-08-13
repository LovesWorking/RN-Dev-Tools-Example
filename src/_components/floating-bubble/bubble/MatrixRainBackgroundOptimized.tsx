import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Reduce character set for performance
const MATRIX_CHARS = '01';
const MATRIX_COLOR = '#00FF00';

interface MatrixColumnProps {
  x: number;
  height: number;
  delay: number;
  speed: number;
}

// Optimized single column with minimal characters
const MatrixColumn: React.FC<MatrixColumnProps> = ({ x, height, delay, speed }) => {
  const translateY = useSharedValue(-height);
  
  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height * 2, {
          duration: speed,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(translateY);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Generate static text column (not animated individually)
  const columnText = Array.from({ length: 30 }, () => 
    MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
  ).join('\n');

  return (
    <Animated.View
      style={[
        styles.column,
        { left: x },
        animatedStyle,
      ]}
    >
      <Text style={styles.matrixText}>
        {columnText}
      </Text>
    </Animated.View>
  );
};

export const MatrixRainBackgroundOptimized: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { width, height } = Dimensions.get('window');
  
  // Reduce number of columns for better performance
  const COLUMN_COUNT = 8;
  const columnSpacing = width / COLUMN_COUNT;
  
  // Single animated scanline
  const scanlineY = useSharedValue(0);
  
  useEffect(() => {
    scanlineY.value = withRepeat(
      withTiming(height, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(scanlineY);
    };
  }, [height]);

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanlineY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Static background gradient for depth */}
      <View style={styles.backgroundGradient} />
      
      {/* Optimized Matrix columns */}
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
        <MatrixColumn
          key={i}
          x={i * columnSpacing + (Math.random() * columnSpacing * 0.5)}
          height={height}
          delay={i * 200}
          speed={8000 + Math.random() * 4000}
        />
      ))}
      
      {/* Single scanline for effect */}
      <Animated.View style={[styles.scanline, scanlineStyle]} />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.95,
  },
  column: {
    position: 'absolute',
    top: -500, // Start above screen
  },
  matrixText: {
    color: MATRIX_COLOR,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    opacity: 0.15, // Lower opacity for performance
    letterSpacing: 2,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: MATRIX_COLOR,
    opacity: 0.2,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default MatrixRainBackgroundOptimized;