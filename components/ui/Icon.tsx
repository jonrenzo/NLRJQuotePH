import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  CornerDownRight,
  Download,
  Droplets,
  FileText,
  Flag,
  Fuel,
  Home,
  MapPin,
  Navigation,
  Pencil,
  PhilippinePeso,
  Plus,
  PlusCircle,
  Settings,
  Share2,
  Trash2,
  Truck,
  User,
  X,
  Zap,
  type LucideProps,
} from 'lucide-react-native';

export type AppIconName =
  | 'briefcase'
  | 'check'
  | 'check-circle'
  | 'corner-down-right'
  | 'download'
  | 'droplet'
  | 'edit-2'
  | 'file-text'
  | 'flag'
  | 'fuel'
  | 'home'
  | 'map-pin'
  | 'navigation'
  | 'peso'
  | 'plus'
  | 'plus-circle'
  | 'settings'
  | 'share-2'
  | 'trash-2'
  | 'truck'
  | 'user'
  | 'x'
  | 'zap';

const iconMap: Record<AppIconName, React.ComponentType<LucideProps>> = {
  briefcase: Briefcase,
  check: CheckCircle2,
  'check-circle': CheckCircle2,
  'corner-down-right': CornerDownRight,
  download: Download,
  droplet: Droplets,
  'edit-2': Pencil,
  'file-text': FileText,
  flag: Flag,
  fuel: Fuel,
  home: Home,
  'map-pin': MapPin,
  navigation: Navigation,
  peso: PhilippinePeso,
  plus: Plus,
  'plus-circle': PlusCircle,
  settings: Settings,
  'share-2': Share2,
  'trash-2': Trash2,
  truck: Truck,
  user: User,
  x: X,
  zap: Zap,
};

export function Icon({ name, ...props }: { name: AppIconName } & Omit<LucideProps, 'ref'>) {
  const Component = iconMap[name];
  return <Component {...props} />;
}
