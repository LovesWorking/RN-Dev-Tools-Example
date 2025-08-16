/**
 * Regression Analyzer for Performance Metrics
 * 
 * Tracks performance changes between test runs to identify improvements
 * and regressions. Shows exact percentage changes for each metric.
 */

export interface MetricChange {
  current: number;
  previous: number;
  change: number; // Absolute change
  changePercent: number; // Percentage change
  improved: boolean; // Whether this is an improvement
  significant: boolean; // Whether change is statistically significant (>5%)
}

export interface RegressionAnalysis {
  modalType: string;
  timestamp: number;
  baseline?: {
    timestamp: number;
    runIndex: number;
  };
  current: {
    timestamp: number;
    runIndex: number;
  };
  metrics: {
    fps?: MetricChange;
    tti?: MetricChange;
    mountTime?: MetricChange;
    droppedFrames?: MetricChange;
    jankScore?: MetricChange;
    memory?: MetricChange;
    renderPasses?: MetricChange;
    touchResponse?: MetricChange;
  };
  overallImprovement: number; // Weighted average improvement percentage
  summary: {
    improved: string[];
    regressed: string[];
    unchanged: string[];
    significantImprovements: string[];
    significantRegressions: string[];
  };
}

export class RegressionAnalyzer {
  private static SIGNIFICANCE_THRESHOLD = 5; // 5% change is considered significant
  private static METRICS_CONFIG = {
    fps: { higherBetter: true, weight: 0.25, displayName: 'FPS' },
    tti: { higherBetter: false, weight: 0.20, displayName: 'Time to Interactive' },
    mountTime: { higherBetter: false, weight: 0.15, displayName: 'Mount Time' },
    droppedFrames: { higherBetter: false, weight: 0.15, displayName: 'Dropped Frames' },
    jankScore: { higherBetter: false, weight: 0.10, displayName: 'Jank Score' },
    memory: { higherBetter: false, weight: 0.10, displayName: 'Memory Growth' },
    renderPasses: { higherBetter: false, weight: 0.05, displayName: 'Render Passes' },
    touchResponse: { higherBetter: false, weight: 0.05, displayName: 'Touch Response' },
  };
  
  /**
   * Analyze regression between two benchmark results
   */
  static analyze(current: any, previous: any): RegressionAnalysis | null {
    if (!current || !previous) return null;
    if (current.modalType !== previous.modalType) return null;
    
    const metrics: RegressionAnalysis['metrics'] = {};
    const summary = {
      improved: [] as string[],
      regressed: [] as string[],
      unchanged: [] as string[],
      significantImprovements: [] as string[],
      significantRegressions: [] as string[],
    };
    
    // Analyze FPS
    if (current.nativeFrameMetrics?.averageFPS || current.mobileFPSData?.averageFPS) {
      const currentFPS = current.nativeFrameMetrics?.averageFPS || current.mobileFPSData?.averageFPS || current.fpsData.averageFPS;
      const previousFPS = previous.nativeFrameMetrics?.averageFPS || previous.mobileFPSData?.averageFPS || previous.fpsData.averageFPS;
      
      metrics.fps = this.calculateMetricChange(currentFPS, previousFPS, true, 'FPS');
      this.categorizeChange(metrics.fps, 'FPS', summary);
    }
    
    // Analyze TTI
    if (current.shopifyMetrics?.interactiveTimeMs && previous.shopifyMetrics?.interactiveTimeMs) {
      metrics.tti = this.calculateMetricChange(
        current.shopifyMetrics.interactiveTimeMs,
        previous.shopifyMetrics.interactiveTimeMs,
        false,
        'Time to Interactive'
      );
      this.categorizeChange(metrics.tti, 'Time to Interactive', summary);
    }
    
    // Analyze Mount Time
    const currentMount = current.shopifyMetrics?.loadingTimeMs || current.renderMetrics?.mountTime;
    const previousMount = previous.shopifyMetrics?.loadingTimeMs || previous.renderMetrics?.mountTime;
    if (currentMount && previousMount) {
      metrics.mountTime = this.calculateMetricChange(currentMount, previousMount, false, 'Mount Time');
      this.categorizeChange(metrics.mountTime, 'Mount Time', summary);
    }
    
    // Analyze Dropped Frames
    const currentDropped = current.nativeFrameMetrics?.droppedFrames ?? current.mobileFPSData?.jankCount;
    const previousDropped = previous.nativeFrameMetrics?.droppedFrames ?? previous.mobileFPSData?.jankCount;
    if (currentDropped !== undefined && previousDropped !== undefined) {
      metrics.droppedFrames = this.calculateMetricChange(currentDropped, previousDropped, false, 'Dropped Frames');
      this.categorizeChange(metrics.droppedFrames, 'Dropped Frames', summary);
    }
    
    // Analyze Jank Score
    if (current.nativeFrameMetrics?.jankScore !== undefined && previous.nativeFrameMetrics?.jankScore !== undefined) {
      metrics.jankScore = this.calculateMetricChange(
        current.nativeFrameMetrics.jankScore,
        previous.nativeFrameMetrics.jankScore,
        false,
        'Jank Score'
      );
      this.categorizeChange(metrics.jankScore, 'Jank Score', summary);
    }
    
    // Analyze Memory
    if (current.memoryMetrics?.memoryGrowthMB !== undefined && previous.memoryMetrics?.memoryGrowthMB !== undefined) {
      metrics.memory = this.calculateMetricChange(
        current.memoryMetrics.memoryGrowthMB,
        previous.memoryMetrics.memoryGrowthMB,
        false,
        'Memory Growth'
      );
      this.categorizeChange(metrics.memory, 'Memory Growth', summary);
    }
    
    // Analyze Render Passes
    if (current.shopifyMetrics?.renderPasses && previous.shopifyMetrics?.renderPasses) {
      metrics.renderPasses = this.calculateMetricChange(
        current.shopifyMetrics.renderPasses,
        previous.shopifyMetrics.renderPasses,
        false,
        'Render Passes'
      );
      this.categorizeChange(metrics.renderPasses, 'Render Passes', summary);
    }
    
    // Analyze Touch Response
    if (current.shopifyMetrics?.touchEventProcessingMs !== undefined && 
        previous.shopifyMetrics?.touchEventProcessingMs !== undefined) {
      metrics.touchResponse = this.calculateMetricChange(
        current.shopifyMetrics.touchEventProcessingMs,
        previous.shopifyMetrics.touchEventProcessingMs,
        false,
        'Touch Response'
      );
      this.categorizeChange(metrics.touchResponse, 'Touch Response', summary);
    }
    
    // Calculate overall improvement
    const overallImprovement = this.calculateOverallImprovement(metrics);
    
    return {
      modalType: current.modalType,
      timestamp: Date.now(),
      baseline: previous ? {
        timestamp: previous.timestamp,
        runIndex: 0, // Will be set by caller
      } : undefined,
      current: {
        timestamp: current.timestamp,
        runIndex: 1, // Will be set by caller
      },
      metrics,
      overallImprovement,
      summary,
    };
  }
  
  /**
   * Calculate change between two metric values
   */
  private static calculateMetricChange(
    current: number,
    previous: number,
    higherBetter: boolean,
    metricName: string
  ): MetricChange {
    const change = current - previous;
    const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
    
    // Determine if improved based on metric type
    const improved = higherBetter ? change > 0 : change < 0;
    const significant = Math.abs(changePercent) >= this.SIGNIFICANCE_THRESHOLD;
    
    return {
      current,
      previous,
      change,
      changePercent: Math.round(changePercent * 10) / 10,
      improved,
      significant,
    };
  }
  
  /**
   * Categorize change into summary buckets
   */
  private static categorizeChange(
    metricChange: MetricChange,
    metricName: string,
    summary: RegressionAnalysis['summary']
  ) {
    if (Math.abs(metricChange.changePercent) < 1) {
      summary.unchanged.push(metricName);
    } else if (metricChange.improved) {
      summary.improved.push(metricName);
      if (metricChange.significant) {
        summary.significantImprovements.push(metricName);
      }
    } else {
      summary.regressed.push(metricName);
      if (metricChange.significant) {
        summary.significantRegressions.push(metricName);
      }
    }
  }
  
  /**
   * Calculate weighted overall improvement percentage
   */
  private static calculateOverallImprovement(metrics: RegressionAnalysis['metrics']): number {
    let totalWeight = 0;
    let weightedImprovement = 0;
    
    Object.entries(metrics).forEach(([key, metricChange]) => {
      if (metricChange) {
        const config = this.METRICS_CONFIG[key as keyof typeof this.METRICS_CONFIG];
        if (config) {
          const improvement = metricChange.improved ? 
            Math.abs(metricChange.changePercent) : 
            -Math.abs(metricChange.changePercent);
          
          weightedImprovement += improvement * config.weight;
          totalWeight += config.weight;
        }
      }
    });
    
    return totalWeight > 0 ? Math.round((weightedImprovement / totalWeight) * 10) / 10 : 0;
  }
  
  /**
   * Format metric change for display
   */
  static formatChange(change: MetricChange, unit: string = ''): string {
    const arrow = change.improved ? '↑' : '↓';
    const color = change.improved ? '🟢' : '🔴';
    const percentStr = `${change.changePercent > 0 ? '+' : ''}${change.changePercent}%`;
    
    return `${color} ${arrow} ${percentStr} (${change.previous}${unit} → ${change.current}${unit})`;
  }
  
  /**
   * Generate human-readable summary
   */
  static generateSummary(analysis: RegressionAnalysis): string {
    const lines: string[] = [];
    
    if (analysis.overallImprovement > 0) {
      lines.push(`✅ Overall Performance Improved by ${analysis.overallImprovement}%`);
    } else if (analysis.overallImprovement < 0) {
      lines.push(`⚠️ Overall Performance Regressed by ${Math.abs(analysis.overallImprovement)}%`);
    } else {
      lines.push(`➖ Performance Unchanged`);
    }
    
    if (analysis.summary.significantImprovements.length > 0) {
      lines.push(`\n🎯 Significant Improvements:`);
      analysis.summary.significantImprovements.forEach(metric => {
        const change = analysis.metrics[metric.toLowerCase().replace(/ /g, '') as keyof typeof analysis.metrics];
        if (change) {
          lines.push(`  • ${metric}: ${this.formatChange(change)}`);
        }
      });
    }
    
    if (analysis.summary.significantRegressions.length > 0) {
      lines.push(`\n⚠️ Significant Regressions:`);
      analysis.summary.significantRegressions.forEach(metric => {
        const change = analysis.metrics[metric.toLowerCase().replace(/ /g, '') as keyof typeof analysis.metrics];
        if (change) {
          lines.push(`  • ${metric}: ${this.formatChange(change)}`);
        }
      });
    }
    
    return lines.join('\n');
  }
}