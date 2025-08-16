import ClaudeModal60FPSClean, { type ModalMode } from "../../../claudeModal/ClaudeModal60FPSClean";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { View, Text } from "react-native";
import { BackButton } from "../../../_shared/ui/components/BackButton";
import { devToolsStorageKeys } from "../../../_shared/storage/devToolsStorageKeys";
import { useState, useCallback } from "react";
import { useTheme } from "../../../_themes/DevToolsThemeContext";

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
  const theme = useTheme();

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
      {onBack && <BackButton onPress={onBack} color={theme.colors.text} size={16} />}
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.name === "cyberpunk" ? 14 : 14,
          fontWeight: theme.name === "cyberpunk" ? "700" : "500",
          fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
          letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
          flex: 1,
          textTransform: theme.name === "cyberpunk" ? "uppercase" : undefined,
        }}
        numberOfLines={1}
      >
        {theme.name === "cyberpunk" ? "// ENV_VARIABLES" : "Environment Variables"}
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
            backgroundColor: theme.colors.envColor,
            opacity: 0.8,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.envColor,
            opacity: 0.5,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.envColor,
            opacity: 0.3,
          }} />
        </View>
      )}
    </View>
  );

  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.env.modal();

  return (
    <ClaudeModal60FPSClean
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
     styles={{}}>
      <EnvVarsDetailContent requiredEnvVars={requiredEnvVars} />
    </ClaudeModal60FPSClean>
  );
}
