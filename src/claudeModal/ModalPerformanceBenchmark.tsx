/**
 * Performance Benchmark Component using proper frame tracking
 * Measures actual FPS during modal interactions
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import ClaudeModalPure from './ClaudeModalPure';

interface FrameData {
  timestamp: number;
  fps: number;
}

interface BenchmarkResult {
  modalType: 'pure' | 'original';
  frameData: FrameData[];
  avgFps: number;
  minFps: number;
  maxFps: number;
  droppedFrames: number;
  totalFrames: number;
  duration: number;
  timestamp: number;
}

export const ModalPerformanceBenchmark: React.FC = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isTestingPure, setIsTestingPure] = useState(false);
  const [currentFps, setCurrentFps] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  
  // Refs for performance tracking
  const frameDataRef = useRef<FrameData[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const testDurationRef = useRef<number>(5000); // 5 seconds per test
  
  // Test animation values for stress testing
  const testAnimX = useRef(new Animated.Value(0)).current;
  const testAnimY = useRef(new Animated.Value(0)).current;
  const testAnimScale = useRef(new Animated.Value(1)).current;
  const testAnimRotate = useRef(new Animated.Value(0)).current;

  // Create intensive animation to stress test
  const runStressAnimation = useCallback(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(testAnimX, {
            toValue: 200,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(testAnimX, {
            toValue: -200,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(testAnimY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(testAnimY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(testAnimScale, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(testAnimScale, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(testAnimRotate, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [testAnimX, testAnimY, testAnimScale, testAnimRotate]);

  // Core FPS measurement function
  const measureFrame = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      lastFrameTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;
    const elapsed = timestamp - startTimeRef.current;
    
    // Calculate FPS from frame delta
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      frameDataRef.current.push({
        timestamp: elapsed,
        fps: Math.min(fps, 60), // Cap at 60 FPS
      });
      
      // Update display every 10 frames
      frameCountRef.current++;
      if (frameCountRef.current % 10 === 0) {
        setCurrentFps(Math.round(fps));
      }
    }
    
    lastFrameTimeRef.current = timestamp;
    
    // Update progress
    const progress = Math.min((elapsed / testDurationRef.current) * 100, 100);
    setTestProgress(progress);
    
    // Continue or stop
    if (elapsed < testDurationRef.current) {
      animationIdRef.current = requestAnimationFrame(measureFrame);
    } else {
      stopBenchmark('pure');
    }
  }, []);

  // Start benchmark
  const startBenchmark = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Starting ${modalType} benchmark`);
    
    // Reset state
    frameDataRef.current = [];
    frameCountRef.current = 0;
    startTimeRef.current = 0;
    lastFrameTimeRef.current = 0;
    setCurrentFps(0);
    setTestProgress(0);
    
    if (modalType === 'pure') {
      setIsTestingPure(true);
      runStressAnimation();
    }
    
    // Start frame measurement
    animationIdRef.current = requestAnimationFrame(measureFrame);
  }, [measureFrame, runStressAnimation]);

  // Stop benchmark
  const stopBenchmark = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Stopping ${modalType} benchmark`);
    
    // Cancel animation frame
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Stop animations
    testAnimX.stopAnimation();
    testAnimY.stopAnimation();
    testAnimScale.stopAnimation();
    testAnimRotate.stopAnimation();
    
    // Reset animation values
    testAnimX.setValue(0);
    testAnimY.setValue(0);
    testAnimScale.setValue(1);
    testAnimRotate.setValue(0);
    
    // Calculate statistics
    const frames = frameDataRef.current;
    if (frames.length > 0) {
      const fpsValues = frames.map(f => f.fps);
      const avgFps = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
      const minFps = Math.min(...fpsValues);
      const maxFps = Math.max(...fpsValues);
      const droppedFrames = fpsValues.filter(fps => fps < 55).length;
      
      const result: BenchmarkResult = {
        modalType,
        frameData: frames,
        avgFps,
        minFps,
        maxFps,
        droppedFrames,
        totalFrames: frames.length,
        duration: frames[frames.length - 1]?.timestamp || 0,
        timestamp: Date.now(),
      };
      
      setResults(prev => [...prev, result]);
      console.log('Benchmark result:', result);
    }
    
    // Hide modal
    setIsTestingPure(false);
    setCurrentFps(0);
    setTestProgress(0);
  }, [testAnimX, testAnimY, testAnimScale, testAnimRotate]);

  // Interactive gesture test
  const createGestureTest = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: () => {
        // Track gesture performance
        if (!startTimeRef.current) {
          startBenchmark('pure');
        }
      },
      onPanResponderRelease: () => {
        // Can use this to stop test
      },
    });
  };

  const gestureResponder = useRef(createGestureTest()).current;

  // Format results for display
  const formatResult = (result: BenchmarkResult) => ({
    'Average FPS': result.avgFps.toFixed(1),
    'Min FPS': result.minFps.toFixed(1),
    'Max FPS': result.maxFps.toFixed(1),
    'Dropped Frames': `${result.droppedFrames} / ${result.totalFrames}`,
    'Drop Rate': `${((result.droppedFrames / result.totalFrames) * 100).toFixed(1)}%`,
    'Duration': `${(result.duration / 1000).toFixed(1)}s`,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Performance Benchmark</Text>
        
        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Controls</Text>
          <Text style={styles.instructions}>
            Run a 5-second stress test with animations to measure FPS
          </Text>
          
          <Pressable
            style={[styles.button, animationIdRef.current ? styles.buttonDisabled : null]}
            onPress={() => startBenchmark('pure')}
            disabled={!!animationIdRef.current}
          >
            <Text style={styles.buttonText}>
              {animationIdRef.current ? 'Testing...' : 'Run Benchmark'}
            </Text>
          </Pressable>

          {/* Live stats */}
          {animationIdRef.current && (
            <View style={styles.liveStats}>
              <Text style={styles.liveStatText}>Current FPS: {currentFps}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${testProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{testProgress.toFixed(0)}%</Text>
            </View>
          )}
        </View>

        {/* Interactive Test Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Test</Text>
          <View 
            style={styles.testArea}
            {...gestureResponder.panHandlers}
          >
            <Text style={styles.testAreaText}>
              Drag here to start gesture benchmark
            </Text>
            {animationIdRef.current && (
              <Animated.View
                style={[
                  styles.testBox,
                  {
                    transform: [
                      { translateX: testAnimX },
                      { translateY: testAnimY },
                      { scale: testAnimScale },
                      { rotate: testAnimRotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      })},
                    ],
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Results</Text>
              <Pressable 
                style={styles.clearButton}
                onPress={() => setResults([])}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
            
            {results.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.resultTitle}>
                  Test #{index + 1} - {result.modalType}
                </Text>
                {Object.entries(formatResult(result)).map(([key, value]) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{key}:</Text>
                    <Text style={styles.resultValue}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Test Modal */}
      <ClaudeModalPure
        visible={isTestingPure}
        onClose={() => stopBenchmark('pure')}
        header={{
          title: 'Performance Test',
          subtitle: `FPS: ${currentFps}`,
        }}
        persistenceKey="benchmark-modal"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Benchmark Running...</Text>
          <Text style={styles.modalText}>Current FPS: {currentFps}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${testProgress}%` }
              ]} 
            />
          </View>
          
          {/* Animated stress test elements */}
          <View style={styles.animationContainer}>
            <Animated.View
              style={[
                styles.animatedBox,
                {
                  transform: [
                    { translateX: testAnimX },
                    { translateY: testAnimY },
                    { scale: testAnimScale },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </ClaudeModalPure>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
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
    color: '#9CA3AF',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0EA5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
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
  },
  liveStats: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  liveStatText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
  testArea: {
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  testAreaText: {
    color: '#6B7280',
    fontSize: 14,
  },
  testBox: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
  },
  resultCard: {
    padding: 12,
    marginTop: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultLabel: {
    color: '#9CA3AF',
  },
  resultValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalContent: {
    padding: 20,
    minHeight: 300,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  animationContainer: {
    height: 200,
    marginTop: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBox: {
    width: 60,
    height: 60,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
});

export default ModalPerformanceBenchmark;