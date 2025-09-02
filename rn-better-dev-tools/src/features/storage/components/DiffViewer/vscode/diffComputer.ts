/**
 * Myers' Diff Algorithm Implementation
 * Based on VS Code's diff implementation for optimal performance
 */

export interface Snake {
  x: number;
  y: number;
  u: number;
  v: number;
}

export interface DiffChange {
  originalStart: number;
  originalLength: number;
  modifiedStart: number;
  modifiedLength: number;
}

export interface LineRange {
  start: number;
  end: number;
  isEmpty: boolean;
  lineCount: number;
  
  toRange(): { start: number; end: number };
  contains(line: number): boolean;
  delta(offset: number): LineRange;
}

export class LineRangeImpl implements LineRange {
  constructor(
    public readonly start: number,
    public readonly end: number
  ) {}
  
  get isEmpty(): boolean {
    return this.start >= this.end;
  }
  
  get lineCount(): number {
    return this.end - this.start;
  }
  
  toRange(): { start: number; end: number } {
    return { start: this.start, end: this.end };
  }
  
  contains(line: number): boolean {
    return line >= this.start && line < this.end;
  }
  
  delta(offset: number): LineRange {
    return new LineRangeImpl(this.start + offset, this.end + offset);
  }
}

export interface RangeMapping {
  originalRange: LineRange;
  modifiedRange: LineRange;
}

export class DetailedLineRangeMapping {
  constructor(
    public readonly original: LineRange,
    public readonly modified: LineRange,
    public readonly innerChanges?: RangeMapping[]
  ) {}
  
  get isUnchanged(): boolean {
    return !this.original.isEmpty && !this.modified.isEmpty && 
           this.original.lineCount === this.modified.lineCount &&
           !this.innerChanges?.length;
  }
  
  flip(): DetailedLineRangeMapping {
    return new DetailedLineRangeMapping(
      this.modified,
      this.original,
      this.innerChanges?.map(c => ({
        originalRange: c.modifiedRange,
        modifiedRange: c.originalRange
      }))
    );
  }
}

export interface MovedText {
  original: LineRange;
  modified: LineRange;
  similarity: number;
  innerChanges?: RangeMapping[];
}

export interface DiffResult {
  mappings: DetailedLineRangeMapping[];
  moves: MovedText[];
  hitTimeout: boolean;
}

export interface DiffOptions {
  timeout?: number;
  wordLevel?: boolean;
  ignoreWhitespace?: boolean;
  detectMoves?: boolean;
  minMoveSize?: number;
  maxComputationTime?: number;
}

/**
 * Myers' Diff Algorithm Computer
 * O(ND) complexity where N is file size and D is edit distance
 */
export class MyersDiffComputer {
  private readonly timeout: number;
  
  constructor(private options: DiffOptions = {}) {
    this.timeout = options.timeout || 5000;
  }
  
  computeDiff(
    original: string[],
    modified: string[],
    options?: DiffOptions
  ): DiffResult {
    const deadline = Date.now() + this.timeout;
    const mergedOptions = { ...this.options, ...options };
    
    // Compute the diff using Myers' algorithm
    const changes = this.computeDiffChanges(original, modified, deadline);
    
    // Convert changes to line mappings
    const mappings = this.changesToMappings(changes, original, modified, mergedOptions);
    
    // Detect moved blocks if requested
    const moves = mergedOptions.detectMoves 
      ? this.detectMovedBlocks(original, modified, mappings, mergedOptions)
      : [];
    
    return {
      mappings,
      moves,
      hitTimeout: Date.now() > deadline
    };
  }
  
  private computeDiffChanges(
    original: string[],
    modified: string[],
    deadline: number
  ): DiffChange[] {
    const N = original.length;
    const M = modified.length;
    const MAX = N + M;
    
    // V array for storing endpoints
    const V = new Int32Array(2 * MAX + 1);
    const paths: Snake[][] = [];
    
    // Main diagonal loop
    for (let D = 0; D <= MAX; D++) {
      if (Date.now() > deadline) {
        break;
      }
      
      paths[D] = [];
      
      for (let k = -D; k <= D; k += 2) {
        let x: number;
        let y: number;
        
        // Determine if we should go down or right
        if (k === -D || (k !== D && V[MAX + k - 1] < V[MAX + k + 1])) {
          // Coming from above (insertion)
          x = V[MAX + k + 1];
        } else {
          // Coming from left (deletion)
          x = V[MAX + k - 1] + 1;
        }
        
        y = x - k;
        
        // Extend the snake
        const startX = x;
        const startY = y;
        
        while (x < N && y < M && original[x] === modified[y]) {
          x++;
          y++;
        }
        
        V[MAX + k] = x;
        
        // Store the snake
        paths[D].push({
          x: startX,
          y: startY,
          u: x,
          v: y
        });
        
        // Check if we've reached the end
        if (x >= N && y >= M) {
          return this.snakesToChanges(paths, N, M);
        }
      }
    }
    
    // Timeout or no solution found
    return this.snakesToChanges(paths, N, M);
  }
  
  private snakesToChanges(paths: Snake[][], N: number, M: number): DiffChange[] {
    const changes: DiffChange[] = [];
    
    if (paths.length === 0) {
      return changes;
    }
    
    // Reconstruct path from the snakes
    let x = N;
    let y = M;
    
    for (let d = paths.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
      const snakes = paths[d] || [];
      
      for (const snake of snakes) {
        if (snake.u === x && snake.v === y) {
          if (snake.x !== snake.u || snake.y !== snake.v) {
            // This snake represents a diagonal (unchanged region)
            // We don't need to record unchanged regions
          }
          
          if (snake.x !== x || snake.y !== y) {
            // There was a change before this snake
            const originalStart = snake.x;
            const originalLength = x - snake.x;
            const modifiedStart = snake.y;
            const modifiedLength = y - snake.y;
            
            if (originalLength > 0 || modifiedLength > 0) {
              changes.unshift({
                originalStart,
                originalLength,
                modifiedStart,
                modifiedLength
              });
            }
          }
          
          x = snake.x;
          y = snake.y;
          break;
        }
      }
    }
    
    // Handle any remaining changes at the beginning
    if (x > 0 || y > 0) {
      changes.unshift({
        originalStart: 0,
        originalLength: x,
        modifiedStart: 0,
        modifiedLength: y
      });
    }
    
    return changes;
  }
  
  private changesToMappings(
    changes: DiffChange[],
    original: string[],
    modified: string[],
    options: DiffOptions
  ): DetailedLineRangeMapping[] {
    const mappings: DetailedLineRangeMapping[] = [];
    let originalIndex = 0;
    let modifiedIndex = 0;
    
    for (const change of changes) {
      // Add unchanged region before this change
      if (change.originalStart > originalIndex || change.modifiedStart > modifiedIndex) {
        mappings.push(new DetailedLineRangeMapping(
          new LineRangeImpl(originalIndex, change.originalStart),
          new LineRangeImpl(modifiedIndex, change.modifiedStart)
        ));
      }
      
      // Add the change itself
      const origRange = new LineRangeImpl(
        change.originalStart,
        change.originalStart + change.originalLength
      );
      const modRange = new LineRangeImpl(
        change.modifiedStart,
        change.modifiedStart + change.modifiedLength
      );
      
      // Compute inner changes if both sides have content
      let innerChanges: RangeMapping[] | undefined;
      if (!origRange.isEmpty && !modRange.isEmpty && options.wordLevel) {
        innerChanges = this.computeInnerChanges(
          original.slice(origRange.start, origRange.end),
          modified.slice(modRange.start, modRange.end),
          origRange.start,
          modRange.start
        );
      }
      
      mappings.push(new DetailedLineRangeMapping(origRange, modRange, innerChanges));
      
      originalIndex = change.originalStart + change.originalLength;
      modifiedIndex = change.modifiedStart + change.modifiedLength;
    }
    
    // Add any remaining unchanged region
    if (originalIndex < original.length || modifiedIndex < modified.length) {
      mappings.push(new DetailedLineRangeMapping(
        new LineRangeImpl(originalIndex, original.length),
        new LineRangeImpl(modifiedIndex, modified.length)
      ));
    }
    
    return mappings;
  }
  
  private computeInnerChanges(
    originalLines: string[],
    modifiedLines: string[],
    originalOffset: number,
    modifiedOffset: number
  ): RangeMapping[] {
    // For now, return empty array - will be implemented with CharacterDiffComputer
    return [];
  }
  
  private detectMovedBlocks(
    original: string[],
    modified: string[],
    mappings: DetailedLineRangeMapping[],
    options: DiffOptions
  ): MovedText[] {
    const minSize = options.minMoveSize || 3;
    const moves: MovedText[] = [];
    
    // Create hash map of deleted and added blocks
    const deletedBlocks = new Map<string, LineRange[]>();
    const addedBlocks = new Map<string, LineRange[]>();
    
    for (const mapping of mappings) {
      if (!mapping.modified.isEmpty && mapping.original.isEmpty) {
        // This is an addition
        const hash = this.hashLines(modified.slice(mapping.modified.start, mapping.modified.end));
        if (!addedBlocks.has(hash)) {
          addedBlocks.set(hash, []);
        }
        addedBlocks.get(hash)!.push(mapping.modified);
      } else if (!mapping.original.isEmpty && mapping.modified.isEmpty) {
        // This is a deletion
        const hash = this.hashLines(original.slice(mapping.original.start, mapping.original.end));
        if (!deletedBlocks.has(hash)) {
          deletedBlocks.set(hash, []);
        }
        deletedBlocks.get(hash)!.push(mapping.original);
      }
    }
    
    // Find matching blocks
    for (const [hash, deleted] of deletedBlocks) {
      const added = addedBlocks.get(hash);
      if (added) {
        for (const delRange of deleted) {
          for (const addRange of added) {
            if (delRange.lineCount >= minSize) {
              moves.push({
                original: delRange,
                modified: addRange,
                similarity: 1.0 // Exact match
              });
            }
          }
        }
      }
    }
    
    return moves;
  }
  
  private hashLines(lines: string[]): string {
    // Simple hash for now - could be improved with a proper hash function
    return lines.join('\n');
  }
}

// Export a default instance for convenience
export const defaultDiffComputer = new MyersDiffComputer();