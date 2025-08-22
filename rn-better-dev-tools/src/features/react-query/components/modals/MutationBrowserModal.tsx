import { Mutation } from "@tanstack/react-query";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useCallback, useState, useEffect } from "react";
import { useGetMutationById } from "../../hooks/useSelectedMutation";
import { MutationBrowserMode } from "../MutationBrowserMode";
import { MutationBrowserFooter } from "./MutationBrowserFooter";
import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { ReactQueryModalHeader } from "./ReactQueryModalHeader";
import { View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { SwipeIndicator } from "./SwipeIndicator";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";

interface MutationBrowserModalProps {
  visible: boolean;
  selectedMutationId?: number;
  onMutationSelect: (mutation: Mutation | undefined) => void;
  onClose: () => void;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
  onTabChange: (tab: "queries" | "mutations") => void;
  enableSharedModalDimensions?: boolean;
}

export function MutationBrowserModal({
  visible,
  selectedMutationId,
  onMutationSelect,
  onClose,
  activeFilter: externalActiveFilter,
  onFilterChange: externalOnFilterChange,
  onTabChange,
  enableSharedModalDimensions = false,
}: MutationBrowserModalProps) {
  const selectedMutation = useGetMutationById(selectedMutationId);
  const theme = useTheme();
  const [internalActiveFilter, setInternalActiveFilter] = useState<
    string | null
  >(null);
  const activeFilter = externalActiveFilter ?? internalActiveFilter;
  const setActiveFilter = externalOnFilterChange ?? setInternalActiveFilter;

  // Track modal mode for conditional styling
  // Initialize with bottomSheet but it will be updated from persisted state if available
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.reactQuery.modal()
    : devToolsStorageKeys.reactQuery.mutationModal();

  // Shared values for gesture tracking [[memory:4875251]]
  const translationX = useSharedValue(0);

  const handleSwipeNavigation = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right") {
        onTabChange("queries");
      }
    },
    [onTabChange]
  );

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Update translation for visual feedback
      translationX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX: eventTranslationX, velocityX } = event;
      const swipeThreshold = 80; // Match EDGE_THRESHOLD from SwipeIndicator
      const velocityThreshold = 500;

      // Reset visual feedback with spring animation
      translationX.value = withSpring(0);

      if (
        Math.abs(eventTranslationX) > swipeThreshold ||
        Math.abs(velocityX) > velocityThreshold
      ) {
        if (eventTranslationX > 0 || velocityX > 0) {
          handleSwipeNavigation("right");
        } else {
          handleSwipeNavigation("left");
        }
      }
    })
    .runOnJS(true);

  if (!visible) return null;

  const renderHeaderContent = () => (
    <ReactQueryModalHeader
      selectedMutation={selectedMutation}
      activeTab="mutations"
      onTabChange={onTabChange}
      onBack={() => onMutationSelect(undefined)}
    />
  );

  return (
    <ClaudeModal60FPSClean
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
      enableGlitchEffects={theme.name === "cyberpunk"}
      styles={{}}
    >
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <View style={{ flex: 1 }}>
            <SwipeIndicator
              translationX={translationX}
              canSwipeLeft={false}
              canSwipeRight={true}
            />
            <MutationBrowserMode
              selectedMutation={selectedMutation}
              onMutationSelect={onMutationSelect}
              activeFilter={activeFilter}
            />
          </View>
        </GestureDetector>
        <MutationBrowserFooter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          modalMode={modalMode}
        />
      </View>
    </ClaudeModal60FPSClean>
  );
}
