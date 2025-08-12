/**
 * Example usage of ClaudeModal component
 * This file demonstrates all the features and capabilities of ClaudeModal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ClaudeModal, ModalMode, ModalDimensions } from './ClaudeModal';

// Example 1: Basic Modal
const BasicModalExample = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Basic Modal</Text>
      <Button title="Open Basic Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        header={{ title: 'Basic Modal' }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.contentText}>
            This is a basic modal with default settings.
          </Text>
          <Text style={styles.contentText}>
            Try dragging the header to resize!
          </Text>
        </View>
      </ClaudeModal>
    </View>
  );
};

// Example 2: Persistent Modal
const PersistentModalExample = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Persistent Modal</Text>
      <Button title="Open Persistent Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        persistenceKey="example-persistent-modal"
        header={{
          title: 'Persistent Modal',
          subtitle: 'I remember my state!',
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.contentText}>
            This modal remembers its position, size, and mode.
          </Text>
          <Text style={styles.contentText}>
            Try moving it around, resizing it, then close and reopen!
          </Text>
        </View>
      </ClaudeModal>
    </View>
  );
};

// Example 3: Custom Header Modal
const CustomHeaderModalExample = () => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Custom Header Modal</Text>
      <Button title="Open Custom Header Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        header={{
          customContent: (
            <View style={styles.customHeader}>
              <View style={styles.statusIndicator} />
              <Text style={styles.customHeaderText}>Live Data Stream</Text>
              <Text style={styles.customHeaderBadge}>Active</Text>
            </View>
          ),
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.contentText}>Custom header with status indicator</Text>
          <TextInput
            style={styles.input}
            placeholder="Type something..."
            placeholderTextColor="#666"
            value={inputValue}
            onChangeText={setInputValue}
          />
        </View>
      </ClaudeModal>
    </View>
  );
};

// Example 4: Styled Modal
const StyledModalExample = () => {
  const [visible, setVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const lightTheme = {
    modal: {
      backgroundColor: '#ffffff',
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    header: {
      backgroundColor: '#f0f0f0',
    },
    headerTitle: {
      color: '#000000',
    },
    content: {
      backgroundColor: '#ffffff',
    },
  };

  const darkTheme = {
    modal: {
      backgroundColor: '#1a1a1a',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    header: {
      backgroundColor: '#0a0a0a',
    },
    headerTitle: {
      color: '#ffffff',
    },
    content: {
      backgroundColor: '#1a1a1a',
    },
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Themed Modal</Text>
      <Button title="Open Themed Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        header={{ title: darkMode ? 'Dark Theme' : 'Light Theme' }}
        styles={darkMode ? darkTheme : lightTheme}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.contentText, { color: darkMode ? '#fff' : '#000' }]}>
            Toggle theme:
          </Text>
          <View style={styles.switchContainer}>
            <Text style={{ color: darkMode ? '#fff' : '#000' }}>Light</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
            <Text style={{ color: darkMode ? '#fff' : '#000' }}>Dark</Text>
          </View>
        </View>
      </ClaudeModal>
    </View>
  );
};

// Example 5: Interactive Modal with Callbacks
const InteractiveModalExample = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Interactive Modal</Text>
      <Button title="Open Interactive Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => {
          setVisible(false);
          addLog('Modal closed');
        }}
        header={{
          title: 'Interactive Modal',
          subtitle: 'Watch the console below',
        }}
        onModeChange={(mode: ModalMode) => {
          addLog(`Mode changed to: ${mode}`);
        }}
        onDimensionsChange={(dimensions: ModalDimensions) => {
          addLog(`Dimensions: ${dimensions.width}x${dimensions.height}`);
        }}
      >
        <ScrollView style={styles.modalContent}>
          <Text style={styles.contentText}>Event Logs:</Text>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>
      </ClaudeModal>
      
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Console:</Text>
        <ScrollView style={styles.logScroll}>
          {logs.slice(-5).map((log, index) => (
            <Text key={index} style={styles.logItem}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// Example 6: Form Modal
const FormModalExample = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = () => {
    Alert.alert('Form Submitted', JSON.stringify(formData, null, 2));
    setVisible(false);
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Form Modal</Text>
      <Button title="Open Form Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        persistenceKey="form-modal"
        header={{
          title: 'Contact Form',
          subtitle: 'Fill out the form below',
        }}
        initialHeight={500}
      >
        <ScrollView style={styles.formContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />
          
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />
          
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
            placeholder="Enter your message"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.buttonRow}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={() => setVisible(false)} color="#ff4444" />
          </View>
        </ScrollView>
      </ClaudeModal>
    </View>
  );
};

// Main App Component
export default function ClaudeModalExamples() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.mainTitle}>ClaudeModal Examples</Text>
          
          <BasicModalExample />
          <PersistentModalExample />
          <CustomHeaderModalExample />
          <StyledModalExample />
          <InteractiveModalExample />
          <FormModalExample />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exampleContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContent: {
    padding: 20,
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff00',
    marginRight: 8,
  },
  customHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  customHeaderBadge: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    color: '#00ff00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  logContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    maxHeight: 100,
  },
  logTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  logScroll: {
    maxHeight: 60,
  },
  logItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  logText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});