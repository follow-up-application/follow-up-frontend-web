import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { TUTOR_AGENDA } from '@/data/tutor';

const FILTROS = ['Todo', 'Exámenes', 'Entregas', 'Reuniones'] as const;
type Filtro = (typeof FILTROS)[number];

const CATEGORIA_POR_FILTRO: Record<Filtro, 'Examen' | 'Entrega' | 'Reunión' | null> = {
  Todo: null,
  Exámenes: 'Examen',
  Entregas: 'Entrega',
  Reuniones: 'Reunión',
};

export default function TutorAgendaPage() {
  const [filtro, setFiltro] = useState<Filtro>('Todo');
  const categoria = CATEGORIA_POR_FILTRO[filtro];

  const bloques = TUTOR_AGENDA.map((bloque) => ({
    ...bloque,
    items: categoria ? bloque.items.filter((item) => item.categoria === categoria) : bloque.items,
  })).filter((bloque) => bloque.items.length > 0);

  return (
    <div>
      <PageHeader title="Próximas Actividades" subtitle="Agenda escolar del ciclo lectivo 2024" />

      <div
        className="mb-6 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filtrar agenda"
      >
        {FILTROS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFiltro(item)}
            aria-pressed={filtro === item}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              filtro === item
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {bloques.length === 0 ? (
        <p className="card p-8 text-center text-sm text-secondary">
          No hay actividades para este filtro.
        </p>
      ) : (
        <div className="space-y-8">
          {bloques.map((bloque) => (
            <section key={bloque.section}>
              <h2 className="mb-3 text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
                {bloque.section}
              </h2>
              <ol className="space-y-3">
                {bloque.items.map((item) => (
                  <li key={item.id} className="card flex gap-4 p-4 sm:p-5">
                    <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-surface text-center">
                      <span className="text-[0.6rem] font-bold tracking-wide text-outline uppercase">
                        {item.mes}
                      </span>
                      <span className="text-lg leading-none font-black text-neutral">{item.dia}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="badge"
                          style={{ backgroundColor: `${item.badgeColor}15`, color: item.badgeColor }}
                        >
                          {item.badge}
                        </span>
                        <span className="text-xs font-semibold text-outline">{item.hora}</span>
                      </div>
                      <h3 className="mt-1.5 font-bold text-neutral">{item.titulo}</h3>
                      <p className="text-sm text-secondary">{item.desc}</p>
                      {item.conAsistentes ? (
                        <p className="mt-2 text-xs font-semibold text-secondary">
                          Con asistencia de tutores
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
