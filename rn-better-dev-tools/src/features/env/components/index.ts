// Export UI components for environment variables
export { EnvVarsModal } from "./EnvVarsModal";
export { EnvironmentIndicator } from "./EnvironmentIndicator";
export type { Environment } from "./EnvironmentIndicator";

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
  calculateStats
} from "@rn-dev-tools/react-native-env-manager";