import { ThemedClaudeModal60FPS } from "../../../claudeModal/ThemedClaudeModal60FPS";
import { RequiredEnvVar } from "../../../_sections/env/types";
import { ConsoleSectionList } from "./ConsoleSectionList";
import { ReactQuerySection } from "./sections";
import { EnvVarsSection } from "../../../_sections/env";
import { StorageSection } from "../../../_sections/storage/components/StorageSection";
import { StorageEventsSection } from "../../../_sections/storage";
import { NetworkSection } from "../../../_sections/network";
import { BubbleSettingsSection } from "../../../_sections/settings";
import { SectionType } from "./DevToolsModalRouter";
import { Text, View } from "react-native";
import { useState, useCallback } from "react";
import { useTheme } from "../../../_themes/DevToolsThemeContext";
import { CyberpunkConsoleTitle } from "./CyberpunkConsoleTitle";
import { CyberpunkModalHeader } from "../../../claudeModal/CyberpunkModalHeader";

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

  const renderHeaderContent = () => {
    if (theme.name === "cyberpunk") {
      // Return the full CyberpunkModalHeader for complete header replacement
      return (
        <CyberpunkModalHeader
          customContent={<CyberpunkConsoleTitle />}
          showToggleButton={true}
        />
      );
    }

    return (
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
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 14,
            fontWeight: "500",
            flex: 1,
          }}
          numberOfLines={1}
        >
          Developer Tools Console
        </Text>
      </View>
    );
  };

  return (
    <ThemedClaudeModal60FPS
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
        <StorageEventsSection
          onPress={() => onSectionSelect("storage-events")}
        />
        <NetworkSection onPress={() => onSectionSelect("network")} />
        <BubbleSettingsSection
          onPress={() => onSectionSelect("bubble-settings")}
        />
      </ConsoleSectionList>
    </ThemedClaudeModal60FPS>
  );
}