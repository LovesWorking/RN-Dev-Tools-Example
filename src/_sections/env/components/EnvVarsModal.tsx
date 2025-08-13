import { ClaudeModal, ModalMode } from "../../../claudeModal/ClaudeModalPure";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { View, Text } from "react-native";
import { BackButton } from "../../../_shared/ui/components/BackButton";
import { devToolsStorageKeys } from "../../../_shared/storage/devToolsStorageKeys";
import { useState, useCallback } from "react";

interface EnvVarsModalProps {
  visible: boolean;
  onClose: () => void;
  requiredEnvVars: RequiredEnvVar[];
  _envVarsSubtitle: string;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
}

/**
 * Specialized modal for environment variables following "Decompose by Responsibility"
 * Single purpose: Display environment variables in a modal context
 */
export function EnvVarsModal({
  visible,
  onClose,
  requiredEnvVars,
  _envVarsSubtitle,
  onBack,
  enableSharedModalDimensions = false,
}: EnvVarsModalProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

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
      {onBack && <BackButton onPress={onBack} color="#FFFFFF" size={16} />}
      <Text
        style={{ color: "#E5E7EB", fontSize: 14, fontWeight: "500", flex: 1 }}
        numberOfLines={1}
      >
        Environment Variables
      </Text>
    </View>
  );

  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.env.modal();

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
      <EnvVarsDetailContent requiredEnvVars={requiredEnvVars} />
    </ClaudeModal>
  );
}
