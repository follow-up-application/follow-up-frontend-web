import { PageHeader } from '@/components/ui';
import { NotificationList } from '@/components/notifications/NotificationList';
import { DOCENTE_NOTIFICACIONES } from '@/data/docente';

export default function DocenteNotificacionesPage() {
  return (
    <div>
      <PageHeader title="Notificaciones" subtitle="Alertas de tus cursos y materias" />
      <NotificationList notifications={DOCENTE_NOTIFICACIONES} />
    </div>
  );
}
