import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
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

interface AdaptiveRadialMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function AdaptiveRadialMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: AdaptiveRadialMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Detect which quadrant the button is in
  const getQuadrant = () => {
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    
    // Convert from right/bottom to x/y coordinates
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    if (buttonX <= centerX && buttonY <= centerY) return 'top-left';
    if (buttonX > centerX && buttonY <= centerY) return 'top-right';
    if (buttonX <= centerX && buttonY > centerY) return 'bottom-left';
    return 'bottom-right';
  };
  
  const quadrant = getQuadrant();
  
  // Position values for each item
  const item1Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y });
  const item2Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y });
  const item3Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y });
  const item4Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y });
  const item5Value = useSharedValue({ x: buttonPosition.x, y: buttonPosition.y });
  
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.4, { duration: 300 });
    const radius = 65;
    const itemCount = 5;
    
    // Adjust starting angle based on quadrant to keep items on screen
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    
    switch (quadrant) {
      case 'top-left':
        startAngle = 0;
        endAngle = Math.PI / 2; // Only show in bottom-right quadrant
        break;
      case 'top-right':
        startAngle = Math.PI / 2;
        endAngle = Math.PI; // Only show in bottom-left quadrant
        break;
      case 'bottom-left':
        startAngle = -Math.PI / 2;
        endAngle = 0; // Only show in top-right quadrant
        break;
      case 'bottom-right':
        startAngle = Math.PI;
        endAngle = Math.PI * 1.5; // Only show in top-left quadrant
        break;
    }
    
    const angleRange = endAngle - startAngle;
    const angleStep = angleRange / (itemCount - 1);
    
    // Calculate positions
    const angles = Array.from({ length: itemCount }, (_, i) => startAngle + (i * angleStep));
    
    // Animate items to their positions
    item1Value.value = withDelay(0, withSpring({ 
      x: buttonPosition.x + Math.cos(angles[0]) * radius, 
      y: buttonPosition.y + Math.sin(angles[0]) * radius 
    }));
    
    item2Value.value = withDelay(40, withSpring({ 
      x: buttonPosition.x + Math.cos(angles[1]) * radius, 
      y: buttonPosition.y + Math.sin(angles[1]) * radius 
    }));
    
    item3Value.value = withDelay(80, withSpring({ 
      x: buttonPosition.x + Math.cos(angles[2]) * radius, 
      y: buttonPosition.y + Math.sin(angles[2]) * radius 
    }));
    
    item4Value.value = withDelay(120, withSpring({ 
      x: buttonPosition.x + Math.cos(angles[3]) * radius, 
      y: buttonPosition.y + Math.sin(angles[3]) * radius 
    }));
    
    item5Value.value = withDelay(160, withSpring({ 
      x: buttonPosition.x + Math.cos(angles[4]) * radius, 
      y: buttonPosition.y + Math.sin(angles[4]) * radius 
    }));
  };

  useEffect(() => {
    handleOpen();
  }, []);

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

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      {/* React Query */}
      <Animated.View style={[styles.itemContainer, createItemStyle(item5Value)]}>
        <Pressable onPress={onQueryPress} style={styles.button}>
          <View style={styles.tanstackContainer}>
            <TanstackLogo />
          </View>
        </Pressable>
      </Animated.View>

      {/* Environment */}
      <Animated.View style={[styles.itemContainer, createItemStyle(item4Value)]}>
        <Pressable onPress={onEnvPress} style={styles.button}>
          <ServerIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* Sentry */}
      <Animated.View style={[styles.itemContainer, createItemStyle(item3Value)]}>
        <Pressable onPress={onSentryPress} style={styles.button}>
          <BugIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* Storage */}
      <Animated.View style={[styles.itemContainer, createItemStyle(item2Value)]}>
        <Pressable onPress={onStoragePress} style={styles.button}>
          <DatabaseIcon size={18} color="white" />
        </Pressable>
      </Animated.View>

      {/* WiFi */}
      <Animated.View style={[styles.itemContainer, createItemStyle(item1Value)]}>
        <Pressable onPress={onWifiToggle} style={styles.button}>
          {isWifiEnabled ? (
            <WifiIcon size={18} color="white" />
          ) : (
            <WifiOffIcon size={18} color="white" />
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  itemContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
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
  },
});