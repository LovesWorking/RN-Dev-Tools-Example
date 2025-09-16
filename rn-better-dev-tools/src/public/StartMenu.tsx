import { useMemo, useState, type FC } from 'react';
import { Alert, Linking } from 'react-native';
import { FloatingMenu } from '../floatingMenu/FloatingMenu';
import { SimpleBottomSheet } from '../floatingMenu/ui/SimpleBottomSheet';
import type { InstalledApp } from '../floatingMenu/types';
import type { LauncherItem } from './types';
import { useDevTools } from './DevToolsProvider';

type Props = {
  items?: LauncherItem[];
  hidden?: boolean;
};

export const StartMenu: FC<Props> = ({ items, hidden }) => {
  const [modal, setModal] = useState<null | { Comp: React.ComponentType<any>; props?: any }>(null);
  const registry = useDevTools();

  const effectiveItems = items ?? registry.items;

  const installedApps: InstalledApp[] = useMemo(() => {
    return effectiveItems.map<InstalledApp>((item) => {
      return {
        id: item.id,
        name: item.label,
        icon: item.icon as any,
        slot: item.slot ?? 'both',
        color: item.color,
        onPress: async (ctx) => {
          const closeMenu = ctx?.actions?.closeMenu;
          try {
            switch (item.target.kind) {
              case 'modal':
                setModal({ Comp: item.target.component, props: item.target.props });
                if (closeMenu) closeMenu();
                break;
              case 'screen':
                item.target.navigate();
                if (closeMenu) closeMenu();
                break;
              case 'url':
                try {
                  const supported = await Linking.canOpenURL(item.target.url);
                  if (supported) {
                    await Linking.openURL(item.target.url);
                  } else if (/^[a-z]+:\/\//i.test(item.target.url) && !/^https?:\/\//i.test(item.target.url)) {
                    const web = item.target.url.replace(/^[a-z]+:/i, 'https:');
                    await Linking.openURL(web);
                  } else {
                    Alert.alert('Cannot open link', item.target.url);
                  }
                } catch (e) {
                  Alert.alert('Failed to open link', String(e));
                }
                if (closeMenu) closeMenu();
                break;
              case 'command':
                await item.target.run();
                if (closeMenu) closeMenu();
                break;
            }
          } catch (e) {
            console.error('Launcher item failed:', e);
          }
        },
      };
    });
  }, [effectiveItems]);

  return (
    <>
      <FloatingMenu apps={installedApps} hidden={hidden} />
      {modal && (
        <SimpleBottomSheet
          visible
          onClose={() => setModal(null)}
          header={null}
          initialHeight={Math.floor((typeof window !== 'undefined' ? window.innerHeight : 700) * 0.6)}
        >
          <modal.Comp {...(modal.props ?? {})} />
        </SimpleBottomSheet>
      )}
    </>
  );
};