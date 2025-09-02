import { useMemo } from "react";

import { useDynamicEnv } from "../hooks";
import { RequiredEnvVar } from "../types";
import { processEnvVars, calculateStats, getSubtitle } from "../utils";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";

// Custom hook for getting subtitle (for compatibility)
export function useEnvVarsSubtitle(requiredEnvVars?: RequiredEnvVar[]) {
  const envResults = useDynamicEnv();

  const autoCollectedEnvVars = useMemo(() => {
    const envVars: Record<string, string> = {};
    envResults.forEach(({ key, data }) => {
      if (data !== undefined && data !== null) {
        envVars[key] = typeof data === "string" ? data : displayValue(data);
      }
    });
    return envVars;
  }, [envResults]);

  const { requiredVars, optionalVars } = useMemo(() => {
    return processEnvVars(autoCollectedEnvVars, requiredEnvVars);
  }, [autoCollectedEnvVars, requiredEnvVars]);

  const stats = useMemo(() => {
    return calculateStats(requiredVars, optionalVars, autoCollectedEnvVars);
  }, [requiredVars, optionalVars, autoCollectedEnvVars]);

  return getSubtitle(stats);
}
