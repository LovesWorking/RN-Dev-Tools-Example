/**
 * React Query DevTools wrapper component (easy mode)
 *
 * Purpose:
 * - Provide a simple, self-contained entry point that manages selection and routing internally
 * - Hide internal modal manager details from consumers
 * - Support both controlled (visible/onClose) and uncontrolled (floating button) usage
 */
import { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ReactQueryModal } from './components/modals/ReactQueryModal';
import { useModalManager } from './hooks/useModalManager';
import { ReactQueryIcon } from '../icons/ReactQueryIcon';

export type ReactQueryDevToolsProps = {
  // Controlled usage: pass visible to open/close externally
  visible?: boolean;
  onClose?: () => void;

  // Initial UI settings
  defaultFilter?: string | null;
  enableSharedModalDimensions?: boolean;

  // Uncontrolled usage: show a floating trigger button
  showFloatingButton?: boolean;
  floatingButtonPosition?: { bottom?: number; right?: number };
};

export function ReactQueryDevTools({
  visible,
  onClose,
  defaultFilter,
  enableSharedModalDimensions = false,
  showFloatingButton = true,
  floatingButtonPosition,
}: ReactQueryDevToolsProps) {
  const {
    isModalOpen,
    selectedQueryKey,
    activeFilter,
    activeTab,
    selectedMutationId,
    setActiveFilter,
    handleModalDismiss,
    handleQueryPress,
    handleQuerySelect,
    handleMutationSelect,
    handleTabChange,
  } = useModalManager();

  // Apply initial settings once
  useEffect(() => {
    if (typeof defaultFilter !== 'undefined') setActiveFilter(defaultFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep internal open state in sync for persistence when using controlled mode
  useEffect(() => {
    if (typeof visible === 'boolean') {
      if (visible) {
        handleQueryPress();
      } else {
        handleModalDismiss();
      }
    }
  }, [visible, handleModalDismiss, handleQueryPress]);

  const isControlled = typeof visible === 'boolean';
  const isOpen = isControlled ? Boolean(visible) : isModalOpen;

  const buttonStyle = useMemo(() => {
    const bottom = floatingButtonPosition?.bottom ?? 50;
    const right = floatingButtonPosition?.right ?? 20;
    return [styles.fab, { bottom, right }];
  }, [floatingButtonPosition]);

  const handleClose = () => {
    handleModalDismiss();
    onClose?.();
  };

  const handleTabChangeWrapped = (tab: 'queries' | 'mutations') => {
    handleTabChange(tab);
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* Optional floating trigger for uncontrolled usage */}
      {!isControlled && showFloatingButton && !isOpen && (
        <TouchableOpacity
          onPress={handleQueryPress}
          activeOpacity={0.85}
          style={buttonStyle}
          accessibilityLabel="Open React Query DevTools"
        >
          <ReactQueryIcon size={32} noBackground={false} />
        </TouchableOpacity>
      )}

      {/* Modal rendered when open */}
      <ReactQueryModal
        visible={isOpen}
        onClose={handleClose}
        selectedQueryKey={selectedQueryKey}
        selectedMutationId={selectedMutationId}
        onQuerySelect={handleQuerySelect}
        onMutationSelect={handleMutationSelect}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeTab={activeTab}
        onTabChange={handleTabChangeWrapped}
        enableSharedModalDimensions={enableSharedModalDimensions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(10, 14, 39, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});
