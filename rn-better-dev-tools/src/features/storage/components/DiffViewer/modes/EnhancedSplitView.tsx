import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  computeLineDiff,
  DiffType,
  LineDiffInfo,
  WordDiff,
  getDiffBackgroundColor,
  getDiffTextColor,
  getWordHighlightColor,
  DiffComputeOptions,
} from "../../../utils/lineDiff";
import { DiffOptions } from "../DiffOptionsPanel";

const { width: screenWidth } = Dimensions.get("window");

interface EnhancedSplitViewProps {
  oldValue: any;
  newValue: any;
  differences: any[]; // From objectDiff, not used in this view
  debugMode?: boolean;
  options?: DiffOptions;
}

export function EnhancedSplitView({
  oldValue,
  newValue,
  debugMode,
  options = {
    hideLineNumbers: false,
    disableWordDiff: false,
    showDiffOnly: false,
    compareMethod: 'words',
    contextLines: 3,
    lineOffset: 0,
  }
}: EnhancedSplitViewProps) {
  // Compute line-by-line diff with options
  const diffComputeOptions: DiffComputeOptions = {
    compareMethod: options.compareMethod,
    disableWordDiff: options.disableWordDiff,
    showDiffOnly: options.showDiffOnly,
    contextLines: options.contextLines,
  };
  
  const lineDiffs = computeLineDiff(oldValue, newValue, diffComputeOptions);

  // Render word diff content
  const renderWordDiff = (wordDiffs: WordDiff[]) => {
    return wordDiffs.map((word, idx) => (
      <Text
        key={idx}
        style={[
          styles.wordDiff,
          word.type !== DiffType.DEFAULT && {
            backgroundColor: getWordHighlightColor(word.type, true),
          },
        ]}
      >
        {word.value}
      </Text>
    ));
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
            <View style={[styles.gutter, styles.emptyGutter]}>
              <Text style={styles.lineNumber}> </Text>
            </View>
          )}
          <View style={[styles.marker, styles.emptyMarker]}>
            <Text style={styles.markerText}> </Text>
          </View>
          <View style={[styles.contentCell, styles.emptyContent]}>
            <Text style={styles.content}> </Text>
          </View>
        </>
      );
    }

    const backgroundColor = getDiffBackgroundColor(type, true);
    const textColor = getDiffTextColor(type, true);

    return (
      <>
        {/* Line number gutter */}
        {!options.hideLineNumbers && (
          <View
            style={[styles.gutter, { backgroundColor: backgroundColor + "40" }]}
          >
            <Text style={[styles.lineNumber, { color: gameUIColors.muted }]}>
              {lineNumber || " "}
            </Text>
          </View>
        )}

        {/* Change marker */}
        <View style={[styles.marker, { backgroundColor }]}>
          <Text style={[styles.markerText, { color: textColor }]}>
            {marker}
          </Text>
        </View>

        {/* Content */}
        <View style={[styles.contentCell, { backgroundColor }]}>
          <Text style={[styles.content, { color: textColor }]}>
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
    const leftGap = currDiff.leftLineNumber && prevDiff.leftLineNumber && 
                    (currDiff.leftLineNumber - prevDiff.leftLineNumber > 1);
    const rightGap = currDiff.rightLineNumber && prevDiff.rightLineNumber && 
                     (currDiff.rightLineNumber - prevDiff.rightLineNumber > 1);
    
    return leftGap || rightGap;
  };

  // Render a complete row with both left and right sides
  const renderDiffRow = (diff: LineDiffInfo, idx: number, diffs: LineDiffInfo[]) => {
    const isRemoved = diff.type === DiffType.REMOVED;
    const isAdded = diff.type === DiffType.ADDED;
    const isModified = diff.type === DiffType.MODIFIED;
    const isDefault = diff.type === DiffType.DEFAULT;

    return (
      <React.Fragment key={idx}>
        {shouldShowSeparator(idx, diffs) && (
          <View style={styles.separator}>
            <Text style={styles.separatorText}>• • •</Text>
          </View>
        )}
        <View style={styles.row}>
          {/* Left side (PREV) */}
          <View style={styles.leftSide}>
            {isRemoved || isModified || isDefault
              ? renderLineSide(
                  diff.leftLineNumber,
                  diff.leftContent,
                  isModified ? DiffType.REMOVED : diff.type,
                  isRemoved || isModified ? "-" : " "
                )
              : renderLineSide(undefined, undefined, DiffType.DEFAULT, " ", true)}
          </View>

          {/* Center divider */}
          <View style={styles.centerDivider} />

          {/* Right side (CUR) */}
          <View style={styles.rightSide}>
            {isAdded || isModified || isDefault
              ? renderLineSide(
                  diff.rightLineNumber,
                  diff.rightContent,
                  isModified ? DiffType.ADDED : diff.type,
                  isAdded || isModified ? "+" : " "
                )
              : renderLineSide(undefined, undefined, DiffType.DEFAULT, " ", true)}
          </View>
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={[styles.container, debugMode && styles.debugSplit]}>
      {debugMode && <Text style={styles.debugLabel}>ENHANCED SPLIT</Text>}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>PREV</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>CUR</Text>
        </View>
      </View>

      {/* Single ScrollView for both sides */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lineDiffs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {options.showDiffOnly ? 'No differences found' : 'No content to display'}
            </Text>
          </View>
        ) : (
          lineDiffs.map((diff, idx) => renderDiffRow(diff, idx, lineDiffs))
        )}
      </ScrollView>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryText, { color: gameUIColors.success }]}>
            +{lineDiffs.filter((d) => d.type === DiffType.ADDED).length}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryText, { color: gameUIColors.error }]}>
            -{lineDiffs.filter((d) => d.type === DiffType.REMOVED).length}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryText, { color: gameUIColors.warning }]}>
            ~{lineDiffs.filter((d) => d.type === DiffType.MODIFIED).length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: gameUIColors.background + "95",
  },
  debugSplit: {
    borderWidth: 2,
    borderColor: "cyan",
    borderStyle: "dashed",
  },
  debugLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "cyan",
    color: "black",
    fontSize: 10,
    padding: 2,
    zIndex: 999,
  },
  header: {
    flexDirection: "row",
    backgroundColor: gameUIColors.panel + "40",
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "30",
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
    color: gameUIColors.info,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    backgroundColor: gameUIColors.border + "30",
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
    backgroundColor: gameUIColors.border + "40",
  },
  gutter: {
    width: 35,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: gameUIColors.panel + "20",
    borderRightWidth: 1,
    borderRightColor: gameUIColors.border + "20",
  },
  emptyGutter: {
    backgroundColor: gameUIColors.background + "40",
  },
  lineNumber: {
    fontSize: 9,
    fontFamily: "monospace",
    color: gameUIColors.muted,
  },
  marker: {
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMarker: {
    backgroundColor: gameUIColors.background + "40",
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
    backgroundColor: gameUIColors.background + "40",
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
    backgroundColor: gameUIColors.panel + "20",
    borderTopWidth: 1,
    borderTopColor: gameUIColors.border + "30",
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
    backgroundColor: gameUIColors.background + "60",
  },
  separatorText: {
    fontSize: 8,
    color: gameUIColors.muted + "60",
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
    color: gameUIColors.muted,
    fontStyle: "italic",
    fontFamily: "monospace",
  },
});