import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export const MatrixBubbles: React.FC = () => {
  // Create Matrix "bubbles" - same technique as your home page
  const matrixBubbles = useRef(
    Array(30) // More bubbles for better effect
      .fill(0)
      .map(() => ({
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 100),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(Math.random() * 0.8 + 0.3),
      }))
  ).current;

  useEffect(() => {
    // Animate Matrix bubbles - exactly like your home page bubbles
    matrixBubbles.forEach((bubble, index) => {
      const startDelay = index * 150; // Stagger start times
      const duration = 5000 + Math.random() * 3000; // 5-8 seconds
      const initialScale = Math.random() * 0.8 + 0.3;

      bubble.y.setValue(height + 100);
      bubble.scale.setValue(initialScale);
      bubble.opacity.setValue(0);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              // Move up from bottom
              Animated.timing(bubble.y, {
                toValue: -150,
                duration: duration,
                useNativeDriver: true,
              }),
              // Fade in then out
              Animated.sequence([
                Animated.timing(bubble.opacity, {
                  toValue: 0.8,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 0.4,
                  duration: duration * 0.7,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 0,
                  duration: duration * 0.15,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            // Reset position
            Animated.parallel([
              Animated.timing(bubble.y, {
                toValue: height + 100,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(bubble.opacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      }, startDelay);
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {matrixBubbles.map((bubble, index) => {
        // Full Matrix characters - Japanese katakana like the original movie
        const matrixChars = [
          'ア', 'イ', 'ウ', 'エ', 'オ',
          'カ', 'キ', 'ク', 'ケ', 'コ',
          'サ', 'シ', 'ス', 'セ', 'ソ',
          'タ', 'チ', 'ツ', 'テ', 'ト',
          'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
          'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
          'マ', 'ミ', 'ム', 'メ', 'モ',
          'ヤ', 'ユ', 'ヨ',
          'ラ', 'リ', 'ル', 'レ', 'ロ',
          'ワ', 'ヲ', 'ン',
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ];
        const char = matrixChars[index % matrixChars.length];
        
        // Vary the colors for more visual interest
        const isHighlight = index % 5 === 0;
        const isPrimary = index % 3 === 0;
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.matrixBubble,
              isHighlight && styles.highlightBubble,
              {
                transform: [
                  { translateX: bubble.x },
                  { translateY: bubble.y },
                  { scale: bubble.scale },
                ],
                opacity: bubble.opacity,
              },
            ]}
          >
            <Text style={[
              styles.matrixText,
              isHighlight && styles.highlightText,
              isPrimary && styles.primaryText,
            ]}>
              {char}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  matrixBubble: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 255, 0, 0.2)',
  },
  highlightBubble: {
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderColor: 'rgba(0, 255, 255, 0.4)',
    borderWidth: 1,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  matrixText: {
    color: '#00FF00',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  highlightText: {
    color: '#00FFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: '#00FFFF',
    textShadowRadius: 6,
  },
  primaryText: {
    color: '#44FF44',
    textShadowColor: '#44FF44',
    textShadowRadius: 4,
  },
});

export default MatrixBubbles;