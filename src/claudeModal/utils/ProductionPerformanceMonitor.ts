/**
 * Production Performance Monitor
 * 
 * Lightweight performance monitoring for production environments.
 * Collects real user metrics without stress testing or heavy instrumentation.
 * 
 * Features:
 * - Passive monitoring (no stress tests)
 * - Sampling to reduce overhead
 * - Automatic metric aggregation
 * - Remote reporting capability
 * - Privacy-aware (no PII collection)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions } from 'react-native';

export interface ProductionMetrics {
  sessionId: string;
  timestamp: number;
  screenName: string;
  eventType: 'navigation' | 'interaction' | 'render';
  metrics: {
    // Core Web Vitals equivalent for mobile
    tti?: number;           // Time to Interactive
    fps?: number;           // Frame rate during interaction
    jankCount?: number;     // Number of janky frames
    renderTime?: number;    // Component render time
    touchLatency?: number;  // Touch response time
    
    // Additional mobile metrics
    memoryUsage?: number;   // Current memory usage in MB
    bundleLoadTime?: number; // JS bundle load time
    coldStart?: boolean;    // Whether this was a cold start
    
    // Context
    deviceModel?: string;
    osVersion?: string;
    appVersion?: string;
    screenDimensions?: { width: number; height: number };
  };
  // Performance score based on thresholds
  score?: number;
  issues?: string[];
}

export interface PerformanceReport {
  sessionId: string;
  startTime: number;
  endTime: number;
  metrics: {
    // Aggregated metrics
    avgTTI: number;
    p95TTI: number;
    avgFPS: number;
    minFPS: number;
    totalJanks: number;
    avgRenderTime: number;
    avgTouchLatency: number;
    
    // Session stats
    totalEvents: number;
    totalNavigations: number;
    totalInteractions: number;
    sessionDuration: number;
    
    // Issue summary
    performanceIssues: {
      slowTTI: number;      // Count of TTI > 500ms
      lowFPS: number;       // Count of FPS < 30
      highJank: number;     // Count of jank > 10
      slowTouch: number;    // Count of touch > 100ms
    };
  };
  deviceInfo: {
    model: string;
    platform: string;
    osVersion: string;
    appVersion: string;
    screenDimensions: { width: number; height: number };
  };
}

class ProductionPerformanceMonitorClass {
  private static STORAGE_KEY = '@perf_monitor_data';
  private static MAX_STORED_EVENTS = 100;
  private static SAMPLING_RATE = 0.1; // 10% sampling in production
  private static REPORT_INTERVAL = 300000; // 5 minutes
  
  private isEnabled = false;
  private sessionId: string;
  private events: ProductionMetrics[] = [];
  private reportTimer: ReturnType<typeof setInterval> | null = null;
  private samplingRate: number;
  private reportCallback?: (report: PerformanceReport) => void;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.samplingRate = ProductionPerformanceMonitorClass.SAMPLING_RATE;
  }
  
  /**
   * Initialize production monitoring
   */
  async initialize(options?: {
    enabled?: boolean;
    samplingRate?: number;
    reportCallback?: (report: PerformanceReport) => void;
    autoReport?: boolean;
  }) {
    this.isEnabled = options?.enabled ?? false;
    this.samplingRate = options?.samplingRate ?? ProductionPerformanceMonitorClass.SAMPLING_RATE;
    this.reportCallback = options?.reportCallback;
    
    if (this.isEnabled) {
      console.log(`📊 Production Performance Monitor initialized (sampling: ${this.samplingRate * 100}%)`);
      
      // Load any stored events
      await this.loadStoredEvents();
      
      // Set up automatic reporting
      if (options?.autoReport !== false) {
        this.startAutoReporting();
      }
    }
  }
  
  /**
   * Check if we should sample this event
   */
  private shouldSample(): boolean {
    // Always sample in development
    if (__DEV__) return true;
    
    // Use sampling rate in production
    return Math.random() < this.samplingRate;
  }
  
  /**
   * Track a performance event
   */
  track(event: Omit<ProductionMetrics, 'sessionId' | 'timestamp'>) {
    if (!this.isEnabled || !this.shouldSample()) return;
    
    const metrics: ProductionMetrics = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };
    
    // Calculate performance score
    metrics.score = this.calculateScore(metrics.metrics);
    
    // Identify issues
    metrics.issues = this.identifyIssues(metrics.metrics);
    
    // Add to events
    this.events.push(metrics);
    
    // Trim if too many events
    if (this.events.length > ProductionPerformanceMonitorClass.MAX_STORED_EVENTS) {
      this.events = this.events.slice(-ProductionPerformanceMonitorClass.MAX_STORED_EVENTS);
    }
    
    // Store events
    this.storeEvents();
    
    // Log in development
    if (__DEV__ && metrics.issues && metrics.issues.length > 0) {
      console.warn(`⚠️ Performance issues detected:`, metrics.issues);
    }
  }
  
  /**
   * Track navigation event
   */
  trackNavigation(screenName: string, tti: number, coldStart: boolean = false) {
    this.track({
      screenName,
      eventType: 'navigation',
      metrics: {
        tti,
        coldStart,
        deviceModel: this.getDeviceModel(),
        osVersion: Platform.Version.toString(),
        screenDimensions: Dimensions.get('window'),
      },
    });
  }
  
  /**
   * Track interaction event
   */
  trackInteraction(screenName: string, touchLatency: number, fps?: number, jankCount?: number) {
    this.track({
      screenName,
      eventType: 'interaction',
      metrics: {
        touchLatency,
        fps,
        jankCount,
      },
    });
  }
  
  /**
   * Track render event
   */
  trackRender(screenName: string, renderTime: number, fps?: number) {
    this.track({
      screenName,
      eventType: 'render',
      metrics: {
        renderTime,
        fps,
      },
    });
  }
  
  /**
   * Calculate performance score (0-100)
   */
  private calculateScore(metrics: ProductionMetrics['metrics']): number {
    let score = 100;
    
    // TTI penalty
    if (metrics.tti) {
      if (metrics.tti > 500) score -= 20;
      else if (metrics.tti > 200) score -= 10;
    }
    
    // FPS penalty
    if (metrics.fps) {
      if (metrics.fps < 30) score -= 30;
      else if (metrics.fps < 50) score -= 15;
    }
    
    // Jank penalty
    if (metrics.jankCount) {
      if (metrics.jankCount > 10) score -= 20;
      else if (metrics.jankCount > 5) score -= 10;
    }
    
    // Touch latency penalty
    if (metrics.touchLatency) {
      if (metrics.touchLatency > 100) score -= 15;
      else if (metrics.touchLatency > 50) score -= 5;
    }
    
    return Math.max(0, score);
  }
  
  /**
   * Identify performance issues
   */
  private identifyIssues(metrics: ProductionMetrics['metrics']): string[] {
    const issues: string[] = [];
    
    if (metrics.tti && metrics.tti > 500) {
      issues.push(`Slow TTI: ${metrics.tti}ms`);
    }
    
    if (metrics.fps && metrics.fps < 30) {
      issues.push(`Low FPS: ${metrics.fps}`);
    }
    
    if (metrics.jankCount && metrics.jankCount > 10) {
      issues.push(`High jank: ${metrics.jankCount} frames`);
    }
    
    if (metrics.touchLatency && metrics.touchLatency > 100) {
      issues.push(`Slow touch response: ${metrics.touchLatency}ms`);
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 200) {
      issues.push(`High memory: ${metrics.memoryUsage}MB`);
    }
    
    return issues;
  }
  
  /**
   * Generate a performance report
   */
  generateReport(): PerformanceReport {
    if (this.events.length === 0) {
      return this.getEmptyReport();
    }
    
    const navigationEvents = this.events.filter(e => e.eventType === 'navigation');
    const interactionEvents = this.events.filter(e => e.eventType === 'interaction');
    
    // Calculate aggregated metrics
    const ttiValues = navigationEvents
      .map(e => e.metrics.tti)
      .filter((v): v is number => v !== undefined);
    
    const fpsValues = this.events
      .map(e => e.metrics.fps)
      .filter((v): v is number => v !== undefined);
    
    const jankCounts = this.events
      .map(e => e.metrics.jankCount)
      .filter((v): v is number => v !== undefined);
    
    const renderTimes = this.events
      .filter(e => e.eventType === 'render')
      .map(e => e.metrics.renderTime)
      .filter((v): v is number => v !== undefined);
    
    const touchLatencies = interactionEvents
      .map(e => e.metrics.touchLatency)
      .filter((v): v is number => v !== undefined);
    
    return {
      sessionId: this.sessionId,
      startTime: this.events[0].timestamp,
      endTime: this.events[this.events.length - 1].timestamp,
      metrics: {
        avgTTI: this.average(ttiValues),
        p95TTI: this.percentile(ttiValues, 95),
        avgFPS: this.average(fpsValues),
        minFPS: Math.min(...fpsValues) || 0,
        totalJanks: jankCounts.reduce((a, b) => a + b, 0),
        avgRenderTime: this.average(renderTimes),
        avgTouchLatency: this.average(touchLatencies),
        
        totalEvents: this.events.length,
        totalNavigations: navigationEvents.length,
        totalInteractions: interactionEvents.length,
        sessionDuration: this.events[this.events.length - 1].timestamp - this.events[0].timestamp,
        
        performanceIssues: {
          slowTTI: ttiValues.filter(v => v > 500).length,
          lowFPS: fpsValues.filter(v => v < 30).length,
          highJank: jankCounts.filter(v => v > 10).length,
          slowTouch: touchLatencies.filter(v => v > 100).length,
        },
      },
      deviceInfo: {
        model: this.getDeviceModel(),
        platform: Platform.OS,
        osVersion: Platform.Version.toString(),
        appVersion: '1.0.0', // Replace with actual version
        screenDimensions: Dimensions.get('window'),
      },
    };
  }
  
  /**
   * Start automatic reporting
   */
  private startAutoReporting() {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }
    
    this.reportTimer = setInterval(() => {
      const report = this.generateReport();
      this.sendReport(report);
    }, ProductionPerformanceMonitorClass.REPORT_INTERVAL);
  }
  
  /**
   * Send report (to callback or remote server)
   */
  private async sendReport(report: PerformanceReport) {
    // Call local callback
    if (this.reportCallback) {
      this.reportCallback(report);
    }
    
    // In production, you would send to your analytics service
    if (!__DEV__) {
      // Example: await fetch('https://your-analytics.com/performance', {
      //   method: 'POST',
      //   body: JSON.stringify(report),
      // });
    }
    
    // Log summary in development
    if (__DEV__) {
      console.log('📊 Performance Report:', {
        avgFPS: report.metrics.avgFPS,
        avgTTI: report.metrics.avgTTI,
        issues: report.metrics.performanceIssues,
      });
    }
  }
  
  /**
   * Store events to AsyncStorage
   */
  private async storeEvents() {
    try {
      await AsyncStorage.setItem(
        ProductionPerformanceMonitorClass.STORAGE_KEY,
        JSON.stringify(this.events.slice(-50)) // Store last 50 events
      );
    } catch (error) {
      console.warn('Failed to store performance events:', error);
    }
  }
  
  /**
   * Load stored events
   */
  private async loadStoredEvents() {
    try {
      const stored = await AsyncStorage.getItem(ProductionPerformanceMonitorClass.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored performance events:', error);
    }
  }
  
  /**
   * Clear all stored data
   */
  async clearData() {
    this.events = [];
    await AsyncStorage.removeItem(ProductionPerformanceMonitorClass.STORAGE_KEY);
  }
  
  /**
   * Get device model
   */
  private getDeviceModel(): string {
    // This would need react-native-device-info in production
    return Platform.OS === 'ios' ? 'iPhone' : 'Android Device';
  }
  
  /**
   * Calculate average
   */
  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  /**
   * Calculate percentile
   */
  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }
  
  /**
   * Get empty report
   */
  private getEmptyReport(): PerformanceReport {
    return {
      sessionId: this.sessionId,
      startTime: Date.now(),
      endTime: Date.now(),
      metrics: {
        avgTTI: 0,
        p95TTI: 0,
        avgFPS: 60,
        minFPS: 60,
        totalJanks: 0,
        avgRenderTime: 0,
        avgTouchLatency: 0,
        totalEvents: 0,
        totalNavigations: 0,
        totalInteractions: 0,
        sessionDuration: 0,
        performanceIssues: {
          slowTTI: 0,
          lowFPS: 0,
          highJank: 0,
          slowTouch: 0,
        },
      },
      deviceInfo: {
        model: this.getDeviceModel(),
        platform: Platform.OS,
        osVersion: Platform.Version.toString(),
        appVersion: '1.0.0',
        screenDimensions: Dimensions.get('window'),
      },
    };
  }
  
  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Stop monitoring
   */
  stop() {
    this.isEnabled = false;
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
    
    // Send final report
    if (this.events.length > 0) {
      const report = this.generateReport();
      this.sendReport(report);
    }
  }
}

// Export singleton instance
export const productionMonitor = new ProductionPerformanceMonitorClass();