/**
 * Standalone Diff Viewer Component
 *
 * A self-contained diff viewer with all logic, themes, and rendering in one file.
 * Easy to copy to any React Native project.
 *
 * Usage:
 * <StandaloneDiffViewer
 *   oldValue={oldObject}
 *   newValue={newObject}
 *   theme="git" // or "default"
 *   options={{ hideLineNumbers: false, ... }}
 * />
 */

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";

// ============================================
// TYPES & INTERFACES
// ============================================

export enum DiffType {
  DEFAULT = "unchanged",
  ADDED = "added",
  REMOVED = "removed",
  MODIFIED = "modified",
}

export interface WordDiff {
  value: string;
  type: DiffType;
}

export interface LineDiffInfo {
  leftLineNumber?: number;
  rightLineNumber?: number;
  type: DiffType;
  leftContent?: string | WordDiff[];
  rightContent?: string | WordDiff[];
  leftRaw?: string;
  rightRaw?: string;
}

export interface DiffComputeOptions {
  compareMethod?: "chars" | "words" | "lines" | "trimmedLines";
  disableWordDiff?: boolean;
  showDiffOnly?: boolean;
  contextLines?: number;
}

export type DiffCompareMethod = "chars" | "words" | "lines" | "trimmedLines";

export interface DiffOptions {
  hideLineNumbers: boolean;
  disableWordDiff: boolean;
  showDiffOnly: boolean;
  compareMethod: DiffCompareMethod;
  contextLines: number;
  lineOffset: number;
}

export interface DiffTheme {
  name: string;
  description: string;

  // Background colors
  background: string;
  panelBackground: string;
  headerBackground: string;

  // Line backgrounds
  addedBackground: string;
  removedBackground: string;
  modifiedBackground: string;
  unchangedBackground: string;
  contextBackground: string;

  // Text colors
  addedText: string;
  removedText: string;
  modifiedText: string;
  unchangedText: string;

  // Word-level highlights
  addedWordHighlight: string;
  removedWordHighlight: string;

  // UI elements
  lineNumberBackground: string;
  lineNumberText: string;
  lineNumberBorder: string;

  // Markers (+/-)
  markerAddedBackground: string;
  markerRemovedBackground: string;
  markerModifiedBackground: string;
  markerText: string;

  // Borders and dividers
  borderColor: string;
  dividerColor: string;

  // Summary bar
  summaryBackground: string;
  summaryAddedText: string;
  summaryRemovedText: string;
  summaryModifiedText: string;

  // Empty state
  emptyStateText: string;

  // Separator (for diff-only mode)
  separatorBackground: string;
  separatorText: string;
}

// ============================================
// THEMES
// ============================================

const gitTheme: DiffTheme = {
  name: "Git Classic",
  description: "Traditional Git diff colors - simple and familiar",

  background: "#FFFFFF",
  panelBackground: "#F8F8F8",
  headerBackground: "#F0F0F0",

  addedBackground: "#E6FFED",
  removedBackground: "#FFEEF0",
  modifiedBackground: "#FFF5DD",
  unchangedBackground: "transparent",
  contextBackground: "#FAFAFA",

  addedText: "#22863A",
  removedText: "#CB2431",
  modifiedText: "#B08800",
  unchangedText: "#24292E",

  addedWordHighlight: "#ACF2BD",
  removedWordHighlight: "#FDB8C0",

  lineNumberBackground: "#F6F8FA",
  lineNumberText: "#959DA5",
  lineNumberBorder: "#E1E4E8",

  markerAddedBackground: "#CDFFD8",
  markerRemovedBackground: "#FFDCE0",
  markerModifiedBackground: "#FFF5B1",
  markerText: "#586069",

  borderColor: "#E1E4E8",
  dividerColor: "#E1E4E8",

  summaryBackground: "#F6F8FA",
  summaryAddedText: "#28A745",
  summaryRemovedText: "#D73A49",
  summaryModifiedText: "#F9C513",

  emptyStateText: "#6A737D",

  separatorBackground: "#F6F8FA",
  separatorText: "#959DA5",
};

const defaultTheme: DiffTheme = {
  name: "Dev Tools Default",
  description: "Clean dark theme with vibrant colors",

  background: "rgba(8, 12, 21, 0.98)",
  panelBackground: "rgba(16, 22, 35, 0.98)",
  headerBackground: "rgba(16, 22, 35, 0.95)",

  addedBackground: "rgba(74, 255, 159, 0.08)",
  removedBackground: "rgba(255, 82, 82, 0.08)",
  modifiedBackground: "rgba(255, 235, 59, 0.06)",
  unchangedBackground: "transparent",
  contextBackground: "rgba(16, 22, 35, 0.4)",

  addedText: "#4AFF9F",
  removedText: "#FF5252",
  modifiedText: "#FFEB3B",
  unchangedText: "#B8BFC9",

  addedWordHighlight: "rgba(74, 255, 159, 0.2)",
  removedWordHighlight: "rgba(255, 82, 82, 0.2)",

  lineNumberBackground: "rgba(0, 184, 230, 0.03)",
  lineNumberText: "#7A8599",
  lineNumberBorder: "rgba(0, 184, 230, 0.2)",

  markerAddedBackground: "rgba(74, 255, 159, 0.12)",
  markerRemovedBackground: "rgba(255, 82, 82, 0.12)",
  markerModifiedBackground: "rgba(255, 235, 59, 0.1)",
  markerText: "#B8BFC9",

  borderColor: "rgba(0, 184, 230, 0.4)",
  dividerColor: "rgba(0, 184, 230, 0.2)",

  summaryBackground: "rgba(16, 22, 35, 0.95)",
  summaryAddedText: "#4AFF9F",
  summaryRemovedText: "#FF5252",
  summaryModifiedText: "#FFEB3B",

  emptyStateText: "#7A8599",

  separatorBackground: "rgba(16, 22, 35, 0.6)",
  separatorText: "rgba(122, 133, 153, 0.5)",
};

const themes = {
  git: gitTheme,
  default: defaultTheme,
};

// ============================================
// DIFF COMPUTATION LOGIC
// ============================================

/**
 * Convert object to formatted JSON lines
 */
function objectToLines(obj: any): string[] {
  if (obj === null || obj === undefined) {
    return [String(obj)];
  }

  try {
    // Pretty print JSON with 2 space indentation
    const jsonStr = JSON.stringify(obj, null, 2);
    return jsonStr.split("\n");
  } catch {
    return [String(obj)];
  }
}

/**
 * Compute diff based on method - for word-level diff within lines
 */
function computeDiffByMethod(
  oldStr: string,
  newStr: string,
  method: "chars" | "words" | "lines" | "trimmedLines"
): { left: WordDiff[]; right: WordDiff[] } {
  let oldParts: string[];
  let newParts: string[];

  switch (method) {
    case "chars":
      // Split into individual characters
      oldParts = oldStr.split("");
      newParts = newStr.split("");
      break;
    case "words":
      // Split by word boundaries, keeping whitespace
      oldParts = oldStr.match(/\S+|\s+/g) || [];
      newParts = newStr.match(/\S+|\s+/g) || [];
      break;
    case "trimmedLines":
      // For trimmedLines, compare without leading/trailing whitespace
      const oldTrimmed = oldStr.trim();
      const newTrimmed = newStr.trim();
      // But still do word-level diff on the trimmed content
      oldParts = oldTrimmed.match(/\S+|\s+/g) || [];
      newParts = newTrimmed.match(/\S+|\s+/g) || [];
      break;
    case "lines":
    default:
      // For lines mode, don't do word diff - just show the whole line
      return {
        left: [{ value: oldStr, type: DiffType.REMOVED }],
        right: [{ value: newStr, type: DiffType.ADDED }],
      };
  }

  // Simple LCS-like algorithm for better diff
  const left: WordDiff[] = [];
  const right: WordDiff[] = [];

  let i = 0,
    j = 0;

  // Find matching parts
  while (i < oldParts.length && j < newParts.length) {
    if (oldParts[i] === newParts[j]) {
      // Parts match
      left.push({ value: oldParts[i], type: DiffType.DEFAULT });
      right.push({ value: newParts[j], type: DiffType.DEFAULT });
      i++;
      j++;
    } else {
      // Look ahead for matches
      let foundMatch = false;

      // Check if we can find newParts[j] in upcoming oldParts
      for (let k = i + 1; k < Math.min(i + 5, oldParts.length); k++) {
        if (oldParts[k] === newParts[j]) {
          // Mark everything from i to k-1 as removed
          for (let m = i; m < k; m++) {
            left.push({ value: oldParts[m], type: DiffType.REMOVED });
          }
          i = k;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        // Check if we can find oldParts[i] in upcoming newParts
        for (let k = j + 1; k < Math.min(j + 5, newParts.length); k++) {
          if (newParts[k] === oldParts[i]) {
            // Mark everything from j to k-1 as added
            for (let m = j; m < k; m++) {
              right.push({ value: newParts[m], type: DiffType.ADDED });
            }
            j = k;
            foundMatch = true;
            break;
          }
        }
      }

      if (!foundMatch) {
        // No match found nearby, mark as changed
        left.push({ value: oldParts[i], type: DiffType.REMOVED });
        right.push({ value: newParts[j], type: DiffType.ADDED });
        i++;
        j++;
      }
    }
  }

  // Handle remaining parts
  while (i < oldParts.length) {
    left.push({ value: oldParts[i], type: DiffType.REMOVED });
    i++;
  }

  while (j < newParts.length) {
    right.push({ value: newParts[j], type: DiffType.ADDED });
    j++;
  }

  return { left, right };
}

/**
 * Apply showDiffOnly filter with context lines
 */
function filterDiffWithContext(
  diffs: LineDiffInfo[],
  contextLines: number
): LineDiffInfo[] {
  if (contextLines < 0) return diffs;

  const result: LineDiffInfo[] = [];
  const changedIndices: number[] = [];

  // Find all changed lines
  diffs.forEach((diff, idx) => {
    if (diff.type !== DiffType.DEFAULT) {
      changedIndices.push(idx);
    }
  });

  // If no changes, return empty
  if (changedIndices.length === 0) {
    return [];
  }

  // Build ranges to include
  const ranges: [number, number][] = [];
  let currentStart = Math.max(0, changedIndices[0] - contextLines);
  let currentEnd = Math.min(diffs.length - 1, changedIndices[0] + contextLines);

  for (let i = 1; i < changedIndices.length; i++) {
    const idx = changedIndices[i];
    const rangeStart = Math.max(0, idx - contextLines);
    const rangeEnd = Math.min(diffs.length - 1, idx + contextLines);

    // If ranges overlap or are adjacent, merge them
    if (rangeStart <= currentEnd + 1) {
      currentEnd = Math.max(currentEnd, rangeEnd);
    } else {
      // Save current range and start a new one
      ranges.push([currentStart, currentEnd]);
      currentStart = rangeStart;
      currentEnd = rangeEnd;
    }
  }

  // Don't forget the last range
  ranges.push([currentStart, currentEnd]);

  // Build result from ranges
  ranges.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      result.push(diffs[i]);
    }
  });

  return result;
}

/**
 * Compare lines based on method
 */
function compareLinesWithMethod(
  line1: string,
  line2: string,
  method: "chars" | "words" | "lines" | "trimmedLines"
): boolean {
  switch (method) {
    case "trimmedLines":
      return line1.trim() === line2.trim();
    case "chars":
    case "words":
    case "lines":
    default:
      return line1 === line2;
  }
}

/**
 * Compute line-by-line diff between two objects
 */
export function computeLineDiff(
  oldValue: any,
  newValue: any,
  options: DiffComputeOptions = {}
): LineDiffInfo[] {
  const {
    compareMethod = "words",
    disableWordDiff = false,
    showDiffOnly = false,
    contextLines = 3,
  } = options;
  const oldLines = objectToLines(oldValue);
  const newLines = objectToLines(newValue);

  const result: LineDiffInfo[] = [];
  let leftLineNum = 1;
  let rightLineNum = 1;

  // Simple line diff algorithm
  let i = 0,
    j = 0;

  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      // Rest are additions
      result.push({
        rightLineNumber: rightLineNum++,
        type: DiffType.ADDED,
        rightContent: newLines[j],
        rightRaw: newLines[j],
      });
      j++;
    } else if (j >= newLines.length) {
      // Rest are removals
      result.push({
        leftLineNumber: leftLineNum++,
        type: DiffType.REMOVED,
        leftContent: oldLines[i],
        leftRaw: oldLines[i],
      });
      i++;
    } else if (
      compareLinesWithMethod(
        oldLines[i],
        newLines[j],
        compareMethod === "trimmedLines" ? "trimmedLines" : "lines"
      )
    ) {
      // Lines match (possibly after trimming if trimmedLines)
      result.push({
        leftLineNumber: leftLineNum++,
        rightLineNumber: rightLineNum++,
        type: DiffType.DEFAULT,
        leftContent: oldLines[i],
        rightContent: newLines[j],
        leftRaw: oldLines[i],
        rightRaw: newLines[j],
      });
      i++;
      j++;
    } else {
      // Lines differ - check if it's a modification or separate add/remove
      const oldTrimmed = oldLines[i].trim();
      const newTrimmed = newLines[j].trim();

      // Simple heuristic: if lines start similarly, treat as modification
      if (
        oldTrimmed &&
        newTrimmed &&
        (oldTrimmed.startsWith(newTrimmed.substring(0, 3)) ||
          newTrimmed.startsWith(oldTrimmed.substring(0, 3)))
      ) {
        // Treat as modification - compute word diff if enabled
        if (!disableWordDiff && compareMethod !== "lines") {
          const wordDiff = computeDiffByMethod(
            oldLines[i],
            newLines[j],
            compareMethod
          );
          result.push({
            leftLineNumber: leftLineNum++,
            rightLineNumber: rightLineNum++,
            type: DiffType.MODIFIED,
            leftContent: wordDiff.left,
            rightContent: wordDiff.right,
            leftRaw: oldLines[i],
            rightRaw: newLines[j],
          });
        } else {
          // No word diff - just mark lines as different
          result.push({
            leftLineNumber: leftLineNum++,
            rightLineNumber: rightLineNum++,
            type: DiffType.MODIFIED,
            leftContent: oldLines[i],
            rightContent: newLines[j],
            leftRaw: oldLines[i],
            rightRaw: newLines[j],
          });
        }
        i++;
        j++;
      } else {
        // Treat as separate remove and add
        result.push({
          leftLineNumber: leftLineNum++,
          type: DiffType.REMOVED,
          leftContent: oldLines[i],
          leftRaw: oldLines[i],
        });
        result.push({
          rightLineNumber: rightLineNum++,
          type: DiffType.ADDED,
          rightContent: newLines[j],
          rightRaw: newLines[j],
        });
        i++;
        j++;
      }
    }
  }

  // Apply showDiffOnly filter if enabled
  if (showDiffOnly) {
    return filterDiffWithContext(result, contextLines);
  }

  return result;
}

// ============================================
// MAIN COMPONENT
// ============================================

interface StandaloneDiffViewerProps {
  oldValue: any;
  newValue: any;
  theme?: "git" | "default";
  options?: Partial<DiffOptions>;
  showOptions?: boolean;
  height?: number;
}

export default function StandaloneDiffViewer({
  oldValue,
  newValue,
  theme: themeName = "default",
  options: initialOptions,
  showOptions = true,
  height = 400,
}: StandaloneDiffViewerProps) {
  const [options, setOptions] = useState<DiffOptions>({
    hideLineNumbers: false,
    disableWordDiff: false,
    showDiffOnly: false,
    compareMethod: "words",
    contextLines: 3,
    lineOffset: 0,
    ...initialOptions,
  });
  const [optionsExpanded, setOptionsExpanded] = useState(false);

  const theme = themes[themeName];

  // Compute line-by-line diff with options
  const diffComputeOptions: DiffComputeOptions = {
    compareMethod: options.compareMethod,
    disableWordDiff: options.disableWordDiff,
    showDiffOnly: options.showDiffOnly,
    contextLines: options.contextLines,
  };

  const lineDiffs = computeLineDiff(oldValue, newValue, diffComputeOptions);

  // Create dynamic styles based on theme
  const dynamicStyles = createDynamicStyles(theme, height);

  // Render word diff content
  const renderWordDiff = (wordDiffs: WordDiff[]) => {
    return wordDiffs.map((word, idx) => {
      let backgroundColor = "transparent";
      if (word.type === DiffType.ADDED) {
        backgroundColor = theme.addedWordHighlight;
      } else if (word.type === DiffType.REMOVED) {
        backgroundColor = theme.removedWordHighlight;
      }

      return (
        <Text key={idx} style={[dynamicStyles.wordDiff, { backgroundColor }]}>
          {word.value}
        </Text>
      );
    });
  };

  // Get colors for diff type
  const getDiffColors = (type: DiffType, isModified: boolean = false) => {
    if (isModified) {
      return {
        background: theme.modifiedBackground,
        text: theme.modifiedText,
        markerBg: theme.markerModifiedBackground,
      };
    }

    switch (type) {
      case DiffType.ADDED:
        return {
          background: theme.addedBackground,
          text: theme.addedText,
          markerBg: theme.markerAddedBackground,
        };
      case DiffType.REMOVED:
        return {
          background: theme.removedBackground,
          text: theme.removedText,
          markerBg: theme.markerRemovedBackground,
        };
      case DiffType.DEFAULT:
        return {
          background: theme.unchangedBackground,
          text: theme.unchangedText,
          markerBg: "transparent",
        };
      default:
        return {
          background: theme.unchangedBackground,
          text: theme.unchangedText,
          markerBg: "transparent",
        };
    }
  };

  // Render a single line side (left or right)
  const renderLineSide = (
    lineNumber: number | undefined,
    content: string | WordDiff[] | undefined,
    type: DiffType,
    marker: string,
    isEmpty: boolean = false
  ) => {
    if (isEmpty) {
      return (
        <>
          {!options.hideLineNumbers && (
            <View style={[dynamicStyles.gutter, dynamicStyles.emptyGutter]}>
              <Text style={dynamicStyles.lineNumber}> </Text>
            </View>
          )}
          <View style={[dynamicStyles.marker, dynamicStyles.emptyMarker]}>
            <Text style={dynamicStyles.markerText}> </Text>
          </View>
          <View style={[dynamicStyles.contentCell, dynamicStyles.emptyContent]}>
            <Text style={dynamicStyles.content}> </Text>
          </View>
        </>
      );
    }

    const colors = getDiffColors(type);

    return (
      <>
        {/* Line number gutter */}
        {!options.hideLineNumbers && (
          <View
            style={[
              dynamicStyles.gutter,
              { backgroundColor: theme.lineNumberBackground },
            ]}
          >
            <Text style={dynamicStyles.lineNumber}>{lineNumber || " "}</Text>
          </View>
        )}

        {/* Change marker */}
        <View
          style={[dynamicStyles.marker, { backgroundColor: colors.markerBg }]}
        >
          <Text style={[dynamicStyles.markerText, { color: theme.markerText }]}>
            {marker}
          </Text>
        </View>

        {/* Content */}
        <View
          style={[
            dynamicStyles.contentCell,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[dynamicStyles.content, { color: colors.text }]}>
            {Array.isArray(content) ? renderWordDiff(content) : content || " "}
          </Text>
        </View>
      </>
    );
  };

  // Check if we should show a separator (gap in line numbers)
  const shouldShowSeparator = (idx: number, diffs: LineDiffInfo[]) => {
    if (!options.showDiffOnly || idx === 0) return false;

    const prevDiff = diffs[idx - 1];
    const currDiff = diffs[idx];

    // Check for gap in line numbers
    const leftGap =
      currDiff.leftLineNumber &&
      prevDiff.leftLineNumber &&
      currDiff.leftLineNumber - prevDiff.leftLineNumber > 1;
    const rightGap =
      currDiff.rightLineNumber &&
      prevDiff.rightLineNumber &&
      currDiff.rightLineNumber - prevDiff.rightLineNumber > 1;

    return leftGap || rightGap;
  };

  // Render a complete row with both left and right sides
  const renderDiffRow = (
    diff: LineDiffInfo,
    idx: number,
    diffs: LineDiffInfo[]
  ) => {
    const isRemoved = diff.type === DiffType.REMOVED;
    const isAdded = diff.type === DiffType.ADDED;
    const isModified = diff.type === DiffType.MODIFIED;
    const isDefault = diff.type === DiffType.DEFAULT;

    return (
      <React.Fragment key={idx}>
        {shouldShowSeparator(idx, diffs) && (
          <View style={dynamicStyles.separator}>
            <Text style={dynamicStyles.separatorText}>• • •</Text>
          </View>
        )}
        <View style={dynamicStyles.row}>
          {/* Left side (PREV) */}
          <View style={dynamicStyles.leftSide}>
            {isRemoved || isModified || isDefault
              ? renderLineSide(
                  diff.leftLineNumber,
                  diff.leftContent,
                  isModified ? DiffType.REMOVED : diff.type,
                  isRemoved || isModified ? "-" : " "
                )
              : renderLineSide(
                  undefined,
                  undefined,
                  DiffType.DEFAULT,
                  " ",
                  true
                )}
          </View>

          {/* Center divider */}
          <View style={dynamicStyles.centerDivider} />

          {/* Right side (CUR) */}
          <View style={dynamicStyles.rightSide}>
            {isAdded || isModified || isDefault
              ? renderLineSide(
                  diff.rightLineNumber,
                  diff.rightContent,
                  isModified ? DiffType.ADDED : diff.type,
                  isAdded || isModified ? "+" : " "
                )
              : renderLineSide(
                  undefined,
                  undefined,
                  DiffType.DEFAULT,
                  " ",
                  true
                )}
          </View>
        </View>
      </React.Fragment>
    );
  };

  const updateOption = <K extends keyof DiffOptions>(
    key: K,
    value: DiffOptions[K]
  ) => {
    setOptions({ ...options, [key]: value });
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Options Panel */}
      {showOptions && (
        <View style={dynamicStyles.optionsContainer}>
          <TouchableOpacity
            style={dynamicStyles.optionsToggle}
            onPress={() => setOptionsExpanded(!optionsExpanded)}
            activeOpacity={0.7}
          >
            <Text style={dynamicStyles.optionsToggleText}>
              Options {optionsExpanded ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>

          {optionsExpanded && (
            <View style={dynamicStyles.optionsContent}>
              <View style={dynamicStyles.optionRow}>
                <Text style={dynamicStyles.optionLabel}>Line Numbers</Text>
                <Switch
                  value={!options.hideLineNumbers}
                  onValueChange={(value) =>
                    updateOption("hideLineNumbers", !value)
                  }
                />
              </View>

              <View style={dynamicStyles.optionRow}>
                <Text style={dynamicStyles.optionLabel}>Word Diff</Text>
                <Switch
                  value={!options.disableWordDiff}
                  onValueChange={(value) =>
                    updateOption("disableWordDiff", !value)
                  }
                />
              </View>

              <View style={dynamicStyles.optionRow}>
                <Text style={dynamicStyles.optionLabel}>Diff Only</Text>
                <Switch
                  value={options.showDiffOnly}
                  onValueChange={(value) => updateOption("showDiffOnly", value)}
                />
              </View>

              <View style={dynamicStyles.compareMethodContainer}>
                <Text style={dynamicStyles.optionLabel}>Compare Method:</Text>
                <View style={dynamicStyles.compareMethodButtons}>
                  {(["chars", "words", "lines", "trimmedLines"] as const).map(
                    (method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          dynamicStyles.methodButton,
                          options.compareMethod === method &&
                            dynamicStyles.methodButtonActive,
                        ]}
                        onPress={() => updateOption("compareMethod", method)}
                      >
                        <Text
                          style={[
                            dynamicStyles.methodButtonText,
                            options.compareMethod === method &&
                              dynamicStyles.methodButtonTextActive,
                          ]}
                        >
                          {method}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              {options.showDiffOnly && (
                <View style={dynamicStyles.contextContainer}>
                  <Text style={dynamicStyles.optionLabel}>Context Lines:</Text>
                  <View style={dynamicStyles.contextButtons}>
                    {[0, 1, 3, 5, 10].map((lines) => (
                      <TouchableOpacity
                        key={lines}
                        style={[
                          dynamicStyles.contextButton,
                          options.contextLines === lines &&
                            dynamicStyles.contextButtonActive,
                        ]}
                        onPress={() => updateOption("contextLines", lines)}
                      >
                        <Text
                          style={[
                            dynamicStyles.contextButtonText,
                            options.contextLines === lines &&
                              dynamicStyles.contextButtonTextActive,
                          ]}
                        >
                          {lines}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerLeft}>
          <Text style={dynamicStyles.headerTitle}>PREVIOUS</Text>
        </View>
        <View style={dynamicStyles.divider} />
        <View style={dynamicStyles.headerRight}>
          <Text style={dynamicStyles.headerTitle}>CURRENT</Text>
        </View>
      </View>

      {/* Single ScrollView for both sides */}
      <ScrollView
        style={dynamicStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        {lineDiffs.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Text style={dynamicStyles.emptyText}>
              {options.showDiffOnly
                ? "No differences found"
                : "No content to display"}
            </Text>
          </View>
        ) : (
          lineDiffs.map((diff, idx) => renderDiffRow(diff, idx, lineDiffs))
        )}
      </ScrollView>

      {/* Summary bar */}
      <View style={dynamicStyles.summaryBar}>
        <View style={dynamicStyles.summaryItem}>
          <Text
            style={[
              dynamicStyles.summaryText,
              { color: theme.summaryAddedText },
            ]}
          >
            +{lineDiffs.filter((d) => d.type === DiffType.ADDED).length}
          </Text>
        </View>
        <View style={dynamicStyles.summaryItem}>
          <Text
            style={[
              dynamicStyles.summaryText,
              { color: theme.summaryRemovedText },
            ]}
          >
            -{lineDiffs.filter((d) => d.type === DiffType.REMOVED).length}
          </Text>
        </View>
        <View style={dynamicStyles.summaryItem}>
          <Text
            style={[
              dynamicStyles.summaryText,
              { color: theme.summaryModifiedText },
            ]}
          >
            ~{lineDiffs.filter((d) => d.type === DiffType.MODIFIED).length}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

function createDynamicStyles(theme: DiffTheme, height: number) {
  return StyleSheet.create({
    container: {
      height,
      backgroundColor: theme.background,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    optionsContainer: {
      backgroundColor: theme.panelBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    optionsToggle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    optionsToggleText: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.unchangedText,
      fontFamily: "monospace",
    },
    optionsContent: {
      padding: 12,
      gap: 12,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionLabel: {
      fontSize: 10,
      color: theme.unchangedText,
      fontFamily: "monospace",
    },
    compareMethodContainer: {
      gap: 8,
    },
    compareMethodButtons: {
      flexDirection: "row",
      gap: 6,
      flexWrap: "wrap",
    },
    methodButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.contextBackground,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    methodButtonActive: {
      backgroundColor: theme.modifiedBackground,
      borderColor: theme.modifiedText,
    },
    methodButtonText: {
      fontSize: 9,
      color: theme.unchangedText,
      fontFamily: "monospace",
    },
    methodButtonTextActive: {
      color: theme.modifiedText,
    },
    contextContainer: {
      gap: 8,
    },
    contextButtons: {
      flexDirection: "row",
      gap: 6,
    },
    contextButton: {
      width: 28,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.contextBackground,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    contextButtonActive: {
      backgroundColor: theme.modifiedBackground,
      borderColor: theme.modifiedText,
    },
    contextButtonText: {
      fontSize: 9,
      color: theme.unchangedText,
      fontFamily: "monospace",
    },
    contextButtonTextActive: {
      color: theme.modifiedText,
    },
    header: {
      flexDirection: "row",
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    headerLeft: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    headerRight: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    headerTitle: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.unchangedText,
      fontFamily: "monospace",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    divider: {
      width: 1,
      backgroundColor: theme.dividerColor,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 10,
    },
    row: {
      flexDirection: "row",
      minHeight: 20,
    },
    leftSide: {
      flex: 1,
      flexDirection: "row",
    },
    rightSide: {
      flex: 1,
      flexDirection: "row",
    },
    centerDivider: {
      width: 1,
      backgroundColor: theme.dividerColor,
    },
    gutter: {
      width: 35,
      paddingHorizontal: 4,
      justifyContent: "center",
      alignItems: "flex-end",
      backgroundColor: theme.lineNumberBackground,
      borderRightWidth: 1,
      borderRightColor: theme.lineNumberBorder,
    },
    emptyGutter: {
      backgroundColor: theme.contextBackground,
    },
    lineNumber: {
      fontSize: 9,
      fontFamily: "monospace",
      color: theme.lineNumberText,
    },
    marker: {
      width: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyMarker: {
      backgroundColor: theme.contextBackground,
    },
    markerText: {
      fontSize: 10,
      fontFamily: "monospace",
      fontWeight: "600",
    },
    contentCell: {
      flex: 1,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    emptyContent: {
      backgroundColor: theme.contextBackground,
    },
    content: {
      fontSize: 10,
      fontFamily: "monospace",
      lineHeight: 16,
    },
    wordDiff: {
      fontSize: 10,
      fontFamily: "monospace",
    },
    summaryBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      paddingVertical: 6,
      backgroundColor: theme.summaryBackground,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    summaryItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    summaryText: {
      fontSize: 10,
      fontFamily: "monospace",
      fontWeight: "700",
    },
    separator: {
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.separatorBackground,
    },
    separatorText: {
      fontSize: 8,
      color: theme.separatorText,
      fontFamily: "monospace",
      letterSpacing: 2,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 11,
      color: theme.emptyStateText,
      fontStyle: "italic",
      fontFamily: "monospace",
    },
  });
}
