import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, Animated } from "react-native";
import { styles } from "./styles";
const SHADOW_COLOR = "#add8e6";
const ANIMATION_DURATION = 1500;
const GLITCH_AMPLITUDE = 5;
const REPEAT_DELAY = 2000;

const Glitch = (
  {
    text = "",
    glitchHeight = 80,
    glitchAmplitude = GLITCH_AMPLITUDE,
    glitchDuration = ANIMATION_DURATION,
    repeatDelay = REPEAT_DELAY,
    shadowColor = SHADOW_COLOR,
    textStyle,
    heightInputRange = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    positionYInputRange = [0, 10, 20, 30, 60, 65, 70, 80, 90, 100],
    outOfTextRange = false,
    disableAutoAnimation = false,
  },
  ref
) => {
  const mainAnimatedValue = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;

  const runAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(animatedX, {
          toValue: -glitchAmplitude,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
        Animated.spring(animatedX, {
          toValue: glitchAmplitude,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
      ])
    ).start();

    Animated.timing(mainAnimatedValue, {
      toValue: 100,
      duration: glitchDuration,
      useNativeDriver: false,
    }).start(() => {
      mainAnimatedValue.setValue(0);
      if (!disableAutoAnimation) {
        setTimeout(() => runAnimation(), repeatDelay);
      }
    });
  };

  useEffect(() => {
    if (!disableAutoAnimation) {
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    animate: runAnimation,
  }));

  const height = mainAnimatedValue.interpolate({
    inputRange: heightInputRange,
    outputRange: [
      0.01,
      glitchHeight / 4,
      glitchHeight / 8,
      glitchHeight / 2.5,
      glitchHeight / 2.5,
      glitchHeight / 2.5,
      glitchHeight / 5.5,
      glitchHeight / 4,
      glitchHeight / 8,
      glitchHeight / 8,
      glitchHeight / 4,
    ],
  });

  const positionY = mainAnimatedValue.interpolate({
    inputRange: positionYInputRange,
    outputRange: [
      glitchHeight / 2.5,
      glitchHeight / 2,
      glitchHeight / 4,
      glitchHeight / 1.3,
      glitchHeight / 1.3,
      glitchHeight / 4,
      glitchHeight / 16,
      0,
      0,
      glitchHeight / 4,
    ],
  });

  const renderText = (isCover = false) => {
    return (
      <Text
        style={[
          styles.text,
          { fontSize: glitchHeight / 2.5 },
          textStyle,
          isCover ? styles.glitchText : null,
          isCover ? { textShadowColor: shadowColor } : null,
        ]}
      >
        {text?.toUpperCase()}
      </Text>
    );
  };

  return (
    <View style={styles.row}>
      {renderText()}
      <Animated.View
        style={[
          styles.row,
          styles.coverContainer,
          { height },
          { transform: [{ translateX: animatedX }, { translateY: positionY }] },
        ]}
      >
        <Animated.View
          style={[
            styles.row,
            {
              transform: [
                {
                  translateY: outOfTextRange
                    ? Animated.multiply(animatedX, -1)
                    : Animated.multiply(positionY, -1),
                },
              ],
              height: glitchHeight,
            },
          ]}
        >
          {renderText(true)}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default forwardRef(Glitch);
