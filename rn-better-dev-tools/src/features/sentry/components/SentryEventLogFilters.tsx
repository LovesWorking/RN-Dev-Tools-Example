import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AlertTriangle,
  Box,
  Bug,
  Database,
  Globe,
  Hand,
  Key,
  Palette,
  Play,
  Route,
  Settings,
  User,
} from "lucide-react-native";

import { ConsoleTransportEntry, LogLevel, LogType } from "@/rn-better-dev-tools/src/shared/logger/types";

import { getLevelCount, getTypeCount } from "@/rn-better-dev-tools/src/features/log-dump/utils";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface SentryEventLogFiltersProps {
  entries: ConsoleTransportEntry[];
  selectedTypes: Set<LogType>;
  selectedLevels: Set<LogLevel>;
  onToggleTypeFilter: (type: LogType) => void;
  onToggleLevelFilter: (level: LogLevel) => void;
}

// Helper functions to get actual counts
const getActualTypeCount = (
  entries: ConsoleTransportEntry[],
  type: LogType
) => {
  return entries.filter((entry) => entry.type === type).length;
};

const getActualLevelCount = (
  entries: ConsoleTransportEntry[],
  level: LogLevel
) => {
  return entries.filter((entry) => entry.level === level).length;
};

export const SentryEventLogFilters = ({
  entries,
  selectedTypes,
  selectedLevels,
  onToggleTypeFilter,
  onToggleLevelFilter,
}: SentryEventLogFiltersProps) => {
  // Calculate which filters have data
  const typeFilters = [
    {
      type: LogType.Auth,
      Icon: Key,
      color: gameUIColors.warning,
      textColor: gameUIColors.warning,
      bgColor: gameUIColors.warning + "20",
      borderColor: gameUIColors.warning,
    },
    {
      type: LogType.Custom,
      Icon: Palette,
      color: gameUIColors.info,
      textColor: gameUIColors.info,
      bgColor: gameUIColors.info + "20",
      borderColor: gameUIColors.info,
    },
    {
      type: LogType.Debug,
      Icon: Bug,
      color: gameUIColors.info,
      textColor: gameUIColors.info,
      bgColor: gameUIColors.info + "20",
      borderColor: gameUIColors.info,
    },
    {
      type: LogType.Error,
      Icon: AlertTriangle,
      color: gameUIColors.error,
      textColor: gameUIColors.error,
      bgColor: gameUIColors.error + "20",
      borderColor: gameUIColors.error,
    },
    {
      type: LogType.Generic,
      Icon: Box,
      color: gameUIColors.secondary,
      textColor: gameUIColors.secondary,
      bgColor: gameUIColors.secondary + "20",
      borderColor: gameUIColors.secondary,
    },
    {
      type: LogType.HTTPRequest,
      Icon: Globe,
      color: gameUIColors.info,
      textColor: gameUIColors.info,
      bgColor: gameUIColors.info + "20",
      borderColor: gameUIColors.info,
    },
    {
      type: LogType.Navigation,
      Icon: Route,
      color: gameUIColors.success,
      textColor: gameUIColors.success,
      bgColor: gameUIColors.success + "20",
      borderColor: gameUIColors.success,
    },
    {
      type: LogType.System,
      Icon: Settings,
      color: gameUIColors.storage,
      textColor: gameUIColors.storage,
      bgColor: gameUIColors.storage + "20",
      borderColor: gameUIColors.storage,
    },
    {
      type: LogType.Touch,
      Icon: Hand,
      color: gameUIColors.warning,
      textColor: gameUIColors.warning,
      bgColor: gameUIColors.warning + "20",
      borderColor: gameUIColors.warning,
    },
    {
      type: LogType.UserAction,
      Icon: User,
      color: gameUIColors.optional,
      textColor: gameUIColors.optional,
      bgColor: gameUIColors.optional + "20",
      borderColor: gameUIColors.optional,
    },
    {
      type: LogType.State,
      Icon: Database,
      color: gameUIColors.storage,
      textColor: gameUIColors.storage,
      bgColor: gameUIColors.storage + "20",
      borderColor: gameUIColors.storage,
    },
    {
      type: LogType.Replay,
      Icon: Play,
      color: gameUIColors.critical,
      textColor: gameUIColors.critical,
      bgColor: gameUIColors.critical + "20",
      borderColor: gameUIColors.critical,
    },
  ]
    .filter((filter) => getActualTypeCount(entries, filter.type) > 0)
    .sort(
      (a, b) =>
        getActualTypeCount(entries, b.type) -
        getActualTypeCount(entries, a.type)
    );

  const levelFilters = [
    {
      level: LogLevel.Debug,
      textColor: gameUIColors.info,
      bgColor: gameUIColors.info + "20",
      borderColor: gameUIColors.info,
      dotColor: gameUIColors.info,
    },
    {
      level: LogLevel.Error,
      textColor: gameUIColors.error,
      bgColor: gameUIColors.error + "20",
      borderColor: gameUIColors.error,
      dotColor: gameUIColors.error,
    },
    {
      level: LogLevel.Info,
      textColor: gameUIColors.info,
      bgColor: gameUIColors.info + "20",
      borderColor: gameUIColors.info,
      dotColor: gameUIColors.info,
    },
    {
      level: LogLevel.Warn,
      textColor: gameUIColors.warning,
      bgColor: gameUIColors.warning + "20",
      borderColor: gameUIColors.warning,
      dotColor: gameUIColors.warning,
    },
  ]
    .filter((filter) => getActualLevelCount(entries, filter.level) > 0)
    .sort(
      (a, b) =>
        getActualLevelCount(entries, b.level) -
        getActualLevelCount(entries, a.level)
    );

  return (
    <View style={styles.container}>
      {/* Type filters */}
      {typeFilters.length > 0 && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            sentry-label="ignore sentry log type filters scroll view"
          >
            {typeFilters.map(
              ({ type, Icon, color, textColor, bgColor, borderColor }) => (
                <TouchableOpacity
                  key={type}
                  sentry-label={`ignore toggle ${type} sentry type filter`}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter ${type} sentry logs`}
                  accessibilityHint={`${
                    selectedTypes.has(type) ? "Remove" : "Add"
                  } ${type} type filter`}
                  onPress={() => onToggleTypeFilter(type)}
                  style={[
                    styles.filterButton,
                    selectedTypes.has(type)
                      ? { backgroundColor: bgColor, borderColor: borderColor }
                      : styles.inactiveFilter,
                  ]}
                >
                  <Icon
                    size={12}
                    color={selectedTypes.has(type) ? color : gameUIColors.muted}
                  />
                  <Text
                    style={[
                      styles.filterText,
                      selectedTypes.has(type)
                        ? { color: textColor }
                        : styles.inactiveFilterText,
                    ]}
                  >
                    {type === LogType.HTTPRequest
                      ? "HTTP Request"
                      : type === LogType.UserAction
                      ? "User Action"
                      : type}
                    {getTypeCount(entries, type)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      )}

      {/* Level filters */}
      {levelFilters.length > 0 && (
        <View style={styles.levelFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            sentry-label="ignore sentry log level filters scroll view"
          >
            {levelFilters.map(
              ({ level, textColor, bgColor, borderColor, dotColor }) => (
                <TouchableOpacity
                  key={level}
                  sentry-label={`ignore toggle ${level} sentry level filter`}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter ${level} level sentry logs`}
                  accessibilityHint={`${
                    selectedLevels.has(level) ? "Remove" : "Add"
                  } ${level} level filter`}
                  onPress={() => onToggleLevelFilter(level)}
                  style={[
                    styles.filterButton,
                    selectedLevels.has(level)
                      ? { backgroundColor: bgColor, borderColor: borderColor }
                      : styles.inactiveFilter,
                  ]}
                >
                  <View
                    style={[styles.levelDot, { backgroundColor: dotColor }]}
                  />
                  <Text
                    style={[
                      styles.filterText,
                      selectedLevels.has(level)
                        ? { color: textColor }
                        : styles.inactiveFilterText,
                    ]}
                  >
                    {level === LogLevel.Warn ? "warning" : level}
                    {getLevelCount(entries, level)}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 6,
  },
  scrollContent: {
    gap: 6,
  },
  levelFiltersContainer: {
    marginTop: 6,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  inactiveFilter: {
    backgroundColor: gameUIColors.panel + "40",
    borderColor: gameUIColors.border + "40",
  },
  filterText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inactiveFilterText: {
    color: gameUIColors.secondary,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
