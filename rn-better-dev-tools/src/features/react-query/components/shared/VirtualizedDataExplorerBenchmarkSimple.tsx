/**
 * Simple Performance Benchmark for VirtualizedDataExplorer
 * 
 * This component actually renders and tests the VirtualizedDataExplorer
 * with visual feedback during testing.
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { VirtualizedDataExplorer } from "./VirtualizedDataExplorerRefactored";

// Test data generators
const generateSmallData = () => ({
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    nested: {
      deep: "value"
    }
  },
  hobbies: ["reading", "gaming", "coding"],
});

const generateMediumData = () => {
  const data: any = {};
  for (let i = 0; i < 100; i++) {
    data[`item_${i}`] = {
      id: i,
      value: `Value ${i}`,
      nested: {
        data: Math.random(),
      }
    };
  }
  return data;
};

const generateLargeData = () => {
  return Array(500).fill(0).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random(),
    timestamp: Date.now(),
  }));
};

interface TestResult {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: "pending" | "running" | "complete";
}

export const VirtualizedDataExplorerBenchmarkSimple: React.FC = () => {
  console.log("🚀 VirtualizedDataExplorerBenchmarkSimple MOUNTED");
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [testData, setTestData] = useState<any>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const tests = [
    { name: "Small Data", generator: generateSmallData },
    { name: "Medium Data", generator: generateMediumData },
    { name: "Large Data", generator: generateLargeData },
  ];
  
  console.log("📊 Current state:", {
    isRunning,
    currentTest,
    hasTestData: !!testData,
    resultsCount: results.length,
    progress,
  });

  const runTests = useCallback(async () => {
    console.log("🔥 runTests called, isRunning:", isRunning);
    if (isRunning) {
      console.log("⚠️ Already running, skipping");
      return;
    }
    
    try {
      console.log("✅ Starting tests");
      setIsRunning(true);
      setResults([]);
      setProgress(0);
      setCurrentTestIndex(0);

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`🧪 Starting test ${i + 1}/${tests.length}: ${test.name}`);
        
        setCurrentTest(test.name);
        setCurrentTestIndex(i);
        setProgress((i / tests.length) * 100);
        
        // Create result entry
        const result: TestResult = {
          name: test.name,
          startTime: Date.now(),
          endTime: 0,
          duration: 0,
          status: "running",
        };
        
        setResults(prev => {
          console.log(`📝 Adding result for ${test.name}`);
          return [...prev, result];
        });
        
        // Generate and show the data
        console.log(`🔄 Generating data for ${test.name}`);
        const data = test.generator();
        console.log(`📦 Data generated, size:`, Array.isArray(data) ? data.length : Object.keys(data).length);
        setTestData(data);
        
        // Wait for render and interaction
        console.log(`⏳ Waiting 2 seconds for render...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Complete the test
        result.endTime = Date.now();
        result.duration = result.endTime - result.startTime;
        result.status = "complete";
        
        setResults(prev => {
          const newResults = [...prev];
          newResults[i] = result;
          console.log(`✅ Updated result for ${test.name}: ${result.duration}ms`);
          return newResults;
        });
        
        // Clear data and wait before next test
        setTestData(null);
        console.log(`🔄 Cleared data, waiting 500ms before next test`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setProgress(100);
      setCurrentTest("");
      setIsRunning(false);
      console.log("🎉 All tests complete!");
    } catch (error) {
      console.error("❌ Error during tests:", error);
      setIsRunning(false);
      setCurrentTest("");
      setTestData(null);
    }
  }, [isRunning]);

  console.log("🎨 Rendering component");
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>VirtualizedDataExplorer Test</Text>
          <Text style={styles.subtitle}>
            Visual performance testing with real component rendering
          </Text>
        </View>

        {/* Controls */}
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Testing..." : "Run Tests"}
          </Text>
        </TouchableOpacity>

        {/* Progress */}
        {isRunning && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Testing: {currentTest} ({currentTestIndex + 1}/{tests.length})
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {/* Results */}
        {results.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Test Results</Text>
            {results.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    result.status === "complete" ? styles.statusComplete : 
                    result.status === "running" ? styles.statusRunning : 
                    styles.statusPending
                  ]}>
                    <Text style={styles.statusText}>
                      {result.status === "complete" ? "✓" : 
                       result.status === "running" ? "..." : ""}
                    </Text>
                  </View>
                </View>
                {result.status === "complete" && (
                  <Text style={styles.resultDuration}>
                    Duration: {result.duration}ms
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Live Component Display */}
        {testData && (
          <View style={styles.componentContainer}>
            <View style={styles.componentHeader}>
              <Text style={styles.componentTitle}>
                🔴 LIVE: {currentTest}
              </Text>
            </View>
            <View style={styles.componentWrapper}>
              <VirtualizedDataExplorer
                title={currentTest}
                description="Testing performance..."
                data={testData}
                maxDepth={10}
                initialExpanded={true}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
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
    color: "#F8FAFC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  progressText: {
    color: "#F8FAFC",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1E293B",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  results: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: "#1E293B",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  resultDuration: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusComplete: {
    backgroundColor: "#10B981",
  },
  statusRunning: {
    backgroundColor: "#F59E0B",
  },
  statusPending: {
    backgroundColor: "#64748B",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  componentContainer: {
    margin: 20,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  componentHeader: {
    backgroundColor: "#EF4444",
    padding: 12,
  },
  componentTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  componentWrapper: {
    padding: 16,
    maxHeight: 400,
  },
});