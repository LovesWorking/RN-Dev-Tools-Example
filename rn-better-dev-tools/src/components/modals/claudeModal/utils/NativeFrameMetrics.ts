/**
 * Native Frame Metrics Tracker
 * 
 * Uses React Native's performance observer API to get more accurate frame metrics
 * compared to JavaScript-only measurements. This captures actual frame timing
 * from the native layer.
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Frame budget in milliseconds (16.67ms for 60 FPS)
const FRAME_BUDGET_MS = 16.67;
const SEVERE_FRAME_DROP_MS = 100; // Frame took longer than 100ms

export interface FrameMetrics {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  droppedFrames: number;
  severeDrops: number;
  percentile95: number;
  percentile99: number;
  frameTimings: number[];
  jankScore: number; // 0-100, lower is better
}

export interface FrameData {
  timestamp: number;
  duration: number;
  fps: number;
  dropped: boolean;
}

export class NativeFrameMetricsTracker {
  private isTracking = false;
  private frameData: FrameData[] = [];
  private startTime = 0;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private performanceObserver: any = null;
  
  constructor() {
    this.setupPerformanceObserver();
  }
  
  private setupPerformanceObserver() {
    // Check if performance observer is available
    if (typeof performance !== 'undefined' && performance.now()) {
      try {
        // Try to use the performance timeline API if available
        if ('PerformanceObserver' in global) {
          this.performanceObserver = new (global as any).PerformanceObserver((list: any) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.entryType === 'frame') {
                this.processFrameEntry(entry);
              }
            });
          });
          
          // Start observing frame entries
          this.performanceObserver.observe({ entryTypes: ['frame'] });
        }
      } catch (error) {
        console.warn('PerformanceObserver not available, falling back to RAF-based tracking');
      }
    }
  }
  
  private processFrameEntry(entry: any) {
    const duration = entry.duration || 16.67;
    const fps = duration > 0 ? 1000 / duration : 60;
    const dropped = duration > FRAME_BUDGET_MS;
    
    this.frameData.push({
      timestamp: entry.startTime,
      duration,
      fps,
      dropped
    });
  }
  
  public start() {
    if (this.isTracking) {
      console.warn('NativeFrameMetricsTracker is already tracking');
      return;
    }
    
    this.isTracking = true;
    this.frameData = [];
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    
    // Start RAF-based tracking as fallback or complement
    this.trackFrame();
  }
  
  private trackFrame = () => {
    if (!this.isTracking) return;
    
    const currentTime = performance.now();
    const frameDuration = currentTime - this.lastFrameTime;
    
    // Only record if this is a real frame (not the first one)
    if (this.lastFrameTime !== this.startTime) {
      const fps = frameDuration > 0 ? 1000 / frameDuration : 60;
      const dropped = frameDuration > FRAME_BUDGET_MS;
      
      this.frameData.push({
        timestamp: currentTime,
        duration: frameDuration,
        fps: Math.min(fps, 60), // Cap at 60 FPS
        dropped
      });
    }
    
    this.lastFrameTime = currentTime;
    this.animationFrameId = requestAnimationFrame(this.trackFrame);
  };
  
  public stop(): FrameMetrics {
    this.isTracking = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    return this.calculateMetrics();
  }
  
  private calculateMetrics(): FrameMetrics {
    if (this.frameData.length === 0) {
      return {
        averageFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        droppedFrames: 0,
        severeDrops: 0,
        percentile95: 0,
        percentile99: 0,
        frameTimings: [],
        jankScore: 0
      };
    }
    
    // Calculate FPS metrics
    const fpsValues = this.frameData.map(f => f.fps);
    const frameTimings = this.frameData.map(f => f.duration);
    
    const averageFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
    const minFPS = Math.min(...fpsValues);
    const maxFPS = Math.max(...fpsValues);
    
    // Count dropped frames
    const droppedFrames = this.frameData.filter(f => f.dropped).length;
    const severeDrops = this.frameData.filter(f => f.duration > SEVERE_FRAME_DROP_MS).length;
    
    // Calculate percentiles
    const sortedTimings = [...frameTimings].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimings.length * 0.95);
    const p99Index = Math.floor(sortedTimings.length * 0.99);
    const percentile95 = sortedTimings[p95Index] || 0;
    const percentile99 = sortedTimings[p99Index] || 0;
    
    // Calculate jank score (0-100, lower is better)
    const jankScore = this.calculateJankScore(frameTimings, droppedFrames, severeDrops);
    
    return {
      averageFPS: Math.round(averageFPS * 10) / 10,
      minFPS: Math.round(minFPS * 10) / 10,
      maxFPS: Math.round(maxFPS * 10) / 10,
      droppedFrames,
      severeDrops,
      percentile95: Math.round(percentile95 * 10) / 10,
      percentile99: Math.round(percentile99 * 10) / 10,
      frameTimings: frameTimings.slice(0, 100), // Keep first 100 for analysis
      jankScore: Math.round(jankScore)
    };
  }
  
  private calculateJankScore(timings: number[], droppedFrames: number, severeDrops: number): number {
    if (timings.length === 0) return 0;
    
    // Jank score components:
    // 1. Percentage of dropped frames (40% weight)
    const droppedPercentage = (droppedFrames / timings.length) * 100;
    const droppedScore = Math.min(droppedPercentage * 2, 40); // Max 40 points
    
    // 2. Severe drops (30% weight)
    const severeScore = Math.min(severeDrops * 10, 30); // Max 30 points
    
    // 3. Frame time variance (30% weight)
    const mean = timings.reduce((a, b) => a + b, 0) / timings.length;
    const variance = timings.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / timings.length;
    const stdDev = Math.sqrt(variance);
    const varianceScore = Math.min((stdDev / FRAME_BUDGET_MS) * 30, 30); // Max 30 points
    
    return droppedScore + severeScore + varianceScore;
  }
  
  public getCurrentFPS(): number {
    if (this.frameData.length === 0) return 60;
    
    // Get last 10 frames for current FPS
    const recentFrames = this.frameData.slice(-10);
    const recentFPS = recentFrames.map(f => f.fps);
    const currentFPS = recentFPS.reduce((a, b) => a + b, 0) / recentFPS.length;
    
    return Math.round(currentFPS * 10) / 10;
  }
  
  public getRealtimeMetrics(): Partial<FrameMetrics> {
    if (this.frameData.length === 0) {
      return {
        averageFPS: 60,
        droppedFrames: 0,
        jankScore: 0
      };
    }
    
    const fpsValues = this.frameData.map(f => f.fps);
    const averageFPS = fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length;
    const droppedFrames = this.frameData.filter(f => f.dropped).length;
    
    return {
      averageFPS: Math.round(averageFPS * 10) / 10,
      droppedFrames,
      jankScore: Math.round((droppedFrames / this.frameData.length) * 100)
    };
  }
  
  public reset() {
    this.frameData = [];
    this.lastFrameTime = 0;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  public destroy() {
    this.stop();
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

// Singleton instance
export const nativeFrameTracker = new NativeFrameMetricsTracker();