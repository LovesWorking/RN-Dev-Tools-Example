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
} from '@/src/_shared/icons/lucide-icons';

interface FanMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function FanMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: FanMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Determine best fan direction based on position
  const getFanDirection = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    const edgeThreshold = 100;
    
    // Check proximity to edges
    const nearTop = buttonY < edgeThreshold;
    const nearBottom = buttonY > screenHeight - edgeThreshold;
    const nearLeft = buttonX < edgeThreshold;
    const nearRight = buttonX > screenWidth - edgeThreshold;
    
    if (nearTop && nearRight) return 'bottom-left';
    if (nearTop && nearLeft) return 'bottom-right';
    if (nearBottom && nearRight) return 'top-left';
    if (nearBottom && nearLeft) return 'top-right';
    if (nearTop) return 'bottom';
    if (nearBottom) return 'top';
    if (nearLeft) return 'right';
    if (nearRight) return 'left';
    return 'top'; // Default
  };
  
  const fanDirection = getFanDirection();
  
  // Position values
  const items = [
    useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }),
    useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }),
    useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }),
    useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }),
    useSharedValue({ x: buttonPosition.x, y: buttonPosition.y }),
  ];
  
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.4, { duration: 300 });
    const radius = 70;
    
    // Fan spans 180 degrees (semi-circle)
    let baseAngle = 0;
    
    switch (fanDirection) {
      case 'top':
        baseAngle = -Math.PI; // Fan upward
        break;
      case 'bottom':
        baseAngle = 0; // Fan downward
        break;
      case 'left':
        baseAngle = -Math.PI / 2; // Fan to the left
        break;
      case 'right':
        baseAngle = Math.PI / 2; // Fan to the right
        break;
      case 'top-left':
        baseAngle = -Math.PI * 0.75; // Fan to top-left
        break;
      case 'top-right':
        baseAngle = -Math.PI * 0.25; // Fan to top-right
        break;
      case 'bottom-left':
        baseAngle = Math.PI * 0.75; // Fan to bottom-left
        break;
      case 'bottom-right':
        baseAngle = Math.PI * 0.25; // Fan to bottom-right
        break;
    }
    
    const fanSpread = Math.PI; // 180 degrees
    const angleStep = fanSpread / (items.length - 1);
    
    items.forEach((item, index) => {
      const angle = baseAngle - (fanSpread / 2) + (index * angleStep);
      const delay = index * 30;
      
      item.value = withDelay(delay, withSpring({
        x: buttonPosition.x + Math.cos(angle) * radius,
        y: buttonPosition.y + Math.sin(angle) * radius
      }, { damping: 15, stiffness: 200 }));
    });
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
        [0, 70],
        [0, 1],
        Extrapolation.CLAMP,
      );
      
      const opacity = interpolate(
        distanceFromCenter,
        [0, 35],
        [0, 1],
        Extrapolation.CLAMP,
      );

      return {
        right: value.value.x,
        bottom: value.value.y,
        transform: [{ scale }],
        opacity,
      };
    });
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { onPress: onWifiToggle, icon: isWifiEnabled ? <WifiIcon size={18} color="white" /> : <WifiOffIcon size={18} color="white" /> },
    { onPress: onStoragePress, icon: <DatabaseIcon size={18} color="white" /> },
    { onPress: onSentryPress, icon: <BugIcon size={18} color="white" /> },
    { onPress: onEnvPress, icon: <ServerIcon size={18} color="white" /> },
    { onPress: onQueryPress, icon: <View style={styles.tanstackContainer}><TanstackLogo /></View> },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      {menuItems.map((item, index) => (
        <Animated.View key={index} style={[styles.itemContainer, createItemStyle(items[index])]}>
          <Pressable onPress={item.onPress} style={styles.button}>
            {item.icon}
          </Pressable>
        </Animated.View>
      ))}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    width: 48,
    height: 48,
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