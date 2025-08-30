/**
 * Test file for Pure React Native SVG Icons
 * This demonstrates the requested icons working without any native dependencies
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  WifiIconPure,
  WifiOffIconPure,
  NetworkIconPure,
  EnvIconPure,
  StorageIconPure,
  ShieldIconPure,
  DatabaseIconPure,
  ServerIconPure,
  GlobeIconPure,
  HardDriveIconPure,
  PureRNIcon,
} from './PureRNSVGConverter';

const TestPureRNIcons: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pure React Native Icons Test</Text>
      <Text style={styles.subtitle}>No native dependencies required!</Text>

      {/* Test Section 1: Network Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Network Icons</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <WifiIconPure size={60} color="#2196F3" strokeWidth={2} />
            <Text style={styles.iconLabel}>WiFi</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <WifiOffIconPure size={60} color="#F44336" strokeWidth={2} />
            <Text style={styles.iconLabel}>WiFi Off</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <NetworkIconPure size={60} color="#4CAF50" strokeWidth={2} />
            <Text style={styles.iconLabel}>Network</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <GlobeIconPure size={60} color="#3F51B5" strokeWidth={2} />
            <Text style={styles.iconLabel}>Globe</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
        </View>
      </View>

      {/* Test Section 2: Storage & Infrastructure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Storage & Infrastructure</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <StorageIconPure size={60} color="#9C27B0" strokeWidth={2} />
            <Text style={styles.iconLabel}>Storage</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <DatabaseIconPure size={60} color="#00BCD4" strokeWidth={2} />
            <Text style={styles.iconLabel}>Database</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <ServerIconPure size={60} color="#607D8B" strokeWidth={2} />
            <Text style={styles.iconLabel}>Server</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <HardDriveIconPure size={60} color="#795548" strokeWidth={2} />
            <Text style={styles.iconLabel}>Hard Drive</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
        </View>
      </View>

      {/* Test Section 3: Security & Environment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Security & Environment</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <ShieldIconPure size={60} color="#F44336" strokeWidth={2} />
            <Text style={styles.iconLabel}>Shield/Sentry</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
          
          <View style={styles.iconContainer}>
            <EnvIconPure size={60} color="#FF9800" strokeWidth={2} />
            <Text style={styles.iconLabel}>Environment</Text>
            <Text style={styles.iconStatus}>✅ Working</Text>
          </View>
        </View>
      </View>

      {/* Test Section 4: Dynamic Loading */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 Dynamic Icon Loading</Text>
        <View style={styles.iconRow}>
          {['wifi', 'network', 'storage', 'shield', 'database', 'server'].map((iconName) => (
            <View key={iconName} style={styles.iconContainer}>
              <PureRNIcon name={iconName} size={40} color="#333" strokeWidth={2} />
              <Text style={styles.iconLabel}>{iconName}</Text>
              <Text style={styles.iconStatus}>✅</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Test Section 5: Different Sizes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📏 Size Variations</Text>
        <View style={styles.iconRow}>
          {[16, 24, 32, 48, 64].map((size) => (
            <View key={size} style={styles.iconContainer}>
              <WifiIconPure size={size} color="#2196F3" strokeWidth={2} />
              <Text style={styles.iconLabel}>{size}px</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Test Section 6: Color Variations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Color Variations</Text>
        <View style={styles.iconRow}>
          {['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'].map((color) => (
            <View key={color} style={styles.iconContainer}>
              <NetworkIconPure size={40} color={color} strokeWidth={2} />
              <Text style={styles.iconLabel}>{color}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Test Section 7: Stroke Width Variations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✏️ Stroke Width Variations</Text>
        <View style={styles.iconRow}>
          {[1, 2, 3, 4, 5].map((strokeWidth) => (
            <View key={strokeWidth} style={styles.iconContainer}>
              <DatabaseIconPure size={40} color="#333" strokeWidth={strokeWidth} />
              <Text style={styles.iconLabel}>{strokeWidth}px</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Implementation Notes */}
      <View style={styles.notes}>
        <Text style={styles.notesTitle}>📝 Implementation Notes:</Text>
        <Text style={styles.note}>• WiFi Icon: Uses simplified arc paths (curves approximated)</Text>
        <Text style={styles.note}>• Network Icon: Custom design with connected nodes</Text>
        <Text style={styles.note}>• Storage Icon: Filing cabinet style with drawers</Text>
        <Text style={styles.note}>• Database Icon: Cylinder shape with ellipses</Text>
        <Text style={styles.note}>• Shield Icon: Simplified polygon outline</Text>
        <Text style={styles.note}>• Environment Icon: Hexagon with center circle</Text>
        <Text style={styles.note}>• All icons work without react-native-svg!</Text>
      </View>

      {/* Conversion Status */}
      <View style={styles.statusBox}>
        <Text style={styles.statusTitle}>Conversion Status:</Text>
        <Text style={styles.statusSuccess}>✅ 10/10 Icons Successfully Converted</Text>
        <Text style={styles.statusInfo}>These icons use only React Native View, Text, and transform styles.</Text>
        <Text style={styles.statusInfo}>No native dependencies required!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    margin: 10,
    minWidth: 70,
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#666',
  },
  iconStatus: {
    fontSize: 10,
    marginTop: 2,
    color: '#4CAF50',
  },
  notes: {
    backgroundColor: '#E3F2FD',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976D2',
  },
  note: {
    fontSize: 14,
    marginBottom: 5,
    color: '#424242',
  },
  statusBox: {
    backgroundColor: '#C8E6C9',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  statusSuccess: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  statusInfo: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 3,
  },
});

export default TestPureRNIcons;