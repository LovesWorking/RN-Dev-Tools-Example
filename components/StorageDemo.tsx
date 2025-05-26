import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { storage } from "../storage/mmkv";

interface StorageItemProps {
  storageType: "mmkv" | "async" | "secure";
  storageKey: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const StorageItem: React.FC<StorageItemProps> = ({
  storageType,
  storageKey,
  title,
  icon,
  color,
}) => {
  const queryClient = useQueryClient();

  // Query to read from storage using the special storage query key format
  const { data: storedValue, isLoading } = useQuery({
    queryKey: ["#storage", storageType, storageKey],
    queryFn: async () => {
      try {
        switch (storageType) {
          case "mmkv":
            // Use async method for mock MMKV
            return await storage.getStringAsync(storageKey);
          case "async":
            return await AsyncStorage.getItem(storageKey);
          case "secure":
            return await SecureStore.getItemAsync(storageKey);
          default:
            return null;
        }
      } catch (error) {
        console.error(`Error reading from ${storageType}:`, error);
        return null;
      }
    },
    staleTime: 0, // Always refetch to show real-time updates
  });

  return (
    <ThemedView style={styles.storageItem}>
      <ThemedView style={styles.storageHeader}>
        <Ionicons name={icon} size={18} color={color} />
        <ThemedText style={styles.storageTitle}>{title}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.currentValue}>
        <ThemedText style={styles.valueLabel}>Current Value</ThemedText>
        <ThemedText style={styles.valueText}>
          {isLoading ? "Loading..." : storedValue || "No value stored"}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const StorageInputCard: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedStorage, setSelectedStorage] = useState<
    "mmkv" | "async" | "secure"
  >("mmkv");
  const queryClient = useQueryClient();

  const storageOptions = [
    {
      value: "mmkv",
      label: "MMKV Storage",
      key: "demo_mmkv_value",
      icon: "flash",
      color: "#8b5cf6",
    },
    {
      value: "async",
      label: "AsyncStorage",
      key: "demo_async_value",
      icon: "server",
      color: "#06b6d4",
    },
    {
      value: "secure",
      label: "SecureStore",
      key: "userToken",
      icon: "shield-checkmark",
      color: "#f59e0b",
    },
  ];

  const currentOption = storageOptions.find(
    (opt) => opt.value === selectedStorage
  )!;

  // Get current value for selected storage
  const { data: currentValue } = useQuery({
    queryKey: ["#storage", selectedStorage, currentOption.key],
    queryFn: async () => {
      try {
        switch (selectedStorage) {
          case "mmkv":
            return await storage.getStringAsync(currentOption.key);
          case "async":
            return await AsyncStorage.getItem(currentOption.key);
          case "secure":
            return await SecureStore.getItemAsync(currentOption.key);
          default:
            return null;
        }
      } catch (error) {
        console.error(`Error reading from ${selectedStorage}:`, error);
        return null;
      }
    },
    staleTime: 0,
  });

  // Mutation to write to storage
  const writeMutation = useMutation({
    mutationFn: async (value: string) => {
      switch (selectedStorage) {
        case "mmkv":
          await storage.setAsync(currentOption.key, value);
          break;
        case "async":
          await AsyncStorage.setItem(currentOption.key, value);
          break;
        case "secure":
          await SecureStore.setItemAsync(currentOption.key, value);
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["#storage", selectedStorage, currentOption.key],
      });
      setInputValue("");
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        `Failed to save to ${currentOption.label}: ${error.message}`
      );
    },
  });

  // Mutation to delete from storage
  const deleteMutation = useMutation({
    mutationFn: async () => {
      switch (selectedStorage) {
        case "mmkv":
          await storage.deleteAsync(currentOption.key);
          break;
        case "async":
          await AsyncStorage.removeItem(currentOption.key);
          break;
        case "secure":
          await SecureStore.deleteItemAsync(currentOption.key);
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["#storage", selectedStorage, currentOption.key],
      });
      Alert.alert("Success", `Value deleted from ${currentOption.label}!`);
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        `Failed to delete from ${currentOption.label}: ${error.message}`
      );
    },
  });

  const handleWrite = () => {
    if (inputValue.trim()) {
      writeMutation.mutate(inputValue.trim());
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the value from ${currentOption.label}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.inputCard}>
      <ThemedView style={styles.inputCardHeader}>
        <Ionicons name="create" size={20} color="#4f46e5" />
        <ThemedText style={styles.inputCardTitle}>Update Storage</ThemedText>
      </ThemedView>

      <ThemedView style={styles.dropdownContainer}>
        <ThemedText style={styles.dropdownLabel}>
          Select Storage Type
        </ThemedText>
        <ThemedView style={styles.dropdown}>
          {storageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                selectedStorage === option.value &&
                  styles.dropdownOptionSelected,
              ]}
              onPress={() => setSelectedStorage(option.value as any)}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={option.color}
              />
              <ThemedText
                style={[
                  styles.dropdownOptionText,
                  selectedStorage === option.value &&
                    styles.dropdownOptionTextSelected,
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={`Enter new value for ${currentOption.label}`}
          placeholderTextColor="#9ca3af"
        />
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.saveButton,
              (writeMutation.isPending || !inputValue.trim()) &&
                styles.disabledButton,
            ]}
            onPress={handleWrite}
            disabled={writeMutation.isPending || !inputValue.trim()}
          >
            <Ionicons
              name="save"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <ThemedText style={styles.buttonText}>Save</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.deleteButton,
              (deleteMutation.isPending || !currentValue) &&
                styles.disabledButton,
            ]}
            onPress={handleDelete}
            disabled={deleteMutation.isPending || !currentValue}
          >
            <Ionicons
              name="trash"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <ThemedText style={styles.buttonText}>Delete</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export const StorageDemo: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Storage Demo</ThemedText>
      <ThemedText style={styles.description}>
        Test storage sync with DevTools. Values will appear in real-time in the
        DevTools interface.
        {"\n\n"}Note: MMKV is mocked using AsyncStorage for Expo Go
        compatibility.
      </ThemedText>

      <StorageItem
        storageType="mmkv"
        storageKey="demo_mmkv_value"
        title="MMKV Storage"
        icon="flash"
        color="#8b5cf6"
      />

      <StorageItem
        storageType="async"
        storageKey="demo_async_value"
        title="AsyncStorage"
        icon="server"
        color="#06b6d4"
      />

      <StorageItem
        storageType="secure"
        storageKey="userToken"
        title="SecureStore"
        icon="shield-checkmark"
        color="#f59e0b"
      />

      <StorageInputCard />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  storageItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  storageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    color: "#1a1a1a",
  },
  currentValue: {
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    padding: 8,
  },
  valueLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 12,
    fontFamily: "monospace",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    color: "#2d3748",
    lineHeight: 16,
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.08)",
    color: "#2d3748",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  buttonIcon: {
    marginRight: 2,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.05,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  inputCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  inputCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
    color: "#1a1a1a",
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dropdown: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 8,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  dropdownOptionTextSelected: {
    color: "#4f46e5",
    fontWeight: "700",
  },
  inputSection: {
    gap: 10,
  },
});
