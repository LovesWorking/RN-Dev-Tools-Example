import { useState, useCallback } from "react";
import ClaudeModal60FPSClean, { type ModalMode } from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import { StorageBrowserMode } from "./StorageBrowserMode";
import { RequiredStorageKey } from "../types";
import { Text, View } from "react-native";
import { HardDrive } from "lucide-react-native";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";

interface StorageModalProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  requiredStorageKeys?: RequiredStorageKey[];
}

export function StorageModal({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
  requiredStorageKeys = [],
}: StorageModalProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const theme = useTheme();

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  if (!visible) return null;

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.storage.modal();

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
          backgroundColor: theme.name === "cyberpunk" 
            ? `${theme.colors.storageColor}15`
            : "rgba(16, 185, 129, 0.1)",
          borderRadius: theme.name === "cyberpunk" ? 8 : 16,
          borderWidth: theme.name === "cyberpunk" ? 1 : 0,
          borderColor: theme.name === "cyberpunk" ? `${theme.colors.storageColor}40` : undefined,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HardDrive size={18} color={theme.colors.storageColor} />
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
          {theme.name === "cyberpunk" ? "PERSISTENT STORAGE" : "Storage Browser"}
        </Text>
        <Text
          style={{
            color: theme.name === "cyberpunk" ? theme.colors.textSecondary : "#9CA3AF",
            fontSize: 10,
            fontFamily: theme.name === "cyberpunk" ? "monospace" : undefined,
            marginTop: 2,
            opacity: 0.8,
          }}
          numberOfLines={1}
        >
          {theme.name === "cyberpunk" ? "APP DATA • ASYNCSTORAGE • MMKV" : "View and manage stored data"}
        </Text>
      </View>
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
            backgroundColor: theme.colors.storageColor,
            opacity: 0.8,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.storageColor,
            opacity: 0.5,
          }} />
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: theme.colors.storageColor,
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
        customContent: renderHeaderContent()
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={theme.name === "cyberpunk"}
     styles={{}}>
      <StorageBrowserMode 
        selectedQuery={undefined}
        onQuerySelect={() => {}}
        requiredStorageKeys={requiredStorageKeys} 
      />
    </ClaudeModal60FPSClean>
  );
}