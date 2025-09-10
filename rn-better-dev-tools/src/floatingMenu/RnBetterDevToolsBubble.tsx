import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RequiredEnvVar,
  EnvVarsModal,
  EnvironmentIndicator,
  type Environment,
} from "@/rn-better-dev-tools/src/features/env";
import {
  StorageModalWithTabs,
  RequiredStorageKey,
} from "@/rn-better-dev-tools/src/features/storage";
import { NetworkModal } from "@/rn-better-dev-tools/src/features/network";
import {
  SentryLogsModal,
  setupSentryEventListeners,
} from "@/rn-better-dev-tools/src/features/sentry";

import { FloatingTools, type UserRole, UserStatus } from "./floatingTools";
import { ErrorBoundary } from "@/rn-better-dev-tools/src/shared/ui/components/ErrorBoundary";
import {
  ReactQueryModal,
  useModalManager,
  useWifiState,
} from "@/rn-better-dev-tools/src/features/react-query";
// DevToolsSectionListModal removed - using Dial2 directly
import { DialDevTools } from "./dial/DialDevTools";
import { useDevToolsSettings } from "./DevToolsSettingsModal";
// Icons and colors are provided by installedApps; no direct icon imports here.
import type { InstalledApp, FloatingMenuActions, FloatingMenuState } from "./types";

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
  requiredStorageKeys?: RequiredStorageKey[];
  hideUserStatus?: boolean;
  installedApps?: InstalledApp[]; // NEW: data-driven apps list
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
  installedApps,
}: RnBetterDevToolsBubbleProps) {
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const { settings: devToolsSettings, refreshSettings } = useDevToolsSettings();

  // Use persisted WiFi state
  const { isOnline: isWifiEnabled, handleWifiToggle } = useWifiState();

  // Data-driven pattern note
  useEffect(() => {
    if (!installedApps || installedApps.length === 0) {
      console.warn(
        "[RnBetterDevToolsBubble] No installedApps provided. Floating row will be empty; dial opens with zero tools."
      );
    }
  }, []);

  // Using the default Dial menu exclusively

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

  // Initialize Sentry event listeners on mount
  useEffect(() => {
    setupSentryEventListeners();
  }, []);

  // Modal management hook with persistence - extracted from main component logic
  const {
    isModalOpen,
    isEnvModalOpen,
    isStorageModalOpen,
    isNetworkModalOpen,
    isSentryModalOpen,
    selectedQueryKey,
    activeFilter,
    activeTab,
    selectedMutationId,
    setActiveFilter,
    handleModalDismiss,
    handleEnvModalDismiss,
    handleStorageModalDismiss,
    handleNetworkModalDismiss,
    handleSentryModalDismiss,
    handleQuerySelect,
    handleQueryPress,
    handleEnvPress,
    handleStoragePress,
    handleNetworkPress,
    handleSentryPress,
    handleTabChange,
    handleMutationSelect,
  } = useModalManager();

  // Build generic state/actions for apps
  const actions: FloatingMenuActions = {
    openReactQuery: handleQueryPress,
    openEnvironment: handleEnvPress,
    openSentry: handleSentryPress,
    openStorage: handleStoragePress,
    openNetwork: handleNetworkPress,
    toggleWifi: handleWifiToggle,
  };

  const state: FloatingMenuState = {
    isWifiEnabled,
  };

  // Settings bridging: known ids map to existing settings keys
  const isFloatingEnabled = (id: string) => {
    const s = devToolsSettings?.floatingTools;
    if (!s) return true;
    switch (id) {
      case "query":
        return s.query && !hideQueryButton;
      case "env":
        return s.env && !hideEnvButton;
      case "storage":
        return s.storage && !hideStorageButton;
      case "wifi":
        return s.wifi && !hideWifiToggle;
      case "network":
        return s.network;
      case "environment":
        return s.environment && !hideEnvironment;
      default:
        return true; // Unknown/custom apps visible by default
    }
  };

  const rowApps = (installedApps ?? []).filter(
    (a) => (a.slot ?? "both") !== "dial"
  );

  // Removed auto-open - Dial2 is now the primary selector

  // Hide bubble when any modal is open to prevent visual overlap
  // Don't hide for settings modal so we can see live updates
  const isAnyModalOpen =
    isModalOpen ||
    // isDebugModalOpen || // Not used anymore - we use showFloatingMenu instead
    isEnvModalOpen ||
    isSentryModalOpen ||
    isStorageModalOpen ||
    isNetworkModalOpen;

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
            {/* Environment indicator badge */}
            {devToolsSettings.floatingTools.environment && !hideEnvironment && (
              <EnvironmentIndicator environment={environment!} />
            )}
            {/* User status - always shown, opens the dial menu */}
            {!hideUserStatus && (
              <UserStatus
                userRole={userRole}
                onPress={() => {
                  refreshSettings(); // Reload settings from storage
                  if (!installedApps || installedApps.length === 0) {
                    console.warn(
                      "[RnBetterDevToolsBubble] No installedApps provided; opening dial with zero tools."
                    );
                  }
                  setShowFloatingMenu(true);
                }}
              />
            )}

            {/* Quick-access floating tool icons (data-driven only) */}
            {rowApps.map((app) => {
              if (!isFloatingEnabled(app.id)) return null;
              return (
                <TouchableOpacity
                  key={`row-${app.id}`}
                  accessibilityLabel={app.name}
                  onPress={() => app.onPress({ state, actions })}
                  style={styles.fab}
                >
                  {typeof app.icon === "function"
                    ? app.icon({ slot: "row", size: 16, state, actions })
                    : app.icon}
                </TouchableOpacity>
              );
            })}
          </FloatingTools>
        </View>

        {/* Floating Dev Tools Menu - Multiple menu types */}
        {showFloatingMenu && (
          <DialDevTools
            apps={installedApps ?? []}
            state={state}
            actions={actions}
            onClose={() => setShowFloatingMenu(false)}
            settings={devToolsSettings}
          />
        )}

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
          enableSharedModalDimensions={enableSharedModalDimensions}
        />

        {/* Sentry Events Modal */}
        <SentryLogsModal
          key="sentry-logs-modal"
          visible={isSentryModalOpen}
          onClose={handleSentryModalDismiss}
          enableSharedModalDimensions={enableSharedModalDimensions}
        />

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
          onClose={handleNetworkModalDismiss}
          enableSharedModalDimensions={enableSharedModalDimensions}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  fab: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: 0,
    // No background or border — icon-only buttons
    backgroundColor: "transparent",
  },
});
