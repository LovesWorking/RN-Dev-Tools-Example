import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import type { DiffTheme } from "../themes/diffThemes";

interface DiffSummaryProps {
  added: number;
  removed: number;
  modified: number;
  theme: DiffTheme;
  style?: ViewStyle;
}

export function DiffSummary({ added, removed, modified, theme, style }: DiffSummaryProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.summaryBackground, borderTopColor: theme.borderColor }, style]}> 
      <View style={styles.item}><Text style={[styles.text, { color: theme.summaryAddedText }]}>+{added}</Text></View>
      <View style={styles.item}><Text style={[styles.text, { color: theme.summaryRemovedText }]}>-{removed}</Text></View>
      <View style={styles.item}><Text style={[styles.text, { color: theme.summaryModifiedText }]}>~{modified}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});

