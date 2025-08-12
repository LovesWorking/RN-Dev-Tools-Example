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
} from "@/src/_shared/icons/lucide-icons";

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

            <Pressable
              onPress={handleQueryPress}
              style={styles.queryButton}
              hitSlop={8}
            >
              <TanstackLogo />
            </Pressable>

            <Pressable
              onPress={handleEnvPress}
              style={styles.iconButton}
              hitSlop={8}
            >
              <ServerIcon size={16} color="#10B981" />
            </Pressable>
            <Pressable
              onPress={handleSentryPress}
              style={styles.iconButton}
              hitSlop={8}
            >
              <BugIcon size={16} color="#EF4444" />
            </Pressable>

            <Pressable
              onPress={handleStoragePress}
              style={styles.iconButton}
              hitSlop={8}
            >
              <DatabaseIcon size={16} color="#3B82F6" />
            </Pressable>

            <WifiToggle />
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
