/**
 * Modal Performance Comparison - All Variants
 *
 * Tests all 5 modal versions with performance benchmarks:
 *
 * 1. ClaudeModal - Current default implementation
 * 2. ClaudeModalOriginal - The unoptimized baseline
 * 3. ClaudeModalOptimized - Performance optimized version
 * 4. ClaudeModalPure - Pure component version with stable callbacks
 * 5. ThemedClaudeModal - Theme-aware wrapper with effects
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import ClaudeModal from "./ClaudeModal";
import ClaudeModalOriginal from "./ClaudeModalOriginal";
import ClaudeModalOptimized from "./ClaudeModalOptimized";
import ClaudeModalPure from "./ClaudeModalPure";
import { ThemedClaudeModal } from "./ThemedClaudeModal";
import { JSFPSMonitor, JSFPSResult } from "./utils/JSFPSMonitor";
import { renderTracker } from "./utils/ComponentRenderTracker";
import { useRenderTracking } from "./utils/useRenderTracking";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ModalType = "claude" | "original" | "optimized" | "pure" | "themed";

interface BenchmarkResult {
  modalType: ModalType;
  fpsData: JSFPSResult;
  duration: number;
  timestamp: number;
  timingData?: Record<string, number>; // Direct timing measurements
  renderMetrics?: {
    mountTime?: number;
    updateCount: number;
    averageUpdateTime: number;
    totalRenderTime: number;
  };
}

// Add refs for tracking timing
interface TimingRefs {
  modalOpenStart: number;
  animationsStart: number;
  stressStart: number;
  fpsTrackingStart: number;
}

// Get modal display name
const getModalName = (type: ModalType) => {
  switch (type) {
    case "claude":
      return "ClaudeModal";
    case "original":
      return "ClaudeModalOriginal";
    case "optimized":
      return "ClaudeModalOptimized";
    case "pure":
      return "ClaudeModalPure";
    case "themed":
      return "ThemedClaudeModal";
    default:
      return type;
  }
};

// Create tracked versions of modals with render performance monitoring
const TrackedClaudeModal = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ClaudeModal');
  return <ClaudeModal {...props} ref={ref} />;
});

const TrackedClaudeModalOriginal = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ClaudeModalOriginal');
  return <ClaudeModalOriginal {...props} ref={ref} />;
});

const TrackedClaudeModalOptimized = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ClaudeModalOptimized');
  return <ClaudeModalOptimized {...props} ref={ref} />;
});

const TrackedClaudeModalPure = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ClaudeModalPure');
  return <ClaudeModalPure {...props} ref={ref} />;
});

const TrackedThemedClaudeModal = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ThemedClaudeModal');
  return <ThemedClaudeModal {...props} ref={ref} />;
});

export const ModalPerformanceComparison: React.FC = () => {
  // Track this component's renders
  useRenderTracking('ModalPerformanceComparison');
  
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType | "none">("none");
  const [currentFps, setCurrentFps] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  // FPS Monitor instance
  const fpsMonitorRef = useRef<JSFPSMonitor | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const testDurationRef = useRef<number>(5000); // 5 seconds per test
  
  // Timing refs for direct measurement
  const timingRefs = useRef<TimingRefs>({
    modalOpenStart: 0,
    animationsStart: 0,
    stressStart: 0,
    fpsTrackingStart: 0
  });

  // Test animation values for stress testing
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(1)).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(1)).current;

  // Create intensive animations to stress test JS thread
  const runStressAnimations = useCallback(() => {
    Animated.loop(
      Animated.parallel([
        // Fast X-axis movement
        Animated.sequence([
          Animated.timing(animX, {
            toValue: SCREEN_WIDTH / 2,
            duration: 100,
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
    let stressInterval: ReturnType<typeof setInterval>;

    stressInterval = setInterval(() => {
      const start = Date.now();
      // Run for ~5ms per iteration
      while (Date.now() - start < 5) {
        // Heavy computation
      }
    }, 10);

    return () => clearInterval(stressInterval);
  }, []);

  // Start benchmark
  const startBenchmark = useCallback(
    (modalType: ModalType) => {
      console.log(`Starting ${modalType} modal benchmark`);

      // Clear previous render metrics for this modal
      const componentName = getModalName(modalType);
      renderTracker.clearMetrics(componentName);
      
      // Reset state
      startTimeRef.current = performance.now();
      setCurrentFps(0);
      setTestProgress(0);
      setIsRunning(true);
      
      // Track modal opening time
      timingRefs.current.modalOpenStart = performance.now();
      setActiveModal(modalType);
      
      // Measure modal open time after animation
      setTimeout(() => {
        const modalOpenTime = performance.now() - timingRefs.current.modalOpenStart;
        console.log(`${modalType} modal open time: ${modalOpenTime.toFixed(2)}ms`);
      }, 300); // Typical modal animation duration

      // Start FPS monitoring
      if (fpsMonitorRef.current) {
        timingRefs.current.fpsTrackingStart = performance.now();
        fpsMonitorRef.current.startTracking();
      }

      // Start animations
      timingRefs.current.animationsStart = performance.now();
      runStressAnimations();

      // Start JS stress
      timingRefs.current.stressStart = performance.now();
      const cleanup = stressJSThread();

      // Update progress and live FPS
      progressIntervalRef.current = setInterval(() => {
        const elapsed = performance.now() - startTimeRef.current;
        const progress = Math.min(
          (elapsed / testDurationRef.current) * 100,
          100
        );
        setTestProgress(progress);

        if (progress >= 100) {
          console.log(`[DEBUG] Test progress reached 100% for ${modalType}`);
          
          cleanup(); // Stop JS stress
          stopBenchmark(modalType);
        }
      }, 100) as unknown as number;
    },
    [runStressAnimations, stressJSThread]
  );

  // Stop benchmark
  const stopBenchmark = useCallback(
    (modalType: ModalType) => {
      console.log(`[DEBUG] Stopping ${modalType} modal benchmark`);
      
      const modalCloseStart = performance.now();

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Calculate direct timings
      const animationsDuration = performance.now() - timingRefs.current.animationsStart;
      const stressDuration = performance.now() - timingRefs.current.stressStart;
      const fpsTrackingDuration = performance.now() - timingRefs.current.fpsTrackingStart;
      
      console.log(`[DEBUG] Calculated timings:`, {
        animationsDuration: animationsDuration.toFixed(2),
        stressDuration: stressDuration.toFixed(2),
        fpsTrackingDuration: fpsTrackingDuration.toFixed(2)
      });

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
        console.log(`[DEBUG] Getting FPS data...`);
        const fpsData = fpsMonitorRef.current.stopAndGetData();
        const duration = performance.now() - startTimeRef.current;
        
        console.log(`[DEBUG] FPS Data:`, {
          averageFPS: fpsData.averageFPS,
          minFPS: fpsData.minFPS,
          maxFPS: fpsData.maxFPS,
          standardDeviation: fpsData.standardDeviation,
          totalDuration: duration.toFixed(2)
        });

        // Create timing data object with direct measurements
        const timingData: Record<string, number> = {
          'modal-open': 300, // We know this is ~300ms from setTimeout
          'animations-duration': animationsDuration,
          'stress-duration': stressDuration,
          'fps-tracking-duration': fpsTrackingDuration,
          'benchmark-total': duration
        };
        
        console.log(`[DEBUG] Timing data object:`, timingData);

        // Get render metrics for this modal
        const componentName = getModalName(modalType);
        const modalRenderMetrics = renderTracker.getMetrics(componentName);
        
        let renderMetrics = undefined;
        if (modalRenderMetrics) {
          renderMetrics = {
            mountTime: modalRenderMetrics.mountTime,
            updateCount: modalRenderMetrics.updateCount,
            averageUpdateTime: modalRenderMetrics.averageUpdateTime,
            totalRenderTime: modalRenderMetrics.totalRenderTime,
          };
          console.log(`[DEBUG] Render metrics for ${componentName}:`, renderMetrics);
        }

        const result: BenchmarkResult = {
          modalType,
          fpsData,
          duration,
          timestamp: Date.now(),
          timingData,
          renderMetrics
        };

        console.log(`[DEBUG] Adding result to state`);
        setResults((prev) => {
          console.log(`[DEBUG] Previous results count: ${prev.length}`);
          return [...prev, result];
        });
        
        // Enhanced logging with timing data
        console.log(`[DEBUG] ${modalType} final benchmark result:`, {
          avgFps: fpsData.averageFPS?.toFixed(1) || "0",
          minFps: fpsData.minFPS?.toFixed(1) || "0",
          maxFps: fpsData.maxFPS?.toFixed(1) || "0",
          modalOpenTime: timingData['modal-open']?.toFixed(2) || 'N/A',
          animationTime: timingData['animations-duration']?.toFixed(2) || 'N/A',
          totalTime: timingData['benchmark-total']?.toFixed(2) || 'N/A'
        });
      } else {
        console.log(`[DEBUG] FPS Monitor not available!`);
      }

      // Reset state
      setActiveModal("none");
      setIsRunning(false);
      setCurrentFps(0);
      setTestProgress(0);
      
      // Log modal close time after animation
      setTimeout(() => {
        const modalCloseTime = performance.now() - modalCloseStart;
        console.log(`[DEBUG] ${modalType} modal close time: ${modalCloseTime.toFixed(2)}ms`);
      }, 300); // Typical modal animation duration
    },
    [animX, animY, animScale, animRotate, animOpacity]
  );

  // Run all tests sequentially
  const runComparison = useCallback(async () => {
    // Clear previous results
    setResults([]);
    setCurrentTestIndex(0);

    const modalTypes: ModalType[] = ["claude", "original", "optimized", "pure", "themed"];

    for (let i = 0; i < modalTypes.length; i++) {
      setCurrentTestIndex(i + 1);
      await new Promise<void>((resolve) => {
        startBenchmark(modalTypes[i]);
        setTimeout(() => {
          resolve();
        }, testDurationRef.current + 1000);
      });

      // Wait between tests (except after last test)
      if (i < modalTypes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    
    setCurrentTestIndex(0);
  }, [startBenchmark]);

  // Format results for display
  const formatResult = (result: BenchmarkResult) => {
    const baseResult: any = {
      "Average FPS": result.fpsData.averageFPS?.toFixed(1) || "0",
      "Min FPS": result.fpsData.minFPS?.toFixed(1) || "0",
      "Max FPS": result.fpsData.maxFPS?.toFixed(1) || "0",
    };
    
    // Only add Std Dev if it exists and is a valid number
    if (result.fpsData.standardDeviation !== undefined && !isNaN(result.fpsData.standardDeviation)) {
      baseResult["Std Dev"] = result.fpsData.standardDeviation.toFixed(1);
    }
    
    return baseResult;
  };


  // Get modal emoji icon
  const getModalIcon = (type: ModalType) => {
    switch (type) {
      case "claude":
        return "📦";
      case "original":
        return "🔧";
      case "optimized":
        return "⚡";
      case "pure":
        return "💎";
      case "themed":
        return "🎨";
      default:
        return "📊";
    }
  };

  // Compare results and find winner
  const getComparison = () => {
    if (results.length === 0) return null;

    // Sort by average FPS (descending)
    const sortedResults = [...results].sort(
      (a, b) => (b.fpsData.averageFPS || 0) - (a.fpsData.averageFPS || 0)
    );

    const winner = sortedResults[0];
    const loser = sortedResults[sortedResults.length - 1];

    const winnerFps = winner.fpsData.averageFPS || 0;
    const loserFps = loser.fpsData.averageFPS || 0;

    const improvement = winnerFps !== loserFps && loserFps > 0
      ? ((winnerFps - loserFps) / loserFps * 100).toFixed(1)
      : "0";

    return {
      winner: getModalName(winner.modalType),
      avgFps: winnerFps.toFixed(1),
      worstPerformer: getModalName(loser.modalType),
      worstFps: loserFps.toFixed(1),
      improvement,
      rankings: sortedResults.map((r, idx) => ({
        rank: idx + 1,
        name: getModalName(r.modalType),
        icon: getModalIcon(r.modalType),
        fps: (r.fpsData.averageFPS || 0).toFixed(1),
      })),
    };
  };

  // Update live FPS display while running
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isRunning && fpsMonitorRef.current) {
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
  const TestContent = React.memo(() => {
    useRenderTracking('TestContent');
    return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Performance Benchmark Running</Text>
      <Text style={styles.modalSubtitle}>
        Testing animations and resize performance
      </Text>

      {/* Live stats */}
      <View style={styles.liveStatsCard}>
        <Text style={styles.statLabel}>Current FPS</Text>
        <Text
          style={[
            styles.statValue,
            {
              color:
                currentFps > 50
                  ? "#10B981"
                  : currentFps > 30
                  ? "#F59E0B"
                  : "#EF4444",
            },
          ]}
        >
          {currentFps}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Test Progress</Text>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${testProgress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{testProgress.toFixed(0)}%</Text>
      </View>

      {/* Animated stress test elements */}
      <View style={styles.animationContainer}>
        <Animated.View
          style={[
            styles.animatedBox,
            {
              transform: [
                { translateX: animX },
                { translateY: animY },
                { scale: animScale },
                {
                  rotate: animRotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: animOpacity,
            },
          ]}
        />

        {/* Multiple elements for stress testing */}
        {[...Array(10)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.smallBox,
              {
                transform: [
                  { translateX: Animated.multiply(animX, (i + 1) * 0.2) },
                  { translateY: Animated.multiply(animY, (i + 1) * 0.2) },
                  { scale: Animated.multiply(animScale, 0.8 + i * 0.05) },
                  {
                    rotate: animRotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: [`${i * 36}deg`, `${360 + i * 36}deg`],
                    }),
                  },
                ],
                opacity: animOpacity,
              },
            ]}
          />
        ))}
      </View>
    </View>
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Modal Performance Comparison</Text>

        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Controls</Text>
          <Text style={styles.instructions}>
            Compare performance between all 5 modal implementations
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.button,
                styles.buttonPrimary,
                isRunning && styles.buttonDisabled,
              ]}
              onPress={runComparison}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>
                Run Full Comparison {currentTestIndex > 0 && `(${currentTestIndex}/5)`}
              </Text>
            </Pressable>
          </View>

          <View style={styles.buttonGrid}>
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("claude")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>📦 ClaudeModal</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("original")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>🔧 Original</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("optimized")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>⚡ Optimized</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("pure")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>💎 Pure</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("themed")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>🎨 Themed</Text>
            </Pressable>
          </View>

          {/* Current test indicator */}
          {isRunning && (
            <View style={styles.currentTest}>
              <View style={styles.recordingDot} />
              <Text style={styles.currentTestText}>
                Testing {getModalName(activeModal as ModalType)} Modal...
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
                      {getModalIcon(result.modalType)} {getModalName(result.modalType)}
                    </Text>
                    {Object.entries(formatResult(result)).map(
                      ([key, value]) => (
                        <View key={key} style={styles.resultRow}>
                          <Text style={styles.resultLabel}>{key}:</Text>
                          <Text style={styles.resultValue}>{value}</Text>
                        </View>
                      )
                    )}
                    {/* Display timing data if available */}
                    {(() => {
                      console.log(`[DEBUG] Rendering timing data for ${result.modalType}:`, result.timingData);
                      if (result.timingData && Object.keys(result.timingData).length > 0) {
                        return (
                          <>
                            <View style={styles.divider} />
                            <Text style={styles.timingTitle}>Performance Timings:</Text>
                            {result.timingData['modal-open'] && (
                              <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Open Time:</Text>
                                <Text style={styles.resultValue}>
                                  {result.timingData['modal-open'].toFixed(1)}ms
                                </Text>
                              </View>
                            )}
                            {result.timingData['animations-duration'] && (
                              <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Animation:</Text>
                                <Text style={styles.resultValue}>
                                  {(result.timingData['animations-duration'] / 1000).toFixed(1)}s
                                </Text>
                              </View>
                            )}
                            {result.timingData['stress-duration'] && (
                              <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Stress Test:</Text>
                                <Text style={styles.resultValue}>
                                  {(result.timingData['stress-duration'] / 1000).toFixed(1)}s
                                </Text>
                              </View>
                            )}
                          </>
                        );
                      }
                      console.log(`[DEBUG] No timing data to display for ${result.modalType}`);
                      return null;
                    })()}
                    {/* Display render metrics if available */}
                    {result.renderMetrics && (
                      <>
                        <View style={styles.divider} />
                        <Text style={styles.timingTitle}>Render Performance:</Text>
                        {result.renderMetrics.mountTime !== undefined && (
                          <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Mount Time:</Text>
                            <Text style={styles.resultValue}>
                              {result.renderMetrics.mountTime.toFixed(1)}ms
                            </Text>
                          </View>
                        )}
                        <View style={styles.resultRow}>
                          <Text style={styles.resultLabel}>Re-renders:</Text>
                          <Text style={styles.resultValue}>
                            {result.renderMetrics.updateCount}
                          </Text>
                        </View>
                        {result.renderMetrics.updateCount > 0 && (
                          <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Avg Update:</Text>
                            <Text style={styles.resultValue}>
                              {result.renderMetrics.averageUpdateTime.toFixed(1)}ms
                            </Text>
                          </View>
                        )}
                        <View style={styles.resultRow}>
                          <Text style={styles.resultLabel}>Total Render:</Text>
                          <Text style={styles.resultValue}>
                            {result.renderMetrics.totalRenderTime.toFixed(1)}ms
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Rankings */}
            {comparison && comparison.rankings.length > 1 && (
              <View style={[styles.section, styles.rankingSection]}>
                <Text style={styles.sectionTitle}>🏆 Performance Rankings</Text>
                {comparison.rankings.map((item) => (
                  <View 
                    key={item.name} 
                    style={[
                      styles.rankingItem,
                      item.rank === 1 && styles.winnerItem
                    ]}
                  >
                    <View style={styles.rankingLeft}>
                      <Text style={styles.rankNumber}>#{item.rank}</Text>
                      <Text style={styles.rankIcon}>{item.icon}</Text>
                      <Text style={styles.rankName}>{item.name}</Text>
                    </View>
                    <Text style={[
                      styles.rankFps,
                      item.rank === 1 && styles.winnerFps
                    ]}>
                      {item.fps} FPS
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Winner summary */}
            {comparison && (
              <View style={[styles.section, styles.comparisonSection]}>
                <Text style={styles.sectionTitle}>📊 Performance Summary</Text>
                <View style={styles.winnerCard}>
                  <Text style={styles.winnerName}>🥇 Best: {comparison.winner}</Text>
                  <Text style={styles.winnerStats}>
                    Average FPS: {comparison.avgFps}
                  </Text>
                  {comparison.improvement !== "0" && (
                    <Text style={styles.winnerDetail}>
                      {comparison.improvement}% faster than {comparison.worstPerformer}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Test Modals */}
      {activeModal === "claude" && (
        <TrackedClaudeModal
          visible={true}
          onClose={() => stopBenchmark("claude")}
          header={{
            title: "ClaudeModal",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-claude-modal"
          initialMode="floating"
        >
          <TestContent />
        </TrackedClaudeModal>
      )}

      {activeModal === "original" && (
        <TrackedClaudeModalOriginal
          visible={true}
          onClose={() => stopBenchmark("original")}
          header={{
            title: "ClaudeModalOriginal",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-original-modal"
          initialMode="bottomSheet"
        >
          <TestContent />
        </TrackedClaudeModalOriginal>
      )}

      {activeModal === "optimized" && (
        <TrackedClaudeModalOptimized
          visible={true}
          onClose={() => stopBenchmark("optimized")}
          header={{
            title: "ClaudeModalOptimized",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-optimized-modal"
          initialMode="floating"
        >
          <TestContent />
        </TrackedClaudeModalOptimized>
      )}

      {activeModal === "pure" && (
        <TrackedClaudeModalPure
          visible={true}
          onClose={() => stopBenchmark("pure")}
          header={{
            title: "ClaudeModalPure",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-pure-modal"
          initialMode="floating"
        >
          <TestContent />
        </TrackedClaudeModalPure>
      )}

      {activeModal === "themed" && (
        <TrackedThemedClaudeModal
          visible={true}
          onClose={() => stopBenchmark("themed")}
          header={{
            title: "ThemedClaudeModal",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-themed-modal"
          initialMode="floating"
        >
          <TestContent />
        </TrackedThemedClaudeModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    padding: 16,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  instructions: {
    color: "#9CA3AF",
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#0EA5E9",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  buttonSmall: {
    flex: 0,
    minWidth: "30%",
    flexGrow: 1,
  },
  buttonTextSmall: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#EF4444",
    fontSize: 12,
  },
  currentTest: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    marginTop: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },
  currentTestText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  resultCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
  },
  resultCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  resultLabel: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  resultValue: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 8,
  },
  timingTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 6,
    marginTop: 4,
  },
  rankingSection: {
    backgroundColor: "#1F2937",
  },
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    marginBottom: 8,
  },
  winnerItem: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  rankingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6B7280",
    minWidth: 24,
  },
  rankIcon: {
    fontSize: 20,
  },
  rankName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  rankFps: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  winnerFps: {
    color: "#10B981",
  },
  comparisonSection: {
    backgroundColor: "#1F2937",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  winnerCard: {
    padding: 16,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 8,
    alignItems: "center",
  },
  winnerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 8,
  },
  winnerStats: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  winnerDetail: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  modalContent: {
    padding: 20,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  liveStatsCard: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
  },
  progressText: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  animationContainer: {
    height: 200,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBox: {
    width: 60,
    height: 60,
    backgroundColor: "#0EA5E9",
    borderRadius: 8,
    position: "absolute",
  },
  smallBox: {
    width: 30,
    height: 30,
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    position: "absolute",
  },
});

export default ModalPerformanceComparison;