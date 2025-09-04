import {
  JsModal,
  type ModalMode,
} from "@/rn-better-dev-tools/src/components/modals/jsModal/JsModal";
import { EnvVarsDetailContent } from "./EnvVarsSection";
import { RequiredEnvVar } from "../types";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { ModalHeader } from "@/rn-better-dev-tools/src/shared/ui/components/ModalHeader";
import { TabSelector, type Tab } from "@/rn-better-dev-tools/src/shared/ui/components/TabSelector";
import { HeaderSearchButton } from "@/rn-better-dev-tools/src/shared/ui/components/HeaderSearchButton";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X } from "rn-better-dev-tools/icons";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface EnvVarsModalProps {
  visible: boolean;
  onClose: () => void;
  requiredEnvVars: RequiredEnvVar[];
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
}

type TabType = "overview" | "required" | "optional";

/**
 * Specialized modal for environment variables following "Decompose by Responsibility"
 * Single purpose: Display environment variables in a modal context
 */
export function EnvVarsModal({
  visible,
  onClose,
  requiredEnvVars,
  onBack,
  enableSharedModalDimensions = false,
}: EnvVarsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  
  const handleModeChange = useCallback((_mode: ModalMode) => {
    // Mode changes handled by JsModal
  }, []);
  
  // Focus search input when search becomes active
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);
  
  // Clear search when changing tabs
  useEffect(() => {
    setSearchQuery("");
    setIsSearchActive(false);
  }, [activeTab]);
  
  // Configure tabs
  const tabs = useMemo<Tab[]>(() => {
    const tabList: Tab[] = [
      {
        key: "overview",
        label: "Overview",
      },
      {
        key: "required",
        label: "Required",
      },
      {
        key: "optional",
        label: "Optional",
      },
    ];
    return tabList;
  }, []);

  if (!visible) return null;

  const storagePrefix = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.env.modal();

  return (
    <JsModal
      visible={visible}
      onClose={onClose}
      persistenceKey={storagePrefix}
      header={{
        customContent: (
          <ModalHeader>
            {onBack && <ModalHeader.Navigation onBack={onBack} />}
            <ModalHeader.Content title="" noMargin>
              {isSearchActive ? (
                <View style={styles.headerSearchContainer}>
                  <Search size={14} color={gameUIColors.secondary} />
                  <TextInput
                    ref={searchInputRef}
                    style={styles.headerSearchInput}
                    placeholder="Search env keys..."
                    placeholderTextColor={gameUIColors.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsSearchActive(false);
                      setSearchQuery("");
                    }}
                    style={styles.clearButton}
                  >
                    <X size={14} color={gameUIColors.secondary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TabSelector
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab as TabType)}
                />
              )}
            </ModalHeader.Content>
            <ModalHeader.Actions onClose={onClose}>
              {!isSearchActive && (
                <HeaderSearchButton
                  onPress={() => setIsSearchActive(true)}
                />
              )}
            </ModalHeader.Actions>
          </ModalHeader>
        ),
        showToggleButton: true,
      }}
      onModeChange={handleModeChange}
      enablePersistence={true}
      initialMode="bottomSheet"
      enableGlitchEffects={true}
      styles={{}}
    >
      <EnvVarsDetailContent 
        requiredEnvVars={requiredEnvVars} 
        activeTab={activeTab}
        searchQuery={searchQuery}
      />
    </JsModal>
  );
}

const styles = StyleSheet.create({
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: gameUIColors.background + "80",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  headerSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: gameUIColors.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});
