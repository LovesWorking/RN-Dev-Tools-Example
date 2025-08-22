/**
 * Component Render Performance Tracker
 * 
 * Tracks component mount and update timing for performance analysis.
 * Uses React lifecycle methods and hooks to measure render performance.
 */

export interface RenderMetrics {
  componentName: string;
  mountTime?: number;
  updateCount: number;
  updates: UpdateMetric[];
  averageUpdateTime: number;
  totalRenderTime: number;
  lastRenderTime: number;
}

export interface UpdateMetric {
  timestamp: number;
  duration: number;
  triggerType: 'props' | 'state' | 'force' | 'parent';
  propsChanged?: string[];
}

export class ComponentRenderTracker {
  private metrics: Map<string, RenderMetrics> = new Map();
  private renderStartTimes: Map<string, number> = new Map();
  private mountStartTimes: Map<string, number> = new Map();
  
  // Start tracking a component mount
  startMount(componentName: string): void {
    this.mountStartTimes.set(componentName, performance.now());
    
    // Initialize metrics if not exists
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, {
        componentName,
        updateCount: 0,
        updates: [],
        averageUpdateTime: 0,
        totalRenderTime: 0,
        lastRenderTime: 0,
      });
    }
  }
  
  // Complete mount tracking
  endMount(componentName: string): void {
    const startTime = this.mountStartTimes.get(componentName);
    if (!startTime) {
      console.warn(`[RenderTracker] No mount start time found for ${componentName}`);
      return;
    }
    
    const mountTime = performance.now() - startTime;
    const metrics = this.metrics.get(componentName);
    
    if (metrics) {
      metrics.mountTime = mountTime;
      metrics.totalRenderTime += mountTime;
      metrics.lastRenderTime = mountTime;
    }
    
    this.mountStartTimes.delete(componentName);
  }
  
  // Start tracking a render/update
  startRender(componentName: string): void {
    this.renderStartTimes.set(componentName, performance.now());
  }
  
  // Complete render tracking
  endRender(
    componentName: string, 
    triggerType: UpdateMetric['triggerType'] = 'props',
    propsChanged?: string[]
  ): void {
    const startTime = this.renderStartTimes.get(componentName);
    if (!startTime) {
      console.warn(`[RenderTracker] No render start time found for ${componentName}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    const metrics = this.metrics.get(componentName);
    
    if (metrics) {
      // Add update metric
      const update: UpdateMetric = {
        timestamp: Date.now(),
        duration,
        triggerType,
        propsChanged,
      };
      
      metrics.updates.push(update);
      metrics.updateCount++;
      metrics.totalRenderTime += duration;
      metrics.lastRenderTime = duration;
      
      // Calculate average update time
      metrics.averageUpdateTime = 
        metrics.updates.reduce((sum, u) => sum + u.duration, 0) / metrics.updates.length;
      
    }
    
    this.renderStartTimes.delete(componentName);
  }
  
  // Get metrics for a specific component
  getMetrics(componentName: string): RenderMetrics | undefined {
    return this.metrics.get(componentName);
  }
  
  // Get all metrics
  getAllMetrics(): RenderMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  // Clear metrics for a component
  clearMetrics(componentName: string): void {
    this.metrics.delete(componentName);
    this.renderStartTimes.delete(componentName);
    this.mountStartTimes.delete(componentName);
  }
  
  // Clear all metrics
  clearAllMetrics(): void {
    this.metrics.clear();
    this.renderStartTimes.clear();
    this.mountStartTimes.clear();
  }
  
  // Get performance summary
  getSummary(): {
    totalComponents: number;
    totalRenders: number;
    averageRenderTime: number;
    slowestComponent: string | null;
    fastestComponent: string | null;
  } {
    const allMetrics = this.getAllMetrics();
    
    if (allMetrics.length === 0) {
      return {
        totalComponents: 0,
        totalRenders: 0,
        averageRenderTime: 0,
        slowestComponent: null,
        fastestComponent: null,
      };
    }
    
    const totalRenders = allMetrics.reduce((sum, m) => sum + m.updateCount + 1, 0); // +1 for mount
    const totalRenderTime = allMetrics.reduce((sum, m) => sum + m.totalRenderTime, 0);
    
    const sorted = [...allMetrics].sort((a, b) => b.averageUpdateTime - a.averageUpdateTime);
    
    return {
      totalComponents: allMetrics.length,
      totalRenders,
      averageRenderTime: totalRenderTime / totalRenders,
      slowestComponent: sorted[0]?.componentName || null,
      fastestComponent: sorted[sorted.length - 1]?.componentName || null,
    };
  }
}

// Singleton instance
export const renderTracker = new ComponentRenderTracker();