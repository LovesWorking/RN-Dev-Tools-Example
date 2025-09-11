/**
 * Environment Variables feature - UI components only
 * Core functionality is in @rn-dev-tools/react-native-env-manager package
 */

// UI Components
export { EnvVarsModal } from "./EnvVarsModal";
// Note: EnvironmentIndicator has been moved to floatingMenu/components
// Re-export Environment type for backward compatibility
export type { Environment } from "../../floatingMenu/components/EnvironmentIndicator";

// Re-export core functionality from the env-manager package
export type { 
  RequiredEnvVar, 
  EnvVarInfo, 
  EnvVarStats, 
  EnvVarType 
} from "@rn-dev-tools/react-native-env-manager";

export { 
  envVar, 
  createEnvVarConfig,
  useDynamicEnv,
  processEnvVars,
  calculateStats,
  getEnvVarType
} from "@rn-dev-tools/react-native-env-manager";