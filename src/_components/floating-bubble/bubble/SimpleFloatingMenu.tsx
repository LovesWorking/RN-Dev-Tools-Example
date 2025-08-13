import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { TanstackLogo } from '@/src/_sections/react-query/components/query-browser/svgs';
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from '@/src/_shared/icons/lucide-icons';

interface SimpleFloatingMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
}

export function SimpleFloatingMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
}: SimpleFloatingMenuProps) {
  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* WiFi Toggle */}
        <Pressable onPress={onWifiToggle} style={styles.menuItem}>
          <View style={styles.iconContainer}>
            {isWifiEnabled ? (
              <WifiIcon size={18} color="white" />
            ) : (
              <WifiOffIcon size={18} color="white" />
            )}
          </View>
          <Text style={styles.text}>{isWifiEnabled ? 'WiFi On' : 'WiFi Off'}</Text>
        </Pressable>

        {/* Storage */}
        <Pressable onPress={onStoragePress} style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <DatabaseIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Storage</Text>
        </Pressable>

        {/* Sentry */}
        <Pressable onPress={onSentryPress} style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <BugIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Sentry</Text>
        </Pressable>

        {/* Environment */}
        <Pressable onPress={onEnvPress} style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <ServerIcon size={18} color="white" />
          </View>
          <Text style={styles.text}>Environment</Text>
        </Pressable>

        {/* React Query */}
        <Pressable onPress={onQueryPress} style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <View style={styles.tanstackContainer}>
              <TanstackLogo />
            </View>
          </View>
          <Text style={styles.text}>React Query</Text>
        </Pressable>

        {/* Close Button */}
        <Pressable onPress={onClose} style={[styles.menuItem, styles.closeButton]}>
          <View style={styles.iconContainer}>
            <XIcon size={20} color="white" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    gap: 10,
  },
  menuItem: {
    backgroundColor: '#171717',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tanstackContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});