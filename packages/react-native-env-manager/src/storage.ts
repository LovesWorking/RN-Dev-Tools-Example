import AsyncStorage from '@react-native-async-storage/async-storage';

export const ENV_STORAGE_KEYS = {
  ENV_OVERRIDES: '@env-manager:env-overrides',
  ENV_HISTORY: '@env-manager:env-history',
  ENV_PRESETS: '@env-manager:env-presets',
} as const;

export interface EnvOverride {
  key: string;
  value: string;
  timestamp: number;
}

export interface EnvPreset {
  id: string;
  name: string;
  description?: string;
  overrides: Record<string, string>;
  createdAt: number;
}

export const envStorage = {
  async getOverrides(): Promise<Record<string, string>> {
    try {
      const data = await AsyncStorage.getItem(ENV_STORAGE_KEYS.ENV_OVERRIDES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  async setOverrides(overrides: Record<string, string>): Promise<void> {
    await AsyncStorage.setItem(ENV_STORAGE_KEYS.ENV_OVERRIDES, JSON.stringify(overrides));
  },

  async getPresets(): Promise<EnvPreset[]> {
    try {
      const data = await AsyncStorage.getItem(ENV_STORAGE_KEYS.ENV_PRESETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async savePreset(preset: EnvPreset): Promise<void> {
    const presets = await this.getPresets();
    const updated = [...presets, preset];
    await AsyncStorage.setItem(ENV_STORAGE_KEYS.ENV_PRESETS, JSON.stringify(updated));
  },

  async deletePreset(id: string): Promise<void> {
    const presets = await this.getPresets();
    const filtered = presets.filter(p => p.id !== id);
    await AsyncStorage.setItem(ENV_STORAGE_KEYS.ENV_PRESETS, JSON.stringify(filtered));
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      ENV_STORAGE_KEYS.ENV_OVERRIDES,
      ENV_STORAGE_KEYS.ENV_HISTORY,
      ENV_STORAGE_KEYS.ENV_PRESETS
    ]);
  }
};