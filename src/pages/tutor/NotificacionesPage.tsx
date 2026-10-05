import { PageHeader } from '@/components/ui';
import { NotificationList } from '@/components/notifications/NotificationList';
import { TUTOR_NOTIFICACIONES } from '@/data/tutor';

export default function TutorNotificacionesPage() {
  return (
    <div>
      <PageHeader title="Notificaciones" subtitle="Alertas y novedades de tus alumnos" />
      <NotificationList notifications={TUTOR_NOTIFICACIONES} />
    </div>
  );
}
