import React from "react";
import { StyleSheet, Pressable, View, Text, Dimensions } from "react-native";
import { IconType } from "./DialDevTools";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEW_SIZE = 60;
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 320);
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const START_ANGLE = (-1 * Math.PI) / 2;

type Props = {
  index: number;
  icon: IconType;
  open: any; // Keep for compatibility but unused
  onPress: (index: number) => void;
  selectedIcon: number;
  totalIcons: number;
};

const DialIcon: React.FC<Props> = ({
  index,
  icon,
  open,
  onPress,
  selectedIcon,
  totalIcons,
}) => {
  const ANGLE_PER_VIEW = (2 * Math.PI) / totalIcons;
  const angle = START_ANGLE + ANGLE_PER_VIEW * index;
  
  // Calculate position
  const x = CIRCLE_RADIUS + (CIRCLE_RADIUS - VIEW_SIZE / 2 - 20) * Math.cos(angle) - VIEW_SIZE / 2;
  const y = CIRCLE_RADIUS + (CIRCLE_RADIUS - VIEW_SIZE / 2 - 20) * Math.sin(angle) - VIEW_SIZE / 2;

  const isSelected = selectedIcon === index;

  return (
    <View
      style={[
        styles.view,
        {
          left: x,
          top: y,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(index)}
        style={[
          styles.pressable,
          isSelected && styles.pressableSelected,
          {
            backgroundColor: isSelected ? icon.color + "15" : "transparent",
            shadowColor: isSelected ? icon.color : "transparent",
            transform: [{ scale: isSelected ? 1.1 : 1 }],
          }
        ]}
      >
        {/* Icon with glow effect */}
        <View style={styles.iconWrapper}>
          {icon.icon}
        </View>
        
        {/* Label */}
        <Text style={[
          styles.label,
          { 
            color: isSelected ? icon.color : "#9CA3AF",
            textShadowColor: isSelected ? icon.color : "transparent",
          }
        ]}>
          {icon.name.toUpperCase()}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: "absolute",
    width: VIEW_SIZE,
    height: VIEW_SIZE,
  },
  pressable: {
    width: "100%",
    height: "100%",
    borderRadius: VIEW_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  pressableSelected: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  iconWrapper: {
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
    fontFamily: "monospace",
    marginTop: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});

export default DialIcon;