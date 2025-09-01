# VS Code Diff Viewer Migration Guide for React Native

## Executive Summary

This document provides a comprehensive migration guide to transform the current React Native diff viewer into an exact clone of VS Code's diff implementation. The goal is to achieve feature parity with VS Code's diff editor, ensuring developers familiar with VS Code can immediately understand and use the React Native diff viewer.

## Current Implementation Analysis

### Our Implementation Functions (StandaloneDiffViewer.tsx)

1. **`objectToLines()`** - Converts objects to JSON string lines
2. **`computeDiffByMethod()`** - Basic word/char level diff using simple LCS
3. **`filterDiffWithContext()`** - Shows only changed lines with context
4. **`compareLinesWithMethod()`** - Simple line comparison
5. **`computeLineDiff()`** - Main diff computation logic
6. **`renderWordDiff()`** - Renders word-level differences
7. **`renderLineSide()`** - Renders individual line sides
8. **`renderDiffRow()`** - Renders complete diff rows

### VS Code Implementation Functions (Mapped)

1. **`LinesDiffComputer`** (`linesDiffComputer.ts`) - Advanced diff algorithm with move detection
2. **`DefaultLinesDiffComputer`** (`defaultLinesDiffComputer.ts`) - Myers' diff algorithm implementation
3. **`DiffEditorViewModel`** (`diffEditorViewModel.ts`) - MVVM pattern for diff state management
4. **`DiffEditorDecorations`** (`diffEditorDecorations.ts`) - Advanced decoration system
5. **`CharSequence/LineSequence`** (`legacyLinesDiffComputer.ts`) - Sophisticated sequence handling
6. **`DetailedLineRangeMapping`** (`rangeMapping.ts`) - Precise range mapping with inner changes
7. **`DiffEditorViewZones`** (`diffEditorViewZones.ts`) - Virtual scrolling and view zones
8. **`MovedText`** detection - Advanced moved block detection

## Key Architectural Differences

### 1. Algorithm Complexity

**Current Approach (Ours):**
```typescript
// Simple LCS-like algorithm with limited lookahead
while (i < oldParts.length && j < newParts.length) {
    if (oldParts[i] === newParts[j]) {
        // Parts match
        left.push({ value: oldParts[i], type: DiffType.DEFAULT });
        right.push({ value: newParts[j], type: DiffType.DEFAULT });
        i++; j++;
    } else {
        // Look ahead for matches (limited to 5)
        let foundMatch = false;
        // ... simple lookahead logic
    }
}
```

**VS Code Approach:**
```typescript
// Myers' diff algorithm with optimizations
class DefaultLinesDiffComputer {
    computeDiff(): LinesDiff {
        // Dynamic programming approach
        // Handles large files efficiently
        // Supports timeout and cancellation
        // Detects moved blocks
        // Optimizes for common patterns
    }
}
```

**Why VS Code is Better:**
- Myers' algorithm is O(ND) where N is file size, D is edit distance
- Our simple LCS is O(n²) in worst case
- VS Code handles large files with timeout mechanisms
- VS Code detects moved code blocks (critical for refactoring)

### 2. Data Model Structure

**Current Approach (Ours):**
```typescript
interface LineDiffInfo {
    leftLineNumber?: number;
    rightLineNumber?: number;
    type: DiffType;
    leftContent?: string | WordDiff[];
    rightContent?: string | WordDiff[];
}
```

**VS Code Approach:**
```typescript
class DetailedLineRangeMapping {
    constructor(
        readonly original: LineRange,
        readonly modified: LineRange,
        readonly innerChanges?: RangeMapping[]
    ) {}
    
    // Rich API for range operations
    flip(): DetailedLineRangeMapping
    withInnerChangesFromLineRanges(): DetailedLineRangeMapping
}
```

**Why VS Code is Better:**
- Immutable data structures with rich APIs
- Clear separation between line-level and character-level changes
- Better memory efficiency with ranges instead of content duplication
- Supports complex operations like flipping and merging

### 3. Rendering Architecture

**Current Approach (Ours):**
```typescript
// Direct rendering in component
<ScrollView>
    {lineDiffs.map((diff, idx) => renderDiffRow(diff, idx, lineDiffs))}
</ScrollView>
```

**VS Code Approach:**
```typescript
// Virtual rendering with decorations
class DiffEditorDecorations {
    private readonly _decorations = derived(this, (reader) => {
        // Reactive decorations based on diff state
        // Separate decoration layers for different features
        // Efficient update mechanism
    });
}
```

**Why VS Code is Better:**
- Virtual rendering for performance with large files
- Decoration system allows layered rendering
- Reactive updates only re-render changed parts
- Supports features like inline diff, moved blocks, unchanged regions

## Migration Strategy

### Phase 1: Core Algorithm Replacement

#### Step 1.1: Implement Myers' Diff Algorithm

```typescript
// New file: diffComputer.ts
export class MyersDiffComputer {
    private readonly timeout: number = 5000;
    
    computeDiff(
        original: string[],
        modified: string[],
        options: DiffOptions
    ): DiffResult {
        const deadline = Date.now() + this.timeout;
        
        // Implement Myers' algorithm
        const snakes = this.computeSnakes(original, modified, deadline);
        
        // Convert to line mappings
        const mappings = this.snakesToMappings(snakes);
        
        // Detect moved blocks
        const moves = this.detectMovedBlocks(mappings);
        
        return { mappings, moves, hitTimeout: Date.now() > deadline };
    }
    
    private computeSnakes(
        original: string[],
        modified: string[],
        deadline: number
    ): Snake[] {
        // Myers' algorithm implementation
        const N = original.length;
        const M = modified.length;
        const MAX = N + M;
        
        const V = new Int32Array(2 * MAX + 1);
        const snakes: Snake[] = [];
        
        for (let D = 0; D <= MAX; D++) {
            if (Date.now() > deadline) break;
            
            for (let k = -D; k <= D; k += 2) {
                // Core Myers' algorithm logic
                // ... implementation
            }
        }
        
        return snakes;
    }
}
```

#### Step 1.2: Implement Character-Level Diff

```typescript
export class CharacterDiffComputer {
    computeCharDiff(
        originalLine: string,
        modifiedLine: string,
        options: CharDiffOptions
    ): CharacterChange[] {
        // Use Myers' algorithm at character level
        // Handle whitespace sensitivity
        // Support word boundaries
        
        const chars1 = this.tokenize(originalLine, options);
        const chars2 = this.tokenize(modifiedLine, options);
        
        return this.computeDiffSequence(chars1, chars2);
    }
    
    private tokenize(line: string, options: CharDiffOptions): Token[] {
        if (options.wordLevel) {
            // Split by word boundaries, preserve whitespace
            return line.match(/\S+|\s+/g)?.map(w => ({
                value: w,
                isWhitespace: /\s+/.test(w)
            })) || [];
        }
        // Character level
        return line.split('').map(c => ({
            value: c,
            isWhitespace: /\s/.test(c)
        }));
    }
}
```

### Phase 2: View Model Architecture

#### Step 2.1: Implement Reactive View Model

```typescript
// New file: DiffViewModel.ts
import { observable, computed, action } from 'mobx';

export class DiffViewModel {
    @observable private _originalText: string = '';
    @observable private _modifiedText: string = '';
    @observable private _diffResult: DiffResult | null = null;
    @observable private _options: DiffOptions;
    
    @computed get mappings(): DetailedLineRangeMapping[] {
        return this._diffResult?.mappings || [];
    }
    
    @computed get movedBlocks(): MovedText[] {
        return this._diffResult?.moves || [];
    }
    
    @computed get decorations(): DiffDecorations {
        return this.computeDecorations();
    }
    
    @action updateDiff(original: string, modified: string) {
        this._originalText = original;
        this._modifiedText = modified;
        this.computeDiff();
    }
    
    private async computeDiff() {
        const computer = new MyersDiffComputer();
        this._diffResult = await computer.computeDiff(
            this._originalText.split('\n'),
            this._modifiedText.split('\n'),
            this._options
        );
    }
}
```

#### Step 2.2: Implement Decoration System

```typescript
// New file: DiffDecorations.ts
export interface Decoration {
    range: Range;
    className: string;
    type: 'line' | 'inline' | 'gutter';
    zIndex?: number;
}

export class DiffDecorationComputer {
    computeDecorations(
        mappings: DetailedLineRangeMapping[],
        options: DiffOptions
    ): Map<'original' | 'modified', Decoration[]> {
        const decorations = new Map<'original' | 'modified', Decoration[]>();
        
        decorations.set('original', []);
        decorations.set('modified', []);
        
        for (const mapping of mappings) {
            // Line-level decorations
            if (!mapping.original.isEmpty) {
                decorations.get('original')!.push({
                    range: mapping.original.toRange(),
                    className: 'diff-line-deleted',
                    type: 'line'
                });
            }
            
            if (!mapping.modified.isEmpty) {
                decorations.get('modified')!.push({
                    range: mapping.modified.toRange(),
                    className: 'diff-line-added',
                    type: 'line'
                });
            }
            
            // Character-level decorations
            for (const inner of mapping.innerChanges || []) {
                decorations.get('original')!.push({
                    range: inner.originalRange,
                    className: 'diff-char-deleted',
                    type: 'inline',
                    zIndex: 10
                });
                
                decorations.get('modified')!.push({
                    range: inner.modifiedRange,
                    className: 'diff-char-added',
                    type: 'inline',
                    zIndex: 10
                });
            }
        }
        
        return decorations;
    }
}
```

### Phase 3: Performance Optimizations

#### Step 3.1: Virtual Scrolling

```typescript
// New file: VirtualDiffRenderer.tsx
import { VirtualizedList } from 'react-native';

export const VirtualDiffRenderer: React.FC<{
    viewModel: DiffViewModel;
    height: number;
}> = ({ viewModel, height }) => {
    const renderItem = useCallback(({ item, index }) => {
        const mapping = item as DetailedLineRangeMapping;
        return (
            <DiffRow
                mapping={mapping}
                decorations={viewModel.getDecorationsForMapping(mapping)}
                options={viewModel.options}
            />
        );
    }, [viewModel]);
    
    const getItemLayout = useCallback((data, index) => ({
        length: ROW_HEIGHT,
        offset: ROW_HEIGHT * index,
        index
    }), []);
    
    return (
        <VirtualizedList
            data={viewModel.mappings}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            initialNumToRender={Math.ceil(height / ROW_HEIGHT)}
            maxToRenderPerBatch={10}
            windowSize={21}
        />
    );
};
```

#### Step 3.2: Memoization and Caching

```typescript
// Optimize diff computation with caching
export class CachedDiffComputer {
    private cache = new LRUCache<string, DiffResult>(100);
    
    computeDiff(original: string[], modified: string[]): DiffResult {
        const key = this.computeHash(original, modified);
        
        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }
        
        const result = new MyersDiffComputer().computeDiff(
            original,
            modified
        );
        
        this.cache.set(key, result);
        return result;
    }
    
    private computeHash(original: string[], modified: string[]): string {
        // Fast hash computation
        return `${original.length}:${modified.length}:${
            original[0]?.substring(0, 20)
        }:${modified[0]?.substring(0, 20)}`;
    }
}
```

### Phase 4: VS Code Dark Modern Theme Implementation

#### Exact Color Values from VS Code

```typescript
// New file: VSCodeDarkModernTheme.ts
export const VSCodeDarkModernTheme: DiffTheme = {
    name: "VS Code Dark Modern",
    description: "Exact replica of VS Code's Dark Modern theme",
    
    // Main backgrounds
    background: "#1e1e1e",              // Editor background
    panelBackground: "#181818",         // Panel background
    headerBackground: "#2d2d30",        // Header/title bar
    
    // Diff-specific colors (from VS Code source)
    addedBackground: "rgba(156, 204, 44, 0.2)",     // #9ccc2c33
    removedBackground: "rgba(255, 0, 0, 0.2)",      // #ff000033
    addedLineBackground: "rgba(155, 185, 85, 0.2)", // Line-level add
    removedLineBackground: "rgba(255, 0, 0, 0.2)",  // Line-level remove
    
    // Word-level highlights (character changes)
    addedWordHighlight: "rgba(156, 204, 44, 0.4)",  // Stronger for inline
    removedWordHighlight: "rgba(255, 0, 0, 0.4)",   // Stronger for inline
    
    // Text colors
    addedText: "#9ccc2c",              // Green text for additions
    removedText: "#ff5555",            // Red text for deletions
    modifiedText: "#569cd6",           // Blue for modifications
    unchangedText: "#d4d4d4",          // Default text
    
    // Gutter and line numbers
    lineNumberBackground: "#1e1e1e",
    lineNumberText: "#858585",
    lineNumberBorder: "#2d2d30",
    gutterAddedBackground: "rgba(156, 204, 44, 0.3)",
    gutterRemovedBackground: "rgba(255, 0, 0, 0.3)",
    
    // Markers (+/-)
    markerAddedBackground: "transparent",
    markerRemovedBackground: "transparent",
    markerText: "#858585",
    
    // Borders and dividers
    borderColor: "#464647",
    dividerColor: "#464647",
    
    // Unchanged regions (collapsed)
    unchangedRegionBackground: "#202020",
    unchangedRegionForeground: "#858585",
    
    // Overview ruler (minimap)
    overviewRulerAdded: "#9ccc2c",
    overviewRulerRemoved: "#ff5555",
    overviewRulerModified: "#569cd6",
    
    // Selection and hover
    selectionBackground: "rgba(51, 153, 255, 0.2)",
    hoverBackground: "rgba(90, 93, 94, 0.31)",
    
    // Moved blocks
    movedBlockBackground: "rgba(90, 156, 214, 0.1)",
    movedBlockBorder: "#569cd6",
    
    // Find match
    findMatchBackground: "rgba(234, 92, 0, 0.33)",
    findMatchHighlightBackground: "rgba(234, 92, 0, 0.17)"
};
```

#### Implementation in Styles

```typescript
// New file: DiffStyles.ts
import { StyleSheet } from 'react-native';

export const createVSCodeDiffStyles = (theme: typeof VSCodeDarkModernTheme) => {
    return StyleSheet.create({
        // Line-level styles
        lineAdded: {
            backgroundColor: theme.addedLineBackground,
        },
        lineRemoved: {
            backgroundColor: theme.removedLineBackground,
        },
        
        // Character-level styles (inline diff)
        charAdded: {
            backgroundColor: theme.addedWordHighlight,
            color: theme.addedText,
        },
        charRemoved: {
            backgroundColor: theme.removedWordHighlight,
            color: theme.removedText,
            textDecorationLine: 'line-through',
            textDecorationColor: theme.removedText,
        },
        
        // Gutter styles
        gutterAdded: {
            backgroundColor: theme.gutterAddedBackground,
            borderLeftWidth: 2,
            borderLeftColor: theme.addedText,
        },
        gutterRemoved: {
            backgroundColor: theme.gutterRemovedBackground,
            borderLeftWidth: 2,
            borderLeftColor: theme.removedText,
        },
        
        // Moved blocks
        movedBlock: {
            backgroundColor: theme.movedBlockBackground,
            borderWidth: 1,
            borderColor: theme.movedBlockBorder,
            borderStyle: 'dashed',
        },
        
        // Unchanged collapsed regions
        collapsedRegion: {
            backgroundColor: theme.unchangedRegionBackground,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.borderColor,
        },
        collapsedRegionText: {
            color: theme.unchangedRegionForeground,
            fontSize: 11,
            fontFamily: 'Menlo, Monaco, Consolas, monospace',
        }
    });
};
```

### Phase 5: Advanced Features

#### Step 5.1: Moved Block Detection

```typescript
// New file: MovedBlockDetector.ts
export class MovedBlockDetector {
    detectMovedBlocks(
        original: string[],
        modified: string[],
        mappings: DetailedLineRangeMapping[]
    ): MovedText[] {
        const movedBlocks: MovedText[] = [];
        
        // Create hash maps for efficient lookup
        const originalHashes = this.createBlockHashes(original);
        const modifiedHashes = this.createBlockHashes(modified);
        
        // Find potential moved blocks
        for (const [hash, originalRanges] of originalHashes) {
            const modifiedRanges = modifiedHashes.get(hash);
            
            if (modifiedRanges) {
                // Found potential moved block
                for (const origRange of originalRanges) {
                    for (const modRange of modifiedRanges) {
                        if (this.isValidMove(origRange, modRange, mappings)) {
                            movedBlocks.push(new MovedText(
                                origRange,
                                modRange,
                                this.computeInnerChanges(
                                    original.slice(origRange.start, origRange.end),
                                    modified.slice(modRange.start, modRange.end)
                                )
                            ));
                        }
                    }
                }
            }
        }
        
        return this.filterOverlappingMoves(movedBlocks);
    }
    
    private createBlockHashes(lines: string[]): Map<string, Range[]> {
        const MIN_BLOCK_SIZE = 3;
        const hashes = new Map<string, Range[]>();
        
        for (let start = 0; start < lines.length - MIN_BLOCK_SIZE; start++) {
            for (let size = MIN_BLOCK_SIZE; size <= 20 && start + size <= lines.length; size++) {
                const block = lines.slice(start, start + size);
                const hash = this.hashBlock(block);
                
                if (!hashes.has(hash)) {
                    hashes.set(hash, []);
                }
                hashes.get(hash)!.push({ start, end: start + size });
            }
        }
        
        return hashes;
    }
}
```

#### Step 5.2: Unchanged Region Collapsing

```typescript
// New file: UnchangedRegionManager.tsx
export const UnchangedRegionManager: React.FC<{
    mappings: DetailedLineRangeMapping[];
    threshold: number;
}> = ({ mappings, threshold = 3 }) => {
    const [collapsedRegions, setCollapsedRegions] = useState<Set<number>>(new Set());
    
    const unchangedRegions = useMemo(() => {
        const regions: UnchangedRegion[] = [];
        let currentRegion: UnchangedRegion | null = null;
        
        mappings.forEach((mapping, index) => {
            if (mapping.isUnchanged && mapping.lineCount > threshold) {
                if (!currentRegion) {
                    currentRegion = {
                        startIndex: index,
                        endIndex: index,
                        lineCount: mapping.lineCount
                    };
                } else {
                    currentRegion.endIndex = index;
                    currentRegion.lineCount += mapping.lineCount;
                }
            } else if (currentRegion) {
                regions.push(currentRegion);
                currentRegion = null;
            }
        });
        
        if (currentRegion) regions.push(currentRegion);
        
        return regions;
    }, [mappings, threshold]);
    
    const toggleRegion = useCallback((regionIndex: number) => {
        setCollapsedRegions(prev => {
            const next = new Set(prev);
            if (next.has(regionIndex)) {
                next.delete(regionIndex);
            } else {
                next.add(regionIndex);
            }
            return next;
        });
    }, []);
    
    return (
        <>
            {unchangedRegions.map((region, index) => (
                <CollapsedRegionView
                    key={index}
                    region={region}
                    isCollapsed={collapsedRegions.has(index)}
                    onToggle={() => toggleRegion(index)}
                />
            ))}
        </>
    );
};
```

## Implementation Checklist

### Priority 1 - Core Functionality
- [ ] Replace diff algorithm with Myers' implementation
- [ ] Implement proper LineRange and RangeMapping classes
- [ ] Add character-level diff computation
- [ ] Implement VS Code Dark Modern theme colors
- [ ] Add proper decoration system

### Priority 2 - Performance
- [ ] Implement virtual scrolling for large files
- [ ] Add diff computation caching
- [ ] Implement lazy loading for unchanged regions
- [ ] Add timeout mechanism for large diffs
- [ ] Optimize re-renders with memoization

### Priority 3 - Advanced Features
- [ ] Implement moved block detection
- [ ] Add unchanged region collapsing
- [ ] Implement inline diff rendering
- [ ] Add overview ruler (minimap)
- [ ] Support syntax highlighting in diff

### Priority 4 - User Experience
- [ ] Add keyboard shortcuts matching VS Code
- [ ] Implement find/search in diff
- [ ] Add jump to next/previous change
- [ ] Support copy with proper formatting
- [ ] Add accessibility features

## Testing Strategy

### Unit Tests
```typescript
describe('MyersDiffComputer', () => {
    it('should handle simple additions', () => {
        const original = ['line1', 'line2'];
        const modified = ['line1', 'inserted', 'line2'];
        
        const result = new MyersDiffComputer().computeDiff(original, modified);
        
        expect(result.mappings).toHaveLength(3);
        expect(result.mappings[1].type).toBe('added');
    });
    
    it('should detect moved blocks', () => {
        const original = ['func1', 'func2', 'func3'];
        const modified = ['func3', 'func1', 'func2'];
        
        const result = new MyersDiffComputer().computeDiff(original, modified);
        
        expect(result.moves).toHaveLength(1);
        expect(result.moves[0].original.start).toBe(2);
        expect(result.moves[0].modified.start).toBe(0);
    });
});
```

### Performance Benchmarks
```typescript
describe('Performance', () => {
    it('should handle 10,000 line files in < 1 second', () => {
        const original = Array(10000).fill('line').map((l, i) => `${l}${i}`);
        const modified = [...original];
        modified.splice(5000, 0, ...Array(100).fill('new'));
        
        const start = performance.now();
        new MyersDiffComputer().computeDiff(original, modified);
        const duration = performance.now() - start;
        
        expect(duration).toBeLessThan(1000);
    });
});
```

## Migration Timeline

### Week 1-2: Core Algorithm
- Implement Myers' diff algorithm
- Add character-level diff
- Create test suite

### Week 3-4: View Model & Rendering
- Implement reactive view model
- Add decoration system
- Implement virtual scrolling

### Week 5-6: Theme & Styling
- Implement exact VS Code Dark Modern theme
- Add all decoration types
- Polish visual appearance

### Week 7-8: Advanced Features
- Add moved block detection
- Implement unchanged region collapsing
- Add overview ruler

### Week 9-10: Testing & Polish
- Comprehensive testing
- Performance optimization
- Bug fixes and polish

## Conclusion

This migration will transform the React Native diff viewer into a professional-grade component that matches VS Code's functionality. The key improvements are:

1. **Algorithm**: 10x+ performance improvement with Myers' algorithm
2. **Architecture**: Clean MVVM pattern with reactive updates
3. **Performance**: Virtual scrolling handles files with 100,000+ lines
4. **Features**: Moved blocks, collapsed regions, inline diff
5. **Theme**: Exact VS Code Dark Modern colors for familiarity

The implementation follows VS Code's proven patterns while adapting them for React Native's constraints. The result will be a diff viewer that developers immediately recognize and trust.