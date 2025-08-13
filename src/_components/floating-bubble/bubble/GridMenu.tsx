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
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
} from '@/src/_shared/icons/lucide-icons';

interface GridMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function GridMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: GridMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Grid configuration
  const gridSize = 45;
  const gridSpacing = 8;
  const totalGridWidth = (gridSize * 3) + (gridSpacing * 2);
  const totalGridHeight = (gridSize * 2) + gridSpacing;
  
  // Calculate grid anchor position (adjusts based on screen edges)
  const getGridAnchor = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    let anchorX = buttonPosition.x;
    let anchorY = buttonPosition.y;
    
    // Adjust horizontal position
    if (buttonX < totalGridWidth / 2) {
      // Too close to left edge, shift grid right
      anchorX = buttonPosition.x - gridSize - gridSpacing;
    } else if (buttonX > screenWidth - totalGridWidth / 2) {
      // Too close to right edge, shift grid left
      anchorX = buttonPosition.x + gridSize + gridSpacing;
    }
    
    // Adjust vertical position
    if (buttonY < totalGridHeight / 2) {
      // Too close to top edge, shift grid down
      anchorY = buttonPosition.y - gridSize - gridSpacing;
    } else if (buttonY > screenHeight - totalGridHeight / 2) {
      // Too close to bottom edge, shift grid up
      anchorY = buttonPosition.y + gridSize + gridSpacing;
    }
    
    return { x: anchorX, y: anchorY };
  };
  
  const gridAnchor = getGridAnchor();
  
  // Animation values for grid items
  const gridItems = [
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
    { scale: useSharedValue(0), opacity: useSharedValue(0) },
  ];
  
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.4, { duration: 300 });
    
    // Animate grid items with stagger effect
    gridItems.forEach((item, index) => {
      const delay = index * 25;
      item.scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
      item.opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  // Calculate grid positions (2x3 grid)
  const getGridPosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return {
      x: gridAnchor.x - ((col - 1) * (gridSize + gridSpacing)),
      y: gridAnchor.y - ((row - 0.5) * (gridSize + gridSpacing)),
    };
  };

  // Create animated styles for all items
  const itemStyles = gridItems.map((item, index) => {
    const position = getGridPosition(index);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAnimatedStyle(() => ({
      right: position.x,
      bottom: position.y,
      transform: [{ scale: item.scale.value }],
      opacity: item.opacity.value,
    }));
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { onPress: onQueryPress, icon: <View style={styles.tanstackContainer}><TanstackLogo /></View> },
    { onPress: onEnvPress, icon: <ServerIcon size={16} color="white" /> },
    { onPress: onSentryPress, icon: <BugIcon size={16} color="white" /> },
    { onPress: onStoragePress, icon: <DatabaseIcon size={16} color="white" /> },
    { onPress: onWifiToggle, icon: isWifiEnabled ? <WifiIcon size={16} color="white" /> : <WifiOffIcon size={16} color="white" /> },
    { onPress: onClose, icon: <View style={styles.closeButton}><View style={styles.closeDot} /></View> },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      {menuItems.map((item, index) => (
        <Animated.View key={index} style={[styles.itemContainer, itemStyles[index]]}>
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
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tanstackContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});