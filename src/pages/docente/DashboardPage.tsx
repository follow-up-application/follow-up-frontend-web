import { ChevronRight, NotebookPen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { useSession } from '@/context/useSession';
import { DOCENTE_ACCIONES, DOCENTE_ACTIVIDADES, DOCENTE_RESUMEN } from '@/data/docente';

export default function DocenteDashboardPage() {
  const { session } = useSession();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hola,"
        subtitle={session ? `${session.first_name} ${session.last_name}` : 'Docente'}
        actions={
          <Link
            to="/docente/observaciones"
            className="btn-primary px-4 py-2.5 text-sm"
            aria-label="Registrar observación"
          >
            <NotebookPen className="size-4" aria-hidden />
            Observación
          </Link>
        }
      />

      <section>
        <h2 className="mb-3 text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
          Resumen de hoy
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {DOCENTE_RESUMEN.map((item) => {
            const contenido = (
              <>
                <item.icono className="size-7" style={{ color: item.color }} aria-hidden />
                <span className="text-xs font-bold tracking-wide uppercase" style={{ color: item.color }}>
                  {item.label}
                </span>
                {item.valor ? <span className="text-2xl font-black text-neutral">{item.valor}</span> : null}
              </>
            );

            return item.to ? (
              <Link
                key={item.id}
                to={item.to}
                className="card flex flex-col items-start gap-1.5 p-5 transition hover:border-primary/40 hover:shadow-sm"
              >
                {contenido}
              </Link>
            ) : (
              <div key={item.id} className="card flex flex-col items-start gap-1.5 p-5">
                {contenido}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
          Acciones
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DOCENTE_ACCIONES.map((accion) => (
            <Link
              key={accion.id}
              to={accion.to}
              className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition hover:shadow-md"
              style={{ backgroundColor: accion.bg }}
            >
              <accion.icono className="size-7" style={{ color: accion.iconColor }} aria-hidden />
              <span
                className="text-sm font-bold capitalize"
                style={{ color: accion.iconColor }}
              >
                {accion.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
            Próximas actividades
          </h2>
          <Link to="/docente/agenda" className="text-sm font-bold text-primary hover:underline">
            Ver todo
          </Link>
        </div>
        <ul className="card divide-y divide-border/40 p-2">
          {DOCENTE_ACTIVIDADES.map((act) => (
            <li key={act.id}>
              <Link
                to="/docente/agenda"
                className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: `${act.iconColor}15`, color: act.iconColor }}
                >
                  <act.icono className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-neutral">{act.titulo}</p>
                  <p className="truncate text-sm text-secondary">{act.subtitulo}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-outline" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
