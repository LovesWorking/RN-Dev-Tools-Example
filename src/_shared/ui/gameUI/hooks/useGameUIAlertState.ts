import { useMemo, useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Activity,
  Database,
  HelpCircle,
} from "lucide-react-native";
import { gameUIColors } from "../constants/gameUIColors";

export type AlertStateType = 
  | "OPTIMAL"
  | "WARNING"
  | "ERROR"
  | "CRITICAL"
  | "LOADING"
  | "EMPTY";

export interface AlertStateConfig {
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  label: string;
  subtitle: string;
  pulse?: boolean;
}

// Standard alert states for ENV and Storage
export const GAME_UI_ALERT_STATES: Record<AlertStateType, AlertStateConfig> = {
  OPTIMAL: {
    icon: CheckCircle,
    color: gameUIColors.success,
    label: "CONFIG OK",
    subtitle: "All requirements met",
    pulse: false,
  },
  WARNING: {
    icon: AlertTriangle,
    color: gameUIColors.warning,
    label: "CONFIG WARNING",
    subtitle: "Check values and types",
    pulse: false,
  },
  ERROR: {
    icon: AlertCircle,
    color: gameUIColors.error,
    label: "CONFIG ERROR",
    subtitle: "Missing required data",
    pulse: false,
  },
  CRITICAL: {
    icon: AlertOctagon,
    color: gameUIColors.critical,
    label: "CONFIG FAILURE",
    subtitle: "Multiple critical issues",
    pulse: false,
  },
  LOADING: {
    icon: Activity,
    color: gameUIColors.info,
    label: "LOADING",
    subtitle: "Reading configuration...",
    pulse: true,
  },
  EMPTY: {
    icon: HelpCircle,
    color: gameUIColors.muted,
    label: "NO DATA",
    subtitle: "No configuration found",
    pulse: false,
  },
};

export interface GameUIStats {
  totalCount: number;
  missingCount: number;
  wrongValueCount: number;
  wrongTypeCount: number;
}

/**
 * Hook to determine alert state from stats and provide animations
 * Reusable across ENV, Storage, and other validation screens
 */
export function useGameUIAlertState(
  stats: GameUIStats,
  customStates?: Partial<Record<AlertStateType, AlertStateConfig>>
) {
  // Merge custom states with defaults
  const alertStates = useMemo(
    () => ({ ...GAME_UI_ALERT_STATES, ...customStates }),
    [customStates]
  );

  // Determine alert state based on stats
  const alertState = useMemo<AlertStateType>(() => {
    if (stats.totalCount === 0) return "EMPTY";
    if (stats.missingCount > 2 || stats.wrongTypeCount > 2) return "CRITICAL";
    if (stats.missingCount > 0) return "ERROR";
    if (stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) return "WARNING";
    return "OPTIMAL";
  }, [stats]);

  const alertConfig = alertStates[alertState];

  // Animation values
  const alertOpacity = useSharedValue(1);
  const alertScale = useSharedValue(1);

  // Animate on state change
  useEffect(() => {
    alertOpacity.value = 0;
    alertOpacity.value = withTiming(1, { duration: 300 });
    alertScale.value = 0.95;
    alertScale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [alertState]);

  const alertAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: alertScale.value }],
    opacity: alertOpacity.value,
  }));

  return {
    alertState,
    alertConfig,
    alertAnimatedStyle,
    alertOpacity,
    alertScale,
  };
}