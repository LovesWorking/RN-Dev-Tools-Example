import React from "react";
import { Pressable, StyleSheet, View, Dimensions, Text } from "react-native";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/src/_shared/icons/lucide-icons";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import DialIcon from "./DialIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 320); // Max 320px for better fit
const BUTTON_SIZE = 80; // Fixed button size

export type IconType = {
  name: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
};

interface DialDevToolsProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

const DialDevTools: React.FC<DialDevToolsProps> = ({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}) => {
  const [selectedIcon, setSelectedIcon] = React.useState(-1);

  const icons: IconType[] = [
    {
      name: "Query",
      icon: (
        <View style={styles.tanstackContainer}>
          <TanstackLogo />
        </View>
      ),
      color: "#00FFFF",
      onPress: onQueryPress,
    },
    {
      name: "Env",
      icon: <ServerIcon size={24} color="#00FFFF" />,
      color: "#00FFFF",
      onPress: onEnvPress,
    },
    {
      name: "Sentry",
      icon: <BugIcon size={24} color="#FF1744" />,
      color: "#FF1744",
      onPress: onSentryPress,
    },
    {
      name: "Storage",
      icon: <DatabaseIcon size={24} color="#00FF88" />,
      color: "#00FF88",
      onPress: onStoragePress,
    },
    {
      name: "WiFi",
      icon: isWifiEnabled ? (
        <WifiIcon size={24} color="#E040FB" />
      ) : (
        <WifiOffIcon size={24} color="#616161" />
      ),
      color: isWifiEnabled ? "#E040FB" : "#616161",
      onPress: onWifiToggle,
    },
    {
      name: "Close",
      icon: <XIcon size={24} color="#9E9E9E" />,
      color: "#424242",
      onPress: () => {
        handleClose();
      },
    },
  ];

  const handleClose = () => {
    // Close without animation to avoid scheduling issues
    if (onClose) {
      onClose();
    }
  };

  const handleIconPress = (index: number) => {
    setSelectedIcon(index);
    // Trigger the action immediately
    icons[index].onPress();
    handleClose();
  };

  return (
    <View style={styles.container}>
      {/* Dark overlay backdrop */}
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />
      </View>

      <View
        style={[
          styles.parent,
          {
            position: "absolute",
            left: (SCREEN_WIDTH - CIRCLE_SIZE) / 2, // Center horizontally
            bottom: 80, // Fixed distance from bottom
          },
        ]}
      >
        {/* Cyberpunk dial background */}
        <View style={styles.circle}>
          {/* Gradient background using layered Views */}
          <View style={styles.gradientBackground}>
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />

            {/* Matrix grid pattern */}
            <View style={styles.gridPattern}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.gridLine,
                    {
                      transform: [{ rotate: `${i * 60}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Icon items */}
          {icons.map((icon, i) => (
            <DialIcon
              selectedIcon={selectedIcon}
              onPress={handleIconPress}
              open={1}
              icon={icon}
              key={i}
              index={i}
              totalIcons={icons.length}
            />
          ))}
        </View>

        {/* Center label */}
        <View style={styles.buttonContainer}>
          {/* Button gradient using layered Views */}
          <View style={styles.buttonGradient}>
            <View style={styles.buttonGradientLayer1} />
            <View style={styles.buttonGradientLayer2} />
            <View style={styles.buttonGradientLayer3} />

            <View style={styles.buttonBorder}>
              <View style={styles.button}>
                {/* Main text with glow */}
                <Text style={styles.centerText}>RN BETTER</Text>
                <Text style={styles.centerText}>DEV TOOLS</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DialDevTools;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    opacity: 0.8,
  },
  parent: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.2)",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: CIRCLE_SIZE / 2,
    position: "relative",
    backgroundColor: "rgba(0,0,0,0.95)",
    overflow: "hidden",
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,20,0.98)",
    opacity: 0.9,
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,10,0.95)",
    opacity: 0.7,
    top: "30%",
    left: "30%",
  },
  gradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,30,0.9)",
    opacity: 0.5,
    top: "50%",
    left: "50%",
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  gridLine: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: 1,
    backgroundColor: "rgba(0, 255, 255, 0.1)",
  },
  buttonContainer: {
    zIndex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: BUTTON_SIZE * 1.5,
    height: BUTTON_SIZE * 1.5,
    borderRadius: BUTTON_SIZE,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.95)",
    position: "relative",
    overflow: "hidden",
  },
  buttonGradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,20,0.98)",
    opacity: 0.8,
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,10,0.95)",
    opacity: 0.6,
    top: "20%",
    left: "20%",
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,30,0.9)",
    opacity: 0.4,
    top: "40%",
    left: "40%",
    borderRadius: BUTTON_SIZE,
  },
  buttonBorder: {
    backgroundColor: "rgba(0, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    width: BUTTON_SIZE * 1.2,
    height: BUTTON_SIZE * 1.2,
    borderRadius: BUTTON_SIZE * 0.6,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.3)",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  tanstackContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
