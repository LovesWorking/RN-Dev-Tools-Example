/**
 * Modal Performance Testing Component
 * Compares performance between ClaudeModalPure (pure JS) and original modal implementation
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import ClaudeModalPure from './ClaudeModalPure';
// Import original modal if available
// import OriginalModal from '../_components/floating-bubble/modal/BaseFloatingModal';

interface PerformanceMetrics {
  fps: number[];
  jsThreadLoad: number[];
  renderCount: number;
  gestureStartTime: number;
  gestureEndTime: number;
  gestureDuration: number;
  memoryUsage?: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  avgJsLoad: number;
  droppedFrames: number;
}

interface TestResult {
  modalType: 'pure' | 'original';
  metrics: PerformanceMetrics;
  timestamp: number;
}

export const ModalPerformanceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<'none' | 'pure' | 'original'>('none');
  const [showPureModal, setShowPureModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Performance tracking refs
  const metricsRef = useRef<PerformanceMetrics>({
    fps: [],
    jsThreadLoad: [],
    renderCount: 0,
    gestureStartTime: 0,
    gestureEndTime: 0,
    gestureDuration: 0,
    avgFps: 0,
    minFps: 60,
    maxFps: 0,
    avgJsLoad: 0,
    droppedFrames: 0,
  });
  
  const animationFrameId = useRef<number | null>(null);
  const renderCountRef = useRef(0);
  const stopPerformanceTestRef = useRef<((modalType: 'pure' | 'original') => void) | null>(null);

  // FPS Monitor
  const startFpsMonitoring = useCallback(() => {
    let frameCount = 0;
    let startTime = performance.now();
    const fpsHistory: number[] = [];
    
    const measureFps = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      
      // Calculate FPS every 100ms
      if (elapsed >= 100) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        fpsHistory.push(fps);
        metricsRef.current.fps.push(fps);
        
        // Check for dropped frames (< 55 fps)
        if (fps < 55) {
          metricsRef.current.droppedFrames++;
        }
        
        // Reset for next measurement
        frameCount = 0;
        startTime = currentTime;
      }
      
      if (isRecording) {
        animationFrameId.current = requestAnimationFrame(measureFps);
      }
    };
    
    animationFrameId.current = requestAnimationFrame(measureFps);
  }, [isRecording]);

  // JS Thread Load Monitor (simulated)
  const measureJsThreadLoad = useCallback(() => {
    const start = performance.now();
    
    // Perform a small computation to measure JS thread responsiveness
    let sum = 0;
    for (let i = 0; i < 1000; i++) {
      sum += Math.sqrt(i);
    }
    // Using sum to avoid unused variable warning
    void sum;
    
    const duration = performance.now() - start;
    // Normalize to percentage (assuming 1ms for 1000 operations is 100% load)
    const load = Math.min(100, duration * 100);
    metricsRef.current.jsThreadLoad.push(load);
    
    return load;
  }, []);

  // Start performance test
  const startPerformanceTest = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Starting performance test for ${modalType} modal`);
    
    // Reset metrics
    metricsRef.current = {
      fps: [],
      jsThreadLoad: [],
      renderCount: 0,
      gestureStartTime: performance.now(),
      gestureEndTime: 0,
      gestureDuration: 0,
      avgFps: 0,
      minFps: 60,
      maxFps: 0,
      avgJsLoad: 0,
      droppedFrames: 0,
    };
    
    renderCountRef.current = 0;
    setIsRecording(true);
    setCurrentTest(modalType);
    
    // Start monitoring
    startFpsMonitoring();
    
    // Monitor JS thread every 50ms
    const jsMonitorInterval = setInterval(() => {
      if (isRecording) {
        measureJsThreadLoad();
      }
    }, 50);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
      clearInterval(jsMonitorInterval);
      if (stopPerformanceTestRef.current) {
        stopPerformanceTestRef.current(modalType);
      }
    }, 10000);
    
    // Show the appropriate modal
    if (modalType === 'pure') {
      setShowPureModal(true);
    }
    
    return () => {
      clearInterval(jsMonitorInterval);
    };
  }, [isRecording, startFpsMonitoring, measureJsThreadLoad]);

  // Stop performance test
  const stopPerformanceTest = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Stopping performance test for ${modalType} modal`);
    
    setIsRecording(false);
    metricsRef.current.gestureEndTime = performance.now();
    metricsRef.current.gestureDuration = 
      metricsRef.current.gestureEndTime - metricsRef.current.gestureStartTime;
    
    // Cancel animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    // Calculate averages
    const fps = metricsRef.current.fps;
    const jsLoad = metricsRef.current.jsThreadLoad;
    
    if (fps.length > 0) {
      metricsRef.current.avgFps = 
        fps.reduce((a, b) => a + b, 0) / fps.length;
      metricsRef.current.minFps = Math.min(...fps);
      metricsRef.current.maxFps = Math.max(...fps);
    }
    
    if (jsLoad.length > 0) {
      metricsRef.current.avgJsLoad = 
        jsLoad.reduce((a, b) => a + b, 0) / jsLoad.length;
    }
    
    metricsRef.current.renderCount = renderCountRef.current;
    
    // Store results
    const result: TestResult = {
      modalType,
      metrics: { ...metricsRef.current },
      timestamp: Date.now(),
    };
    
    setTestResults(prev => [...prev, result]);
    setCurrentTest('none');
    
    // Hide modals
    setShowPureModal(false);
    
    console.log('Test results:', result);
  }, []);

  // Set ref for stopPerformanceTest
  useEffect(() => {
    stopPerformanceTestRef.current = stopPerformanceTest;
  }, [stopPerformanceTest]);

  // Track renders
  useEffect(() => {
    if (isRecording) {
      renderCountRef.current++;
    }
  });

  // Clear results
  const clearResults = () => {
    setTestResults([]);
  };

  // Format metrics for display
  const formatMetrics = (metrics: PerformanceMetrics) => {
    return {
      'Avg FPS': metrics.avgFps.toFixed(1),
      'Min FPS': metrics.minFps.toFixed(1),
      'Max FPS': metrics.maxFps.toFixed(1),
      'Dropped Frames': metrics.droppedFrames,
      'Avg JS Load': `${metrics.avgJsLoad.toFixed(1)}%`,
      'Render Count': metrics.renderCount,
      'Test Duration': `${(metrics.gestureDuration / 1000).toFixed(1)}s`,
    };
  };

  // Compare results
  const compareResults = () => {
    const pureResults = testResults.filter(r => r.modalType === 'pure');
    const originalResults = testResults.filter(r => r.modalType === 'original');
    
    if (pureResults.length === 0 || originalResults.length === 0) {
      return null;
    }
    
    const latestPure = pureResults[pureResults.length - 1];
    const latestOriginal = originalResults[originalResults.length - 1];
    
    const fpsDiff = latestPure.metrics.avgFps - latestOriginal.metrics.avgFps;
    const jsLoadDiff = latestOriginal.metrics.avgJsLoad - latestPure.metrics.avgJsLoad;
    const droppedFramesDiff = latestOriginal.metrics.droppedFrames - latestPure.metrics.droppedFrames;
    
    return {
      winner: fpsDiff > 0 ? 'Pure JS' : 'Original',
      fpsDiff: Math.abs(fpsDiff).toFixed(1),
      jsLoadDiff: Math.abs(jsLoadDiff).toFixed(1),
      droppedFramesDiff: Math.abs(droppedFramesDiff),
      summary: fpsDiff > 0 
        ? `Pure JS modal is ${fpsDiff.toFixed(1)} FPS faster with ${jsLoadDiff.toFixed(1)}% less JS load`
        : `Original modal is ${Math.abs(fpsDiff).toFixed(1)} FPS faster`,
    };
  };

  const comparison = compareResults();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Modal Performance Test</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Controls</Text>
          <Text style={styles.instructions}>
            Open a modal and interact with it (drag, resize) for 10 seconds to measure performance.
          </Text>
          
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, isRecording && styles.buttonDisabled]}
              onPress={() => startPerformanceTest('pure')}
              disabled={isRecording}
            >
              <Text style={styles.buttonText}>Test Pure JS Modal</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.buttonSecondary, isRecording && styles.buttonDisabled]}
              onPress={() => startPerformanceTest('original')}
              disabled={isRecording}
            >
              <Text style={styles.buttonText}>Test Original Modal</Text>
            </Pressable>
          </View>
          
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                Recording {currentTest} modal performance...
              </Text>
            </View>
          )}
        </View>

        {testResults.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Test Results</Text>
              <Pressable style={styles.clearButton} onPress={clearResults}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
            
            {testResults.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                  {result.modalType === 'pure' ? 'Pure JS Modal' : 'Original Modal'}
                </Text>
                {Object.entries(formatMetrics(result.metrics)).map(([key, value]) => (
                  <View key={key} style={styles.metricRow}>
                    <Text style={styles.metricLabel}>{key}:</Text>
                    <Text style={styles.metricValue}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {comparison && (
          <View style={[styles.section, styles.comparisonSection]}>
            <Text style={styles.sectionTitle}>Comparison</Text>
            <View style={styles.winnerCard}>
              <Text style={styles.winnerText}>🏆 {comparison.winner} Wins!</Text>
              <Text style={styles.summaryText}>{comparison.summary}</Text>
              <View style={styles.comparisonStats}>
                <Text style={styles.statText}>FPS Difference: {comparison.fpsDiff}</Text>
                <Text style={styles.statText}>JS Load Difference: {comparison.jsLoadDiff}%</Text>
                <Text style={styles.statText}>Dropped Frames Difference: {comparison.droppedFramesDiff}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Test Modals */}
      <ClaudeModalPure
        visible={showPureModal}
        onClose={() => {
          setShowPureModal(false);
          if (isRecording) {
            stopPerformanceTest('pure');
          }
        }}
        header={{
          title: 'Pure JS Modal (Performance Test)',
          subtitle: 'Drag and resize to test performance',
        }}
        persistenceKey="performance-test-pure"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            This is the Pure JS implementation using PanResponder and Animated API.
          </Text>
          <Text style={styles.modalText}>
            Drag the modal around and resize from corners to test performance.
          </Text>
          {isRecording && (
            <View style={styles.modalMetrics}>
              <Text style={styles.modalMetricText}>
                FPS: {metricsRef.current.fps[metricsRef.current.fps.length - 1] || 0}
              </Text>
              <Text style={styles.modalMetricText}>
                Samples: {metricsRef.current.fps.length}
              </Text>
            </View>
          )}
        </View>
      </ClaudeModalPure>

      {/* Original modal would go here if available */}
      {/* <OriginalModal ... /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#8B5CF6',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  resultCard: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  comparisonSection: {
    backgroundColor: '#1F2937',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  winnerCard: {
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  comparisonStats: {
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  modalMetrics: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  modalMetricText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default ModalPerformanceTest;