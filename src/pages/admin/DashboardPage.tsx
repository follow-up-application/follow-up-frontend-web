import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, PageHeader, StatCard } from '@/components/ui';
import { MODULOS_ADMIN } from '@/data/admin';
import { getAdminEstadisticas } from '@/services/alumnoService';
import { useSession } from '@/context/useSession';
import { nombreCompleto } from '@/utils/session';

const TONE_ICON: Record<(typeof MODULOS_ADMIN)[number]['tone'], string> = {
  primary: 'bg-primary-light text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export default function AdminDashboardPage() {
  const { session } = useSession();
  const [alumnos, setAlumnos] = useState('0');
  const [tutores, setTutores] = useState('0');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminEstadisticas()
      .then((data) => {
        setAlumnos(String(data.total_alumnos));
        setTutores(String(data.total_tutores));
        setError('');
      })
      .catch(() => {
        setError('No se pudieron cargar las estadísticas. Los valores pueden estar desactualizados.');
      });
  }, []);

  return (
    <div>
      <PageHeader
        title={`Hola, ${session?.first_name ?? 'Administrador'}`}
        subtitle="Centro de control y gestión escolar."
      />

      {error ? <Alert variant="info" message={error} /> : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Alumnos" value={alumnos} icon={MODULOS_ADMIN[1].icon} tone="primary" />
        <StatCard label="Tutores" value={tutores} icon={MODULOS_ADMIN[2].icon} tone="success" />
      </div>

      <h2 className="mb-4 text-lg font-bold text-neutral">Módulos de gestión</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULOS_ADMIN.map((modulo) => (
          <Link
            key={modulo.id}
            to={modulo.to}
            className="card group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${TONE_ICON[modulo.tone]}`}>
              <modulo.icon className="size-5.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-neutral transition group-hover:text-primary">{modulo.titulo}</p>
              <p className="mt-1 text-sm text-secondary">{modulo.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-outline">
        Sesión activa: {session ? nombreCompleto(session) : 'Administrador'}
      </p>
    </div>
  );
}
