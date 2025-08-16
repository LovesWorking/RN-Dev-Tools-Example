/**
 * React Profiler API Integration
 * 
 * Integrates with React's built-in Profiler API to capture detailed render metrics
 * including component tree render times, interactions, and commit phases.
 */

import React, { Profiler, ProfilerOnRenderCallback, useCallback, useRef } from 'react';
import { renderTracker } from './ComponentRenderTracker';

export interface ProfilerMetrics {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<any>;
}

export interface AggregatedProfilerMetrics {
  componentId: string;
  mountMetrics?: ProfilerMetrics;
  updateMetrics: ProfilerMetrics[];
  totalActualTime: number;
  totalBaseTime: number;
  renderCount: number;
  averageActualDuration: number;
  averageBaseDuration: number;
  worstCaseActualDuration: number;
  bestCaseActualDuration: number;
}

class ReactProfilerStore {
  private metrics: Map<string, AggregatedProfilerMetrics> = new Map();
  private interactionTracker: Map<string, Set<any>> = new Map();
  
  recordMetrics(metrics: ProfilerMetrics): void {
    const existing = this.metrics.get(metrics.id);
    
    if (!existing) {
      // First time seeing this component
      const aggregated: AggregatedProfilerMetrics = {
        componentId: metrics.id,
        mountMetrics: metrics.phase === 'mount' ? metrics : undefined,
        updateMetrics: metrics.phase === 'update' ? [metrics] : [],
        totalActualTime: metrics.actualDuration,
        totalBaseTime: metrics.baseDuration,
        renderCount: 1,
        averageActualDuration: metrics.actualDuration,
        averageBaseDuration: metrics.baseDuration,
        worstCaseActualDuration: metrics.actualDuration,
        bestCaseActualDuration: metrics.actualDuration,
      };
      
      this.metrics.set(metrics.id, aggregated);
    } else {
      // Update existing metrics
      if (metrics.phase === 'mount' && !existing.mountMetrics) {
        existing.mountMetrics = metrics;
      } else if (metrics.phase === 'update') {
        existing.updateMetrics.push(metrics);
      }
      
      existing.totalActualTime += metrics.actualDuration;
      existing.totalBaseTime += metrics.baseDuration;
      existing.renderCount++;
      existing.averageActualDuration = existing.totalActualTime / existing.renderCount;
      existing.averageBaseDuration = existing.totalBaseTime / existing.renderCount;
      existing.worstCaseActualDuration = Math.max(
        existing.worstCaseActualDuration,
        metrics.actualDuration
      );
      existing.bestCaseActualDuration = Math.min(
        existing.bestCaseActualDuration,
        metrics.actualDuration
      );
    }
    
    // Track interactions
    if (metrics.interactions && metrics.interactions.size > 0) {
      const existingInteractions = this.interactionTracker.get(metrics.id) || new Set();
      metrics.interactions.forEach(interaction => existingInteractions.add(interaction));
      this.interactionTracker.set(metrics.id, existingInteractions);
    }
  }
  
  getMetrics(componentId: string): AggregatedProfilerMetrics | undefined {
    return this.metrics.get(componentId);
  }
  
  getAllMetrics(): AggregatedProfilerMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  clearMetrics(componentId?: string): void {
    if (componentId) {
      this.metrics.delete(componentId);
      this.interactionTracker.delete(componentId);
    } else {
      this.metrics.clear();
      this.interactionTracker.clear();
    }
  }
  
  getInteractions(componentId: string): Set<any> | undefined {
    return this.interactionTracker.get(componentId);
  }
  
  // Get performance insights
  getInsights(): {
    slowestComponent: string | null;
    fastestComponent: string | null;
    mostFrequentlyRendered: string | null;
    totalRenderTime: number;
    componentCount: number;
  } {
    const allMetrics = this.getAllMetrics();
    
    if (allMetrics.length === 0) {
      return {
        slowestComponent: null,
        fastestComponent: null,
        mostFrequentlyRendered: null,
        totalRenderTime: 0,
        componentCount: 0,
      };
    }
    
    const sortedByDuration = [...allMetrics].sort(
      (a, b) => b.averageActualDuration - a.averageActualDuration
    );
    const sortedByFrequency = [...allMetrics].sort(
      (a, b) => b.renderCount - a.renderCount
    );
    
    const totalRenderTime = allMetrics.reduce(
      (sum, m) => sum + m.totalActualTime,
      0
    );
    
    return {
      slowestComponent: sortedByDuration[0]?.componentId || null,
      fastestComponent: sortedByDuration[sortedByDuration.length - 1]?.componentId || null,
      mostFrequentlyRendered: sortedByFrequency[0]?.componentId || null,
      totalRenderTime,
      componentCount: allMetrics.length,
    };
  }
}

// Singleton store
export const profilerStore = new ReactProfilerStore();

// Hook to use React Profiler
export function useReactProfiler(componentId: string) {
  const onRenderCallback = useCallback<ProfilerOnRenderCallback>(
    (id: string, phase: "mount" | "update" | "nested-update", actualDuration: number, baseDuration: number, startTime: number, commitTime: number) => {
      const metrics: ProfilerMetrics = {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: new Set(), // No longer provided in newer React versions
      };
      
      // Store in our profiler store
      profilerStore.recordMetrics(metrics);
      
      // Note: We don't sync with renderTracker here since it's already handled
      // by useRenderTracking hook in the components themselves
    },
    []
  );
  
  return onRenderCallback;
}

// Wrapper component that adds profiling
interface ProfiledComponentProps {
  id: string;
  children: React.ReactNode;
  onRender?: ProfilerOnRenderCallback;
}

export function ProfiledComponent({ id, children, onRender }: ProfiledComponentProps) {
  const defaultOnRender = useReactProfiler(id);
  
  return (
    <Profiler id={id} onRender={onRender || defaultOnRender}>
      {children}
    </Profiler>
  );
}

// HOC to add profiling to any component
export function withProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentId: string
) {
  return React.forwardRef<any, P>((props, ref) => {
    return (
      <ProfiledComponent id={componentId}>
        <Component {...(props as P)} ref={ref} />
      </ProfiledComponent>
    );
  });
}

// Hook to get current profiler metrics
export function useProfilerMetrics(componentId: string): AggregatedProfilerMetrics | undefined {
  const [metrics, setMetrics] = React.useState<AggregatedProfilerMetrics | undefined>(
    () => profilerStore.getMetrics(componentId)
  );
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(profilerStore.getMetrics(componentId));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [componentId]);
  
  return metrics;
}

// Debug component to show profiler metrics
export function ProfilerDebugPanel() {
  const [insights, setInsights] = React.useState(profilerStore.getInsights());
  const [allMetrics, setAllMetrics] = React.useState(profilerStore.getAllMetrics());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setInsights(profilerStore.getInsights());
      setAllMetrics(profilerStore.getAllMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (allMetrics.length === 0) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      fontSize: 12,
      maxWidth: 300,
      maxHeight: 400,
      overflow: 'auto',
      zIndex: 10000,
    }}>
      <h3>React Profiler Metrics</h3>
      <div>
        <strong>Components:</strong> {insights.componentCount}<br />
        <strong>Total Render Time:</strong> {insights.totalRenderTime.toFixed(2)}ms<br />
        <strong>Slowest:</strong> {insights.slowestComponent}<br />
        <strong>Fastest:</strong> {insights.fastestComponent}<br />
        <strong>Most Rendered:</strong> {insights.mostFrequentlyRendered}<br />
      </div>
      <hr />
      <div>
        {allMetrics.map(metric => (
          <div key={metric.componentId} style={{ marginBottom: 10 }}>
            <strong>{metric.componentId}</strong><br />
            Renders: {metric.renderCount}<br />
            Avg: {metric.averageActualDuration.toFixed(2)}ms<br />
            Best: {metric.bestCaseActualDuration.toFixed(2)}ms<br />
            Worst: {metric.worstCaseActualDuration.toFixed(2)}ms<br />
          </div>
        ))}
      </div>
    </div>
  );
}