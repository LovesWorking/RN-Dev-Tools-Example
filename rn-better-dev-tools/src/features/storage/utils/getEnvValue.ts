/**
 * Get environment variable value from mobile sources
 * Handles React Native and Expo environments only
 */
export function getEnvValue(key: string): unknown {
  // Try process.env first (works in React Native with Metro bundler)
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env[key] !== undefined
  ) {
    return process.env[key];
  }

  // Try Expo Constants (for Expo apps)
  try {
    // Check if Constants exists as a global variable (from expo-constants)
    const globalConstants =
      (globalThis as { Constants?: unknown }).Constants || (global as { Constants?: unknown }).Constants;
    if (globalConstants && typeof globalConstants === 'object' && globalConstants !== null) {
      const constants = globalConstants as Record<string, unknown>;
      
      // Check expoConfig
      if (constants.expoConfig && typeof constants.expoConfig === 'object' && constants.expoConfig !== null) {
        const expoConfig = constants.expoConfig as Record<string, unknown>;
        if (expoConfig.extra && typeof expoConfig.extra === 'object' && expoConfig.extra !== null) {
          const extra = expoConfig.extra as Record<string, unknown>;
          if (extra[key] !== undefined) {
            return extra[key];
          }
        }
      }
      
      // Check manifest
      if (constants.manifest && typeof constants.manifest === 'object' && constants.manifest !== null) {
        const manifest = constants.manifest as Record<string, unknown>;
        if (manifest.extra && typeof manifest.extra === 'object' && manifest.extra !== null) {
          const extra = manifest.extra as Record<string, unknown>;
          if (extra[key] !== undefined) {
            return extra[key];
          }
        }
      }
      
      // Check manifest2
      if (constants.manifest2 && typeof constants.manifest2 === 'object' && constants.manifest2 !== null) {
        const manifest2 = constants.manifest2 as Record<string, unknown>;
        if (manifest2.extra && typeof manifest2.extra === 'object' && manifest2.extra !== null) {
          const extra = manifest2.extra as Record<string, unknown>;
          if (extra[key] !== undefined) {
            return extra[key];
          }
        }
      }
    }
  } catch {
    // Constants not available
  }

  // Try global object (React Native global)
  if (typeof global !== "undefined" && (global as { [key: string]: unknown })[key] !== undefined) {
    return (global as { [key: string]: unknown })[key];
  }

  // Try __DEV__ flag for common React Native env vars
  if (key === "NODE_ENV" && typeof __DEV__ !== "undefined") {
    return __DEV__ ? "development" : "production";
  }

  return undefined;
}
