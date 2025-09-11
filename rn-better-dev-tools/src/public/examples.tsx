/**
 * Example usage of the new RN Better Dev Tools API
 * 
 * This file demonstrates how to use the improved Start Menu
 * with various types of launcher items.
 */

import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  DevToolsProvider,
  StartMenu,
  useDevTools,
  useDevMenuIntegration,
  createModalLauncher,
  createScreenLauncher,
  createURLLauncher,
  createCommandLauncher,
} from './index';

// Example modal component
const AdminToolsModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Admin Tools</Text>
        <Text>Advanced debugging options here...</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
};

// Example settings modal
const SettingsModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Settings</Text>
        <Text>Configure your app settings...</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
};

// Component that registers dev tools
const DevToolsBootstrap: React.FC = () => {
  const { register } = useDevTools();

  useEffect(() => {
    // Register a modal launcher
    register(
      createModalLauncher('admin', 'Admin Tools', AdminToolsModal, {
        icon: <Text>🔧</Text>,
        slot: 'both',
        description: 'Advanced admin debugging tools',
      })
    );

    // Register a screen navigation launcher
    register(
      createScreenLauncher(
        'users',
        'Users Screen',
        () => {
          console.log('Navigate to Users screen');
          // navigation.navigate('Users');
        },
        {
          icon: <Text>👥</Text>,
          slot: 'dial',
        }
      )
    );

    // Register a URL launcher
    register(
      createURLLauncher('docs', 'Documentation', 'https://reactnative.dev', {
        icon: <Text>📚</Text>,
        slot: 'row',
      })
    );

    // Register a command launcher
    register(
      createCommandLauncher(
        'clear-cache',
        'Clear Cache',
        async () => {
          console.log('Clearing cache...');
          // await AsyncStorage.clear();
          console.log('Cache cleared!');
        },
        {
          icon: <Text>🗑️</Text>,
          slot: 'both',
        }
      )
    );

    // Register another modal
    register(
      createModalLauncher('settings', 'Settings', SettingsModal, {
        icon: <Text>⚙️</Text>,
        slot: 'dial',
      })
    );

    // Example of registering with raw LauncherItem format
    register({
      id: 'network',
      label: 'Network Inspector',
      icon: <Text>🌐</Text>,
      slot: 'both',
      target: {
        kind: 'modal',
        component: () => (
          <View style={styles.modalContainer}>
            <Text>Network Inspector Modal</Text>
          </View>
        ),
      },
    });

    // Example of a custom command with async operation
    register({
      id: 'fetch-data',
      label: 'Fetch Test Data',
      icon: <Text>📡</Text>,
      target: {
        kind: 'command',
        run: async () => {
          console.log('Fetching test data...');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log('Test data fetched!');
        },
      },
    });
  }, [register]);

  return null;
};

// Component that sets up Dev Menu integration
const DevMenuSetup: React.FC = () => {
  const { openDevTools } = useDevTools();
  
  // Add Dev Menu integration for quick access
  useDevMenuIntegration({
    onOpen: openDevTools,
    title: 'Open Dev Tools 🛠️',
  });
  
  return null;
};

// Main app component with DevTools integrated
export const ExampleApp: React.FC = () => {
  return (
    <DevToolsProvider
      initial={[
        // You can also provide initial items directly
        createCommandLauncher('log', 'Console Log', () => console.log('Hello!'), {
          icon: <Text>📝</Text>,
        }),
      ]}
    >
      <View style={styles.container}>
        <DevToolsBootstrap />
        <DevMenuSetup />
        <StartMenu
          layout="auto"
        />
        <View style={styles.appContent}>
          <Text style={styles.title}>Your App Content Here</Text>
          <Text>The Start Menu is floating above your app!</Text>
          <Text style={styles.hint}>
            Shake device or press Cmd+D (iOS) / Cmd+M (Android) to open React Native Dev Menu,
            then select "Open Dev Tools 🛠️"
          </Text>
        </View>
      </View>
    </DevToolsProvider>
  );
};

// Example with manual control
export const ManualControlExample: React.FC = () => {
  const manualItems = [
    createModalLauncher('modal1', 'Modal 1', AdminToolsModal),
    createModalLauncher('modal2', 'Modal 2', SettingsModal),
    createCommandLauncher('cmd1', 'Command 1', () => console.log('Command 1')),
    createCommandLauncher('cmd2', 'Command 2', () => console.log('Command 2')),
    createCommandLauncher('cmd3', 'Command 3', () => console.log('Command 3')),
    createCommandLauncher('cmd4', 'Command 4', () => console.log('Command 4')),
    createCommandLauncher('cmd5', 'Command 5', () => console.log('Command 5')),
    // With 7 items, auto-layout will switch to grid instead of dial
  ];

  return (
    <DevToolsProvider>
      <View style={styles.container}>
        <StartMenu
          items={manualItems}
          layout="auto"
        />
        <Text>Manual items provided directly to StartMenu</Text>
      </View>
    </DevToolsProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});