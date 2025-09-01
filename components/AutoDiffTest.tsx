import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MultiModeDiffViewer } from '../rn-better-dev-tools/src/features/storage/components/DiffViewer/MultiModeDiffViewer';

export function AutoDiffTest() {
  const [oldData, setOldData] = useState<any>(null);
  const [newData, setNewData] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Automatically create test data on mount
    const setupTestData = async () => {
      // Initial data
      const initialData = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'light',
            notifications: true,
            language: 'en'
          }
        },
        settings: {
          version: '1.0.0',
          features: ['feature1', 'feature2'],
          config: {
            apiUrl: 'https://api.example.com',
            timeout: 5000
          }
        }
      };

      // Modified data
      const modifiedData = {
        user: {
          id: 1,
          name: 'Jane Smith', // CHANGED
          email: 'jane@example.com', // CHANGED
          preferences: {
            theme: 'dark', // CHANGED
            notifications: false, // CHANGED
            language: 'en',
            newField: 'added' // ADDED
          },
          avatar: 'https://example.com/avatar.jpg' // ADDED
        },
        settings: {
          version: '2.0.0', // CHANGED
          features: ['feature1', 'feature3', 'feature4'], // CHANGED
          config: {
            apiUrl: 'https://api-v2.example.com', // CHANGED
            timeout: 10000, // CHANGED
            retry: 3 // ADDED
          }
        },
        // metadata removed
      };

      setOldData(initialData);
      setNewData(modifiedData);
      setIsReady(true);

      // Also save to AsyncStorage for the main app
      await AsyncStorage.setItem('test_diff_data', JSON.stringify(modifiedData));
    };

    setupTestData();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Setting up test data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diff Viewer Test - All Modes</Text>
        <Text style={styles.subtitle}>Testing with complex nested object changes</Text>
      </View>
      
      <View style={styles.content}>
        <MultiModeDiffViewer 
          oldValue={oldData}
          newValue={newData}
          debugMode={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  loading: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});