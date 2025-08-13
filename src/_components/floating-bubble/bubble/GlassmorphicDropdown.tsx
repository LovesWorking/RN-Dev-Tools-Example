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
  withDelay,
  interpolate,
  Extrapolate,
  withSequence,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  ChevronRightIcon,
  ActivityIcon,
} from '@/src/_shared/icons/lucide-icons';
// Removed expo-blur and expo-linear-gradient - not available

interface GlassmorphicDropdownProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function GlassmorphicDropdown({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: GlassmorphicDropdownProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const menuWidth = 220;
  const itemHeight = 52;
  const menuHeight = (itemHeight * 5) + 60; // Items + header
  
  // Smart positioning
  const getMenuPosition = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;
    
    let menuX = buttonPosition.x + 30;
    let menuY = buttonPosition.y + 30;
    
    if (buttonX > screenWidth - menuWidth - 30) {
      menuX = buttonPosition.x + menuWidth - 30;
    }
    
    if (buttonY < menuHeight + 30) {
      menuY = buttonPosition.y - menuHeight + 30;
    }
    
    return { x: menuX, y: menuY };
  };
  
  const menuPosition = getMenuPosition();
  
  // Animations
  const backdropOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.9);
  const menuOpacity = useSharedValue(0);
  const shimmerPosition = useSharedValue(0);
  
  // Individual item animations
  const itemAnimations = [
    {
      translateX: useSharedValue(-20),
      opacity: useSharedValue(0),
      blur: useSharedValue(10),
    },
    {
      translateX: useSharedValue(-20),
      opacity: useSharedValue(0),
      blur: useSharedValue(10),
    },
    {
      translateX: useSharedValue(-20),
      opacity: useSharedValue(0),
      blur: useSharedValue(10),
    },
    {
      translateX: useSharedValue(-20),
      opacity: useSharedValue(0),
      blur: useSharedValue(10),
    },
    {
      translateX: useSharedValue(-20),
      opacity: useSharedValue(0),
      blur: useSharedValue(10),
    },
  ];

  const startShimmer = () => {
    shimmerPosition.value = withSequence(
      withTiming(-1, { duration: 0 }),
      withDelay(
        500,
        withTiming(1, { duration: 1500 })
      )
    );
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.6, { duration: 200 });
    menuScale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
      mass: 0.8,
    });
    menuOpacity.value = withTiming(1, { duration: 250 });
    
    // Cascade animation for items
    itemAnimations.forEach((anim, index) => {
      const delay = index * 60;
      
      anim.translateX.value = withDelay(
        delay,
        withSpring(0, {
          damping: 18,
          stiffness: 250,
        })
      );
      
      anim.opacity.value = withDelay(
        delay,
        withTiming(1, { duration: 200 })
      );
      
      anim.blur.value = withDelay(
        delay,
        withTiming(0, { duration: 300 })
      );
    });
    
    startShimmer();
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
    opacity: menuOpacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(
        shimmerPosition.value,
        [-1, 1],
        [-menuWidth, menuWidth],
        Extrapolate.CLAMP
      )},
    ],
  }));

  // Pre-create animated styles for all items
  const itemAnimatedStyles = itemAnimations.map((anim) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: anim.translateX.value }],
      opacity: anim.opacity.value,
    }));
    return itemStyle;
  });

  const menuItems = [
    { 
      onPress: onQueryPress, 
      icon: <View style={styles.tanstackContainer}><TanstackLogo /></View>, 
      label: 'React Query',
      sublabel: 'Data sync',
      accent: '#FF6B6B',
      live: true,
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={18} color="#10B981" />, 
      label: 'Environment',
      sublabel: 'Config',
      accent: '#10B981',
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={18} color="#EF4444" />, 
      label: 'Sentry',
      sublabel: 'Errors',
      accent: '#EF4444',
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={18} color="#3B82F6" />, 
      label: 'Storage',
      sublabel: 'Local DB',
      accent: '#3B82F6',
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={18} color="#8B5CF6" /> : <WifiOffIcon size={18} color="#6B7280" />, 
      label: 'Network',
      sublabel: isWifiEnabled ? 'Online' : 'Offline',
      accent: isWifiEnabled ? '#8B5CF6' : '#6B7280',
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
        <View style={styles.blurContainer}>
          <View style={styles.gradientOverlay} />
          
          {/* Shimmer effect */}
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <View style={styles.shimmerGradient} />
          </Animated.View>
          
          <View style={styles.header}>
            <View style={styles.headerDot} />
            <Text style={styles.headerTitle}>DEVELOPER</Text>
            <View style={styles.headerLine} />
          </View>
          
          <View style={styles.content}>
            {menuItems.map((item, index) => {
              const itemStyle = itemAnimatedStyles[index];
              return (
                <Animated.View key={index} style={itemStyle}>
                  <Pressable
                    onPress={item.onPress}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemPressed,
                    ]}
                  >
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: `${item.accent}15` }
                    ]}>
                      {item.icon}
                    </View>
                    
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>{item.label}</Text>
                      <Text style={[styles.sublabel, { color: item.accent }]}>
                        {item.sublabel}
                      </Text>
                    </View>
                    
                    {item.live && (
                      <View style={styles.liveIndicator}>
                        <ActivityIcon size={12} color={item.accent} />
                      </View>
                    )}
                    
                    <ChevronRightIcon size={14} color="rgba(255, 255, 255, 0.2)" />
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
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
    width: 220,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(10px)',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 8,
  },
  content: {
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  sublabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  liveIndicator: {
    marginRight: 8,
  },
  tanstackContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});