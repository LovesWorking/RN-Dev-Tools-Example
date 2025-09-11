import { useEffect } from 'react';
import { DevSettings, Platform } from 'react-native';

interface DevMenuIntegrationProps {
  onOpen: () => void;
  title?: string;
  enabled?: boolean;
}

/**
 * Hook to add a Dev Menu item that opens the dev tools
 * This only works in development builds
 */
export const useDevMenuIntegration = ({
  onOpen,
  title = 'Open Dev Tools',
  enabled = true,
}: DevMenuIntegrationProps) => {
  useEffect(() => {
    if (!__DEV__ || !enabled || Platform.OS === 'web') {
      return;
    }

    // Add menu item to React Native Dev Menu
    DevSettings.addMenuItem(title, onOpen);

    // Cleanup is not possible with DevSettings API
    // Menu items persist until app reload
  }, [title, onOpen, enabled]);
};

/**
 * Component version of the Dev Menu integration
 */
export const DevMenuIntegration: React.FC<DevMenuIntegrationProps> = (props) => {
  useDevMenuIntegration(props);
  return null;
};

/**
 * Helper to manually add dev tools to the menu
 * Can be called directly in app initialization
 */
export const addDevToolsToMenu = (onOpen: () => void, title = 'Open Dev Tools') => {
  if (__DEV__ && Platform.OS !== 'web') {
    DevSettings.addMenuItem(title, onOpen);
  }
};