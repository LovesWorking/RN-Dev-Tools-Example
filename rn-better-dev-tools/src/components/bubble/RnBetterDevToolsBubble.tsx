import { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RequiredEnvVar,
  useEnvVarsSubtitle,
  EnvVarsModal,
} from "@/rn-better-dev-tools/src/features/env";
import {
  StorageModalWithTabs,
  RequiredStorageKey,
} from "@/rn-better-dev-tools/src/features/storage";
import { NetworkModal } from "@/rn-better-dev-tools/src/features/network";
// import { SentryLogsModal } from "@/rn-better-dev-tools/src/features/sentry/components/SentryLogsModal"; // Temporarily disabled - causing import errors

import {
  FloatingTools,
  type UserRole,
  EnvironmentIndicator,
  UserStatus,
} from "./floatingTools";
import type { Environment } from "@/rn-better-dev-tools/src/features/env";
import { ErrorBoundary } from "@/rn-better-dev-tools/src/shared/ui/components/ErrorBoundary";
import {
  ReactQueryModal,
  useModalManager,
} from "@/rn-better-dev-tools/src/features/react-query";
// DevToolsSectionListModal removed - using Dial2 directly
import { ClaudeGridMenu } from "./ClaudeGridMenu";
import { ClaudeGridMenuSVGGlitch } from "./ClaudeGridMenuSVGGlitch";
import DialDevTools from "./dial/DialDevTools";
import Dial2 from "./dial/Dial2";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

// Re-export types that developers will need
export type { UserRole } from "./floatingTools";
export type {
  Environment,
  RequiredEnvVar,
} from "@/rn-better-dev-tools/src/features/env";
export type { RequiredStorageKey } from "@/rn-better-dev-tools/src/features/storage";
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
  onOpenPerformanceTest?: () => void;
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
  onOpenPerformanceTest,
}: RnBetterDevToolsBubbleProps) {
  const [showFloatingMenu, setShowFloatingMenu] = useState(false); // Set to false for production
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  // Menu type selection
  type MenuType = "claude" | "dial" | "dial2";
  const [menuType, setMenuType] = useState<MenuType>("dial");

  // Get screen dimensions
  const { height: screenHeight } = Dimensions.get("window");

  // Store the button position (approximate position of floating tools)
  const [buttonPosition] = useState({
    x: 44, // Distance from right edge
    y: screenHeight - 708, // Distance from bottom
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
    setActiveFilter,
    handleModalDismiss,
    handleDebugModalDismiss,
    handleEnvModalDismiss,
    handleStorageModalDismiss,
    handleQuerySelect,
    handleQueryPress,
    handleStatusPress,
    handleEnvPress,
    handleStoragePress,
    handleTabChange,
    handleMutationSelect,
    setSelectedSection,
  } = useModalManager();

  // Removed auto-open - Dial2 is now the primary selector

  // Hide bubble when any modal is open to prevent visual overlap
  const isAnyModalOpen =
    isModalOpen ||
    // isDebugModalOpen || // Not used anymore - we use showFloatingMenu instead
    isEnvModalOpen ||
    // isSentryModalOpen || // Disabled - Sentry modal causing import issues
    isStorageModalOpen ||
    isNetworkModalOpen;

  // Debug which modal is stuck open
  useEffect(() => {
    if (isAnyModalOpen) {
      console.log("Modal open states:", {
        isModalOpen,
        isEnvModalOpen,
        isStorageModalOpen,
      });
    }
  }, [
    isModalOpen,
    isEnvModalOpen,
    isSentryModalOpen,
    isStorageModalOpen,
    isAnyModalOpen,
  ]);

  // Removed auto-open for dev tools console

  // Note: We no longer wait for state restoration to show the bubble
  // The bubble should be visible immediately on app launch

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Floating Tools - Always mounted for stable tree; hidden via opacity/pointerEvents when modals open */}
        <View
          pointerEvents={isAnyModalOpen || showFloatingMenu ? "none" : "auto"}
          style={{ opacity: isAnyModalOpen || showFloatingMenu ? 0 : 1 }}
        >
          <FloatingTools enablePositionPersistence>
            <EnvironmentIndicator environment={environment!} />
            <UserStatus
              userRole={userRole}
              onPress={() => setShowFloatingMenu(true)}
            />
            {/* Menu selection buttons */}
            <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}></View>
          </FloatingTools>
        </View>

        {/* Floating Dev Tools Menu - Multiple menu types */}
        {showFloatingMenu &&
          (() => {
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
                // Disabled - Sentry modal has import issues
                setShowFloatingMenu(false);
                // handleSentryPress(); // Don't open the modal
              },
              onStoragePress: () => {
                setShowFloatingMenu(false);
                handleStoragePress();
              },
              onPerformancePress: () => {
                setShowFloatingMenu(false);
                if (onOpenPerformanceTest) {
                  onOpenPerformanceTest();
                }
              },
              onWifiToggle: () => {
                setIsWifiEnabled(!isWifiEnabled);
              },
              onNetworkPress: () => {
                setShowFloatingMenu(false);
                setIsNetworkModalOpen(true);
              },
              onClose: () => {
                setShowFloatingMenu(false);
              },
              isWifiEnabled,
              environment,
            };

            switch (menuType) {
              case "claude":
                return <ClaudeGridMenuSVGGlitch {...menuProps} />;
              case "dial":
                return <DialDevTools {...menuProps} />;
              case "dial2":
                return <Dial2 {...menuProps} />;
              default:
                return <ClaudeGridMenu {...menuProps} />;
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

        {/* Removed duplicate DialDevTools - now only rendered once in the switch statement above */}

        {/* Environment Variables Modal - Auto-opens if restored state indicates it was open */}
        <EnvVarsModal
          key="env-vars-modal"
          visible={isEnvModalOpen}
          onClose={handleEnvModalDismiss}
          requiredEnvVars={requiredEnvVars}
          _envVarsSubtitle={envVarsSubtitle}
          enableSharedModalDimensions={enableSharedModalDimensions}
        />

        {/* Sentry Events Modal - Temporarily disabled due to import issues */}
        {/* <SentryLogsModal
          key="sentry-logs-modal"
          visible={isSentryModalOpen}
          onClose={handleSentryModalDismiss}
          getSentrySubtitle={() => "Sentry subtitle"}
          enableSharedModalDimensions={enableSharedModalDimensions}
        /> */}

        {/* Storage Browser Modal with Tabs - Auto-opens if restored state indicates it was open */}
        <StorageModalWithTabs
          key="storage-modal"
          visible={isStorageModalOpen}
          onClose={handleStorageModalDismiss}
          enableSharedModalDimensions={enableSharedModalDimensions}
          requiredStorageKeys={requiredStorageKeys}
        />

        {/* Network Modal - Shows all network requests */}
        <NetworkModal
          key="network-modal"
          visible={isNetworkModalOpen}
          onClose={() => setIsNetworkModalOpen(false)}
          enableSharedModalDimensions={enableSharedModalDimensions}
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
    backgroundColor: gameUIColors.panel,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: gameUIColors.panel,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: gameUIColors.panel,
    borderWidth: 1,
    borderColor: gameUIColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    color: gameUIColors.primary,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
