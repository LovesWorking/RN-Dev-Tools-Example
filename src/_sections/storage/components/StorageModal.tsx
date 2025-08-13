import { useState, useCallback } from "react";
import { ClaudeModal, ModalMode } from "../../../claudeModal/ClaudeModalPure";
import { BackButton } from "../../../_shared/ui/components/BackButton";
import { StorageBrowserMode } from "./StorageBrowserMode";
import { RequiredStorageKey } from "../types";
import { Text, View } from "react-native";
import { HardDrive } from "lucide-react-native";
import { devToolsStorageKeys } from "../../../_shared/storage/devToolsStorageKeys";

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
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.storage.modal();

  const renderHeaderContent = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
        minHeight: 32,
        paddingLeft: 4,
      }}
    >
      {onBack && <BackButton onPress={onBack} />}
      <View
        style={{
          width: 32,
          height: 32,
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HardDrive size={18} color="#10B981" />
      </View>
      <Text
        style={{ color: "#E5E7EB", fontSize: 14, fontWeight: "500", flex: 1 }}
        numberOfLines={1}
      >
        Storage Browser
      </Text>
    </View>
  );

  return (
    <ClaudeModal
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: renderHeaderContent()
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
    >
      <StorageBrowserMode 
        selectedQuery={undefined}
        onQuerySelect={() => {}}
        requiredStorageKeys={requiredStorageKeys} 
      />
    </ClaudeModal>
  );
}