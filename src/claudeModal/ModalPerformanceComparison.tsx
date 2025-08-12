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
import { BaseFloatingModal } from '../_components/floating-bubble/modal/components/BaseFloatingModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

export const ModalPerformanceComparison: React.FC = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'pure' | 'original'>('none');
  const [currentFps, setCurrentFps] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Refs for performance tracking
  const frameDataRef = useRef<FrameData[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const testDurationRef = useRef<number>(5000); // 5 seconds per test
  
  // Test animation values for stress testing
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(1)).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(1)).current;

  // Create intensive animations to stress test
  const runStressAnimations = useCallback(() => {
    // Multiple parallel animations to stress the system
    Animated.loop(
      Animated.parallel([
        // X-axis movement
        Animated.sequence([
          Animated.timing(animX, {
            toValue: SCREEN_WIDTH / 2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: -SCREEN_WIDTH / 2,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Y-axis movement
        Animated.sequence([
          Animated.timing(animY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Scale animation
        Animated.sequence([
          Animated.timing(animScale, {
            toValue: 1.5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animScale, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Rotation
        Animated.timing(animRotate, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Opacity pulse
        Animated.sequence([
          Animated.timing(animOpacity, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [animX, animY, animScale, animRotate, animOpacity]);

  // Core FPS measurement function
  const measureFrame = useCallback((timestamp: number, modalType: 'pure' | 'original') => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      lastFrameTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;
    const elapsed = timestamp - startTimeRef.current;
    
    // Calculate FPS from frame delta
    if (deltaTime > 0) {
      const fps = Math.min(1000 / deltaTime, 60); // Cap at 60 FPS
      frameDataRef.current.push({
        timestamp: elapsed,
        fps,
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
      animationIdRef.current = requestAnimationFrame((t) => measureFrame(t, modalType));
    } else {
      stopBenchmark(modalType);
    }
  }, []);

  // Start benchmark
  const startBenchmark = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Starting ${modalType} modal benchmark`);
    
    // Reset state
    frameDataRef.current = [];
    frameCountRef.current = 0;
    startTimeRef.current = 0;
    lastFrameTimeRef.current = 0;
    setCurrentFps(0);
    setTestProgress(0);
    setIsRunning(true);
    setActiveModal(modalType);
    
    // Start animations
    runStressAnimations();
    
    // Start frame measurement
    animationIdRef.current = requestAnimationFrame((t) => measureFrame(t, modalType));
  }, [measureFrame, runStressAnimations]);

  // Stop benchmark
  const stopBenchmark = useCallback((modalType: 'pure' | 'original') => {
    console.log(`Stopping ${modalType} modal benchmark`);
    
    // Cancel animation frame
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
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
      console.log(`${modalType} benchmark result:`, {
        avgFps: avgFps.toFixed(1),
        minFps: minFps.toFixed(1),
        maxFps: maxFps.toFixed(1),
        droppedFrames,
      });
    }
    
    // Reset state
    setActiveModal('none');
    setIsRunning(false);
    setCurrentFps(0);
    setTestProgress(0);
  }, [animX, animY, animScale, animRotate, animOpacity]);

  // Run both tests sequentially
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
    'Average FPS': result.avgFps.toFixed(1),
    'Min FPS': result.minFps.toFixed(1),
    'Max FPS': result.maxFps.toFixed(1),
    'Dropped Frames': `${result.droppedFrames} / ${result.totalFrames}`,
    'Drop Rate': `${((result.droppedFrames / result.totalFrames) * 100).toFixed(1)}%`,
    'Duration': `${(result.duration / 1000).toFixed(1)}s`,
  });

  // Compare results
  const getComparison = () => {
    const pureResult = results.find(r => r.modalType === 'pure');
    const originalResult = results.find(r => r.modalType === 'original');
    
    if (!pureResult || !originalResult) return null;
    
    const fpsDiff = pureResult.avgFps - originalResult.avgFps;
    const dropDiff = originalResult.droppedFrames - pureResult.droppedFrames;
    
    return {
      winner: fpsDiff > 0 ? 'Pure JS' : 'Original',
      fpsDiff: Math.abs(fpsDiff).toFixed(1),
      dropDiff: Math.abs(dropDiff),
      betterBy: fpsDiff > 0 
        ? `${fpsDiff.toFixed(1)} FPS faster`
        : `${Math.abs(fpsDiff).toFixed(1)} FPS faster`,
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

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
        
        {/* Additional elements for more stress */}
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.smallBox,
              {
                transform: [
                  { translateX: Animated.multiply(animX, (i + 1) * 0.3) },
                  { translateY: Animated.multiply(animY, (i + 1) * 0.3) },
                  { scale: animScale },
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
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark('pure')}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Test Pure JS Only</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark('original')}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>Test Original Only</Text>
            </Pressable>
          </View>

          {/* Current test indicator */}
          {isRunning && (
            <View style={styles.currentTest}>
              <View style={styles.recordingDot} />
              <Text style={styles.currentTestText}>
                Testing {activeModal === 'pure' ? 'Pure JS' : 'Original'} Modal...
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
                      {result.modalType === 'pure' ? '⚡ Pure JS Modal' : '📦 Original Modal'}
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
                    {comparison.winner === 'Pure JS' ? '⚡ Pure JS Modal' : '📦 Original Modal'}
                  </Text>
                  <Text style={styles.winnerStats}>
                    {comparison.betterBy}
                  </Text>
                  <Text style={styles.winnerDetail}>
                    {comparison.dropDiff} fewer dropped frames
                  </Text>
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
          title: 'Pure JS Modal Test',
          subtitle: `FPS: ${currentFps}`,
        }}
        persistenceKey="benchmark-pure-modal"
        initialMode="floating"
      >
        <TestContent />
      </ClaudeModalPure>

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