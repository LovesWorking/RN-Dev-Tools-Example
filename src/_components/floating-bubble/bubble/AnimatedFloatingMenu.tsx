import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from '@/src/_shared/icons/lucide-icons';

interface AnimatedFloatingMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedFloatingMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
}: AnimatedFloatingMenuProps) {
  // Animation values for each menu item
  const item1Animation = useSharedValue(0);
  const item2Animation = useSharedValue(0);
  const item3Animation = useSharedValue(0);
  const item4Animation = useSharedValue(0);
  const item5Animation = useSharedValue(0);
  const closeAnimation = useSharedValue(0);
  const backdropAnimation = useSharedValue(0);

  useEffect(() => {
    // Animate backdrop
    backdropAnimation.value = withTiming(1, { duration: 300 });
    
    // Stagger menu items animation
    item5Animation.value = withDelay(0, withSpring(1, { damping: 15 }));
    item4Animation.value = withDelay(50, withSpring(1, { damping: 15 }));
    item3Animation.value = withDelay(100, withSpring(1, { damping: 15 }));
    item2Animation.value = withDelay(150, withSpring(1, { damping: 15 }));
    item1Animation.value = withDelay(200, withSpring(1, { damping: 15 }));
    closeAnimation.value = withDelay(250, withSpring(1, { damping: 15 }));
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAnimation.value * 0.5,
  }));

  const createItemStyle = (animation: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        animation.value,
        [0, 1],
        [100, 0],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        animation.value,
        [0, 1],
        [0.3, 1],
        Extrapolation.CLAMP
      );
      const opacity = animation.value;

      return {
        transform: [
          { translateY },
          { scale },
        ],
        opacity,
      };
    });
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <AnimatedPressable 
        style={[styles.backdrop, backdropStyle]} 
        onPress={onClose} 
      />
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* WiFi Toggle */}
        <AnimatedPressable 
          onPress={onWifiToggle} 
          style={[styles.menuItem, createItemStyle(item1Animation)]}
        >
          <View style={styles.iconContainer}>
            {isWifiEnabled ? (
              <WifiIcon size={18} color="white" />
            ) : (
              <WifiOffIcon size={18} color="white" />
            )}
          </View>
          <Text style={styles.text}>{isWifiEnabled ? 'WiFi On' : 'WiFi Off'}</Text>
        </AnimatedPressable>

        {/* Storage */}
        <AnimatedPressable 
          onPress={onStoragePress} 
          style={[styles.menuItem, createItemStyle(item2Animation)]}
        >
          <View style={styles.iconContainer}>
            <DatabaseIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Storage</Text>
        </AnimatedPressable>

        {/* Sentry */}
        <AnimatedPressable 
          onPress={onSentryPress} 
          style={[styles.menuItem, createItemStyle(item3Animation)]}
        >
          <View style={styles.iconContainer}>
            <BugIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Sentry</Text>
        </AnimatedPressable>

        {/* Environment */}
        <AnimatedPressable 
          onPress={onEnvPress} 
          style={[styles.menuItem, createItemStyle(item4Animation)]}
        >
          <View style={styles.iconContainer}>
            <ServerIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Environment</Text>
        </AnimatedPressable>

        {/* React Query */}
        <AnimatedPressable 
          onPress={onQueryPress} 
          style={[styles.menuItem, createItemStyle(item5Animation)]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.tanstackContainer}>
              <TanstackLogo />
            </View>
          </View>
          <Text style={styles.text}>React Query</Text>
        </AnimatedPressable>

        {/* Close Button */}
        <AnimatedPressable 
          onPress={onClose} 
          style={[styles.menuItem, styles.closeButton, createItemStyle(closeAnimation)]}
        >
          <View style={[styles.iconContainer, { marginRight: 0 }]}>
            <XIcon size={20} color="white" />
          </View>
        </AnimatedPressable>
      </View>
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
  menuContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    gap: 10,
  },
  menuItem: {
    backgroundColor: '#171717',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  },
});