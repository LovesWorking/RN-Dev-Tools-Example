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
  withRepeat,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  ZapIcon,
  CheckCircleIcon,
} from '@/src/_shared/icons/lucide-icons';
// Removed expo-linear-gradient - not available

interface NeonDropdownProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function NeonDropdown({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: NeonDropdownProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const menuWidth = 210;
  const itemHeight = 50;
  const menuHeight = (itemHeight * 5) + 48;
  
  // Smart positioning
  const menuPosition = {
    x: Math.min(buttonPosition.x + 20, screenWidth - menuWidth - 20),
    y: Math.min(buttonPosition.y + 20, screenHeight - menuHeight - 20),
  };
  
  // Core animations
  const backdropOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.8);
  const neonPulse = useSharedValue(0);
  const electricFlow = useSharedValue(0);
  
  // Item animations
  const items = [
    {
      scale: useSharedValue(0),
      glow: useSharedValue(0),
      electric: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      glow: useSharedValue(0),
      electric: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      glow: useSharedValue(0),
      electric: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      glow: useSharedValue(0),
      electric: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      glow: useSharedValue(0),
      electric: useSharedValue(0),
    },
  ];

  const startNeonEffects = () => {
    // Main neon pulse
    neonPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Electric flow animation
    electricFlow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Individual item glow
    items.forEach((item, index) => {
      item.electric.value = withRepeat(
        withSequence(
          withDelay(
            index * 200,
            withTiming(1, { duration: 500 })
          ),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    });
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.85, { duration: 300 });
    menuScale.value = withSpring(1, {
      damping: 10,
      stiffness: 150,
      mass: 0.5,
    });
    
    // Staggered item appearance with electric effect
    items.forEach((item, index) => {
      const delay = index * 80;
      
      item.scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.2, { damping: 6, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );
      
      item.glow.value = withDelay(
        delay,
        withTiming(1, { duration: 400 })
      );
    });
    
    startNeonEffects();
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
    opacity: interpolate(menuScale.value, [0.8, 1], [0, 1]),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const neonBorderStyle = useAnimatedStyle(() => ({
    opacity: neonPulse.value,
  }));

  const electricStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(
        electricFlow.value,
        [0, 1],
        [-menuHeight, menuHeight]
      )},
    ],
  }));

  // Pre-create animated styles for all items
  const itemAnimatedStyles = items.map((item, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => ({
      transform: [{ scale: item.scale.value }],
      opacity: item.glow.value,
    }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const glowStyle = useAnimatedStyle(() => ({
      opacity: item.electric.value * 0.8,
    }));

    return { itemStyle, glowStyle };
  });

  const menuItems = [
    { 
      onPress: onQueryPress, 
      icon: <View style={styles.tanstackWrapper}><TanstackLogo /></View>, 
      label: 'React Query',
      neonColor: '#FF00FF',
      glowColor: 'rgba(255, 0, 255, 0.6)',
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={19} color="white" />, 
      label: 'Environment',
      neonColor: '#00FF00',
      glowColor: 'rgba(0, 255, 0, 0.6)',
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={19} color="white" />, 
      label: 'Sentry',
      neonColor: '#FF0000',
      glowColor: 'rgba(255, 0, 0, 0.6)',
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={19} color="white" />, 
      label: 'Storage',
      neonColor: '#00FFFF',
      glowColor: 'rgba(0, 255, 255, 0.6)',
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={19} color="white" /> : <WifiOffIcon size={19} color="white" />, 
      label: isWifiEnabled ? 'WiFi ON' : 'WiFi OFF',
      neonColor: isWifiEnabled ? '#FFFF00' : '#808080',
      glowColor: isWifiEnabled ? 'rgba(255, 255, 0, 0.6)' : 'rgba(128, 128, 128, 0.6)',
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
        {/* Neon border glow */}
        <Animated.View style={[styles.neonBorder, neonBorderStyle]} />
        
        {/* Electric flow effect */}
        <Animated.View style={[styles.electricFlow, electricStyle]} />
        
        <View style={styles.menuInner}>
          <View style={styles.header}>
            <ZapIcon size={14} color="#00FFFF" />
            <Text style={styles.headerText}>CYBERPUNK</Text>
            <CheckCircleIcon size={8} color="#FF00FF" />
          </View>
          
          {menuItems.map((item, index) => {
            const { itemStyle, glowStyle } = itemAnimatedStyles[index];
            return (
              <Animated.View key={index} style={[styles.itemWrapper, itemStyle]}>
                <Pressable
                  onPress={item.onPress}
                  onPressIn={() => {
                    items[index].scale.value = withSpring(0.95);
                    items[index].glow.value = withSpring(1.5);
                  }}
                  onPressOut={() => {
                    items[index].scale.value = withSpring(1);
                    items[index].glow.value = withSpring(1);
                  }}
                  style={styles.menuItem}
                >
                  {/* Neon glow background */}
                  <Animated.View style={[
                    styles.itemGlow,
                    glowStyle,
                    { backgroundColor: item.glowColor }
                  ]} />
                  
                  <View style={[
                    styles.itemBorder,
                    { borderColor: item.neonColor }
                  ]}>
                    <View style={styles.iconContainer}>
                      {item.icon}
                    </View>
                    <Text style={[
                      styles.label,
                      { textShadowColor: item.neonColor }
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
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
    width: 210,
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  neonBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    zIndex: -1,
    borderWidth: 2,
    borderColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  electricFlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 30,
    zIndex: 5,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  menuInner: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
    marginBottom: 8,
  },
  headerText: {
    color: '#00FFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  itemWrapper: {
    marginBottom: 6,
  },
  menuItem: {
    position: 'relative',
  },
  itemGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 8,
    opacity: 0.3,
  },
  itemBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    flex: 1,
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tanstackWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});