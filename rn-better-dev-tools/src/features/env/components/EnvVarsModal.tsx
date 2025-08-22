import ClaudeModal60FPSClean, {
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { View, Text } from "react-native";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useState, useCallback } from "react";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";
import { FileCode } from "lucide-react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

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
        paddingLeft: 12,
      }}
    >
      {onBack && <BackButton onPress={onBack} color={theme.colors.text} />}
      <View
        style={{
          width: 32,
          height: 32,
          backgroundColor:
            theme.name === "cyberpunk"
              ? `${theme.colors.envColor}15`
              : gameUIColors.success + "1A",
          borderRadius: theme.name === "cyberpunk" ? 8 : 16,
          borderWidth: theme.name === "cyberpunk" ? 1 : 0,
          borderColor:
            theme.name === "cyberpunk"
              ? `${theme.colors.envColor}40`
              : undefined,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FileCode size={18} color={theme.colors.envColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: theme.name === "cyberpunk" ? 14 : 14,
            fontWeight: theme.name === "cyberpunk" ? "700" : "500",
            fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
            letterSpacing: theme.name === "cyberpunk" ? 1 : undefined,
            textTransform: theme.name === "cyberpunk" ? "uppercase" : undefined,
          }}
          numberOfLines={1}
        >
          {theme.name === "cyberpunk"
            ? "ENV CONFIG INSPECTOR"
            : "Environment Variables"}
        </Text>
        <Text
          style={{
            color:
              theme.name === "cyberpunk"
                ? theme.colors.textSecondary
                : gameUIColors.secondary,
            fontSize: 10,
            fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
            marginTop: 2,
            opacity: 0.8,
          }}
          numberOfLines={1}
        >
          {theme.name === "cyberpunk"
            ? "VALIDATE & DEBUG ENV VARS"
            : "View and validate env configuration"}
        </Text>
      </View>
      {theme.name === "cyberpunk" && (
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginRight: 8,
          }}
        >
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: theme.colors.envColor,
              opacity: 0.8,
            }}
          />
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: theme.colors.envColor,
              opacity: 0.5,
            }}
          />
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: theme.colors.envColor,
              opacity: 0.3,
            }}
          />
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
      styles={{}}
    >
      <EnvVarsDetailContent requiredEnvVars={requiredEnvVars} />
    </ClaudeModal60FPSClean>
  );
}
