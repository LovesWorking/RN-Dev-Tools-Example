import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export const MatrixRainFast: React.FC = () => {
  // Create only 5 animated columns for performance
  const columns = useRef(
    Array(5).fill(0).map(() => ({
      y: new Animated.Value(-height),
      opacity: new Animated.Value(0.3),
    }))
  ).current;

  useEffect(() => {
    // Animate each column with native driver
    columns.forEach((col, index) => {
      const delay = index * 400;
      const duration = 6000 + Math.random() * 2000;
      
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(col.y, {
              toValue: height,
              duration: duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(col.y, {
              toValue: -height,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Matrix columns */}
      {columns.map((col, index) => (
        <Animated.View
          key={index}
          style={[
            styles.column,
            {
              left: (index * width / 5) + Math.random() * 40,
              transform: [{ translateY: col.y }],
              opacity: col.opacity,
            },
          ]}
        >
          <Text style={styles.matrixText}>
            {'0101\n1010\n0011\n1100\n0101\n1010\n0011\n1100\n0101\n1010\n0011\n1100\n0101\n1010\n0011\n1100\n0101\n1010\n0011\n1100'}
          </Text>
        </Animated.View>
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
    width: 40,
    height: height * 2,
  },
  matrixText: {
    color: '#00FF00',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    opacity: 0.15,
  },
});

export default MatrixRainFast;