import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Text,
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
  XIcon,
} from '@/src/_shared/icons/lucide-icons';

interface GridMenuWithLabelsProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function GridMenuWithLabels({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: GridMenuWithLabelsProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Grid configuration
  const gridItemWidth = 75;
  const gridItemHeight = 65;
  const gridSpacing = 8;
  const gridColumns = 3;
  const gridRows = 2;
  const totalGridWidth = (gridItemWidth * gridColumns) + (gridSpacing * (gridColumns - 1));
  const totalGridHeight = (gridItemHeight * gridRows) + (gridSpacing * (gridRows - 1));
  
  // Calculate grid position to keep it on screen
  const getGridPosition = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    let gridX = buttonPosition.x - totalGridWidth / 2 + 25;
    let gridY = buttonPosition.y + 40;
    
    // Adjust if too close to edges
    if (buttonX < totalGridWidth / 2 + 20) {
      gridX = buttonPosition.x - 60;
    } else if (buttonX > screenWidth - totalGridWidth / 2 - 20) {
      gridX = buttonPosition.x + totalGridWidth - 15;
    }
    
    if (buttonY < totalGridHeight + 60) {
      gridY = buttonPosition.y - totalGridHeight - 20;
    }
    
    return { x: gridX, y: gridY };
  };
  
  const gridPosition = getGridPosition();
  
  // Animation values
  const containerScale = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.5, { duration: 200 });
    containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    containerOpacity.value = withTiming(1, { duration: 150 });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { onPress: onQueryPress, icon: <View style={styles.tanstackContainer}><TanstackLogo /></View>, label: 'Query' },
    { onPress: onEnvPress, icon: <ServerIcon size={20} color="white" />, label: 'Env' },
    { onPress: onSentryPress, icon: <BugIcon size={20} color="white" />, label: 'Sentry' },
    { onPress: onStoragePress, icon: <DatabaseIcon size={20} color="white" />, label: 'Storage' },
    { onPress: onWifiToggle, icon: isWifiEnabled ? <WifiIcon size={20} color="white" /> : <WifiOffIcon size={20} color="white" />, label: isWifiEnabled ? 'WiFi On' : 'WiFi Off' },
    { onPress: onClose, icon: <XIcon size={20} color="white" />, label: 'Close' },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      <Animated.View style={[
        styles.gridContainer,
        containerStyle,
        {
          right: gridPosition.x,
          bottom: gridPosition.y,
        }
      ]}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.gridItem,
              pressed && styles.gridItemPressed
            ]}
          >
            <View style={styles.iconWrapper}>
              {item.icon}
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        ))}
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
  gridContainer: {
    position: 'absolute',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 247,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  gridItem: {
    width: 75,
    height: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.2)',
  },
  gridItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 0.95 }],
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  tanstackContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});