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
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  CheckIcon,
} from '@/src/_shared/icons/lucide-icons';

interface CompactDropdownMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function CompactDropdownMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: CompactDropdownMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const menuWidth = 200;
  const menuHeight = 260;
  
  // Position menu to stay on screen
  const getMenuPosition = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    let menuX = buttonPosition.x + 30;
    let menuY = buttonPosition.y + 30;
    
    // Adjust horizontal position
    if (buttonX > screenWidth - menuWidth - 30) {
      menuX = buttonPosition.x + menuWidth - 30;
    }
    
    // Adjust vertical position
    if (buttonY < menuHeight + 30) {
      menuY = buttonPosition.y - menuHeight + 30;
    }
    
    return { x: menuX, y: menuY };
  };
  
  const menuPosition = getMenuPosition();
  
  // Animations
  const translateY = useSharedValue(-10);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.4, { duration: 150 });
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { 
      onPress: onQueryPress, 
      icon: <View style={styles.tanstackContainer}><TanstackLogo /></View>, 
      label: 'React Query',
      description: 'Data fetching & caching'
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={16} color="#10B981" />, 
      label: 'Environment',
      description: 'Variables & config'
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={16} color="#EF4444" />, 
      label: 'Sentry',
      description: 'Error tracking'
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={16} color="#3B82F6" />, 
      label: 'Storage',
      description: 'Local data'
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={16} color="#8B5CF6" /> : <WifiOffIcon size={16} color="#6B7280" />, 
      label: isWifiEnabled ? 'Disable WiFi' : 'Enable WiFi',
      description: 'Network control',
      showCheck: isWifiEnabled
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
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Dev Tools</Text>
        </View>
        
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
            >
              <View style={styles.menuItemIcon}>
                {item.icon}
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
              </View>
              {item.showCheck && (
                <View style={styles.checkIcon}>
                  <CheckIcon size={14} color="#10B981" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
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
    width: 200,
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  menuTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  menuContent: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  lastMenuItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 85, 99, 0.2)',
    marginTop: 4,
    paddingTop: 14,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  menuItemDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 2,
  },
  tanstackContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: 8,
  },
});