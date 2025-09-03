// AsyncStorage will be loaded lazily
let AsyncStorageModule: any = null;
let asyncStorageLoadPromise: Promise<void> | null = null;

const loadAsyncStorage = async () => {
  if (asyncStorageLoadPromise) return asyncStorageLoadPromise;

  asyncStorageLoadPromise = (async () => {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      AsyncStorageModule = module.default;
      console.log(
        "[AsyncStorageListener] AsyncStorage module loaded successfully",
      );
    } catch (error) {
      console.warn(
        "[AsyncStorageListener] AsyncStorage not found. Listener disabled.",
        error,
      );
    }
  })();

  return asyncStorageLoadPromise;
};

// Event types for AsyncStorage operations
export interface AsyncStorageEvent {
  action:
    | "setItem"
    | "removeItem"
    | "mergeItem"
    | "clear"
    | "multiSet"
    | "multiRemove"
    | "multiMerge";
  timestamp: Date;
  data?: {
    key?: string;
    value?: string;
    keys?: string[];
    pairs?: Array<[string, string]>;
  };
}

export type AsyncStorageEventListener = (event: AsyncStorageEvent) => void;

class AsyncStorageListener {
  private listeners: AsyncStorageEventListener[] = [];
  private isListening = false;
  private isInitialized = false;

  // Keys to ignore for dev tools to prevent self-triggering
  private ignoredKeys = new Set([
    "@devtools_diff_mode",
    "@devtools_diff_options",
    "REACT_QUERY_OFFLINE_CACHE",
    "@devtools_", // Prefix check for all dev tools keys
  ]);

  // Store original methods
  private originalSetItem: any;
  private originalRemoveItem: any;
  private originalMergeItem: any;
  private originalClear: any;
  private originalMultiSet: any;
  private originalMultiRemove: any;
  private originalMultiMerge: any;

  constructor() {
    console.log("[AsyncStorageListener] Initializing listener singleton");
  }

  private shouldIgnoreKey(key: string): boolean {
    // Check exact matches
    if (this.ignoredKeys.has(key)) return true;

    // Check prefix matches
    for (const ignoredKey of this.ignoredKeys) {
      if (key.startsWith(ignoredKey)) return true;
    }

    return false;
  }

  // Initialize and store original methods
  private async initialize() {
    if (this.isInitialized) {
      console.log("[AsyncStorageListener] Already initialized - skipping");
      return true;
    }

    await loadAsyncStorage();

    if (!AsyncStorageModule) {
      console.error("[AsyncStorageListener] AsyncStorage module not available");
      return false;
    }

    // Check if methods are already swizzled by checking the function name
    if (AsyncStorageModule.setItem.name === "swizzled_setItem") {
      console.error(
        "[AsyncStorageListener] CRITICAL: AsyncStorage methods are already swizzled! " +
          "This means another instance of AsyncStorageListener is already running. " +
          "This should not happen with singleton pattern.",
      );
      // Don't store swizzled methods as originals
      return false;
    }

    // Store original methods (these should be the real AsyncStorage methods)
    this.originalSetItem = AsyncStorageModule.setItem.bind(AsyncStorageModule);
    this.originalRemoveItem =
      AsyncStorageModule.removeItem.bind(AsyncStorageModule);
    this.originalMergeItem =
      AsyncStorageModule.mergeItem.bind(AsyncStorageModule);
    this.originalClear = AsyncStorageModule.clear.bind(AsyncStorageModule);
    this.originalMultiSet =
      AsyncStorageModule.multiSet.bind(AsyncStorageModule);
    this.originalMultiRemove =
      AsyncStorageModule.multiRemove.bind(AsyncStorageModule);
    this.originalMultiMerge = AsyncStorageModule.multiMerge
      ? AsyncStorageModule.multiMerge.bind(AsyncStorageModule)
      : null;

    console.log("[AsyncStorageListener] Original methods stored successfully");
    this.isInitialized = true;

    return true;
  }

  // Restore original AsyncStorage methods
  private restoreOriginalMethods() {
    if (!AsyncStorageModule || !this.originalSetItem) {
      return;
    }

    AsyncStorageModule.setItem = this.originalSetItem;
    AsyncStorageModule.removeItem = this.originalRemoveItem;
    AsyncStorageModule.mergeItem = this.originalMergeItem;
    AsyncStorageModule.clear = this.originalClear;
    AsyncStorageModule.multiSet = this.originalMultiSet;
    AsyncStorageModule.multiRemove = this.originalMultiRemove;
    if (this.originalMultiMerge) {
      AsyncStorageModule.multiMerge = this.originalMultiMerge;
    }
  }

  // Emit event to all listeners
  private emit(event: AsyncStorageEvent) {
    // Skip emitting if there are no listeners
    if (this.listeners.length === 0) {
      console.log(
        `[AsyncStorageListener] Skipping event emission (no listeners): ${event.action}`,
        event.data?.key || event.data?.keys || "",
      );
      return;
    }

    console.log(`[AsyncStorageListener] Emitting event: ${event.action}`, {
      timestamp: event.timestamp.toISOString(),
      data: event.data,
      listenerCount: this.listeners.length,
    });

    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.warn("[AsyncStorageListener] Error in event listener:", error);
      }
    });
  }

  // Start listening to AsyncStorage operations
  async startListening() {
    if (this.isListening) {
      console.warn(
        "[AsyncStorageListener] Already listening - skipping re-initialization",
      );
      return;
    }

    const initialized = await this.initialize();
    if (!initialized) {
      console.error(
        "[AsyncStorageListener] Failed to initialize - AsyncStorage not available",
      );
      return;
    }

    // Check if methods are already swizzled (this can happen if initialize was called twice somehow)
    if (AsyncStorageModule.setItem.name === "swizzled_setItem") {
      console.warn(
        "[AsyncStorageListener] Methods already swizzled - restoring originals first",
      );
      this.restoreOriginalMethods();
    }

    console.log(
      "[AsyncStorageListener] Starting to listen for AsyncStorage operations",
    );

    // Swizzle setItem
    const swizzled_setItem = async (key: string, value: string) => {
      console.log(
        `[AsyncStorageListener] Intercepted setItem: key="${key}", value="${value?.substring(0, 100)}..."`,
      );

      // Only emit event if key is not ignored
      if (!this.shouldIgnoreKey(key)) {
        this.emit({
          action: "setItem",
          timestamp: new Date(),
          data: { key, value },
        });
      } else {
        console.log(`[AsyncStorageListener] Ignoring setItem for key: ${key}`);
      }

      return this.originalSetItem(key, value);
    };
    Object.defineProperty(swizzled_setItem, "name", {
      value: "swizzled_setItem",
    });
    AsyncStorageModule.setItem = swizzled_setItem;

    // Swizzle removeItem
    AsyncStorageModule.removeItem = async (key: string) => {
      console.log(
        `[AsyncStorageListener] Intercepted removeItem: key="${key}"`,
      );

      // Only emit event if key is not ignored
      if (!this.shouldIgnoreKey(key)) {
        this.emit({
          action: "removeItem",
          timestamp: new Date(),
          data: { key },
        });
      } else {
        console.log(
          `[AsyncStorageListener] Ignoring removeItem for key: ${key}`,
        );
      }

      return this.originalRemoveItem(key);
    };

    // Swizzle mergeItem
    AsyncStorageModule.mergeItem = async (key: string, value: string) => {
      console.log(
        `[AsyncStorageListener] Intercepted mergeItem: key="${key}", value="${value?.substring(0, 100)}..."`,
      );

      // Only emit event if key is not ignored
      if (!this.shouldIgnoreKey(key)) {
        this.emit({
          action: "mergeItem",
          timestamp: new Date(),
          data: { key, value },
        });
      } else {
        console.log(
          `[AsyncStorageListener] Ignoring mergeItem for key: ${key}`,
        );
      }

      return this.originalMergeItem(key, value);
    };

    // Swizzle clear
    AsyncStorageModule.clear = async () => {
      console.log("[AsyncStorageListener] Intercepted clear");
      this.emit({
        action: "clear",
        timestamp: new Date(),
      });
      return this.originalClear();
    };

    // Swizzle multiSet
    AsyncStorageModule.multiSet = async (
      keyValuePairs: readonly (readonly [string, string])[],
    ) => {
      console.log(
        `[AsyncStorageListener] Intercepted multiSet: ${keyValuePairs.length} pairs`,
      );

      // Filter out ignored keys
      const filteredPairs = keyValuePairs.filter(
        ([key]) => !this.shouldIgnoreKey(key),
      );

      if (filteredPairs.length > 0) {
        this.emit({
          action: "multiSet",
          timestamp: new Date(),
          data: { pairs: filteredPairs as Array<[string, string]> },
        });
      } else {
        console.log(`[AsyncStorageListener] All keys in multiSet are ignored`);
      }

      return this.originalMultiSet(keyValuePairs);
    };

    // Swizzle multiRemove
    AsyncStorageModule.multiRemove = async (keys: readonly string[]) => {
      console.log(
        `[AsyncStorageListener] Intercepted multiRemove: ${keys.length} keys`,
      );

      // Filter out ignored keys
      const filteredKeys = keys.filter((key) => !this.shouldIgnoreKey(key));

      if (filteredKeys.length > 0) {
        this.emit({
          action: "multiRemove",
          timestamp: new Date(),
          data: { keys: filteredKeys as string[] },
        });
      } else {
        console.log(
          `[AsyncStorageListener] All keys in multiRemove are ignored`,
        );
      }

      return this.originalMultiRemove(keys);
    };

    // Swizzle multiMerge if available
    if (this.originalMultiMerge) {
      AsyncStorageModule.multiMerge = async (
        keyValuePairs: readonly (readonly [string, string])[],
      ) => {
        console.log(
          `[AsyncStorageListener] Intercepted multiMerge: ${keyValuePairs.length} pairs`,
        );

        // Filter out ignored keys
        const filteredPairs = keyValuePairs.filter(
          ([key]) => !this.shouldIgnoreKey(key),
        );

        if (filteredPairs.length > 0) {
          this.emit({
            action: "multiMerge",
            timestamp: new Date(),
            data: { pairs: filteredPairs as Array<[string, string]> },
          });
        } else {
          console.log(
            `[AsyncStorageListener] All keys in multiMerge are ignored`,
          );
        }

        return this.originalMultiMerge(keyValuePairs);
      };
    }

    this.isListening = true;
    console.log("[AsyncStorageListener] Started listening successfully");
  }

  // Stop listening and restore original methods
  stopListening() {
    if (!this.isListening) {
      console.warn("[AsyncStorageListener] Not currently listening");
      return;
    }

    if (!AsyncStorageModule) {
      console.warn("[AsyncStorageListener] AsyncStorage module not loaded");
      return;
    }

    console.log(
      "[AsyncStorageListener] Stopping listener and restoring original methods",
    );

    // Restore original methods
    AsyncStorageModule.setItem = this.originalSetItem;
    AsyncStorageModule.removeItem = this.originalRemoveItem;
    AsyncStorageModule.mergeItem = this.originalMergeItem;
    AsyncStorageModule.clear = this.originalClear;
    AsyncStorageModule.multiSet = this.originalMultiSet;
    AsyncStorageModule.multiRemove = this.originalMultiRemove;
    if (this.originalMultiMerge) {
      AsyncStorageModule.multiMerge = this.originalMultiMerge;
    }

    this.isListening = false;
    console.log("[AsyncStorageListener] Stopped listening successfully");
  }

  // Add event listener
  addListener(listener: AsyncStorageEventListener) {
    console.log(
      `[AsyncStorageListener] Adding listener (total will be: ${this.listeners.length + 1})`,
    );
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
        console.log(
          `[AsyncStorageListener] Removed listener (remaining: ${this.listeners.length})`,
        );
      }
    };
  }

  // Remove all listeners
  removeAllListeners() {
    const count = this.listeners.length;
    this.listeners = [];
    console.log(`[AsyncStorageListener] Removed all ${count} listeners`);
  }

  // Check if currently listening
  get isActive() {
    return this.isListening;
  }

  // Get number of active listeners
  get listenerCount() {
    return this.listeners.length;
  }
}

// Create singleton instance
const asyncStorageListener = new AsyncStorageListener();

// Simple API functions
export const startListening = () => asyncStorageListener.startListening();
export const stopListening = () => asyncStorageListener.stopListening();
export const addListener = (listener: AsyncStorageEventListener) =>
  asyncStorageListener.addListener(listener);
export const removeAllListeners = () =>
  asyncStorageListener.removeAllListeners();
export const isListening = () => asyncStorageListener.isActive;
export const getListenerCount = () => asyncStorageListener.listenerCount;

// Export the instance for advanced usage
export default asyncStorageListener;
