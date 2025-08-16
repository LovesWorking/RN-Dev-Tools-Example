/**
 * Modal Performance Debugger
 * Advanced performance tracking for ClaudeModal60FPSClean
 * Tracks renders, gesture performance, animation frames, and bottlenecks
 */

interface PerformanceEvent {
  type: 'render' | 'gesture' | 'animation' | 'callback' | 'state_change';
  component: string;
  timestamp: number;
  duration?: number;
  details?: any;
}

interface GestureMetrics {
  type: string;
  startTime: number;
  moveCount: number;
  lastMoveTime: number;
  totalDuration?: number;
  averageFrameTime?: number;
  droppedFrames?: number;
  maxFrameTime?: number;
}

interface RenderMetrics {
  component: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  renderReasons: string[];
  propsChanged: Set<string>;
  stateChanged: Set<string>;
  unnecessaryRenders: number;
}

class ModalPerformanceDebugger {
  private events: PerformanceEvent[] = [];
  private gestureMetrics: Map<string, GestureMetrics> = new Map();
  private renderMetrics: Map<string, RenderMetrics> = new Map();
  private frameTimings: number[] = [];
  private lastFrameTime: number = 0;
  private debugMode: boolean = true;
  private sessionStartTime: number = Date.now();
  private renderTimers: Map<string, number> = new Map();
  private callbackTimers: Map<string, number> = new Map();
  
  // Thresholds for warnings
  private readonly SLOW_RENDER_THRESHOLD = 16; // ms (60fps)
  private readonly SLOW_GESTURE_THRESHOLD = 8; // ms
  private readonly MAX_RENDERS_PER_SECOND = 30;
  private readonly DROPPED_FRAME_THRESHOLD = 2;

  constructor(enabled = true) {
    this.debugMode = enabled;
    if (enabled) {
      console.log('🔍 === MODAL PERFORMANCE DEBUGGER INITIALIZED ===');
      console.log(`📊 Session started at: ${new Date().toISOString()}`);
    }
  }

  // ============ RENDER TRACKING ============
  
  trackRenderStart(componentName: string, props?: any, state?: any) {
    if (!this.debugMode) return;
    
    this.renderTimers.set(componentName, performance.now());
    
    // Initialize metrics if not exists
    if (!this.renderMetrics.has(componentName)) {
      this.renderMetrics.set(componentName, {
        component: componentName,
        renderCount: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
        renderReasons: [],
        propsChanged: new Set(),
        stateChanged: new Set(),
        unnecessaryRenders: 0,
      });
    }
  }

  trackRenderEnd(
    componentName: string, 
    reason?: string,
    changedProps?: string[],
    changedState?: string[]
  ) {
    if (!this.debugMode) return;
    
    const startTime = this.renderTimers.get(componentName);
    if (!startTime) {
      console.warn(`⚠️ No render start time for ${componentName}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    const metrics = this.renderMetrics.get(componentName)!;
    
    // Update metrics
    metrics.renderCount++;
    metrics.lastRenderTime = duration;
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.renderCount - 1) + duration) / metrics.renderCount;
    
    if (reason) metrics.renderReasons.push(reason);
    if (changedProps) changedProps.forEach(p => metrics.propsChanged.add(p));
    if (changedState) changedState.forEach(s => metrics.stateChanged.add(s));
    
    // Check for performance issues
    if (duration > this.SLOW_RENDER_THRESHOLD) {
      console.warn(
        `🐌 SLOW RENDER: ${componentName} took ${duration.toFixed(2)}ms`,
        `\n   Reason: ${reason || 'unknown'}`,
        changedProps ? `\n   Props changed: ${changedProps.join(', ')}` : '',
        changedState ? `\n   State changed: ${changedState.join(', ')}` : ''
      );
    }
    
    // Check for excessive renders
    const recentRenders = this.getRecentRenderCount(componentName, 1000);
    if (recentRenders > this.MAX_RENDERS_PER_SECOND) {
      console.error(
        `🔥 EXCESSIVE RENDERS: ${componentName} rendered ${recentRenders} times in last second!`,
        `\n   This is causing performance issues!`
      );
    }
    
    this.renderTimers.delete(componentName);
    
    // Log event
    this.logEvent({
      type: 'render',
      component: componentName,
      timestamp: Date.now(),
      duration,
      details: { reason, changedProps, changedState }
    });
  }

  // ============ GESTURE TRACKING ============
  
  trackGestureStart(gestureName: string, gestureType: string) {
    if (!this.debugMode) return;
    
    this.gestureMetrics.set(gestureName, {
      type: gestureType,
      startTime: performance.now(),
      moveCount: 0,
      lastMoveTime: performance.now(),
    });
    
    console.log(`👆 Gesture Started: ${gestureName} (${gestureType})`);
  }

  trackGestureMove(gestureName: string) {
    if (!this.debugMode) return;
    
    const metrics = this.gestureMetrics.get(gestureName);
    if (!metrics) return;
    
    const now = performance.now();
    const frameTime = now - metrics.lastMoveTime;
    
    metrics.moveCount++;
    metrics.lastMoveTime = now;
    
    // Track frame timing
    this.frameTimings.push(frameTime);
    if (this.frameTimings.length > 100) {
      this.frameTimings.shift(); // Keep last 100 frames
    }
    
    // Detect dropped frames
    if (frameTime > 16.67) { // 60fps threshold
      metrics.droppedFrames = (metrics.droppedFrames || 0) + 1;
      if (frameTime > 33) { // Really bad frame
        console.warn(
          `⚠️ DROPPED FRAME in ${gestureName}: ${frameTime.toFixed(2)}ms`,
          `(Move #${metrics.moveCount})`
        );
      }
    }
    
    // Update max frame time
    metrics.maxFrameTime = Math.max(metrics.maxFrameTime || 0, frameTime);
  }

  trackGestureEnd(gestureName: string) {
    if (!this.debugMode) return;
    
    const metrics = this.gestureMetrics.get(gestureName);
    if (!metrics) return;
    
    const totalDuration = performance.now() - metrics.startTime;
    metrics.totalDuration = totalDuration;
    metrics.averageFrameTime = totalDuration / metrics.moveCount;
    
    // Performance summary
    const droppedFrames = metrics.droppedFrames || 0;
    const fps = 1000 / metrics.averageFrameTime;
    
    console.log(
      `✋ Gesture Ended: ${gestureName}`,
      `\n   Duration: ${totalDuration.toFixed(2)}ms`,
      `\n   Moves: ${metrics.moveCount}`,
      `\n   Avg FPS: ${fps.toFixed(1)}`,
      `\n   Dropped Frames: ${droppedFrames}`,
      metrics.maxFrameTime ? `\n   Max Frame Time: ${metrics.maxFrameTime.toFixed(2)}ms` : ''
    );
    
    if (droppedFrames > this.DROPPED_FRAME_THRESHOLD) {
      console.error(
        `🔥 POOR GESTURE PERFORMANCE: ${gestureName} dropped ${droppedFrames} frames!`
      );
    }
    
    this.logEvent({
      type: 'gesture',
      component: gestureName,
      timestamp: Date.now(),
      duration: totalDuration,
      details: metrics
    });
  }

  // ============ CALLBACK TRACKING ============
  
  trackCallbackStart(callbackName: string) {
    if (!this.debugMode) return;
    this.callbackTimers.set(callbackName, performance.now());
  }

  trackCallbackEnd(callbackName: string, details?: any) {
    if (!this.debugMode) return;
    
    const startTime = this.callbackTimers.get(callbackName);
    if (!startTime) return;
    
    const duration = performance.now() - startTime;
    
    if (duration > 10) { // Callbacks should be fast
      console.warn(
        `⚠️ SLOW CALLBACK: ${callbackName} took ${duration.toFixed(2)}ms`,
        details ? `\n   Details: ${JSON.stringify(details)}` : ''
      );
    }
    
    this.callbackTimers.delete(callbackName);
    
    this.logEvent({
      type: 'callback',
      component: callbackName,
      timestamp: Date.now(),
      duration,
      details
    });
  }

  // ============ STATE TRACKING ============
  
  trackStateChange(componentName: string, stateName: string, oldValue: any, newValue: any) {
    if (!this.debugMode) return;
    
    const isSameValue = oldValue === newValue;
    
    if (isSameValue) {
      console.warn(
        `⚠️ UNNECESSARY STATE UPDATE: ${componentName}.${stateName}`,
        `\n   Value didn't change:`, oldValue
      );
    }
    
    this.logEvent({
      type: 'state_change',
      component: componentName,
      timestamp: Date.now(),
      details: { stateName, oldValue, newValue, unnecessary: isSameValue }
    });
  }

  // ============ ANIMATION TRACKING ============
  
  trackAnimationFrame(animationName: string) {
    if (!this.debugMode) return;
    
    const now = performance.now();
    const frameTime = this.lastFrameTime ? now - this.lastFrameTime : 0;
    this.lastFrameTime = now;
    
    if (frameTime > 16.67 && this.lastFrameTime) {
      console.warn(
        `⚠️ ANIMATION JANK: ${animationName} frame took ${frameTime.toFixed(2)}ms`
      );
    }
  }

  // ============ UTILITIES ============
  
  private getRecentRenderCount(componentName: string, timeWindow: number): number {
    const now = Date.now();
    const cutoff = now - timeWindow;
    
    return this.events.filter(e => 
      e.type === 'render' && 
      e.component === componentName && 
      e.timestamp > cutoff
    ).length;
  }

  private logEvent(event: PerformanceEvent) {
    this.events.push(event);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }
  }

  // ============ REPORTING ============
  
  generateReport() {
    if (!this.debugMode) return;
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    
    console.log('\n');
    console.log('📊 ========== PERFORMANCE REPORT ==========');
    console.log(`⏱️  Session Duration: ${sessionDuration.toFixed(1)}s`);
    console.log(`📝 Total Events: ${this.events.length}`);
    
    // Render Report
    console.log('\n🎨 === RENDER PERFORMANCE ===');
    this.renderMetrics.forEach((metrics, component) => {
      const renderRate = metrics.renderCount / sessionDuration;
      console.log(
        `\n  ${component}:`,
        `\n    • Renders: ${metrics.renderCount} (${renderRate.toFixed(1)}/sec)`,
        `\n    • Avg Time: ${metrics.averageRenderTime.toFixed(2)}ms`,
        `\n    • Last Time: ${metrics.lastRenderTime.toFixed(2)}ms`,
        metrics.propsChanged.size > 0 ? 
          `\n    • Props Changed: ${Array.from(metrics.propsChanged).join(', ')}` : '',
        metrics.stateChanged.size > 0 ? 
          `\n    • State Changed: ${Array.from(metrics.stateChanged).join(', ')}` : '',
        metrics.unnecessaryRenders > 0 ? 
          `\n    • ⚠️ Unnecessary Renders: ${metrics.unnecessaryRenders}` : ''
      );
    });
    
    // Gesture Report
    if (this.gestureMetrics.size > 0) {
      console.log('\n👆 === GESTURE PERFORMANCE ===');
      this.gestureMetrics.forEach((metrics, gesture) => {
        if (metrics.totalDuration) {
          console.log(
            `\n  ${gesture}:`,
            `\n    • Type: ${metrics.type}`,
            `\n    • Duration: ${metrics.totalDuration.toFixed(2)}ms`,
            `\n    • Moves: ${metrics.moveCount}`,
            `\n    • Avg Frame: ${metrics.averageFrameTime?.toFixed(2)}ms`,
            metrics.droppedFrames ? 
              `\n    • ⚠️ Dropped Frames: ${metrics.droppedFrames}` : ''
          );
        }
      });
    }
    
    // Find bottlenecks
    console.log('\n🔥 === BOTTLENECKS ===');
    const slowRenders = Array.from(this.renderMetrics.values())
      .filter(m => m.averageRenderTime > this.SLOW_RENDER_THRESHOLD)
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime);
    
    if (slowRenders.length > 0) {
      console.log('\n  Slow Renders:');
      slowRenders.forEach(m => {
        console.log(`    • ${m.component}: ${m.averageRenderTime.toFixed(2)}ms avg`);
      });
    }
    
    const excessiveRenders = Array.from(this.renderMetrics.values())
      .filter(m => (m.renderCount / sessionDuration) > 10)
      .sort((a, b) => b.renderCount - a.renderCount);
    
    if (excessiveRenders.length > 0) {
      console.log('\n  Excessive Renders:');
      excessiveRenders.forEach(m => {
        console.log(`    • ${m.component}: ${m.renderCount} renders (${(m.renderCount / sessionDuration).toFixed(1)}/sec)`);
      });
    }
    
    console.log('\n=========================================\n');
  }

  // Clear all metrics
  reset() {
    this.events = [];
    this.gestureMetrics.clear();
    this.renderMetrics.clear();
    this.frameTimings = [];
    this.renderTimers.clear();
    this.callbackTimers.clear();
    this.sessionStartTime = Date.now();
    console.log('🔄 Performance metrics reset');
  }

  // Enable/disable debugging
  setEnabled(enabled: boolean) {
    this.debugMode = enabled;
    console.log(`🔍 Performance debugging ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Export singleton instance
export const modalPerfDebugger = new ModalPerformanceDebugger(true);

// Export type for use in components
export type { ModalPerformanceDebugger };