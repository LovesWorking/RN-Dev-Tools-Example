import React, { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react-native";

// Import shared Game UI components
import {
  GameUICompactStats,
  gameUIColors,
  type StatCardConfig,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface GameUIQueryStatsProps {
  type: "queries" | "mutations";
  stats: {
    fresh?: number;
    stale?: number;
    fetching?: number;
    paused?: number;
    inactive?: number;
    pending?: number;
    success?: number;
    error?: number;
  };
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

export function GameUIQueryStats({
  type,
  stats,
  activeFilter,
  onFilterChange,
}: GameUIQueryStatsProps) {
  // Configure stats based on type (queries vs mutations)
  const statsConfig = useMemo<StatCardConfig[]>(() => {
    if (type === "queries") {
      return [
        {
          key: "fresh",
          label: "FRESH",
          subtitle: "Up-to-date",
          icon: CheckCircle2,
          color: gameUIColors.success,
          value: stats.fresh || 0,
          pulseDelay: 0,
          isActive: activeFilter === "fresh",
          onPress: () => onFilterChange?.(activeFilter === "fresh" ? null : "fresh"),
        },
        {
          key: "fetching",
          label: "LOADING",
          subtitle: "In progress",
          icon: Loader2,
          color: gameUIColors.info,
          value: stats.fetching || 0,
          pulseDelay: 200,
          isActive: activeFilter === "fetching",
          onPress: () => onFilterChange?.(activeFilter === "fetching" ? null : "fetching"),
        },
        {
          key: "paused",
          label: "PAUSED",
          subtitle: "Suspended",
          icon: PauseCircle,
          color: gameUIColors.storage,
          value: stats.paused || 0,
          pulseDelay: 400,
          isActive: activeFilter === "paused",
          onPress: () => onFilterChange?.(activeFilter === "paused" ? null : "paused"),
        },
        {
          key: "stale",
          label: "STALE",
          subtitle: "Outdated",
          icon: Clock,
          color: gameUIColors.warning,
          value: stats.stale || 0,
          pulseDelay: 600,
          isActive: activeFilter === "stale",
          onPress: () => onFilterChange?.(activeFilter === "stale" ? null : "stale"),
        },
        {
          key: "inactive",
          label: "IDLE",
          subtitle: "Unused",
          icon: Activity,
          color: gameUIColors.muted,
          value: stats.inactive || 0,
          pulseDelay: 800,
          isActive: activeFilter === "inactive",
          onPress: () => onFilterChange?.(activeFilter === "inactive" ? null : "inactive"),
        },
      ];
    } else {
      // Mutations stats
      return [
        {
          key: "pending",
          label: "PENDING",
          subtitle: "In progress",
          icon: Loader2,
          color: gameUIColors.info,
          value: stats.pending || 0,
          pulseDelay: 0,
          isActive: activeFilter === "pending",
          onPress: () => onFilterChange?.(activeFilter === "pending" ? null : "pending"),
        },
        {
          key: "success",
          label: "SUCCESS",
          subtitle: "Completed",
          icon: CheckCircle2,
          color: gameUIColors.success,
          value: stats.success || 0,
          pulseDelay: 200,
          isActive: activeFilter === "success",
          onPress: () => onFilterChange?.(activeFilter === "success" ? null : "success"),
        },
        {
          key: "error",
          label: "ERROR",
          subtitle: "Failed",
          icon: XCircle,
          color: gameUIColors.error,
          value: stats.error || 0,
          pulseDelay: 400,
          isActive: activeFilter === "error",
          onPress: () => onFilterChange?.(activeFilter === "error" ? null : "error"),
        },
        {
          key: "paused",
          label: "PAUSED",
          subtitle: "Suspended",
          icon: PauseCircle,
          color: gameUIColors.storage,
          value: stats.paused || 0,
          pulseDelay: 600,
          isActive: activeFilter === "paused",
          onPress: () => onFilterChange?.(activeFilter === "paused" ? null : "paused"),
        },
      ];
    }
  }, [type, stats, activeFilter, onFilterChange]);

  // Calculate total count
  const totalCount = useMemo(() => {
    return Object.values(stats).reduce((sum, val) => sum + (val || 0), 0);
  }, [stats]);

  // Calculate health percentage based on query/mutation status
  const healthPercentage = useMemo(() => {
    if (totalCount === 0) return 0;
    
    if (type === "queries") {
      const healthyCount = (stats.fresh || 0) + (stats.inactive || 0);
      return Math.round((healthyCount / totalCount) * 100);
    } else {
      const successCount = stats.success || 0;
      const totalCompleted = successCount + (stats.error || 0);
      if (totalCompleted === 0) return 100; // No completed mutations yet
      return Math.round((successCount / totalCompleted) * 100);
    }
  }, [type, stats, totalCount]);

  const healthStatus =
    healthPercentage >= 90 ? "OPTIMAL" : healthPercentage >= 70 ? "WARNING" : "CRITICAL";

  const healthColor =
    healthPercentage >= 90
      ? gameUIColors.success
      : healthPercentage >= 70
      ? gameUIColors.warning
      : gameUIColors.error;

  // Bottom stats
  const bottomStats = useMemo(() => {
    if (type === "queries") {
      return [
        { label: "TOTAL", value: totalCount },
        {
          label: "ACTIVE",
          value: (stats.fresh || 0) + (stats.fetching || 0) + (stats.stale || 0),
          color: gameUIColors.success,
        },
        {
          label: "INACTIVE",
          value: (stats.inactive || 0) + (stats.paused || 0),
          color: gameUIColors.muted,
        },
      ];
    } else {
      return [
        { label: "TOTAL", value: totalCount },
        {
          label: "COMPLETE",
          value: (stats.success || 0) + (stats.error || 0),
          color: gameUIColors.success,
        },
        {
          label: "PENDING",
          value: (stats.pending || 0) + (stats.paused || 0),
          color: gameUIColors.info,
        },
      ];
    }
  }, [type, stats, totalCount]);

  return (
    <GameUICompactStats
      statsConfig={statsConfig}
      totalCount={totalCount}
      header={{
        title: type === "queries" ? "QUERY STATUS" : "MUTATION STATUS",
        subtitle: type === "queries" ? "Data fetching state" : "Operation state",
        healthPercentage,
        healthStatus,
        healthColor,
      }}
      bottomStats={bottomStats}
    />
  );
}