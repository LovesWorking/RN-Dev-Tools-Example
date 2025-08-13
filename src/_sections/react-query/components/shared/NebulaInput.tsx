import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
} from "react-native";

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

  // Animated values for label
  const labelAnimation = useRef(new Animated.Value(!!props.value && props.value !== '' ? 1 : 0)).current;

  useEffect(() => {
    // Check if input has value from props
    const currentHasValue = !!props.value && props.value !== '';
    setHasValue(currentHasValue);
    
    // Animate label when focused or has value
    Animated.timing(labelAnimation, {
      toValue: isFocused || currentHasValue ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isFocused, hasValue, labelAnimation, props.value]);

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

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Outer glow layer - purple/pink glow */}
      {isFocused && (
        <View style={styles.glowOuter} />
      )}
      
      {/* Middle glow layer - blue/purple gradient */}
      <View style={[styles.glowMiddle, isFocused && styles.glowMiddleActive]} />
      
      {/* Inner border gradient */}
      <View style={[styles.borderGradient, isFocused && styles.borderGradientActive]} />
      
      {/* Main input container */}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          style={[styles.input, props.style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          placeholderTextColor="#6B7280"
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
        <Animated.View
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
          <Animated.Text
            style={[
              styles.labelText,
              {
                color: labelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["#6B7280", "#cf30aa"],
                }),
              },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    minHeight: 56,
    justifyContent: "center",
    marginVertical: 4,
  },
  
  // Outermost glow effect
  glowOuter: {
    position: "absolute",
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 16,
    backgroundColor: "transparent",
    opacity: 0.3,
    boxShadow: `
      0px 0px 40px 15px rgba(207, 48, 170, 0.4),
      0px 0px 80px 30px rgba(64, 47, 181, 0.3)
    `,
  },
  
  // Middle glow layer
  glowMiddle: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 12,
    backgroundColor: "transparent",
    opacity: 0,
    boxShadow: `
      0px 0px 20px 5px rgba(160, 153, 216, 0.3),
      0px 0px 40px 10px rgba(223, 162, 218, 0.2)
    `,
  },
  glowMiddleActive: {
    opacity: 0.8,
  },
  
  // Border gradient effect
  borderGradient: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
    // Create gradient border effect with shadows
    boxShadow: `
      inset -2px -2px 4px rgba(64, 47, 181, 0.3),
      inset 2px 2px 4px rgba(207, 48, 170, 0.3),
      inset 0px 0px 2px rgba(147, 51, 234, 0.2)
    `,
  },
  borderGradientActive: {
    borderWidth: 2,
    // Enhanced gradient border when focused
    boxShadow: `
      inset -3px -3px 6px rgba(64, 47, 181, 0.5),
      inset 3px 3px 6px rgba(207, 48, 170, 0.5),
      inset 0px 0px 4px rgba(147, 51, 234, 0.4),
      0px 0px 15px rgba(147, 51, 234, 0.3)
    `,
  },
  
  inputContainer: {
    position: "relative",
    borderRadius: 10,
    backgroundColor: "#010201",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
    overflow: "hidden",
  },

  input: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 16,
    minHeight: 56,
    backgroundColor: "transparent",
  },

  label: {
    position: "absolute",
    left: 14,
    top: 18,
    backgroundColor: "#010201",
    paddingHorizontal: 4,
  },
  
  labelText: {
    fontWeight: "500",
    fontSize: 14,
  },
});