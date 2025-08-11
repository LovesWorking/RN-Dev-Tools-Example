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
import "react-native-reanimated";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientWrapper } from "@/app/_components/QueryClientWrapper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { PokemonTheme } from "@/constants/PokemonTheme";
import { View } from "react-native";
import {
  RnBetterDevToolsBubble,
  UserRole,
} from "@/src/_components/floating-bubble/bubble";
import { createEnvVarConfig, Environment, envVar } from "@/src/_sections/env";

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
  const userRole: UserRole = "admin";
  const environment: Environment = "local";
  const requiredEnvVars = createEnvVarConfig([
    // 🟢 GREEN - Valid variables
    envVar("EXPO_PUBLIC_API_URL").exists(), // ✓ Exists

    envVar("EXPO_PUBLIC_DEBUG_MODE")
      .withType("boolean")
      .withDescription("Enable debug logging")
      .build(), // ✓ Correct type

    envVar("EXPO_PUBLIC_MAX_RETRIES").withType("number").build(), // ✓ Correct type

    envVar("EXPO_PUBLIC_ENVIRONMENT").withValue("development").build(), // ✓ Correct value

    // 🟠 ORANGE - Wrong values (exists but incorrect)
    envVar("EXPO_PUBLIC_API_VERSION")
      .withValue("v2")
      .withDescription("API version (should be v2)")
      .build(), // ⚠ Wrong value

    envVar("EXPO_PUBLIC_REGION").withValue("us-east-1").build(), // ⚠ Wrong value

    // 🔴 RED - Wrong types (exists but wrong type)
    envVar("EXPO_PUBLIC_FEATURE_FLAGS")
      .withDescription("Feature flags configuration object")
      .withType("object")
      .build(), // ⚠ Wrong type

    envVar("EXPO_PUBLIC_PORT").withType("number").build(), // ⚠ Wrong type

    // 🔴 RED - Missing variables
    envVar("EXPO_PUBLIC_SENTRY_DSN").exists(), // ⚠ Missing

    envVar("EXPO_PUBLIC_ANALYTICS_KEY")
      .withDescription("Analytics service API key")
      .withType("string")
      .build(), // ⚠ Missing

    envVar("EXPO_PUBLIC_ENABLE_TELEMETRY").withType("boolean").build(), // ⚠ Missing
  ]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientWrapper queryClient={queryClient}>
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
          <RnBetterDevToolsBubble
            queryClient={queryClient}
            requiredEnvVars={requiredEnvVars}
            userRole={userRole}
            environment={environment}
          />
        </View>
      </QueryClientWrapper>
    </GestureHandlerRootView>
  );
}
