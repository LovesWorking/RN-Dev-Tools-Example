import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
  Check,
} from "lucide-react-native";
import {
  LogLevel,
  LogType,
  ConsoleTransportEntry,
} from "@/rn-better-dev-tools/src/shared/logger/types";
import { useSentryEventCounts } from "../hooks/useSentryEvents";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface SentryFilterViewProps {
  _entries: ConsoleTransportEntry[];
  selectedTypes: Set<LogType>;
  selectedLevels: Set<LogLevel>;
  onToggleTypeFilter: (type: LogType) => void;
  onToggleLevelFilter: (level: LogLevel) => void;
  _onBack: () => void;
}

// Define all possible log types with their icons and colors
const ALL_LOG_TYPES = [
  { type: LogType.Navigation, Icon: Route, color: gameUIColors.success },
  { type: LogType.Touch, Icon: Hand, color: gameUIColors.warning },
  { type: LogType.System, Icon: Settings, color: gameUIColors.storage },
  { type: LogType.HTTPRequest, Icon: Globe, color: gameUIColors.info },
  { type: LogType.State, Icon: Database, color: gameUIColors.storage },
  { type: LogType.UserAction, Icon: User, color: gameUIColors.optional },
  { type: LogType.Auth, Icon: Key, color: gameUIColors.warning },
  { type: LogType.Error, Icon: AlertTriangle, color: gameUIColors.error },
  { type: LogType.Debug, Icon: Bug, color: gameUIColors.info },
  { type: LogType.Custom, Icon: Palette, color: gameUIColors.info },
  { type: LogType.Generic, Icon: Box, color: gameUIColors.secondary },
  { type: LogType.Replay, Icon: Play, color: gameUIColors.critical },
];

// Define all log levels
const ALL_LOG_LEVELS = [
  { level: LogLevel.Info, color: gameUIColors.info },
  { level: LogLevel.Debug, color: gameUIColors.info },
  { level: LogLevel.Warn, color: gameUIColors.warning },
  { level: LogLevel.Error, color: gameUIColors.error },
];

export function SentryFilterView({
  _entries,
  selectedTypes,
  selectedLevels,
  onToggleTypeFilter,
  onToggleLevelFilter,
  _onBack,
}: SentryFilterViewProps) {
  // Use reactive counts hook for real-time updates
  const counts = useSentryEventCounts();

  // Sort log types by count (descending)
  const sortedLogTypes = [...ALL_LOG_TYPES].sort((a, b) => {
    const countA = counts.byType[a.type] || 0;
    const countB = counts.byType[b.type] || 0;
    return countB - countA;
  });

  // Sort log levels by count (descending)
  const sortedLogLevels = [...ALL_LOG_LEVELS].sort((a, b) => {
    const countA = counts.byLevel[a.level] || 0;
    const countB = counts.byLevel[b.level] || 0;
    return countB - countA;
  });

  const renderFilterItem = (
    key: string,
    label: string,
    count: number,
    isSelected: boolean,
    onPress: () => void,
    Icon?: React.ComponentType<{ size?: number; color?: string }>,
    color?: string
  ) => (
    <TouchableOpacity
      accessibilityLabel={`${label} filter ${count} items`}
      accessibilityHint={`View ${label} filter ${count} items`}
      sentry-label="ignore devtools sentry filter item"
      key={key}
      onPress={onPress}
      style={[
        styles.filterItem,
        isSelected && { backgroundColor: `${color}20`, borderColor: color },
      ]}
    >
      <View style={styles.filterItemLeft} sentry-label="ignore devtools sentry filter item left">
        {Icon && <Icon size={16} color={isSelected ? color : gameUIColors.secondary} />}
        <Text style={[styles.filterItemText, isSelected && { color }]} sentry-label="ignore devtools sentry filter item text">
          {label}
        </Text>
      </View>
      <View style={styles.filterItemRight} sentry-label="ignore devtools sentry filter item right">
        {count > 0 && (
          <Text style={[styles.filterItemCount, isSelected && { color }]} sentry-label="ignore devtools sentry filter item count">
            {count}
          </Text>
        )}
        {isSelected && <Check size={14} color={color} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} sentry-label="ignore devtools sentry filter container">
      <ScrollView
        accessibilityLabel="Sentry filter view"
        accessibilityHint="View sentry filter view"
        sentry-label="ignore devtools sentry filter scroll"
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Log Levels Section */}
        <View style={styles.section} sentry-label="ignore devtools sentry filter section">
          <Text style={styles.sectionTitle} sentry-label="ignore devtools sentry filter section title">Log Levels</Text>
          <View style={styles.filterGrid} sentry-label="ignore devtools sentry filter grid">
            {sortedLogLevels.map(({ level, color }) => {
              const count = counts.byLevel[level] || 0;
              const label =
                level === LogLevel.Warn
                  ? "Warning"
                  : level.charAt(0).toUpperCase() + level.slice(1);

              return renderFilterItem(
                `level-${level}`,
                label,
                count,
                selectedLevels.has(level),
                () => onToggleLevelFilter(level),
                undefined,
                color
              );
            })}
          </View>
        </View>

        {/* Event Types Section */}
        <View style={styles.section} sentry-label="ignore devtools sentry filter section">
          <Text style={styles.sectionTitle} sentry-label="ignore devtools sentry filter section title">Event Types</Text>
          <View style={styles.filterGrid} sentry-label="ignore devtools sentry filter grid">
            {sortedLogTypes.map(({ type, Icon, color }) => {
              const count = counts.byType[type] || 0;
              const label =
                type === LogType.HTTPRequest
                  ? "HTTP Request"
                  : type === LogType.UserAction
                    ? "User Action"
                    : type;

              return renderFilterItem(
                `type-${type}`,
                label,
                count,
                selectedTypes.has(type),
                () => onToggleTypeFilter(type),
                Icon,
                color
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: gameUIColors.secondary,
    marginBottom: 12,
    fontFamily: "monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  filterGrid: {
    gap: 8,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    marginBottom: 8,
  },
  filterItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterItemText: {
    fontSize: 14,
    color: gameUIColors.secondary,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  filterItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterItemCount: {
    fontSize: 11,
    color: gameUIColors.muted,
    backgroundColor: gameUIColors.border + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    fontFamily: "monospace",
  },
});
