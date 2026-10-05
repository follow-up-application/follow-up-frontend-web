import { BookOpen, ClipboardList, Users } from 'lucide-react';
import { useState } from 'react';
import { EmptyState, PageHeader } from '@/components/ui';
import { AGENDA_ACTIVIDADES, AGENDA_DIAS, AGENDA_FILTROS } from '@/data/docente';

const TIPO_POR_FILTRO: Record<(typeof AGENDA_FILTROS)[number], 'Clase' | 'Examen' | 'Reunión' | null> =
  {
    Todas: null,
    Clases: 'Clase',
    Exámenes: 'Examen',
    Reuniones: 'Reunión',
  };

export default function DocenteAgendaPage() {
  const [dia, setDia] = useState(AGENDA_DIAS[1].id);
  const [filtro, setFiltro] = useState<(typeof AGENDA_FILTROS)[number]>('Todas');

  const tipo = TIPO_POR_FILTRO[filtro];
  const actividades = (AGENDA_ACTIVIDADES[dia] ?? []).filter(
    (a) => !tipo || a.tipo === tipo,
  );

  return (
    <div>
      <PageHeader title="Agenda" subtitle="Cronograma de clases y reuniones" />

      <div className="mb-5 grid grid-cols-6 gap-2" role="tablist" aria-label="Días de la semana">
        {AGENDA_DIAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={dia === item.id}
            onClick={() => setDia(item.id)}
            className={`cursor-pointer rounded-xl border py-2.5 text-center transition ${
              dia === item.id
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            <span className="block text-xs font-bold">{item.nombre}</span>
            <span className="block text-lg leading-tight font-black">{item.numero}</span>
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar agenda">
        {AGENDA_FILTROS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFiltro(item)}
            aria-pressed={filtro === item}
            className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              filtro === item
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {actividades.length === 0 ? (
        <EmptyState
          icon={AGENDA_DIAS.some((d) => d.id === dia) ? BookOpen : Users}
          title="Sin actividades"
          subtitle="No hay actividades programadas para este día y filtro."
        />
      ) : (
        <ol className="space-y-3">
          {actividades.map((item) => (
            <li
              key={item.id}
              className="card p-4 sm:p-5"
              style={{ borderLeftWidth: 4, borderLeftColor: item.colorBorde }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-neutral">
                  {item.horaInicio} - {item.horaFin}
                </span>
                <span
                  className="badge"
                  style={{ backgroundColor: `${item.colorBorde}15`, color: item.colorBorde }}
                >
                  {item.tipo}
                </span>
              </div>
              <h2 className="mt-1.5 font-bold text-neutral">{item.titulo}</h2>
              <p className="text-sm text-secondary">{item.contexto}</p>
              {item.participantes ? (
                <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                  <span className="flex -space-x-2">
                    {item.participantes.map((p) => (
                      <span
                        key={p}
                        className="grid size-7 place-items-center rounded-full border-2 border-white bg-outline text-xs font-bold text-white"
                      >
                        {p}
                      </span>
                    ))}
                  </span>
                  <span className="text-xs text-secondary">Participantes confirmados</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-outline">
        <ClipboardList className="size-3.5" aria-hidden />
        Los horarios se sincronizan con el calendario institucional.
      </p>
    </div>
  );
}
