import { AlertCircle, Bell, CalendarX2, ClipboardList, Info, type LucideIcon } from 'lucide-react';

const ICONOS: Record<string, LucideIcon> = {
  assignment: ClipboardList,
  warning: AlertCircle,
  'event-busy': CalendarX2,
  notifications: Bell,
  info: Info,
};

export function resolveNotificationIcon(icono: string | LucideIcon): LucideIcon {
  if (typeof icono === 'string') return ICONOS[icono] ?? Bell;
  return icono;
}
