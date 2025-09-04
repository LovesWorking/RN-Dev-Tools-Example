import {
  JsModal,
} from "@/rn-better-dev-tools/src/components/modals/jsModal/JsModal";
import { StorageBrowserMode } from "./StorageBrowserMode";
import { RequiredStorageKey } from "../types";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";

interface StorageModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  requiredStorageKeys?: RequiredStorageKey[];
}

export function StorageModal({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
  requiredStorageKeys = [],
}: StorageModalProps) {

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.storage.modal();

  return (
    <JsModal
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: (
          <ModalHeader>
            <ModalHeader.Navigation onBack={onBack} />
            <ModalHeader.Content
              title="Storage Browser"
              subtitle="AsyncStorage & MMKV"
              centered
            />
            <ModalHeader.Actions onClose={onClose} />
          </ModalHeader>
        ),
      }}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={true}
      styles={{}}
    >
      <StorageBrowserMode
        selectedQuery={undefined}
        onQuerySelect={() => {}}
        requiredStorageKeys={requiredStorageKeys}
      />
    </JsModal>
  );
}
