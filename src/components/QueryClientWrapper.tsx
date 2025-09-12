import { FC, ReactNode } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
// import { useSyncQueriesExternal } from "react-query-external-sync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { asyncStoragePersister } from "@/src/storage/queryPersister";

interface QueryClientWrapperProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const QueryClientWrapper: FC<QueryClientWrapperProps> = ({
  children,
  queryClient,
}) => {
  // Unified storage queries and external sync - all in one hook!
  // Temporarily disabled - missing socket.io-client dependency
  // useSyncQueriesExternal({
  //   queryClient,
  //   socketURL: "http://localhost:42831",
  //   deviceName: Platform.OS,
  //   platform: Platform.OS,
  //   deviceId: Platform.OS,
  //   extraDeviceInfo: {
  //     "test-device-info": "test123",
  //   },
  //   enableLogs: false,
  //   envVariables: {
  //     "test-env-var": "test",
  //   },
  //   // mmkvStorage removed - using AsyncStorage instead for pure JS compatibility
  //   asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
  //   secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
  //   secureStorageKeys: [
  //     "sessionToken",
  //     "auth.session",
  //     "auth.email",
  //     "auth.last_sync",
  //     "knock_push_token",
  //   ], // SecureStore keys to monitor
  // });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateMutation: () => true, // Always persist mutations
        },
      }}
      onSuccess={() => {
        // Resume any paused mutations after successful hydration
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
