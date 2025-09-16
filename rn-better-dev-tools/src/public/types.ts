import type { ComponentType, ReactNode } from 'react';
import type { AppSlot, FloatingMenuRenderCtx } from '../floatingMenu/types';

/**
 * LauncherTarget defines what happens when a menu item is activated.
 * This flexible union allows for different launch behaviors.
 */
export type LauncherTarget =
  | { kind: 'modal'; component: ComponentType<any>; props?: any }
  | { kind: 'screen'; navigate: () => void }
  | { kind: 'url'; url: string }
  | { kind: 'command'; run: () => void | Promise<void> };

/**
 * LauncherItem represents a single item in the dev tools menu.
 * It combines display information with the target action.
 */
export interface LauncherItem {
  id: string;
  label: string;
  icon?:
    | ReactNode
    | ((ctx: FloatingMenuRenderCtx) => ReactNode);
  target: LauncherTarget;
  slot?: AppSlot;
  color?: string;
  description?: string;
}

/**
 * Built-in actions provided by the DevTools system
 */
export interface BuiltInActions {
  openModal: (component: ComponentType<any>, props?: any) => void;
  openURL: (url: string) => Promise<void>;
  closeMenu: () => void;
  navigate: (screenName: string, params?: any) => void;
}

/**
 * DevTools context shape for registration and actions
 */
export interface DevToolsContextType {
  register: (item: LauncherItem) => void;
  unregister: (id: string) => void;
  items: LauncherItem[];
  actions: BuiltInActions;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openDevTools: () => void;
}