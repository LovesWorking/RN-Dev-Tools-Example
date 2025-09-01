/**
 * VS Code Dark Modern Theme for Diff Viewer
 * Exact colors from VS Code's Dark Modern theme
 */

export interface VSCodeDiffTheme {
  name: string;
  description: string;
  
  // Main backgrounds
  background: string;              // Editor background
  panelBackground: string;         // Panel background
  headerBackground: string;        // Header/title bar
  sidebarBackground: string;       // Sidebar background
  
  // Diff-specific colors (from VS Code source)
  addedBackground: string;         // Line-level addition background
  removedBackground: string;       // Line-level removal background
  addedLineBackground: string;     // Full line addition
  removedLineBackground: string;   // Full line removal
  modifiedLineBackground: string;  // Modified line background
  
  // Word-level highlights (character changes)
  addedWordHighlight: string;      // Inline addition highlight
  removedWordHighlight: string;    // Inline removal highlight
  modifiedWordHighlight: string;   // Inline modification highlight
  
  // Text colors
  addedText: string;               // Green text for additions
  removedText: string;             // Red text for deletions
  modifiedText: string;            // Blue for modifications
  unchangedText: string;           // Default text
  commentText: string;             // Comment color
  
  // Gutter and line numbers
  lineNumberBackground: string;
  lineNumberText: string;
  lineNumberActiveForeground: string;
  lineNumberBorder: string;
  gutterAddedBackground: string;
  gutterRemovedBackground: string;
  gutterModifiedBackground: string;
  
  // Markers (+/-)
  markerAddedBackground: string;
  markerRemovedBackground: string;
  markerText: string;
  
  // Borders and dividers
  borderColor: string;
  dividerColor: string;
  scrollbarSliderBackground: string;
  scrollbarSliderHoverBackground: string;
  
  // Unchanged regions (collapsed)
  unchangedRegionBackground: string;
  unchangedRegionForeground: string;
  unchangedRegionShadow: string;
  
  // Overview ruler (minimap)
  overviewRulerAdded: string;
  overviewRulerRemoved: string;
  overviewRulerModified: string;
  
  // Selection and hover
  selectionBackground: string;
  selectionForeground?: string;
  hoverBackground: string;
  highlightBackground: string;
  
  // Moved blocks
  movedBlockBackground: string;
  movedBlockBorder: string;
  movedBlockArrow: string;
  
  // Find match
  findMatchBackground: string;
  findMatchHighlightBackground: string;
  findMatchBorder: string;
  
  // Conflict markers
  conflictingBackground: string;
  conflictingBorder: string;
  
  // Syntax highlighting (for code in diff)
  keywordColor: string;
  stringColor: string;
  numberColor: string;
  functionColor: string;
  variableColor: string;
  typeColor: string;
  operatorColor: string;
}

/**
 * VS Code Dark Modern Theme
 * Exact colors extracted from VS Code source
 */
export const VSCodeDarkModernTheme: VSCodeDiffTheme = {
  name: "VS Code Dark Modern",
  description: "Exact replica of VS Code's Dark Modern theme",
  
  // Main backgrounds
  background: "#1e1e1e",                    // workbench.colorCustomizations.editor.background
  panelBackground: "#181818",               // panel.background
  headerBackground: "#2d2d30",              // titleBar.activeBackground
  sidebarBackground: "#252526",             // sideBar.background
  
  // Diff-specific colors (actual VS Code Dark Modern colors)
  addedBackground: "rgba(75, 107, 75, 0.25)",      // Subtle dark green background
  removedBackground: "rgba(90, 60, 60, 0.25)",     // Subtle dark red background
  addedLineBackground: "rgba(75, 107, 75, 0.25)",  // Full line addition
  removedLineBackground: "rgba(90, 60, 60, 0.25)", // Full line removal
  modifiedLineBackground: "rgba(102, 153, 204, 0.13)", // Modified lines
  
  // Word-level highlights (stronger for inline changes)
  addedWordHighlight: "rgba(75, 107, 75, 0.4)",      // Slightly stronger green
  removedWordHighlight: "rgba(90, 60, 60, 0.4)",     // Slightly stronger red
  modifiedWordHighlight: "rgba(102, 153, 204, 0.4)", // Modified word highlight
  
  // Text colors - softer, matching VS Code
  addedText: "#4EC775",                    // Softer green for added text
  removedText: "#F14C4C",                  // Softer red for removed text
  modifiedText: "#6699cc",                 // Blue for modified text
  unchangedText: "#d4d4d4",                // editor.foreground
  commentText: "#6a9955",                  // Comment green
  
  // Gutter and line numbers
  lineNumberBackground: "#1e1e1e",
  lineNumberText: "#858585",               // editorLineNumber.foreground
  lineNumberActiveForeground: "#c6c6c6",   // editorLineNumber.activeForeground
  lineNumberBorder: "#2d2d30",
  gutterAddedBackground: "rgba(75, 107, 75, 0.3)",
  gutterRemovedBackground: "rgba(90, 60, 60, 0.3)",
  gutterModifiedBackground: "rgba(102, 153, 204, 0.3)",
  
  // Markers (+/-)
  markerAddedBackground: "transparent",
  markerRemovedBackground: "transparent",
  markerText: "#858585",
  
  // Borders and dividers
  borderColor: "#464647",                  // panel.border
  dividerColor: "#464647",                 // editorGroup.border
  scrollbarSliderBackground: "rgba(121, 121, 121, 0.4)", // scrollbarSlider.background
  scrollbarSliderHoverBackground: "rgba(100, 100, 100, 0.7)", // scrollbarSlider.hoverBackground
  
  // Unchanged regions (collapsed)
  unchangedRegionBackground: "#202020",
  unchangedRegionForeground: "#858585",
  unchangedRegionShadow: "rgba(0, 0, 0, 0.36)",
  
  // Overview ruler (minimap indicators)
  overviewRulerAdded: "#9bb955",           // Solid green
  overviewRulerRemoved: "#ff6188",         // Solid red
  overviewRulerModified: "#6699cc",        // Solid blue
  
  // Selection and hover
  selectionBackground: "rgba(51, 153, 255, 0.2)",     // editor.selectionBackground
  selectionForeground: undefined,
  hoverBackground: "rgba(90, 93, 94, 0.31)",          // editor.hoverHighlightBackground
  highlightBackground: "rgba(234, 92, 0, 0.5)",       // editor.findMatchHighlightBackground
  
  // Moved blocks
  movedBlockBackground: "rgba(90, 156, 214, 0.1)",    // Light blue background
  movedBlockBorder: "#5a9cd6",                        // Blue border
  movedBlockArrow: "#5a9cd6",                         // Arrow color
  
  // Find match
  findMatchBackground: "rgba(234, 92, 0, 0.33)",      // editor.findMatchBackground
  findMatchHighlightBackground: "rgba(234, 92, 0, 0.17)", // editor.findMatchHighlightBackground
  findMatchBorder: "#ea5c00",                         // editor.findMatchBorder
  
  // Conflict markers
  conflictingBackground: "rgba(255, 139, 0, 0.3)",
  conflictingBorder: "#ff8b00",
  
  // Syntax highlighting colors for code in diff
  keywordColor: "#569cd6",                 // Blue keywords
  stringColor: "#ce9178",                  // Orange strings
  numberColor: "#b5cea8",                  // Light green numbers
  functionColor: "#dcdcaa",                // Yellow functions
  variableColor: "#9cdcfe",                // Light blue variables
  typeColor: "#4ec9b0",                    // Cyan types
  operatorColor: "#d4d4d4"                 // Default operators
};

/**
 * VS Code Dark+ Theme (Classic)
 */
export const VSCodeDarkPlusTheme: VSCodeDiffTheme = {
  ...VSCodeDarkModernTheme,
  name: "VS Code Dark+",
  description: "Classic VS Code Dark+ theme",
  background: "#1e1e1e",
  panelBackground: "#1e1e1e",
  headerBackground: "#252526",
  sidebarBackground: "#252526"
};

/**
 * VS Code Light Modern Theme
 */
export const VSCodeLightModernTheme: VSCodeDiffTheme = {
  name: "VS Code Light Modern",
  description: "VS Code's Light Modern theme",
  
  // Main backgrounds
  background: "#ffffff",
  panelBackground: "#f3f3f3",
  headerBackground: "#dddddd",
  sidebarBackground: "#f3f3f3",
  
  // Diff-specific colors
  addedBackground: "rgba(35, 134, 54, 0.2)",
  removedBackground: "rgba(217, 53, 73, 0.2)",
  addedLineBackground: "rgba(35, 134, 54, 0.13)",
  removedLineBackground: "rgba(217, 53, 73, 0.13)",
  modifiedLineBackground: "rgba(0, 87, 173, 0.13)",
  
  // Word-level highlights
  addedWordHighlight: "rgba(35, 134, 54, 0.4)",
  removedWordHighlight: "rgba(217, 53, 73, 0.4)",
  modifiedWordHighlight: "rgba(0, 87, 173, 0.4)",
  
  // Text colors
  addedText: "#238636",
  removedText: "#d93549",
  modifiedText: "#0057ad",
  unchangedText: "#000000",
  commentText: "#008000",
  
  // Gutter and line numbers
  lineNumberBackground: "#ffffff",
  lineNumberText: "#237893",
  lineNumberActiveForeground: "#0b216f",
  lineNumberBorder: "#dddddd",
  gutterAddedBackground: "rgba(35, 134, 54, 0.3)",
  gutterRemovedBackground: "rgba(217, 53, 73, 0.3)",
  gutterModifiedBackground: "rgba(0, 87, 173, 0.3)",
  
  // Markers
  markerAddedBackground: "transparent",
  markerRemovedBackground: "transparent",
  markerText: "#237893",
  
  // Borders and dividers
  borderColor: "#e5e5e5",
  dividerColor: "#e5e5e5",
  scrollbarSliderBackground: "rgba(100, 100, 100, 0.4)",
  scrollbarSliderHoverBackground: "rgba(100, 100, 100, 0.7)",
  
  // Unchanged regions
  unchangedRegionBackground: "#f8f8f8",
  unchangedRegionForeground: "#6e6e6e",
  unchangedRegionShadow: "rgba(0, 0, 0, 0.16)",
  
  // Overview ruler
  overviewRulerAdded: "#238636",
  overviewRulerRemoved: "#d93549",
  overviewRulerModified: "#0057ad",
  
  // Selection and hover
  selectionBackground: "rgba(0, 120, 215, 0.3)",
  hoverBackground: "rgba(0, 0, 0, 0.05)",
  highlightBackground: "rgba(234, 92, 0, 0.3)",
  
  // Moved blocks
  movedBlockBackground: "rgba(0, 87, 173, 0.1)",
  movedBlockBorder: "#0057ad",
  movedBlockArrow: "#0057ad",
  
  // Find match
  findMatchBackground: "rgba(234, 92, 0, 0.3)",
  findMatchHighlightBackground: "rgba(234, 92, 0, 0.15)",
  findMatchBorder: "#ea5c00",
  
  // Conflict markers
  conflictingBackground: "rgba(255, 139, 0, 0.3)",
  conflictingBorder: "#ff8b00",
  
  // Syntax highlighting
  keywordColor: "#0000ff",
  stringColor: "#a31515",
  numberColor: "#098658",
  functionColor: "#795e26",
  variableColor: "#001080",
  typeColor: "#267f99",
  operatorColor: "#000000"
};