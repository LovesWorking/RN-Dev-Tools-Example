import { useState, useCallback } from "react";
import ClaudeModal60FPSClean, { type ModalMode } from "@/rn-better-dev-tools/src/components/modals/claudeModal/ClaudeModal60FPSClean";
import { SentryLogsContent } from "./SentryLogsSection";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BackButton } from "@/rn-better-dev-tools/src/shared/ui/components/BackButton";
import {
  ConsoleTransportEntry,
  LogType,
  LogLevel,
} from "@/rn-better-dev-tools/src/shared/logger/types";
import { Filter, Pause, Play, FlaskConical, Trash } from "lucide-react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { useSentryEvents } from "../hooks/useSentryEvents";
import {
  clearSentryEvents,
  generateTestSentryEvents,
} from "../utils/sentryEventListeners";
import { devToolsStorageKeys } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { useTheme } from "@/rn-better-dev-tools/src/themes/DevToolsThemeContext";

interface SentryLogsModalProps {
  visible: boolean;
  onClose: () => void;
  getSentrySubtitle: () => string;
  onBack?: () => void;
  enableSharedModalDimensions?: boolean;
}

/**
 * Specialized modal for Sentry logs following "Decompose by Responsibility"
 * Single purpose: Display sentry logs in a modal context
 */
export function SentryLogsModal({
  visible,
  onClose,
  onBack,
  enableSharedModalDimensions = false,
}: SentryLogsModalProps) {
  const [modalMode, setModalMode] = useState<ModalMode>("bottomSheet");
  const [selectedEntry, setSelectedEntry] =
    useState<ConsoleTransportEntry | null>(null);
  const [showFilterView, setShowFilterView] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<LogType>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
    new Set()
  );
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(true);
  const theme = useTheme();

  const handleModeChange = useCallback((mode: ModalMode) => {
    setModalMode(mode);
  }, []);

  // Get event counts
  const { entries: filteredEntries, totalCount } = useSentryEvents({
    selectedTypes,
    selectedLevels,
  });

  if (!visible) return null;

  // Handle back navigation - back to list from detail/filter view or back to main menu
  const handleBackPress = () => {
    if (selectedEntry) {
      setSelectedEntry(null);
    } else if (showFilterView) {
      setShowFilterView(false);
    } else if (onBack) {
      onBack();
    }
  };

  const generateTestLogs = () => {
    clearSentryEvents();
    setTimeout(() => {
      generateTestSentryEvents();
    }, 50);
  };

  const clearLogs = () => {
    clearSentryEvents();
  };

  const renderHeaderContent = () => {
    // Show minimal header for detail/filter views
    if (selectedEntry || showFilterView) {
      return (
        <View
          style={styles.headerContainer}
          sentry-label="ignore devtools sentry modal header"
        >
          <BackButton
            onPress={handleBackPress}
            color={gameUIColors.primary}
            size={16}
            sentry-label="ignore devtools sentry modal back button"
          />
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            sentry-label="ignore devtools sentry modal header text"
          >
            {selectedEntry ? "Event Details" : "Filters"}
          </Text>
        </View>
      );
    }

    // Main list view - show full action bar
    return (
      <View
        style={styles.headerContainer}
        sentry-label="ignore devtools sentry modal header"
      >
        {onBack && (
          <BackButton
            onPress={handleBackPress}
            color={gameUIColors.primary}
            size={16}
            sentry-label="ignore devtools sentry modal back button"
          />
        )}
        <Text
          style={styles.eventCount}
          sentry-label="ignore devtools sentry event count"
        >
          {filteredEntries.length} of {totalCount}
          {(selectedTypes.size > 0 || selectedLevels.size > 0) && " (filtered)"}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            sentry-label="ignore devtools sentry filter open"
            onPress={() => setShowFilterView(true)}
            style={[
              styles.iconButton,
              (selectedTypes.size > 0 || selectedLevels.size > 0) &&
                styles.activeFilterButton,
            ]}
            accessibilityLabel="Open filters"
          >
            <Filter
              size={16}
              color={
                selectedTypes.size > 0 || selectedLevels.size > 0
                  ? gameUIColors.optional
                  : gameUIColors.secondary
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            sentry-label="ignore devtools sentry pause logging"
            onPress={() => setIsLoggingEnabled(!isLoggingEnabled)}
            style={[styles.iconButton, isLoggingEnabled && styles.activeButton]}
            accessibilityLabel={
              isLoggingEnabled ? "Pause logging" : "Resume logging"
            }
          >
            {isLoggingEnabled ? (
              <Pause size={16} color={gameUIColors.success} />
            ) : (
              <Play size={16} color={gameUIColors.success} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            sentry-label="ignore devtools sentry generate test events"
            onPress={generateTestLogs}
            style={styles.iconButton}
            accessibilityLabel="Generate test Sentry events"
          >
            <FlaskConical size={16} color={gameUIColors.info} />
          </TouchableOpacity>
          <TouchableOpacity
            sentry-label="ignore devtools sentry clear events"
            onPress={clearLogs}
            style={styles.iconButton}
            accessibilityLabel="Clear Sentry events"
          >
            <Trash size={16} color={gameUIColors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const persistenceKey = enableSharedModalDimensions
    ? devToolsStorageKeys.modal.root()
    : devToolsStorageKeys.sentry.modal();

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
      <SentryLogsContent
        selectedEntry={selectedEntry}
        onSelectEntry={setSelectedEntry}
        showFilterView={showFilterView}
        onShowFilterView={setShowFilterView}
        selectedTypes={selectedTypes}
        selectedLevels={selectedLevels}
        onToggleTypeFilter={(type) => {
          setSelectedTypes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
              newSet.delete(type);
            } else {
              newSet.add(type);
            }
            return newSet;
          });
        }}
        onToggleLevelFilter={(level) => {
          setSelectedLevels((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(level)) {
              newSet.delete(level);
            } else {
              newSet.add(level);
            }
            return newSet;
          });
        }}
        isLoggingEnabled={isLoggingEnabled}
      />
    </ClaudeModal60FPSClean>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
    minHeight: 32,
  },
  headerTitle: {
    color: gameUIColors.primary,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  eventCount: {
    color: gameUIColors.secondary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    fontFamily: "monospace",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: "auto",
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: gameUIColors.panel + "40",
  },
  activeButton: {
    backgroundColor: gameUIColors.success + "26",
  },
  activeFilterButton: {
    backgroundColor: gameUIColors.optional + "26",
  },
});
