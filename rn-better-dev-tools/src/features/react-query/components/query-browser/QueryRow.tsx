import { Query } from "@tanstack/react-query";
import { getQueryStatusLabel } from "../../utils/getQueryStatusLabel";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { CompactRow } from "@/rn-better-dev-tools/src/shared/ui/components/CompactRow";

const getQueryText = (query: Query) => {
  if (!query?.queryKey) return "Unknown Query";
  const keys = Array.isArray(query.queryKey)
    ? query.queryKey
    : [query.queryKey];
  return (
    keys
      .filter((k) => k != null)
      .map((k) => String(k))
      .join(" › ") || "Unknown Query"
  );
};

interface QueryRowProps {
  query: Query;
  isSelected: boolean;
  onSelect: (query: Query) => void;
}

const QueryRow: React.FC<QueryRowProps> = ({ query, isSelected, onSelect }) => {
  // Game UI status color mapping
  const getStatusHexColor = (status: string): string => {
    switch (status) {
      case "fresh":
        return gameUIColors.success;
      case "stale":
        return gameUIColors.warning;
      case "inactive":
        return gameUIColors.muted;
      case "fetching":
        return gameUIColors.info;
      case "paused":
        return gameUIColors.storage;
      default:
        return gameUIColors.secondary;
    }
  };

  const status = getQueryStatusLabel(query);
  const observerCount = query.getObserversCount();
  const isDisabled = query.isDisabled();
  const queryHash = getQueryText(query);

  return (
    <CompactRow
      statusDotColor={getStatusHexColor(status)}
      statusLabel={status.charAt(0).toUpperCase() + status.slice(1)}
      statusSublabel={`${observerCount} observer${observerCount !== 1 ? "s" : ""}`}
      primaryText={queryHash}
      secondaryText={isDisabled ? "Disabled" : undefined}
      badgeText={observerCount}
      badgeColor={getStatusHexColor(status)}
      isSelected={isSelected}
      onPress={() => onSelect(query)}
    />
  );
};

export default QueryRow;
