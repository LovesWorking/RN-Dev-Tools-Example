import { useCallback } from "react";
import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import {
  BubbleSettingsDetail,
  type BubbleVisibilitySettings,
} from "@/rn-better-dev-tools/src/features/settings";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";

interface BubbleSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  onSettingsChange?: (
    settings: BubbleVisibilitySettings,
  ) => void | Promise<void>;
}

export function BubbleSettingsModal({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
  onSettingsChange,
}: BubbleSettingsModalProps) {
  const theme = useTheme();

  const handleModeChange = useCallback((_mode: ModalMode) => {
    // Mode changes handled by ClaudeModal60FPSClean
  }, []);

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? "@dev_tools_console_modal"
    : "@bubble_settings_modal";


  return (
    <ClaudeModal60FPSClean
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: (
          <ModalHeader>
            <ModalHeader.Navigation onBack={onBack} />
            <ModalHeader.Content
              title="Bubble Settings"
              subtitle="Configure visibility"
              centered
            />
            <ModalHeader.Actions onClose={onClose} />
          </ModalHeader>
        ),
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
      styles={{}}
    >
      <BubbleSettingsDetail onSettingsChange={onSettingsChange} />
    </ClaudeModal60FPSClean>
  );
}
