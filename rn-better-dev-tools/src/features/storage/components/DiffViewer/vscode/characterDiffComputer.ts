/**
 * Character-level diff computation for inline changes
 * Provides word and character level diff within changed lines
 */

export interface Token {
  value: string;
  isWhitespace: boolean;
  start: number;
  end: number;
}

export interface CharacterChange {
  originalStart: number;
  originalEnd: number;
  modifiedStart: number;
  modifiedEnd: number;
  type: 'added' | 'removed' | 'modified';
}

export interface CharDiffOptions {
  wordLevel: boolean;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  trimWhitespace: boolean;
}

export class CharacterDiffComputer {
  constructor(private options: CharDiffOptions = { 
    wordLevel: true, 
    ignoreWhitespace: false,
    ignoreCase: false,
    trimWhitespace: false
  }) {}
  
  /**
   * Compute character-level differences between two lines
   */
  computeCharDiff(
    originalLine: string,
    modifiedLine: string,
    options?: Partial<CharDiffOptions>
  ): CharacterChange[] {
    const mergedOptions = { ...this.options, ...options };
    
    // Preprocess lines based on options
    let processedOriginal = originalLine;
    let processedModified = modifiedLine;
    
    if (mergedOptions.trimWhitespace) {
      processedOriginal = processedOriginal.trim();
      processedModified = processedModified.trim();
    }
    
    if (mergedOptions.ignoreCase) {
      processedOriginal = processedOriginal.toLowerCase();
      processedModified = processedModified.toLowerCase();
    }
    
    // Tokenize based on word or character level
    const originalTokens = this.tokenize(processedOriginal, mergedOptions);
    const modifiedTokens = this.tokenize(processedModified, mergedOptions);
    
    // Compute diff on tokens
    const changes = this.computeTokenDiff(originalTokens, modifiedTokens, mergedOptions);
    
    return changes;
  }
  
  /**
   * Tokenize a line for diff computation
   */
  private tokenize(line: string, options: CharDiffOptions): Token[] {
    const tokens: Token[] = [];
    
    if (options.wordLevel) {
      // Split by word boundaries, preserving whitespace and punctuation
      const regex = /(\s+|[a-zA-Z0-9_]+|[^a-zA-Z0-9_\s])/g;
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const value = match[0];
        tokens.push({
          value,
          isWhitespace: /^\s+$/.test(value),
          start: match.index,
          end: match.index + value.length
        });
      }
    } else {
      // Character level tokenization
      for (let i = 0; i < line.length; i++) {
        tokens.push({
          value: line[i],
          isWhitespace: /\s/.test(line[i]),
          start: i,
          end: i + 1
        });
      }
    }
    
    return tokens;
  }
  
  /**
   * Compute diff between token arrays using LCS algorithm
   */
  private computeTokenDiff(
    originalTokens: Token[],
    modifiedTokens: Token[],
    options: CharDiffOptions
  ): CharacterChange[] {
    const changes: CharacterChange[] = [];
    
    // Build LCS matrix
    const lcs = this.computeLCS(originalTokens, modifiedTokens, options);
    
    // Reconstruct changes from LCS
    let i = originalTokens.length;
    let j = modifiedTokens.length;
    const operations: Array<{ type: 'match' | 'delete' | 'insert', i?: number, j?: number }> = [];
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && this.tokensEqual(originalTokens[i - 1], modifiedTokens[j - 1], options)) {
        operations.unshift({ type: 'match', i: i - 1, j: j - 1 });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        operations.unshift({ type: 'insert', j: j - 1 });
        j--;
      } else if (i > 0) {
        operations.unshift({ type: 'delete', i: i - 1 });
        i--;
      }
    }
    
    // Convert operations to character changes
    let currentChange: CharacterChange | null = null;
    
    for (const op of operations) {
      if (op.type === 'match') {
        // Flush current change if any
        if (currentChange) {
          changes.push(currentChange);
          currentChange = null;
        }
      } else if (op.type === 'delete') {
        const token = originalTokens[op.i!];
        if (currentChange && currentChange.type === 'removed' && 
            currentChange.originalEnd === token.start) {
          // Extend current deletion
          currentChange.originalEnd = token.end;
        } else {
          // Start new deletion or flush and start
          if (currentChange) {
            changes.push(currentChange);
          }
          currentChange = {
            originalStart: token.start,
            originalEnd: token.end,
            modifiedStart: -1,
            modifiedEnd: -1,
            type: 'removed'
          };
        }
      } else if (op.type === 'insert') {
        const token = modifiedTokens[op.j!];
        if (currentChange && currentChange.type === 'added' && 
            currentChange.modifiedEnd === token.start) {
          // Extend current addition
          currentChange.modifiedEnd = token.end;
        } else {
          // Start new addition or flush and start
          if (currentChange) {
            changes.push(currentChange);
          }
          currentChange = {
            originalStart: -1,
            originalEnd: -1,
            modifiedStart: token.start,
            modifiedEnd: token.end,
            type: 'added'
          };
        }
      }
    }
    
    // Flush final change
    if (currentChange) {
      changes.push(currentChange);
    }
    
    // Merge adjacent add/remove into modifications
    return this.mergeChanges(changes);
  }
  
  /**
   * Compute Longest Common Subsequence matrix
   */
  private computeLCS(
    originalTokens: Token[],
    modifiedTokens: Token[],
    options: CharDiffOptions
  ): number[][] {
    const m = originalTokens.length;
    const n = modifiedTokens.length;
    const lcs: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (this.tokensEqual(originalTokens[i - 1], modifiedTokens[j - 1], options)) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }
    
    return lcs;
  }
  
  /**
   * Check if two tokens are equal based on options
   */
  private tokensEqual(token1: Token, token2: Token, options: CharDiffOptions): boolean {
    if (options.ignoreWhitespace && token1.isWhitespace && token2.isWhitespace) {
      return true;
    }
    
    let val1 = token1.value;
    let val2 = token2.value;
    
    if (options.ignoreCase) {
      val1 = val1.toLowerCase();
      val2 = val2.toLowerCase();
    }
    
    return val1 === val2;
  }
  
  /**
   * Merge adjacent additions and removals into modifications
   */
  private mergeChanges(changes: CharacterChange[]): CharacterChange[] {
    const merged: CharacterChange[] = [];
    let i = 0;
    
    while (i < changes.length) {
      const current = changes[i];
      
      // Look for adjacent add/remove pair to merge into modification
      if (i < changes.length - 1) {
        const next = changes[i + 1];
        
        if ((current.type === 'removed' && next.type === 'added') ||
            (current.type === 'added' && next.type === 'removed')) {
          // Merge into modification
          merged.push({
            originalStart: current.type === 'removed' ? current.originalStart : next.originalStart,
            originalEnd: current.type === 'removed' ? current.originalEnd : next.originalEnd,
            modifiedStart: current.type === 'added' ? current.modifiedStart : next.modifiedStart,
            modifiedEnd: current.type === 'added' ? current.modifiedEnd : next.modifiedEnd,
            type: 'modified'
          });
          i += 2;
          continue;
        }
      }
      
      merged.push(current);
      i++;
    }
    
    return merged;
  }
  
  /**
   * Compute inline diff for multiple lines
   */
  computeMultilineCharDiff(
    originalLines: string[],
    modifiedLines: string[],
    originalOffset: number = 0,
    modifiedOffset: number = 0
  ): Map<number, CharacterChange[]> {
    const lineChanges = new Map<number, CharacterChange[]>();
    
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const modifiedLine = modifiedLines[i] || '';
      
      if (originalLine !== modifiedLine) {
        const changes = this.computeCharDiff(originalLine, modifiedLine);
        
        // Adjust offsets for line position
        const adjustedChanges = changes.map(change => ({
          ...change,
          originalStart: change.originalStart >= 0 ? change.originalStart : -1,
          originalEnd: change.originalEnd >= 0 ? change.originalEnd : -1,
          modifiedStart: change.modifiedStart >= 0 ? change.modifiedStart : -1,
          modifiedEnd: change.modifiedEnd >= 0 ? change.modifiedEnd : -1
        }));
        
        if (adjustedChanges.length > 0) {
          lineChanges.set(i, adjustedChanges);
        }
      }
    }
    
    return lineChanges;
  }
}

// Export default instance
export const defaultCharDiffComputer = new CharacterDiffComputer();