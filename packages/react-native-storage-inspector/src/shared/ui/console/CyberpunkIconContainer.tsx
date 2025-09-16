import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface CyberpunkIconContainerProps {
  children: ReactNode;
  color: string;
  size?: number;
}

export function CyberpunkIconContainer({
  children,
  color,
  size = 42,
}: CyberpunkIconContainerProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background with border effect */}
      <View
        style={[
          styles.background,
          {
            borderColor: color,
            backgroundColor: color + "10",
          },
        ]}
      />

      {/* Corner accents */}
      <View style={[styles.cornerTop, { backgroundColor: color }]} />
      <View style={[styles.cornerBottom, { backgroundColor: color }]} />

      {/* Icon */}
      <View style={styles.iconWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 8,
    opacity: 0.8,
  },
  cornerTop: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 3,
    height: 3,
    borderRadius: 1,
  },
  cornerBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 3,
    height: 3,
    borderRadius: 1,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});