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
  ChevronRightIcon,
} from '@/src/_shared/icons/lucide-icons';

interface ListMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function ListMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: ListMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const menuWidth = 280;
  const menuHeight = 320;
  
  // Center the menu on screen
  const menuPosition = {
    x: (screenWidth - menuWidth) / 2,
    y: (screenHeight - menuHeight) / 2,
  };
  
  // Animations
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.6, { duration: 200 });
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
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
      color: '#FF6B6B'
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={22} color="#10B981" />, 
      label: 'Environment Variables',
      color: '#10B981'
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={22} color="#EF4444" />, 
      label: 'Sentry Errors',
      color: '#EF4444'
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={22} color="#3B82F6" />, 
      label: 'Storage Inspector',
      color: '#3B82F6'
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={22} color="#8B5CF6" /> : <WifiOffIcon size={22} color="#6B7280" />, 
      label: isWifiEnabled ? 'Disable Network' : 'Enable Network',
      color: isWifiEnabled ? '#8B5CF6' : '#6B7280'
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
          left: menuPosition.x,
          top: menuPosition.y,
        }
      ]}>
        <View style={styles.header}>
          <Text style={styles.title}>Developer Tools</Text>
          <Text style={styles.subtitle}>Select an option</Text>
        </View>
        
        <View style={styles.content}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.listItem,
                pressed && styles.listItemPressed,
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                {item.icon}
              </View>
              <Text style={styles.listItemLabel}>{item.label}</Text>
              <ChevronRightIcon size={16} color="rgba(255, 255, 255, 0.3)" />
            </Pressable>
          ))}
        </View>
        
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
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
  menu: {
    position: 'absolute',
    width: 280,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.2)',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  content: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  listItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  listItemLabel: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  tanstackWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(75, 85, 99, 0.2)',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});