import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiffModeSelector, DiffMode } from './DiffModeSelector';
import { DiffOptionsPanel, DiffOptions } from './DiffOptionsPanel';
import { InlineDiffView } from './modes/InlineDiffView';
import { EnhancedSplitView } from './modes/EnhancedSplitView';
import { UnifiedDiffView } from './modes/UnifiedDiffView';
import { StructureDiffView } from './modes/StructureDiffView';
import { objectDiff } from '../../utils/objectDiff';

interface MultiModeDiffViewerProps {
  oldValue: unknown;
  newValue: unknown;
  debugMode?: boolean; // For testing with visual markers
}

const STORAGE_KEY = '@devtools_diff_mode';
const OPTIONS_STORAGE_KEY = '@devtools_diff_options';

export function MultiModeDiffViewer({ oldValue, newValue, debugMode = false }: MultiModeDiffViewerProps) {
  
  const [currentMode, setCurrentMode] = useState<DiffMode>('inline');
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    hideLineNumbers: false,
    disableWordDiff: false,
    showDiffOnly: false,
    compareMethod: 'words',
    contextLines: 3,
    lineOffset: 0,
  });

  // Load saved preferences
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && ['inline', 'side-by-side', 'unified', 'structure'].includes(saved)) {
        setCurrentMode(saved as DiffMode);
      }
    });
    
    AsyncStorage.getItem(OPTIONS_STORAGE_KEY).then((saved) => {
      if (saved) {
        try {
          const options = JSON.parse(saved);
          setDiffOptions(options);
        } catch (e) {
          console.warn('Failed to parse saved diff options');
        }
      }
    });
  }, []);

  // Save mode preference
  const handleModeChange = (mode: DiffMode) => {
    setCurrentMode(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  };

  // Save options preference  
  const handleOptionsChange = useCallback((options: DiffOptions) => {
    setDiffOptions(options);
    // Save to storage without triggering events
    AsyncStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));
  }, []);

  // Parse values
  const parseValue = (value: unknown): unknown => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  // Calculate differences
  const { differences, changeCount } = useMemo(() => {
    const oldParsed = parseValue(oldValue);
    const newParsed = parseValue(newValue);

    // Only show diff for objects and arrays
    if (
      (!oldParsed || typeof oldParsed !== 'object') &&
      (!newParsed || typeof newParsed !== 'object')
    ) {
      return { differences: [], changeCount: 0 };
    }

    try {
      const diffs = objectDiff(oldParsed || {}, newParsed || {});
      return { differences: diffs, changeCount: diffs.length };
    } catch (error) {
      console.warn('Failed to calculate diff:', error);
      return { differences: [], changeCount: 0 };
    }
  }, [oldValue, newValue]);

  if (changeCount === 0) {
    return null;
  }

  const renderDiffView = () => {
    const props = {
      oldValue: parseValue(oldValue),
      newValue: parseValue(newValue),
      differences,
      debugMode,
      options: diffOptions,
    };

    switch (currentMode) {
      case 'inline':
        return <InlineDiffView {...props} />;
      case 'side-by-side':
        return <EnhancedSplitView {...props} />;
      case 'unified':
        return <UnifiedDiffView {...props} />;
      case 'structure':
        return <StructureDiffView {...props} />;
      default:
        return <InlineDiffView {...props} />;
    }
  };

  return (
    <View style={[styles.container, debugMode && styles.debugContainer]}>
      <DiffModeSelector
        currentMode={currentMode}
        onModeChange={handleModeChange}
        changeCount={changeCount}
      />
      <DiffOptionsPanel
        options={diffOptions}
        onOptionsChange={handleOptionsChange}
        isExpanded={optionsExpanded}
        onToggleExpanded={() => setOptionsExpanded(!optionsExpanded)}
      />
      {renderDiffView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  debugContainer: {
    borderWidth: 2,
    borderColor: 'purple',
    borderStyle: 'dashed',
    padding: 4,
  },
});