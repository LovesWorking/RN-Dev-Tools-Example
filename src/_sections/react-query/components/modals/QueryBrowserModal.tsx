import { Query, QueryKey } from "@tanstack/react-query";
import {
  ClaudeModal,
  ModalMode,
} from "../../../../claudeModal/ClaudeModalPure";
import { useGetQueryByQueryKey } from "../../hooks/useSelectedQuery";
import { ReactQueryModalHeader } from "./ReactQueryModalHeader";
import { QueryBrowserMode } from "../QueryBrowserMode";
import { QueryBrowserFooter } from "./QueryBrowserFooter";
import { useState, useCallback } from "react";
import { View } from "react-native";
import { devToolsStorageKeys } from "../../../../_shared/storage/devToolsStorageKeys";

interface QueryBrowserModalProps {
  visible: boolean;
  selectedQueryKey?: QueryKey;
  onQuerySelect: (query: Query | undefined) => void;
  onClose: () => void;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
  enableSharedModalDimensions?: boolean;
  onTabChange: (tab: "queries" | "mutations") => void;
}

/**
 * Specialized modal for query browsing following "Decompose by Responsibility"
 * Single purpose: Display query browser when no query is selected
 */
export function QueryBrowserModal({
  visible,
  selectedQueryKey,
  onQuerySelect,
  onClose,
  activeFilter: externalActiveFilter,
  onFilterChange: externalOnFilterChange,
  enableSharedModalDimensions = false,
  onTabChange,
}: QueryBrowserModalProps) {
  const selectedQuery = useGetQueryByQueryKey(selectedQueryKey);
  // Use external filter state if provided (for persistence), otherwise use internal state
  const [internalActiveFilter, setInternalActiveFilter] = useState<
    string | null
  >(null);
  const activeFilter = externalActiveFilter ?? internalActiveFilter;
  const setActiveFilter = externalOnFilterChange ?? setInternalActiveFilter;

  // Track modal mode for conditional styling
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.reactQuery.modal()
    : devToolsStorageKeys.reactQuery.browserModal();

  const handleModeChange = useCallback((mode: ModalMode) => {
    console.log("mode", mode === "floating");
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const renderHeaderContent = () => (
    <ReactQueryModalHeader
      selectedQuery={selectedQuery}
      activeTab="queries"
      onTabChange={onTabChange}
      onBack={() => onQuerySelect(undefined)}
    />
  );

  return (
    <ClaudeModal
      visible={visible}
      onClose={onClose}
      persistenceKey={storagePrefix}
      header={{
        customContent: renderHeaderContent(),
        showToggleButton: true,
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
    >
      <View style={{ flex: 1 }}>
        <QueryBrowserMode
          selectedQuery={selectedQuery}
          onQuerySelect={onQuerySelect}
          activeFilter={activeFilter}
        />
        <QueryBrowserFooter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          isFloatingMode={modalMode === "floating"}
        />
      </View>
    </ClaudeModal>
  );
}
