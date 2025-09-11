import { FC } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SimpleBottomSheet } from '../ui/SimpleBottomSheet';
import type { InstalledApp, FloatingMenuActions, FloatingMenuState } from '../types';
import { gameUIColors } from '../colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = 4;
const ITEM_SIZE = Math.floor((SCREEN_WIDTH - 48) / GRID_COLUMNS);
const ICON_SIZE = 32;

interface GridDevToolsProps {
  onClose: () => void;
  apps: InstalledApp[];
  state?: FloatingMenuState;
  actions?: FloatingMenuActions;
}

export const GridDevTools: FC<GridDevToolsProps> = ({
  onClose,
  apps,
  state,
  actions,
}) => {
  const filteredApps = apps.filter((app) => {
    const slot = app.slot ?? 'both';
    return slot === 'dial' || slot === 'both';
  });

  const handlePress = (app: InstalledApp) => {
    app.onPress({ state, actions });
    if (actions?.closeMenu) {
      actions.closeMenu();
    }
  };

  return (
    <SimpleBottomSheet
      visible
      onClose={onClose}
      header={
        <View style={styles.header}>
          <Text style={styles.title}>Dev Tools</Text>
          <Text style={styles.subtitle}>{filteredApps.length} tools available</Text>
        </View>
      }
      initialHeight={Math.min(600, Math.ceil(filteredApps.length / GRID_COLUMNS) * (ITEM_SIZE + 20) + 120)}
    >
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filteredApps.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={styles.gridItem}
              onPress={() => handlePress(app)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: app.color || gameUIColors.secondary }]}>
                {typeof app.icon === 'function'
                  ? app.icon({ slot: 'dial', size: ICON_SIZE, state, actions })
                  : app.icon}
              </View>
              <Text style={styles.label} numberOfLines={2}>
                {app.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: (gameUIColors as any).border || gameUIColors.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: (gameUIColors as any).text || gameUIColors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: (gameUIColors as any).textMuted || gameUIColors.muted,
  },
  gridContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: ITEM_SIZE,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: ITEM_SIZE - 16,
    height: ITEM_SIZE - 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: (gameUIColors as any).text || gameUIColors.primary,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});