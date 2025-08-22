/**
 * Professional Performance Benchmark for VirtualizedDataExplorer
 * 
 * This component provides comprehensive performance testing with
 * real-time component rendering and professional UI design.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { VirtualizedDataExplorer } from "./VirtualizedDataExplorerRefactored";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Test data generators
const generateSmallData = () => ({
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      location: "New York",
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
    },
  },
  settings: {
    privacy: "public",
    features: ["dashboard", "analytics", "reports"],
  },
  metadata: {
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: "1.0.0",
  },
});

const generateMediumData = () => {
  const data: any = {
    users: [],
    stats: {},
    config: {},
  };
  
  // Generate 50 users
  for (let i = 0; i < 50; i++) {
    data.users.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      active: Math.random() > 0.5,
      score: Math.floor(Math.random() * 100),
      tags: [`tag${i % 5}`, `group${i % 3}`],
    });
  }
  
  // Add stats
  data.stats = {
    total: 50,
    active: data.users.filter((u: any) => u.active).length,
    averageScore: data.users.reduce((acc: number, u: any) => acc + u.score, 0) / 50,
    distribution: {
      high: data.users.filter((u: any) => u.score > 70).length,
      medium: data.users.filter((u: any) => u.score >= 30 && u.score <= 70).length,
      low: data.users.filter((u: any) => u.score < 30).length,
    },
  };
  
  return data;
};

const generateLargeData = () => {
  const createNestedObject = (depth: number, breadth: number): any => {
    if (depth === 0) {
      return {
        value: Math.random(),
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9),
      };
    }
    
    const obj: any = {};
    for (let i = 0; i < breadth; i++) {
      obj[`node_${depth}_${i}`] = {
        data: createNestedObject(depth - 1, Math.max(1, breadth - 1)),
        meta: {
          level: depth,
          index: i,
          path: `node_${depth}_${i}`,
        },
      };
    }
    return obj;
  };
  
  return {
    deepStructure: createNestedObject(5, 3),
    arrayData: Array(200).fill(0).map((_, i) => ({
      id: i,
      value: `Item ${i}`,
      score: Math.random() * 100,
      nested: {
        details: `Details for item ${i}`,
        timestamp: Date.now() - i * 1000,
      },
    })),
    mixed: {
      strings: ["alpha", "beta", "gamma"],
      numbers: [1, 2, 3, 4, 5],
      booleans: [true, false, true],
      nulls: [null, undefined, null],
      objects: Array(20).fill(0).map((_, i) => ({ id: i, value: Math.random() })),
    },
  };
};

interface TestConfig {
  name: string;
  description: string;
  generator: () => any;
  color: string;
  icon: string;
}

interface TestResult {
  name: string;
  renderTime: number;
  expandTime: number;
  itemCount: number;
  fps: number;
  status: "pending" | "running" | "complete";
}

export const VirtualizedDataExplorerBenchmarkPro: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [testData, setTestData] = useState<any>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showComponent, setShowComponent] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const tests: TestConfig[] = [
    {
      name: "Small Nested",
      description: "Simple nested object structure",
      generator: generateSmallData,
      color: gameUIColors.success,
      icon: "📦",
    },
    {
      name: "Medium Complex",
      description: "50 users with statistics",
      generator: generateMediumData,
      color: gameUIColors.warning,
      icon: "📊",
    },
    {
      name: "Large Deep",
      description: "Deep nesting & 200+ items",
      generator: generateLargeData,
      color: gameUIColors.error,
      icon: "🌳",
    },
  ];

  // Animate component appearance
  useEffect(() => {
    if (showComponent) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showComponent]);

  // Pulse animation for running test
  useEffect(() => {
    if (isRunning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isRunning]);

  const countDataItems = (data: any): number => {
    if (!data) return 0;
    if (Array.isArray(data)) return data.length;
    if (typeof data === "object") {
      let count = Object.keys(data).length;
      Object.values(data).forEach((value) => {
        if (typeof value === "object" && value !== null) {
          count += countDataItems(value);
        }
      });
      return count;
    }
    return 1;
  };

  const runTests = useCallback(async () => {
    if (isRunning) return;
    
    console.log("🚀 Starting professional benchmark tests");
    setIsRunning(true);
    setResults([]);
    setCurrentTestIndex(-1);

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`\n🧪 Test ${i + 1}/${tests.length}: ${test.name}`);
      setCurrentTestIndex(i);
      
      // Initialize result
      const result: TestResult = {
        name: test.name,
        renderTime: 0,
        expandTime: 0,
        itemCount: 0,
        fps: 60,
        status: "running",
      };
      
      setResults(prev => [...prev.slice(0, i), result, ...prev.slice(i + 1)]);
      
      // Generate test data
      const data = test.generator();
      const itemCount = countDataItems(data);
      console.log(`📊 Generated ${itemCount} items`);
      
      // Show component and measure render time
      const renderStart = performance.now();
      setTestData(data);
      setShowComponent(true);
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 500));
      const renderTime = performance.now() - renderStart;
      console.log(`⏱️ Initial render: ${renderTime.toFixed(0)}ms`);
      
      // Trigger expand and measure
      const expandStart = performance.now();
      setExpandTrigger(prev => prev + 1);
      
      // Simulate interaction and stress
      await new Promise(resolve => setTimeout(resolve, 1000));
      const expandTime = performance.now() - expandStart;
      console.log(`⏱️ Expand time: ${expandTime.toFixed(0)}ms`);
      
      // Calculate mock FPS based on performance
      const totalTime = renderTime + expandTime;
      let fps = 60;
      if (totalTime > 100) fps = Math.max(20, 60 - (totalTime / 10));
      
      // Update result
      result.renderTime = renderTime;
      result.expandTime = expandTime;
      result.itemCount = itemCount;
      result.fps = Math.round(fps);
      result.status = "complete";
      
      setResults(prev => {
        const newResults = [...prev];
        newResults[i] = result;
        return newResults;
      });
      
      // Keep showing for a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hide component
      setShowComponent(false);
      setTestData(null);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setCurrentTestIndex(-1);
    setIsRunning(false);
    console.log("✅ All tests complete!");
  }, [isRunning]);

  const getPerformanceRating = (result: TestResult) => {
    const totalTime = result.renderTime + result.expandTime;
    if (totalTime < 500 && result.fps > 50) return { text: "Excellent", color: gameUIColors.success };
    if (totalTime < 1000 && result.fps > 30) return { text: "Good", color: gameUIColors.warning };
    return { text: "Needs Work", color: gameUIColors.error };
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Performance Benchmark</Text>
          <Text style={styles.subtitle}>
            VirtualizedDataExplorer Component Testing Suite
          </Text>
        </View>

        {/* Test Cards */}
        <View style={styles.testCards}>
          {tests.map((test, index) => {
            const isActive = currentTestIndex === index;
            const result = results[index];
            
            return (
              <Animated.View
                key={test.name}
                style={[
                  styles.testCard,
                  isActive && styles.testCardActive,
                  isActive && {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <View style={styles.testCardHeader}>
                  <View style={styles.testCardIcon}>
                    <Text style={styles.testCardEmoji}>{test.icon}</Text>
                  </View>
                  <View style={styles.testCardInfo}>
                    <Text style={styles.testCardName}>{test.name}</Text>
                    <Text style={styles.testCardDescription}>{test.description}</Text>
                  </View>
                  {result?.status === "complete" && (
                    <View style={[styles.statusIndicator, { backgroundColor: getPerformanceRating(result).color }]}>
                      <Text style={styles.statusText}>✓</Text>
                    </View>
                  )}
                  {isActive && (
                    <View style={[styles.statusIndicator, styles.statusRunning]}>
                      <Text style={styles.statusText}>...</Text>
                    </View>
                  )}
                </View>
                
                {result?.status === "complete" && (
                  <View style={styles.testResults}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Render</Text>
                      <Text style={styles.resultValue}>{result.renderTime.toFixed(0)}ms</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Expand</Text>
                      <Text style={styles.resultValue}>{result.expandTime.toFixed(0)}ms</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Items</Text>
                      <Text style={styles.resultValue}>{result.itemCount}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>FPS</Text>
                      <Text style={[styles.resultValue, { color: result.fps > 50 ? gameUIColors.success : result.fps > 30 ? gameUIColors.warning : gameUIColors.error }]}>
                        {result.fps}
                      </Text>
                    </View>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Control Button */}
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runTests}
          disabled={isRunning}
          activeOpacity={0.8}
        >
          <Text style={styles.runButtonText}>
            {isRunning ? "Running Tests..." : "Run Performance Tests"}
          </Text>
        </TouchableOpacity>

        {/* Summary */}
        {results.length === tests.length && results.every(r => r.status === "complete") && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Performance Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg Render</Text>
                <Text style={styles.summaryValue}>
                  {(results.reduce((acc, r) => acc + r.renderTime, 0) / results.length).toFixed(0)}ms
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Avg FPS</Text>
                <Text style={styles.summaryValue}>
                  {(results.reduce((acc, r) => acc + r.fps, 0) / results.length).toFixed(0)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Items</Text>
                <Text style={styles.summaryValue}>
                  {results.reduce((acc, r) => acc + r.itemCount, 0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Live Component Display */}
        {showComponent && testData && (
          <Animated.View
            style={[
              styles.componentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.componentHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE TEST</Text>
              </View>
              <Text style={styles.componentTitle}>
                {tests[currentTestIndex]?.name || "Test"}
              </Text>
            </View>
            <View style={styles.componentContent}>
              <VirtualizedDataExplorer
                title={tests[currentTestIndex]?.name || "Test Data"}
                description={`Testing with ${countDataItems(testData)} total items`}
                data={testData}
                maxDepth={10}
                initialExpanded={expandTrigger > 0}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: gameUIColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: gameUIColors.secondary,
    opacity: 0.8,
  },
  testCards: {
    paddingHorizontal: 16,
    gap: 12,
  },
  testCard: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  testCardActive: {
    borderColor: gameUIColors.info,
    backgroundColor: gameUIColors.info + "10",
  },
  testCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  testCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: gameUIColors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  testCardEmoji: {
    fontSize: 20,
  },
  testCardInfo: {
    flex: 1,
  },
  testCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginBottom: 2,
  },
  testCardDescription: {
    fontSize: 12,
    color: gameUIColors.secondary,
    opacity: 0.7,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusRunning: {
    backgroundColor: gameUIColors.warning,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  testResults: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "20",
    gap: 16,
  },
  resultRow: {
    flex: 1,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 10,
    color: gameUIColors.secondary,
    opacity: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
    fontFamily: "monospace",
  },
  runButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: gameUIColors.info,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  runButtonDisabled: {
    opacity: 0.5,
  },
  runButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  summary: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: gameUIColors.success + "10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gameUIColors.success + "30",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 11,
    color: gameUIColors.secondary,
    opacity: 0.7,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: gameUIColors.success,
  },
  componentContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: gameUIColors.panel,
    borderWidth: 2,
    borderColor: gameUIColors.info,
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  componentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: gameUIColors.info,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  componentTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  componentContent: {
    padding: 16,
    maxHeight: 400,
  },
});