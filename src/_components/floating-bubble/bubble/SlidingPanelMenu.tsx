import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  ChevronLeftIcon,
} from '@/src/_shared/icons/lucide-icons';

interface SlidingPanelMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function SlidingPanelMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: SlidingPanelMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const panelWidth = 280;
  const panelHeight = Math.min(400, screenHeight * 0.5);
  
  // Slide in from right
  const translateX = useSharedValue(panelWidth);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.5, { duration: 200 });
    translateX.value = withSpring(0, { 
      damping: 20, 
      stiffness: 200,
      mass: 0.8,
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    { 
      onPress: onQueryPress, 
      icon: <View style={styles.tanstackWrapper}><TanstackLogo /></View>, 
      label: 'React Query',
      description: 'Inspect & modify queries',
      gradient: ['#FF6B6B', '#FF8787']
    },
    { 
      onPress: onEnvPress, 
      icon: <ServerIcon size={22} color="#10B981" />, 
      label: 'Environment',
      description: 'Configuration variables',
      gradient: ['#10B981', '#34D399']
    },
    { 
      onPress: onSentryPress, 
      icon: <BugIcon size={22} color="#EF4444" />, 
      label: 'Sentry Errors',
      description: 'Error tracking & logs',
      gradient: ['#EF4444', '#F87171']
    },
    { 
      onPress: onStoragePress, 
      icon: <DatabaseIcon size={22} color="#3B82F6" />, 
      label: 'Storage',
      description: 'Local data inspector',
      gradient: ['#3B82F6', '#60A5FA']
    },
    { 
      onPress: onWifiToggle, 
      icon: isWifiEnabled ? <WifiIcon size={22} color="#8B5CF6" /> : <WifiOffIcon size={22} color="#6B7280" />, 
      label: 'Network',
      description: isWifiEnabled ? 'Connected' : 'Disconnected',
      gradient: isWifiEnabled ? ['#8B5CF6', '#A78BFA'] : ['#6B7280', '#9CA3AF']
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>
      
      <Animated.View style={[
        styles.panel,
        panelStyle,
        {
          height: panelHeight,
          top: (screenHeight - panelHeight) / 2,
        }
      ]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Developer Tools</Text>
            <Text style={styles.subtitle}>Quick Access Panel</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <ChevronLeftIcon size={20} color="rgba(255, 255, 255, 0.5)" />
          </Pressable>
        </View>
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={[
                styles.cardGradient,
                { backgroundColor: item.gradient[0] }
              ]} />
              <View style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  {item.icon}
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
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
  panel: {
    position: 'absolute',
    right: 0,
    width: 280,
    backgroundColor: '#0A0A0A',
    borderLeftWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.15)',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.15)',
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  tanstackWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});