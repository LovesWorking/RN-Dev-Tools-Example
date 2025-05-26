import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
// import { useSyncQueries } from "tanstack-query-dev-tools-expo-plugin";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { storage } from "../storage/mmkv";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create QueryClient as a singleton outside the component
const queryClient = new QueryClient();

// Initialize default storage values
const initializeDefaultStorageValues = async () => {
  try {
    // Set default MMKV value
    await storage.setAsync("demo_mmkv_value", "Hello from Mock MMKV!");

    // Set default AsyncStorage value
    await AsyncStorage.setItem("demo_async_value", "Hello from AsyncStorage!");

    // Set default SecureStore value
    await SecureStore.setItemAsync("userToken", "demo-jwt-token-12345");

    console.log("Default storage values initialized");
  } catch (error) {
    console.error("Error initializing default storage values:", error);
  }
};

export default function RootLayout() {
  // Expo dev plugin
  // useSyncQueries({ queryClient });
  // New external devtools with storage and environment variable sync
  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS + "pokemon", // Platform detection
    platform: Platform?.OS, // Use appropriate platform identifier
    deviceId: Platform?.OS + "pokemon", // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: true, // Enable logs to see storage sync in action
    envVariables: {
      NODE_ENV: process.env.NODE_ENV || "development",
      SECRET_KEY: process.env.SECRET_KEY || "demo-secret-key",
      DATABASE_URL: process.env.DATABASE_URL || "sqlite://demo.db",
      API_SECRET: process.env.API_SECRET || "demo-api-secret",
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    secureStorageKeys: [
      "userToken",
      "refreshToken",
      "biometricKey",
      "deviceId",
      "userPreferences",
      "authSecret",
    ], // SecureStore keys to monitor
  });
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize default storage values on app load
  useEffect(() => {
    initializeDefaultStorageValues();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <DevToolsBubble
        onCopy={async (text) => {
          try {
            console.log("Attempting to copy:", text);
            await Clipboard.setStringAsync(text);
            console.log("Copy successful");
            return true;
          } catch (error) {
            console.error("Failed to copy to clipboard:", error);
            return false;
          }
        }}
      />
    </QueryClientProvider>
  );
}
