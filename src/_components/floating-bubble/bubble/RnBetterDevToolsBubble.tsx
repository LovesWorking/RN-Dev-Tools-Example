import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
} from "./components/FloatingTools";
import type { Environment } from "../../../_sections/env";
import { ErrorBoundary } from "../../../_shared/ui/components/ErrorBoundary";
import {
  ReactQueryModal,
  useReactQueryState,
  useModalManager,
  WifiToggle,
} from "../../../_sections/react-query";
import { DevToolsConsole } from "../console/DevToolsConsole";
import { useBubbleVisibilitySettings } from "./hooks/useBubbleVisibilitySettings";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import { DatabaseIcon, BugIcon, ServerIcon } from "@/src/_shared/icons/lucide-icons";

// Re-export types that developers will need
export type { UserRole } from "./components/FloatingTools";
export type { Environment, RequiredEnvVar } from "../../../_sections/env";
export type { RequiredStorageKey } from "../../../_sections/storage";

/**
 * Props for the RnBetterDevToolsBubble component
 */
interface RnBetterDevToolsBubbleProps {
  /**
   * The Tanstack Query client instance to use for data management
   * This is required for the dev tools to interact with your React Query data
   */
  queryClient: QueryClient;

  /**
   * The current user's role in the application
   * Used to display user status indicator in the bubble
   * @example "admin" | "internal" | "user"
   */
  userRole?: UserRole;

  /**
   * The current application environment
   * Used to display environment indicator in the bubble
   * @example "local" | "dev" | "qa" | "staging" | "prod"
   */
  environment: Environment;

  /**
   * Array of required environment variables to check
   * These will be displayed in the Environment Variables modal with their status
   * @example [{ name: "API_URL", description: "Backend API endpoint" }]
   */
  requiredEnvVars?: RequiredEnvVar[];

  /**
   * Array of required storage keys to check
   * These will be displayed in the Storage Browser modal with their status
   * @example ["user_token", { key: "app_config", expectedType: "object" }]
   */
  requiredStorageKeys?: RequiredStorageKey[];

  /**
   * Enable shared modal dimensions across all modals
   * When true, all modals will maintain consistent size
   * @default false
   */
  enableSharedModalDimensions?: boolean;

  /**
   * Hide the environment indicator in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default false
   */
  hideEnvironment?: boolean;

  /**
   * Hide the user status indicator in the bubble
   * Only applies when userRole prop is provided
   * @default false
   */
  hideUserStatus?: boolean;

  /**
   * Hide the React Query button in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default false
   */
  hideQueryButton?: boolean;

  /**
   * Hide the WiFi toggle button in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default false
   */
  hideWifiToggle?: boolean;

  /**
   * Hide the Environment Variables button in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default true (off by default)
   */
  hideEnvButton?: boolean;

  /**
   * Hide the Sentry Events button in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default true (off by default)
   */
  hideSentryButton?: boolean;

  /**
   * Hide the Storage Browser button in the bubble
   * Sets the default visibility for all users
   * Users can override this in their local settings
   * @default true (off by default)
   */
  hideStorageButton?: boolean;
}

/**
 * RnBetterDevToolsBubble - A floating developer tools bubble for React Native apps
 *
 * This component provides a draggable floating bubble that gives developers quick access to:
 * - React Query dev tools for inspecting and modifying query/mutation data
 * - Environment indicator showing the current app environment
 * - User role status display
 * - WiFi toggle for testing offline scenarios
 * - Dev console with environment variable checking and other debugging tools
 *
 * ## Visibility Control Priority System:
 * 1. **User Preferences (Highest Priority)**: If a user has explicitly toggled a button
 *    in the settings UI, that preference is always used
 * 2. **Developer Defaults (Props)**: If no user preference exists, the hide* props
 *    determine default visibility (e.g., hide certain buttons in production)
 * 3. **Built-in Defaults**: If neither user preference nor props exist, built-in
 *    defaults are used (most buttons visible)
 *
 * @example
 * ```tsx
 * // Production setup - hide most buttons by default
 * <RnBetterDevToolsBubble
 *   queryClient={queryClient}
 *   environment="prod"
 *   hideQueryButton={true}   // Hidden by default in prod
 *   hideWifiToggle={true}    // Hidden by default in prod
 *   hideEnvButton={true}     // Hidden by default in prod
 * />
 * // Users can still enable these buttons in their local settings
 * ```
 */
export function RnBetterDevToolsBubble({
  queryClient,
  userRole,
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

  // Load visibility settings from storage
  const { settings: visibilitySettings, reload: reloadSettings } =
    useBubbleVisibilitySettings({
      hideEnvironment,
      hideUserStatus,
      hideQueryButton,
      hideWifiToggle,
      hideEnvButton,
      hideSentryButton,
      hideStorageButton,
    });

  // Specialized hooks for different concerns following composition principles
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
            {visibilitySettings.hideEnvironment ? null : (
              <EnvironmentIndicator environment={environment!} />
            )}

            {userRole ? (
              <UserStatus userRole={userRole} onPress={handleStatusPress} />
            ) : null}

            {visibilitySettings.hideQueryButton ? null : (
              <Pressable
                accessibilityLabel="React Query"
                accessibilityHint="View React Query"
                sentry-label="ignore user interaction"
                onPress={handleQueryPress}
                style={styles.queryButton}
                hitSlop={8}
              >
                <TanstackLogo />
              </Pressable>
            )}

            {visibilitySettings.hideEnvButton ? null : (
              <Pressable
                accessibilityLabel="Environment Variables"
                accessibilityHint="View Environment Variables"
                sentry-label="ignore user interaction"
                onPress={handleEnvPress}
                style={styles.iconButton}
                hitSlop={8}
              >
                <ServerIcon size={16} color="#10B981" />
              </Pressable>
            )}

            {visibilitySettings.hideSentryButton ? null : (
              <Pressable
                accessibilityLabel="Sentry Events"
                accessibilityHint="View Sentry Events"
                sentry-label="ignore user interaction"
                onPress={handleSentryPress}
                style={styles.iconButton}
                hitSlop={8}
              >
                <BugIcon size={16} color="#EF4444" />
              </Pressable>
            )}

            {visibilitySettings.hideStorageButton ? null : (
              <Pressable
                accessibilityLabel="Storage Browser"
                accessibilityHint="View Storage Browser"
                sentry-label="ignore user interaction"
                onPress={handleStoragePress}
                style={styles.iconButton}
                hitSlop={8}
              >
                <DatabaseIcon size={16} color="#3B82F6" />
              </Pressable>
            )}

            {visibilitySettings.hideWifiToggle ? null : <WifiToggle />}
          </FloatingTools>
        </View>

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
          onSettingsChange={() => {
            // Reload settings from storage after a delay to ensure they're saved
            // Using longer delay to avoid race conditions
            setTimeout(() => {
              reloadSettings();
            }, 300);
          }}
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
});
