import { StatsCard } from "../../../shared/ui/components";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Download,
  Timer,
} from "rn-better-dev-tools/icons";
import type { NetworkStats } from "../types";
import { formatBytes, formatDuration } from "../utils/formatting";

interface NetworkStatsProps {
  stats: NetworkStats;
}

export function NetworkStatsSection({ stats }: NetworkStatsProps) {
  return (
    <StatsCard title="Network Statistics">
      <StatsCard.Grid columns={4}>
        <StatsCard.Item
          icon={Activity}
          label="Total"
          value={stats.totalRequests}
          color="primary"
        />
        <StatsCard.Item
          icon={CheckCircle}
          label="Success"
          value={stats.successfulRequests}
          color="success"
        />
        <StatsCard.Item
          icon={XCircle}
          label="Failed"
          value={stats.failedRequests}
          color="error"
        />
        <StatsCard.Item
          icon={Clock}
          label="Pending"
          value={stats.pendingRequests}
          color="warning"
        />
      </StatsCard.Grid>
      
      <StatsCard.Divider />
      
      <StatsCard.Grid columns={3}>
        <StatsCard.Item
          icon={Upload}
          label="Sent"
          value={formatBytes(stats.totalDataSent)}
          color="info"
          size="small"
        />
        <StatsCard.Item
          icon={Download}
          label="Received"
          value={formatBytes(stats.totalDataReceived)}
          color="info"
          size="small"
        />
        <StatsCard.Item
          icon={Timer}
          label="Avg Time"
          value={stats.averageDuration ? formatDuration(stats.averageDuration) : "-"}
          color="#9CA3AF"
          size="small"
        />
      </StatsCard.Grid>
    </StatsCard>
  );
}
