import type { LauncherItem, LauncherTarget } from './types';
import type { InstalledApp, FloatingMenuState, FloatingMenuActions } from '../floatingMenu/types';

/**
 * Convert a LauncherItem to the legacy InstalledApp format
 * This enables backwards compatibility with existing FloatingMenu component
 */
export function toLauncherApp(
  item: LauncherItem,
  handleTarget: (target: LauncherTarget) => void | Promise<void>
): InstalledApp {
  return {
    id: item.id,
    name: item.label,
    icon: item.icon,
    slot: item.slot || 'both',
    onPress: (ctx: { state?: FloatingMenuState; actions?: FloatingMenuActions }) => handleTarget(item.target),
  };
}

/**
 * Convert a legacy InstalledApp to the new LauncherItem format
 * This allows existing apps to work with the new system
 */
export function fromInstalledApp(app: InstalledApp): LauncherItem {
  if ('target' in app && (app as any).target) {
    return app as any as LauncherItem;
  }
  
  return {
    id: app.id,
    label: app.name,
    icon: app.icon,
    slot: app.slot,
    target: {
      kind: 'command',
      run: app.onPress,
    },
  };
}

/**
 * Helper to create a modal launcher item
 */
export function createModalLauncher(
  id: string,
  label: string,
  component: React.ComponentType<any>,
  options?: {
    icon?: LauncherItem['icon'];
    slot?: LauncherItem['slot'];
    props?: any;
    description?: string;
  }
): LauncherItem {
  return {
    id,
    label,
    icon: options?.icon,
    slot: options?.slot || 'both',
    description: options?.description,
    target: {
      kind: 'modal',
      component,
      props: options?.props,
    },
  };
}

/**
 * Helper to create a screen navigation launcher item
 */
export function createScreenLauncher(
  id: string,
  label: string,
  navigate: () => void,
  options?: {
    icon?: LauncherItem['icon'];
    slot?: LauncherItem['slot'];
    description?: string;
  }
): LauncherItem {
  return {
    id,
    label,
    icon: options?.icon,
    slot: options?.slot || 'both',
    description: options?.description,
    target: {
      kind: 'screen',
      navigate,
    },
  };
}

/**
 * Helper to create a URL launcher item
 */
export function createURLLauncher(
  id: string,
  label: string,
  url: string,
  options?: {
    icon?: LauncherItem['icon'];
    slot?: LauncherItem['slot'];
    description?: string;
  }
): LauncherItem {
  return {
    id,
    label,
    icon: options?.icon,
    slot: options?.slot || 'both',
    description: options?.description,
    target: {
      kind: 'url',
      url,
    },
  };
}

/**
 * Helper to create a command launcher item
 */
export function createCommandLauncher(
  id: string,
  label: string,
  run: () => void | Promise<void>,
  options?: {
    icon?: LauncherItem['icon'];
    slot?: LauncherItem['slot'];
    description?: string;
  }
): LauncherItem {
  return {
    id,
    label,
    icon: options?.icon,
    slot: options?.slot || 'both',
    description: options?.description,
    target: {
      kind: 'command',
      run,
    },
  };
}