import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Clipboard,
  Platform,
} from "react-native";

interface ShapeStyle {
  // Dimensions
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;

  // Position
  position?: "absolute" | "relative";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  zIndex?: number;

  // Background
  backgroundColor?: string;
  opacity?: number;

  // Borders
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderStyle?: "solid" | "dotted" | "dashed";

  // Transform
  transform?: any[];

  // Shadows (iOS)
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;

  // Android
  elevation?: number;

  // Other
  overflow?: "visible" | "hidden";
  backfaceVisibility?: "visible" | "hidden";
}

interface TransformValues {
  rotate: string;
  rotateX: string;
  rotateY: string;
  rotateZ: string;
  scale: number;
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  skewX: string;
  skewY: string;
}

const PRESET_SHAPES: Record<string, ShapeStyle> = {
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#61DAFB",
  },
  reactOrbit: {
    width: 90,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#61DAFB",
    backgroundColor: "transparent",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid" as const,
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#61DAFB",
  },
  diamond: {
    width: 80,
    height: 80,
    backgroundColor: "#61DAFB",
    transform: [{ rotate: "45deg" }],
  },
  hexagon: {
    width: 100,
    height: 55,
    backgroundColor: "#61DAFB",
  },
  oval: {
    width: 120,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#61DAFB",
  },
  star: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid" as const,
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#61DAFB",
  },
  heart: {
    width: 50,
    height: 45,
    backgroundColor: "#FF0000",
    transform: [{ rotate: "-45deg" }],
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
};

export const UniversalShapeEditor = () => {
  const [shapeStyle, setShapeStyle] = useState<ShapeStyle>(
    PRESET_SHAPES.circle,
  );
  const [transformValues, setTransformValues] = useState<TransformValues>({
    rotate: "0deg",
    rotateX: "0deg",
    rotateY: "0deg",
    rotateZ: "0deg",
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: "0deg",
    skewY: "0deg",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("circle");

  // Update individual style property
  const updateStyle = useCallback((key: keyof ShapeStyle, value: any) => {
    setShapeStyle((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Update transform
  const updateTransform = useCallback(
    (key: keyof TransformValues, value: any) => {
      setTransformValues((prev) => {
        const updated = { ...prev, [key]: value };
        // Build transform array
        const transforms: any[] = [];
        if (updated.rotate !== "0deg")
          transforms.push({ rotate: updated.rotate });
        if (updated.rotateX !== "0deg")
          transforms.push({ rotateX: updated.rotateX });
        if (updated.rotateY !== "0deg")
          transforms.push({ rotateY: updated.rotateY });
        if (updated.rotateZ !== "0deg")
          transforms.push({ rotateZ: updated.rotateZ });
        if (updated.scale !== 1) transforms.push({ scale: updated.scale });
        if (updated.scaleX !== 1) transforms.push({ scaleX: updated.scaleX });
        if (updated.scaleY !== 1) transforms.push({ scaleY: updated.scaleY });
        if (updated.translateX !== 0)
          transforms.push({ translateX: updated.translateX });
        if (updated.translateY !== 0)
          transforms.push({ translateY: updated.translateY });
        if (updated.skewX !== "0deg") transforms.push({ skewX: updated.skewX });
        if (updated.skewY !== "0deg") transforms.push({ skewY: updated.skewY });

        setShapeStyle((prev) => ({
          ...prev,
          transform: transforms.length > 0 ? transforms : undefined,
        }));

        return updated;
      });
    },
    [],
  );

  // Load preset
  const loadPreset = useCallback((presetName: string) => {
    const preset = PRESET_SHAPES[presetName as keyof typeof PRESET_SHAPES];
    if (preset) {
      setShapeStyle(preset);
      setSelectedPreset(presetName);
      // Reset transforms
      setTransformValues({
        rotate: "0deg",
        rotateX: "0deg",
        rotateY: "0deg",
        rotateZ: "0deg",
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        skewX: "0deg",
        skewY: "0deg",
      });
    }
  }, []);

  // Copy style to clipboard
  const copyToClipboard = useCallback(
    (format: "stylesheet" | "inline" | "component") => {
      let output = "";

      // Clean up undefined values
      const cleanStyle = Object.entries(shapeStyle).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key as keyof ShapeStyle] = value;
          }
          return acc;
        },
        {} as ShapeStyle,
      );

      switch (format) {
        case "stylesheet":
          output = `const styles = StyleSheet.create({
  shape: ${JSON.stringify(cleanStyle, null, 2).replace(/"([^"]+)":/g, "$1:")}
});`;
          break;

        case "inline":
          output = `style={${JSON.stringify(cleanStyle, null, 2).replace(
            /"([^"]+)":/g,
            "$1:",
          )}}`;
          break;

        case "component":
          output = `import React from 'react';
import { View, StyleSheet } from 'react-native';

export const CustomShape = () => {
  return <View style={styles.shape} />;
};

const styles = StyleSheet.create({
  shape: ${JSON.stringify(cleanStyle, null, 2).replace(/"([^"]+)":/g, "$1:")}
});`;
          break;
      }

      Clipboard.setString(output);
      Alert.alert("Copied!", `Style copied as ${format} format`);
    },
    [shapeStyle],
  );

  // Render control based on type
  const renderControl = (
    label: string,
    key: keyof ShapeStyle,
    type: "number" | "color" | "select" | "switch",
    options?: any,
  ) => {
    const value = shapeStyle[key];

    switch (type) {
      case "number":
        return (
          <View style={styles.control}>
            <Text style={styles.controlLabel}>{label}</Text>
            <View style={styles.controlInput}>
              <TextInput
                style={styles.numberInput}
                value={value?.toString() || ""}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  if (!isNaN(num)) updateStyle(key, num);
                }}
                keyboardType="numeric"
                placeholder="0"
              />
              {options?.slider && (
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => {
                      const current = (value as number) || 0;
                      const min = options.min || 0;
                      const newVal = Math.max(
                        min,
                        current - (options.step || 1),
                      );
                      updateStyle(key, newVal);
                    }}
                  >
                    <Text style={styles.sliderButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.sliderValue}>
                    {typeof value === "number" ? value.toFixed(1) : "0"}
                  </Text>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => {
                      const current = (value as number) || 0;
                      const max = options.max || 100;
                      const newVal = Math.min(
                        max,
                        current + (options.step || 1),
                      );
                      updateStyle(key, newVal);
                    }}
                  >
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );

      case "color":
        return (
          <View style={styles.control}>
            <Text style={styles.controlLabel}>{label}</Text>
            <View style={styles.colorControl}>
              <TextInput
                style={styles.colorInput}
                value={(value as string) || ""}
                onChangeText={(text) => updateStyle(key, text)}
                placeholder="#000000"
                autoCapitalize="none"
              />
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: (value as string) || "#000" },
                ]}
              />
            </View>
          </View>
        );

      case "select":
        return (
          <View style={styles.control}>
            <Text style={styles.controlLabel}>{label}</Text>
            <View style={styles.selectButtons}>
              {options?.values?.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.selectButton,
                    value === opt && styles.selectButtonActive,
                  ]}
                  onPress={() => updateStyle(key, opt)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      value === opt && styles.selectButtonTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "switch":
        return (
          <View style={styles.control}>
            <Text style={styles.controlLabel}>{label}</Text>
            <Switch
              value={Boolean(value)}
              onValueChange={(val) => updateStyle(key, val)}
              trackColor={{ false: "#ccc", true: "#61DAFB" }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Preview at top - outside ScrollView */}
      <View style={styles.fixedPreviewSection}>
        <Text style={styles.previewTitle}>Universal Shape Editor</Text>
        <View style={styles.previewContainer}>
          <View style={styles.previewGrid}>
            <View style={[styles.shapePreview, shapeStyle]} />
          </View>
        </View>
      </View>

      {/* Scrollable controls */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.presetButtons}>
              {Object.keys(PRESET_SHAPES).map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    selectedPreset === preset && styles.presetButtonActive,
                  ]}
                  onPress={() => loadPreset(preset)}
                >
                  <Text style={styles.presetButtonText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Dimensions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensions</Text>
          {renderControl("Width", "width", "number", {
            slider: true,
            max: 200,
            step: 5,
          })}
          {renderControl("Height", "height", "number", {
            slider: true,
            max: 200,
            step: 5,
          })}
          {renderControl("Aspect Ratio", "aspectRatio", "number", {
            slider: true,
            max: 3,
            step: 0.1,
          })}
          {showAdvanced && (
            <>
              {renderControl("Min Width", "minWidth", "number")}
              {renderControl("Max Width", "maxWidth", "number")}
              {renderControl("Min Height", "minHeight", "number")}
              {renderControl("Max Height", "maxHeight", "number")}
            </>
          )}
        </View>

        {/* Background */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background</Text>
          {renderControl("Background Color", "backgroundColor", "color")}
          {renderControl("Opacity", "opacity", "number", {
            slider: true,
            max: 1,
            step: 0.05,
          })}
        </View>

        {/* Borders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Borders</Text>
          {renderControl("Border Width", "borderWidth", "number", {
            slider: true,
            max: 20,
            step: 1,
          })}
          {renderControl("Border Color", "borderColor", "color")}
          {renderControl("Border Radius", "borderRadius", "number", {
            slider: true,
            max: 100,
            step: 5,
          })}
          {renderControl("Border Style", "borderStyle", "select", {
            values: ["solid", "dotted", "dashed"],
          })}
          {showAdvanced && (
            <>
              <Text style={styles.subSectionTitle}>Individual Borders</Text>
              {renderControl("Top Width", "borderTopWidth", "number", {
                slider: true,
                max: 20,
                step: 1,
              })}
              {renderControl("Bottom Width", "borderBottomWidth", "number", {
                slider: true,
                max: 20,
                step: 1,
              })}
              {renderControl("Left Width", "borderLeftWidth", "number", {
                slider: true,
                max: 20,
                step: 1,
              })}
              {renderControl("Right Width", "borderRightWidth", "number", {
                slider: true,
                max: 20,
                step: 1,
              })}
              {renderControl("Top Color", "borderTopColor", "color")}
              {renderControl("Bottom Color", "borderBottomColor", "color")}
              {renderControl("Left Color", "borderLeftColor", "color")}
              {renderControl("Right Color", "borderRightColor", "color")}
              <Text style={styles.subSectionTitle}>Corner Radius</Text>
              {renderControl("Top Left", "borderTopLeftRadius", "number", {
                slider: true,
                max: 100,
                step: 5,
              })}
              {renderControl("Top Right", "borderTopRightRadius", "number", {
                slider: true,
                max: 100,
                step: 5,
              })}
              {renderControl(
                "Bottom Left",
                "borderBottomLeftRadius",
                "number",
                { slider: true, max: 100, step: 5 },
              )}
              {renderControl(
                "Bottom Right",
                "borderBottomRightRadius",
                "number",
                { slider: true, max: 100, step: 5 },
              )}
            </>
          )}
        </View>

        {/* Transform */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transform</Text>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Rotate</Text>
            <View style={styles.controlInput}>
              <TextInput
                style={styles.numberInput}
                value={transformValues.rotate}
                onChangeText={(text) => updateTransform("rotate", text)}
                placeholder="0deg"
              />
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {
                    const current = parseFloat(transformValues.rotate) || 0;
                    updateTransform(
                      "rotate",
                      `${Math.max(-180, current - 10)}deg`,
                    );
                  }}
                >
                  <Text style={styles.sliderButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.sliderValue}>
                  {parseFloat(transformValues.rotate).toFixed(0)}°
                </Text>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {
                    const current = parseFloat(transformValues.rotate) || 0;
                    updateTransform(
                      "rotate",
                      `${Math.min(180, current + 10)}deg`,
                    );
                  }}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.control}>
            <Text style={styles.controlLabel}>Scale</Text>
            <View style={styles.controlInput}>
              <TextInput
                style={styles.numberInput}
                value={transformValues.scale.toString()}
                onChangeText={(text) => {
                  const num = parseFloat(text);
                  if (!isNaN(num)) updateTransform("scale", num);
                }}
                keyboardType="numeric"
                placeholder="1"
              />
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {
                    const current = transformValues.scale;
                    updateTransform("scale", Math.max(0, current - 0.1));
                  }}
                >
                  <Text style={styles.sliderButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.sliderValue}>
                  {transformValues.scale.toFixed(1)}
                </Text>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => {
                    const current = transformValues.scale;
                    updateTransform("scale", Math.min(3, current + 0.1));
                  }}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showAdvanced && (
            <>
              <View style={styles.control}>
                <Text style={styles.controlLabel}>Scale X</Text>
                <View style={styles.controlInput}>
                  <TextInput
                    style={styles.numberInput}
                    value={transformValues.scaleX.toString()}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      if (!isNaN(num)) updateTransform("scaleX", num);
                    }}
                    keyboardType="numeric"
                  />
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "scaleX",
                          Math.max(0, transformValues.scaleX - 0.1),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.sliderValue}>
                      {transformValues.scaleX.toFixed(1)}
                    </Text>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "scaleX",
                          Math.min(3, transformValues.scaleX + 0.1),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.control}>
                <Text style={styles.controlLabel}>Scale Y</Text>
                <View style={styles.controlInput}>
                  <TextInput
                    style={styles.numberInput}
                    value={transformValues.scaleY.toString()}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      if (!isNaN(num)) updateTransform("scaleY", num);
                    }}
                    keyboardType="numeric"
                  />
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "scaleY",
                          Math.max(0, transformValues.scaleY - 0.1),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.sliderValue}>
                      {transformValues.scaleY.toFixed(1)}
                    </Text>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "scaleY",
                          Math.min(3, transformValues.scaleY + 0.1),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.control}>
                <Text style={styles.controlLabel}>Translate X</Text>
                <View style={styles.controlInput}>
                  <TextInput
                    style={styles.numberInput}
                    value={transformValues.translateX.toString()}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      if (!isNaN(num)) updateTransform("translateX", num);
                    }}
                    keyboardType="numeric"
                  />
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "translateX",
                          Math.max(-100, transformValues.translateX - 5),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.sliderValue}>
                      {transformValues.translateX.toFixed(0)}
                    </Text>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "translateX",
                          Math.min(100, transformValues.translateX + 5),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.control}>
                <Text style={styles.controlLabel}>Translate Y</Text>
                <View style={styles.controlInput}>
                  <TextInput
                    style={styles.numberInput}
                    value={transformValues.translateY.toString()}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      if (!isNaN(num)) updateTransform("translateY", num);
                    }}
                    keyboardType="numeric"
                  />
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "translateY",
                          Math.max(-100, transformValues.translateY - 5),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.sliderValue}>
                      {transformValues.translateY.toFixed(0)}
                    </Text>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() =>
                        updateTransform(
                          "translateY",
                          Math.min(100, transformValues.translateY + 5),
                        )
                      }
                    >
                      <Text style={styles.sliderButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.control}>
                <Text style={styles.controlLabel}>Skew X</Text>
                <TextInput
                  style={styles.numberInput}
                  value={transformValues.skewX}
                  onChangeText={(text) => updateTransform("skewX", text)}
                  placeholder="0deg"
                />
              </View>

              <View style={styles.control}>
                <Text style={styles.controlLabel}>Skew Y</Text>
                <TextInput
                  style={styles.numberInput}
                  value={transformValues.skewY}
                  onChangeText={(text) => updateTransform("skewY", text)}
                  placeholder="0deg"
                />
              </View>
            </>
          )}
        </View>

        {/* Position */}
        {showAdvanced && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Position</Text>
            {renderControl("Position", "position", "select", {
              values: ["relative", "absolute"],
            })}
            {renderControl("Top", "top", "number")}
            {renderControl("Bottom", "bottom", "number")}
            {renderControl("Left", "left", "number")}
            {renderControl("Right", "right", "number")}
            {renderControl("Z-Index", "zIndex", "number")}
          </View>
        )}

        {/* Shadows */}
        {Platform.OS === "ios" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shadow (iOS)</Text>
            {renderControl("Shadow Color", "shadowColor", "color")}
            {renderControl("Shadow Opacity", "shadowOpacity", "number", {
              slider: true,
              max: 1,
              step: 0.05,
            })}
            {renderControl("Shadow Radius", "shadowRadius", "number", {
              slider: true,
              max: 20,
              step: 1,
            })}
          </View>
        )}

        {/* Elevation */}
        {Platform.OS === "android" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elevation (Android)</Text>
            {renderControl("Elevation", "elevation", "number", {
              slider: true,
              max: 20,
              step: 1,
            })}
          </View>
        )}

        {/* Other */}
        {showAdvanced && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other</Text>
            {renderControl("Overflow", "overflow", "select", {
              values: ["visible", "hidden"],
            })}
            {renderControl(
              "Backface Visibility",
              "backfaceVisibility",
              "select",
              {
                values: ["visible", "hidden"],
              },
            )}
          </View>
        )}

        {/* Toggle Advanced */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.advancedToggleText}>
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </Text>
          </TouchableOpacity>
        </View>

        {/* Copy Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => copyToClipboard("stylesheet")}
            >
              <Text style={styles.exportButtonText}>Copy as StyleSheet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => copyToClipboard("inline")}
            >
              <Text style={styles.exportButtonText}>Copy as Inline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => copyToClipboard("component")}
            >
              <Text style={styles.exportButtonText}>Copy as Component</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Style Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Style</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {JSON.stringify(shapeStyle, null, 2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    maxHeight: "100%",
  },
  fixedPreviewSection: {
    backgroundColor: "#20232a",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    borderBottomWidth: 2,
    borderBottomColor: "#61DAFB30",
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#61DAFB",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: "#666",
  },
  previewContainer: {
    height: 120,
    backgroundColor: "#282c34",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#61DAFB20",
  },
  previewGrid: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shapePreview: {
    // Shape styles will be applied dynamically
  },
  control: {
    marginBottom: 15,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#666",
  },
  controlInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 80,
    marginRight: 10,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#61DAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sliderValue: {
    minWidth: 50,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  colorControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  selectButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  selectButtonActive: {
    backgroundColor: "#61DAFB",
    borderColor: "#61DAFB",
  },
  selectButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  presetButtons: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 5,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  presetButtonActive: {
    backgroundColor: "#61DAFB",
    borderColor: "#61DAFB",
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  advancedToggle: {
    paddingVertical: 10,
    alignItems: "center",
  },
  advancedToggleText: {
    fontSize: 16,
    color: "#61DAFB",
    fontWeight: "600",
  },
  exportButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  exportButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#61DAFB",
    alignItems: "center",
  },
  exportButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  codeBlock: {
    backgroundColor: "#20232a",
    padding: 15,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    color: "#61DAFB",
  },
});
