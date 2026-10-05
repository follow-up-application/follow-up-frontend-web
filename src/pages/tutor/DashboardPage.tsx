import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { useSession } from '@/context/useSession';
import { MOCK_TUTOR_ALUMNOS, TUTOR_ACTIVIDADES, TUTOR_INFO_CARDS } from '@/data/tutor';

export default function TutorDashboardPage() {
  const { session } = useSession();
  const [alumno, setAlumno] = useState(MOCK_TUTOR_ALUMNOS[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hola, ${session?.first_name ?? 'Tutor'}`}
        subtitle="Seguimiento de tus alumnos a un clic"
      />

      <section>
        <h2 className="mb-3 text-sm font-bold text-secondary">Alumno seleccionado</h2>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Seleccionar alumno">
          {MOCK_TUTOR_ALUMNOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAlumno(item)}
              aria-pressed={alumno.id === item.id}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                alumno.id === item.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {TUTOR_INFO_CARDS.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className="card flex items-center gap-3.5 p-4 transition hover:border-primary/40 hover:shadow-sm"
          >
            <span
              className="grid size-11 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${card.color}15`, color: card.color }}
            >
              <card.icono className="size-5.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-wide text-secondary uppercase">
                {card.titulo}
              </p>
              <p className="truncate text-sm font-bold text-neutral">{card.subtitulo}</p>
            </div>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-neutral">Próximas actividades</h2>
        <ol className="space-y-3">
          {TUTOR_ACTIVIDADES.map((actividad) => (
            <li
              key={actividad.id}
              className="card flex items-center gap-4 p-4"
              style={{ borderLeftWidth: 4, borderLeftColor: actividad.color }}
            >
              <span
                className="grid size-11 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: `${actividad.color}15`, color: actividad.color }}
              >
                <actividad.icono className="size-5.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-neutral">{actividad.tipo}</p>
                <p className="truncate text-sm text-secondary">{actividad.materia}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-outline">{actividad.fecha}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
