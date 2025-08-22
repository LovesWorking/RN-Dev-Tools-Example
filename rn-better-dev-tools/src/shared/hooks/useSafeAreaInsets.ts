import { useState, useEffect, useMemo } from 'react';
import { Platform, Dimensions, StatusBar } from 'react-native';

// Types
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}


// Device detection map for iOS
const iPhoneDimensionMap: Record<string, Omit<SafeAreaInsets, 'left' | 'right'>> = {
  // iPhone 14 Pro, 14 Pro Max, 15, 15 Plus, 15 Pro, 15 Pro Max, 16 series (Dynamic Island)
  "393,852": { top: 59, bottom: 34 }, // 14 Pro, 15, 15 Pro, 16, 16 Pro
  "430,932": { top: 59, bottom: 34 }, // 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus, 16 Pro Max
  
  // iPhone 12, 12 Pro, 13, 13 Pro, 14
  "390,844": { top: 47, bottom: 34 },
  
  // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  "428,926": { top: 47, bottom: 34 },
  
  // iPhone 12 mini, 13 mini (newer value takes precedence)
  "375,812": { top: 50, bottom: 34 },
  
  // iPhone XR, 11
  "414,896": { top: 48, bottom: 34 },
};

// Pure JS implementation
const getPureJSSafeAreaInsets = (): SafeAreaInsets => {
  if (Platform.OS === 'android') {
    const androidVersion = Platform.Version;
    const statusBarHeight = StatusBar.currentHeight || 0;
    
    // Android 10+ with gesture navigation typically has bottom insets
    const hasGestureNav = androidVersion >= 29;
    
    return {
      top: statusBarHeight,
      bottom: hasGestureNav ? 20 : 0, // Approximate gesture bar height
      left: 0,
      right: 0,
    };
  }
  
  // iOS
  const { width, height } = Dimensions.get('window');
  const dimensionKey = `${width},${height}`;
  
  const deviceInsets = iPhoneDimensionMap[dimensionKey];
  
  if (deviceInsets) {
    return {
      ...deviceInsets,
      left: 0,
      right: 0,
    };
  }
  
  // Default for older iPhones without notch
  return {
    top: 20, // Standard status bar
    bottom: 0,
    left: 0,
    right: 0,
  };
};

// Check if npm package is available at module level (not inside component)
let hasNativePackage = false;
let SafeAreaContextModule: any = null;

try {
  SafeAreaContextModule = require('react-native-safe-area-context');
  if (SafeAreaContextModule?.useSafeAreaInsets) {
    hasNativePackage = true;
    console.log('✅ react-native-safe-area-context package found - using native implementation');
  }
} catch {
  console.warn('⚠️ react-native-safe-area-context not found - using pure JS fallback implementation');
}

// Create a wrapper hook that always exists
const useNativeSafeAreaInsets = hasNativePackage 
  ? SafeAreaContextModule.useSafeAreaInsets
  : () => null;

// Main hook with automatic fallback
export const useSafeAreaInsets = (): SafeAreaInsets => {
  // Always call the native hook unconditionally (returns null if not available)
  const nativeInsets = useNativeSafeAreaInsets();
  
  // Fallback state for pure JS implementation
  const [fallbackInsets, setFallbackInsets] = useState<SafeAreaInsets>(() => getPureJSSafeAreaInsets());
  
  useEffect(() => {
    // Only set up orientation listener if using fallback
    if (!nativeInsets) {
      const updateInsets = () => {
        setFallbackInsets(getPureJSSafeAreaInsets());
      };
      
      const subscription = Dimensions.addEventListener('change', updateInsets);
      
      return () => {
        subscription?.remove();
      };
    }
  }, [!nativeInsets]); // Use boolean for stable dependency
  
  // Return native insets if available, otherwise use fallback
  return nativeInsets || fallbackInsets;
};



// Utility to check if device has notch/dynamic island
export const hasNotch = (): boolean => {
  const insets = getPureJSSafeAreaInsets();
  
  if (Platform.OS === 'android') {
    // Android with tall status bar might have notch
    return insets.top > 24;
  }
  
  // iOS with top inset > 20 has notch or dynamic island
  return insets.top > 20;
};

// Configuration helper for migration
export const SafeAreaConfig = {
  // Check if npm package is available
  hasNativeSupport: (): boolean => {
    try {
      require('react-native-safe-area-context');
      return true;
    } catch {
      return false;
    }
  },
  
  // Force pure JS implementation (useful for testing)
  forcePureJS: false,
  
  // Get current implementation type
  getImplementationType: (): 'native' | 'pure-js' => {
    if (SafeAreaConfig.forcePureJS) return 'pure-js';
    return SafeAreaConfig.hasNativeSupport() ? 'native' : 'pure-js';
  },
};

// Re-export for compatibility
export const useSafeAreaFrame = () => {
  const { width, height } = Dimensions.get('window');
  return { x: 0, y: 0, width, height };
};


// Export the pure JS implementation directly for compatibility
export const getSafeAreaInsets = getPureJSSafeAreaInsets;

// Default export
export default useSafeAreaInsets;