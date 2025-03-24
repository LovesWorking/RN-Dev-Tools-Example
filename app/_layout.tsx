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
import { useSyncQueries } from "tanstack-query-dev-tools-expo-plugin";

import { useColorScheme } from "@/hooks/useColorScheme";
import { DevToolsBubble } from "react-native-react-query-devtools";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  useSyncQueries({ queryClient });
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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
