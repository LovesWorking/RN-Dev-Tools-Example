import { ModalMode } from "../../../claudeModal/ClaudeModalPure";
import { ThemedClaudeModal } from "../../../claudeModal/ThemedClaudeModal";
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
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const theme = useTheme();

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const storagePrefix = enableSharedModalDimensions
    ? "@dev_tools_console_modal"
    : "@devtools_section_list";

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
      <Text
        style={{ 
          color: theme.colors.text, 
          fontSize: theme.name === "cyberpunk" ? 14 : 14, 
          fontWeight: theme.name === "cyberpunk" ? "700" : "500",
          fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
          letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
          textTransform: theme.name === "cyberpunk" ? "uppercase" : undefined,
          flex: 1 
        }}
        numberOfLines={1}
      >
        {theme.name === "cyberpunk" ? "// DEV_TOOLS_CONSOLE" : "Developer Tools Console"}
      </Text>
      {theme.name === "cyberpunk" && (
        <View style={{
          flexDirection: "row",
          gap: 3,
          marginRight: 8,
        }}>
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.primary,
            opacity: 0.8,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.primary,
            opacity: 0.5,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.primary,
            opacity: 0.3,
          }} />
        </View>
      )}
    </View>
  );

  return (
    <ThemedClaudeModal
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
    </ThemedClaudeModal>
  );
}
