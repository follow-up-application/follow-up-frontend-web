import { PageHeader } from '@/components/ui';
import { NotificationList } from '@/components/notifications/NotificationList';
import { MOCK_ALUMNO_NOTIFICACIONES } from '@/data/alumno';

export default function AlumnoNotificacionesPage() {
  return (
    <div>
      <PageHeader title="Notificaciones" subtitle="Avisos y novedades de tu colegio" />
      <NotificationList notifications={MOCK_ALUMNO_NOTIFICACIONES} />
    </div>
  );
}
