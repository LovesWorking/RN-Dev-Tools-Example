import { Mutation, QueryKey, Query } from "@tanstack/react-query";
import { useGetMutationById } from "../../hooks/useSelectedMutation";
import { useGetQueryByQueryKey } from "../../hooks/useSelectedQuery";
import { QueryBrowserModal } from "./QueryBrowserModal";
import { DataEditorModal } from "./DataEditorModal";
import { MutationBrowserModal } from "./MutationBrowserModal";
import { MutationEditorModal } from "./MutationEditorModal";

interface ReactQueryModalProps {
  visible: boolean;
  selectedQueryKey?: QueryKey;
  selectedMutationId?: number;
  onQuerySelect: (query: Query | undefined) => void;
  onMutationSelect: (mutation: Mutation | undefined) => void;
  onClose: () => void;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
  activeTab: "queries" | "mutations";
  onTabChange: (tab: "queries" | "mutations") => void;
  enableSharedModalDimensions?: boolean;
}

/**
 * Refactored ReactQueryModal following composition principles
 *
 * Applied principles:
 * - Decompose by Responsibility: Separated query browser and data editor modals
 * - Prefer Composition over Configuration: Uses specialized modal components
 * - Extract Reusable Logic: Modal routing logic based on query selection
 * - Utilize Render Props: Each modal handles its own rendering responsibility
 */
export function ReactQueryModal({
  visible,
  selectedQueryKey,
  selectedMutationId,
  onQuerySelect,
  onMutationSelect,
  onClose,
  activeFilter,
  onFilterChange,
  activeTab,
  onTabChange,
  enableSharedModalDimensions = false,
}: ReactQueryModalProps) {
  const selectedQuery = useGetQueryByQueryKey(selectedQueryKey);
  const selectedMutation = useGetMutationById(selectedMutationId);

  const inDetail = !!selectedQuery || !!selectedMutation;
  const isQueryMode = activeTab === "queries";
  const isMutationMode = activeTab === "mutations";

  const commonProps = {
    onClose,
    activeFilter,
    onFilterChange,
    enableSharedModalDimensions,
  };
  const showQueryBrowserModal = visible && !inDetail && isQueryMode;
  const showMutationBrowserModal = visible && !inDetail && isMutationMode;
  const showDataEditorModal = visible && inDetail && !!selectedQuery;
  const showMutationEditorModal = visible && inDetail && !!selectedMutation;

  return (
    <>
      <QueryBrowserModal
        visible={showQueryBrowserModal}
        selectedQueryKey={selectedQueryKey}
        onQuerySelect={onQuerySelect}
        onTabChange={onTabChange}
        {...commonProps}
      />
      <MutationBrowserModal
        visible={showMutationBrowserModal}
        selectedMutationId={selectedMutationId}
        onMutationSelect={onMutationSelect}
        onTabChange={onTabChange}
        {...commonProps}
      />
      <DataEditorModal
        visible={showDataEditorModal}
        selectedQueryKey={selectedQueryKey}
        onQuerySelect={onQuerySelect}
        onTabChange={onTabChange}
        {...commonProps}
      />
      <MutationEditorModal
        visible={showMutationEditorModal}
        selectedMutationId={selectedMutationId}
        onMutationSelect={onMutationSelect}
        onTabChange={onTabChange}
        {...commonProps}
      />
    </>
  );
}
