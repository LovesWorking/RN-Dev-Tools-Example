/**
 * Performance Report Exporter
 * 
 * Generates detailed performance reports in multiple formats:
 * - JSON: Complete data for analysis
 * - CSV: For spreadsheet analysis
 * - Markdown: Human-readable reports
 * - Share: Formatted text for sharing
 */

import { Platform, Share, Clipboard } from 'react-native';
import SuperJSON from 'superjson';

export interface DetailedPerformanceReport {
  metadata: {
    reportId: string;
    generatedAt: string;
    platform: string;
    deviceModel: string;
    osVersion: string;
    appVersion: string;
    testDuration: number;
    totalTests: number;
  };
  
  summary: {
    bestPerformer: {
      name: string;
      score: number;
      keyMetrics: {
        fps: number;
        tti: number;
        jankCount: number;
        memoryGrowth: number;
      };
    };
    worstPerformer: {
      name: string;
      score: number;
      issues: string[];
    };
    averageMetrics: {
      fps: number;
      tti: number;
      mountTime: number;
      jankCount: number;
      memoryGrowth: number;
      renderPasses: number;
    };
  };
  
  detailedResults: Array<{
    modalName: string;
    testRuns: number;
    metrics: {
      // Performance metrics
      fps: { avg: number; min: number; max: number; p95: number };
      tti: { avg: number; min: number; max: number; p95: number };
      mountTime: { avg: number; min: number; max: number };
      renderPasses: { avg: number; min: number; max: number };
      
      // Frame metrics
      droppedFrames: { total: number; perRun: number };
      jankScore: { avg: number; max: number };
      frameTimings: { p50: number; p95: number; p99: number };
      
      // Memory metrics
      memoryGrowth: { avg: number; min: number; max: number };
      memoryLeaks: number;
      
      // Touch & interaction
      touchLatency: { avg: number; max: number };
      
      // Cold vs warm starts
      coldStarts: { count: number; avgTTI: number };
      warmStarts: { count: number; avgTTI: number };
    };
    
    issues: Array<{
      type: string;
      severity: 'critical' | 'warning' | 'info';
      description: string;
      occurrences: number;
    }>;
    
    recommendations: string[];
  }>;
  
  comparisons: Array<{
    modalA: string;
    modalB: string;
    improvements: Record<string, number>; // Percentage improvements
    regressions: Record<string, number>; // Percentage regressions
    winner: string;
  }>;
  
  trends: {
    performanceOverTime: Array<{
      timestamp: number;
      modalName: string;
      score: number;
      fps: number;
      tti: number;
    }>;
    
    regressionHistory: Array<{
      timestamp: number;
      fromRun: number;
      toRun: number;
      change: number;
      metric: string;
    }>;
  };
  
  recommendations: {
    critical: string[];
    improvements: string[];
    bestPractices: string[];
  };
}

export class PerformanceReportExporter {
  /**
   * Generate a detailed performance report from test results
   */
  static generateDetailedReport(results: any[], regressionAnalysis: Map<string, any>): DetailedPerformanceReport {
    const now = new Date();
    const groupedResults = this.groupResultsByModal(results);
    
    // Calculate summary metrics
    const summary = this.calculateSummary(results);
    
    // Generate detailed results for each modal
    const detailedResults = this.generateDetailedResults(groupedResults);
    
    // Generate comparisons
    const comparisons = this.generateComparisons(results, regressionAnalysis);
    
    // Generate trends
    const trends = this.generateTrends(results, regressionAnalysis);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(detailedResults);
    
    return {
      metadata: {
        reportId: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        generatedAt: now.toISOString(),
        platform: Platform.OS,
        deviceModel: this.getDeviceModel(),
        osVersion: Platform.Version.toString(),
        appVersion: '1.0.0',
        testDuration: this.calculateTestDuration(results),
        totalTests: results.length,
      },
      summary,
      detailedResults,
      comparisons,
      trends,
      recommendations,
    };
  }
  
  /**
   * Export report as JSON
   */
  static async exportAsJSON(report: DetailedPerformanceReport): Promise<string> {
    // Use SuperJSON for better serialization support
    const serialized = SuperJSON.stringify(report);
    const formatted = JSON.stringify(JSON.parse(serialized), null, 2);
    
    if (Platform.OS === 'web') {
      // Web download
      const blob = new Blob([formatted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${report.metadata.reportId}.json`;
      a.click();
      return 'Downloaded to your computer';
    } else {
      // Mobile - copy to clipboard
      await Clipboard.setString(formatted);
      return 'Copied to clipboard';
    }
  }
  
  /**
   * Export report as CSV
   */
  static async exportAsCSV(report: DetailedPerformanceReport): Promise<string> {
    const csv = this.convertToCSV(report);
    
    if (Platform.OS === 'web') {
      // Web download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${report.metadata.reportId}.csv`;
      a.click();
      return 'Downloaded to your computer';
    } else {
      // Mobile - copy to clipboard
      await Clipboard.setString(csv);
      return 'CSV copied to clipboard';
    }
  }
  
  /**
   * Export report as Markdown
   */
  static async exportAsMarkdown(report: DetailedPerformanceReport): Promise<string> {
    const markdown = this.convertToMarkdown(report);
    
    if (Platform.OS === 'web') {
      // Web download
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${report.metadata.reportId}.md`;
      a.click();
      return 'Downloaded to your computer';
    } else {
      // Mobile - copy to clipboard
      await Clipboard.setString(markdown);
      return 'Markdown copied to clipboard';
    }
  }
  
  /**
   * Share report as formatted text
   */
  static async shareReport(report: DetailedPerformanceReport) {
    const text = this.convertToShareableText(report);
    
    try {
      await Share.share({
        message: text,
        title: 'Performance Report',
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  }
  
  /**
   * Convert report to CSV format
   */
  private static convertToCSV(report: DetailedPerformanceReport): string {
    const headers = [
      'Modal',
      'Test Runs',
      'Avg FPS',
      'Min FPS',
      'Max FPS',
      'P95 FPS',
      'Avg TTI',
      'Min TTI',
      'Max TTI',
      'P95 TTI',
      'Avg Mount Time',
      'Dropped Frames',
      'Jank Score',
      'Memory Growth',
      'Touch Latency',
      'Issues',
      'Score',
    ];
    
    const rows = report.detailedResults.map(result => [
      result.modalName,
      result.testRuns,
      result.metrics.fps.avg.toFixed(1),
      result.metrics.fps.min.toFixed(1),
      result.metrics.fps.max.toFixed(1),
      result.metrics.fps.p95.toFixed(1),
      result.metrics.tti.avg.toFixed(0),
      result.metrics.tti.min.toFixed(0),
      result.metrics.tti.max.toFixed(0),
      result.metrics.tti.p95.toFixed(0),
      result.metrics.mountTime.avg.toFixed(0),
      result.metrics.droppedFrames.total,
      result.metrics.jankScore.avg.toFixed(0),
      result.metrics.memoryGrowth.avg.toFixed(1),
      result.metrics.touchLatency.avg.toFixed(0),
      result.issues.length,
      this.calculateModalScore(result.metrics),
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    return csvContent;
  }
  
  /**
   * Convert report to Markdown format
   */
  private static convertToMarkdown(report: DetailedPerformanceReport): string {
    const lines: string[] = [];
    
    // Header
    lines.push('# Performance Report');
    lines.push(`Generated: ${new Date(report.metadata.generatedAt).toLocaleString()}`);
    lines.push(`Platform: ${report.metadata.platform} | Device: ${report.metadata.deviceModel}`);
    lines.push(`Total Tests: ${report.metadata.totalTests} | Duration: ${(report.metadata.testDuration / 1000).toFixed(1)}s`);
    lines.push('');
    
    // Summary
    lines.push('## Summary');
    lines.push(`**Best Performer:** ${report.summary.bestPerformer.name} (Score: ${report.summary.bestPerformer.score})`);
    lines.push(`- FPS: ${report.summary.bestPerformer.keyMetrics.fps.toFixed(1)}`);
    lines.push(`- TTI: ${report.summary.bestPerformer.keyMetrics.tti.toFixed(0)}ms`);
    lines.push(`- Jank: ${report.summary.bestPerformer.keyMetrics.jankCount}`);
    lines.push('');
    
    lines.push(`**Worst Performer:** ${report.summary.worstPerformer.name} (Score: ${report.summary.worstPerformer.score})`);
    report.summary.worstPerformer.issues.forEach(issue => {
      lines.push(`- ⚠️ ${issue}`);
    });
    lines.push('');
    
    // Detailed Results
    lines.push('## Detailed Results');
    lines.push('');
    
    report.detailedResults.forEach(result => {
      lines.push(`### ${result.modalName}`);
      lines.push(`**Test Runs:** ${result.testRuns}`);
      lines.push('');
      
      lines.push('#### Performance Metrics');
      lines.push('| Metric | Average | Min | Max | P95 |');
      lines.push('|--------|---------|-----|-----|-----|');
      lines.push(`| FPS | ${result.metrics.fps.avg.toFixed(1)} | ${result.metrics.fps.min.toFixed(1)} | ${result.metrics.fps.max.toFixed(1)} | ${result.metrics.fps.p95.toFixed(1)} |`);
      lines.push(`| TTI (ms) | ${result.metrics.tti.avg.toFixed(0)} | ${result.metrics.tti.min.toFixed(0)} | ${result.metrics.tti.max.toFixed(0)} | ${result.metrics.tti.p95.toFixed(0)} |`);
      lines.push(`| Mount Time (ms) | ${result.metrics.mountTime.avg.toFixed(0)} | ${result.metrics.mountTime.min.toFixed(0)} | ${result.metrics.mountTime.max.toFixed(0)} | - |`);
      lines.push('');
      
      if (result.issues.length > 0) {
        lines.push('#### Issues');
        result.issues.forEach(issue => {
          const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : 'ℹ️';
          lines.push(`- ${icon} ${issue.description} (${issue.occurrences} times)`);
        });
        lines.push('');
      }
      
      if (result.recommendations.length > 0) {
        lines.push('#### Recommendations');
        result.recommendations.forEach(rec => {
          lines.push(`- ${rec}`);
        });
        lines.push('');
      }
    });
    
    // Comparisons
    if (report.comparisons.length > 0) {
      lines.push('## Performance Comparisons');
      lines.push('');
      
      report.comparisons.forEach(comp => {
        lines.push(`### ${comp.modalA} vs ${comp.modalB}`);
        lines.push(`**Winner:** ${comp.winner}`);
        
        if (Object.keys(comp.improvements).length > 0) {
          lines.push('**Improvements:**');
          Object.entries(comp.improvements).forEach(([metric, value]) => {
            lines.push(`- ${metric}: +${value.toFixed(1)}%`);
          });
        }
        
        if (Object.keys(comp.regressions).length > 0) {
          lines.push('**Regressions:**');
          Object.entries(comp.regressions).forEach(([metric, value]) => {
            lines.push(`- ${metric}: ${value.toFixed(1)}%`);
          });
        }
        lines.push('');
      });
    }
    
    // Recommendations
    lines.push('## Recommendations');
    
    if (report.recommendations.critical.length > 0) {
      lines.push('### 🔴 Critical');
      report.recommendations.critical.forEach(rec => {
        lines.push(`- ${rec}`);
      });
      lines.push('');
    }
    
    if (report.recommendations.improvements.length > 0) {
      lines.push('### 🟡 Improvements');
      report.recommendations.improvements.forEach(rec => {
        lines.push(`- ${rec}`);
      });
      lines.push('');
    }
    
    if (report.recommendations.bestPractices.length > 0) {
      lines.push('### ✅ Best Practices');
      report.recommendations.bestPractices.forEach(rec => {
        lines.push(`- ${rec}`);
      });
    }
    
    return lines.join('\n');
  }
  
  /**
   * Convert report to shareable text
   */
  private static convertToShareableText(report: DetailedPerformanceReport): string {
    const lines: string[] = [];
    
    lines.push('📊 PERFORMANCE REPORT');
    lines.push('━'.repeat(25));
    lines.push(`Generated: ${new Date(report.metadata.generatedAt).toLocaleString()}`);
    lines.push(`Tests: ${report.metadata.totalTests} | Duration: ${(report.metadata.testDuration / 1000).toFixed(1)}s`);
    lines.push('');
    
    lines.push('🏆 BEST: ' + report.summary.bestPerformer.name);
    lines.push(`  Score: ${report.summary.bestPerformer.score}`);
    lines.push(`  FPS: ${report.summary.bestPerformer.keyMetrics.fps.toFixed(1)}`);
    lines.push(`  TTI: ${report.summary.bestPerformer.keyMetrics.tti.toFixed(0)}ms`);
    lines.push('');
    
    lines.push('⚠️ WORST: ' + report.summary.worstPerformer.name);
    lines.push(`  Score: ${report.summary.worstPerformer.score}`);
    report.summary.worstPerformer.issues.slice(0, 3).forEach(issue => {
      lines.push(`  - ${issue}`);
    });
    lines.push('');
    
    lines.push('📈 AVERAGES:');
    lines.push(`  FPS: ${report.summary.averageMetrics.fps.toFixed(1)}`);
    lines.push(`  TTI: ${report.summary.averageMetrics.tti.toFixed(0)}ms`);
    lines.push(`  Jank: ${report.summary.averageMetrics.jankCount.toFixed(0)}`);
    lines.push(`  Memory: ${report.summary.averageMetrics.memoryGrowth.toFixed(1)}MB`);
    lines.push('');
    
    if (report.recommendations.critical.length > 0) {
      lines.push('🔴 CRITICAL ISSUES:');
      report.recommendations.critical.slice(0, 3).forEach(rec => {
        lines.push(`• ${rec}`);
      });
    }
    
    return lines.join('\n');
  }
  
  // Helper methods
  
  private static groupResultsByModal(results: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();
    
    results.forEach(result => {
      const modalType = result.modalType;
      if (!grouped.has(modalType)) {
        grouped.set(modalType, []);
      }
      grouped.get(modalType)!.push(result);
    });
    
    return grouped;
  }
  
  private static calculateSummary(results: any[]): DetailedPerformanceReport['summary'] {
    // Implementation would calculate best/worst performers and averages
    // This is a simplified version
    const scores = results.map(r => ({
      name: r.modalType,
      score: this.calculateModalScore(r),
      result: r,
    }));
    
    scores.sort((a, b) => b.score - a.score);
    
    const best = scores[0];
    const worst = scores[scores.length - 1];
    
    return {
      bestPerformer: {
        name: best.name,
        score: best.score,
        keyMetrics: {
          fps: best.result.nativeFrameMetrics?.averageFPS || best.result.fpsData.averageFPS,
          tti: best.result.shopifyMetrics?.interactiveTimeMs || 0,
          jankCount: best.result.nativeFrameMetrics?.droppedFrames || 0,
          memoryGrowth: best.result.memoryMetrics?.memoryGrowthMB || 0,
        },
      },
      worstPerformer: {
        name: worst.name,
        score: worst.score,
        issues: this.identifyIssues(worst.result),
      },
      averageMetrics: this.calculateAverageMetrics(results),
    };
  }
  
  private static generateDetailedResults(groupedResults: Map<string, any[]>): DetailedPerformanceReport['detailedResults'] {
    const detailed: DetailedPerformanceReport['detailedResults'] = [];
    
    groupedResults.forEach((results, modalName) => {
      // Calculate aggregated metrics for this modal
      const metrics = this.aggregateMetrics(results);
      const issues = this.identifyAllIssues(results);
      const recommendations = this.generateModalRecommendations(metrics, issues);
      
      detailed.push({
        modalName,
        testRuns: results.length,
        metrics,
        issues,
        recommendations,
      });
    });
    
    return detailed;
  }
  
  private static aggregateMetrics(results: any[]): any {
    // Aggregate all metrics across test runs
    // This is a simplified implementation
    return {
      fps: this.calculateStats(results.map(r => r.nativeFrameMetrics?.averageFPS || r.fpsData.averageFPS)),
      tti: this.calculateStats(results.map(r => r.shopifyMetrics?.interactiveTimeMs || 0)),
      mountTime: this.calculateStats(results.map(r => r.shopifyMetrics?.loadingTimeMs || r.renderMetrics?.mountTime || 0)),
      renderPasses: this.calculateStats(results.map(r => r.shopifyMetrics?.renderPasses || 0)),
      droppedFrames: {
        total: results.reduce((sum, r) => sum + (r.nativeFrameMetrics?.droppedFrames || 0), 0),
        perRun: results.reduce((sum, r) => sum + (r.nativeFrameMetrics?.droppedFrames || 0), 0) / results.length,
      },
      jankScore: this.calculateStats(results.map(r => r.nativeFrameMetrics?.jankScore || 0)),
      frameTimings: {
        p50: 16.67, // Simplified
        p95: results[0]?.nativeFrameMetrics?.percentile95 || 16.67,
        p99: results[0]?.nativeFrameMetrics?.percentile99 || 16.67,
      },
      memoryGrowth: this.calculateStats(results.map(r => r.memoryMetrics?.memoryGrowthMB || 0)),
      memoryLeaks: results.filter(r => r.memoryMetrics?.leaksDetected > 0).length,
      touchLatency: this.calculateStats(results.map(r => r.shopifyMetrics?.touchEventProcessingMs || 0)),
      coldStarts: this.calculateColdWarmStats(results, true),
      warmStarts: this.calculateColdWarmStats(results, false),
    };
  }
  
  private static calculateStats(values: number[]): { avg: number; min: number; max: number; p95?: number } {
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, p95: 0 };
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    
    return { avg, min, max, p95 };
  }
  
  private static calculateColdWarmStats(results: any[], cold: boolean): { count: number; avgTTI: number } {
    const filtered = results.filter(r => r.shopifyMetrics?.isColdStart === cold);
    const ttiValues = filtered.map(r => r.shopifyMetrics?.interactiveTimeMs || 0).filter(v => v > 0);
    
    return {
      count: filtered.length,
      avgTTI: ttiValues.length > 0 ? ttiValues.reduce((a, b) => a + b, 0) / ttiValues.length : 0,
    };
  }
  
  private static identifyIssues(result: any): string[] {
    const issues: string[] = [];
    
    if (result.nativeFrameMetrics?.averageFPS < 30) {
      issues.push(`Low FPS: ${result.nativeFrameMetrics.averageFPS.toFixed(1)}`);
    }
    
    if (result.shopifyMetrics?.interactiveTimeMs > 500) {
      issues.push(`Slow TTI: ${result.shopifyMetrics.interactiveTimeMs}ms`);
    }
    
    if (result.nativeFrameMetrics?.droppedFrames > 10) {
      issues.push(`High frame drops: ${result.nativeFrameMetrics.droppedFrames}`);
    }
    
    if (result.memoryMetrics?.memoryGrowthMB > 5) {
      issues.push(`Memory leak: +${result.memoryMetrics.memoryGrowthMB.toFixed(1)}MB`);
    }
    
    return issues;
  }
  
  private static identifyAllIssues(results: any[]): any[] {
    const issueMap = new Map<string, { type: string; severity: string; count: number }>();
    
    results.forEach(result => {
      const issues = this.identifyIssues(result);
      issues.forEach(issue => {
        const key = issue.split(':')[0];
        if (!issueMap.has(key)) {
          issueMap.set(key, {
            type: key,
            severity: this.getIssueSeverity(key),
            count: 0,
          });
        }
        issueMap.get(key)!.count++;
      });
    });
    
    return Array.from(issueMap.values()).map(issue => ({
      type: issue.type,
      severity: issue.severity,
      description: issue.type,
      occurrences: issue.count,
    }));
  }
  
  private static getIssueSeverity(issueType: string): 'critical' | 'warning' | 'info' {
    if (issueType.includes('Low FPS') || issueType.includes('Memory leak')) {
      return 'critical';
    }
    if (issueType.includes('Slow TTI') || issueType.includes('High frame drops')) {
      return 'warning';
    }
    return 'info';
  }
  
  private static generateModalRecommendations(metrics: any, issues: any[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.fps.avg < 50) {
      recommendations.push('Optimize animations and reduce JavaScript work during renders');
    }
    
    if (metrics.tti.avg > 300) {
      recommendations.push('Reduce initial component complexity and defer non-critical work');
    }
    
    if (metrics.memoryGrowth.avg > 3) {
      recommendations.push('Check for memory leaks and optimize resource usage');
    }
    
    if (metrics.renderPasses.avg > 3) {
      recommendations.push('Reduce unnecessary re-renders with memoization');
    }
    
    return recommendations;
  }
  
  private static generateComparisons(results: any[], regressionAnalysis: Map<string, any>): any[] {
    // Generate comparisons between modals
    return [];
  }
  
  private static generateTrends(results: any[], regressionAnalysis: Map<string, any>): any {
    return {
      performanceOverTime: results.map(r => ({
        timestamp: r.timestamp,
        modalName: r.modalType,
        score: this.calculateModalScore(r),
        fps: r.nativeFrameMetrics?.averageFPS || r.fpsData.averageFPS,
        tti: r.shopifyMetrics?.interactiveTimeMs || 0,
      })),
      regressionHistory: [],
    };
  }
  
  private static generateRecommendations(detailedResults: any[]): any {
    const critical: string[] = [];
    const improvements: string[] = [];
    const bestPractices: string[] = [];
    
    detailedResults.forEach(result => {
      if (result.metrics.fps.avg < 30) {
        critical.push(`${result.modalName}: Critical FPS issues detected (${result.metrics.fps.avg.toFixed(1)} FPS)`);
      }
      
      if (result.metrics.memoryLeaks > 0) {
        critical.push(`${result.modalName}: Memory leaks detected`);
      }
      
      if (result.metrics.tti.avg > 500) {
        improvements.push(`${result.modalName}: Optimize Time to Interactive (currently ${result.metrics.tti.avg.toFixed(0)}ms)`);
      }
      
      if (result.metrics.renderPasses.avg <= 2) {
        bestPractices.push(`${result.modalName}: Excellent render optimization (${result.metrics.renderPasses.avg.toFixed(1)} passes)`);
      }
    });
    
    return { critical, improvements, bestPractices };
  }
  
  private static calculateModalScore(result: any): number {
    // Simple scoring algorithm
    let score = 100;
    
    const fps = result.nativeFrameMetrics?.averageFPS || result.fpsData?.averageFPS || 60;
    score -= Math.max(0, 60 - fps) * 0.5;
    
    const tti = result.shopifyMetrics?.interactiveTimeMs || 0;
    if (tti > 500) score -= 20;
    else if (tti > 200) score -= 10;
    
    const jank = result.nativeFrameMetrics?.droppedFrames || 0;
    score -= jank * 2;
    
    return Math.max(0, Math.round(score));
  }
  
  private static calculateAverageMetrics(results: any[]): any {
    const count = results.length;
    
    return {
      fps: results.reduce((sum, r) => sum + (r.nativeFrameMetrics?.averageFPS || r.fpsData.averageFPS || 0), 0) / count,
      tti: results.reduce((sum, r) => sum + (r.shopifyMetrics?.interactiveTimeMs || 0), 0) / count,
      mountTime: results.reduce((sum, r) => sum + (r.shopifyMetrics?.loadingTimeMs || r.renderMetrics?.mountTime || 0), 0) / count,
      jankCount: results.reduce((sum, r) => sum + (r.nativeFrameMetrics?.droppedFrames || 0), 0) / count,
      memoryGrowth: results.reduce((sum, r) => sum + (r.memoryMetrics?.memoryGrowthMB || 0), 0) / count,
      renderPasses: results.reduce((sum, r) => sum + (r.shopifyMetrics?.renderPasses || 0), 0) / count,
    };
  }
  
  private static calculateTestDuration(results: any[]): number {
    if (results.length === 0) return 0;
    
    const timestamps = results.map(r => r.timestamp);
    return Math.max(...timestamps) - Math.min(...timestamps);
  }
  
  private static getDeviceModel(): string {
    // This would need react-native-device-info in production
    return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
  }
}