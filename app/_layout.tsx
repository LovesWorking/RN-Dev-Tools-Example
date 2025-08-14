import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientWrapper } from "@/app/_components/QueryClientWrapper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { View } from "react-native";
import { DevToolsThemeProvider } from "@/src/_themes/DevToolsThemeContext";

// import { RnBetterDevToolsBubble } from "@/src/_components/floating-bubble/bubble/RnBetterDevToolsBubble";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create QueryClient as a true singleton that survives hot reloads
// Store it in global to persist across module reloads
declare global {
  var __queryClient: QueryClient | undefined;
}

if (!global.__queryClient) {
  console.log("🚀 Creating NEW QueryClient (first load)");
  global.__queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Keep cache for 5 minutes even if component unmounts
        gcTime: 1000 * 60 * 5,
        // Keep data fresh for 30 seconds
        staleTime: 1000 * 30,
        // Retry failed requests
        retry: 1,
        // Refetch on mount if data is stale
        refetchOnMount: "always",
        // Don't refetch on window focus in development
        refetchOnWindowFocus: false,
      },
    },
  });
} else {
  console.log("♻️ Reusing existing QueryClient (hot reload)");
}

const queryClient = global.__queryClient;

export default function RootLayout() {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientWrapper queryClient={queryClient}>
        <DevToolsThemeProvider defaultTheme="cyberpunk">
          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={[PokemonTheme.colors.darkBg, "#1a1f3a", "#0A0E27"]}
              style={{ flex: 1 }}
            >
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
              </ThemeProvider>
            </LinearGradient>
          </View>
        </DevToolsThemeProvider>
      </QueryClientWrapper>
    </GestureHandlerRootView>
  );
}
