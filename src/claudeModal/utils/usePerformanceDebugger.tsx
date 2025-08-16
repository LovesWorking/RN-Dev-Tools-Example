/**
 * usePerformanceDebugger Hook
 * 
 * React hook that provides utilities for performance debugging
 * Note: Keyboard shortcuts not available in React Native
 */

import { useEffect, useRef } from 'react';
import { modalPerfDebugger } from './ModalPerformanceDebugger';

export function usePerformanceDebugger(enabled = true) {
  const intervalRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!enabled) return;
    
    // Log instructions on mount
    console.log('📊 === PERFORMANCE DEBUGGER ACTIVE ===');
    console.log('   • Automatic report every 10 renders');
    console.log('   • Report generated on modal close');
    console.log('   • Watch console for performance warnings');
    
    // Auto-generate report every 30 seconds while modal is open
    intervalRef.current = setInterval(() => {
      console.log('⏰ === AUTO PERFORMANCE CHECK (30s) ===');
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