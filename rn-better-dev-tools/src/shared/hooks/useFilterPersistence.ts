import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook for persisting filter state to AsyncStorage
 * @param storageKey - The AsyncStorage key to use for persistence
 * @param defaultValue - Default value if nothing is stored
 * @param visible - Whether the parent component is visible (to trigger loading)
 * @returns [value, setValue, isLoaded] - The persisted value, setter, and loading state
 */
export function useFilterPersistence<T>(
  storageKey: string,
  defaultValue: T,
  visible: boolean = true
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load persisted value on mount
  useEffect(() => {
    if (!visible || hasLoadedRef.current) return;

    const loadValue = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setValue(parsed);
        }
        hasLoadedRef.current = true;
        setIsLoaded(true);
      } catch (error) {
        // Silently fail - use default value
        console.warn(`Failed to load filter from ${storageKey}:`, error);
        setIsLoaded(true);
      }
    };

    loadValue();
  }, [visible, storageKey]);

  // Save value when it changes
  useEffect(() => {
    if (!hasLoadedRef.current) return; // Don't save on initial load

    const saveValue = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        // Silently fail - value will remain in memory
        console.warn(`Failed to save filter to ${storageKey}:`, error);
      }
    };

    saveValue();
  }, [value, storageKey]);

  return [value, setValue, isLoaded];
}

/**
 * Hook for persisting Set-based filters (like ignored domains/URLs)
 * @param storageKey - The AsyncStorage key to use for persistence
 * @param defaultValue - Default Set if nothing is stored
 * @param visible - Whether the parent component is visible
 * @returns [Set, setSet, isLoaded] - The persisted Set, setter, and loading state
 */
export function useSetFilterPersistence(
  storageKey: string,
  defaultValue: Set<string> = new Set(),
  visible: boolean = true
): [Set<string>, (value: Set<string>) => void, boolean] {
  const [value, setValue] = useState<Set<string>>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load persisted value on mount
  useEffect(() => {
    if (!visible || hasLoadedRef.current) return;

    const loadValue = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          setValue(new Set(parsed));
        }
        hasLoadedRef.current = true;
        setIsLoaded(true);
      } catch (error) {
        console.warn(`Failed to load Set filter from ${storageKey}:`, error);
        setIsLoaded(true);
      }
    };

    loadValue();
  }, [visible, storageKey]);

  // Save value when it changes
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const saveValue = async () => {
      try {
        const array = Array.from(value);
        await AsyncStorage.setItem(storageKey, JSON.stringify(array));
      } catch (error) {
        console.warn(`Failed to save Set filter to ${storageKey}:`, error);
      }
    };

    saveValue();
  }, [value, storageKey]);

  return [value, setValue, isLoaded];
}