import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
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

interface RadialFloatingMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number }; // Position of the trigger button
}

export function RadialFloatingMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: RadialFloatingMenuProps) {
  // Position values for each item (start at button position)
  const item1Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }); // WiFi
  const item2Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }); // Storage
  const item3Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }); // Sentry
  const item4Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }); // Environment
  const item5Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }); // React Query
  
  const isOpen = useSharedValue(false);
  const backdropOpacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    
    if (isOpen.value) {
      // Close animation - all items return to button position
      backdropOpacity.value = withTiming(0, { duration: 300 });
      item1Value.value = withTiming({ x: buttonPosition.x, y: buttonPosition.y }, config);
      item2Value.value = withDelay(50, withTiming({ x: buttonPosition.x, y: buttonPosition.y }, config));
      item3Value.value = withDelay(100, withTiming({ x: buttonPosition.x, y: buttonPosition.y }, config));
      item4Value.value = withDelay(150, withTiming({ x: buttonPosition.x, y: buttonPosition.y }, config));
      item5Value.value = withDelay(200, withTiming({ x: buttonPosition.x, y: buttonPosition.y }, config));
    } else {
      // Open animation - items spread in perfect circle
      backdropOpacity.value = withTiming(0.4, { duration: 300 });
      const radius = 65; // Tighter circle for 50px buttons
      const itemCount = 5;
      
      // Calculate positions for items in a perfect circle
      // Starting from top and going clockwise
      const angleStep = (Math.PI * 2) / itemCount;
      const startAngle = -Math.PI / 2; // Start from top (12 o'clock)
      
      // Calculate all positions with equal spacing
      const angles = Array.from({ length: itemCount }, (_, i) => startAngle + (i * angleStep));
      
      // Item 1: WiFi (top position)
      item1Value.value = withDelay(0, withSpring({ 
        x: buttonPosition.x + Math.cos(angles[0]) * radius, 
        y: buttonPosition.y + Math.sin(angles[0]) * radius 
      }, { damping: 12, stiffness: 180 }));
      
      // Item 2: Storage (top-right)
      item2Value.value = withDelay(40, withSpring({ 
        x: buttonPosition.x + Math.cos(angles[1]) * radius, 
        y: buttonPosition.y + Math.sin(angles[1]) * radius 
      }, { damping: 12, stiffness: 180 }));
      
      // Item 3: Sentry (bottom-right)
      item3Value.value = withDelay(80, withSpring({ 
        x: buttonPosition.x + Math.cos(angles[2]) * radius, 
        y: buttonPosition.y + Math.sin(angles[2]) * radius 
      }, { damping: 12, stiffness: 180 }));
      
      // Item 4: Environment (bottom-left)
      item4Value.value = withDelay(120, withSpring({ 
        x: buttonPosition.x + Math.cos(angles[3]) * radius, 
        y: buttonPosition.y + Math.sin(angles[3]) * radius 
      }, { damping: 12, stiffness: 180 }));
      
      // Item 5: React Query (top-left)
      item5Value.value = withDelay(160, withSpring({ 
        x: buttonPosition.x + Math.cos(angles[4]) * radius, 
        y: buttonPosition.y + Math.sin(angles[4]) * radius 
      }, { damping: 12, stiffness: 180 }));
    }
    isOpen.value = !isOpen.value;
  };

  // Trigger open animation when component mounts
  useEffect(() => {
    handlePress();
  }, []);

  // Create animated styles for each item
  const createItemStyle = (value: any) => {
    return useAnimatedStyle(() => {
      const distanceFromCenter = Math.sqrt(
        Math.pow(value.value.x - buttonPosition.x, 2) + 
        Math.pow(value.value.y - buttonPosition.y, 2)
      );
      
      const scale = interpolate(
        distanceFromCenter,
        [0, 65],
        [0, 1],
        Extrapolation.CLAMP,
      );

      return {
        right: value.value.x,
        bottom: value.value.y,
        transform: [{ scale }],
      };
    });
  };

  const item1Style = createItemStyle(item1Value);
  const item2Style = createItemStyle(item2Value);
  const item3Style = createItemStyle(item3Value);
  const item4Style = createItemStyle(item4Value);
  const item5Style = createItemStyle(item5Value);

  const mainButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 135}deg` }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      {/* React Query - Left */}
      <Animated.View style={[styles.contentContainer, item5Style]}>
        <Pressable onPress={onQueryPress} style={styles.iconContainer}>
          <View style={styles.tanstackContainer}>
            <TanstackLogo />
          </View>
        </Pressable>
      </Animated.View>

      {/* Environment - Left-Up diagonal */}
      <Animated.View style={[styles.contentContainer, item4Style]}>
        <Pressable onPress={onEnvPress} style={styles.iconContainer}>
          <ServerIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* Sentry - Straight Up */}
      <Animated.View style={[styles.contentContainer, item3Style]}>
        <Pressable onPress={onSentryPress} style={styles.iconContainer}>
          <BugIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* Storage - Right-Up diagonal */}
      <Animated.View style={[styles.contentContainer, item2Style]}>
        <Pressable onPress={onStoragePress} style={styles.iconContainer}>
          <DatabaseIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* WiFi Toggle - Right */}
      <Animated.View style={[styles.contentContainer, item1Style]}>
        <Pressable onPress={onWifiToggle} style={styles.iconContainer}>
          {isWifiEnabled ? (
            <WifiIcon size={18} color="white" />
          ) : (
            <WifiOffIcon size={18} color="white" />
          )}
        </Pressable>
      </Animated.View>

      {/* Main button removed - trigger is in FloatingTools */}
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
    backgroundColor: 'black',
  },
  contentContainer: {
    backgroundColor: '#171717',
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: '#3B82F6',
    zIndex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tanstackContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
});