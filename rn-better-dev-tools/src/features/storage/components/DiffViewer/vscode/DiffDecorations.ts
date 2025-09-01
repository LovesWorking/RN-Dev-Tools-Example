/**
 * Decoration System for VS Code Diff Viewer
 * Manages visual decorations for diff content
 */

import { DetailedLineRangeMapping, LineRange, MovedText } from './diffComputer';
import { CharacterChange } from './characterDiffComputer';
import { VSCodeDiffTheme } from './VSCodeTheme';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export interface Range {
  start: number;
  end: number;
}

export type DecorationType = 
  | 'line-added' 
  | 'line-removed' 
  | 'line-modified'
  | 'char-added' 
  | 'char-removed' 
  | 'char-modified'
  | 'gutter-added' 
  | 'gutter-removed' 
  | 'gutter-modified'
  | 'moved-source' 
  | 'moved-target'
  | 'unchanged-collapsed'
  | 'find-match'
  | 'selection';

export interface Decoration {
  range: Range;
  type: DecorationType;
  className?: string;
  style?: TextStyle | ViewStyle;
  zIndex?: number;
  metadata?: any;
}

export interface DecorationSet {
  original: Decoration[];
  modified: Decoration[];
  gutter: Decoration[];
}

/**
 * Computes decorations for diff viewer
 */
export class DiffDecorationComputer {
  constructor(private theme: VSCodeDiffTheme) {}
  
  /**
   * Compute all decorations for the diff
   */
  computeDecorations(
    mappings: DetailedLineRangeMapping[],
    movedBlocks: MovedText[] = [],
    characterChanges: Map<number, CharacterChange[]> = new Map()
  ): DecorationSet {
    const decorations: DecorationSet = {
      original: [],
      modified: [],
      gutter: []
    };
    
    // Process each mapping
    for (const mapping of mappings) {
      this.addMappingDecorations(mapping, decorations, characterChanges);
    }
    
    // Add moved block decorations
    for (const move of movedBlocks) {
      this.addMovedBlockDecorations(move, decorations);
    }
    
    // Sort decorations by z-index
    this.sortDecorations(decorations);
    
    return decorations;
  }
  
  /**
   * Add decorations for a single mapping
   */
  private addMappingDecorations(
    mapping: DetailedLineRangeMapping,
    decorations: DecorationSet,
    characterChanges: Map<number, CharacterChange[]>
  ): void {
    // Handle deletions (only in original)
    if (!mapping.original.isEmpty && mapping.modified.isEmpty) {
      // Line-level decoration
      decorations.original.push({
        range: mapping.original.toRange(),
        type: 'line-removed',
        style: this.getLineStyle('removed'),
        zIndex: 1
      });
      
      // Gutter decoration
      decorations.gutter.push({
        range: mapping.original.toRange(),
        type: 'gutter-removed',
        style: this.getGutterStyle('removed'),
        zIndex: 2
      });
    }
    
    // Handle additions (only in modified)
    else if (mapping.original.isEmpty && !mapping.modified.isEmpty) {
      // Line-level decoration
      decorations.modified.push({
        range: mapping.modified.toRange(),
        type: 'line-added',
        style: this.getLineStyle('added'),
        zIndex: 1
      });
      
      // Gutter decoration
      decorations.gutter.push({
        range: mapping.modified.toRange(),
        type: 'gutter-added',
        style: this.getGutterStyle('added'),
        zIndex: 2
      });
    }
    
    // Handle modifications (both sides have content)
    else if (!mapping.original.isEmpty && !mapping.modified.isEmpty) {
      // Line-level decorations
      decorations.original.push({
        range: mapping.original.toRange(),
        type: 'line-modified',
        style: this.getLineStyle('modified'),
        zIndex: 1
      });
      
      decorations.modified.push({
        range: mapping.modified.toRange(),
        type: 'line-modified',
        style: this.getLineStyle('modified'),
        zIndex: 1
      });
      
      // Gutter decorations
      decorations.gutter.push({
        range: mapping.original.toRange(),
        type: 'gutter-modified',
        style: this.getGutterStyle('modified'),
        zIndex: 2
      });
      
      decorations.gutter.push({
        range: mapping.modified.toRange(),
        type: 'gutter-modified',
        style: this.getGutterStyle('modified'),
        zIndex: 2
      });
      
      // Add character-level decorations if available
      for (let line = mapping.modified.start; line < mapping.modified.end; line++) {
        const charChanges = characterChanges.get(line);
        if (charChanges) {
          this.addCharacterDecorations(charChanges, line, decorations);
        }
      }
    }
  }
  
  /**
   * Add character-level decorations
   */
  private addCharacterDecorations(
    changes: CharacterChange[],
    lineIndex: number,
    decorations: DecorationSet
  ): void {
    for (const change of changes) {
      if (change.type === 'added') {
        decorations.modified.push({
          range: { 
            start: change.modifiedStart, 
            end: change.modifiedEnd 
          },
          type: 'char-added',
          style: this.getCharStyle('added'),
          zIndex: 10,
          metadata: { lineIndex }
        });
      } else if (change.type === 'removed') {
        decorations.original.push({
          range: { 
            start: change.originalStart, 
            end: change.originalEnd 
          },
          type: 'char-removed',
          style: this.getCharStyle('removed'),
          zIndex: 10,
          metadata: { lineIndex }
        });
      } else if (change.type === 'modified') {
        decorations.original.push({
          range: { 
            start: change.originalStart, 
            end: change.originalEnd 
          },
          type: 'char-modified',
          style: this.getCharStyle('modified'),
          zIndex: 10,
          metadata: { lineIndex }
        });
        
        decorations.modified.push({
          range: { 
            start: change.modifiedStart, 
            end: change.modifiedEnd 
          },
          type: 'char-modified',
          style: this.getCharStyle('modified'),
          zIndex: 10,
          metadata: { lineIndex }
        });
      }
    }
  }
  
  /**
   * Add decorations for moved blocks
   */
  private addMovedBlockDecorations(
    move: MovedText,
    decorations: DecorationSet
  ): void {
    // Source (original) decoration
    decorations.original.push({
      range: move.original.toRange(),
      type: 'moved-source',
      style: this.getMovedBlockStyle(),
      zIndex: 5
    });
    
    // Target (modified) decoration
    decorations.modified.push({
      range: move.modified.toRange(),
      type: 'moved-target',
      style: this.getMovedBlockStyle(),
      zIndex: 5
    });
  }
  
  /**
   * Sort decorations by z-index
   */
  private sortDecorations(decorations: DecorationSet): void {
    const sortByZIndex = (a: Decoration, b: Decoration) => 
      (a.zIndex || 0) - (b.zIndex || 0);
    
    decorations.original.sort(sortByZIndex);
    decorations.modified.sort(sortByZIndex);
    decorations.gutter.sort(sortByZIndex);
  }
  
  /**
   * Get line-level style
   */
  private getLineStyle(type: 'added' | 'removed' | 'modified'): ViewStyle {
    switch (type) {
      case 'added':
        return {
          backgroundColor: this.theme.addedLineBackground
        };
      case 'removed':
        return {
          backgroundColor: this.theme.removedLineBackground
        };
      case 'modified':
        return {
          backgroundColor: this.theme.modifiedLineBackground
        };
    }
  }
  
  /**
   * Get character-level style
   */
  private getCharStyle(type: 'added' | 'removed' | 'modified'): TextStyle {
    switch (type) {
      case 'added':
        return {
          backgroundColor: this.theme.addedWordHighlight,
          color: this.theme.addedText
        };
      case 'removed':
        return {
          backgroundColor: this.theme.removedWordHighlight,
          color: this.theme.removedText,
          textDecorationLine: 'line-through',
          textDecorationColor: this.theme.removedText
        };
      case 'modified':
        return {
          backgroundColor: this.theme.modifiedWordHighlight,
          color: this.theme.modifiedText
        };
    }
  }
  
  /**
   * Get gutter style
   */
  private getGutterStyle(type: 'added' | 'removed' | 'modified'): ViewStyle {
    switch (type) {
      case 'added':
        return {
          backgroundColor: this.theme.gutterAddedBackground,
          borderLeftWidth: 3,
          borderLeftColor: this.theme.addedText
        };
      case 'removed':
        return {
          backgroundColor: this.theme.gutterRemovedBackground,
          borderLeftWidth: 3,
          borderLeftColor: this.theme.removedText
        };
      case 'modified':
        return {
          backgroundColor: this.theme.gutterModifiedBackground,
          borderLeftWidth: 3,
          borderLeftColor: this.theme.modifiedText
        };
    }
  }
  
  /**
   * Get moved block style
   */
  private getMovedBlockStyle(): ViewStyle {
    return {
      backgroundColor: this.theme.movedBlockBackground,
      borderWidth: 1,
      borderColor: this.theme.movedBlockBorder,
      borderStyle: 'dashed'
    };
  }
}

/**
 * Create VS Code diff styles
 */
export function createVSCodeDiffStyles(theme: VSCodeDiffTheme) {
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    
    header: {
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
      paddingVertical: 8,
      paddingHorizontal: 12
    },
    
    // Line styles
    lineAdded: {
      backgroundColor: theme.addedLineBackground
    },
    
    lineRemoved: {
      backgroundColor: theme.removedLineBackground
    },
    
    lineModified: {
      backgroundColor: theme.modifiedLineBackground
    },
    
    // Character styles (inline diff)
    charAdded: {
      backgroundColor: theme.addedWordHighlight,
      color: theme.addedText
    },
    
    charRemoved: {
      backgroundColor: theme.removedWordHighlight,
      color: theme.removedText,
      textDecorationLine: 'line-through' as 'line-through',
      textDecorationColor: theme.removedText
    },
    
    charModified: {
      backgroundColor: theme.modifiedWordHighlight,
      color: theme.modifiedText
    },
    
    // Text styles
    text: {
      fontFamily: 'Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      lineHeight: 18,
      color: theme.unchangedText
    },
    
    addedText: {
      color: theme.addedText
    },
    
    removedText: {
      color: theme.removedText
    },
    
    modifiedText: {
      color: theme.modifiedText
    },
    
    // Gutter styles
    gutter: {
      backgroundColor: theme.lineNumberBackground,
      borderRightWidth: 1,
      borderRightColor: theme.borderColor,
      minWidth: 50,
      paddingHorizontal: 8
    },
    
    gutterAdded: {
      backgroundColor: theme.gutterAddedBackground,
      borderLeftWidth: 3,
      borderLeftColor: theme.addedText
    },
    
    gutterRemoved: {
      backgroundColor: theme.gutterRemovedBackground,
      borderLeftWidth: 3,
      borderLeftColor: theme.removedText
    },
    
    gutterModified: {
      backgroundColor: theme.gutterModifiedBackground,
      borderLeftWidth: 3,
      borderLeftColor: theme.modifiedText
    },
    
    lineNumber: {
      color: theme.lineNumberText,
      fontSize: 12,
      fontFamily: 'Menlo, Monaco, Consolas, monospace'
    },
    
    lineNumberActive: {
      color: theme.lineNumberActiveForeground
    },
    
    // Moved blocks
    movedBlock: {
      backgroundColor: theme.movedBlockBackground,
      borderWidth: 1,
      borderColor: theme.movedBlockBorder,
      borderStyle: 'dashed' as 'dashed'
    },
    
    movedBlockArrow: {
      color: theme.movedBlockArrow
    },
    
    // Unchanged collapsed regions
    collapsedRegion: {
      backgroundColor: theme.unchangedRegionBackground,
      height: 22,
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.borderColor
    },
    
    collapsedRegionText: {
      color: theme.unchangedRegionForeground,
      fontSize: 11,
      fontFamily: 'Menlo, Monaco, Consolas, monospace'
    },
    
    // Selection
    selection: {
      backgroundColor: theme.selectionBackground
    },
    
    // Hover
    hover: {
      backgroundColor: theme.hoverBackground
    },
    
    // Find match
    findMatch: {
      backgroundColor: theme.findMatchBackground,
      borderWidth: 1,
      borderColor: theme.findMatchBorder
    },
    
    findMatchHighlight: {
      backgroundColor: theme.findMatchHighlightBackground
    },
    
    // Scrollbar
    scrollbar: {
      width: 14,
      backgroundColor: 'transparent'
    },
    
    scrollbarThumb: {
      backgroundColor: theme.scrollbarSliderBackground,
      borderRadius: 7
    },
    
    scrollbarThumbHover: {
      backgroundColor: theme.scrollbarSliderHoverBackground
    },
    
    // Divider
    divider: {
      width: 1,
      backgroundColor: theme.dividerColor
    }
  });
}