import { Info, ThumbsUp, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { MOCK_OBSERVACIONES, MOCK_OBSERVACIONES_RESUMEN } from '@/data/alumno';
import type { ObservacionAlumno } from '@/data/alumno';

const FILTROS = ['Todas', 'Positivas', 'Llamados'] as const;
type Filtro = (typeof FILTROS)[number];

const TONE: Record<
  ObservacionAlumno['tipo'],
  { border: string; text: string; icon: typeof ThumbsUp }
> = {
  positiva: { border: 'border-l-success', text: 'text-success', icon: ThumbsUp },
  alerta: { border: 'border-l-error', text: 'text-error', icon: TriangleAlert },
  neutral: { border: 'border-l-outline', text: 'text-secondary', icon: Info },
};

export default function AlumnoObservacionesPage() {
  const [filtro, setFiltro] = useState<Filtro>('Todas');

  const filtradas = MOCK_OBSERVACIONES.filter((obs) => {
    if (filtro === 'Positivas') return obs.tipo === 'positiva';
    if (filtro === 'Llamados') return obs.tipo === 'alerta';
    return true;
  });

  return (
    <div>
      <PageHeader title="Observaciones" subtitle="Registro conductual de docentes" />

      <section className="card mb-5 bg-primary-light/60 p-5">
        <h2 className="font-bold text-primary">Resumen del Mes</h2>
        <p className="mt-0.5 mb-5 text-sm text-primary/80">
          Tenés 3 nuevas actualizaciones en tu registro conductual.
        </p>
        <dl className="grid grid-cols-3 gap-2 text-center">
          <div>
            <dt className="sr-only">Total</dt>
            <dd className="text-2xl font-black text-primary">{MOCK_OBSERVACIONES_RESUMEN.total}</dd>
            <p className="text-[0.6rem] font-bold tracking-wider text-primary/70 uppercase">Total</p>
          </div>
          <div>
            <dt className="sr-only">Positivas</dt>
            <dd className="text-2xl font-black text-success">
              {MOCK_OBSERVACIONES_RESUMEN.positivas}
            </dd>
            <p className="text-[0.6rem] font-bold tracking-wider text-success/70 uppercase">
              Positivas
            </p>
          </div>
          <div>
            <dt className="sr-only">Alertas</dt>
            <dd className="text-2xl font-black text-error">{MOCK_OBSERVACIONES_RESUMEN.alertas}</dd>
            <p className="text-[0.6rem] font-bold tracking-wider text-error/70 uppercase">
              Alertas
            </p>
          </div>
        </dl>
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar observaciones">
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

      <div className="space-y-3">
        {filtradas.map((obs) => {
          const tone = TONE[obs.tipo];
          const Icon = tone.icon;

          return (
            <article key={obs.id} className={`card border-l-4 p-4 ${tone.border}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className={`flex items-center gap-1.5 text-sm font-bold ${tone.text}`}>
                  <Icon className="size-4" aria-hidden />
                  {obs.etiqueta}
                </span>
                <span className="shrink-0 text-xs text-secondary">{obs.fecha}</span>
              </div>

              <h2 className="font-bold text-neutral">{obs.titulo}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary">{obs.descripcion}</p>

              <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                <span className="grid size-6 place-items-center rounded-full bg-outline/20 text-secondary">
                  <Info className="size-3" aria-hidden />
                </span>
                <p className="text-xs text-secondary italic">{obs.profesor}</p>
              </div>
            </article>
          );
        })}

        {filtradas.length === 0 ? (
          <p className="card p-8 text-center text-sm text-secondary">
            No hay observaciones para este filtro.
          </p>
        ) : null}
      </div>
    </div>
  );
}
