import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { VirtualizedDataExplorerBenchmark } from '../src/_sections/react-query/components/shared/VirtualizedDataExplorerBenchmark';

export default function PerformanceTestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <VirtualizedDataExplorerBenchmark />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});