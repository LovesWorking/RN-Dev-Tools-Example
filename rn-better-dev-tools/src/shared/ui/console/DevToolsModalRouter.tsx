import { RequiredEnvVar } from "@/rn-better-dev-tools/src/features/env/types";
import { RequiredStorageKey } from "@/rn-better-dev-tools/src/features/storage/types";
import { EnvVarsModal } from "@/rn-better-dev-tools/src/features/env/components/EnvVarsModal";
import { StorageModalWithTabs, StorageEventsModal } from "@/rn-better-dev-tools/src/features/storage";
import { NetworkModal } from "@/rn-better-dev-tools/src/features/network";
import { BubbleSettingsModal } from "./BubbleSettingsModal";

// Available section types for navigation
export type SectionType =
  | "sentry-logs"
  | "env-vars"
  | "rn-better-dev-tools"
  | "storage"
  | "storage-events"
  | "network"
  | "bubble-settings";

interface DevToolsModalRouterProps {
  selectedSection: SectionType | null;
  onClose: () => void;
  requiredEnvVars: RequiredEnvVar[];
  requiredStorageKeys?: RequiredStorageKey[];
  _getSentrySubtitle: () => string;
  envVarsSubtitle: string;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
  onSettingsChange?: () => void | Promise<void>;
}

/**
 * Modal router following "Extract Reusable Logic" principle
 * Single responsibility: Route to appropriate specialized modal based on selection
 * No conditional rendering - each modal handles its own visibility
 */
export function DevToolsModalRouter({
  selectedSection,
  onClose,
  requiredEnvVars,
  requiredStorageKeys = [],
  _getSentrySubtitle,
  envVarsSubtitle,
  onBack,
  enableSharedModalDimensions = false,
  onSettingsChange,
}: DevToolsModalRouterProps) {
  return (
    <>
      {/* <SentryLogsModal
        visible={selectedSection === "sentry-logs"}
        onClose={onClose}
        getSentrySubtitle={_getSentrySubtitle}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
      /> */}

      <EnvVarsModal
        visible={selectedSection === "env-vars"}
        onClose={onClose}
        requiredEnvVars={requiredEnvVars}
        _envVarsSubtitle={envVarsSubtitle}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
      />

      <StorageModalWithTabs
        visible={selectedSection === "storage"}
        onClose={onClose}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
        requiredStorageKeys={requiredStorageKeys}
      />

      {/* Storage Events Modal is now integrated into StorageModalWithTabs as a tab */}
      {/* <StorageEventsModal
        visible={selectedSection === "storage-events"}
        onClose={onClose}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
      /> */}

      <NetworkModal
        visible={selectedSection === "network"}
        onClose={onClose}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
      />

      <BubbleSettingsModal
        visible={selectedSection === "bubble-settings"}
        onClose={onClose}
        onBack={onBack}
        enableSharedModalDimensions={enableSharedModalDimensions}
        onSettingsChange={onSettingsChange}
      />
    </>
  );
}
