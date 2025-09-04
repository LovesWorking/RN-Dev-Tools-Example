import {
  JsModal,
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/jsModal/JsModal";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useCallback } from "react";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";

interface EnvVarsModalProps {
  visible: boolean;
  onClose: () => void;
  requiredEnvVars: RequiredEnvVar[];
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
  onBack,
  enableSharedModalDimensions = false,
}: EnvVarsModalProps) {
  const handleModeChange = useCallback((_mode: ModalMode) => {
    // Mode changes handled by JsModal
  }, []);

  if (!visible) return null;

  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.env.modal();

  return (
    <JsModal
      visible={visible}
      onClose={onClose}
      persistenceKey={storagePrefix}
      header={{
        customContent: (
          <ModalHeader>
            <ModalHeader.Navigation onBack={onBack} />
            <ModalHeader.Content
              title="Environment"
              subtitle={`${requiredEnvVars.length} variables`}
              centered
            />
            <ModalHeader.Actions onClose={onClose} />
          </ModalHeader>
        ),
        showToggleButton: true,
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={true}
      styles={{}}
    >
      <EnvVarsDetailContent requiredEnvVars={requiredEnvVars} />
    </JsModal>
  );
}
