/**
 * VS Code Diff Viewer Component
 * A complete implementation of VS Code's diff viewer for React Native
 */

import React, { useEffect, useMemo, useCallback, useState, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useDiffViewModel } from './DiffViewModel';
import { DiffDecorationComputer, createVSCodeDiffStyles } from './DiffDecorations';
import { VSCodeDarkModernTheme, VSCodeDiffTheme, VSCodeLightModernTheme } from './VSCodeTheme';
import { DetailedLineRangeMapping } from './diffComputer';
import { CharacterChange } from './characterDiffComputer';

const { width: screenWidth } = Dimensions.get('window');

export interface VSCodeDiffViewerProps {
  oldValue: any;
  newValue: any;
  theme?: 'dark' | 'light' | VSCodeDiffTheme;
  height?: number;
  showLineNumbers?: boolean;
  showInlineDiff?: boolean;
  detectMoves?: boolean;
  wordLevel?: boolean;
  ignoreWhitespace?: boolean;
  collapsedRegions?: boolean;
  onLineClick?: (lineNumber: number, side: 'original' | 'modified') => void;
}

/**
 * Main VS Code Diff Viewer Component
 */
export const VSCodeDiffViewer: React.FC<VSCodeDiffViewerProps> = memo(({
  oldValue,
  newValue,
  theme = 'dark',
  height = 400,
  showLineNumbers = true,
  showInlineDiff = true,
  detectMoves = true,
  wordLevel = true,
  ignoreWhitespace = false,
  collapsedRegions = true,
  onLineClick
}) => {
  // Get theme object
  const themeObj = useMemo(() => {
    if (typeof theme === 'string') {
      return theme === 'dark' ? VSCodeDarkModernTheme : VSCodeLightModernTheme;
    }
    return theme;
  }, [theme]);
  
  // Create styles
  const styles = useMemo(() => createVSCodeDiffStyles(themeObj), [themeObj]);
  
  // Convert values to strings
  const originalText = useMemo(() => {
    if (typeof oldValue === 'string') return oldValue;
    return JSON.stringify(oldValue, null, 2);
  }, [oldValue]);
  
  const modifiedText = useMemo(() => {
    if (typeof newValue === 'string') return newValue;
    return JSON.stringify(newValue, null, 2);
  }, [newValue]);
  
  // Initialize view model
  const viewModel = useDiffViewModel(originalText, modifiedText, {
    detectMoves,
    wordLevel,
    ignoreWhitespace,
    timeout: 5000
  });
  
  // Create decoration computer
  const decorationComputer = useMemo(
    () => new DiffDecorationComputer(themeObj),
    [themeObj]
  );
  
  // Compute decorations
  const decorations = useMemo(() => {
    const charChanges = new Map<number, CharacterChange[]>();
    
    // Collect all character changes
    for (let i = 0; i < viewModel.modifiedLines.length; i++) {
      const changes = viewModel.getCharChanges(i);
      if (changes) {
        charChanges.set(i, changes);
      }
    }
    
    return decorationComputer.computeDecorations(
      viewModel.mappings,
      viewModel.movedBlocks,
      charChanges
    );
  }, [viewModel.mappings, viewModel.movedBlocks, decorationComputer]);
  
  // Render a diff line
  const renderDiffLine = useCallback((
    mapping: DetailedLineRangeMapping,
    index: number
  ) => {
    const isAddition = mapping.original.isEmpty && !mapping.modified.isEmpty;
    const isDeletion = !mapping.original.isEmpty && mapping.modified.isEmpty;
    const isModification = !mapping.original.isEmpty && !mapping.modified.isEmpty;
    
    // For deletions, show in original side
    if (isDeletion) {
      return (
        <View key={`line-${index}`} style={localStyles.diffRow}>
          {/* Original side - shows deletion */}
          <View style={[localStyles.diffSide, styles.lineRemoved]}>
            {showLineNumbers && (
              <View style={[styles.gutter, styles.gutterRemoved]}>
                <Text style={styles.lineNumber}>
                  {mapping.original.start + 1}-{mapping.original.end}
                </Text>
              </View>
            )}
            <View style={localStyles.content}>
              {viewModel.originalLines
                .slice(mapping.original.start, mapping.original.end)
                .map((line, lineIdx) => (
                  <View key={lineIdx} style={localStyles.lineContent}>
                    <Text style={[styles.text, styles.removedText]}>
                      {line || ' '}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          
          {/* Modified side - empty */}
          <View style={[localStyles.diffSide, localStyles.emptySide]}>
            {showLineNumbers && (
              <View style={styles.gutter}>
                <Text style={styles.lineNumber}> </Text>
              </View>
            )}
            <View style={localStyles.content} />
          </View>
        </View>
      );
    }
    
    // For additions, show in modified side
    if (isAddition) {
      return (
        <View key={`line-${index}`} style={localStyles.diffRow}>
          {/* Original side - empty */}
          <View style={[localStyles.diffSide, localStyles.emptySide]}>
            {showLineNumbers && (
              <View style={styles.gutter}>
                <Text style={styles.lineNumber}> </Text>
              </View>
            )}
            <View style={localStyles.content} />
          </View>
          
          {/* Modified side - shows addition */}
          <View style={[localStyles.diffSide, styles.lineAdded]}>
            {showLineNumbers && (
              <View style={[styles.gutter, styles.gutterAdded]}>
                <Text style={styles.lineNumber}>
                  {mapping.modified.start + 1}-{mapping.modified.end}
                </Text>
              </View>
            )}
            <View style={localStyles.content}>
              {viewModel.modifiedLines
                .slice(mapping.modified.start, mapping.modified.end)
                .map((line, lineIdx) => (
                  <View key={lineIdx} style={localStyles.lineContent}>
                    <Text style={[styles.text, styles.addedText]}>
                      {line || ' '}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      );
    }
    
    // For modifications, show both sides
    if (isModification) {
      const maxLines = Math.max(
        mapping.original.lineCount,
        mapping.modified.lineCount
      );
      
      return (
        <View key={`line-${index}`} style={localStyles.diffRow}>
          {/* Original side */}
          <View style={[localStyles.diffSide, styles.lineModified]}>
            {showLineNumbers && (
              <View style={[styles.gutter, styles.gutterModified]}>
                <Text style={styles.lineNumber}>
                  {mapping.original.start + 1}-{mapping.original.end}
                </Text>
              </View>
            )}
            <View style={localStyles.content}>
              {Array.from({ length: maxLines }).map((_, lineIdx) => {
                const lineNum = mapping.original.start + lineIdx;
                const line = viewModel.originalLines[lineNum];
                
                if (lineIdx < mapping.original.lineCount) {
                  return (
                    <View key={lineIdx} style={localStyles.lineContent}>
                      <Text style={[styles.text, styles.modifiedText]}>
                        {line || ' '}
                      </Text>
                    </View>
                  );
                }
                return <View key={lineIdx} style={localStyles.lineContent} />;
              })}
            </View>
          </View>
          
          {/* Modified side */}
          <View style={[localStyles.diffSide, styles.lineModified]}>
            {showLineNumbers && (
              <View style={[styles.gutter, styles.gutterModified]}>
                <Text style={styles.lineNumber}>
                  {mapping.modified.start + 1}-{mapping.modified.end}
                </Text>
              </View>
            )}
            <View style={localStyles.content}>
              {Array.from({ length: maxLines }).map((_, lineIdx) => {
                const lineNum = mapping.modified.start + lineIdx;
                const line = viewModel.modifiedLines[lineNum];
                const charChanges = viewModel.getCharChanges(lineNum);
                
                if (lineIdx < mapping.modified.lineCount) {
                  return (
                    <View key={lineIdx} style={localStyles.lineContent}>
                      {showInlineDiff && charChanges ? (
                        <InlineDiffLine
                          line={line || ''}
                          changes={charChanges}
                          styles={styles}
                          theme={themeObj}
                        />
                      ) : (
                        <Text style={[styles.text, styles.modifiedText]}>
                          {line || ' '}
                        </Text>
                      )}
                    </View>
                  );
                }
                return <View key={lineIdx} style={localStyles.lineContent} />;
              })}
            </View>
          </View>
        </View>
      );
    }
    
    // Unchanged lines
    return (
      <View key={`line-${index}`} style={localStyles.diffRow}>
        {/* Original side */}
        <View style={localStyles.diffSide}>
          {showLineNumbers && (
            <View style={styles.gutter}>
              <Text style={styles.lineNumber}>
                {mapping.original.start + 1}-{mapping.original.end}
              </Text>
            </View>
          )}
          <View style={localStyles.content}>
            {viewModel.originalLines
              .slice(mapping.original.start, mapping.original.end)
              .map((line, lineIdx) => (
                <View key={lineIdx} style={localStyles.lineContent}>
                  <Text style={styles.text}>{line || ' '}</Text>
                </View>
              ))}
          </View>
        </View>
        
        {/* Modified side */}
        <View style={localStyles.diffSide}>
          {showLineNumbers && (
            <View style={styles.gutter}>
              <Text style={styles.lineNumber}>
                {mapping.modified.start + 1}-{mapping.modified.end}
              </Text>
            </View>
          )}
          <View style={localStyles.content}>
            {viewModel.modifiedLines
              .slice(mapping.modified.start, mapping.modified.end)
              .map((line, lineIdx) => (
                <View key={lineIdx} style={localStyles.lineContent}>
                  <Text style={styles.text}>{line || ' '}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    );
  }, [
    viewModel,
    showLineNumbers,
    showInlineDiff,
    styles,
    themeObj
  ]);
  
  if (viewModel.isComputing) {
    return (
      <View style={[styles.container, { height }, localStyles.centerContent]}>
        <ActivityIndicator size="large" color={themeObj.modifiedText} />
        <Text style={[styles.text, { marginTop: 10 }]}>Computing diff...</Text>
      </View>
    );
  }
  
  if (viewModel.error) {
    return (
      <View style={[styles.container, { height }, localStyles.centerContent]}>
        <Text style={[styles.text, { color: themeObj.removedText }]}>
          Error: {viewModel.error}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { height }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.text}>
          {viewModel.mappings.length} changes
        </Text>
      </View>
      
      {/* Diff content */}
      <ScrollView
        style={localStyles.scrollView}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        {viewModel.mappings.map(renderDiffLine)}
      </ScrollView>
    </View>
  );
});

/**
 * Inline diff component for showing character-level changes
 */
const InlineDiffLine: React.FC<{
  line: string;
  changes: CharacterChange[];
  styles: any;
  theme: VSCodeDiffTheme;
}> = memo(({ line, changes, styles, theme }) => {
  const segments = useMemo(() => {
    const result: Array<{ text: string; style?: any }> = [];
    let lastEnd = 0;
    
    // Sort changes by start position
    const sortedChanges = [...changes].sort((a, b) => 
      (a.modifiedStart || 0) - (b.modifiedStart || 0)
    );
    
    for (const change of sortedChanges) {
      if (change.modifiedStart >= 0) {
        // Add unchanged text before this change
        if (change.modifiedStart > lastEnd) {
          result.push({
            text: line.substring(lastEnd, change.modifiedStart),
            style: styles.text
          });
        }
        
        // Add the changed text
        result.push({
          text: line.substring(change.modifiedStart, change.modifiedEnd),
          style: [
            styles.text,
            change.type === 'added' ? styles.charAdded :
            change.type === 'removed' ? styles.charRemoved :
            styles.charModified
          ]
        });
        
        lastEnd = change.modifiedEnd;
      }
    }
    
    // Add remaining unchanged text
    if (lastEnd < line.length) {
      result.push({
        text: line.substring(lastEnd),
        style: styles.text
      });
    }
    
    return result;
  }, [line, changes, styles]);
  
  return (
    <Text>
      {segments.map((segment, index) => (
        <Text key={index} style={segment.style}>
          {segment.text}
        </Text>
      ))}
    </Text>
  );
});

const localStyles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  
  diffRow: {
    flexDirection: 'row',
    minHeight: 20
  },
  
  diffSide: {
    flex: 1,
    flexDirection: 'row'
  },
  
  emptySide: {
    opacity: 0.3
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 8
  },
  
  lineContent: {
    minHeight: 18
  },
  
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default VSCodeDiffViewer;