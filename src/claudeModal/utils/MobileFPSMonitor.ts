/**
 * Mobile FPS Monitor with Frame Drop and Jank Detection
 * 
 * Advanced FPS monitoring specifically optimized for React Native mobile apps.
 * Detects frame drops, jank, and provides detailed performance metrics.
 */

import { InteractionManager } from 'react-native';

export interface FrameMetrics {
  timestamp: number;
  frameDuration: number;
  fps: number;
  isDropped: boolean;
  isJank: boolean;
}

export interface FPSMetrics {
  currentFPS: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  jankCount: number;
  smoothFrames: number;
  totalFrames: number;
  frameDropRate: number;
  jankRate: number;
  performanceScore: number;
  percentile95: number;
  percentile99: number;
  frameTimeVariance: number;
}

export interface JankEvent {
  timestamp: number;
  duration: number;
  severity: 'minor' | 'moderate' | 'severe';
  precedingFPS: number;
  followingFPS: number;
}

export class MobileFPSMonitor {
  private frameMetrics: FrameMetrics[] = [];
  private jankEvents: JankEvent[] = [];
  private lastFrameTime: number = 0;
  private isMonitoring: boolean = false;
  private rafId: number | null = null;
  private interactionHandle: any = null;
  
  // Thresholds
  private readonly TARGET_FPS = 60;
  private readonly FRAME_BUDGET_MS = 1000 / this.TARGET_FPS; // ~16.67ms
  private readonly DROPPED_FRAME_THRESHOLD = this.FRAME_BUDGET_MS * 1.5; // 25ms
  private readonly JANK_THRESHOLD = this.FRAME_BUDGET_MS * 3; // 50ms
  private readonly SEVERE_JANK_THRESHOLD = this.FRAME_BUDGET_MS * 6; // 100ms
  private readonly MAX_METRICS_HISTORY = 300; // 5 seconds at 60fps
  
  // Callbacks
  private onFrameDropCallback?: (count: number) => void;
  private onJankCallback?: (event: JankEvent) => void;
  private onMetricsUpdateCallback?: (metrics: FPSMetrics) => void;
  
  constructor() {
    this.measureFrame = this.measureFrame.bind(this);
  }
  
  /**
   * Start FPS monitoring
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameMetrics = [];
    this.jankEvents = [];
    
    // Use RAF for frame monitoring
    this.scheduleNextFrame();
    
    // Use InteractionManager to detect JS thread blocking
    this.startInteractionTracking();
  }
  
  /**
   * Stop FPS monitoring
   */
  stop(): FPSMetrics {
    this.isMonitoring = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    if (this.interactionHandle) {
      this.interactionHandle.cancel();
      this.interactionHandle = null;
    }
    
    return this.getMetrics();
  }
  
  /**
   * Schedule next frame measurement
   */
  private scheduleNextFrame(): void {
    if (!this.isMonitoring) return;
    
    this.rafId = requestAnimationFrame(this.measureFrame);
  }
  
  /**
   * Measure current frame
   */
  private measureFrame(timestamp: number): void {
    if (!this.isMonitoring) return;
    
    const frameDuration = timestamp - this.lastFrameTime;
    const fps = frameDuration > 0 ? 1000 / frameDuration : 0;
    
    // Detect frame drops and jank
    const isDropped = frameDuration > this.DROPPED_FRAME_THRESHOLD;
    const isJank = frameDuration > this.JANK_THRESHOLD;
    
    const frameMetric: FrameMetrics = {
      timestamp,
      frameDuration,
      fps,
      isDropped,
      isJank,
    };
    
    this.frameMetrics.push(frameMetric);
    
    // Trim history
    if (this.frameMetrics.length > this.MAX_METRICS_HISTORY) {
      this.frameMetrics.shift();
    }
    
    // Detect and record jank events
    if (isJank) {
      this.recordJankEvent(frameMetric);
    }
    
    // Notify callbacks
    if (isDropped && this.onFrameDropCallback) {
      const recentDrops = this.frameMetrics
        .slice(-60)
        .filter(m => m.isDropped).length;
      this.onFrameDropCallback(recentDrops);
    }
    
    if (this.frameMetrics.length % 30 === 0 && this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback(this.getMetrics());
    }
    
    this.lastFrameTime = timestamp;
    this.scheduleNextFrame();
  }
  
  /**
   * Start tracking JS thread interactions
   */
  private startInteractionTracking(): void {
    // Use InteractionManager to detect when JS thread is busy
    const trackInteraction = () => {
      if (!this.isMonitoring) return;
      
      this.interactionHandle = InteractionManager.runAfterInteractions(() => {
        // JS thread was busy, might have caused jank
        const now = performance.now();
        const timeSinceLastFrame = now - this.lastFrameTime;
        
        if (timeSinceLastFrame > this.JANK_THRESHOLD) {
          // JS thread blocking detected
          this.recordJankEvent({
            timestamp: now,
            frameDuration: timeSinceLastFrame,
            fps: 1000 / timeSinceLastFrame,
            isDropped: true,
            isJank: true,
          });
        }
        
        // Schedule next check
        if (this.isMonitoring) {
          setTimeout(trackInteraction, 100);
        }
      });
    };
    
    trackInteraction();
  }
  
  /**
   * Record a jank event
   */
  private recordJankEvent(frameMetric: FrameMetrics): void {
    const severity = this.getJankSeverity(frameMetric.frameDuration);
    
    // Get surrounding FPS for context
    const recentMetrics = this.frameMetrics.slice(-10);
    const precedingFPS = recentMetrics.slice(0, -1)
      .reduce((sum, m) => sum + m.fps, 0) / (recentMetrics.length - 1) || 0;
    const followingFPS = this.getCurrentFPS();
    
    const jankEvent: JankEvent = {
      timestamp: frameMetric.timestamp,
      duration: frameMetric.frameDuration,
      severity,
      precedingFPS,
      followingFPS,
    };
    
    this.jankEvents.push(jankEvent);
    
    // Keep only recent jank events
    if (this.jankEvents.length > 50) {
      this.jankEvents.shift();
    }
    
    if (this.onJankCallback) {
      this.onJankCallback(jankEvent);
    }
  }
  
  /**
   * Get jank severity based on frame duration
   */
  private getJankSeverity(frameDuration: number): 'minor' | 'moderate' | 'severe' {
    if (frameDuration > this.SEVERE_JANK_THRESHOLD) {
      return 'severe';
    } else if (frameDuration > this.JANK_THRESHOLD * 2) {
      return 'moderate';
    }
    return 'minor';
  }
  
  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    if (this.frameMetrics.length === 0) return 0;
    
    const recentFrames = this.frameMetrics.slice(-30);
    const avgFrameTime = recentFrames
      .reduce((sum, m) => sum + m.frameDuration, 0) / recentFrames.length;
    
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
  }
  
  /**
   * Get comprehensive FPS metrics
   */
  getMetrics(): FPSMetrics {
    if (this.frameMetrics.length === 0) {
      return {
        currentFPS: 0,
        averageFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        frameDrops: 0,
        jankCount: 0,
        smoothFrames: 0,
        totalFrames: 0,
        frameDropRate: 0,
        jankRate: 0,
        performanceScore: 0,
        percentile95: 0,
        percentile99: 0,
        frameTimeVariance: 0,
      };
    }
    
    const fpsValues = this.frameMetrics.map(m => m.fps).filter(fps => fps > 0);
    const sortedFPS = [...fpsValues].sort((a, b) => a - b);
    
    const frameDrops = this.frameMetrics.filter(m => m.isDropped).length;
    const jankCount = this.frameMetrics.filter(m => m.isJank).length;
    const smoothFrames = this.frameMetrics.filter(m => !m.isDropped && !m.isJank).length;
    const totalFrames = this.frameMetrics.length;
    
    // Calculate percentiles
    const p95Index = Math.floor(sortedFPS.length * 0.05);
    const p99Index = Math.floor(sortedFPS.length * 0.01);
    const percentile95 = sortedFPS[p95Index] || 0;
    const percentile99 = sortedFPS[p99Index] || 0;
    
    // Calculate frame time variance
    const frameTimes = this.frameMetrics.map(m => m.frameDuration);
    const avgFrameTime = frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length;
    const variance = frameTimes
      .reduce((sum, t) => sum + Math.pow(t - avgFrameTime, 2), 0) / frameTimes.length;
    const frameTimeVariance = Math.sqrt(variance);
    
    // Calculate performance score (0-100)
    const avgFPS = fpsValues.reduce((sum, fps) => sum + fps, 0) / fpsValues.length;
    const fpsScore = Math.min(avgFPS / this.TARGET_FPS, 1) * 40;
    const dropScore = Math.max(1 - (frameDrops / totalFrames) * 2, 0) * 30;
    const jankScore = Math.max(1 - (jankCount / totalFrames) * 4, 0) * 30;
    const performanceScore = Math.round(fpsScore + dropScore + jankScore);
    
    return {
      currentFPS: this.getCurrentFPS(),
      averageFPS: avgFPS,
      minFPS: Math.min(...fpsValues),
      maxFPS: Math.max(...fpsValues),
      frameDrops,
      jankCount,
      smoothFrames,
      totalFrames,
      frameDropRate: (frameDrops / totalFrames) * 100,
      jankRate: (jankCount / totalFrames) * 100,
      performanceScore,
      percentile95,
      percentile99,
      frameTimeVariance,
    };
  }
  
  /**
   * Get jank events
   */
  getJankEvents(): JankEvent[] {
    return [...this.jankEvents];
  }
  
  /**
   * Set callback for frame drops
   */
  onFrameDrop(callback: (count: number) => void): void {
    this.onFrameDropCallback = callback;
  }
  
  /**
   * Set callback for jank events
   */
  onJank(callback: (event: JankEvent) => void): void {
    this.onJankCallback = callback;
  }
  
  /**
   * Set callback for metrics updates
   */
  onMetricsUpdate(callback: (metrics: FPSMetrics) => void): void {
    this.onMetricsUpdateCallback = callback;
  }
  
  /**
   * Reset all metrics
   */
  reset(): void {
    this.frameMetrics = [];
    this.jankEvents = [];
    this.lastFrameTime = performance.now();
  }
  
  /**
   * Get performance rating
   */
  getPerformanceRating(): 'excellent' | 'good' | 'fair' | 'poor' {
    const metrics = this.getMetrics();
    
    if (metrics.performanceScore >= 90) return 'excellent';
    if (metrics.performanceScore >= 70) return 'good';
    if (metrics.performanceScore >= 50) return 'fair';
    return 'poor';
  }
  
  /**
   * Get detailed performance report
   */
  getDetailedReport(): string {
    const metrics = this.getMetrics();
    const rating = this.getPerformanceRating();
    
    return `
=== FPS Performance Report ===
Rating: ${rating.toUpperCase()}
Score: ${metrics.performanceScore}/100

Frame Rate:
  Current: ${metrics.currentFPS.toFixed(1)} FPS
  Average: ${metrics.averageFPS.toFixed(1)} FPS
  Min: ${metrics.minFPS.toFixed(1)} FPS
  Max: ${metrics.maxFPS.toFixed(1)} FPS
  
Frame Quality:
  Total Frames: ${metrics.totalFrames}
  Smooth Frames: ${metrics.smoothFrames} (${((metrics.smoothFrames / metrics.totalFrames) * 100).toFixed(1)}%)
  Dropped Frames: ${metrics.frameDrops} (${metrics.frameDropRate.toFixed(1)}%)
  Jank Events: ${metrics.jankCount} (${metrics.jankRate.toFixed(1)}%)
  
Statistical Analysis:
  95th Percentile: ${metrics.percentile95.toFixed(1)} FPS
  99th Percentile: ${metrics.percentile99.toFixed(1)} FPS
  Frame Time Variance: ${metrics.frameTimeVariance.toFixed(2)}ms
  
Jank Events Summary:
  Minor: ${this.jankEvents.filter(e => e.severity === 'minor').length}
  Moderate: ${this.jankEvents.filter(e => e.severity === 'moderate').length}
  Severe: ${this.jankEvents.filter(e => e.severity === 'severe').length}
=============================
    `.trim();
  }
}

// Singleton instance
export const mobileFPSMonitor = new MobileFPSMonitor();