import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  MapPin,
  DollarSign,
  Phone,
  Navigation,
  Package,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  type LucideIcon,
} from 'lucide-react-native';

export type IconName =
  | 'map-pin'
  | 'dollar'
  | 'phone'
  | 'navigation'
  | 'package'
  | 'bell'
  | 'clock'
  | 'check-circle'
  | 'alert-circle'
  | 'user'
  | 'settings'
  | 'logout'
  | 'chevron-right'
  | 'truck';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

const iconMap: Record<IconName, LucideIcon> = {
  'map-pin': MapPin,
  'dollar': DollarSign,
  'phone': Phone,
  'navigation': Navigation,
  'package': Package,
  'bell': Bell,
  'clock': Clock,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'user': User,
  'settings': Settings,
  'logout': LogOut,
  'chevron-right': ChevronRight,
  'truck': Truck,
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#000', style }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <IconComponent size={size} color={color} strokeWidth={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;
