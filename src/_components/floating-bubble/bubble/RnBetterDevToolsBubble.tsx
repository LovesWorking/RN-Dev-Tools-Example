import { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, View, Dimensions } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RequiredEnvVar,
  useEnvVarsSubtitle,
  EnvVarsModal,
} from "../../../_sections/env";
import { StorageModal, RequiredStorageKey } from "../../../_sections/storage";

import {
  FloatingTools,
  type UserRole,
  EnvironmentIndicator,
  UserStatus,
} from "../../../newDevTools/floatingTools";
import type { Environment } from "../../../_sections/env";
import { ErrorBoundary } from "../../../_shared/ui/components/ErrorBoundary";
import {
  ReactQueryModal,
  useReactQueryState,
  useModalManager,
  WifiToggle,
} from "../../../_sections/react-query";
import { DevToolsConsole } from "../console/DevToolsConsole";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  LayersIcon,
} from "@/src/_shared/icons/lucide-icons";
import { GridMenu } from "./GridMenu";
import { CompactDropdownMenu } from "./CompactDropdownMenu";
import { MagneticGridMenu } from "./MagneticGridMenu";
import { CascadingDropdown } from "./CascadingDropdown";
import { CyberpunkGridMenu } from "./CyberpunkGridMenu";

// Re-export types that developers will need
export type { UserRole } from "../../../newDevTools/floatingTools";
export type { Environment, RequiredEnvVar } from "../../../_sections/env";
export type { RequiredStorageKey } from "../../../_sections/storage";
interface RnBetterDevToolsBubbleProps {
  queryClient: QueryClient;
  userRole?: UserRole;
  environment: Environment;
  requiredEnvVars?: RequiredEnvVar[];
  enableSharedModalDimensions?: boolean;
  hideEnvironment?: boolean;
  hideQueryButton?: boolean;
  hideWifiToggle?: boolean;
  hideEnvButton?: boolean;
  hideSentryButton?: boolean;
  hideStorageButton?: boolean;
  requiredStorageKeys?: RequiredStorageKey[];
  hideUserStatus?: boolean;
}

export function RnBetterDevToolsBubble({
  queryClient,
  userRole = "user",
  environment,
  requiredEnvVars = [],
  requiredStorageKeys = [],
  enableSharedModalDimensions = false,
  hideEnvironment,
  hideUserStatus,
  hideQueryButton,
  hideWifiToggle,
  hideEnvButton,
  hideSentryButton,
  hideStorageButton,
}: RnBetterDevToolsBubbleProps) {
  const [showFloatingMenu, setShowFloatingMenu] = useState(false); // Menu closed by default
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  
  // Menu type selection
  type MenuType = 'grid' | 'dropdown' | 'magnetic' | 'cascading' | 'cyberpunk';
  const [menuType, setMenuType] = useState<MenuType>('cyberpunk'); // Default to cyberpunk
  
  // Get screen dimensions
  const { height: screenHeight } = Dimensions.get('window');
  
  // Store the button position (approximate position of floating tools)
  const [buttonPosition] = useState({ 
    x: 44, // Distance from right edge
    y: screenHeight - 708 // Distance from bottom
  });
  // Info: Show how props and user settings interact
  useEffect(() => {
    const propsProvided = [
      hideQueryButton !== undefined && `hideQueryButton=${hideQueryButton}`,
      hideEnvironment !== undefined && `hideEnvironment=${hideEnvironment}`,
      hideWifiToggle !== undefined && `hideWifiToggle=${hideWifiToggle}`,
      hideEnvButton !== undefined && `hideEnvButton=${hideEnvButton}`,
      hideSentryButton !== undefined && `hideSentryButton=${hideSentryButton}`,
      hideStorageButton !== undefined &&
        `hideStorageButton=${hideStorageButton}`,
    ].filter(Boolean);

    if (propsProvided.length > 0) {
      console.info(
        "[RnBetterDevToolsBubble] Default visibility props: " +
          propsProvided.join(", ") +
          ". " +
          "Users can override these in settings."
      );
    }
  }, [
    hideQueryButton,
    hideEnvironment,
    hideWifiToggle,
    hideEnvButton,
    hideSentryButton,
    hideStorageButton,
  ]);

  // const { getSentrySubtitle } = useSentrySubtitle();
  const { getRnBetterDevToolsSubtitle } = useReactQueryState(queryClient);
  const envVarsSubtitle = useEnvVarsSubtitle(requiredEnvVars);

  // Modal management hook with persistence - extracted from main component logic
  const {
    isModalOpen,
    isDebugModalOpen,
    isEnvModalOpen,
    isSentryModalOpen,
    isStorageModalOpen,
    selectedQueryKey,
    selectedSection,
    activeFilter,
    activeTab,
    selectedMutationId,
    setSelectedSection,
    setActiveFilter,
    handleModalDismiss,
    handleDebugModalDismiss,
    handleEnvModalDismiss,
    handleStorageModalDismiss,
    handleQuerySelect,
    handleQueryPress,
    handleStatusPress,
    handleEnvPress,
    handleSentryPress,
    handleStoragePress,
    handleTabChange,
    handleMutationSelect,
  } = useModalManager();

  // Hide bubble when any modal is open to prevent visual overlap
  const isAnyModalOpen =
    isModalOpen ||
    isDebugModalOpen ||
    isEnvModalOpen ||
    isSentryModalOpen ||
    isStorageModalOpen;

  // Note: We no longer wait for state restoration to show the bubble
  // The bubble should be visible immediately on app launch

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Floating Tools - Always mounted for stable tree; hidden via opacity/pointerEvents when modals open */}
        <View
          pointerEvents={isAnyModalOpen ? "none" : "auto"}
          style={{ opacity: isAnyModalOpen ? 0 : 1 }}
        >
          <FloatingTools enablePositionPersistence>
            <EnvironmentIndicator environment={environment!} />
            <UserStatus userRole={userRole} onPress={handleStatusPress} />

            {/* Test buttons for different menu types */}
            <View style={{ flexDirection: 'column', gap: 4 }}>
              {/* Row 1: Original favorites + Grid variations */}
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {/* Original Grid Menu (User favorite) */}
                <Pressable
                  onPress={() => {
                    setMenuType('grid');
                    setShowFloatingMenu(true);
                  }}
                  style={[styles.menuButton, { backgroundColor: '#3B82F6' }]}
                  hitSlop={8}
                >
                  <LayersIcon size={14} color="white" />
                </Pressable>
                
                {/* Original Dropdown Menu (User favorite) */}
                <Pressable
                  onPress={() => {
                    setMenuType('dropdown');
                    setShowFloatingMenu(true);
                  }}
                  style={[styles.menuButton, { backgroundColor: '#EF4444' }]}
                  hitSlop={8}
                >
                  <LayersIcon size={14} color="white" />
                </Pressable>
                
                {/* Magnetic Grid */}
                <Pressable
                  onPress={() => {
                    setMenuType('magnetic');
                    setShowFloatingMenu(true);
                  }}
                  style={[styles.menuButton, { backgroundColor: '#FF6B6B' }]}
                  hitSlop={8}
                >
                  <LayersIcon size={14} color="white" />
                </Pressable>
              </View>
              
              {/* Row 2: Remaining variations */}
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {/* Cascading Dropdown */}
                <Pressable
                  onPress={() => {
                    setMenuType('cascading');
                    setShowFloatingMenu(true);
                  }}
                  style={[styles.menuButton, { backgroundColor: '#F59E0B' }]}
                  hitSlop={8}
                >
                  <LayersIcon size={14} color="white" />
                </Pressable>
                
                {/* Cyberpunk Grid */}
                <Pressable
                  onPress={() => {
                    setMenuType('cyberpunk');
                    setShowFloatingMenu(true);
                  }}
                  style={[styles.menuButton, { backgroundColor: '#00FFFF' }]}
                  hitSlop={8}
                >
                  <LayersIcon size={14} color="white" />
                </Pressable>
              </View>
            </View>
          </FloatingTools>
        </View>

        {/* Floating Dev Tools Menu - Multiple menu types */}
        {showFloatingMenu && (() => {
          const menuProps = {
            buttonPosition,
            onQueryPress: () => {
              setShowFloatingMenu(false);
              handleQueryPress();
            },
            onEnvPress: () => {
              setShowFloatingMenu(false);
              handleEnvPress();
            },
            onSentryPress: () => {
              setShowFloatingMenu(false);
              handleSentryPress();
            },
            onStoragePress: () => {
              setShowFloatingMenu(false);
              handleStoragePress();
            },
            onWifiToggle: () => {
              setIsWifiEnabled(!isWifiEnabled);
            },
            onClose: () => {
              setShowFloatingMenu(false);
            },
            isWifiEnabled,
          };

          switch (menuType) {
            case 'grid':
              return <GridMenu {...menuProps} />;
            case 'dropdown':
              return <CompactDropdownMenu {...menuProps} />;
            case 'magnetic':
              return <MagneticGridMenu {...menuProps} />;
            case 'cascading':
              return <CascadingDropdown {...menuProps} />;
            case 'cyberpunk':
              return <CyberpunkGridMenu {...menuProps} />;
            default:
              return <CyberpunkGridMenu {...menuProps} />;
          }
        })()}

        {/* Floating Data Editor Modal - Auto-opens if restored state indicates it was open */}
        <ReactQueryModal
          key="react-query-modal"
          visible={isModalOpen}
          selectedQueryKey={selectedQueryKey}
          onQuerySelect={handleQuerySelect}
          onClose={handleModalDismiss}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          enableSharedModalDimensions={enableSharedModalDimensions}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedMutationId={selectedMutationId}
          onMutationSelect={handleMutationSelect}
        />

        {/* DevTools Console - Auto-opens if restored state indicates it was open */}
        <DevToolsConsole
          key="devtools-console-modal"
          visible={isDebugModalOpen}
          onClose={handleDebugModalDismiss}
          requiredEnvVars={requiredEnvVars}
          requiredStorageKeys={requiredStorageKeys}
          getSentrySubtitle={() => "Sentry subtitle disabled for now"}
          getRnBetterDevToolsSubtitle={getRnBetterDevToolsSubtitle}
          envVarsSubtitle={envVarsSubtitle}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          enableSharedModalDimensions={enableSharedModalDimensions}
          onReactQueryPress={handleQueryPress}
        />

        {/* Environment Variables Modal - Auto-opens if restored state indicates it was open */}
        <EnvVarsModal
          key="env-vars-modal"
          visible={isEnvModalOpen}
          onClose={handleEnvModalDismiss}
          requiredEnvVars={requiredEnvVars}
          _envVarsSubtitle={envVarsSubtitle}
          enableSharedModalDimensions={enableSharedModalDimensions}
        />

        {/* Sentry Events Modal - Auto-opens if restored state indicates it was open */}
        {/* <SentryLogsModal
          key="sentry-logs-modal"
          visible={isSentryModalOpen}
          onClose={handleSentryModalDismiss}
          getSentrySubtitle={getSentrySubtitle}
          enableSharedModalDimensions={enableSharedModalDimensions}
        /> */}

        {/* Storage Browser Modal - Auto-opens if restored state indicates it was open */}
        <StorageModal
          key="storage-modal"
          visible={isStorageModalOpen}
          onClose={handleStorageModalDismiss}
          enableSharedModalDimensions={enableSharedModalDimensions}
          requiredStorageKeys={requiredStorageKeys}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  queryButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
