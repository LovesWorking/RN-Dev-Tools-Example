/**
 * Modal Performance Comparison - All Variants
 *
 * Tests all modal versions with performance benchmarks:
 *
 * 1. ClaudeModal - Current default implementation
 * 2. ClaudeModalOriginal - The unoptimized baseline
 * 3. ClaudeModalPure - Pure component version with stable callbacks
 * 4. ClaudeModal60FPSClean - 60FPS optimized with separated animations
 * 5. ThemedClaudeModal - Theme-aware wrapper with effects
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  ToastAndroid,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import ClaudeModal from "./ClaudeModal";
// import ClaudeModalOriginal from "./ClaudeModalOriginal";
// import ClaudeModalPure from "./ClaudeModalPure";
import ClaudeModal60FPSClean from "./ClaudeModal60FPSClean";
import Modal60fpsTest from "./Modal60fpsTest";
// import { ThemedClaudeModal } from "./ThemedClaudeModal";
import { VirtualizedDataExplorerBenchmarkFull } from "@/rn-better-dev-tools/src/features/react-query/components/shared/VirtualizedDataExplorerBenchmarkFull";
import { JSFPSMonitor, JSFPSResult } from "./utils/JSFPSMonitor";
import { mobileFPSMonitor, FPSMetrics, JankEvent } from "./utils/MobileFPSMonitor";
import { nativeFrameTracker, FrameMetrics as NativeFrameMetrics } from "./utils/NativeFrameMetrics";
import { renderTracker } from "./utils/ComponentRenderTracker";
import { useRenderTracking } from "./utils/useRenderTracking";
import { memoryProfiler } from "./utils/MemoryProfiler";
import { ProfiledComponent, profilerStore } from "./utils/ReactProfilerIntegration";
import { PerformanceMeasureView, useStartProfiler } from "@shopify/react-native-performance";
import { RegressionAnalyzer, RegressionAnalysis } from "./utils/RegressionAnalyzer";
import { productionMonitor, ProductionMetrics, PerformanceReport } from "./utils/ProductionPerformanceMonitor";
import { PerformanceReportExporter, DetailedPerformanceReport } from "./utils/PerformanceReportExporter";
import automatedTester, { ModalType as AutoTestModalType } from "./utils/AutomatedPerformanceTester";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ModalType = "60fps" | "60fpsTest" | "claude" | "original" | "pure" | "optimized" | "themed" | "ultraOptimized";

interface BenchmarkResult {
  id: string; // Unique ID for each test run
  modalType: ModalType;
  fpsData: JSFPSResult;
  mobileFPSData?: FPSMetrics;
  nativeFrameMetrics?: NativeFrameMetrics; // New native frame metrics
  jankEvents?: JankEvent[];
  duration: number;
  timestamp: number;
  timingData?: Record<string, number>; // Direct timing measurements
  renderMetrics?: {
    mountTime?: number;
    updateCount: number;
    averageUpdateTime: number;
    totalRenderTime: number;
    profilerData?: {
      actualDuration: number;
      baseDuration: number;
      worstCase: number;
      bestCase: number;
      renderCount: number;
    };
  };
  memoryMetrics?: {
    baselineMemoryMB: number;
    peakMemoryMB: number;
    finalMemoryMB: number;
    memoryGrowthMB: number;
    leaksDetected: number;
    allocations: number;
    deallocations: number;
  };
  shopifyMetrics?: {
    loadingTimeMs?: number;  // Time for loading render pass
    interactiveTimeMs?: number;  // Time to Interactive (TTI)
    flowInstanceId?: string;  // Unique flow ID
    renderPasses?: number;  // Total number of render passes
    loadingPasses?: number;  // Number of loading render passes
    interactivePasses?: number;  // Number of interactive render passes
    touchEventProcessingMs?: number;  // Time to process touch events
    isColdStart?: boolean;  // Whether this was a cold start (first open)
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
    case "60fps":
      return "ClaudeModal60FPSClean";
    case "60fpsTest":
      return "Modal60fpsTest";
    default:
      return type;
  }
};

// Evaluate a metric against budget thresholds
const evaluateMetric = (value: number | undefined, budgetKey: keyof typeof PERFORMANCE_BUDGETS, inverse: boolean = false): 'excellent' | 'good' | 'acceptable' | 'poor' | 'unknown' => {
  if (value === undefined || value === null) return 'unknown';
  
  const budget = PERFORMANCE_BUDGETS[budgetKey];
  
  if (inverse) {
    // For metrics where lower is better (TTI, jank, memory, mount)
    if (value <= budget.excellent) return 'excellent';
    if (value <= budget.good) return 'good';
    if (value <= budget.acceptable) return 'acceptable';
    return 'poor';
  } else {
    // For metrics where higher is better (FPS)
    if (value >= budget.excellent) return 'excellent';
    if (value >= budget.good) return 'good';
    if (value >= budget.acceptable) return 'acceptable';
    return 'poor';
  }
};

// Get color for budget evaluation
const getBudgetColor = (evaluation: 'excellent' | 'good' | 'acceptable' | 'poor' | 'unknown') => {
  switch (evaluation) {
    case 'excellent': return '#10B981'; // Bright green
    case 'good': return '#34D399';      // Light green  
    case 'acceptable': return '#F59E0B'; // Yellow
    case 'poor': return '#EF4444';      // Red
    case 'unknown': return '#6B7280';   // Gray
  }
};

// Calculate overall performance grade
const calculatePerformanceGrade = (result: BenchmarkResult): { grade: string, color: string, score: number } => {
  let totalScore = 0;
  let metrics = 0;
  
  // TTI (30% weight)
  const ttiValue = result.shopifyMetrics?.interactiveTimeMs;
  if (ttiValue !== undefined) {
    const ttiEval = evaluateMetric(ttiValue, 'tti', true);
    totalScore += (ttiEval === 'excellent' ? 100 : ttiEval === 'good' ? 85 : ttiEval === 'acceptable' ? 70 : 40) * 0.3;
    metrics++;
  }
  
  // FPS (25% weight) - prioritize native frame metrics
  const fpsValue = result.nativeFrameMetrics?.averageFPS || result.mobileFPSData?.averageFPS || result.fpsData.averageFPS;
  if (fpsValue !== undefined) {
    const fpsEval = evaluateMetric(fpsValue, 'fps', false);
    totalScore += (fpsEval === 'excellent' ? 100 : fpsEval === 'good' ? 85 : fpsEval === 'acceptable' ? 70 : 40) * 0.25;
    metrics++;
  }
  
  // Jank (20% weight) - prioritize native dropped frames
  const jankValue = result.nativeFrameMetrics?.droppedFrames || result.mobileFPSData?.jankCount;
  if (jankValue !== undefined) {
    const jankEval = evaluateMetric(jankValue, 'jank', true);
    totalScore += (jankEval === 'excellent' ? 100 : jankEval === 'good' ? 85 : jankEval === 'acceptable' ? 70 : 40) * 0.2;
    metrics++;
  }
  
  // Memory (15% weight)
  const memoryValue = result.memoryMetrics?.memoryGrowthMB;
  if (memoryValue !== undefined) {
    const memEval = evaluateMetric(Math.abs(memoryValue), 'memory', true);
    totalScore += (memEval === 'excellent' ? 100 : memEval === 'good' ? 85 : memEval === 'acceptable' ? 70 : 40) * 0.15;
    metrics++;
  }
  
  // Mount Time (10% weight)
  const mountValue = result.shopifyMetrics?.loadingTimeMs || result.renderMetrics?.mountTime;
  if (mountValue !== undefined) {
    const mountEval = evaluateMetric(mountValue, 'mountTime', true);
    totalScore += (mountEval === 'excellent' ? 100 : mountEval === 'good' ? 85 : mountEval === 'acceptable' ? 70 : 40) * 0.1;
    metrics++;
  }
  
  const finalScore = metrics > 0 ? totalScore : 0;
  
  let grade: string;
  let color: string;
  
  if (finalScore >= 90) {
    grade = 'A+';
    color = '#10B981';
  } else if (finalScore >= 85) {
    grade = 'A';
    color = '#34D399';
  } else if (finalScore >= 80) {
    grade = 'B+';
    color = '#86EFAC';
  } else if (finalScore >= 75) {
    grade = 'B';
    color = '#A3E635';
  } else if (finalScore >= 70) {
    grade = 'C+';
    color = '#FDE047';
  } else if (finalScore >= 65) {
    grade = 'C';
    color = '#F59E0B';
  } else if (finalScore >= 60) {
    grade = 'D';
    color = '#FB923C';
  } else {
    grade = 'F';
    color = '#EF4444';
  }
  
  return { grade, color, score: Math.round(finalScore) };
};

// Create tracked versions of modals with render performance monitoring




const TrackedClaudeModal60FPSClean = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('ClaudeModal60FPSClean');
  const [isInteractive, setIsInteractive] = useState(false);
  
  // Mark as interactive after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsInteractive(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PerformanceMeasureView
      screenName="ClaudeModal60FPSClean"
      interactive={isInteractive}
      componentInstanceId="claude-modal-60fps-perf"
    >
      <ProfiledComponent id="ClaudeModal60FPSClean">
        <ClaudeModal60FPSClean {...props} ref={ref} />
      </ProfiledComponent>
    </PerformanceMeasureView>
  );
});

const TrackedModal60fpsTest = React.forwardRef((props: any, ref: any) => {
  useRenderTracking('Modal60fpsTest');
  const [isInteractive, setIsInteractive] = useState(false);
  
  // Mark as interactive after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsInteractive(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PerformanceMeasureView
      screenName="Modal60fpsTest"
      interactive={isInteractive}
      componentInstanceId="modal-60fps-test-perf"
    >
      <ProfiledComponent id="Modal60fpsTest">
        <Modal60fpsTest {...props} ref={ref} />
      </ProfiledComponent>
    </PerformanceMeasureView>
  );
});





// Configuration flags for testing
const AUTO_RUN_COMPARISON = false; // Set to true to auto-start tests on mount
const AUTO_RUN_DELAY = 2000; // Delay before auto-starting (ms)
const AUTO_RUN_OPTIMIZATION_TEST = false; // Auto-run Pure vs UltraOptimized test
const OPTIMIZATION_TEST_DELAY = 3000; // Delay before running optimization test
const AUTO_TEST_60FPS = false; // Auto-test 60FPS modal on mount
const AUTO_TEST_60FPS_DELAY = 2000; // Delay before auto-testing 60FPS

// Performance Budgets - Define what "good" performance looks like
const PERFORMANCE_BUDGETS = {
  tti: {
    excellent: 100,    // < 100ms = excellent (green)
    good: 200,        // < 200ms = good (light green)
    acceptable: 500,  // < 500ms = acceptable (yellow)
    // > 500ms = poor (red)
  },
  fps: {
    excellent: 58,    // 58-60 FPS = excellent
    good: 50,        // 50+ FPS = good
    acceptable: 30,  // 30+ FPS = acceptable
    // < 30 FPS = poor
  },
  jank: {
    excellent: 2,    // <= 2 janks = excellent
    good: 5,        // <= 5 janks = good
    acceptable: 10, // <= 10 janks = acceptable
    // > 10 janks = poor
  },
  memory: {
    excellent: 1,    // < 1MB growth = excellent
    good: 3,        // < 3MB growth = good
    acceptable: 5,  // < 5MB growth = acceptable
    // > 5MB = poor
  },
  mountTime: {
    excellent: 16,   // < 16ms (1 frame) = excellent
    good: 50,       // < 50ms = good
    acceptable: 100, // < 100ms = acceptable
    // > 100ms = poor
  },
  touchEvent: {
    excellent: 8,    // < 8ms = excellent (half frame)
    good: 16,       // < 16ms = good (1 frame)
    acceptable: 32, // < 32ms = acceptable (2 frames)
    // > 32ms = poor
  }
};

export const ModalPerformanceComparison: React.FC = () => {
  // Track this component's renders
  useRenderTracking('ModalPerformanceComparison');
  
  const [activeTab, setActiveTab] = useState<"modals" | "lists">("modals");
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType | "none">("none");
  const [currentFps, setCurrentFps] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testMode, setTestMode] = useState<"floating" | "bottomSheet">("bottomSheet");
  
  const [regressionAnalysis, setRegressionAnalysis] = useState<Map<ModalType, RegressionAnalysis>>(new Map());
  const [showRegressionDetails, setShowRegressionDetails] = useState(false);
  const [productionMode, setProductionMode] = useState(false);
  const [productionReport, setProductionReport] = useState<PerformanceReport | null>(null);
  const [showProductionReport, setShowProductionReport] = useState(false);
  const [detailedReport, setDetailedReport] = useState<DetailedPerformanceReport | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [automatedTestRunning, setAutomatedTestRunning] = useState(false);
  const modalRunIdRef = useRef(0); // Add unique run ID counter for each modal instance
  
  // Store Shopify Performance reports for current modal
  const shopifyReportsRef = useRef<Map<string, any[]>>(new Map());
  const currentFlowIdRef = useRef<string | null>(null);
  
  // Track cold vs warm starts - first open of each modal is cold
  const modalOpenCountRef = useRef<Map<ModalType, number>>(new Map());
  
  // Shopify Performance profiler - single instance for all modals
  // useStartProfiler returns the startProfiler function directly
  const startProfiler = useStartProfiler();

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

  // Refs for resize simulation to stress test performance
  const resizeHeightRef = useRef(400);
  const resizeDirectionRef = useRef(1); // 1 for up, -1 for down
  const resizeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Create separate Animated.Values for each modal to prevent interference
  const modal60fpsHeightRef = useRef<Animated.Value | null>(null);
  const modal60fpsTestHeightRef = useRef<Animated.Value | null>(null);
  
  if (!modal60fpsHeightRef.current) {
    modal60fpsHeightRef.current = new Animated.Value(400);
  }
  if (!modal60fpsTestHeightRef.current) {
    modal60fpsTestHeightRef.current = new Animated.Value(400);
  }
  
  // Get the appropriate height ref for the active modal
  const getModalHeightRef = (modalType: string) => {
    if (modalType === "60fps") return modal60fpsHeightRef.current;
    if (modalType === "60fpsTest") return modal60fpsTestHeightRef.current;
    return null;
  };

  // Create resize simulation for stress testing
  const runResizeSimulation = useCallback(() => {
    console.log('Starting resize simulation...');
    // Clear any existing interval
    if (resizeIntervalRef.current) {
      clearInterval(resizeIntervalRef.current);
    }
    
    // Reset initial values
    resizeHeightRef.current = 400;
    resizeDirectionRef.current = 1;
    
    // Simulate resizing up and down rapidly
    resizeIntervalRef.current = setInterval(() => {
      // Update height with larger steps for more stress
      resizeHeightRef.current += resizeDirectionRef.current * 15; // Move 15px at a time
      
      // Reverse direction at bounds
      if (resizeHeightRef.current >= 600) {
        resizeHeightRef.current = 600;
        resizeDirectionRef.current = -1;
      } else if (resizeHeightRef.current <= 200) {
        resizeHeightRef.current = 200;
        resizeDirectionRef.current = 1;
      }
      
      // Update the animated value for the currently active modal
      const heightRef = getModalHeightRef(activeModal);
      if (heightRef) {
        heightRef.setValue(resizeHeightRef.current);
      }
    }, 16); // ~60fps for smooth resize simulation
  }, [activeModal, getModalHeightRef]);
  
  const stopResizeSimulation = useCallback(() => {
    console.log('Stopping resize simulation...');
    if (resizeIntervalRef.current) {
      clearInterval(resizeIntervalRef.current);
      resizeIntervalRef.current = null;
    }
    // Reset to default height
    resizeHeightRef.current = 400;
    // Reset both modal heights
    if (modal60fpsHeightRef.current) {
      modal60fpsHeightRef.current.setValue(400);
    }
    if (modal60fpsTestHeightRef.current) {
      modal60fpsTestHeightRef.current.setValue(400);
    }
  }, []);

  // Initialize FPS monitor on mount
  useEffect(() => {
    fpsMonitorRef.current = new JSFPSMonitor();
    
    // Initialize production monitoring with callback
    productionMonitor.initialize({
      enabled: false, // Start disabled
      samplingRate: 1.0, // 100% sampling in dev
      reportCallback: (report) => {
        setProductionReport(report);
        console.log('📊 Production Report Generated:', {
          events: report.metrics.totalEvents,
          avgFPS: report.metrics.avgFPS.toFixed(1),
          avgTTI: report.metrics.avgTTI.toFixed(0),
          issues: report.metrics.performanceIssues,
        });
      },
      autoReport: true,
    });
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      productionMonitor.stop();
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
    async (modalType: ModalType) => {
      
      // Increment run ID for unique modal keys
      modalRunIdRef.current += 1;

      // Track cold vs warm start
      const currentOpenCount = modalOpenCountRef.current.get(modalType) || 0;
      const isColdStart = currentOpenCount === 0;
      modalOpenCountRef.current.set(modalType, currentOpenCount + 1);
      
      console.log(`📊 ${isColdStart ? '❄️ COLD START' : '🔥 WARM START'} - Open count: ${currentOpenCount + 1}`);

      // Clear previous render metrics for this modal
      const componentName = getModalName(modalType);
      
      try {
        renderTracker.clearMetrics(componentName);
        
        // Clear React Profiler metrics
        profilerStore.clearMetrics(componentName);
        
        // Start memory profiling
        memoryProfiler.startProfiling(componentName);
      } catch (error) {
        console.error(`❌ Error clearing metrics:`, error);
      }
      
      // Update AsyncStorage to ensure modal uses the correct mode and size
      const persistenceKey = `benchmark-${modalType}-modal`;
      const standardConfig = {
        mode: testMode,
        height: 0.9, // Standard height for testing
        isFloating: testMode === 'floating',
      };
      
      try {
        await AsyncStorage.setItem(persistenceKey, JSON.stringify(standardConfig));
      } catch (error) {
      }
      
      // Initialize FPS monitor if needed
      if (!fpsMonitorRef.current) {
        fpsMonitorRef.current = new JSFPSMonitor();
      }
      
      // Reset state
      startTimeRef.current = performance.now();
      setCurrentFps(0);
      setTestProgress(0);
      setIsRunning(true);
      
      // Start Shopify Performance profiler for the specific modal
      const sourceScreen = "ModalPerformanceComparison";
      let destinationScreen = "";
      let componentInstanceId = "";
      
      if (startProfiler && typeof startProfiler === 'function') {
        try {
          switch (modalType) {
            case "60fps":
              destinationScreen = "ClaudeModal60FPSClean";
              componentInstanceId = "claude-modal-60fps-perf";
              break;
            case "60fpsTest":
              destinationScreen = "Modal60fpsTest";
              componentInstanceId = "modal-60fps-test-perf";
              break;
          }
          
          startProfiler({
            source: sourceScreen,
          } as any);
          console.log(`✅ Shopify profiler started for ${destinationScreen}`);
        } catch (error) {
          console.error(`❌ Error starting Shopify profiler:`, error);
          // Continue anyway - we still want to show the modal even if profiling fails
        }
      } else {
        console.log(`⚠️ Shopify profiler not available - continuing without navigation tracking`);
      }
      
      // Track modal opening time
      timingRefs.current.modalOpenStart = performance.now();
      setActiveModal(modalType);
      
      // Track in production monitor if enabled
      if (productionMode) {
        const modalName = getModalName(modalType);
        // We'll track the navigation event after modal opens
        setTimeout(() => {
          productionMonitor.trackNavigation(modalName, 300, isColdStart);
        }, 350);
      }
      
      // Measure modal open time after animation
      setTimeout(() => {
        const modalOpenTime = performance.now() - timingRefs.current.modalOpenStart;
      }, 300); // Typical modal animation duration

      // Start FPS monitoring
      if (fpsMonitorRef.current) {
        timingRefs.current.fpsTrackingStart = performance.now();
        fpsMonitorRef.current.startTracking();
      }
      
      // Start Mobile FPS Monitor
      mobileFPSMonitor.reset();
      mobileFPSMonitor.start();
      
      // Start Native Frame Tracker for most accurate metrics
      nativeFrameTracker.start();

      // Start resize simulation
      timingRefs.current.animationsStart = performance.now();
      runResizeSimulation();

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
        
        // Update current FPS display
        if (fpsMonitorRef.current) {
          setCurrentFps(fpsMonitorRef.current.getCurrentFPS());
        }

        if (progress >= 100) {
          cleanup(); // Stop JS stress
          stopResizeSimulation(); // Stop resize simulation
          stopBenchmark(modalType);
        }
      }, 100) as unknown as number;
    },
    [runResizeSimulation, stopResizeSimulation, stressJSThread, testMode, startProfiler]
  );

  // Stop benchmark
  const stopBenchmark = useCallback(
    (modalType: ModalType) => {
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
      

      // Stop resize simulation
      stopResizeSimulation();

      // Get FPS statistics
      if (fpsMonitorRef.current) {
        const fpsData = fpsMonitorRef.current.stopAndGetData();
        const duration = performance.now() - startTimeRef.current;
        
        // Get Mobile FPS data
        const mobileFPSData = mobileFPSMonitor.stop();
        const jankEvents = mobileFPSMonitor.getJankEvents();
        
        // Get Native Frame Metrics (most accurate)
        const nativeFrameMetrics = nativeFrameTracker.stop();
        
        if (nativeFrameMetrics) {
          console.log(`  - Average FPS: ${nativeFrameMetrics.averageFPS}`);
          console.log(`  - Min/Max FPS: ${nativeFrameMetrics.minFPS}/${nativeFrameMetrics.maxFPS}`);
          console.log(`  - Dropped Frames: ${nativeFrameMetrics.droppedFrames}`);
          console.log(`  - Severe Drops: ${nativeFrameMetrics.severeDrops}`);
          console.log(`  - P95 Frame Time: ${nativeFrameMetrics.percentile95}ms`);
          console.log(`  - P99 Frame Time: ${nativeFrameMetrics.percentile99}ms`);
          console.log(`  - Jank Score: ${nativeFrameMetrics.jankScore}% (lower is better)`);
        }
        

        // Create timing data object with direct measurements
        const timingData: Record<string, number> = {
          'modal-open': 300, // We know this is ~300ms from setTimeout
          'animations-duration': animationsDuration,
          'stress-duration': stressDuration,
          'fps-tracking-duration': fpsTrackingDuration,
          'benchmark-total': duration
        };

        // Get render metrics for this modal
        const componentName = getModalName(modalType);
        const modalRenderMetrics = renderTracker.getMetrics(componentName);
        
        // Get React Profiler metrics
        const profilerMetrics = profilerStore.getMetrics(componentName);
        
        // Get Shopify Performance metrics from global storage
        let shopifyMetrics = undefined;
        if ((global as any).__performanceReports) {
          // Filter reports for this modal
          const modalReports = (global as any).__performanceReports.filter(
            (report: any) => report.destinationScreen === componentName
          );
          
          if (modalReports.length > 0) {
            // Find loading and interactive reports
            const loadingReports = modalReports.filter((r: any) => !r.interactive);
            const interactiveReports = modalReports.filter((r: any) => r.interactive);
            
            // Get first loading and interactive reports for timing
            const firstLoadingReport = loadingReports[0];
            const firstInteractiveReport = interactiveReports[0];
            
            // Find touch event processing time (it's usually in the first report)
            const touchEventTime = modalReports.find((r: any) => r.timeToConsumeTouchEventMillis)?.timeToConsumeTouchEventMillis;
            
            // Check if this was a cold start
            const openCount = modalOpenCountRef.current.get(modalType) || 1;
            const isColdStart = openCount === 1;
            
            shopifyMetrics = {
              loadingTimeMs: firstLoadingReport?.timeToRenderMillis,
              interactiveTimeMs: firstInteractiveReport?.timeToRenderMillis,
              flowInstanceId: modalReports[0]?.flowInstanceId,
              renderPasses: modalReports.length,
              loadingPasses: loadingReports.length,
              interactivePasses: interactiveReports.length,
              touchEventProcessingMs: touchEventTime,
              isColdStart,
            };
            
            console.log(`📊 Shopify metrics for ${componentName}:`, shopifyMetrics);
            console.log(`  - Total render passes: ${shopifyMetrics.renderPasses}`);
            console.log(`  - Loading passes: ${shopifyMetrics.loadingPasses}`);
            console.log(`  - Interactive passes: ${shopifyMetrics.interactivePasses}`);
            console.log(`  - Touch event processing: ${shopifyMetrics.touchEventProcessingMs}ms`);
            console.log(`  - Cold start: ${isColdStart ? '❄️ YES' : '🔥 NO'}`);
          }
        }
        
        let renderMetrics = undefined;
        if (modalRenderMetrics) {
          renderMetrics = {
            mountTime: modalRenderMetrics.mountTime,
            updateCount: modalRenderMetrics.updateCount,
            averageUpdateTime: modalRenderMetrics.averageUpdateTime,
            totalRenderTime: modalRenderMetrics.totalRenderTime,
            // Add React Profiler data if available
            profilerData: profilerMetrics ? {
              actualDuration: profilerMetrics.averageActualDuration,
              baseDuration: profilerMetrics.averageBaseDuration,
              worstCase: profilerMetrics.worstCaseActualDuration,
              bestCase: profilerMetrics.bestCaseActualDuration,
              renderCount: profilerMetrics.renderCount,
            } : undefined,
          };
        }
        
        // Get memory metrics
        const memoryProfile = memoryProfiler.stopProfiling(componentName);
        let memoryMetrics = undefined;
        if (memoryProfile) {
          const baseline = memoryProfile.metrics.baseline;
          const peak = memoryProfile.metrics.peak;
          const final = memoryProfile.metrics.current;
          
          const getMemoryMB = (snapshot: any) => {
            if (!snapshot) return 0;
            const bytes = snapshot.jsHeapSizeUsed || snapshot.nativeMemory || 0;
            return bytes / (1024 * 1024);
          };
          
          memoryMetrics = {
            baselineMemoryMB: getMemoryMB(baseline),
            peakMemoryMB: getMemoryMB(peak),
            finalMemoryMB: getMemoryMB(final),
            memoryGrowthMB: getMemoryMB(final) - getMemoryMB(baseline),
            leaksDetected: memoryProfile.memoryLeaks.length,
            allocations: memoryProfile.metrics.allocations,
            deallocations: memoryProfile.metrics.deallocations,
          };
        }

        const result: BenchmarkResult = {
          id: `${modalType}-${Date.now()}-${modalRunIdRef.current}`, // Unique ID
          modalType,
          fpsData,
          mobileFPSData,
          nativeFrameMetrics,
          jankEvents,
          duration,
          timestamp: Date.now(),
          timingData,
          renderMetrics,
          memoryMetrics,
          shopifyMetrics
        };
        
        // Track in production monitor if enabled
        if (productionMode && nativeFrameMetrics) {
          const modalName = getModalName(modalType);
          
          // Track render performance
          productionMonitor.trackRender(
            modalName,
            shopifyMetrics?.loadingTimeMs || renderMetrics?.mountTime || 0,
            nativeFrameMetrics.averageFPS
          );
          
          // Track interaction metrics
          if (shopifyMetrics?.touchEventProcessingMs) {
            productionMonitor.trackInteraction(
              modalName,
              shopifyMetrics.touchEventProcessingMs,
              nativeFrameMetrics.averageFPS,
              nativeFrameMetrics.droppedFrames
            );
          }
        }

        setResults((prev) => {
          const newResults = [...prev, result];
          
          // Perform regression analysis if we have previous results for this modal
          const previousResults = prev.filter(r => r.modalType === modalType);
          if (previousResults.length > 0) {
            const previousResult = previousResults[previousResults.length - 1];
            const analysis = RegressionAnalyzer.analyze(result, previousResult);
            
            if (analysis) {
              // Update run indices
              analysis.baseline!.runIndex = previousResults.length;
              analysis.current.runIndex = previousResults.length + 1;
              
              // Store analysis
              setRegressionAnalysis(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(modalType, analysis);
                return newMap;
              });
              
              // Log regression summary
              console.log(RegressionAnalyzer.generateSummary(analysis));
              console.log('=====================================\n');
            }
          }
          
          return newResults;
        });
      }

      // Reset state
      setActiveModal("none");
      setIsRunning(false);
      setCurrentFps(0);
      setTestProgress(0);
      
      // Log modal close time after animation
      setTimeout(() => {
      }, 300); // Typical modal animation duration
    },
    [stopResizeSimulation]
  );

  // Run all tests sequentially
  const runComparison = useCallback(async () => {
    // Clear previous results
    setResults([]);
    setCurrentTestIndex(0);

    const modalTypes: ModalType[] = ["60fps", "60fpsTest"];
    
    // First, update AsyncStorage for all modals to ensure consistent testing
    const standardConfig = {
      mode: testMode,
      height: 0.9, // Standard height for testing
      isFloating: testMode === 'floating',
    };
    
    try {
      await Promise.all(
        modalTypes.map(modal => 
          AsyncStorage.setItem(`benchmark-${modal}-modal`, JSON.stringify(standardConfig))
        )
      );
    } catch (error) {
    }

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
  }, [startBenchmark, testMode]);

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
      case "pure":
        return "💎";
      case "60fps":
        return "🚀";
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
    const sortedByFPS = [...results].sort(
      (a, b) => (b.fpsData.averageFPS || 0) - (a.fpsData.averageFPS || 0)
    );

    // Sort by mount time (ascending - lower is better)
    const sortedByMount = [...results]
      .filter(r => r.renderMetrics?.mountTime)
      .sort((a, b) => (a.renderMetrics?.mountTime || 0) - (b.renderMetrics?.mountTime || 0));

    // Sort by total render time (ascending - lower is better)
    const sortedByRender = [...results]
      .filter(r => r.renderMetrics?.totalRenderTime)
      .sort((a, b) => (a.renderMetrics?.totalRenderTime || 0) - (b.renderMetrics?.totalRenderTime || 0));

    // Sort by memory growth (ascending - lower absolute value is better)
    const sortedByMemory = [...results]
      .filter(r => r.memoryMetrics)
      .sort((a, b) => Math.abs(a.memoryMetrics?.memoryGrowthMB || 0) - Math.abs(b.memoryMetrics?.memoryGrowthMB || 0));

    const fpsBest = sortedByFPS[0];
    const mountBest = sortedByMount[0];
    const renderBest = sortedByRender[0];
    const memoryBest = sortedByMemory[0];

    // Calculate performance scores (0-100)
    const calculateScore = (result: BenchmarkResult) => {
      let score = 0;
      let factors = 0;
      
      // FPS score (30% weight) - prioritize native frame metrics
      const fps = result.nativeFrameMetrics?.averageFPS || result.mobileFPSData?.averageFPS || result.fpsData.averageFPS;
      if (fps) {
        score += (fps / 60) * 30;
        factors++;
      }
      
      // Jank score (10% weight) - penalize jank events (prioritize native metrics)
      const jankCount = result.nativeFrameMetrics?.droppedFrames || result.mobileFPSData?.jankCount;
      if (jankCount !== undefined) {
        const jankPenalty = Math.max(0, 100 - jankCount * 5) / 100;
        score += jankPenalty * 10;
        factors++;
      }
      
      // Mount time score (20% weight) - inverse (lower is better)
      if (result.renderMetrics?.mountTime) {
        const mountScore = Math.max(0, 100 - result.renderMetrics.mountTime) / 100;
        score += mountScore * 20;
        factors++;
      }
      
      // Render efficiency score (20% weight) - based on average update time or profiler data
      if (result.renderMetrics?.profilerData?.actualDuration) {
        // Use React Profiler data if available (more accurate)
        const renderScore = Math.max(0, 100 - result.renderMetrics.profilerData.actualDuration * 2) / 100;
        score += renderScore * 20;
        factors++;
      } else if (result.renderMetrics?.averageUpdateTime) {
        // Fall back to manual tracking
        const renderScore = Math.max(0, 100 - result.renderMetrics.averageUpdateTime * 5) / 100;
        score += renderScore * 20;
        factors++;
      }
      
      // Memory score (15% weight) - penalize growth and leaks
      if (result.memoryMetrics) {
        const memoryGrowth = result.memoryMetrics.memoryGrowthMB;
        const leakPenalty = result.memoryMetrics.leaksDetected * 10;
        const memoryScore = Math.max(0, 100 - Math.abs(memoryGrowth * 10) - leakPenalty) / 100;
        score += memoryScore * 15;
        factors++;
      }
      
      // TTI score (5% weight) - Time to Interactive from Shopify Performance
      // if (result.shopifyMetrics?.timeToInteractive) {
      //   const ttiScore = Math.max(0, 100 - result.shopifyMetrics.timeToInteractive / 10) / 100;
      //   score += ttiScore * 5;
      //   factors++;
      // }
      
      return factors > 0 ? Math.round(score) : 0;
    };

    const overallBest = sortedByFPS.reduce((best, current) => {
      const bestScore = calculateScore(best);
      const currentScore = calculateScore(current);
      return currentScore > bestScore ? current : best;
    });

    return {
      fpsBest: fpsBest ? {
        name: getModalName(fpsBest.modalType),
        value: (fpsBest.fpsData.averageFPS || 0).toFixed(1),
      } : null,
      mountBest: mountBest ? {
        name: getModalName(mountBest.modalType),
        value: (mountBest.renderMetrics?.mountTime || 0).toFixed(1),
      } : null,
      renderBest: renderBest ? {
        name: getModalName(renderBest.modalType),
        value: (renderBest.renderMetrics?.averageUpdateTime || 0).toFixed(1),
      } : null,
      memoryBest: memoryBest ? {
        name: getModalName(memoryBest.modalType),
        value: (memoryBest.memoryMetrics?.memoryGrowthMB || 0).toFixed(1),
      } : null,
      overallBest: {
        name: getModalName(overallBest.modalType),
        score: calculateScore(overallBest),
      },
      rankings: sortedByFPS.map((r, idx) => ({
        rank: idx + 1,
        name: getModalName(r.modalType),
        icon: getModalIcon(r.modalType),
        fps: (r.fpsData.averageFPS || 0).toFixed(1),
        mountTime: r.renderMetrics?.mountTime?.toFixed(1) || 'N/A',
        avgUpdate: r.renderMetrics?.averageUpdateTime?.toFixed(1) || 'N/A',
        score: calculateScore(r),
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
  
  // Function to run all benchmarks sequentially
  const runAllBenchmarks = useCallback(async () => {
    const modals: ModalType[] = ["claude", "original", "optimized", "pure", "themed", "ultraOptimized"];
    
    for (let i = 0; i < modals.length; i++) {
      await new Promise<void>((resolve) => {
        startBenchmark(modals[i]);
        // Wait for the test to complete (5 seconds per test + 1 second buffer)
        setTimeout(() => resolve(), 6000);
      });
    }
  }, [startBenchmark]);
  
  // Initialize automated tester for Claude
  useEffect(() => {
    automatedTester.initialize({
      showModal: (type: AutoTestModalType) => {
        const modalType = type === 'pure' ? 'pure' : 'ultraOptimized';
        startBenchmark(modalType);
      },
      hideModal: () => {
        setActiveModal("none");
      },
      triggerAnimations: (complexity: number) => {
        // Animations are already triggered by TestContent
        console.log(`Animation complexity: ${complexity}`);
      }
    });
  }, [startBenchmark]);
  
  // Run automated tests for Claude
  const runAutomatedTest = useCallback(async () => {
    if (isRunning || automatedTestRunning) {
      console.log('⚠️ Test already in progress');
      return;
    }
    
    setAutomatedTestRunning(true);
    
    // Clear previous results for clean comparison
    setResults([]);
    modalOpenCountRef.current.clear();
    
    // Wait for state to clear
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test 60fpsTest modal (old version with height animation)
    for (let i = 0; i < 2; i++) {
      console.log(`  Test ${i + 1}/2`);
      await new Promise<void>((resolve) => {
        startBenchmark('60fpsTest');
        setTimeout(() => {
          stopBenchmark('60fpsTest');
          resolve();
        }, 3500); // 3 second test + buffer
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between tests
    }
    
    // Test 60FPS modal (new optimized with transforms)
    for (let i = 0; i < 2; i++) {
      console.log(`  Test ${i + 1}/2`);
      await new Promise<void>((resolve) => {
        startBenchmark('60fps');
        setTimeout(() => {
          stopBenchmark('60fps');
          resolve();
        }, 3500); // 3 second test + buffer
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause between tests
    }
    
    // Wait for all results to be collected in state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Analyze results from state (they should all be there now)
    console.log('\n📊 === TEST RESULTS ===\n');
    
    // Use a ref to get the latest results
    const latestResults = await new Promise<BenchmarkResult[]>((resolve) => {
      setTimeout(() => {
        setResults(currentResults => {
          resolve(currentResults);
          return currentResults;
        });
      }, 100);
    });
    
    const pureResults = latestResults.filter(r => r.modalType === 'pure');
    const sixtyFpsResults = latestResults.filter(r => r.modalType === '60fps');
    
    console.log(`Found ${pureResults.length} Pure results and ${sixtyFpsResults.length} 60FPS results`);
    
    if (pureResults.length === 0 || sixtyFpsResults.length === 0) {
      console.log('⚠️ Not enough results to compare');
      setAutomatedTestRunning(false);
      return;
    }
    
    // Calculate averages
    const pureAvg = {
      fps: pureResults.reduce((sum, r) => sum + (r.nativeFrameMetrics?.averageFPS || r.fpsData.averageFPS), 0) / pureResults.length,
      jank: pureResults.reduce((sum, r) => sum + (r.nativeFrameMetrics?.jankScore || 0), 0) / pureResults.length,
      mountTime: pureResults.reduce((sum, r) => sum + (r.renderMetrics?.mountTime || 0), 0) / pureResults.length,
      memory: pureResults.reduce((sum, r) => sum + (r.memoryMetrics?.memoryGrowthMB || 0), 0) / pureResults.length,
      renders: pureResults.reduce((sum, r) => sum + (r.renderMetrics?.updateCount || 0), 0) / pureResults.length,
    };
    
    const sixtyFpsAvg = {
      fps: sixtyFpsResults.reduce((sum, r) => sum + (r.nativeFrameMetrics?.averageFPS || r.fpsData.averageFPS), 0) / sixtyFpsResults.length,
      jank: sixtyFpsResults.reduce((sum, r) => sum + (r.nativeFrameMetrics?.jankScore || 0), 0) / sixtyFpsResults.length,
      mountTime: sixtyFpsResults.reduce((sum, r) => sum + (r.renderMetrics?.mountTime || 0), 0) / sixtyFpsResults.length,
      memory: sixtyFpsResults.reduce((sum, r) => sum + (r.memoryMetrics?.memoryGrowthMB || 0), 0) / sixtyFpsResults.length,
      renders: sixtyFpsResults.reduce((sum, r) => sum + (r.renderMetrics?.updateCount || 0), 0) / sixtyFpsResults.length,
    };
    
    // Calculate improvements
    const improvements = {
      fps: ((sixtyFpsAvg.fps - pureAvg.fps) / pureAvg.fps * 100),
      jank: ((pureAvg.jank - sixtyFpsAvg.jank) / pureAvg.jank * 100),
      mountTime: ((pureAvg.mountTime - sixtyFpsAvg.mountTime) / pureAvg.mountTime * 100),
      memory: ((pureAvg.memory - sixtyFpsAvg.memory) / pureAvg.memory * 100),
      renders: ((pureAvg.renders - sixtyFpsAvg.renders) / pureAvg.renders * 100),
    };
    
    // Log results
    console.log(`  FPS: ${pureAvg.fps.toFixed(1)}`);
    console.log(`  Jank: ${pureAvg.jank.toFixed(1)}`);
    console.log(`  Mount: ${pureAvg.mountTime.toFixed(0)}ms`);
    console.log(`  Memory: ${pureAvg.memory.toFixed(2)}MB`);
    console.log(`  Renders: ${pureAvg.renders.toFixed(0)}`);
    
    console.log(`  FPS: ${sixtyFpsAvg.fps.toFixed(1)}`);
    console.log(`  Jank: ${sixtyFpsAvg.jank.toFixed(1)}`);
    console.log(`  Mount: ${sixtyFpsAvg.mountTime.toFixed(0)}ms`);
    console.log(`  Memory: ${sixtyFpsAvg.memory.toFixed(2)}MB`);
    console.log(`  Renders: ${sixtyFpsAvg.renders.toFixed(0)}`);
    
    console.log('\n📈 Performance Changes:');
    console.log(`  FPS: ${improvements.fps > 0 ? '+' : ''}${improvements.fps.toFixed(1)}% ${improvements.fps > 0 ? '✅' : improvements.fps < 0 ? '❌' : '➖'}`);
    console.log(`  Jank: ${improvements.jank > 0 ? '-' : '+'}${Math.abs(improvements.jank).toFixed(1)}% ${improvements.jank > 0 ? '✅' : improvements.jank < 0 ? '❌' : '➖'}`);
    console.log(`  Mount Time: ${improvements.mountTime > 0 ? '-' : '+'}${Math.abs(improvements.mountTime).toFixed(1)}% ${improvements.mountTime > 0 ? '✅' : improvements.mountTime < 0 ? '❌' : '➖'}`);
    console.log(`  Memory: ${improvements.memory > 0 ? '-' : '+'}${Math.abs(improvements.memory).toFixed(1)}% ${improvements.memory > 0 ? '✅' : improvements.memory < 0 ? '❌' : '➖'}`);
    console.log(`  Renders: ${improvements.renders > 0 ? '-' : '+'}${Math.abs(improvements.renders).toFixed(1)}% ${improvements.renders > 0 ? '✅' : improvements.renders < 0 ? '❌' : '➖'}`);
    
    const overallScore = (improvements.fps * 0.3 + improvements.jank * 0.3 + improvements.mountTime * 0.2 + improvements.memory * 0.1 + improvements.renders * 0.1);
    
    console.log('\n🏆 Overall Result:');
    if (Math.abs(overallScore) < 1) {
      console.log('  Performance is identical (< 1% difference)');
    } else if (overallScore > 0) {
      console.log(`  60FPS is ${overallScore.toFixed(1)}% BETTER! 🎉`);
    } else {
      console.log(`  60FPS is ${Math.abs(overallScore).toFixed(1)}% WORSE! ⚠️`);
    }
    
    setAutomatedTestRunning(false);
    
    // Store results globally for analysis
    (global as any).lastOptimizationTestResults = {
      pure: pureAvg,
      sixtyFps: sixtyFpsAvg,
      improvements,
      overallScore
    };
  }, [isRunning, automatedTestRunning, startBenchmark, stopBenchmark, results]);
  
  // Track if we've already started the auto test
  const autoTestStartedRef = useRef(false);
  
  // Expose global function for Claude to run tests
  useEffect(() => {
    (global as any).runModalOptimizationTest = runAutomatedTest;
    
    // Auto-run optimization test if configured (only once)
    if (AUTO_RUN_OPTIMIZATION_TEST && !automatedTestRunning && !autoTestStartedRef.current) {
      autoTestStartedRef.current = true;
      const timer = setTimeout(() => {
        console.log('🚀 Auto-running optimization test...');
        runAutomatedTest();
      }, OPTIMIZATION_TEST_DELAY);
      
      return () => {
        clearTimeout(timer);
        delete (global as any).runModalOptimizationTest;
      };
    }
    
    return () => {
      delete (global as any).runModalOptimizationTest;
    };
  }, [runAutomatedTest, automatedTestRunning]);
  
  // Auto-run tests if configured
  useEffect(() => {
    if (AUTO_RUN_COMPARISON && !isRunning) {
      const timer = setTimeout(() => {
        runAllBenchmarks();
      }, AUTO_RUN_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount
  
  // Auto-test 60FPS modal if configured
  useEffect(() => {
    if (AUTO_TEST_60FPS && !isRunning && !activeModal) {
      const timer = setTimeout(() => {
        startBenchmark('60fps');
      }, AUTO_TEST_60FPS_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount
  
  // Collect Shopify Performance reports
  // useEffect(() => {
  //   if (renderPassReport && activeModal !== "none") {
  //     const componentName = getModalName(activeModal as ModalType);
      
  //     // Store the report for the active modal
  //     setShopifyReports(prev => {
  //       const newMap = new Map(prev);
  //       const existingReports = newMap.get(componentName) || [];
  //       newMap.set(componentName, [...existingReports, renderPassReport]);
  //       return newMap;
  //     });
  //   }
  // }, [renderPassReport, activeModal]);

  const comparison = getComparison();

  // Render test content inside modals
  const TestContent = React.memo(() => {
    useRenderTracking('TestContent');
    return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Performance Benchmark Running</Text>
      <Text style={styles.modalSubtitle}>
        Testing resize performance in bottom sheet mode
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

      {/* Resize simulation info */}
      <View style={styles.resizeInfoCard}>
        <Text style={styles.resizeInfoTitle}>🔄 Resize Simulation Active</Text>
        <Text style={styles.resizeInfoText}>
          Simulating rapid up/down dragging
        </Text>
        <Text style={styles.resizeInfoText}>
          Height: 200px ↔ 600px @ 60fps
        </Text>
        <View style={styles.resizeIndicator}>
          <Animated.View
            style={[
              styles.resizeIndicatorBar,
              {
                height: (getModalHeightRef(activeModal) || new Animated.Value(400)).interpolate({
                  inputRange: [200, 600],
                  outputRange: [20, 100],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Performance Comparison</Text>

        {/* Tab Navigation */}
        <View style={styles.tabNavigationContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("modals")}
            style={[
              styles.tabButton,
              activeTab === "modals" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "modals" && styles.tabButtonTextActive,
              ]}
            >
              Modal Tests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("lists")}
            style={[
              styles.tabButton,
              activeTab === "lists" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "lists" && styles.tabButtonTextActive,
              ]}
            >
              List Performance
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal Tests Tab Content */}
        {activeTab === "modals" ? (
          <>
        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Controls</Text>
          <Text style={styles.instructions}>
            Compare performance between all 5 modal implementations
          </Text>
          
          {/* Mode Selector */}
          <View style={styles.modeSelector}>
            <Text style={styles.modeSelectorLabel}>Test Mode:</Text>
            <View style={styles.modeButtons}>
              <Pressable
                style={[
                  styles.modeButton,
                  testMode === "floating" && styles.modeButtonActive,
                ]}
                onPress={() => setTestMode("floating")}
                disabled={isRunning}
              >
                <Text style={[
                  styles.modeButtonText,
                  testMode === "floating" && styles.modeButtonTextActive,
                ]}>
                  🎈 Floating
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modeButton,
                  testMode === "bottomSheet" && styles.modeButtonActive,
                ]}
                onPress={() => setTestMode("bottomSheet")}
                disabled={isRunning}
              >
                <Text style={[
                  styles.modeButtonText,
                  testMode === "bottomSheet" && styles.modeButtonTextActive,
                ]}>
                  📱 Bottom Sheet
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Test Buttons */}
          <View style={styles.buttonGrid}>
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("60fps")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>🚀 60FPS Clean</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSmall, isRunning && styles.buttonDisabled]}
              onPress={() => startBenchmark("60fpsTest")}
              disabled={isRunning}
            >
              <Text style={styles.buttonTextSmall}>🧪 60FPS Test</Text>
            </Pressable>
          </View>
          
          {/* Optimization Test Button - NEW */}
          <View style={styles.optimizationTestSection}>
            <Text style={styles.sectionTitle}>Optimization Testing</Text>
            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.button, 
                  styles.buttonOptimization,
                  (isRunning || automatedTestRunning) && styles.buttonDisabled
                ]}
                onPress={runAutomatedTest}
                disabled={isRunning || automatedTestRunning}
              >
                <Text style={styles.buttonText}>
                  {automatedTestRunning ? '⏳ Testing...' : '🔬 Test 60FPS Variants'}
                </Text>
              </Pressable>
            </View>
            {(global as any).lastOptimizationTestResults && (
              <View style={styles.lastTestResults}>
                <Text style={styles.lastTestTitle}>Last Test Results:</Text>
                <Text style={styles.lastTestText}>
                  FPS: {(global as any).lastOptimizationTestResults.improvements.fps > 0 ? '+' : ''}{(global as any).lastOptimizationTestResults.improvements.fps.toFixed(1)}%
                  {' '}Jank: {(global as any).lastOptimizationTestResults.improvements.jank > 0 ? '-' : '+'}{Math.abs((global as any).lastOptimizationTestResults.improvements.jank).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
          
          {/* Clear Results Button */}
          {results.length > 0 && !isRunning && (
            <Pressable
              style={[styles.button, styles.buttonClear]}
              onPress={() => {
                setResults([]);
                setRegressionAnalysis(new Map());
                modalOpenCountRef.current.clear(); // Reset cold/warm tracking
                console.log('🧹 Performance results cleared');
              }}
            >
              <Text style={styles.buttonText}>🗑️ Clear All Results</Text>
            </Pressable>
          )}
          
          {/* Export Report Button */}
          {results.length > 0 && !isRunning && (
            <View style={styles.section}>
              <Pressable
                style={[styles.button, styles.button]}
                onPress={() => {
                  // Generate detailed report
                  const report = PerformanceReportExporter.generateDetailedReport(results, regressionAnalysis);
                  setDetailedReport(report);
                  setShowDetailedReport(true);
                  console.log('📊 Detailed report generated');
                }}
              >
                <Text style={styles.buttonText}>📊 Generate Detailed Report</Text>
              </Pressable>
            </View>
          )}

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

        {/* Results - Compact Table View */}
        {results.length > 0 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📊 Performance Metrics</Text>
                <Pressable
                  style={styles.clearButton}
                  onPress={() => setResults([])}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>

              {/* Compact Table */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                  {/* Header Row */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.tableCellHeader, styles.firstColumn]}>
                      
                    </Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>FPS</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Drops</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Jank%</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Mount</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Updates</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Passes</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Touch</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Memory</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>TTI</Text>
                    <Text style={[styles.tableCell, styles.tableCellHeader]}>Grade</Text>
                  </View>
                  
                  {/* Data Rows */}
                  {results.map((result, index) => {
                    // Calculate score inline if comparison isn't available yet
                    let score = 0;
                    let factors = 0;
                    
                    // FPS score (30% weight) - prioritize native frame metrics
                    const fps = result.nativeFrameMetrics?.averageFPS || result.mobileFPSData?.averageFPS || result.fpsData.averageFPS;
                    if (fps) {
                      score += (fps / 60) * 30;
                      factors++;
                    }
                    
                    // Jank score (10% weight) - penalize jank events (prioritize native metrics)
                    const jankCount = result.nativeFrameMetrics?.droppedFrames || result.mobileFPSData?.jankCount;
                    if (jankCount !== undefined) {
                      const jankPenalty = Math.max(0, 100 - jankCount * 5) / 100;
                      score += jankPenalty * 10;
                      factors++;
                    }
                    
                    // Mount time score (20% weight) - inverse (lower is better)
                    if (result.renderMetrics?.mountTime) {
                      const mountScore = Math.max(0, 100 - result.renderMetrics.mountTime) / 100;
                      score += mountScore * 20;
                      factors++;
                    }
                    
                    // Render efficiency score (20% weight) - based on average update time or profiler data
                    if (result.renderMetrics?.profilerData?.actualDuration) {
                      // Use React Profiler data if available (more accurate)
                      const renderScore = Math.max(0, 100 - result.renderMetrics.profilerData.actualDuration * 2) / 100;
                      score += renderScore * 20;
                      factors++;
                    } else if (result.renderMetrics?.averageUpdateTime) {
                      // Fall back to manual tracking
                      const renderScore = Math.max(0, 100 - result.renderMetrics.averageUpdateTime * 5) / 100;
                      score += renderScore * 20;
                      factors++;
                    }
                    
                    // Memory score (15% weight) - penalize growth and leaks
                    if (result.memoryMetrics) {
                      const memoryGrowth = result.memoryMetrics.memoryGrowthMB;
                      const leakPenalty = result.memoryMetrics.leaksDetected * 10;
                      const memoryScore = Math.max(0, 100 - Math.abs(memoryGrowth * 10) - leakPenalty) / 100;
                      score += memoryScore * 15;
                      factors++;
                    }
                    
                    // TTI score (5% weight) - Time to Interactive from Shopify Performance
                    // if (result.shopifyMetrics?.timeToInteractive) {
                    //   const ttiScore = Math.max(0, 100 - result.shopifyMetrics.timeToInteractive / 10) / 100;
                    //   score += ttiScore * 5;
                    //   factors++;
                    // }
                    
                    const finalScore = factors > 0 ? Math.round(score) : 0;
                    
                    // Shorten modal names for display
                    const shortName = result.modalType === '60fps' ? '🚀' :
                                     result.modalType === '60fpsTest' ? '🧪' : '';
                    
                    return (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.firstColumn, styles.modalNameCell]}>
                          {shortName}
                          {result.shopifyMetrics?.isColdStart !== undefined ? 
                            (result.shopifyMetrics.isColdStart ? '❄️' : '🔥') : ''
                          }
                        </Text>
                        <View style={styles.tableCell}>
                          <Text style={[
                            styles.tableCellValue,
                            { color: getBudgetColor(evaluateMetric(
                              result.nativeFrameMetrics?.averageFPS || result.mobileFPSData?.averageFPS || result.fpsData.averageFPS,
                              'fps',
                              false
                            )) }
                          ]}>
                            {result.nativeFrameMetrics?.averageFPS?.toFixed(1) || result.mobileFPSData?.averageFPS?.toFixed(1) || result.fpsData.averageFPS?.toFixed(1) || '0'}
                          </Text>
                        </View>
                        <View style={styles.tableCell}>
                          <Text style={[
                            styles.tableCellValue,
                            { color: getBudgetColor(evaluateMetric(
                              result.nativeFrameMetrics?.droppedFrames || result.mobileFPSData?.jankCount,
                              'jank',
                              true
                            )) }
                          ]}>
                            {result.nativeFrameMetrics?.droppedFrames ?? result.mobileFPSData?.jankCount ?? '0'}
                          </Text>
                        </View>
                        <View style={styles.tableCell}>
                          <Text style={[
                            styles.tableCellValue,
                            result.nativeFrameMetrics?.jankScore && result.nativeFrameMetrics.jankScore > 50 ? { color: '#EF4444' } :
                            result.nativeFrameMetrics?.jankScore && result.nativeFrameMetrics.jankScore > 20 ? { color: '#F59E0B' } :
                            { color: '#10B981' }
                          ]}>
                            {result.nativeFrameMetrics?.jankScore ? `${result.nativeFrameMetrics.jankScore}%` : 'N/A'}
                          </Text>
                        </View>
                        <Text style={[styles.tableCell, styles.tableCellValue]}>
                          {result.shopifyMetrics?.loadingTimeMs ? 
                            `${result.shopifyMetrics.loadingTimeMs.toFixed(0)}` :
                            result.renderMetrics?.mountTime?.toFixed(0) || 'N/A'}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellValue]}>
                          {result.renderMetrics?.updateCount || 'N/A'}
                        </Text>
                        <Text style={[
                          styles.tableCell, 
                          styles.tableCellValue,
                          result.shopifyMetrics?.renderPasses && result.shopifyMetrics.renderPasses > 3 ? { color: '#FF9800' } : 
                          result.shopifyMetrics?.renderPasses === 2 ? { color: '#4CAF50' } : {}
                        ]}>
                          {result.shopifyMetrics?.renderPasses ? 
                            `${result.shopifyMetrics.loadingPasses || 0}/${result.shopifyMetrics.interactivePasses || 0}` :
                            'N/A'
                          }
                        </Text>
                        <Text style={[
                          styles.tableCell,
                          styles.tableCellValue,
                          { color: getBudgetColor(evaluateMetric(
                            result.shopifyMetrics?.touchEventProcessingMs,
                            'touchEvent',
                            true
                          )) }
                        ]}>
                          {result.shopifyMetrics?.touchEventProcessingMs !== undefined ?
                            `${result.shopifyMetrics.touchEventProcessingMs.toFixed(1)}ms` :
                            'N/A'
                          }
                        </Text>
                        <Text style={[
                          styles.tableCell, 
                          styles.tableCellValue,
                          result.memoryMetrics?.memoryGrowthMB && result.memoryMetrics.memoryGrowthMB > 5 ? styles.memoryLeak : {},
                          result.memoryMetrics?.memoryGrowthMB && result.memoryMetrics.memoryGrowthMB < 0 ? styles.memoryGood : {}
                        ]}>
                          {result.memoryMetrics ? 
                            (result.memoryMetrics.memoryGrowthMB >= 0 ? 
                              `+${result.memoryMetrics.memoryGrowthMB.toFixed(1)}` : 
                              `${result.memoryMetrics.memoryGrowthMB.toFixed(1)}`
                            ) + 'MB' : 
                            'N/A'
                          }
                          {result.memoryMetrics?.leaksDetected ? ' ⚠️' : ''}
                        </Text>
                        <Text style={[
                          styles.tableCell, 
                          styles.tableCellValue,
                          result.shopifyMetrics?.interactiveTimeMs && result.shopifyMetrics.interactiveTimeMs < 200 ? styles.ttiGood :
                          result.shopifyMetrics?.interactiveTimeMs && result.shopifyMetrics.interactiveTimeMs < 500 ? styles.ttiOk :
                          result.shopifyMetrics?.interactiveTimeMs ? styles.ttiBad : {}
                        ]}>
                          {result.shopifyMetrics?.interactiveTimeMs ? 
                            `${result.shopifyMetrics.interactiveTimeMs.toFixed(0)}ms` : 
                            'N/A'}
                        </Text>
                        <View style={[styles.tableCell, styles.gradeCell]}>
                          <Text style={[
                            styles.gradeBadge,
                            { backgroundColor: calculatePerformanceGrade(result).color }
                          ]}>
                            {calculatePerformanceGrade(result).grade}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
              
              {/* Regression Analysis */}
              {regressionAnalysis.size > 0 && (
                <View style={styles.regressionSection}>
                  <Pressable
                    onPress={() => setShowRegressionDetails(!showRegressionDetails)}
                    style={styles.regressionHeader}
                  >
                    <Text style={styles.regressionTitle}>
                      📈 Regression Analysis {showRegressionDetails ? '▼' : '▶'}
                    </Text>
                    <Text style={styles.regressionSubtitle}>
                      Track improvements between test runs
                    </Text>
                  </Pressable>
                  
                  {showRegressionDetails && (
                    <View style={styles.regressionContent}>
                      {Array.from(regressionAnalysis.entries()).map(([modalType, analysis]) => {
                        const modalName = getModalName(modalType);
                        const isImproved = analysis.overallImprovement > 0;
                        
                        return (
                          <View key={modalType} style={styles.regressionCard}>
                            <View style={styles.regressionCardHeader}>
                              <Text style={styles.regressionModalName}>
                                {modalName}
                              </Text>
                              <Text style={[
                                styles.regressionOverall,
                                { color: isImproved ? '#10B981' : '#EF4444' }
                              ]}>
                                {isImproved ? '↑' : '↓'} {Math.abs(analysis.overallImprovement)}%
                              </Text>
                            </View>
                            
                            <Text style={styles.regressionRunInfo}>
                              Run #{analysis.baseline?.runIndex} → Run #{analysis.current.runIndex}
                            </Text>
                            
                            {/* Significant Changes */}
                            {analysis.summary.significantImprovements.length > 0 && (
                              <View style={styles.regressionMetrics}>
                                <Text style={styles.regressionMetricTitle}>✅ Improvements:</Text>
                                {analysis.summary.significantImprovements.map(metric => {
                                  const key = metric.toLowerCase().replace(/ /g, '') as keyof typeof analysis.metrics;
                                  const change = analysis.metrics[key];
                                  if (!change) return null;
                                  
                                  return (
                                    <View key={metric} style={styles.regressionMetricRow}>
                                      <Text style={styles.regressionMetricName}>{metric}:</Text>
                                      <Text style={[styles.regressionMetricValue, { color: '#10B981' }]}>
                                        ↑ {Math.abs(change.changePercent)}%
                                      </Text>
                                      <Text style={styles.regressionMetricDetail}>
                                        ({change.previous} → {change.current})
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            )}
                            
                            {analysis.summary.significantRegressions.length > 0 && (
                              <View style={styles.regressionMetrics}>
                                <Text style={styles.regressionMetricTitle}>⚠️ Regressions:</Text>
                                {analysis.summary.significantRegressions.map(metric => {
                                  const key = metric.toLowerCase().replace(/ /g, '') as keyof typeof analysis.metrics;
                                  const change = analysis.metrics[key];
                                  if (!change) return null;
                                  
                                  return (
                                    <View key={metric} style={styles.regressionMetricRow}>
                                      <Text style={styles.regressionMetricName}>{metric}:</Text>
                                      <Text style={[styles.regressionMetricValue, { color: '#EF4444' }]}>
                                        ↓ {Math.abs(change.changePercent)}%
                                      </Text>
                                      <Text style={styles.regressionMetricDetail}>
                                        ({change.previous} → {change.current})
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            )}
                            
                            {/* All Metrics Summary */}
                            <View style={styles.regressionAllMetrics}>
                              {Object.entries(analysis.metrics).map(([key, change]) => {
                                if (!change || Math.abs(change.changePercent) < 1) return null;
                                
                                const metricName = key === 'fps' ? 'FPS' :
                                                 key === 'tti' ? 'TTI' :
                                                 key === 'mountTime' ? 'Mount' :
                                                 key === 'droppedFrames' ? 'Drops' :
                                                 key === 'jankScore' ? 'Jank' :
                                                 key === 'memory' ? 'Mem' :
                                                 key === 'renderPasses' ? 'Passes' :
                                                 key === 'touchResponse' ? 'Touch' : key;
                                
                                return (
                                  <View key={key} style={styles.regressionMiniMetric}>
                                    <Text style={styles.regressionMiniLabel}>{metricName}</Text>
                                    <Text style={[
                                      styles.regressionMiniValue,
                                      { color: change.improved ? '#10B981' : '#F59E0B' }
                                    ]}>
                                      {change.improved ? '+' : ''}{change.changePercent}%
                                    </Text>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              
              {/* Production Performance Report */}
              {showProductionReport && productionReport && (
                <View style={styles.productionReportSection}>
                  <View style={styles.productionReportHeader}>
                    <Text style={styles.productionReportTitle}>
                      🏭 Production Performance Report
                    </Text>
                    <Pressable
                      onPress={() => setShowProductionReport(false)}
                      style={styles.productionReportClose}
                    >
                      <Text style={styles.productionReportCloseText}>✕</Text>
                    </Pressable>
                  </View>
                  
                  <View style={styles.productionReportContent}>
                    {/* Session Info */}
                    <View style={styles.productionReportRow}>
                      <Text style={styles.productionReportLabel}>Session Duration:</Text>
                      <Text style={styles.productionReportValue}>
                        {(productionReport.metrics.sessionDuration / 1000).toFixed(1)}s
                      </Text>
                    </View>
                    <View style={styles.productionReportRow}>
                      <Text style={styles.productionReportLabel}>Total Events:</Text>
                      <Text style={styles.productionReportValue}>
                        {productionReport.metrics.totalEvents}
                      </Text>
                    </View>
                    
                    {/* Core Metrics */}
                    <Text style={styles.productionReportSectionTitle}>📊 Core Metrics</Text>
                    <View style={styles.productionReportMetrics}>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>Avg FPS</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.avgFPS < 30 ? styles.metricBad :
                          productionReport.metrics.avgFPS < 50 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.avgFPS.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>Avg TTI</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.avgTTI > 500 ? styles.metricBad :
                          productionReport.metrics.avgTTI > 200 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.avgTTI.toFixed(0)}ms
                        </Text>
                      </View>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>P95 TTI</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.p95TTI > 1000 ? styles.metricBad :
                          productionReport.metrics.p95TTI > 500 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.p95TTI.toFixed(0)}ms
                        </Text>
                      </View>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>Min FPS</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.minFPS < 30 ? styles.metricBad :
                          productionReport.metrics.minFPS < 45 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.minFPS.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>Total Janks</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.totalJanks > 10 ? styles.metricBad :
                          productionReport.metrics.totalJanks > 5 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.totalJanks}
                        </Text>
                      </View>
                      <View style={styles.productionMetricCard}>
                        <Text style={styles.productionMetricLabel}>Touch Latency</Text>
                        <Text style={[
                          styles.productionMetricValue,
                          productionReport.metrics.avgTouchLatency > 100 ? styles.metricBad :
                          productionReport.metrics.avgTouchLatency > 50 ? styles.metricOk :
                          styles.metricGood
                        ]}>
                          {productionReport.metrics.avgTouchLatency.toFixed(0)}ms
                        </Text>
                      </View>
                    </View>
                    
                    {/* Performance Issues */}
                    <Text style={styles.productionReportSectionTitle}>⚠️ Issues Detected</Text>
                    <View style={styles.productionIssues}>
                      {productionReport.metrics.performanceIssues.slowTTI > 0 && (
                        <Text style={styles.productionIssue}>
                          • {productionReport.metrics.performanceIssues.slowTTI} slow TTI events ({">"}500ms)
                        </Text>
                      )}
                      {productionReport.metrics.performanceIssues.lowFPS > 0 && (
                        <Text style={styles.productionIssue}>
                          • {productionReport.metrics.performanceIssues.lowFPS} low FPS events ({"<"}30)
                        </Text>
                      )}
                      {productionReport.metrics.performanceIssues.highJank > 0 && (
                        <Text style={styles.productionIssue}>
                          • {productionReport.metrics.performanceIssues.highJank} high jank events ({">"}10)
                        </Text>
                      )}
                      {productionReport.metrics.performanceIssues.slowTouch > 0 && (
                        <Text style={styles.productionIssue}>
                          • {productionReport.metrics.performanceIssues.slowTouch} slow touch events ({">"}100ms)
                        </Text>
                      )}
                      {Object.values(productionReport.metrics.performanceIssues).every(v => v === 0) && (
                        <Text style={[styles.productionIssue, { color: '#10B981' }]}>
                          ✅ No performance issues detected!
                        </Text>
                      )}
                    </View>
                    
                    {/* Device Info */}
                    <Text style={styles.productionReportSectionTitle}>📱 Device Info</Text>
                    <View style={styles.productionDeviceInfo}>
                      <Text style={styles.productionDeviceText}>
                        {productionReport.deviceInfo.platform} • {productionReport.deviceInfo.model}
                      </Text>
                      <Text style={styles.productionDeviceText}>
                        OS: {productionReport.deviceInfo.osVersion} • Screen: {productionReport.deviceInfo.screenDimensions.width}x{productionReport.deviceInfo.screenDimensions.height}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              
              {/* Detailed Performance Report */}
              {showDetailedReport && detailedReport && (
                <View style={styles.detailedReportSection}>
                  <View style={styles.detailedReportHeader}>
                    <Text style={styles.detailedReportTitle}>
                      📊 Detailed Performance Report
                    </Text>
                    <Pressable
                      onPress={() => setShowDetailedReport(false)}
                      style={styles.detailedReportClose}
                    >
                      <Text style={styles.detailedReportCloseText}>✕</Text>
                    </Pressable>
                  </View>
                  
                  <ScrollView style={styles.detailedReportContent}>
                    {/* Report Metadata */}
                    <View style={styles.reportMetadata}>
                      <Text style={styles.reportMetadataText}>
                        Report ID: {detailedReport.metadata.reportId}
                      </Text>
                      <Text style={styles.reportMetadataText}>
                        Generated: {new Date(detailedReport.metadata.generatedAt).toLocaleString()}
                      </Text>
                      <Text style={styles.reportMetadataText}>
                        Tests: {detailedReport.metadata.totalTests} | Duration: {(detailedReport.metadata.testDuration / 1000).toFixed(1)}s
                      </Text>
                    </View>
                    
                    {/* Export Options */}
                    <View style={styles.exportOptions}>
                      <Text style={styles.exportOptionsTitle}>Export Report As:</Text>
                      <View style={styles.exportButtonsRow}>
                        <Pressable
                          style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
                          onPress={async () => {
                            setExportLoading(true);
                            try {
                              const result = await PerformanceReportExporter.exportAsJSON(detailedReport);
                              console.log('✅ Report exported as JSON');
                              // Show toast on mobile
                              if (Platform.OS === 'android') {
                                ToastAndroid.show('JSON report copied to clipboard!', ToastAndroid.SHORT);
                              } else if (Platform.OS === 'ios') {
                                // iOS doesn't have ToastAndroid, we'll use console log
                                console.log('📋 JSON report copied to clipboard!');
                              }
                            } catch (error) {
                              console.error('Failed to export JSON:', error);
                            }
                            setExportLoading(false);
                          }}
                          disabled={exportLoading}
                        >
                          <Text style={styles.exportButtonText}>📄 JSON</Text>
                        </Pressable>
                        
                        <Pressable
                          style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
                          onPress={async () => {
                            setExportLoading(true);
                            try {
                              const result = await PerformanceReportExporter.exportAsCSV(detailedReport);
                              console.log('✅ Report exported as CSV');
                              if (Platform.OS === 'android') {
                                ToastAndroid.show('CSV report copied to clipboard!', ToastAndroid.SHORT);
                              } else if (Platform.OS === 'ios') {
                                console.log('📋 CSV report copied to clipboard!');
                              }
                            } catch (error) {
                              console.error('Failed to export CSV:', error);
                            }
                            setExportLoading(false);
                          }}
                          disabled={exportLoading}
                        >
                          <Text style={styles.exportButtonText}>📊 CSV</Text>
                        </Pressable>
                        
                        <Pressable
                          style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
                          onPress={async () => {
                            setExportLoading(true);
                            try {
                              const result = await PerformanceReportExporter.exportAsMarkdown(detailedReport);
                              console.log('✅ Report exported as Markdown');
                              if (Platform.OS === 'android') {
                                ToastAndroid.show('Markdown report copied to clipboard!', ToastAndroid.SHORT);
                              } else if (Platform.OS === 'ios') {
                                console.log('📋 Markdown report copied to clipboard!');
                              }
                            } catch (error) {
                              console.error('Failed to export Markdown:', error);
                            }
                            setExportLoading(false);
                          }}
                          disabled={exportLoading}
                        >
                          <Text style={styles.exportButtonText}>📝 MD</Text>
                        </Pressable>
                        
                        <Pressable
                          style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
                          onPress={async () => {
                            setExportLoading(true);
                            try {
                              await PerformanceReportExporter.shareReport(detailedReport);
                              console.log('✅ Report shared');
                            } catch (error) {
                              console.error('Failed to share report:', error);
                            }
                            setExportLoading(false);
                          }}
                          disabled={exportLoading}
                        >
                          <Text style={styles.exportButtonText}>📤 Share</Text>
                        </Pressable>
                      </View>
                    </View>
                    
                    {/* Summary Section */}
                    <View style={styles.reportSection}>
                      <Text style={styles.reportSectionTitle}>📈 Summary</Text>
                      
                      <View style={styles.reportCard}>
                        <Text style={styles.reportCardTitle}>🏆 Best Performer</Text>
                        <Text style={styles.reportCardValue}>
                          {detailedReport.summary.bestPerformer.name} (Score: {detailedReport.summary.bestPerformer.score})
                        </Text>
                        <View style={styles.reportCardMetrics}>
                          <Text style={styles.reportCardMetric}>
                            FPS: {detailedReport.summary.bestPerformer.keyMetrics.fps.toFixed(1)}
                          </Text>
                          <Text style={styles.reportCardMetric}>
                            TTI: {detailedReport.summary.bestPerformer.keyMetrics.tti.toFixed(0)}ms
                          </Text>
                          <Text style={styles.reportCardMetric}>
                            Jank: {detailedReport.summary.bestPerformer.keyMetrics.jankCount}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.reportCard}>
                        <Text style={styles.reportCardTitle}>⚠️ Worst Performer</Text>
                        <Text style={styles.reportCardValue}>
                          {detailedReport.summary.worstPerformer.name} (Score: {detailedReport.summary.worstPerformer.score})
                        </Text>
                        <View style={styles.reportCardIssues}>
                          {detailedReport.summary.worstPerformer.issues.map((issue, idx) => (
                            <Text key={idx} style={styles.reportCardIssue}>• {issue}</Text>
                          ))}
                        </View>
                      </View>
                      
                      <View style={styles.reportCard}>
                        <Text style={styles.reportCardTitle}>📊 Average Metrics</Text>
                        <View style={styles.reportCardMetrics}>
                          <Text style={styles.reportCardMetric}>
                            FPS: {detailedReport.summary.averageMetrics.fps.toFixed(1)}
                          </Text>
                          <Text style={styles.reportCardMetric}>
                            TTI: {detailedReport.summary.averageMetrics.tti.toFixed(0)}ms
                          </Text>
                          <Text style={styles.reportCardMetric}>
                            Mount: {detailedReport.summary.averageMetrics.mountTime.toFixed(0)}ms
                          </Text>
                          <Text style={styles.reportCardMetric}>
                            Memory: {detailedReport.summary.averageMetrics.memoryGrowth.toFixed(1)}MB
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Detailed Results */}
                    <View style={styles.reportSection}>
                      <Text style={styles.reportSectionTitle}>📋 Detailed Results</Text>
                      
                      {detailedReport.detailedResults.map((result, idx) => (
                        <View key={idx} style={styles.reportDetailCard}>
                          <Text style={styles.reportDetailTitle}>{result.modalName}</Text>
                          <Text style={styles.reportDetailRuns}>Test Runs: {result.testRuns}</Text>
                          
                          <View style={styles.reportDetailMetrics}>
                            <View style={styles.reportDetailMetricRow}>
                              <Text style={styles.reportDetailMetricLabel}>FPS:</Text>
                              <Text style={styles.reportDetailMetricValue}>
                                {result.metrics.fps.avg.toFixed(1)} (min: {result.metrics.fps.min.toFixed(1)}, p95: {result.metrics.fps.p95.toFixed(1)})
                              </Text>
                            </View>
                            <View style={styles.reportDetailMetricRow}>
                              <Text style={styles.reportDetailMetricLabel}>TTI:</Text>
                              <Text style={styles.reportDetailMetricValue}>
                                {result.metrics.tti.avg.toFixed(0)}ms (min: {result.metrics.tti.min.toFixed(0)}, p95: {result.metrics.tti.p95.toFixed(0)})
                              </Text>
                            </View>
                            <View style={styles.reportDetailMetricRow}>
                              <Text style={styles.reportDetailMetricLabel}>Jank Score:</Text>
                              <Text style={styles.reportDetailMetricValue}>
                                {result.metrics.jankScore.avg.toFixed(0)} (max: {result.metrics.jankScore.max.toFixed(0)})
                              </Text>
                            </View>
                            <View style={styles.reportDetailMetricRow}>
                              <Text style={styles.reportDetailMetricLabel}>Cold Starts:</Text>
                              <Text style={styles.reportDetailMetricValue}>
                                {result.metrics.coldStarts.count} ({result.metrics.coldStarts.avgTTI.toFixed(0)}ms avg)
                              </Text>
                            </View>
                          </View>
                          
                          {result.issues.length > 0 && (
                            <View style={styles.reportDetailIssues}>
                              <Text style={styles.title}>Issues:</Text>
                              {result.issues.map((issue, issueIdx) => (
                                <Text key={issueIdx} style={[
                                  styles.reportDetailIssue,
                                  issue.severity === 'critical' && { borderLeftColor: '#EF4444' },
                                  issue.severity === 'warning' && { borderLeftColor: '#F59E0B' },
                                ]}>
                                  • {issue.description} ({issue.occurrences}x)
                                </Text>
                              ))}
                            </View>
                          )}
                          
                          {result.recommendations.length > 0 && (
                            <View style={styles.reportRecommendations}>
                              <Text style={styles.title}>Recommendations:</Text>
                              {result.recommendations.map((rec, recIdx) => (
                                <Text key={recIdx} style={styles.reportRecommendation}>
                                  • {rec}
                                </Text>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                    
                    {/* Overall Recommendations */}
                    <View style={styles.reportSection}>
                      <Text style={styles.reportSectionTitle}>💡 Recommendations</Text>
                      
                      {detailedReport.recommendations.critical.length > 0 && (
                        <View style={styles.reportSection}>
                          <Text style={styles.reportSectionTitle}>🔴 Critical</Text>
                          {detailedReport.recommendations.critical.map((rec, idx) => (
                            <Text key={idx} style={[styles.reportRecommendation, { color: '#EF4444' }]}>• {rec}</Text>
                          ))}
                        </View>
                      )}
                      
                      {detailedReport.recommendations.improvements.length > 0 && (
                        <View style={styles.reportSection}>
                          <Text style={styles.reportSectionTitle}>🟡 Improvements</Text>
                          {detailedReport.recommendations.improvements.map((rec, idx) => (
                            <Text key={idx} style={[styles.reportRecommendation, { color: '#F59E0B' }]}>• {rec}</Text>
                          ))}
                        </View>
                      )}
                      
                      {detailedReport.recommendations.bestPractices.length > 0 && (
                        <View style={styles.reportSection}>
                          <Text style={styles.reportSectionTitle}>✅ Best Practices</Text>
                          {detailedReport.recommendations.bestPractices.map((rec, idx) => (
                            <Text key={idx} style={[styles.reportRecommendation, { color: '#10B981' }]}>• {rec}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              )}
              
              {/* Legend */}
              <View style={styles.legend}>
                <Text style={styles.legendTitle}>Performance Grading:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  <Text style={[styles.gradeBadge, { backgroundColor: '#10B981', fontSize: 10 }]}>A+</Text>
                  <Text style={{ color: '#6B7280', fontSize: 10 }}> 90+ Excellent</Text>
                  <Text style={[styles.gradeBadge, { backgroundColor: '#34D399', fontSize: 10, marginLeft: 8 }]}>A</Text>
                  <Text style={{ color: '#6B7280', fontSize: 10 }}> 85+ Great</Text>
                  <Text style={[styles.gradeBadge, { backgroundColor: '#F59E0B', fontSize: 10, marginLeft: 8 }]}>C</Text>
                  <Text style={{ color: '#6B7280', fontSize: 10 }}> 65+ Acceptable</Text>
                  <Text style={[styles.gradeBadge, { backgroundColor: '#EF4444', fontSize: 10, marginLeft: 8 }]}>F</Text>
                  <Text style={{ color: '#6B7280', fontSize: 10 }}> {"<"}60 Poor</Text>
                </View>
                <Text style={styles.legendTitle}>Budget Thresholds:</Text>
                <Text style={styles.legendItem}>• TTI: <Text style={{color: '#10B981'}}>≤100ms</Text> | <Text style={{color: '#34D399'}}>≤200ms</Text> | <Text style={{color: '#F59E0B'}}>≤500ms</Text> | <Text style={{color: '#EF4444'}}>{">"}500ms</Text></Text>
                <Text style={styles.legendItem}>• FPS: <Text style={{color: '#10B981'}}>≥58</Text> | <Text style={{color: '#34D399'}}>≥50</Text> | <Text style={{color: '#F59E0B'}}>≥30</Text> | <Text style={{color: '#EF4444'}}>{"<"}30</Text> (Native)</Text>
                <Text style={styles.legendItem}>• Drops: <Text style={{color: '#10B981'}}>≤2</Text> | <Text style={{color: '#34D399'}}>≤5</Text> | <Text style={{color: '#F59E0B'}}>≤10</Text> | <Text style={{color: '#EF4444'}}>{">"}10</Text> frames</Text>
                <Text style={styles.legendItem}>• Jank%: <Text style={{color: '#10B981'}}>≤20%</Text> | <Text style={{color: '#F59E0B'}}>≤50%</Text> | <Text style={{color: '#EF4444'}}>{">"}50%</Text> (Native score)</Text>
                <Text style={styles.legendItem}>• Memory: <Text style={{color: '#10B981'}}>≤1MB</Text> | <Text style={{color: '#34D399'}}>≤3MB</Text> | <Text style={{color: '#F59E0B'}}>≤5MB</Text> | <Text style={{color: '#EF4444'}}>{">"}5MB</Text></Text>
                <Text style={styles.legendItem}>• Passes: <Text style={{color: '#4CAF50'}}>2 optimal</Text> | <Text style={{color: '#F59E0B'}}>{">"}3 re-renders</Text> (loading/interactive)</Text>
                <Text style={styles.legendItem}>• Touch: <Text style={{color: '#10B981'}}>≤8ms</Text> | <Text style={{color: '#34D399'}}>≤16ms</Text> | <Text style={{color: '#F59E0B'}}>≤32ms</Text> | <Text style={{color: '#EF4444'}}>{">"}32ms</Text></Text>
                <Text style={[styles.legendItem, {marginTop: 4}]}>• ❄️ = Cold start (first open) | 🔥 = Warm start (cached)</Text>
                <Text style={[styles.legendItem, {marginTop: 4, fontStyle: 'italic', fontSize: 9}]}>📊 Using native frame metrics when available for accurate measurements</Text>
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

            {/* Performance Summary - Shows all category winners */}
            {comparison && (
              <View style={[styles.section, styles.comparisonSection]}>
                <Text style={styles.sectionTitle}>🏆 Performance Winners by Category</Text>
                
                {/* Category Winners Grid */}
                <View style={styles.winnersContainer}>
                  {comparison.fpsBest && (
                    <View style={[styles.winnerRow, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                      <View style={styles.winnerCategory}>
                        <Text style={styles.categoryIcon}>📊</Text>
                        <Text style={styles.categoryName}>FPS Champion</Text>
                      </View>
                      <View style={styles.winnerInfo}>
                        <Text style={styles.winnerModal}>{comparison.fpsBest.name}</Text>
                        <Text style={styles.winnerMetric}>{comparison.fpsBest.value} fps</Text>
                      </View>
                    </View>
                  )}
                  
                  {comparison.mountBest && (
                    <View style={[styles.winnerRow, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                      <View style={styles.winnerCategory}>
                        <Text style={styles.categoryIcon}>🚀</Text>
                        <Text style={styles.categoryName}>Mount Speed</Text>
                      </View>
                      <View style={styles.winnerInfo}>
                        <Text style={styles.winnerModal}>{comparison.mountBest.name}</Text>
                        <Text style={styles.winnerMetric}>{comparison.mountBest.value}ms</Text>
                      </View>
                    </View>
                  )}
                  
                  {comparison.renderBest && (
                    <View style={[styles.winnerRow, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                      <View style={styles.winnerCategory}>
                        <Text style={styles.categoryIcon}>⚡</Text>
                        <Text style={styles.categoryName}>Update Speed</Text>
                      </View>
                      <View style={styles.winnerInfo}>
                        <Text style={styles.winnerModal}>{comparison.renderBest.name}</Text>
                        <Text style={styles.winnerMetric}>{comparison.renderBest.value}ms</Text>
                      </View>
                    </View>
                  )}
                  
                  {comparison.memoryBest && (
                    <View style={[styles.winnerRow, { backgroundColor: 'rgba(251, 146, 60, 0.1)' }]}>
                      <View style={styles.winnerCategory}>
                        <Text style={styles.categoryIcon}>💾</Text>
                        <Text style={styles.categoryName}>Memory Efficient</Text>
                      </View>
                      <View style={styles.winnerInfo}>
                        <Text style={styles.winnerModal}>{comparison.memoryBest.name}</Text>
                        <Text style={styles.winnerMetric}>{comparison.memoryBest.value}MB</Text>
                      </View>
                    </View>
                  )}
                  
                  {/* Overall Winner - Highlighted */}
                  <View style={[styles.winnerRow, styles.overallWinnerRow]}>
                    <View style={styles.winnerCategory}>
                      <Text style={styles.categoryIcon}>🥇</Text>
                      <Text style={styles.categoryName}>Overall Best</Text>
                    </View>
                    <View style={styles.winnerInfo}>
                      <Text style={[styles.winnerModal, styles.overallWinnerText]}>
                        {comparison.overallBest.name}
                      </Text>
                      <Text style={[styles.winnerMetric, styles.overallScoreText]}>
                        {comparison.overallBest.score}/100
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Performance Score Bar */}
                <View style={styles.scoreBarContainer}>
                  <Text style={styles.scoreBarLabel}>Overall Performance Score</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, { width: `${comparison.overallBest.score}%` }]} />
                  </View>
                </View>
              </View>
            )}
          </>
        )}
          </>
        ) : (
          /* List Performance Tab Content */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VirtualizedDataExplorer Performance</Text>
            <Text style={styles.instructions}>
              Test the performance of the VirtualizedDataExplorer component with various data structures
            </Text>
            <View style={{ marginTop: 16, flex: 1 }}>
              <VirtualizedDataExplorerBenchmarkFull />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Test Modals */}
      

      

      

      {activeModal === "60fps" && (
        <>
          {/* Rendering ClaudeModal60FPSClean */}
          <ClaudeModal60FPSClean
            key={`60fps-${testMode}-${modalRunIdRef.current}`}
            visible={true}
          onClose={() => stopBenchmark("60fps")}
          header={{
            title: "ClaudeModal60FPSClean",
            subtitle: `FPS: ${currentFps}`,
          }}
          persistenceKey="benchmark-60fps-modal"
          initialMode={testMode}
          initialHeight={resizeHeightRef.current}
          animatedHeight={modal60fpsHeightRef.current}
        >
          <TestContent />
          </ClaudeModal60FPSClean>
        </>
      )}
      {activeModal === "60fpsTest" && (
        <>
          {/* Rendering Modal60fpsTest */}
          <Modal60fpsTest
            key={`60fpsTest-${modalRunIdRef.current}`}
            visible={true}
          onClose={() => stopBenchmark("60fpsTest")}
          header={{
            title: "Modal60fpsTest (Height)",
            subtitle: `FPS: ${currentFps}`,
          }}
          initialHeight={resizeHeightRef.current}
          animatedHeight={modal60fpsTestHeightRef.current}
        >
          <TestContent />
          </Modal60fpsTest>
        </>
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
  tabNavigationContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#60A5FA",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabButtonTextActive: {
    color: "#60A5FA",
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
  buttonClear: {
    backgroundColor: "#DC2626",
    marginTop: 8,
  },
  buttonOptimization: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "#A855F7",
    borderWidth: 2,
  },
  optimizationTestSection: {
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  lastTestResults: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
  },
  lastTestTitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  lastTestText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
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
  // Table styles
  table: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  tableCell: {
    padding: 8,
    minWidth: 60,
    justifyContent: "center",
  },
  tableCellHeader: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  tableCellValue: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
  firstColumn: {
    minWidth: 70,
    textAlign: "left",
  },
  modalNameCell: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  scoreGood: {
    color: "#10B981",
    fontWeight: "600",
  },
  scoreOk: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  scoreBad: {
    color: "#EF4444",
    fontWeight: "600",
  },
  memoryLeak: {
    color: "#EF4444",
    fontWeight: "600",
  },
  memoryGood: {
    color: "#10B981",
    fontWeight: "600",
  },
  jankWarning: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  jankBad: {
    color: "#EF4444",
    fontWeight: "600",
  },
  ttiGood: {
    color: "#10B981",
    fontWeight: "600",
  },
  ttiOk: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  ttiBad: {
    color: "#EF4444",
    fontWeight: "600",
  },
  gradeCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 32,
  },
  legend: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 6,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  legendItem: {
    fontSize: 10,
    color: "#6B7280",
    marginLeft: 8,
    marginTop: 2,
  },
  // Summary styles
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryCategory: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryWinner: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
  },
  overallWinner: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  overallTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  overallName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 8,
  },
  overallScore: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
  },
  scoreBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
  },
  // New winner styles
  winnersContainer: {
    gap: 8,
  },
  winnerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  overallWinnerRow: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 2,
    borderColor: "#FBBF24",
    marginTop: 8,
  },
  winnerCategory: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  winnerInfo: {
    alignItems: "flex-end",
  },
  winnerModal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  winnerMetric: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10B981",
    marginTop: 2,
  },
  overallWinnerText: {
    fontSize: 14,
    color: "#FBBF24",
  },
  overallScoreText: {
    fontSize: 16,
    color: "#FBBF24",
  },
  scoreBarContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
  },
  scoreBarLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 8,
    textAlign: "center",
  },
  // Mode selector styles
  modeSelector: {
    marginBottom: 16,
  },
  modeSelectorLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  modeButtonActive: {
    backgroundColor: "rgba(14, 165, 233, 0.2)",
    borderColor: "#0EA5E9",
  },
  modeButtonText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  modeButtonTextActive: {
    color: "#0EA5E9",
    fontWeight: "600",
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
  resizeInfoCard: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  resizeInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  resizeInfoText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  resizeIndicator: {
    marginTop: 12,
    height: 100,
    backgroundColor: "#111827",
    borderRadius: 4,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
  },
  resizeIndicatorBar: {
    width: "80%",
    backgroundColor: "#0EA5E9",
    borderRadius: 2,
  },
  
  // Regression Analysis Styles
  regressionSection: {
    marginTop: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    overflow: "hidden",
  },
  regressionHeader: {
    padding: 12,
    backgroundColor: "#0F0F0F",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  regressionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  regressionSubtitle: {
    fontSize: 11,
    color: "#6B7280",
  },
  regressionContent: {
    padding: 12,
  },
  regressionCard: {
    backgroundColor: "#0F0F0F",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  regressionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  regressionModalName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  regressionOverall: {
    fontSize: 14,
    fontWeight: "bold",
  },
  regressionRunInfo: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 8,
  },
  regressionMetrics: {
    marginTop: 6,
  },
  regressionMetricTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  regressionMetricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: 2,
  },
  regressionMetricName: {
    fontSize: 10,
    color: "#6B7280",
    width: 80,
  },
  regressionMetricValue: {
    fontSize: 11,
    fontWeight: "600",
    marginRight: 6,
  },
  regressionMetricDetail: {
    fontSize: 9,
    color: "#4B5563",
  },
  regressionAllMetrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  regressionMiniMetric: {
    marginRight: 12,
    marginBottom: 4,
  },
  regressionMiniLabel: {
    fontSize: 9,
    color: "#6B7280",
  },
  regressionMiniValue: {
    fontSize: 10,
    fontWeight: "600",
  },
  
  // Production Monitoring Styles
  productionModeContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  productionToggle: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  productionToggleActive: {
    backgroundColor: "#059669",
    borderColor: "#10B981",
  },
  productionToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  productionToggleSubtext: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  productionReportButton: {
    backgroundColor: "#1E40AF",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  productionReportButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  productionReportSection: {
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
    marginTop: 16,
    overflow: "hidden",
  },
  productionReportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  productionReportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  productionReportClose: {
    padding: 4,
  },
  productionReportCloseText: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  productionReportContent: {
    padding: 12,
  },
  productionReportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productionReportLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  productionReportValue: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  productionReportSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 8,
  },
  productionReportMetrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  productionMetricCard: {
    backgroundColor: "#1A1A1A",
    padding: 8,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
  },
  productionMetricLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 4,
  },
  productionMetricValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  metricGood: {
    color: "#10B981",
  },
  metricOk: {
    color: "#F59E0B",
  },
  metricBad: {
    color: "#EF4444",
  },
  productionIssues: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 6,
  },
  productionIssue: {
    fontSize: 11,
    color: "#F59E0B",
    marginBottom: 4,
  },
  productionDeviceInfo: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 6,
  },
  productionDeviceText: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  // Detailed Report styles
  detailedReportSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
  },
  detailedReportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailedReportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  detailedReportClose: {
    padding: 8,
  },
  detailedReportCloseText: {
    fontSize: 20,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  detailedReportContent: {
    maxHeight: 400,
  },
  reportMetadata: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
  },
  reportMetadataText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  exportOptions: {
    marginBottom: 16,
  },
  exportOptionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  exportButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  exportButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reportSection: {
    marginBottom: 16,
  },
  reportSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  reportCard: {
    padding: 12,
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
    marginBottom: 8,
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  reportCardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 8,
  },
  reportCardMetrics: {
    marginTop: 8,
  },
  reportCardMetric: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  reportCardIssues: {
    marginTop: 8,
  },
  reportCardIssue: {
    fontSize: 11,
    color: "#EF4444",
    marginBottom: 2,
  },
  reportDetailCard: {
    padding: 12,
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
    marginBottom: 12,
  },
  reportDetailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  reportDetailRuns: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  reportDetailMetrics: {
    marginTop: 8,
  },
  reportDetailMetricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reportDetailMetricLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  reportDetailMetricValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reportDetailIssues: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  reportDetailIssue: {
    fontSize: 11,
    color: "#EF4444",
    marginBottom: 2,
  },
  reportRecommendations: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
  },
  reportRecommendation: {
    fontSize: 11,
    color: "#FCD34D",
    marginBottom: 4,
  },
});

export default ModalPerformanceComparison;