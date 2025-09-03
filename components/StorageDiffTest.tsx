import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Test data templates
const TEST_DATA = {
  simple: {
    name: "John Doe",
    age: 30,
    active: true,
  },

  nested: {
    user: {
      profile: {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 28,
      },
      settings: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
      metadata: {
        createdAt: "2024-01-01",
        lastLogin: "2024-08-31",
        loginCount: 42,
      },
    },
    stats: {
      posts: 150,
      followers: 1200,
      following: 350,
    },
  },

  array: {
    users: ["Alice", "Bob", "Charlie"],
    scores: [100, 85, 92, 78],
    items: [
      { id: 1, name: "Item 1", price: 10 },
      { id: 2, name: "Item 2", price: 20 },
      { id: 3, name: "Item 3", price: 30 },
    ],
  },

  mixed: {
    config: {
      apiUrl: "https://api.example.com",
      timeout: 5000,
      retryCount: 3,
      features: {
        analytics: true,
        logging: false,
        cache: true,
      },
    },
    data: [1, 2, 3, 4, 5],
    flags: {
      isProduction: false,
      debugMode: true,
    },
  },
};

interface TestButtonProps {
  title: string;
  description: string;
  expected: string;
  onPress: () => void;
  color: string;
}

function TestButton({
  title,
  description,
  expected,
  onPress,
  color,
}: TestButtonProps) {
  return (
    <View style={styles.testButton}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonTitle}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.buttonInfo}>
        <Text style={styles.buttonDesc}>{description}</Text>
        <Text style={styles.buttonExpected}>🔍 Look for: {expected}</Text>
      </View>
    </View>
  );
}

export function StorageDiffTest() {
  const [status, setStatus] = useState("Ready to test");
  const [currentKey, setCurrentKey] = useState("diff_test");
  const [currentData, setCurrentData] = useState<any>(null);

  // Auto-trigger storage changes for demo
  useEffect(() => {
    const autoDemo = async () => {
      // Create multiple events to test navigation
      const key = "nav_test";

      // Event 1
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          user: "Alice",
          status: "active",
        }),
      );

      // Event 2 after 1 second
      setTimeout(async () => {
        await AsyncStorage.setItem(
          key,
          JSON.stringify({
            version: 2,
            user: "Alice Smith",
            status: "active",
            role: "admin",
          }),
        );
      }, 1000);

      // Event 3 after 2 seconds
      setTimeout(async () => {
        await AsyncStorage.setItem(
          key,
          JSON.stringify({
            version: 3,
            user: "Alice Smith",
            status: "premium",
            role: "admin",
            features: ["dashboard", "analytics"],
          }),
        );
      }, 2000);

      // Event 4 after 3 seconds
      setTimeout(async () => {
        await AsyncStorage.setItem(
          key,
          JSON.stringify({
            version: 4,
            user: "Alice Smith",
            status: "premium",
            role: "super_admin",
            features: ["dashboard", "analytics", "reports", "settings"],
            lastLogin: new Date().toISOString(),
          }),
        );
        setStatus("Created 4 events for navigation testing");
      }, 3000);
    };

    autoDemo();
  }, []);

  // Load current data on mount
  const loadCurrentData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(currentKey);
      if (data) {
        setCurrentData(JSON.parse(data));
        setStatus(`Loaded existing data for key: ${currentKey}`);
      } else {
        setCurrentData(null);
        setStatus(`No data found for key: ${currentKey}`);
      }
    } catch (error) {
      setStatus(`Error loading: ${(error as Error).message}`);
    }
  }, [currentKey]);

  useEffect(() => {
    loadCurrentData();
  }, [currentKey, loadCurrentData]);

  // CREATE Operations
  const createSimple = async () => {
    try {
      await AsyncStorage.setItem(currentKey, JSON.stringify(TEST_DATA.simple));
      await loadCurrentData();
      setStatus("✅ Created simple object with name, age, active fields");
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const createNested = async () => {
    try {
      await AsyncStorage.setItem(currentKey, JSON.stringify(TEST_DATA.nested));
      await loadCurrentData();
      setStatus(
        "✅ Created nested object with user.profile, user.settings, stats",
      );
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const createArray = async () => {
    try {
      await AsyncStorage.setItem(currentKey, JSON.stringify(TEST_DATA.array));
      await loadCurrentData();
      setStatus("✅ Created object with arrays: users[], scores[], items[]");
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  // UPDATE Operations
  const updateSingleField = async () => {
    if (!currentData) {
      setStatus("⚠️ No data to update. Create data first.");
      return;
    }
    try {
      const updated = { ...currentData };

      // Update based on data structure
      if (updated.name) {
        updated.name = updated.name + " (Modified)";
        setStatus('✅ Changed "name" field - see 1 CHANGE (yellow)');
      } else if (updated.user?.profile?.name) {
        updated.user.profile.name = "Updated Name";
        updated.user.profile.age = (updated.user.profile.age || 0) + 1;
        setStatus(
          "✅ Changed user.profile.name and user.profile.age - see 2 CHANGEs",
        );
      } else if (updated.config) {
        updated.config.timeout = 10000;
        updated.config.apiUrl = "https://new-api.example.com";
        setStatus(
          "✅ Changed config.timeout and config.apiUrl - see 2 CHANGEs",
        );
      } else {
        updated.lastModified = new Date().toISOString();
        setStatus("✅ Added lastModified field - see 1 NEW (green)");
      }

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const updateMultipleFields = async () => {
    if (!currentData) {
      setStatus("⚠️ No data to update. Create data first.");
      return;
    }
    try {
      const updated = { ...currentData };

      // Update multiple fields based on structure
      if (updated.user) {
        updated.user.profile = {
          ...updated.user.profile,
          name: "Completely New Name",
          email: "newemail@example.com",
          phone: "+1234567890", // Add new field
        };
        updated.user.settings.theme = "light";
        updated.user.settings.notifications = false;
        updated.user.metadata.loginCount =
          (updated.user.metadata.loginCount || 0) + 10;
        updated.user.newSection = {
          // Add new section
          preferences: ["option1", "option2"],
          score: 100,
        };
        setStatus(
          "✅ Multiple changes: 3 CHANGEs + 2 NEW fields (phone, newSection)",
        );
      } else {
        // For simple objects
        updated.name = "Changed Name";
        updated.age = 99;
        updated.active = !updated.active;
        updated.newField = "This is new";
        updated.anotherNew = { nested: "value" };
        setStatus("✅ Changed 3 fields + Added 2 new fields");
      }

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const addArrayItems = async () => {
    if (!currentData) {
      setStatus("⚠️ No data to update. Create data first.");
      return;
    }
    try {
      const updated = { ...currentData };

      if (updated.users && Array.isArray(updated.users)) {
        updated.users.push("Diana", "Eve");
        updated.scores.push(95, 88);
        updated.items.push(
          { id: 4, name: "Item 4", price: 40 },
          { id: 5, name: "Item 5", price: 50, discount: 10 },
        );
        setStatus(
          "✅ Added items to arrays: users[3-4], scores[4-5], items[3-4] - see NEW badges",
        );
      } else if (updated.data && Array.isArray(updated.data)) {
        updated.data.push(6, 7, 8, 9, 10);
        setStatus("✅ Added data[5-9] - see 5 NEW array items");
      } else {
        // Add array to non-array data
        updated.newArray = ["item1", "item2", "item3"];
        setStatus("✅ Added newArray field with 3 items - see NEW badge");
      }

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  // DELETE Operations
  const removeFields = async () => {
    if (!currentData) {
      setStatus("⚠️ No data to modify. Create data first.");
      return;
    }
    try {
      const updated = { ...currentData };

      // Remove fields based on structure
      if (updated.user) {
        delete updated.user.settings;
        if (updated.user.profile) {
          delete updated.user.profile.email;
        }
        delete updated.stats;
        setStatus(
          "✅ Removed user.settings, user.profile.email, stats - see DEL (red) badges",
        );
      } else if (updated.config) {
        delete updated.config.features;
        delete updated.flags;
        setStatus("✅ Removed config.features and flags - see 2 DEL badges");
      } else {
        // Remove first available field
        const keys = Object.keys(updated);
        if (keys.length > 0) {
          const removedKey = keys[0];
          delete updated[keys[0]];
          setStatus(`✅ Removed "${removedKey}" field - see 1 DEL badge`);
        }
      }

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const removeArrayItems = async () => {
    if (!currentData) {
      setStatus("⚠️ No data to modify. Create data first.");
      return;
    }
    try {
      const updated = { ...currentData };

      if (updated.users && Array.isArray(updated.users)) {
        // const removedUsers = updated.users.slice(2); // Unused variable
        updated.users = updated.users.slice(0, 2); // Keep only first 2
        updated.scores = updated.scores.slice(1); // Remove first
        updated.items.pop(); // Remove last
        setStatus(
          `✅ Removed array items: users[2+], scores[0], items[last] - see DEL badges`,
        );
      } else if (updated.data && Array.isArray(updated.data)) {
        updated.data = updated.data.filter((_: any, i: number) => i % 2 === 0); // Keep even indices
        setStatus(
          "✅ Removed odd-indexed items from data[] - see multiple DEL badges",
        );
      }

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(currentKey);
      setCurrentData(null);
      setStatus("✅ Cleared all data - storage key removed completely");
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  // Complex Scenarios
  const complexChange = async () => {
    try {
      // First create initial data
      const initial = {
        user: {
          name: "Test User",
          age: 25,
          settings: {
            theme: "dark",
            notifications: true,
          },
        },
        items: [1, 2, 3],
        active: true,
      };

      await AsyncStorage.setItem(currentKey, JSON.stringify(initial));
      setStatus(
        "⏳ Created initial data, applying complex changes in 1 second...",
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Then apply complex changes
      const updated = {
        user: {
          name: "Modified User", // Changed
          age: 26, // Changed
          email: "new@example.com", // Added
          settings: {
            theme: "light", // Changed
            notifications: true, // Same
            language: "es", // Added
            autoSave: false, // Added
          },
        },
        items: [1, 2, 3, 4, 5], // Added items
        active: false, // Changed
        metadata: {
          // Added entire section
          lastModified: new Date().toISOString(),
          version: "2.0",
        },
      };

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
      setStatus(
        "✅ Mixed changes: ~4 CHG (yellow) + ~5 NEW (green) badges - expand to explore!",
      );
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  const typeChange = async () => {
    try {
      // Create data with one type
      const initial = {
        value: "string value",
        count: "10", // String number
        flag: "true", // String boolean
        data: { nested: "object" },
      };

      await AsyncStorage.setItem(currentKey, JSON.stringify(initial));
      setStatus("⏳ Created string/object data, changing types in 1 second...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Change types
      const updated = {
        value: 12345, // String to number
        count: 10, // String to actual number
        flag: true, // String to boolean
        data: ["array", "now"], // Object to array
      };

      await AsyncStorage.setItem(currentKey, JSON.stringify(updated));
      await loadCurrentData();
      setStatus(
        "✅ Type changes: All fields show CHG - note color changes (green→orange, etc)",
      );
    } catch (error) {
      setStatus(`❌ Error: ${(error as Error).message}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🧪 Storage Diff Test Suite</Text>

      {/* Status Display */}
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Last Action:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Current Data Display */}
      {currentData && (
        <View style={styles.dataBox}>
          <Text style={styles.dataTitle}>📊 Current Data Preview:</Text>
          <Text style={styles.dataText} numberOfLines={8}>
            {JSON.stringify(currentData, null, 2)}
          </Text>
        </View>
      )}

      {/* Key Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔑 Storage Key</Text>
        <View style={styles.keyRow}>
          <TouchableOpacity
            style={[
              styles.keyButton,
              currentKey === "diff_test" && styles.keyButtonActive,
            ]}
            onPress={() => setCurrentKey("diff_test")}
          >
            <Text
              style={[
                styles.keyButtonText,
                currentKey === "diff_test" && styles.keyButtonTextActive,
              ]}
            >
              diff_test
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.keyButton,
              currentKey === "test_2" && styles.keyButtonActive,
            ]}
            onPress={() => setCurrentKey("test_2")}
          >
            <Text
              style={[
                styles.keyButtonText,
                currentKey === "test_2" && styles.keyButtonTextActive,
              ]}
            >
              test_2
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.keyHint}>
          Switch keys to test different data sets
        </Text>
      </View>

      {/* CREATE Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 CREATE Operations</Text>

        <TestButton
          title="Simple Object"
          description="Creates a basic flat object"
          expected="3 fields: name, age, active"
          onPress={createSimple}
          color="#34C759"
        />

        <TestButton
          title="Nested Object"
          description="Creates deeply nested structure"
          expected="user.profile, user.settings, stats"
          onPress={createNested}
          color="#34C759"
        />

        <TestButton
          title="Array Data"
          description="Creates object with multiple arrays"
          expected="users[], scores[], items[] arrays"
          onPress={createArray}
          color="#34C759"
        />
      </View>

      {/* UPDATE Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✏️ UPDATE Operations</Text>

        <TestButton
          title="Single Field"
          description="Changes 1-2 fields only"
          expected="1-2 yellow CHG badges"
          onPress={updateSingleField}
          color="#007AFF"
        />

        <TestButton
          title="Multiple Fields"
          description="Changes many fields & adds new ones"
          expected="Multiple CHG + NEW badges"
          onPress={updateMultipleFields}
          color="#007AFF"
        />

        <TestButton
          title="Add Array Items"
          description="Appends items to existing arrays"
          expected="Green NEW badges for array indices"
          onPress={addArrayItems}
          color="#007AFF"
        />
      </View>

      {/* DELETE Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🗑️ DELETE Operations</Text>

        <TestButton
          title="Remove Fields"
          description="Deletes object properties"
          expected="Red DEL badges for removed paths"
          onPress={removeFields}
          color="#FF3B30"
        />

        <TestButton
          title="Remove Array Items"
          description="Removes elements from arrays"
          expected="DEL badges for array indices"
          onPress={removeArrayItems}
          color="#FF3B30"
        />

        <TestButton
          title="Clear All Data"
          description="Removes the entire storage key"
          expected="Storage key disappears"
          onPress={clearData}
          color="#FF3B30"
        />
      </View>

      {/* Complex Scenarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Complex Scenarios</Text>

        <TestButton
          title="Complex Change"
          description="Mix of adds, changes, nested updates"
          expected="Mixed NEW + CHG badges, ~9 total"
          onPress={complexChange}
          color="#FF9500"
        />

        <TestButton
          title="Type Changes"
          description="Changes data types (string→number, etc)"
          expected="CHG badges with color changes"
          onPress={typeChange}
          color="#FF9500"
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>📖 Testing Guide</Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>1️⃣</Text>
          <Text style={styles.stepText}>
            Pick a CREATE operation to start with initial data
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2️⃣</Text>
          <Text style={styles.stepText}>
            Try UPDATE operations to modify the data
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3️⃣</Text>
          <Text style={styles.stepText}>
            Open Dev Tools → Storage → Events tab
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>4️⃣</Text>
          <Text style={styles.stepText}>
            Click on your storage key (diff_test or test_2)
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>5️⃣</Text>
          <Text style={styles.stepText}>
            Look for {"Found X changes"} section
          </Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>6️⃣</Text>
          <Text style={styles.stepText}>
            Click on diff items to expand and see the data
          </Text>
        </View>

        <Text style={styles.legend}>
          {"\n"}🎨 Badge Colors:{"\n"}
          🟢 NEW = Added fields{"\n"}
          🟡 CHG = Changed values{"\n"}
          🔴 DEL = Removed fields
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1a1a1a",
  },
  statusBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 13,
    color: "#333",
    fontFamily: "monospace",
    lineHeight: 18,
  },
  dataBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dataTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6,
  },
  dataText: {
    fontSize: 11,
    color: "#212529",
    fontFamily: "monospace",
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  keyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  keyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  keyButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  keyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  keyButtonTextActive: {
    color: "#fff",
  },
  keyHint: {
    fontSize: 11,
    color: "#6c757d",
    marginTop: 4,
    fontStyle: "italic",
  },
  testButton: {
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 6,
  },
  buttonTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonInfo: {
    paddingHorizontal: 8,
  },
  buttonDesc: {
    fontSize: 12,
    color: "#495057",
    marginBottom: 2,
  },
  buttonExpected: {
    fontSize: 11,
    color: "#6c757d",
    fontStyle: "italic",
  },
  instructions: {
    backgroundColor: "#e8f4fd",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#bee5eb",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0c5460",
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  stepNumber: {
    fontSize: 14,
    minWidth: 24,
  },
  stepText: {
    fontSize: 13,
    color: "#0c5460",
    flex: 1,
    lineHeight: 18,
  },
  legend: {
    fontSize: 12,
    color: "#0c5460",
    marginTop: 8,
    lineHeight: 18,
    fontWeight: "500",
  },
});
