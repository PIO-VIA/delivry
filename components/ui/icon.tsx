import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  LogOut,
  Map,
  MapPin,
  Navigation,
  Package,
  Phone,
  Settings,
  Truck,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type IconName =
  | 'map-pin'
  | 'map'
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
  | 'truck'
  | 'eye'
  | 'eye-off';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

const iconMap: Record<IconName, LucideIcon> = {
  'map-pin': MapPin,
  'map': Map,
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
  'eye': Eye,
  'eye-off': EyeOff,
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
