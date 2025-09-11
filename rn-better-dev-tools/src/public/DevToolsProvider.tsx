import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Linking, Alert } from 'react-native';
import type { LauncherItem, BuiltInActions, DevToolsContextType } from './types';

const DevToolsContext = createContext<DevToolsContextType | undefined>(undefined);

interface DevToolsProviderProps {
  children: React.ReactNode;
  initial?: LauncherItem[];
  onOpenModal?: (component: React.ComponentType<any>, props?: any) => void;
  onNavigate?: (screenName: string, params?: any) => void;
}

export const DevToolsProvider: React.FC<DevToolsProviderProps> = ({
  children,
  initial = [],
  onOpenModal,
  onNavigate,
}) => {
  const [items, setItems] = useState<LauncherItem[]>(initial);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<{
    component: React.ComponentType<any>;
    props?: any;
  } | null>(null);

  const register = useCallback((item: LauncherItem) => {
    setItems((prev) => {
      const existing = prev.findIndex((i) => i.id === item.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = item;
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const openURL = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        if (url.startsWith('app://') || url.startsWith('custom://')) {
          const webUrl = url.replace(/^[^:]+:/, 'https:');
          const webSupported = await Linking.canOpenURL(webUrl);
          if (webSupported) {
            await Linking.openURL(webUrl);
          } else {
            Alert.alert('Cannot open link', `Unable to open: ${url}`);
          }
        } else {
          Alert.alert('Cannot open link', `Unable to open: ${url}`);
        }
      }
    } catch (error) {
      Alert.alert('Failed to open link', String(error));
    }
  }, []);

  const openModal = useCallback(
    (component: React.ComponentType<any>, props?: any) => {
      if (onOpenModal) {
        onOpenModal(component, props);
      } else {
        setActiveModal({ component, props });
      }
      setMenuOpen(false);
    },
    [onOpenModal]
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const navigate = useCallback(
    (screenName: string, params?: any) => {
      if (onNavigate) {
        onNavigate(screenName, params);
      }
      setMenuOpen(false);
    },
    [onNavigate]
  );

  const actions: BuiltInActions = useMemo(
    () => ({
      openModal,
      openURL,
      closeMenu,
      navigate,
    }),
    [openModal, openURL, closeMenu, navigate]
  );

  const openDevTools = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const contextValue: DevToolsContextType = useMemo(
    () => ({
      register,
      unregister,
      items,
      actions,
      isMenuOpen,
      setMenuOpen,
      openDevTools,
    }),
    [register, unregister, items, actions, isMenuOpen, openDevTools]
  );

  return (
    <DevToolsContext.Provider value={contextValue}>
      {children}
      {activeModal && !onOpenModal && (
        <activeModal.component
          {...activeModal.props}
          onClose={() => setActiveModal(null)}
        />
      )}
    </DevToolsContext.Provider>
  );
};

export const useDevTools = () => {
  const context = useContext(DevToolsContext);
  if (!context) {
    throw new Error('useDevTools must be used within DevToolsProvider');
  }
  return context;
};