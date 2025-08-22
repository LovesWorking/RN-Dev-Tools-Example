/**
 * useRenderTracking Hook
 * 
 * React hook for tracking component render performance.
 * Automatically tracks mount, unmount, and re-renders.
 */

import React, { useEffect, useRef } from 'react';
import { renderTracker } from './ComponentRenderTracker';

interface UseRenderTrackingOptions {
  // Track which props trigger re-renders
  trackProps?: Record<string, any>;
  // Enable/disable tracking
  enabled?: boolean;
  // Custom component name (defaults to component display name)
  componentName?: string;
}

export function useRenderTracking(
  componentNameOrOptions: string | UseRenderTrackingOptions = {}
): void {
  // Parse options
  const options: UseRenderTrackingOptions = 
    typeof componentNameOrOptions === 'string' 
      ? { componentName: componentNameOrOptions }
      : componentNameOrOptions;
  
  const {
    trackProps = {},
    enabled = true,
    componentName = 'UnknownComponent'
  } = options;
  
  const renderCount = useRef(0);
  const previousProps = useRef<Record<string, any>>({});
  const isMounted = useRef(false);
  
  // Skip if tracking is disabled
  if (!enabled) {
    return;
  }
  
  // Track mount
  useEffect(() => {
    if (!isMounted.current) {
      renderTracker.startMount(componentName);
      // Use RAF to measure after paint
      requestAnimationFrame(() => {
        renderTracker.endMount(componentName);
      });
      isMounted.current = true;
    }
    
    return () => {
      // Clean up on unmount
      isMounted.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Track renders
  useEffect(() => {
    renderCount.current++;
    
    // Skip mount render (already tracked)
    if (renderCount.current === 1) {
      previousProps.current = { ...trackProps };
      return;
    }
    
    // Start render tracking
    renderTracker.startRender(componentName);
    
    // Determine what changed
    const changedProps: string[] = [];
    let triggerType: 'props' | 'state' | 'parent' = 'parent';
    
    if (trackProps && Object.keys(trackProps).length > 0) {
      for (const key in trackProps) {
        if (trackProps[key] !== previousProps.current[key]) {
          changedProps.push(key);
          triggerType = 'props';
        }
      }
    }
    
    // If no props changed but we re-rendered, it's likely state or parent
    if (changedProps.length === 0 && renderCount.current > 1) {
      triggerType = 'state'; // Could be state or parent, hard to distinguish
    }
    
    // End render tracking after paint
    requestAnimationFrame(() => {
      renderTracker.endRender(componentName, triggerType, changedProps);
    });
    
    // Update previous props
    previousProps.current = { ...trackProps };
  });
}

/**
 * Higher-order component for render tracking
 * Wraps a component to automatically track its render performance
 */
export function withRenderTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const TrackedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Component';
    useRenderTracking({ componentName: name, trackProps: props });
    return <Component {...props} />;
  };
  
  TrackedComponent.displayName = `withRenderTracking(${componentName || Component.displayName || Component.name})`;
  
  return TrackedComponent;
}