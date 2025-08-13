import { useState, useCallback } from "react";
import { Text, View } from "react-native";
import { ClaudeModal, ModalMode } from "../../../claudeModal/ClaudeModalPure";
import { BubbleSettingsDetail, type BubbleVisibilitySettings } from "../../../_sections/settings";
import { ChevronLeft, Settings } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

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
          <ChevronLeft size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Settings size={18} color="#10B981" />
      </View>
      <Text
        style={{ color: "#E5E7EB", fontSize: 14, fontWeight: "500", flex: 1 }}
        numberOfLines={1}
      >
        Bubble Visibility Settings
      </Text>
    </View>
  );

  return (
    <ClaudeModal
      visible={visible}
      onClose={onClose}
      persistenceKey={persistenceKey}
      header={{
        showToggleButton: true,
        customContent: renderHeaderContent(),
        subtitle: "Configure bubble buttons"
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
    >
      <BubbleSettingsDetail onSettingsChange={onSettingsChange} />
    </ClaudeModal>
  );
}