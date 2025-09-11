import { FC, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { FloatingTools } from './floatingTools';
import type { InstalledApp, FloatingMenuActions, FloatingMenuState } from './types';

export interface FloatingMenuProps {
  apps: InstalledApp[];
  state?: FloatingMenuState;
  actions?: FloatingMenuActions;
  hidden?: boolean; // hide bubble when another dev app is open
}

export const FloatingMenu: FC<FloatingMenuProps> = ({ apps, state, actions, hidden }) => {
  const [internalHidden, setInternalHidden] = useState(false);
  const isHidden = useMemo(() => Boolean(hidden ?? internalHidden), [hidden, internalHidden]);

  const handlePress = (app: InstalledApp) => {
    try {
      const result = app.onPress({ state, actions });
      if (result && typeof (result as Promise<void>).then === 'function') {
        setInternalHidden(true);
        (result as Promise<void>).finally(() => setInternalHidden(false));
      }
    } catch {
      // ignore errors from user handlers; do not hide in this case
    }
  };

  return (
    <View pointerEvents={isHidden ? 'none' : 'auto'} style={{ opacity: isHidden ? 0 : 1 }}>
      <FloatingTools enablePositionPersistence>
      {apps
        .filter((a) => (a.slot ?? 'both') !== 'dial')
        .map((app) => (
          <TouchableOpacity
            key={`row-${app.id}`}
            accessibilityLabel={app.name}
            onPress={() => handlePress(app)}
            style={styles.fab}
          >
            {typeof app.icon === 'function'
              ? app.icon({ slot: 'row', size: 16, state, actions })
              : app.icon}
          </TouchableOpacity>
        ))}
      </FloatingTools>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    minHeight: 0,
    backgroundColor: 'transparent',
  },
});
