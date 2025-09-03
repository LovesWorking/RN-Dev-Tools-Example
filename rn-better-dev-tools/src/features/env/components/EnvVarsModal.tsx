import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useCallback } from "react";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { FileCode } from "rn-better-dev-tools/icons";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";

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
  const theme = useTheme();

  const handleModeChange = useCallback((_mode: ModalMode) => {
    // Mode changes handled by ClaudeModal60FPSClean
  }, []);

  if (!visible) return null;

  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.env.modal();

  return (
    <ClaudeModal60FPSClean
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
      enableGlitchEffects={theme.name === "cyberpunk"}
      styles={{}}
    >
      <EnvVarsDetailContent requiredEnvVars={requiredEnvVars} />
    </ClaudeModal60FPSClean>
  );
}
