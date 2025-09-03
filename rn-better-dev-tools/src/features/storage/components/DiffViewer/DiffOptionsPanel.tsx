import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  Settings,
  Eye,
  EyeOff,
  Hash,
  FileText,
  Filter,
  Layers,
} from "rn-better-dev-tools/icons";

export type DiffCompareMethod = "chars" | "words" | "lines" | "trimmedLines";

export interface DiffOptions {
  hideLineNumbers: boolean;
  disableWordDiff: boolean;
  showDiffOnly: boolean;
  compareMethod: DiffCompareMethod;
  contextLines: number;
  lineOffset: number;
}

interface DiffOptionsPanelProps {
  options: DiffOptions;
  onOptionsChange: (options: DiffOptions) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const COMPARE_METHODS = [
  {
    id: "chars" as DiffCompareMethod,
    label: "Chars",
    description:
      "Shows every single character change. Best for spotting typos or small edits in strings.",
  },
  {
    id: "words" as DiffCompareMethod,
    label: "Words",
    description:
      "Highlights changed words while preserving context. Default mode, ideal for most text changes.",
  },
  {
    id: "lines" as DiffCompareMethod,
    label: "Lines",
    description:
      "Shows entire line as changed without word-level detail. Good for completely rewritten lines.",
  },
  {
    id: "trimmedLines" as DiffCompareMethod,
    label: "Trim",
    description:
      "Ignores leading/trailing spaces when comparing. Useful when indentation changes.",
  },
];

const CONTEXT_OPTIONS = [0, 1, 3, 5, 10];

export function DiffOptionsPanel({
  options,
  onOptionsChange,
  isExpanded,
  onToggleExpanded,
}: DiffOptionsPanelProps) {
  const updateOption = <K extends keyof DiffOptions>(
    key: K,
    value: DiffOptions[K],
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  // Check if any non-default options are active
  const hasActiveFilters =
    options.hideLineNumbers ||
    options.disableWordDiff ||
    options.showDiffOnly ||
    options.compareMethod !== "words";

  return (
    <View style={styles.container}>
      {/* Options Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggleExpanded}
        activeOpacity={0.7}
      >
        <Settings size={12} color={gameUIColors.info} />
        <Text style={styles.toggleText}>Options</Text>
        {hasActiveFilters && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeIndicatorText}>
              {[
                options.hideLineNumbers && "No#",
                options.disableWordDiff && "NoWord",
                options.showDiffOnly && `Diff${options.contextLines}`,
                options.compareMethod !== "words" && options.compareMethod,
              ]
                .filter(Boolean)
                .join(" ")}
            </Text>
          </View>
        )}
        <Text style={styles.toggleIndicator}>{isExpanded ? "▼" : "▶"}</Text>
      </TouchableOpacity>

      {/* Expanded Options Panel */}
      {isExpanded && (
        <View style={styles.optionsContent}>
          {/* Toggle Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DISPLAY</Text>

            <View style={styles.optionContainer}>
              <View style={styles.option}>
                <View style={styles.optionLeft}>
                  <Hash size={11} color={gameUIColors.secondary} />
                  <Text style={styles.optionLabel}>Line Numbers</Text>
                </View>
                <Switch
                  value={!options.hideLineNumbers}
                  onValueChange={(value) =>
                    updateOption("hideLineNumbers", !value)
                  }
                  trackColor={{
                    false: gameUIColors.border,
                    true: gameUIColors.success + "60",
                  }}
                  thumbColor={
                    !options.hideLineNumbers
                      ? gameUIColors.success
                      : gameUIColors.muted
                  }
                  style={styles.switch}
                />
              </View>
              <Text style={styles.optionDescription}>
                {!options.hideLineNumbers
                  ? "Shows line numbers for easier navigation and reference"
                  : "Line numbers hidden for cleaner view"}
              </Text>
            </View>

            <View style={styles.optionContainer}>
              <View style={styles.option}>
                <View style={styles.optionLeft}>
                  <FileText size={11} color={gameUIColors.secondary} />
                  <Text style={styles.optionLabel}>Word Diff</Text>
                </View>
                <Switch
                  value={!options.disableWordDiff}
                  onValueChange={(value) =>
                    updateOption("disableWordDiff", !value)
                  }
                  trackColor={{
                    false: gameUIColors.border,
                    true: gameUIColors.success + "60",
                  }}
                  thumbColor={
                    !options.disableWordDiff
                      ? gameUIColors.success
                      : gameUIColors.muted
                  }
                  style={styles.switch}
                />
              </View>
              <Text style={styles.optionDescription}>
                {!options.disableWordDiff
                  ? "Highlights specific words/characters that changed within modified lines"
                  : "Shows entire lines as changed without detailed highlighting"}
              </Text>
            </View>

            <View style={styles.optionContainer}>
              <View style={styles.option}>
                <View style={styles.optionLeft}>
                  <Filter size={11} color={gameUIColors.secondary} />
                  <Text style={styles.optionLabel}>Diff Only</Text>
                </View>
                <Switch
                  value={options.showDiffOnly}
                  onValueChange={(value) => updateOption("showDiffOnly", value)}
                  trackColor={{
                    false: gameUIColors.border,
                    true: gameUIColors.success + "60",
                  }}
                  thumbColor={
                    options.showDiffOnly
                      ? gameUIColors.success
                      : gameUIColors.muted
                  }
                  style={styles.switch}
                />
              </View>
              <Text style={styles.optionDescription}>
                {options.showDiffOnly
                  ? `Shows only changed lines with ${options.contextLines} lines of context around them`
                  : "Shows complete content with all lines visible"}
              </Text>
            </View>
          </View>

          {/* Compare Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPARE METHOD</Text>
            <View style={styles.methodButtons}>
              {COMPARE_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodButton,
                    options.compareMethod === method.id &&
                      styles.methodButtonActive,
                  ]}
                  onPress={() => updateOption("compareMethod", method.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.methodButtonText,
                      options.compareMethod === method.id &&
                        styles.methodButtonTextActive,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.methodDescription}>
              {
                COMPARE_METHODS.find((m) => m.id === options.compareMethod)
                  ?.description
              }
            </Text>
          </View>

          {/* Context Lines */}
          {options.showDiffOnly && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CONTEXT LINES</Text>
              <View style={styles.contextButtons}>
                {CONTEXT_OPTIONS.map((lines) => (
                  <TouchableOpacity
                    key={lines}
                    style={[
                      styles.contextButton,
                      options.contextLines === lines &&
                        styles.contextButtonActive,
                    ]}
                    onPress={() => updateOption("contextLines", lines)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.contextButtonText,
                        options.contextLines === lines &&
                          styles.contextButtonTextActive,
                      ]}
                    >
                      {lines}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.contextDescription}>
                {options.contextLines === 0
                  ? "Shows only the exact lines that changed with no surrounding context"
                  : `Shows ${options.contextLines} unchanged line${options.contextLines === 1 ? "" : "s"} before and after each change for context`}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameUIColors.panel + "30",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    gap: 6,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: "600",
    color: gameUIColors.info,
    fontFamily: "monospace",
    flex: 1,
  },
  toggleIndicator: {
    fontSize: 8,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  optionsContent: {
    marginTop: 8,
    backgroundColor: gameUIColors.background + "40",
    borderRadius: 6,
    padding: 12,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "700",
    color: gameUIColors.info,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  optionContainer: {
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionLabel: {
    fontSize: 11,
    color: gameUIColors.primaryLight,
    fontFamily: "monospace",
  },
  optionDescription: {
    fontSize: 9,
    color: gameUIColors.muted + "CC",
    fontFamily: "monospace",
    marginTop: 4,
    marginLeft: 19,
    lineHeight: 12,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  methodButtons: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  methodButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: gameUIColors.background + "60",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
  },
  methodButtonActive: {
    backgroundColor: gameUIColors.info + "20",
    borderColor: gameUIColors.info + "40",
  },
  methodButtonText: {
    fontSize: 9,
    fontFamily: "monospace",
    color: gameUIColors.muted,
    fontWeight: "600",
  },
  methodButtonTextActive: {
    color: gameUIColors.info,
  },
  methodDescription: {
    fontSize: 9,
    color: gameUIColors.muted + "CC",
    fontFamily: "monospace",
    marginTop: 8,
    lineHeight: 12,
  },
  contextButtons: {
    flexDirection: "row",
    gap: 6,
  },
  contextButton: {
    width: 32,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: gameUIColors.background + "60",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.border + "20",
  },
  contextButtonActive: {
    backgroundColor: gameUIColors.warning + "20",
    borderColor: gameUIColors.warning + "40",
  },
  contextButtonText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: gameUIColors.muted,
    fontWeight: "600",
  },
  contextButtonTextActive: {
    color: gameUIColors.warning,
  },
  contextDescription: {
    fontSize: 9,
    color: gameUIColors.muted + "CC",
    fontFamily: "monospace",
    marginTop: 8,
    lineHeight: 12,
  },
  activeIndicator: {
    backgroundColor: gameUIColors.warning + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: "auto",
    marginRight: 4,
  },
  activeIndicatorText: {
    fontSize: 8,
    fontFamily: "monospace",
    color: gameUIColors.warning,
    fontWeight: "600",
  },
});
