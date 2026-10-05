import { Bell, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { resolveNotificationIcon } from './notificationIcons';

export type Notificacion = {
  id: string;
  titulo: string;
  mensaje: string;
  tiempo: string;
  urgente: boolean;
  icono: string | LucideIcon;
  iconoColor: string;
  leido: boolean;
  accion?: { label: string; onClick?: () => void; href?: string };
};

type Props = {
  notifications: Notificacion[];
  emptyMessage?: string;
  footer?: ReactNode;
};

export function NotificationList({ notifications, emptyMessage = 'No tenés notificaciones.', footer }: Props) {
  if (notifications.length === 0) {
    return (
      <div className="card grid place-items-center gap-2 p-10 text-center">
        <Bell className="size-8 text-outline" aria-hidden />
        <p className="text-sm text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => {
        const Icon = resolveNotificationIcon(item.icono);

        return (
          <article
            key={item.id}
            className={`card flex gap-4 p-4 ${item.leido ? '' : 'border-primary/30 bg-primary/3'} ${
              item.urgente ? 'border-l-4 border-l-error' : ''
            }`}
          >
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${item.iconoColor}1A`, color: item.iconoColor }}
            >
              <Icon className="size-5" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-neutral">{item.titulo}</h3>
                {item.urgente ? <span className="badge bg-error/10 text-error">Urgente</span> : null}
                {!item.leido ? <span className="badge bg-primary-light text-primary">Nuevo</span> : null}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-secondary">{item.mensaje}</p>
              <p className="mt-1.5 text-xs text-outline">{item.tiempo}</p>
              {item.accion ? (
                <button
                  type="button"
                  onClick={item.accion.onClick}
                  className="mt-2.5 cursor-pointer text-sm font-bold text-primary hover:underline"
                >
                  {item.accion.label}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
      {footer}
    </div>
  );
}
