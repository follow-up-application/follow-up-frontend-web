import { AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeader, StatCard } from '@/components/ui';
import { MOCK_TUTOR_ALUMNOS } from '@/data/tutor';

export default function TutorAlumnosPage() {
  return (
    <div>
      <PageHeader title="Mis Alumnos" subtitle="Alumnos a tu cargo" />

      {MOCK_TUTOR_ALUMNOS.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="Sin alumnos asignados"
          subtitle="Todavía no tenés alumnos vinculados a tu cuenta."
        />
      ) : (
        <div className="space-y-3">
          {MOCK_TUTOR_ALUMNOS.map((alumno) => (
            <article key={alumno.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-light font-bold text-primary">
                {alumno.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-neutral">{alumno.nombre}</h2>
                <p className="text-sm text-secondary">{alumno.curso}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/tutor/notas" className="btn-outline px-4 py-2 text-xs">
                  Ver notas
                </Link>
                <Link to="/tutor/contacto" className="btn-primary px-4 py-2 text-xs">
                  Contactar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Alumnos" value="5" icon={AlertCircle} />
        <StatCard label="Promedio gral." value="8.5" icon={TrendingUp} tone="success" />
        <StatCard label="Inasistencias" value="3" icon={AlertCircle} tone="error" />
      </div>
    </div>
  );
}
