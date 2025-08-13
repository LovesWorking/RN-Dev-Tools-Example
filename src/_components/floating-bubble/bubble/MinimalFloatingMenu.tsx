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

interface MinimalFloatingMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function MinimalFloatingMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: MinimalFloatingMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const menuWidth = 240;
  const itemHeight = 44;
  const menuHeight = (itemHeight * 5) + 8; // 5 items + padding
  
  // Smart positioning
  const getMenuPosition = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    let menuX = buttonPosition.x + 40;
    let menuY = buttonPosition.y - (menuHeight / 2) + 20;
    
    // Adjust if too close to edges
    if (buttonX > screenWidth - menuWidth - 50) {
      menuX = buttonPosition.x + menuWidth - 20;
    }
    
    if (buttonY < menuHeight / 2 + 50) {
      menuY = buttonPosition.y + 40;
    } else if (buttonY > screenHeight - menuHeight / 2 - 50) {
      menuY = buttonPosition.y - menuHeight + 20;
    }
    
    return { x: menuX, y: menuY };
  };
  
  const menuPosition = getMenuPosition();
  
  // Animations
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.3, { duration: 150 });
    scale.value = withSpring(1, { 
      damping: 20, 
      stiffness: 300,
      mass: 0.7,
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { 
      onPress: onQueryPress, 
      icon: <View style={styles.tanstackWrapper}><TanstackLogo /></View>, 
      label: 'React Query',
      accent: '#FF6B6B'
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={18} color="#10B981" />, 
      label: 'Environment',
      accent: '#10B981'
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={18} color="#EF4444" />, 
      label: 'Sentry',
      accent: '#EF4444'
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={18} color="#3B82F6" />, 
      label: 'Storage',
      accent: '#3B82F6'
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={18} color="#8B5CF6" /> : <WifiOffIcon size={18} color="#6B7280" />, 
      label: isWifiEnabled ? 'WiFi On' : 'WiFi Off',
      accent: isWifiEnabled ? '#8B5CF6' : '#6B7280',
      isToggle: true
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      <Animated.View style={[
        styles.menu,
        menuStyle,
        {
          right: menuPosition.x,
          bottom: menuPosition.y,
        }
      ]}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              index === 0 && styles.firstItem,
              index === menuItems.length - 1 && styles.lastItem,
            ]}
          >
            <View style={[
              styles.accentBar,
              { backgroundColor: item.accent }
            ]} />
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <Text style={styles.label}>{item.label}</Text>
            {item.isToggle && (
              <View style={[
                styles.toggleIndicator,
                { backgroundColor: item.accent }
              ]} />
            )}
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
  menu: {
    position: 'absolute',
    width: 240,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  firstItem: {
    marginTop: 0,
  },
  lastItem: {
    marginBottom: 0,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 2,
    borderRadius: 1,
    opacity: 0.8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  label: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    opacity: 0.8,
  },
  tanstackWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});