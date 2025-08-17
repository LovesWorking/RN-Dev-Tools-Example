import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Dimensions, Text } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RequiredEnvVar,
  useEnvVarsSubtitle,
  EnvVarsModal,
} from "../../../_sections/env";
import { StorageModalWithTabs, RequiredStorageKey } from "../../../_sections/storage";
// import { SentryLogsModal } from "../../../_sections/sentry/components/SentryLogsModal"; // Temporarily disabled - causing import errors

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
  useModalManager,
} from "../../../_sections/react-query";
// DevToolsSectionListModal removed - using Dial2 directly
import { ClaudeGridMenu } from "./ClaudeGridMenu";
import { ClaudeGridMenuSVGGlitch } from "./ClaudeGridMenuSVGGlitch";
import DialDevTools from "./DialDevTools";
import Dial2 from "./Dial2";

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
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);

  // Menu type selection
  type MenuType = "claude" | "dial" | "dial2";
  const [menuType, setMenuType] = useState<MenuType>("dial2");

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
    isDebugModalOpen ||
    isEnvModalOpen ||
    // isSentryModalOpen || // Disabled - Sentry modal causing import issues
    isStorageModalOpen;

  // Debug which modal is stuck open
  useEffect(() => {
    if (isAnyModalOpen) {
    }
  }, [
    isModalOpen,
    isDebugModalOpen,
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
          pointerEvents={isAnyModalOpen ? "none" : "auto"}
          style={{ opacity: isAnyModalOpen ? 0 : 1 }}
        >
          <FloatingTools enablePositionPersistence>
            <EnvironmentIndicator environment={environment!} />
            <UserStatus userRole={userRole} onPress={handleStatusPress} />

            {/* Menu selection buttons */}
            <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}>
              {/* Dial2 - Game UI */}
              <Pressable
                onPress={() => {
                  setMenuType("dial2");
                  setShowFloatingMenu(true);
                }}
                style={[styles.menuButton, { backgroundColor: "#00D4FF" }]}
                hitSlop={8}
              >
                <Text style={styles.menuButtonText}>G</Text>
              </Pressable>

              {/* claude - claude  */}

              <Pressable
                onPress={() => {
                  setMenuType("claude");
                  setShowFloatingMenu(true);
                }}
                style={[styles.menuButton, { backgroundColor: "#FF10F0" }]}
                hitSlop={8}
              >
                <Text style={styles.menuButtonText}>C</Text>
              </Pressable>

              {/* dial */}
              <Pressable
                onPress={() => {
                  setMenuType("dial");
                  setShowFloatingMenu(true);
                }}
                style={[styles.menuButton, { backgroundColor: "#FF10F0" }]}
                hitSlop={8}
              >
                <Text style={styles.menuButtonText}>D</Text>
              </Pressable>
            </View>
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
              onWifiToggle: () => {
                setIsWifiEnabled(!isWifiEnabled);
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

        {/* Dial2 Menu - Opens when user button is clicked */}
        {isDebugModalOpen && (
          <DialDevTools
            onQueryPress={() => {
              handleDebugModalDismiss();
              handleQueryPress();
            }}
            onEnvPress={() => {
              handleDebugModalDismiss();
              handleEnvPress();
            }}
            onSentryPress={() => {
              // Disabled - Sentry modal has import issues
              console.warn("Sentry modal is temporarily disabled");
              handleDebugModalDismiss();
            }}
            onStoragePress={() => {
              handleDebugModalDismiss();
              handleStoragePress();
            }}
            onWifiToggle={() => {
              setIsWifiEnabled(!isWifiEnabled);
            }}
            onClose={() => {
              handleDebugModalDismiss();
            }}
            isWifiEnabled={isWifiEnabled}
          />
        )}

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
  menuButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
