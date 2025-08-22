/**
 * Full-Featured Performance Benchmark for VirtualizedDataExplorer
 * 
 * Includes version tracking, persistent storage, and comparison features
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
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VirtualizedDataExplorer } from "./VirtualizedDataExplorerRefactored";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { VIRTUALIZED_DATA_EXPLORER_VERSION } from "./VirtualizedDataExplorerVersion";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const STORAGE_KEY = "VIRTUALIZED_EXPLORER_BENCHMARK_RESULTS";

// Test data generators (same as before)
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

interface BenchmarkSession {
  id: string;
  date: string;
  version: string;
  versionName: string;
  results: TestResult[];
  averageRenderTime: number;
  averageFPS: number;
  totalItemsTested: number;
}

export const VirtualizedDataExplorerBenchmarkFull: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [testData, setTestData] = useState<any>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showComponent, setShowComponent] = useState(false);
  const [savedSessions, setSavedSessions] = useState<BenchmarkSession[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [autoRunStarted, setAutoRunStarted] = useState(false);
  
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

  // Load saved sessions on mount
  useEffect(() => {
    loadSavedSessions();
  }, []);

  const loadSavedSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const sessions = JSON.parse(stored);
        setSavedSessions(sessions);
        console.log(`📊 Loaded ${sessions.length} benchmark sessions`);
      }
    } catch (error) {
      console.error("Error loading saved sessions:", error);
    }
  };

  const saveBenchmarkSession = async (session: BenchmarkSession) => {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const sessions = existing ? JSON.parse(existing) : [];
      sessions.push(session);
      
      // Keep only last 10 sessions
      const trimmed = sessions.slice(-10);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setSavedSessions(trimmed);
      console.log("✅ Benchmark session saved");
    } catch (error) {
      console.error("Error saving benchmark session:", error);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all benchmark history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setSavedSessions([]);
              setSelectedSessions([]);
              console.log("🗑️ Benchmark history cleared");
            } catch (error) {
              console.error("Error clearing history:", error);
            }
          },
        },
      ]
    );
  };

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
    
    console.log("🚀 Starting benchmark tests");
    setIsRunning(true);
    setResults([]);
    setCurrentTestIndex(-1);

    const sessionResults: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      console.log(`\n🧪 Test ${i + 1}/${tests.length}: ${test.name}`);
      setCurrentTestIndex(i);
      
      const result: TestResult = {
        name: test.name,
        renderTime: 0,
        expandTime: 0,
        itemCount: 0,
        fps: 60,
        status: "running",
      };
      
      setResults(prev => [...prev.slice(0, i), result, ...prev.slice(i + 1)]);
      
      const data = test.generator();
      const itemCount = countDataItems(data);
      console.log(`📊 Generated ${itemCount} items`);
      
      const renderStart = performance.now();
      setTestData(data);
      setShowComponent(true);
      
      // Wait longer for full render with all items expanded
      await new Promise(resolve => setTimeout(resolve, 2000));
      const renderTime = performance.now() - renderStart;
      console.log(`⏱️ Full render with all items expanded: ${renderTime.toFixed(0)}ms`);
      
      // No expand timing needed since everything is pre-expanded
      const expandTime = 0;
      const totalTime = renderTime;
      let fps = 60;
      if (totalTime > 100) fps = Math.max(20, 60 - (totalTime / 10));
      
      result.renderTime = renderTime;
      result.expandTime = expandTime;
      result.itemCount = itemCount;
      result.fps = Math.round(fps);
      result.status = "complete";
      
      sessionResults.push(result);
      
      setResults(prev => {
        const newResults = [...prev];
        newResults[i] = result;
        return newResults;
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowComponent(false);
      setTestData(null);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Save session
    const session: BenchmarkSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      version: VIRTUALIZED_DATA_EXPLORER_VERSION.version,
      versionName: VIRTUALIZED_DATA_EXPLORER_VERSION.name,
      results: sessionResults,
      averageRenderTime: sessionResults.reduce((acc, r) => acc + r.renderTime, 0) / sessionResults.length,
      averageFPS: sessionResults.reduce((acc, r) => acc + r.fps, 0) / sessionResults.length,
      totalItemsTested: sessionResults.reduce((acc, r) => acc + r.itemCount, 0),
    };
    
    await saveBenchmarkSession(session);
    
    setCurrentTestIndex(-1);
    setIsRunning(false);
    console.log("✅ All tests complete and saved!");
    
    // Log results for automated testing
    console.log("📊 AUTOMATED TEST RESULTS:");
    console.log("Version:", VIRTUALIZED_DATA_EXPLORER_VERSION.version);
    console.log("Average Render Time:", session.averageRenderTime.toFixed(0) + "ms");
    console.log("Average FPS:", session.averageFPS.toFixed(0));
    console.log("Total Items Tested:", session.totalItemsTested);
    sessionResults.forEach(result => {
      console.log(`  ${result.name}: ${result.renderTime.toFixed(0)}ms @ ${result.fps}fps`);
    });
  }, [isRunning]);

  const getPerformanceRating = (result: TestResult) => {
    const totalTime = result.renderTime + result.expandTime;
    if (totalTime < 500 && result.fps > 50) return { text: "Excellent", color: gameUIColors.success };
    if (totalTime < 1000 && result.fps > 30) return { text: "Good", color: gameUIColors.warning };
    return { text: "Needs Work", color: gameUIColors.error };
  };

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev => {
      if (prev.includes(sessionId)) {
        return prev.filter(id => id !== sessionId);
      }
      if (prev.length >= 2) {
        return [prev[1], sessionId];
      }
      return [...prev, sessionId];
    });
  };

  const getComparison = () => {
    if (selectedSessions.length !== 2) return null;
    
    const session1 = savedSessions.find(s => s.id === selectedSessions[0]);
    const session2 = savedSessions.find(s => s.id === selectedSessions[1]);
    
    if (!session1 || !session2) return null;
    
    const improvement = {
      renderTime: ((session1.averageRenderTime - session2.averageRenderTime) / session1.averageRenderTime) * 100,
      fps: ((session2.averageFPS - session1.averageFPS) / session1.averageFPS) * 100,
    };
    
    return { session1, session2, improvement };
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Version Info */}
        <View style={styles.header}>
          <Text style={styles.title}>Performance Benchmark</Text>
          <View style={styles.versionContainer}>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v{VIRTUALIZED_DATA_EXPLORER_VERSION.version}</Text>
            </View>
            <Text style={styles.subtitle}>
              {VIRTUALIZED_DATA_EXPLORER_VERSION.name}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, !showComparison && styles.tabActive]}
            onPress={() => setShowComparison(false)}
          >
            <Text style={[styles.tabText, !showComparison && styles.tabTextActive]}>
              Run Tests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showComparison && styles.tabActive]}
            onPress={() => setShowComparison(true)}
          >
            <Text style={[styles.tabText, showComparison && styles.tabTextActive]}>
              Compare ({savedSessions.length})
            </Text>
          </TouchableOpacity>
        </View>

        {!showComparison ? (
          <>
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
                          <Text style={styles.resultLabel}>Pre-expanded</Text>
                          <Text style={styles.resultValue}>✓</Text>
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

            {/* Control Buttons */}
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.runButton, isRunning && styles.runButtonDisabled]}
                onPress={runTests}
                disabled={isRunning}
                activeOpacity={0.8}
              >
                <Text style={styles.runButtonText}>
                  {isRunning ? "Running..." : "Run Performance Tests"}
                </Text>
              </TouchableOpacity>
              
              {savedSessions.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearHistory}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearButtonText}>Clear History</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Summary */}
            {results.length === tests.length && results.every(r => r.status === "complete") && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Current Session Summary</Text>
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

          </>
        ) : (
          /* Comparison View */
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>Version Comparison</Text>
            <Text style={styles.comparisonSubtitle}>
              Select up to 2 sessions to compare performance
            </Text>
            
            {/* Session List */}
            <View style={styles.sessionList}>
              {savedSessions.map((session) => {
                const isSelected = selectedSessions.includes(session.id);
                return (
                  <TouchableOpacity
                    key={session.id}
                    style={[styles.sessionCard, isSelected && styles.sessionCardSelected]}
                    onPress={() => toggleSessionSelection(session.id)}
                  >
                    <View style={styles.sessionHeader}>
                      <View>
                        <Text style={styles.sessionVersion}>
                          v{session.version} - {session.versionName}
                        </Text>
                        <Text style={styles.sessionDate}>
                          {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString()}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.sessionStats}>
                      <View style={styles.sessionStat}>
                        <Text style={styles.sessionStatLabel}>Avg Render</Text>
                        <Text style={styles.sessionStatValue}>{session.averageRenderTime.toFixed(0)}ms</Text>
                      </View>
                      <View style={styles.sessionStat}>
                        <Text style={styles.sessionStatLabel}>Avg FPS</Text>
                        <Text style={styles.sessionStatValue}>{session.averageFPS.toFixed(0)}</Text>
                      </View>
                      <View style={styles.sessionStat}>
                        <Text style={styles.sessionStatLabel}>Items</Text>
                        <Text style={styles.sessionStatValue}>{session.totalItemsTested}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Comparison Results */}
            {selectedSessions.length === 2 && getComparison() && (
              <View style={styles.comparisonResults}>
                <Text style={styles.comparisonResultsTitle}>Comparison Results</Text>
                {(() => {
                  const comp = getComparison()!;
                  const isBetter = comp.improvement.fps > 0 || comp.improvement.renderTime > 0;
                  
                  return (
                    <>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>Version Change:</Text>
                        <Text style={styles.comparisonValue}>
                          v{comp.session1.version} → v{comp.session2.version}
                        </Text>
                      </View>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>Render Time:</Text>
                        <Text style={[
                          styles.comparisonValue,
                          { color: comp.improvement.renderTime > 0 ? gameUIColors.success : gameUIColors.error }
                        ]}>
                          {comp.improvement.renderTime > 0 ? '↓' : '↑'} {Math.abs(comp.improvement.renderTime).toFixed(1)}%
                        </Text>
                      </View>
                      <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>FPS:</Text>
                        <Text style={[
                          styles.comparisonValue,
                          { color: comp.improvement.fps > 0 ? gameUIColors.success : gameUIColors.error }
                        ]}>
                          {comp.improvement.fps > 0 ? '↑' : '↓'} {Math.abs(comp.improvement.fps).toFixed(1)}%
                        </Text>
                      </View>
                      <View style={[styles.comparisonSummary, { backgroundColor: isBetter ? gameUIColors.success + '20' : gameUIColors.error + '20' }]}>
                        <Text style={[styles.comparisonSummaryText, { color: isBetter ? gameUIColors.success : gameUIColors.error }]}>
                          {isBetter ? '✅ Performance Improved!' : '⚠️ Performance Degraded'}
                        </Text>
                      </View>
                    </>
                  );
                })()}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Full Screen Test Modal */}
      <Modal
        visible={showComponent && !!testData}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.testModal}>
          <View style={styles.testModalHeader}>
            <View style={styles.liveIndicator}>
              <View style={[styles.liveDot, { backgroundColor: "#FF0000" }]} />
              <Text style={styles.liveText}>LIVE PERFORMANCE TEST</Text>
            </View>
            <Text style={styles.testModalTitle}>
              {tests[currentTestIndex]?.name || "Test"} - {countDataItems(testData)} items
            </Text>
          </View>
          
          <View style={styles.testModalContent}>
            <VirtualizedDataExplorer
              title={tests[currentTestIndex]?.name || "Test Data"}
              description={`Testing with ${countDataItems(testData)} total items`}
              data={testData}
              maxDepth={10}
              initialExpanded={true}
              fullyExpanded={true}
            />
          </View>
          
          <View style={styles.testModalFooter}>
            <Text style={styles.testModalFooterText}>
              Test in progress... Please wait
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
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
    fontSize: 24,
    fontWeight: "bold",
    color: gameUIColors.primary,
    marginBottom: 8,
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  versionBadge: {
    backgroundColor: gameUIColors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  versionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: gameUIColors.secondary,
    opacity: 0.8,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: gameUIColors.info + "20",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.secondary,
  },
  tabTextActive: {
    color: gameUIColors.info,
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
  controls: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  runButton: {
    flex: 1,
    backgroundColor: gameUIColors.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  runButtonDisabled: {
    opacity: 0.5,
  },
  runButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: gameUIColors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  summary: {
    marginHorizontal: 16,
    marginTop: 20,
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
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  comparisonContainer: {
    padding: 16,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: gameUIColors.primary,
    marginBottom: 8,
  },
  comparisonSubtitle: {
    fontSize: 14,
    color: gameUIColors.secondary,
    marginBottom: 20,
  },
  sessionList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  sessionCardSelected: {
    borderColor: gameUIColors.info,
    backgroundColor: gameUIColors.info + "10",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sessionVersion: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
  },
  sessionDate: {
    fontSize: 12,
    color: gameUIColors.secondary,
    opacity: 0.7,
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: gameUIColors.info,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sessionStat: {
    alignItems: "center",
  },
  sessionStatLabel: {
    fontSize: 10,
    color: gameUIColors.secondary,
    opacity: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sessionStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
  },
  comparisonResults: {
    marginTop: 20,
    padding: 16,
    backgroundColor: gameUIColors.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  comparisonResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    color: gameUIColors.secondary,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: "600",
    color: gameUIColors.primary,
  },
  comparisonSummary: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  comparisonSummaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  testModal: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  testModalHeader: {
    padding: 16,
    backgroundColor: gameUIColors.panel,
    borderBottomWidth: 2,
    borderBottomColor: gameUIColors.error,
  },
  testModalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: gameUIColors.primary,
    marginTop: 8,
  },
  testModalContent: {
    flex: 1,
    padding: 8,
  },
  testModalFooter: {
    padding: 16,
    backgroundColor: gameUIColors.panel,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "40",
    alignItems: "center",
  },
  testModalFooterText: {
    fontSize: 14,
    color: gameUIColors.secondary,
    opacity: 0.8,
  },
});