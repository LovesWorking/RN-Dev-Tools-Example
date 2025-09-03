import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  XCircle,
} from "rn-better-dev-tools/icons";
import { EnvVarInfo } from "../types";
import { getEnvVarType } from "../utils/envTypeDetector";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  ListItem,
  StatusBadge,
  TypeBadge,
} from "@/rn-better-dev-tools/src/shared/ui/components";

// Stable constants moved to module scope to prevent re-renders
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

interface EnvVarCardProps {
  envVar: EnvVarInfo;
  isExpanded: boolean;
  onToggle: () => void;
}

const getStatusConfig = (status: EnvVarInfo["status"]) => {
  switch (status) {
    case "required_present":
      return {
        icon: CheckCircle2,
        color: gameUIColors.success,
        bgColor: gameUIColors.success + "1A",
        borderColor: gameUIColors.success + "33",
        label: "✓ VALID",
        labelColor: gameUIColors.success,
      };
    case "required_missing":
      return {
        icon: AlertCircle,
        color: gameUIColors.error,
        bgColor: gameUIColors.error + "1A",
        borderColor: gameUIColors.error + "4D",
        label: "⚠ MISSING",
        labelColor: gameUIColors.error,
      };
    case "required_wrong_value":
      return {
        icon: XCircle,
        color: gameUIColors.warning,
        bgColor: gameUIColors.warning + "1A",
        borderColor: gameUIColors.warning + "4D",
        label: "⚠ WRONG VALUE",
        labelColor: gameUIColors.warning,
      };
    case "required_wrong_type":
      return {
        icon: XCircle,
        color: gameUIColors.info,
        bgColor: gameUIColors.info + "1A",
        borderColor: gameUIColors.info + "4D",
        label: "⚠ WRONG TYPE",
        labelColor: gameUIColors.info,
      };
    case "optional_present":
      return {
        icon: Eye,
        color: gameUIColors.optional,
        bgColor: gameUIColors.optional + "1A",
        borderColor: gameUIColors.optional + "33",
        label: "OPTIONAL",
        labelColor: gameUIColors.optional,
      };
  }
};

const formatValue = (value: unknown, isExpanded: boolean = false): string => {
  if (value === undefined || value === null) {
    return "undefined";
  }
  if (typeof value === "string") {
    if (isExpanded) return value;
    return value.length > 40 ? `${value.substring(0, 40)}...` : value;
  }
  const stringified = displayValue(value, isExpanded);
  if (isExpanded) return stringified;
  return stringified.length > 40
    ? `${stringified.substring(0, 40)}...`
    : stringified;
};

export function EnvVarCard({ envVar, isExpanded, onToggle }: EnvVarCardProps) {
  const config = getStatusConfig(envVar.status);
  const StatusIcon = config.icon;
  const hasValue = envVar.value !== undefined && envVar.value !== null;
  const hasExpectedValue = envVar.expectedValue !== undefined;
  const hasExpectedType = envVar.expectedType !== undefined;
  const hasDescription = envVar.description !== undefined;

  return (
    <ListItem onPress={onToggle} style={{ borderColor: config.borderColor }}>
      <ListItem.Header>
        <View
          style={[styles.iconContainer, { backgroundColor: config.bgColor }]}
        >
          <StatusIcon size={14} color={config.color} />
        </View>
        <StatusBadge status={config.label} />
        {hasValue && <TypeBadge type={getEnvVarType(envVar.value)} />}
        <ListItem.Actions>
          <TouchableOpacity
            accessibilityLabel="Expand"
            accessibilityHint="Expand env var card"
            sentry-label={`ignore env var card ${envVar.key} expand`}
            accessibilityRole="button"
            style={styles.actionButton}
            onPress={onToggle}
            hitSlop={HIT_SLOP}
          >
            <Eye size={12} color={gameUIColors.secondary} />
          </TouchableOpacity>
        </ListItem.Actions>
      </ListItem.Header>

      <ListItem.Content>
        <ListItem.Title>{envVar.key}</ListItem.Title>
        {hasDescription && (
          <ListItem.Subtitle>{envVar.description}</ListItem.Subtitle>
        )}
      </ListItem.Content>

      {isExpanded && hasValue && (
        <ListItem.Footer style={styles.expandedContent}>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Current Value:</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueContent} selectable>
                {formatValue(envVar.value, true)}
              </Text>
            </View>
          </View>

          {hasExpectedValue && (
            <View style={styles.valueContainer}>
              <Text style={styles.valueLabel}>Expected Value:</Text>
              <View style={styles.expectedValueBox}>
                <Text style={styles.expectedValueContent} selectable>
                  {envVar.expectedValue}
                </Text>
              </View>
            </View>
          )}

          {hasExpectedType && envVar.expectedType && (
            <View style={styles.valueContainer}>
              <Text style={styles.valueLabel}>Expected Type:</Text>
              <View style={styles.expectedValueBox}>
                <Text style={styles.expectedValueContent} selectable>
                  {envVar.expectedType.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.typeHelperText}>
                Current type: {getEnvVarType(envVar.value)}
              </Text>
            </View>
          )}
        </ListItem.Footer>
      )}

      {isExpanded && !hasValue && (
        <ListItem.Footer style={styles.expandedContent}>
          <View style={styles.emptyValueContainer}>
            <AlertCircle size={16} color={gameUIColors.warning} />
            <Text style={styles.emptyValueText}>
              Variable not defined or empty
            </Text>
          </View>

          {hasExpectedValue && (
            <View style={styles.valueContainer}>
              <Text style={styles.valueLabel}>Expected Value:</Text>
              <View style={styles.expectedValueBox}>
                <Text style={styles.expectedValueContent} selectable>
                  {envVar.expectedValue}
                </Text>
              </View>
            </View>
          )}
        </ListItem.Footer>
      )}
    </ListItem>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 6,
    borderRadius: 6,
  },
  actionButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  expandedContent: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    gap: 12,
  },
  valueContainer: {
    gap: 6,
  },
  valueLabel: {
    color: gameUIColors.secondary,
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  valueContent: {
    color: gameUIColors.primaryLight,
    fontSize: 10,
    fontFamily: "monospace",
    lineHeight: 14,
  },
  expectedValueBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  expectedValueContent: {
    color: gameUIColors.primaryLight,
    fontSize: 10,
    fontFamily: "monospace",
    lineHeight: 14,
  },
  emptyValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: "rgba(245, 158, 11, 0.05)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.1)",
  },
  emptyValueText: {
    color: "#F59E0B",
    fontSize: 10,
    fontStyle: "italic",
  },
  typeHelperText: {
    color: gameUIColors.secondary,
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
  },
});
