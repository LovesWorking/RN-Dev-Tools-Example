/**
 * Lucide icons re-exported with original names for drop-in replacement
 * This allows us to replace 'lucide-react-native' with local icons
 */

import type { FC } from 'react';
import {
  ActivityIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  CheckIcon,
  CheckCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CopyIcon,
  DatabaseIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileCodeIcon,
  FileTextIcon,
  FilterIcon,
  FlaskConicalIcon,
  GlobeIcon,
  HardDriveIcon,
  LinkIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
  ServerIcon,
  SettingsIcon,
  TestTube2Icon,
  TrashIcon,
  Trash2Icon,
  UploadIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
  XCircleIcon,
  ZapIcon,
  HashIcon,
  UsersIcon,
  BoxIcon,
  HandIcon,
  KeyIcon,
  RouteIcon,
  UserIcon,
  TriangleAlertIcon,
  LockIcon,
  UnlockIcon,
  FileJsonIcon,
  ImageIcon,
  FilmIcon,
  MusicIcon,
  PowerIcon,
  SearchIcon,
  TimerIcon,
  InfoIcon,
  SmartphoneIcon,
  LayersIcon,
  NavigationIcon,
  ShieldIcon,
  TouchpadIcon,
  BarChart3Icon,
  GitBranchIcon,
  MinusIcon,
} from './lucide-icons';

// Re-export all icons with shorter names
export {
  ActivityIcon as Activity,
  AlertCircleIcon as AlertCircle,
  AlertTriangleIcon as AlertTriangle,
  BugIcon as Bug,
  CheckIcon as Check,
  CheckCircleIcon as CheckCircle,
  CheckCircle2Icon as CheckCircle2,
  ChevronDownIcon as ChevronDown,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  ChevronUpIcon as ChevronUp,
  ClockIcon as Clock,
  CopyIcon as Copy,
  DatabaseIcon as Database,
  DownloadIcon as Download,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  FileCodeIcon as FileCode,
  FileTextIcon as FileText,
  FilterIcon as Filter,
  FlaskConicalIcon as FlaskConical,
  GlobeIcon as Globe,
  HardDriveIcon as HardDrive,
  LinkIcon as Link,
  PaletteIcon as Palette,
  PauseIcon as Pause,
  PlayIcon as Play,
  PlusIcon as Plus,
  RefreshCwIcon as RefreshCw,
  ServerIcon as Server,
  SettingsIcon as Settings,
  TestTube2Icon as TestTube2,
  TrashIcon as Trash,
  Trash2Icon as Trash2,
  UploadIcon as Upload,
  WifiIcon as Wifi,
  WifiOffIcon as WifiOff,
  XIcon as X,
  XCircleIcon as XCircle,
  ZapIcon as Zap,
  HashIcon as Hash,
  UsersIcon as Users,
  BoxIcon as Box,
  HandIcon as Hand,
  KeyIcon as Key,
  RouteIcon as Route,
  UserIcon as User,
  TriangleAlertIcon as TriangleAlert,
  LockIcon as Lock,
  UnlockIcon as Unlock,
  FileJsonIcon as FileJson,
  ImageIcon as Image,
  FilmIcon as Film,
  MusicIcon as Music,
  PowerIcon as Power,
  SearchIcon as Search,
  TimerIcon as Timer,
  InfoIcon as Info,
  SmartphoneIcon as Smartphone,
  LayersIcon as Layers,
  NavigationIcon as Navigation,
  ShieldIcon as Shield,
  TouchpadIcon as Touchpad,
  BarChart3Icon as BarChart3,
  GitBranchIcon as GitBranch,
  MinusIcon as Minus,
};

// Re-export TouchpadIcon with its full name for compatibility
export { TouchpadIcon } from './lucide-icons';

// Create placeholder icons for missing ones  
export const Loader2 = ActivityIcon; // Using Activity as placeholder for Loader2
export const PauseCircle = PauseIcon; // Using Pause as placeholder for PauseCircle
export const Edit3 = FileCodeIcon; // Using FileCode as placeholder for Edit3
export const AlertOctagon = AlertTriangleIcon; // Using AlertTriangle as placeholder for AlertOctagon
export const HelpCircle = AlertCircleIcon; // Using AlertCircle as placeholder for HelpCircle

// Export the IconProps interface
export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  [key: string]: any;
}

// Create a LucideIcon type for compatibility with existing code
export type LucideIcon = FC<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  [key: string]: any;
}>;