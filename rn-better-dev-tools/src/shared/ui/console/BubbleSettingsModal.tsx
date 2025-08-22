import { useState, useCallback } from "react";
import { Text, View } from "react-native";
import ClaudeModal60FPSClean, { type ModalMode } from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { BubbleSettingsDetail, type BubbleVisibilitySettings } from "@/rn-better-dev-tools/src/features/settings";
import { ChevronLeft, Settings } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";

interface BubbleSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  onSettingsChange?: (settings: BubbleVisibilitySettings) => void | Promise<void>;
}

export function BubbleSettingsModal({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
  onSettingsChange,
}: BubbleSettingsModalProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const theme = useTheme();

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? "@dev_tools_console_modal"
    : "@bubble_settings_modal";

  const renderHeaderContent = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
        minHeight: 32,
      }}
    >
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          sentry-label="ignore back button"
        >
          <ChevronLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: theme.name === "cyberpunk" ? 8 : 8,
          backgroundColor: theme.name === "cyberpunk" 
            ? `${theme.colors.settingsColor}15`
            : "rgba(16, 185, 129, 0.1)",
          borderWidth: theme.name === "cyberpunk" ? 1 : 0,
          borderColor: theme.name === "cyberpunk" ? `${theme.colors.settingsColor}40` : undefined,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Settings size={18} color={theme.colors.settingsColor} />
      </View>
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
        {theme.name === "cyberpunk" ? "// BUBBLE_SETTINGS" : "Bubble Visibility Settings"}
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
            backgroundColor: theme.colors.settingsColor,
            opacity: 0.8,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.settingsColor,
            opacity: 0.5,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.settingsColor,
            opacity: 0.3,
          }} />
        </View>
      )}
    </View>
  );

  return (
    <ClaudeModal60FPSClean
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: renderHeaderContent(),
        subtitle: theme.name === "cyberpunk" ? "[CONFIG::BUBBLE_BUTTONS]" : "Configure bubble buttons"
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
     styles={{}}>
      <BubbleSettingsDetail onSettingsChange={onSettingsChange} />
    </ClaudeModal60FPSClean>
  );
}