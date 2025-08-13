import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  LayersIcon,
} from '@/src/_shared/icons/lucide-icons';

interface DevToolsFloatingMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
}

export function DevToolsFloatingMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
}: DevToolsFloatingMenuProps) {
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const fourthValue = useSharedValue(30);
  const fifthValue = useSharedValue(30);
  
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const fourthWidth = useSharedValue(60);
  const fifthWidth = useSharedValue(60);
  
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    
    if (isOpen.value) {
      firstWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config));
        }
      });
      fourthWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          fourthValue.value = withDelay(150, withTiming(30, config));
        }
      });
      fifthWidth.value = withTiming(60, {duration: 100}, finish => {
        if (finish) {
          fifthValue.value = withDelay(200, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, {duration: 100});
      // Close the menu after animation
      if (onClose) {
        setTimeout(onClose, 600);
      }
    } else {
      firstValue.value = withDelay(400, withSpring(130));
      secondValue.value = withDelay(300, withSpring(210));
      thirdValue.value = withDelay(200, withSpring(290));
      fourthValue.value = withDelay(100, withSpring(370));
      fifthValue.value = withSpring(450);
      
      firstWidth.value = withDelay(1400, withSpring(180));
      secondWidth.value = withDelay(1300, withSpring(180));
      thirdWidth.value = withDelay(1200, withSpring(180));
      fourthWidth.value = withDelay(1100, withSpring(180));
      fifthWidth.value = withDelay(1000, withSpring(180));
      
      opacity.value = withDelay(1400, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

  // Open menu automatically when component mounts
  useEffect(() => {
    console.log('DevToolsFloatingMenu mounted, opening menu...');
    // Immediately open the menu for testing
    handlePress();
  }, []);

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    };
  });
  const fourthWidthStyle = useAnimatedStyle(() => {
    return {
      width: fourthWidth.value,
    };
  });
  const fifthWidthStyle = useAnimatedStyle(() => {
    return {
      width: fifthWidth.value,
    };
  });

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: firstValue.value,
      transform: [{scale: scale}],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: secondValue.value,
      transform: [{scale: scale}],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: thirdValue.value,
      transform: [{scale: scale}],
    };
  });

  const fourthIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      fourthValue.value,
      [30, 370],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: fourthValue.value,
      transform: [{scale: scale}],
    };
  });

  const fifthIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      fifthValue.value,
      [30, 450],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: fifthValue.value,
      transform: [{scale: scale}],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${progress.value * 45}deg`}],
    };
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />
      {/* WiFi Toggle */}
      <Pressable onPress={onWifiToggle}>
        <Animated.View
          style={[styles.contentContainer, fifthIcon, fifthWidthStyle]}>
          <View style={styles.iconContainer}>
            {isWifiEnabled ? (
              <WifiIcon size={18} color="white" />
            ) : (
              <WifiOffIcon size={18} color="white" />
            )}
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            {isWifiEnabled ? 'WiFi On' : 'WiFi Off'}
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {/* Storage */}
      <Pressable onPress={onStoragePress}>
        <Animated.View
          style={[styles.contentContainer, fourthIcon, fourthWidthStyle]}>
          <View style={styles.iconContainer}>
            <DatabaseIcon size={18} color="white" />
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            Storage
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {/* Sentry */}
      <Pressable onPress={onSentryPress}>
        <Animated.View
          style={[styles.contentContainer, thirdIcon, thirdWidthStyle]}>
          <View style={styles.iconContainer}>
            <BugIcon size={18} color="white" />
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            Sentry
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {/* Environment */}
      <Pressable onPress={onEnvPress}>
        <Animated.View
          style={[styles.contentContainer, secondIcon, secondWidthStyle]}>
          <View style={styles.iconContainer}>
            <ServerIcon size={18} color="white" />
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            Environment
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {/* React Query */}
      <Pressable onPress={onQueryPress}>
        <Animated.View
          style={[styles.contentContainer, firstIcon, firstWidthStyle]}>
          <View style={styles.iconContainer}>
            <View style={styles.tanstackContainer}>
              <TanstackLogo />
            </View>
          </View>
          <Animated.Text style={[styles.text, opacityText]}>
            React Query
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {/* Main Menu Button */}
      <Pressable
        style={styles.contentContainer}
        onPress={handlePress}>
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <LayersIcon size={20} color="white" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: '#171717',
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // Higher elevation for Android
    zIndex: 10000, // Even higher z-index
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tanstackContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 16,
  },
});