/**
 * Reactive View Model for Diff Viewer
 * Uses React hooks for state management instead of MobX
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  MyersDiffComputer, 
  DiffResult, 
  DiffOptions, 
  DetailedLineRangeMapping,
  MovedText 
} from './diffComputer';
import { CharacterDiffComputer, CharacterChange } from './characterDiffComputer';

export interface DiffViewModelState {
  originalText: string;
  modifiedText: string;
  diffResult: DiffResult | null;
  isComputing: boolean;
  error: string | null;
  options: DiffOptions;
}

export interface DiffViewModelActions {
  updateDiff: (original: string, modified: string) => Promise<void>;
  updateOptions: (options: Partial<DiffOptions>) => void;
  reset: () => void;
}

export interface UseDiffViewModelReturn extends DiffViewModelState {
  actions: DiffViewModelActions;
  mappings: DetailedLineRangeMapping[];
  movedBlocks: MovedText[];
  originalLines: string[];
  modifiedLines: string[];
  getCharChanges: (lineIndex: number) => CharacterChange[] | undefined;
}

/**
 * Hook for managing diff view model state
 */
export function useDiffViewModel(
  initialOriginal: string = '',
  initialModified: string = '',
  initialOptions: DiffOptions = {}
): UseDiffViewModelReturn {
  const [state, setState] = useState<DiffViewModelState>({
    originalText: initialOriginal,
    modifiedText: initialModified,
    diffResult: null,
    isComputing: false,
    error: null,
    options: {
      timeout: 5000,
      wordLevel: true,
      ignoreWhitespace: false,
      detectMoves: true,
      minMoveSize: 3,
      maxComputationTime: 5000,
      ...initialOptions
    }
  });
  
  const diffComputer = useRef(new MyersDiffComputer(state.options));
  const charDiffComputer = useRef(new CharacterDiffComputer({
    wordLevel: state.options.wordLevel ?? true,
    ignoreWhitespace: state.options.ignoreWhitespace ?? false,
    ignoreCase: false,
    trimWhitespace: false
  }));
  
  // Computed values
  const originalLines = useMemo(() => 
    state.originalText.split('\n'),
    [state.originalText]
  );
  
  const modifiedLines = useMemo(() => 
    state.modifiedText.split('\n'),
    [state.modifiedText]
  );
  
  const mappings = useMemo(() => 
    state.diffResult?.mappings || [],
    [state.diffResult]
  );
  
  const movedBlocks = useMemo(() => 
    state.diffResult?.moves || [],
    [state.diffResult]
  );
  
  // Character changes cache
  const charChangesCache = useRef<Map<string, CharacterChange[]>>(new Map());
  
  // Actions
  const updateDiff = useCallback(async (original: string, modified: string) => {
    setState(prev => ({
      ...prev,
      originalText: original,
      modifiedText: modified,
      isComputing: true,
      error: null
    }));
    
    try {
      // Clear character changes cache
      charChangesCache.current.clear();
      
      // Compute diff
      const result = await new Promise<DiffResult>((resolve) => {
        // Simulate async computation
        setTimeout(() => {
          const computed = diffComputer.current.computeDiff(
            original.split('\n'),
            modified.split('\n'),
            state.options
          );
          resolve(computed);
        }, 0);
      });
      
      // Compute character changes for modified lines
      for (const mapping of result.mappings) {
        if (!mapping.original.isEmpty && !mapping.modified.isEmpty) {
          // This is a modification - compute character changes
          const origLines = original.split('\n').slice(
            mapping.original.start,
            mapping.original.end
          );
          const modLines = modified.split('\n').slice(
            mapping.modified.start,
            mapping.modified.end
          );
          
          const lineChanges = charDiffComputer.current.computeMultilineCharDiff(
            origLines,
            modLines,
            mapping.original.start,
            mapping.modified.start
          );
          
          // Cache the changes
          for (const [lineIdx, changes] of lineChanges) {
            const globalLineIdx = mapping.modified.start + lineIdx;
            charChangesCache.current.set(`mod-${globalLineIdx}`, changes);
            
            // Also cache for original side
            const origGlobalIdx = mapping.original.start + lineIdx;
            charChangesCache.current.set(`orig-${origGlobalIdx}`, changes);
          }
        }
      }
      
      setState(prev => ({
        ...prev,
        diffResult: result,
        isComputing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isComputing: false,
        error: error instanceof Error ? error.message : 'Failed to compute diff'
      }));
    }
  }, [state.options]);
  
  const updateOptions = useCallback((newOptions: Partial<DiffOptions>) => {
    setState(prev => ({
      ...prev,
      options: { ...prev.options, ...newOptions }
    }));
    
    // Update computers with new options
    diffComputer.current = new MyersDiffComputer({ ...state.options, ...newOptions });
    charDiffComputer.current = new CharacterDiffComputer({
      wordLevel: newOptions.wordLevel ?? state.options.wordLevel ?? true,
      ignoreWhitespace: newOptions.ignoreWhitespace ?? state.options.ignoreWhitespace ?? false,
      ignoreCase: false,
      trimWhitespace: false
    });
    
    // Recompute diff if we have text
    if (state.originalText || state.modifiedText) {
      updateDiff(state.originalText, state.modifiedText);
    }
  }, [state.options, state.originalText, state.modifiedText, updateDiff]);
  
  const reset = useCallback(() => {
    setState({
      originalText: '',
      modifiedText: '',
      diffResult: null,
      isComputing: false,
      error: null,
      options: state.options
    });
    charChangesCache.current.clear();
  }, [state.options]);
  
  const getCharChanges = useCallback((lineIndex: number): CharacterChange[] | undefined => {
    return charChangesCache.current.get(`mod-${lineIndex}`);
  }, []);
  
  // Auto-compute diff when text changes
  useEffect(() => {
    if (initialOriginal || initialModified) {
      updateDiff(initialOriginal, initialModified);
    }
  }, [initialOriginal, initialModified, updateDiff]); // Re-compute when text changes
  
  return {
    ...state,
    actions: {
      updateDiff,
      updateOptions,
      reset
    },
    mappings,
    movedBlocks,
    originalLines,
    modifiedLines,
    getCharChanges
  };
}

/**
 * Class-based view model for compatibility
 */
export class DiffViewModel {
  private _state: DiffViewModelState;
  private _listeners: Set<() => void> = new Set();
  private _diffComputer: MyersDiffComputer;
  private _charDiffComputer: CharacterDiffComputer;
  private _charChangesCache: Map<string, CharacterChange[]> = new Map();
  
  constructor(options: DiffOptions = {}) {
    this._state = {
      originalText: '',
      modifiedText: '',
      diffResult: null,
      isComputing: false,
      error: null,
      options: {
        timeout: 5000,
        wordLevel: true,
        ignoreWhitespace: false,
        detectMoves: true,
        minMoveSize: 3,
        maxComputationTime: 5000,
        ...options
      }
    };
    
    this._diffComputer = new MyersDiffComputer(this._state.options);
    this._charDiffComputer = new CharacterDiffComputer({
      wordLevel: this._state.options.wordLevel ?? true,
      ignoreWhitespace: this._state.options.ignoreWhitespace ?? false,
      ignoreCase: false,
      trimWhitespace: false
    });
  }
  
  get state(): DiffViewModelState {
    return this._state;
  }
  
  get mappings(): DetailedLineRangeMapping[] {
    return this._state.diffResult?.mappings || [];
  }
  
  get movedBlocks(): MovedText[] {
    return this._state.diffResult?.moves || [];
  }
  
  get originalLines(): string[] {
    return this._state.originalText.split('\n');
  }
  
  get modifiedLines(): string[] {
    return this._state.modifiedText.split('\n');
  }
  
  async updateDiff(original: string, modified: string): Promise<void> {
    this._setState({
      ...this._state,
      originalText: original,
      modifiedText: modified,
      isComputing: true,
      error: null
    });
    
    try {
      this._charChangesCache.clear();
      
      const result = this._diffComputer.computeDiff(
        original.split('\n'),
        modified.split('\n'),
        this._state.options
      );
      
      // Compute character changes
      for (const mapping of result.mappings) {
        if (!mapping.original.isEmpty && !mapping.modified.isEmpty) {
          const origLines = original.split('\n').slice(
            mapping.original.start,
            mapping.original.end
          );
          const modLines = modified.split('\n').slice(
            mapping.modified.start,
            mapping.modified.end
          );
          
          const lineChanges = this._charDiffComputer.computeMultilineCharDiff(
            origLines,
            modLines,
            mapping.original.start,
            mapping.modified.start
          );
          
          for (const [lineIdx, changes] of lineChanges) {
            const globalLineIdx = mapping.modified.start + lineIdx;
            this._charChangesCache.set(`mod-${globalLineIdx}`, changes);
            
            const origGlobalIdx = mapping.original.start + lineIdx;
            this._charChangesCache.set(`orig-${origGlobalIdx}`, changes);
          }
        }
      }
      
      this._setState({
        ...this._state,
        diffResult: result,
        isComputing: false
      });
    } catch (error) {
      this._setState({
        ...this._state,
        isComputing: false,
        error: error instanceof Error ? error.message : 'Failed to compute diff'
      });
    }
  }
  
  updateOptions(options: Partial<DiffOptions>): void {
    this._setState({
      ...this._state,
      options: { ...this._state.options, ...options }
    });
    
    this._diffComputer = new MyersDiffComputer({ ...this._state.options });
    this._charDiffComputer = new CharacterDiffComputer({
      wordLevel: this._state.options.wordLevel ?? true,
      ignoreWhitespace: this._state.options.ignoreWhitespace ?? false,
      ignoreCase: false,
      trimWhitespace: false
    });
    
    if (this._state.originalText || this._state.modifiedText) {
      this.updateDiff(this._state.originalText, this._state.modifiedText);
    }
  }
  
  getCharChanges(lineIndex: number): CharacterChange[] | undefined {
    return this._charChangesCache.get(`mod-${lineIndex}`);
  }
  
  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }
  
  private _setState(newState: DiffViewModelState): void {
    this._state = newState;
    this._listeners.forEach(listener => listener());
  }
}