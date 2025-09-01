/**
 * Example usage of the StandaloneDiffViewer
 * Shows how to use the self-contained diff component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StandaloneDiffViewer from '@/rn-better-dev-tools/src/features/storage/components/DiffViewer/StandaloneDiffViewer';

// Example data
const oldData = {
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    settings: {
      theme: "dark",
      notifications: true,
      language: "en"
    }
  },
  metadata: {
    created: "2024-01-01",
    updated: "2024-01-15"
  }
};

const newData = {
  user: {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    age: 30,
    settings: {
      theme: "cyberpunk",
      notifications: false,
      language: "en-US",
      privacy: "public"
    }
  },
  metadata: {
    created: "2024-01-01",
    updated: "2024-02-01",
    version: 2
  }
};

export default function StandaloneDiffExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Standalone Diff Viewer Example</Text>
      
      {/* Git Classic Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Git Classic Theme</Text>
        <StandaloneDiffViewer
          oldValue={oldData}
          newValue={newData}
          theme="git"
          height={350}
          showOptions={true}
        />
      </View>

      {/* Dev Tools Default Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dev Tools Dark Theme</Text>
        <StandaloneDiffViewer
          oldValue={oldData}
          newValue={newData}
          theme="default"
          height={350}
          showOptions={true}
        />
      </View>

      {/* Minimal Example without Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minimal (No Options Panel)</Text>
        <StandaloneDiffViewer
          oldValue={{ simple: "old value", test: 123 }}
          newValue={{ simple: "new value", test: 456, added: true }}
          theme="default"
          height={200}
          showOptions={false}
        />
      </View>

      {/* Custom Initial Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Options (Diff Only Mode)</Text>
        <StandaloneDiffViewer
          oldValue={oldData}
          newValue={newData}
          theme="default"
          height={300}
          options={{
            showDiffOnly: true,
            contextLines: 1,
            compareMethod: 'words',
            disableWordDiff: false,
            hideLineNumbers: false,
            lineOffset: 0,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
});