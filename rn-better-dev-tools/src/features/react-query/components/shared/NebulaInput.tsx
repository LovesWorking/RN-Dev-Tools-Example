import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated as RNAnimated,
  TextInputProps,
  Dimensions,
  Platform,
} from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const runningBorderPath = (width: number, height: number, radius: number, padding: number = 0) => {
  const offset = 1 + padding;
  const w = width - padding * 2;
  const h = height - padding * 2;
  
  return `
    M ${radius + offset}, ${offset}
    L ${w - radius - offset + padding * 2}, ${offset}
    Q ${w - offset + padding * 2}, ${offset} ${w - offset + padding * 2}, ${radius + offset}
    L ${w - offset + padding * 2}, ${h - radius - offset + padding * 2}
    Q ${w - offset + padding * 2}, ${h - offset + padding * 2} ${w - radius - offset + padding * 2}, ${h - offset + padding * 2}
    L ${radius + offset}, ${h - offset + padding * 2}
    Q ${offset}, ${h - offset + padding * 2} ${offset}, ${h - radius - offset + padding * 2}
    L ${offset}, ${radius + offset}
    Q ${offset}, ${offset} ${radius + offset}, ${offset}
  `;
};

interface NebulaInputProps extends TextInputProps {
  label?: string;
  containerStyle?: any;
}

export function NebulaInput({
  label = "Search",
  containerStyle,
  ...props
}: NebulaInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value && props.value !== '');
  const [dimensions, setDimensions] = useState({ width: 300, height: 56 });

  // Animated values for label
  const labelAnimation = useRef(new RNAnimated.Value(!!props.value && props.value !== '' ? 1 : 0)).current;
  
  // For animated border
  const radius = 10;
  const { width, height } = dimensions;
  const glowPadding = 30; // Extra padding for massive blur glow
  const runningBorderData = runningBorderPath(width, height, radius, 0);
  const glowBorderData = runningBorderPath(width + glowPadding * 2, height + glowPadding * 2, radius, glowPadding);
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;
  
  // Create asymmetric segments like the original - one long, one short
  // First segment: 9% of circle (like purple in original)
  // Second segment: 4% of circle (like pink in original)
  const segment1Length = perimeter * 0.09;  // Longer segment
  const gap1Length = perimeter * 0.41;      // Gap to position second segment opposite
  const segment2Length = perimeter * 0.04;  // Shorter segment
  const gap2Length = perimeter * 0.46;      // Remaining gap
  
  // Create dash pattern with asymmetric segments
  const dashPattern = `${segment1Length} ${gap1Length} ${segment2Length} ${gap2Length}`;
  
  const offset = useSharedValue(0);

  useEffect(() => {
    // Check if input has value from props
    const currentHasValue = !!props.value && props.value !== '';
    setHasValue(currentHasValue);
    
    // Animate label when focused or has value
    RNAnimated.timing(labelAnimation, {
      toValue: isFocused || currentHasValue ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isFocused, hasValue, labelAnimation, props.value]);

  useEffect(() => {
    // Only animate when focused
    if (isFocused) {
      // Single animation that rotates both segments together
      offset.value = withRepeat(
        withTiming(perimeter, {
          duration: 4000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      offset.value = 0;
    }
  }, [isFocused, offset, perimeter]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: -offset.value, // Negative to move forward
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.({} as any);
  };

  const handleChangeText = (text: string) => {
    setHasValue(text.length > 0);
    props.onChangeText?.(text);
  };

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  return (
    <View 
      style={[styles.container, containerStyle]} 
      onLayout={handleLayout}
    >
      <View style={[styles.inputWrapper, { width, height, borderRadius: radius }]}>
        <TextInput
          {...props}
          style={[styles.input, props.style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          placeholderTextColor="#c0b9c0"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          textContentType="none"
          importantForAutofill="no"
          showSoftInputOnFocus={true}
          caretHidden={false}
          contextMenuHidden={false}
        />

        {/* Animated label */}
        <RNAnimated.View
          style={[
            styles.label,
            {
              transform: [
                {
                  translateY: labelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
                {
                  scale: labelAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.85],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <RNAnimated.Text
            style={[
              styles.labelText,
              {
                color: labelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["#c0b9c0", "#cf30aa"],
                }),
              },
            ]}
          >
            {label}
          </RNAnimated.Text>
        </RNAnimated.View>

        {/* Animated gradient border with glow - only show when focused */}
        {isFocused && (
          <>
            {/* Outer glow layers - positioned to extend outside */}
            <Svg 
              width={width + glowPadding * 2} 
              height={height + glowPadding * 2} 
              style={[styles.svgBorder, { left: -glowPadding, top: -glowPadding }]}
            >
              <Defs>
                <LinearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="10%" stopColor="#402fb5" stopOpacity="0.5" />
                  <Stop offset="30%" stopColor="#8b5cf6" stopOpacity="1" />
                  <Stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                  <Stop offset="70%" stopColor="#8b5cf6" stopOpacity="1" />
                  <Stop offset="90%" stopColor="#402fb5" stopOpacity="0.5" />
                  <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              
              {/* Task 3: Multiple blur layers with different intensities */}
              {/* Massive soft blur - creates the aura */}
              <AnimatedPath
                d={glowBorderData}
                strokeLinecap="butt"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth={30}
                strokeDasharray={dashPattern}
                animatedProps={animatedProps}
                opacity={0.15}
              />
              
              {/* Medium blur - transition layer */}
              <AnimatedPath
                d={glowBorderData}
                strokeLinecap="butt"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth={15}
                strokeDasharray={dashPattern}
                animatedProps={animatedProps}
                opacity={0.25}
              />
              
              {/* Tight blur - near the border */}
              <AnimatedPath
                d={glowBorderData}
                strokeLinecap="butt"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth={8}
                strokeDasharray={dashPattern}
                animatedProps={animatedProps}
                opacity={0.4}
              />
              
              {/* Sharp core glow */}
              <AnimatedPath
                d={glowBorderData}
                strokeLinecap="butt"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth={4}
                strokeDasharray={dashPattern}
                animatedProps={animatedProps}
                opacity={0.8}
              />
            </Svg>
            
            {/* Main animated border - stays within bounds */}
            <Svg width={width} height={height} style={styles.svgBorder}>
              <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#402fb5" />
                  <Stop offset="30%" stopColor="#8b5cf6" />
                  <Stop offset="50%" stopColor="#cf30aa" />
                  <Stop offset="70%" stopColor="#ec4899" />
                  <Stop offset="100%" stopColor="#402fb5" />
                </LinearGradient>
              </Defs>
              
              {/* Main border with two segments */}
              <AnimatedPath
                d={runningBorderData}
                strokeLinecap="butt"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth={3.5}
                strokeDasharray={dashPattern}
                animatedProps={animatedProps}
              />
            </Svg>
          </>
        )}

        {/* Static border for unfocused state */}
        {!isFocused && (
          <Svg width={width} height={height} style={styles.svgBorder}>
            <Path
              d={runningBorderData}
              strokeLinecap="round"
              fill="none"
              stroke="rgba(64, 47, 181, 0.2)"
              strokeWidth={1}
            />
          </Svg>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
    marginHorizontal: 25,
    position: "relative",
  },
  
  inputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#010201",
  },

  input: {
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 16,
    backgroundColor: "transparent",
    zIndex: 1,
  },

  label: {
    position: "absolute",
    left: 14,
    top: 18,
    backgroundColor: "#010201",
    paddingHorizontal: 4,
    zIndex: 2,
  },
  
  labelText: {
    fontWeight: "500",
    fontSize: 14,
  },

  svgBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  
  svgShadow: {
    opacity: 0.6,
    // Apply blur to create glow effect
    ...Platform.select({
      ios: {
        // iOS-specific blur
        filter: 'blur(4px)',
      },
      android: {
        // Android doesn't support filter, we'll rely on opacity and stroke width
      },
    }),
  },
});