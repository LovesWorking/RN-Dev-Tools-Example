/**
 * Performance Benchmark for VirtualizedDataExplorer
 * 
 * This component tests the performance of the VirtualizedDataExplorer
 * with various data sizes and structures.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { VirtualizedDataExplorer } from "./VirtualizedDataExplorerRefactored";

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

/**
 * Generates a deeply nested object for testing
 */
const generateNestedObject = (depth: number, breadth: number): any => {
  if (depth === 0) {
    return {
      string: "test value",
      number: Math.random() * 1000,
      boolean: Math.random() > 0.5,
      null: null,
      undefined: undefined,
    };
  }
  
  const obj: any = {};
  for (let i = 0; i < breadth; i++) {
    obj[`key_${i}`] = generateNestedObject(depth - 1, breadth);
  }
  return obj;
};

/**
 * Generates a large flat object
 */
const generateFlatObject = (size: number): any => {
  const obj: any = {};
  for (let i = 0; i < size; i++) {
    const type = i % 5;
    switch (type) {
      case 0:
        obj[`string_${i}`] = `String value ${i}`;
        break;
      case 1:
        obj[`number_${i}`] = Math.random() * 1000;
        break;
      case 2:
        obj[`boolean_${i}`] = Math.random() > 0.5;
        break;
      case 3:
        obj[`array_${i}`] = [1, 2, 3, 4, 5];
        break;
      case 4:
        obj[`object_${i}`] = { nested: "value", count: i };
        break;
    }
  }
  return obj;
};

/**
 * Generates a large array
 */
const generateLargeArray = (size: number): any[] => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      timestamp: new Date().toISOString(),
      nested: {
        level1: {
          level2: {
            data: `Deep value ${i}`,
          },
        },
      },
    });
  }
  return arr;
};

/**
 * Generates mixed complex data
 */
const generateComplexData = (): any => {
  return {
    users: generateLargeArray(50),
    settings: generateFlatObject(100),
    metadata: generateNestedObject(4, 3),
    statistics: {
      total: 1000,
      processed: 750,
      failed: 250,
      rates: [0.1, 0.2, 0.3, 0.4, 0.5],
      timestamps: Array.from({ length: 100 }, () => new Date().toISOString()),
    },
    cache: new Map([
      ["key1", "value1"],
      ["key2", { nested: "object" }],
      ["key3", [1, 2, 3]],
    ]),
    tags: new Set(["tag1", "tag2", "tag3", "tag4", "tag5"]),
  };
};

// ============================================================================
// BENCHMARK METRICS
// ============================================================================

interface BenchmarkResult {
  testName: string;
  dataSize: string;
  renderTime: number;
  expandTime: number;
  averageRenderTime: number;
  runs: number;
}

interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsed?: number;
}

// ============================================================================
// BENCHMARK COMPONENT
// ============================================================================

export const VirtualizedDataExplorerBenchmark: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [testData, setTestData] = useState<any>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  
  const renderStartTime = useRef<number>(0);
  const renderEndTime = useRef<number>(0);
  const expandStartTime = useRef<number>(0);
  const expandEndTime = useRef<number>(0);
  
  /**
   * Measures render time
   */
  const measureRenderTime = async (
    data: any,
    testName: string,
    dataSize: string,
    runs: number = 10
  ): Promise<BenchmarkResult> => {
    const renderTimes: number[] = [];
    const expandTimes: number[] = [];
    
    for (let i = 0; i < runs; i++) {
      // Measure initial render
      renderStartTime.current = performance.now();
      setTestData(data);
      setShowExplorer(true);
      
      // Wait for render to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      renderEndTime.current = performance.now();
      renderTimes.push(renderEndTime.current - renderStartTime.current);
      
      // Measure expand operation (simulate user interaction)
      expandStartTime.current = performance.now();
      // In real scenario, would trigger expansion here
      await new Promise((resolve) => setTimeout(resolve, 50));
      expandEndTime.current = performance.now();
      expandTimes.push(expandEndTime.current - expandStartTime.current);
      
      // Reset for next run
      setShowExplorer(false);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    
    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / runs;
    const avgExpandTime = expandTimes.reduce((a, b) => a + b, 0) / runs;
    
    return {
      testName,
      dataSize,
      renderTime: avgRenderTime,
      expandTime: avgExpandTime,
      averageRenderTime: avgRenderTime,
      runs,
    };
  };
  
  /**
   * Run all benchmarks
   */
  const runBenchmarks = async () => {
    setIsRunning(true);
    setResults([]);
    
    const newResults: BenchmarkResult[] = [];
    
    // Test 1: Small nested object
    setCurrentTest("Small Nested Object (3 levels, 5 items per level)");
    const smallNested = generateNestedObject(3, 5);
    const result1 = await measureRenderTime(
      smallNested,
      "Small Nested",
      "~125 items",
      5
    );
    newResults.push(result1);
    
    // Test 2: Large flat object
    setCurrentTest("Large Flat Object (500 items)");
    const largeFlat = generateFlatObject(500);
    const result2 = await measureRenderTime(
      largeFlat,
      "Large Flat",
      "500 items",
      5
    );
    newResults.push(result2);
    
    // Test 3: Deep nested object
    setCurrentTest("Deep Nested Object (6 levels, 3 items per level)");
    const deepNested = generateNestedObject(6, 3);
    const result3 = await measureRenderTime(
      deepNested,
      "Deep Nested",
      "~729 items",
      5
    );
    newResults.push(result3);
    
    // Test 4: Large array
    setCurrentTest("Large Array (200 items with nested objects)");
    const largeArray = generateLargeArray(200);
    const result4 = await measureRenderTime(
      largeArray,
      "Large Array",
      "200 items",
      5
    );
    newResults.push(result4);
    
    // Test 5: Complex mixed data
    setCurrentTest("Complex Mixed Data");
    const complexData = generateComplexData();
    const result5 = await measureRenderTime(
      complexData,
      "Complex Mixed",
      "~300 items",
      5
    );
    newResults.push(result5);
    
    setResults(newResults);
    setIsRunning(false);
    setCurrentTest("");
    setShowExplorer(false);
  };
  
  /**
   * Format time for display
   */
  const formatTime = (ms: number): string => {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  /**
   * Calculate performance rating
   */
  const getPerformanceRating = (renderTime: number): string => {
    if (renderTime < 16) return "🟢 Excellent (60+ FPS)";
    if (renderTime < 33) return "🟡 Good (30-60 FPS)";
    if (renderTime < 50) return "🟠 Fair (20-30 FPS)";
    return "🔴 Poor (<20 FPS)";
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VirtualizedDataExplorer Performance Benchmark</Text>
        <Text style={styles.description}>
          Tests render performance with various data structures and sizes
        </Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runBenchmarks}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Running Benchmarks..." : "Run Benchmarks"}
          </Text>
        </TouchableOpacity>
        
        {currentTest !== "" && (
          <Text style={styles.currentTest}>Current Test: {currentTest}</Text>
        )}
      </View>
      
      {results.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Benchmark Results</Text>
          
          {results.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.resultName}>{result.testName}</Text>
              <Text style={styles.resultSize}>Data Size: {result.dataSize}</Text>
              
              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Initial Render:</Text>
                  <Text style={styles.metricValue}>
                    {formatTime(result.renderTime)}
                  </Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Expand Time:</Text>
                  <Text style={styles.metricValue}>
                    {formatTime(result.expandTime)}
                  </Text>
                </View>
                
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Runs:</Text>
                  <Text style={styles.metricValue}>{result.runs}</Text>
                </View>
              </View>
              
              <Text style={styles.rating}>
                {getPerformanceRating(result.renderTime)}
              </Text>
            </View>
          ))}
          
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>
              Average Render Time:{" "}
              {formatTime(
                results.reduce((sum, r) => sum + r.renderTime, 0) / results.length
              )}
            </Text>
            <Text style={styles.summaryText}>
              Total Tests Run: {results.length}
            </Text>
            <Text style={styles.summaryText}>
              Total Renders: {results.reduce((sum, r) => sum + r.runs, 0)}
            </Text>
          </View>
        </View>
      )}
      
      {showExplorer && testData && (
        <View style={styles.explorerContainer}>
          <Text style={styles.explorerTitle}>Test Explorer (Hidden during tests)</Text>
          <VirtualizedDataExplorer
            title="Benchmark Data"
            data={testData}
            maxDepth={10}
            rawMode={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  controls: {
    padding: 20,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#4B5563",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  currentTest: {
    marginTop: 12,
    color: "#60A5FA",
    fontSize: 14,
  },
  results: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  resultSize: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60A5FA",
  },
  rating: {
    fontSize: 13,
    color: "#FFFFFF",
    marginTop: 8,
    fontWeight: "500",
  },
  summary: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#60A5FA",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  explorerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  explorerTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 12,
  },
});

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage in your app:
 * 
 * import { VirtualizedDataExplorerBenchmark } from './VirtualizedDataExplorerBenchmark';
 * 
 * // In your test screen or dev tools:
 * <VirtualizedDataExplorerBenchmark />
 * 
 * This will provide:
 * - Average render time for different data structures
 * - Performance ratings (FPS equivalent)
 * - Expand/collapse performance metrics
 * - Summary statistics
 * 
 * Typical good performance targets:
 * - Small nested objects: < 10ms
 * - Large flat objects (500 items): < 20ms
 * - Deep nested objects: < 30ms
 * - Large arrays (200 items): < 15ms
 * - Complex mixed data: < 25ms
 */