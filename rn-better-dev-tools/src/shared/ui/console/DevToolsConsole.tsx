import { useState, useEffect } from "react";
import { RequiredEnvVar } from "@/rn-better-dev-tools/src/features/env/types";
import { RequiredStorageKey } from "@/rn-better-dev-tools/src/features/storage/types";
import { DevToolsModalRouter, SectionType } from "./DevToolsModalRouter";

interface DevToolsConsoleProps {
  visible: boolean;
  onClose: () => void;
  requiredEnvVars: RequiredEnvVar[];
  requiredStorageKeys?: RequiredStorageKey[];
  getSentrySubtitle: () => string;
  getRnBetterDevToolsSubtitle: () => string;
  envVarsSubtitle: string;
  selectedSection?: string | null;
  setSelectedSection?: (section: string | null) => void;
  enableSharedModalDimensions?: boolean;
  onReactQueryPress?: () => void;
  onSettingsChange?: () => void | Promise<void>;
}

/**
 * Simplified DevToolsConsole that works with Dial2 as the primary menu selector.
 * No longer includes a section list modal - Dial2 handles the menu selection.
 * 
 * Applied principles:
 * - Single Responsibility: Only handles routing to the selected modal
 * - Composition: Delegates all UI to specialized components
 * - Simplified State: Removed redundant section list logic
 */
export function DevToolsConsole({
  visible,
  onClose,
  requiredEnvVars,
  requiredStorageKeys = [],
  getSentrySubtitle,
  getRnBetterDevToolsSubtitle,
  envVarsSubtitle,
  selectedSection: externalSelectedSection,
  setSelectedSection: externalSetSelectedSection,
  enableSharedModalDimensions = false,
  onReactQueryPress,
  onSettingsChange,
}: DevToolsConsoleProps) {
  // Use external state if provided (for persistence), otherwise use internal state
  const [internalSelectedSection, setInternalSelectedSection] =
    useState<SectionType | null>(null);
  
  const selectedSection =
    (externalSelectedSection as SectionType | null) || internalSelectedSection;
  const setSelectedSection =
    externalSetSelectedSection || setInternalSelectedSection;

  // Handle React Query special case
  useEffect(() => {
    if (selectedSection === "rn-better-dev-tools" && onReactQueryPress) {
      // Close the DevTools console and open the React Query modal
      onClose();
      onReactQueryPress();
      setSelectedSection(null);
    }
  }, [selectedSection, onReactQueryPress, onClose, setSelectedSection]);

  const handleModalClose = () => {
    setSelectedSection(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedSection(null);
  };

  // Only show the modal router when visible and a section is selected
  if (!visible || !selectedSection) {
    return null;
  }

  return (
    <DevToolsModalRouter
      selectedSection={selectedSection}
      onClose={handleModalClose}
      requiredEnvVars={requiredEnvVars}
      requiredStorageKeys={requiredStorageKeys}
      _getSentrySubtitle={getSentrySubtitle}
      envVarsSubtitle={envVarsSubtitle}
      onBack={handleBack}
      enableSharedModalDimensions={enableSharedModalDimensions}
      onSettingsChange={onSettingsChange}
    />
  );
}