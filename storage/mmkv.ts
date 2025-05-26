import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock MMKV implementation for Expo Go compatibility
// In a real app with development builds, you would use the actual MMKV package

class MockMMKV {
  private id: string;
  private encryptionKey?: string;

  constructor(config: { id: string; encryptionKey?: string }) {
    this.id = config.id;
    this.encryptionKey = config.encryptionKey;
  }

  private getKey(key: string): string {
    return `mmkv_${this.id}_${key}`;
  }

  set(key: string, value: string | number | boolean): void {
    const storageKey = this.getKey(key);
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    AsyncStorage.setItem(storageKey, stringValue).catch(console.error);
  }

  async setAsync(key: string, value: string | number | boolean): Promise<void> {
    const storageKey = this.getKey(key);
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(storageKey, stringValue);
  }

  getString(key: string): string | undefined {
    // Note: This is synchronous in real MMKV, but async in our mock
    // For demo purposes, we'll return undefined and handle async in the components
    return undefined;
  }

  async getStringAsync(key: string): Promise<string | null> {
    const storageKey = this.getKey(key);
    return await AsyncStorage.getItem(storageKey);
  }

  getNumber(key: string): number | undefined {
    return undefined;
  }

  async getNumberAsync(key: string): Promise<number | null> {
    const storageKey = this.getKey(key);
    const value = await AsyncStorage.getItem(storageKey);
    return value ? parseFloat(value) : null;
  }

  getBoolean(key: string): boolean | undefined {
    return undefined;
  }

  async getBooleanAsync(key: string): Promise<boolean | null> {
    const storageKey = this.getKey(key);
    const value = await AsyncStorage.getItem(storageKey);
    return value ? JSON.parse(value) : null;
  }

  delete(key: string): void {
    const storageKey = this.getKey(key);
    AsyncStorage.removeItem(storageKey).catch(console.error);
  }

  async deleteAsync(key: string): Promise<void> {
    const storageKey = this.getKey(key);
    await AsyncStorage.removeItem(storageKey);
  }

  getAllKeys(): string[] {
    // In real MMKV this is synchronous, but we'll need to handle this async
    return [];
  }

  async getAllKeysAsync(): Promise<string[]> {
    const allKeys = await AsyncStorage.getAllKeys();
    const prefix = `mmkv_${this.id}_`;
    return allKeys
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.replace(prefix, ""));
  }

  clearAll(): void {
    this.getAllKeysAsync()
      .then((keys) => {
        keys.forEach((key) => this.delete(key));
      })
      .catch(console.error);
  }
}

// Create mock MMKV storage instance
export const storage = new MockMMKV({
  id: "rn-dev-tools-example",
  encryptionKey: "demo-encryption-key", // In production, use a secure key
});

// Helper functions for easier usage with async operations
export const mmkvStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await storage.setAsync(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return await storage.getStringAsync(key);
  },
  removeItem: async (key: string): Promise<void> => {
    await storage.deleteAsync(key);
  },
  clear: () => {
    storage.clearAll();
  },
  getAllKeys: async (): Promise<string[]> => {
    return await storage.getAllKeysAsync();
  },
};

export default storage;
