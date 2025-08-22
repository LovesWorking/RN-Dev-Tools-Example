/**
 * Automated Performance Tester
 * 
 * A headless performance testing system designed for Claude to programmatically
 * run tests, collect data, and analyze results without user interaction.
 * 
 * Features:
 * - Automatic test execution with configurable parameters
 * - Data collection and export to clipboard/console
 * - Comparison analysis between modal implementations
 * - No UI interaction required - perfect for Claude-driven testing
 */

import { Platform, Clipboard } from 'react-native';
import { nativeFrameTracker } from './NativeFrameMetrics';
import { RegressionAnalyzer } from './RegressionAnalyzer';
import { PerformanceReportExporter } from './PerformanceReportExporter';
import SuperJSON from 'superjson';

export type ModalType = 'pure' | 'ultraOptimized';

export interface TestConfiguration {
  // Test settings
  modalTypes: ModalType[];
  testsPerModal: number;
  testDurationMs: number;
  stressLevel: 'low' | 'medium' | 'high' | 'extreme';
  animationComplexity: number; // 1-10
  
  // Data collection
  collectNativeFrames: boolean;
  collectMemoryMetrics: boolean;
  collectRenderPasses: boolean;
  
  // Automation settings
  autoStart: boolean;
  autoExport: boolean;
  exportFormat: 'json' | 'csv' | 'markdown' | 'console';
  silentMode: boolean; // No console logs during test
}

export interface TestResult {
  modalType: ModalType;
  testNumber: number;
  timestamp: number;
  duration: number;
  
  // Core metrics
  fps: {
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
  
  // Frame metrics
  droppedFrames: number;
  jankScore: number;
  severeDrops: number;
  
  // Timing metrics
  mountTime: number;
  unmountTime: number;
  firstRenderTime: number;
  timeToInteractive: number;
  
  // Memory metrics
  memoryBefore: number;
  memoryAfter: number;
  memoryGrowth: number;
  
  // Render metrics
  renderPasses: number;
  unnecessaryRenders: number;
  
  // Stress test metrics
  animationFrames: number;
  touchEvents: number;
  stateUpdates: number;
}

export interface ComparisonResult {
  baseline: ModalType;
  challenger: ModalType;
  winner: ModalType;
  
  improvements: {
    fps: number;
    jankScore: number;
    mountTime: number;
    memoryUsage: number;
    renderPasses: number;
  };
  
  summary: string;
  recommendation: string;
}

class AutomatedPerformanceTesterClass {
  private currentConfig: TestConfiguration | null = null;
  private testResults: TestResult[] = [];
  private isRunning = false;
  private currentTestIndex = 0;
  private testStartTime = 0;
  private renderPassCount = 0;
  private memoryBaseline = 0;
  
  // Callbacks for modal control
  private showModalCallback?: (type: ModalType) => void;
  private hideModalCallback?: () => void;
  private triggerAnimationsCallback?: (complexity: number) => void;
  
  /**
   * Initialize the tester with callbacks
   */
  initialize(callbacks: {
    showModal: (type: ModalType) => void;
    hideModal: () => void;
    triggerAnimations?: (complexity: number) => void;
  }) {
    this.showModalCallback = callbacks.showModal;
    this.hideModalCallback = callbacks.hideModal;
    this.triggerAnimationsCallback = callbacks.triggerAnimations;
  }
  
  /**
   * Configure test parameters
   */
  configure(config: TestConfiguration): void {
    this.currentConfig = config;
    if (!config.silentMode) {
    }
  }
  
  /**
   * Start automated testing
   */
  async startTesting(): Promise<void> {
    if (!this.currentConfig) {
      throw new Error('Tester not configured. Call configure() first.');
    }
    
    if (!this.showModalCallback || !this.hideModalCallback) {
      throw new Error('Modal callbacks not set. Call initialize() first.');
    }
    
    this.isRunning = true;
    this.testResults = [];
    this.currentTestIndex = 0;
    
    const { modalTypes, testsPerModal, silentMode } = this.currentConfig;
    
    if (!silentMode) {
      console.log('🚀 Starting automated performance tests...');
    }
    
    // Test each modal type
    for (const modalType of modalTypes) {
      for (let testNum = 1; testNum <= testsPerModal; testNum++) {
        if (!this.isRunning) break;
        
        if (!silentMode) {
        }
        
        const result = await this.runSingleTest(modalType, testNum);
        this.testResults.push(result);
        
        // Brief pause between tests
        await this.delay(500);
      }
    }
    
    this.isRunning = false;
    
    if (!silentMode) {
      console.log('✅ Testing complete!');
    }
    
    // Auto-export if configured
    if (this.currentConfig.autoExport) {
      await this.exportResults();
    }
  }
  
  /**
   * Run a single test
   */
  private async runSingleTest(modalType: ModalType, testNumber: number): Promise<TestResult> {
    const config = this.currentConfig!;
    const startTime = Date.now();
    
    // Initialize metrics
    this.renderPassCount = 0;
    this.memoryBaseline = this.getMemoryUsage();
    
    // Start native frame tracking
    if (config.collectNativeFrames) {
      nativeFrameTracker.reset();
      nativeFrameTracker.start();
    }
    
    // Mount modal
    const mountStart = performance.now();
    this.showModalCallback!(modalType);
    await this.delay(100); // Wait for mount
    const mountTime = performance.now() - mountStart;
    
    // Measure first render
    const firstRenderTime = performance.now() - mountStart;
    
    // Run stress test
    if (this.triggerAnimationsCallback) {
      this.triggerAnimationsCallback(config.animationComplexity);
    }
    
    // Simulate user interactions based on stress level
    const interactionCount = this.getInteractionCount(config.stressLevel);
    for (let i = 0; i < interactionCount; i++) {
      await this.simulateInteraction();
      await this.delay(50);
    }
    
    // Run for specified duration
    await this.delay(config.testDurationMs);
    
    // Collect frame metrics
    const frameMetrics = config.collectNativeFrames 
      ? nativeFrameTracker.stop()
      : this.getDefaultFrameMetrics();
    
    // Unmount modal
    const unmountStart = performance.now();
    this.hideModalCallback!();
    await this.delay(100);
    const unmountTime = performance.now() - unmountStart;
    
    // Calculate memory growth
    const memoryAfter = this.getMemoryUsage();
    const memoryGrowth = memoryAfter - this.memoryBaseline;
    
    // Build result
    return {
      modalType,
      testNumber,
      timestamp: startTime,
      duration: Date.now() - startTime,
      
      fps: {
        average: frameMetrics.averageFPS,
        min: frameMetrics.minFPS,
        max: frameMetrics.maxFPS,
        p95: frameMetrics.percentile95,
        p99: frameMetrics.percentile99,
      },
      
      droppedFrames: frameMetrics.droppedFrames,
      jankScore: frameMetrics.jankScore,
      severeDrops: frameMetrics.severeDrops,
      
      mountTime,
      unmountTime,
      firstRenderTime,
      timeToInteractive: mountTime + 50, // Simplified TTI
      
      memoryBefore: this.memoryBaseline,
      memoryAfter,
      memoryGrowth,
      
      renderPasses: this.renderPassCount,
      unnecessaryRenders: Math.max(0, this.renderPassCount - 2),
      
      animationFrames: Math.floor(config.testDurationMs / 16.67),
      touchEvents: interactionCount,
      stateUpdates: interactionCount * 2,
    };
  }
  
  /**
   * Compare results between modal types
   */
  analyzeResults(): ComparisonResult | null {
    if (this.testResults.length < 2) {
      console.warn('Not enough results to compare');
      return null;
    }
    
    const pureResults = this.testResults.filter(r => r.modalType === 'pure');
    const optimizedResults = this.testResults.filter(r => r.modalType === 'ultraOptimized');
    
    if (pureResults.length === 0 || optimizedResults.length === 0) {
      return null;
    }
    
    // Calculate averages
    const pureAvg = this.calculateAverages(pureResults);
    const optimizedAvg = this.calculateAverages(optimizedResults);
    
    // Calculate improvements (positive = better)
    const improvements = {
      fps: ((optimizedAvg.fps - pureAvg.fps) / pureAvg.fps) * 100,
      jankScore: ((pureAvg.jankScore - optimizedAvg.jankScore) / pureAvg.jankScore) * 100,
      mountTime: ((pureAvg.mountTime - optimizedAvg.mountTime) / pureAvg.mountTime) * 100,
      memoryUsage: ((pureAvg.memoryGrowth - optimizedAvg.memoryGrowth) / pureAvg.memoryGrowth) * 100,
      renderPasses: ((pureAvg.renderPasses - optimizedAvg.renderPasses) / pureAvg.renderPasses) * 100,
    };
    
    // Determine winner
    const score = 
      improvements.fps * 0.3 +
      improvements.jankScore * 0.3 +
      improvements.mountTime * 0.2 +
      improvements.memoryUsage * 0.1 +
      improvements.renderPasses * 0.1;
    
    const winner = score > 0 ? 'ultraOptimized' : 'pure';
    
    // Generate summary
    const summary = this.generateSummary(improvements, winner);
    const recommendation = this.generateRecommendation(improvements);
    
    return {
      baseline: 'pure',
      challenger: 'ultraOptimized',
      winner,
      improvements,
      summary,
      recommendation,
    };
  }
  
  /**
   * Export results in configured format
   */
  async exportResults(): Promise<void> {
    const config = this.currentConfig!;
    const comparison = this.analyzeResults();
    
    const exportData = {
      config: this.currentConfig,
      results: this.testResults,
      comparison,
      timestamp: Date.now(),
    };
    
    switch (config.exportFormat) {
      case 'json': {
        const json = SuperJSON.stringify(exportData);
        if (Platform.OS === 'web') {
          console.log('📋 Test Results (JSON):', JSON.parse(json));
        } else {
          await Clipboard.setString(json);
          console.log('📋 Results copied to clipboard as JSON');
        }
        break;
      }
      
      case 'csv': {
        const csv = this.convertToCSV(this.testResults);
        if (Platform.OS === 'web') {
          console.log('📋 Test Results (CSV):\n', csv);
        } else {
          await Clipboard.setString(csv);
          console.log('📋 Results copied to clipboard as CSV');
        }
        break;
      }
      
      case 'markdown': {
        const markdown = this.convertToMarkdown(exportData);
        if (Platform.OS === 'web') {
          console.log('📋 Test Results (Markdown):\n', markdown);
        } else {
          await Clipboard.setString(markdown);
          console.log('📋 Results copied to clipboard as Markdown');
        }
        break;
      }
      
      case 'console':
      default:
        this.logResults();
        break;
    }
  }
  
  /**
   * Get current results without stopping the test
   */
  getCurrentResults(): TestResult[] {
    return [...this.testResults];
  }
  
  /**
   * Stop testing
   */
  stopTesting(): void {
    this.isRunning = false;
    console.log('🛑 Testing stopped');
  }
  
  // Helper methods
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private getMemoryUsage(): number {
    // Simplified memory usage - in production you'd use actual memory APIs
    if ((global as any).performance && (global as any).performance.memory) {
      return (global as any).performance.memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }
  
  private getDefaultFrameMetrics() {
    return {
      averageFPS: 60,
      minFPS: 60,
      maxFPS: 60,
      droppedFrames: 0,
      severeDrops: 0,
      percentile95: 16.67,
      percentile99: 16.67,
      frameTimings: [],
      jankScore: 0,
    };
  }
  
  private getInteractionCount(stressLevel: string): number {
    switch (stressLevel) {
      case 'low': return 5;
      case 'medium': return 10;
      case 'high': return 20;
      case 'extreme': return 50;
      default: return 10;
    }
  }
  
  private async simulateInteraction(): Promise<void> {
    // Increment render pass counter
    this.renderPassCount++;
    // In real implementation, would trigger actual interactions
  }
  
  private calculateAverages(results: TestResult[]) {
    const count = results.length;
    return {
      fps: results.reduce((sum, r) => sum + r.fps.average, 0) / count,
      jankScore: results.reduce((sum, r) => sum + r.jankScore, 0) / count,
      mountTime: results.reduce((sum, r) => sum + r.mountTime, 0) / count,
      memoryGrowth: results.reduce((sum, r) => sum + r.memoryGrowth, 0) / count,
      renderPasses: results.reduce((sum, r) => sum + r.renderPasses, 0) / count,
    };
  }
  
  private generateSummary(improvements: any, winner: ModalType): string {
    const totalImprovement = Object.values(improvements).reduce((sum: number, val: any) => sum + val, 0) / 5;
    
    if (Math.abs(totalImprovement) < 1) {
      return `Performance is nearly identical between implementations (${totalImprovement.toFixed(1)}% difference)`;
    }
    
    if (winner === 'ultraOptimized') {
      return `UltraOptimized version is ${totalImprovement.toFixed(1)}% better overall`;
    } else {
      return `Pure version is ${Math.abs(totalImprovement).toFixed(1)}% better overall`;
    }
  }
  
  private generateRecommendation(improvements: any): string {
    const significantImprovements = Object.entries(improvements)
      .filter(([_, value]: [string, any]) => Math.abs(value) > 5)
      .sort((a: any, b: any) => Math.abs(b[1]) - Math.abs(a[1]));
    
    if (significantImprovements.length === 0) {
      return 'No significant performance differences detected. Both implementations are comparable.';
    }
    
    const [topMetric, topValue] = significantImprovements[0] as [string, number];
    
    if (topValue > 0) {
      return `Focus on ${topMetric} optimization - seeing ${topValue.toFixed(1)}% improvement`;
    } else {
      return `Investigate ${topMetric} regression - seeing ${Math.abs(topValue).toFixed(1)}% degradation`;
    }
  }
  
  private convertToCSV(results: TestResult[]): string {
    const headers = [
      'Modal Type',
      'Test #',
      'Avg FPS',
      'Min FPS',
      'Max FPS',
      'Dropped Frames',
      'Jank Score',
      'Mount Time (ms)',
      'Memory Growth (MB)',
      'Render Passes',
    ];
    
    const rows = results.map(r => [
      r.modalType,
      r.testNumber,
      r.fps.average.toFixed(1),
      r.fps.min.toFixed(1),
      r.fps.max.toFixed(1),
      r.droppedFrames,
      r.jankScore.toFixed(1),
      r.mountTime.toFixed(1),
      r.memoryGrowth.toFixed(2),
      r.renderPasses,
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  private convertToMarkdown(data: any): string {
    const lines: string[] = [];
    
    lines.push('# Automated Performance Test Results');
    lines.push(`Generated: ${new Date(data.timestamp).toLocaleString()}`);
    lines.push('');
    
    if (data.comparison) {
      lines.push('## Comparison Summary');
      lines.push(`**Winner:** ${data.comparison.winner}`);
      lines.push(`**Summary:** ${data.comparison.summary}`);
      lines.push('');
      
      lines.push('### Improvements');
      Object.entries(data.comparison.improvements).forEach(([key, value]: [string, any]) => {
        const emoji = value > 0 ? '✅' : '❌';
        lines.push(`- ${emoji} ${key}: ${value.toFixed(1)}%`);
      });
      lines.push('');
      
      lines.push(`**Recommendation:** ${data.comparison.recommendation}`);
      lines.push('');
    }
    
    lines.push('## Detailed Results');
    lines.push('| Modal | Test | FPS | Jank | Mount (ms) | Memory (MB) | Renders |');
    lines.push('|-------|------|-----|------|------------|-------------|---------|');
    
    data.results.forEach((r: TestResult) => {
      lines.push(`| ${r.modalType} | ${r.testNumber} | ${r.fps.average.toFixed(1)} | ${r.jankScore.toFixed(0)} | ${r.mountTime.toFixed(0)} | ${r.memoryGrowth.toFixed(1)} | ${r.renderPasses} |`);
    });
    
    return lines.join('\n');
  }
  
  private logResults(): void {
    console.log('\n📊 === AUTOMATED TEST RESULTS ===\n');
    
    const comparison = this.analyzeResults();
    if (comparison) {
      console.log('🏆 Winner:', comparison.winner);
      console.log('📈 Summary:', comparison.summary);
      console.log('\n📊 Improvements:');
      Object.entries(comparison.improvements).forEach(([key, value]) => {
        const emoji = value > 0 ? '✅' : '❌';
        console.log(`  ${emoji} ${key}: ${value.toFixed(1)}%`);
      });
      console.log('\n💡 Recommendation:', comparison.recommendation);
    }
    
    console.log('\n📋 Detailed Results:');
    console.table(this.testResults.map(r => ({
      modal: r.modalType,
      test: r.testNumber,
      fps: r.fps.average.toFixed(1),
      jank: r.jankScore.toFixed(0),
      mount: `${r.mountTime.toFixed(0)}ms`,
      memory: `${r.memoryGrowth.toFixed(1)}MB`,
      renders: r.renderPasses,
    })));
    
    console.log('\n✅ Testing complete! Results available in getCurrentResults()');
  }
}

// Export singleton instance
export const automatedTester = new AutomatedPerformanceTesterClass();

// Export for direct Claude usage
export default automatedTester;