import { ClaudeModal, ModalMode } from "../../../claudeModal/ClaudeModalPure";
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
        style={{ color: "#E5E7EB", fontSize: 14, fontWeight: "500", flex: 1 }}
        numberOfLines={1}
      >
        Developer Tools Console
      </Text>
    </View>
  );

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
    </ClaudeModal>
  );
}
