import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View, Text, Dimensions } from 'react-native';

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const MATRIX_COLORS = ['#00FF00', '#00DD00', '#00BB00', '#00FF44', '#44FF00', '#00FF88'];
const GLOW_COLORS = ['#00FF00', '#00FFAA', '#AAFFAA', '#88FF88'];

interface MatrixCharacterProps {
  char: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  color: string;
  glowColor: string;
  containerHeight: number;
  delay: number;
}

const MatrixCharacter: React.FC<MatrixCharacterProps> = ({ 
  char, 
  size, 
  initialX, 
  initialY, 
  duration, 
  color, 
  glowColor,
  containerHeight,
  delay 
}) => {
  const yPosition = useRef(new Animated.Value(initialY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start with a delay for staggered effect
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          // Fade in with glow
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 1,
              duration: 150,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          // Fall down
          Animated.parallel([
            Animated.timing(yPosition, {
              toValue: containerHeight + size * 2,
              duration: duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            // Fade out glow as it falls
            Animated.timing(glowOpacity, {
              toValue: 0,
              duration: duration * 0.8,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
            // Gradual fade out
            Animated.timing(opacity, {
              toValue: 0.2,
              duration: duration,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          // Reset
          Animated.parallel([
            Animated.timing(yPosition, { toValue: initialY, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(glowOpacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, delay);
  }, [yPosition, opacity, glowOpacity, duration, initialY, size, containerHeight, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: initialX,
        transform: [{ translateY: yPosition }],
        opacity: opacity,
      }}
    >
      {/* Glow layer */}
      <Animated.Text
        style={[
          styles.matrixChar,
          {
            fontSize: size,
            color: glowColor,
            opacity: glowOpacity,
            position: 'absolute',
            textShadowColor: glowColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 15,
          },
        ]}
      >
        {char}
      </Animated.Text>
      {/* Main character */}
      <Text
        style={[
          styles.matrixChar,
          {
            fontSize: size,
            color: color,
            textShadowColor: color,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 3,
          },
        ]}
      >
        {char}
      </Text>
    </Animated.View>
  );
};

interface MatrixStreamProps {
  streamX: number;
  containerHeight: number;
  containerWidth: number;
  streamIndex: number;
}

const MatrixStream: React.FC<MatrixStreamProps> = ({ 
  streamX, 
  containerHeight, 
  containerWidth,
  streamIndex 
}) => {
  const charCount = Math.floor(Math.random() * 8 + 12); // 12-20 characters per stream
  const characters = useRef<(MatrixCharacterProps & { id: string })[]>([]).current;

  if (characters.length === 0) {
    const streamSpeed = Math.random() * 3000 + 4000; // 4-7 seconds
    const charSpacing = 20 + Math.random() * 10; // Spacing between characters
    
    for (let i = 0; i < charCount; i++) {
      const isLeadChar = i === 0;
      characters.push({
        id: `${streamIndex}-${i}`,
        char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
        size: isLeadChar ? 14 : 12 + Math.random() * 2,
        initialX: streamX,
        initialY: -i * charSpacing - Math.random() * 100,
        duration: streamSpeed,
        color: isLeadChar 
          ? '#FFFFFF' 
          : MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)],
        glowColor: isLeadChar 
          ? '#FFFFFF'
          : GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)],
        containerHeight: containerHeight,
        delay: i * 100, // Stagger characters in stream
      });
    }
  }

  return (
    <>
      {characters.map(char => (
        <MatrixCharacter
          key={char.id}
          char={char.char}
          size={char.size}
          initialX={char.initialX}
          initialY={char.initialY}
          duration={char.duration}
          color={char.color}
          glowColor={char.glowColor}
          containerHeight={char.containerHeight}
          delay={char.delay}
        />
      ))}
    </>
  );
};

export const MatrixRainBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<{width: number, height: number} | null>(null);
  const STREAM_COUNT = 15; // Number of Matrix rain streams

  const streamsData = useRef<{ id: string; x: number }[]>([]).current;

  if (layout && streamsData.length === 0) {
    // Initialize streams with distributed X positions
    const spacing = layout.width / STREAM_COUNT;
    for (let i = 0; i < STREAM_COUNT; i++) {
      streamsData.push({
        id: i.toString(),
        x: i * spacing + Math.random() * spacing * 0.5,
      });
    }
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (!layout || layout.width !== width || layout.height !== height) {
      if (layout) streamsData.length = 0;
      setLayout({ width, height });
    }
  };

  // Animated scanline
  const scanlineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (layout) {
      Animated.loop(
        Animated.timing(scanlineY, {
          toValue: layout.height,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [layout, scanlineY]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Matrix rain streams */}
      {layout && streamsData.map((stream, index) => (
        <MatrixStream
          key={stream.id}
          streamX={stream.x}
          containerHeight={layout.height}
          containerWidth={layout.width}
          streamIndex={index}
        />
      ))}
      
      {/* Animated scanline */}
      {layout && (
        <Animated.View
          style={[
            styles.scanline,
            {
              transform: [{ translateY: scanlineY }],
            },
          ]}
        />
      )}
      
      {/* Digital grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />
      
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
  matrixChar: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00FF00',
    opacity: 0.2,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.02,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(0, 255, 0, 0.03) 20px,
      rgba(0, 255, 0, 0.03) 21px
    ), repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(0, 255, 0, 0.03) 20px,
      rgba(0, 255, 0, 0.03) 21px
    )`,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default MatrixRainBackground;