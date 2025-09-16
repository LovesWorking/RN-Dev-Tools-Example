import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistedClient } from "@tanstack/react-query-persist-client";

// Create a persister that uses AsyncStorage
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "REACT_QUERY_OFFLINE_CACHE",
  serialize: (data: PersistedClient) => {
    // Filter out local queries before serializing
    const filteredData: PersistedClient = {
      ...data,
      clientState: {
        ...data.clientState,
        queries: data.clientState.queries.filter((query) => {
          // Don't persist local queries or storage queries
          const queryKey = query.queryKey;
          if (Array.isArray(queryKey)) {
            // Skip local queries and storage queries
            if (queryKey[0] === "local" || queryKey[0] === "#storage") {
              return false;
            }
          }
          return true;
        }),
      },
    };
    return JSON.stringify(filteredData);
  },
  deserialize: (stringifiedData: string) =>
    JSON.parse(stringifiedData) as PersistedClient,
});
