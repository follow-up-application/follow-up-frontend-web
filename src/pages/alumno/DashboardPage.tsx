import {
  AlarmClock,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Megaphone,
  NotebookPen,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { ALUMNO, MOCK_AVISOS } from '@/data/alumno';
import { useSession } from '@/context/useSession';

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mt-6 mb-3 text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
      {children}
    </p>
  );
}

export default function AlumnoDashboardPage() {
  const navigate = useNavigate();
  const { session } = useSession();

  const nombre = session ? `${session.first_name} ${session.last_name}` : ALUMNO.nombre;

  return (
    <div className="space-y-1">
      <PageHeader
        title={`Hola, ${nombre}`}
        subtitle={ALUMNO.rol}
        actions={
          <Link
            to="/alumno/notificaciones"
            className="btn-ghost rounded-full p-2.5 hover:bg-surface"
            aria-label="Notificaciones"
          >
            <Bell className="size-5.5" aria-hidden />
          </Link>
        }
      />

      <SectionLabel>Ahora / Próxima clase</SectionLabel>
      <Link
        to="/alumno/horarios"
        className="card flex items-center gap-4 p-4 transition hover:border-primary/40 hover:shadow-md"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
          <AlarmClock className="size-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-neutral">Matemáticas Avanzadas</p>
          <p className="text-sm text-secondary">Comienza en 30 min</p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-outline" aria-hidden />
      </Link>

      <SectionLabel>Por entregar / Pendiente</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card flex flex-col items-center gap-3 p-6 text-center">
          <ClipboardList className="size-7 text-primary" aria-hidden />
          <p className="font-bold text-neutral">Tareas Pendientes</p>
        </div>
        <div className="card flex flex-col items-center gap-3 p-6 text-center">
          <FileText className="size-7 text-primary" aria-hidden />
          <p className="font-bold text-neutral">Exámenes Próximos</p>
        </div>
      </div>

      <SectionLabel>Mi espacio</SectionLabel>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Boletín', icon: BookOpen, to: '/alumno/notas' },
          { label: 'Horarios', icon: CalendarDays, to: '/alumno/horarios' },
          { label: 'Asistencia', icon: ClipboardCheck, to: '/alumno/asistencia' },
          { label: 'Observaciones', icon: NotebookPen, to: '/alumno/observaciones' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card flex items-center gap-3 px-4 py-3.5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <item.icon className="size-5 shrink-0 text-primary" aria-hidden />
            <span className="truncate text-sm font-bold text-neutral">{item.label}</span>
          </Link>
        ))}
      </div>

      <SectionLabel>Avisos recientes</SectionLabel>
      <div className="space-y-3">
        {MOCK_AVISOS.slice(0, 2).map((aviso) => (
          <Link
            key={aviso.id}
            to={`/alumno/comunicados/${aviso.id}`}
            className="card flex items-center justify-between gap-3 p-4 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-neutral">{aviso.titulo}</p>
              <p className="text-sm text-secondary">{aviso.remitente}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {aviso.urgente ? (
                <span className="badge bg-error/10 text-error">
                  <Megaphone className="size-3" aria-hidden />
                </span>
              ) : null}
              <ChevronRight className="size-5 text-primary" aria-hidden />
            </div>
          </Link>
        ))}
      </div>

      <p className="pt-2 text-center text-xs text-outline">
        ¿Necesitás ayuda?{' '}
        <button
          type="button"
          onClick={() => navigate('/alumno/notificaciones')}
          className="cursor-pointer font-semibold text-primary hover:underline"
        >
          Revisá tus notificaciones
        </button>
      </p>
    </div>
  );
}
