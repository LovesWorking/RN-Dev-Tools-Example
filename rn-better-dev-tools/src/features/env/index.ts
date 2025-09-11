/**
 * Environment Variables feature - UI components only
 * Core functionality is in @rn-dev-tools/react-native-env-manager package
 */

// UI Components
export { EnvVarsModal } from "./components/EnvVarsModal";
export { EnvironmentIndicator } from "./components/EnvironmentIndicator";
export type { Environment } from "./components/EnvironmentIndicator";

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