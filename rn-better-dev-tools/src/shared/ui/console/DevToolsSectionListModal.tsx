import ClaudeModal60FPSClean from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { RequiredEnvVar } from "@/rn-better-dev-tools/src/features/env/types";
import { ConsoleSectionList } from "./ConsoleSectionList";
import { ReactQuerySection } from "./sections";
import { EnvVarsSection } from "@/rn-better-dev-tools/src/features/env";
import { StorageSection } from "@/rn-better-dev-tools/src/features/storage/components/StorageSection";
import { NetworkSection } from "@/rn-better-dev-tools/src/features/network";
import { BubbleSettingsSection } from "@/rn-better-dev-tools/src/features/settings";
import { SectionType } from "./DevToolsModalRouter";
import { Text, View } from "react-native";
import { useState, useCallback } from "react";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";

interface DevToolsSectionListModalProps {
  visible: boolean;
  onClose: () => void;
  onSectionSelect: (sectionType: SectionType) => void;
  requiredEnvVars: RequiredEnvVar[];
  _getSentrySubtitle: () => string;
  getRnBetterDevToolsSubtitle: () => string;
  envVarsSubtitle: string;
  enableSharedModalDimensions?: boolean;
}

/**
 * Specialized modal for section list following "Decompose by Responsibility"
 * Single purpose: Display and handle section selection
 */
export function DevToolsSectionListModal({
  visible,
  onClose,
  onSectionSelect,
  requiredEnvVars,
  _getSentrySubtitle,
  getRnBetterDevToolsSubtitle,
  envVarsSubtitle,
  enableSharedModalDimensions = false,
}: DevToolsSectionListModalProps) {
  const [modalMode, setModalMode] = useState<"bottomSheet" | "floating">("bottomSheet");
  const theme = useTheme();

  const handleModeChange = useCallback((mode: "bottomSheet" | "floating") => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const storagePrefix = enableSharedModalDimensions
    ? "@dev_tools_console_modal"
    : "@devtools_section_list";


  return (
    <ClaudeModal60FPSClean
      visible={visible}
      onClose={onClose}
      header={{
        title: "Developer Tools Console",
        subtitle: "Select a tool",
        showToggleButton: true,
      }}
      styles={{}}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
    >
      <ConsoleSectionList>
        {/* <SentryLogsSection
          onPress={() => onSectionSelect("sentry-logs")}
          getSentrySubtitle={_getSentrySubtitle}
        /> */}
        <EnvVarsSection
          onPress={() => onSectionSelect("env-vars")}
          envVarsSubtitle={envVarsSubtitle}
          requiredEnvVars={requiredEnvVars}
        />
        <ReactQuerySection
          onPress={() => onSectionSelect("rn-better-dev-tools")}
          getRnBetterDevToolsSubtitle={getRnBetterDevToolsSubtitle}
        />
        <StorageSection onPress={() => onSectionSelect("storage")} />
        {/* Storage Events is now integrated as a tab in StorageModalWithTabs */}
        <NetworkSection onPress={() => onSectionSelect("network")} />
        <BubbleSettingsSection
          onPress={() => onSectionSelect("bubble-settings")}
        />
      </ConsoleSectionList>
    </ClaudeModal60FPSClean>
  );
}