import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

// Full Matrix character sets with variations
const MATRIX_CHARS = [
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴァィゥェォャュョッ',
  'アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン',
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '!@#$%^&*()_+-=[]{}|;:,.<>?'
];

interface MatrixColumnProps {
  index: number;
  totalColumns: number;
}

const MatrixColumn: React.FC<MatrixColumnProps> = ({ index, totalColumns }) => {
  const translateY = useRef(new Animated.Value(-height * 1.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Vary animation properties based on column index
  const duration = 4000 + (index % 5) * 1000 + Math.random() * 2000;
  const delay = index * 100 + Math.random() * 1000;
  const leftPosition = (width / totalColumns) * index + Math.random() * 10 - 5;
  
  // Build character column with gradient effect through multiple characters
  const buildCharacterColumn = () => {
    const charSet = MATRIX_CHARS[index % MATRIX_CHARS.length];
    const columnLength = Math.floor(height / 16) + 20; // Characters to fill screen height
    const chars = [];
    
    for (let i = 0; i < columnLength; i++) {
      const char = charSet[Math.floor(Math.random() * charSet.length)];
      const isHead = i === 0;
      const opacity = isHead ? 1 : Math.max(0, 1 - (i / columnLength) * 1.5);
      const color = isHead 
        ? '#ffffff'
        : i < 3 
          ? '#00ff41'
          : i < 6
            ? '#00dd33'
            : i < 10
              ? '#00bb22'
              : i < 15
                ? '#009911'
                : '#007700';
      
      chars.push(
        <Text 
          key={i} 
          style={[
            styles.matrixChar,
            { 
              color,
              opacity,
              textShadowColor: isHead ? '#ffffff' : color,
              textShadowRadius: isHead ? 10 : 2,
            }
          ]}
        >
          {char}
        </Text>
      );
    }
    
    return chars;
  };
  
  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 0.9,
      duration: 500,
      delay: delay,
      useNativeDriver: true,
    }).start();
    
    // Start falling animation
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: height,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -height * 1.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.column,
        {
          left: leftPosition,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {buildCharacterColumn()}
    </Animated.View>
  );
};

export const MatrixRainColumns: React.FC = () => {
  // Calculate optimal number of columns based on screen width
  const columnCount = Math.floor(width / 25); // ~25px per column for good density
  
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: columnCount }).map((_, index) => (
        <MatrixColumn 
          key={index} 
          index={index}
          totalColumns={columnCount}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  column: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: height * 2.5, // Extra height for seamless looping
  },
  matrixChar: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 0 },
  },
});

export default MatrixRainColumns;