/**
 * usePerformanceDebugger Hook
 * 
 * React hook that provides utilities for performance debugging
 * Note: Keyboard shortcuts not available in React Native
 */

import { useEffect, useRef } from 'react';
import { modalPerfDebugger } from './ModalPerformanceDebugger';

export function usePerformanceDebugger(enabled = true) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  
  useEffect(() => {
    if (!enabled) return;
    
    
    // Auto-generate report every 30 seconds while modal is open
    intervalRef.current = setInterval(() => {
      modalPerfDebugger.generateReport();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);
  
  return {
    generateReport: () => modalPerfDebugger.generateReport(),
    reset: () => modalPerfDebugger.reset(),
    setEnabled: (enabled: boolean) => modalPerfDebugger.setEnabled(enabled),
  };
}