import AsyncStorage from "@react-native-async-storage/async-storage";

// Pure JS storage wrapper that mimics MMKV API
class StorageWrapper {
  async set(key: string, value: string | number | boolean): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  async getString(key: string): Promise<string | undefined> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? undefined;
    } catch (error) {
      console.error('Storage getString error:', error);
      return undefined;
    }
  }

  async getNumber(key: string): Promise<number | undefined> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    } catch (error) {
      console.error('Storage getNumber error:', error);
      return undefined;
    }
  }

  async getBoolean(key: string): Promise<boolean | undefined> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return value === 'true';
      }
      return undefined;
    } catch (error) {
      console.error('Storage getBoolean error:', error);
      return undefined;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys]; // Create a mutable copy
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  }

  // Synchronous methods that MMKV supports but we'll make async
  // The callers will need to be updated to handle promises
  contains(key: string): boolean {
    console.warn('Synchronous contains() not supported in pure JS mode. Use async methods.');
    return false;
  }
}

export const storage = new StorageWrapper();