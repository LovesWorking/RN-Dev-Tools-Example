import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 200,
  },
  row: {
    flexDirection: "row",
  },
  rightSide: {
    borderRightWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  coverContainer: {
    position: "absolute",
    overflow: "hidden",
    height: 0,
    zIndex: 1,
  },
  text: {
    color: "#000000",
    fontWeight: "bold",
    letterSpacing: 3,
  },
  glitchText: {
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  glitchImage: {
    shadowOffset: { width: 3, height: 2 },
    shadowRadius: 1,
  },
});
