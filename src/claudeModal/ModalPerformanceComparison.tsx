/**
 * Performance Comparison between Pure JS Modal and Original Modal
 * Tests both implementations with the same benchmark
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import ClaudeModalPure from './ClaudeModalPure';
import ClaudeModalOptimized from './ClaudeModalOptimized';
import { BaseFloatingModal } from '../_components/floating-bubble/modal/components/BaseFloatingModal';
import { JSFPSMonitor, JSFPSResult } from './utils/JSFPSMonitor';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BenchmarkResult {
  modalType: 'pure' | 'optimized' | 'original';
  fpsData: JSFPSResult;
  duration: number;
  timestamp: number;
}

export const ModalPerformanceComparison: React.FC = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'pure' | 'optimized' | 'original'>('none');
  const [currentFps, setCurrentFps] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // FPS Monitor instance
  const fpsMonitorRef = useRef<JSFPSMonitor | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const testDurationRef = useRef<number>(5000); // 5 seconds per test
  
  // Test animation values for stress testing
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(1)).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(1)).current;

  // Create MORE intensive animations to stress test JS thread
  const runStressAnimations = useCallback(() => {
    // Multiple parallel animations with shorter durations for more stress
    Animated.loop(
      Animated.parallel([
        // Fast X-axis movement
        Animated.sequence([
          Animated.timing(animX, {
            toValue: SCREEN_WIDTH / 2,
            duration: 100, // Much faster
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: -SCREEN_WIDTH / 2,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        // Fast Y-axis movement
        Animated.sequence([
          Animated.timing(animY, {
            toValue: 150,
            duration: 75,
            useNativeDriver: true,
          }),
          Animated.timing(animY, {
            toValue: -150,
            duration: 75,
            useNativeDriver: true,
          }),
        ]),
        // Rapid scale changes
        Animated.sequence([
          Animated.timing(animScale, {
            toValue: 2,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(animScale, {
            toValue: 0.3,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
        // Fast rotation
        Animated.timing(animRotate, {
          toValue: 360,
          duration: 200,
          useNativeDriver: true,
        }),
        // Rapid opacity flashing
        Animated.sequence([
          Animated.timing(animOpacity, {
            toValue: 0.1,
            duration: 25,
            useNativeDriver: true,
          }),
          Animated.timing(animOpacity, {
            toValue: 1,
            duration: 25,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [animX, animY, animScale, animRotate, animOpacity]);

  // Initialize FPS monitor on mount
  useEffect(() => {
    fpsMonitorRef.current = new JSFPSMonitor();
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Heavy JS work to stress the thread
  const stressJSThread = useCallback(() => {
    let stressInterval: NodeJS.Timeout;
    
    // Create heavy computation work
    stressInterval = setInterval(() => {
      // Simulate heavy JS work
      const start = Date.now();
      let counter = 0;
      // Run for ~5ms per iteration
      while (Date.now() - start < 5) {
        counter += Math.sqrt(Math.random() * 1000000);
      }
    }, 10);
    
    return () => clearInterval(stressInterval);
  }, []);

  // Start benchmark
  const startBenchmark = useCallback((modalType: 'pure' | 'optimized' | 'original') => {
    console.log(`Starting ${modalType} modal benchmark`);
    
    // Reset state
    startTimeRef.current = Date.now();
    setCurrentFps(0);
    setTestProgress(0);
    setIsRunning(true);
    setActiveModal(modalType);
    
    // Start FPS monitoring
    if (fpsMonitorRef.current) {
      fpsMonitorRef.current.startTracking();
    }
    
    // Start animations
    runStressAnimations();
    
    // Start JS thread stress
    const cleanup = stressJSThread();
    
    // Update progress and live FPS
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / testDurationRef.current) * 100, 100);
      setTestProgress(progress);
      
      if (progress >= 100) {
        cleanup(); // Stop JS stress
        stopBenchmark(modalType);
      }
    }, 100) as unknown as number;
  }, [runStressAnimations, stressJSThread]);

  // Stop benchmark
  const stopBenchmark = useCallback((modalType: 'pure' | 'optimized' | 'original') => {
    console.log(`Stopping ${modalType} modal benchmark`);
    
    // Clear progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Stop all animations
    animX.stopAnimation();
    animY.stopAnimation();
    animScale.stopAnimation();
    animRotate.stopAnimation();
    animOpacity.stopAnimation();
    
    // Reset animation values
    animX.setValue(0);
    animY.setValue(0);
    animScale.setValue(1);
    animRotate.setValue(0);
    animOpacity.setValue(1);
    
    // Get FPS statistics
    if (fpsMonitorRef.current) {
      const fpsData = fpsMonitorRef.current.stopAndGetData();
      const duration = Date.now() - startTimeRef.current;
      
      const result: BenchmarkResult = {
        modalType,
        fpsData,
        duration,
        timestamp: Date.now(),
      };
      
      setResults(prev => [...prev, result]);
      console.log(`${modalType} benchmark result:`, {
        avgFps: fpsData.averageFPS.toFixed(1),
        minFps: fpsData.minFPS.toFixed(1),
        maxFps: fpsData.maxFPS.toFixed(1),
      });
    }
    
    // Reset state
    setActiveModal('none');
    setIsRunning(false);
    setCurrentFps(0);
    setTestProgress(0);
  }, [animX, animY, animScale, animRotate, animOpacity]);

  // Run all tests sequentially
  const runComparison = useCallback(async () => {
    // Clear previous results
    setResults([]);
    
    // Test Pure JS Modal
    await new Promise<void>((resolve) => {
      startBenchmark('pure');
      setTimeout(() => {
        resolve();
      }, testDurationRef.current + 1000);
    });
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test Optimized Modal
    await new Promise<void>((resolve) => {
      startBenchmark('optimized');
      setTimeout(() => {
        resolve();
      }, testDurationRef.current + 1000);
    });
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test Original Modal
    await new Promise<void>((resolve) => {
      startBenchmark('original');
      setTimeout(() => {
        resolve();
      }, testDurationRef.current + 1000);
    });
  }, [startBenchmark]);

  // Format results for display
  const formatResult = (result: BenchmarkResult) => ({
    'Average FPS': result.fpsData.averageFPS.toFixed(1),
    'Min FPS': result.fpsData.minFPS.toFixed(1),
    'Max FPS': result.fpsData.maxFPS.toFixed(1),
    'Duration': `${(result.duration / 1000).toFixed(1)}s`,
  });

  // Compare results
  const getComparison = () => {
    const pureResult = results.find(r => r.modalType === 'pure');
    const optimizedResult = results.find(r => r.modalType === 'optimized');
    const originalResult = results.find(r => r.modalType === 'original');
    
    if (!pureResult) return null;
    
    // Find best performer
    const allResults = [pureResult, optimizedResult, originalResult].filter(Boolean) as BenchmarkResult[];
    const bestResult = allResults.reduce((best, current) => 
      current.fpsData.averageFPS > best.fpsData.averageFPS ? current : best
    );
    
    const getModalName = (type: string) => {
      switch(type) {
        case 'pure': return 'Pure JS';
        case 'optimized': return 'Optimized (Stable Callbacks)';
        case 'original': return 'Original Modal';
        default: return type;
      }
    };
    
    return {
      winner: getModalName(bestResult.modalType),
      avgFps: bestResult.fpsData.averageFPS.toFixed(1),
      improvement: optimizedResult && pureResult ? 
        ((optimizedResult.fpsData.averageFPS - pureResult.fpsData.averageFPS) / pureResult.fpsData.averageFPS * 100).toFixed(1) : '0',
    };
  };

  // Update live FPS display while running
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && fpsMonitorRef.current) {
      // Update FPS display every 200ms
      intervalId = setInterval(() => {
        const currentFps = fpsMonitorRef.current?.getCurrentFPS() || 0;
        setCurrentFps(currentFps);
      }, 200);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const comparison = getComparison();

  // Render test content inside modals
  const TestContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Performance Benchmark Running</Text>
      <Text style={styles.modalSubtitle}>Testing animations and resize performance</Text>
      
      {/* Live stats */}
      <View style={styles.liveStatsCard}>
        <Text style={styles.statLabel}>Current FPS</Text>
        <Text style={[styles.statValue, { color: currentFps > 50 ? '#10B981' : currentFps > 30 ? '#F59E0B' : '#EF4444' }]}>
          {currentFps}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Test Progress</Text>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${testProgress}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{testProgress.toFixed(0)}%</Text>
      </View>
      
      {/* Animated stress test elements */}
      <View style={styles.animationContainer}>
        {/* Multiple animated elements to stress test */}
        <Animated.View
          style={[
            styles.animatedBox,
            {
              transform: [
                { translateX: animX },
                { translateY: animY },
                { scale: animScale },
                { rotate: animRotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                })},
              ],
              opacity: animOpacity,
            },
          ]}
        />
        
        {/* Many more elements for much more stress on JS thread */}
        {[...Array(10)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.smallBox,
              {
                transform: [
                  { translateX: Animated.multiply(animX, (i + 1) * 0.2) },
                  { translateY: Animated.multiply(animY, (i + 1) * 0.2) },
                  { scale: Animated.multiply(animScale, 0.8 + (i * 0.05)) },
                  { rotate: animRotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: [`${i * 36}deg`, `${360 + i * 36}deg`],
                  })},
                ],
                opacity: animOpacity,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Modal Performance Comparison</Text>
        
        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Controls</Text>
          <Text style={styles.instructions}>
            Compare performance between Pure JS Modal and Original Modal implementation
          </Text>
          
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.buttonPrimary, isRunning && styles.buttonDisabled]}
              onPress={runComparison}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Run Full Comparison</Text>
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark('pure')}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>Pure JS</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark('optimized')}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>Optimized</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark('original')}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>Original</Text>
            </Pressable>
          </View>

          {/* Current test indicator */}
          {isRunning && (
            <View style={styles.currentTest}>
              <View style={styles.recordingDot} />
              <Text style={styles.currentTestText}>
                Testing {activeModal === 'pure' ? 'Pure JS' : 
                         activeModal === 'optimized' ? 'Optimized' : 
                         'Original'} Modal...
              </Text>
            </View>
          )}
        </View>

        {/* Results */}
        {results.length > 0 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Test Results</Text>
                <Pressable 
                  style={styles.clearButton}
                  onPress={() => setResults([])}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
              
              <View style={styles.resultsGrid}>
                {results.map((result, index) => (
                  <View key={index} style={styles.resultCard}>
                    <Text style={styles.resultCardTitle}>
                      {result.modalType === 'pure' ? '⚡ Pure JS' : 
                       result.modalType === 'optimized' ? '🚀 Optimized' : 
                       '📦 Original'}
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
            </View>

            {/* Comparison */}
            {comparison && (
              <View style={[styles.section, styles.comparisonSection]}>
                <Text style={styles.sectionTitle}>🏆 Winner</Text>
                <View style={styles.winnerCard}>
                  <Text style={styles.winnerName}>
                    🏆 {comparison.winner}
                  </Text>
                  <Text style={styles.winnerStats}>
                    Average FPS: {comparison.avgFps}
                  </Text>
                  {comparison.improvement !== '0' && (
                    <Text style={styles.winnerDetail}>
                      Optimized is {comparison.improvement}% better than Pure JS
                    </Text>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Test Modals */}
      {/* Pure JS Modal */}
      <ClaudeModalPure
        visible={activeModal === 'pure'}
        onClose={() => stopBenchmark('pure')}
        header={{
          title: 'Pure JS Modal',
          subtitle: `FPS: ${currentFps}`,
        }}
        persistenceKey="benchmark-pure-modal"
        initialMode="floating"
      >
        <TestContent />
      </ClaudeModalPure>

      {/* Optimized Modal */}
      <ClaudeModalOptimized
        visible={activeModal === 'optimized'}
        onClose={() => stopBenchmark('optimized')}
        header={{
          title: 'Optimized Modal',
          subtitle: `FPS: ${currentFps} | Stable Callbacks`,
        }}
        persistenceKey="benchmark-optimized-modal"
        initialMode="bottomSheet"
      >
        <TestContent />
      </ClaudeModalOptimized>

      {/* Original Modal */}
      <BaseFloatingModal
        visible={activeModal === 'original'}
        onClose={() => stopBenchmark('original')}
        storagePrefix="benchmark-original"
        customHeaderContent={
          <View>
            <Text style={styles.modalHeaderText}>Original Modal Test</Text>
            <Text style={styles.modalHeaderSubtext}>FPS: {currentFps}</Text>
          </View>
        }
      >
        <TestContent />
      </BaseFloatingModal>
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
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#0EA5E9',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonSmall: {
    flex: 1,
  },
  buttonTextSmall: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
  currentTest: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginTop: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  currentTestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  resultsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  resultCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  resultValue: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
  comparisonSection: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  winnerCard: {
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  winnerStats: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  winnerDetail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  modalContent: {
    padding: 20,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalHeaderSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  liveStatsCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  animationContainer: {
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBox: {
    width: 60,
    height: 60,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    position: 'absolute',
  },
  smallBox: {
    width: 30,
    height: 30,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    position: 'absolute',
  },
});

export default ModalPerformanceComparison;