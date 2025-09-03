import { EmptyState as SharedEmptyState } from "../../shared/ui/components";

export const EmptyState = () => (
  <SharedEmptyState
    title="No log entries found"
    description="Logs will appear here as the app generates them"
    variant="card"
  />
);

export const EmptyFilterState = () => (
  <SharedEmptyState
    title="No matching entries"
    description="Try adjusting your filters to see more entries"
    variant="card"
  />
);
