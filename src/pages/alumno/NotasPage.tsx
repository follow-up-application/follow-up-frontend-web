import { Star, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { ALUMNO, MOCK_BOLETIN } from '@/data/alumno';

export default function AlumnoNotasPage() {
  return (
    <div>
      <PageHeader title="Boletín de Notas" subtitle="Promedios por materia y trimestre" />

      <section className="card relative mb-6 overflow-hidden bg-primary-light p-6 text-center sm:p-8">
        <Star
          className="pointer-events-none absolute -top-4 -right-5 size-40 text-primary/20"
          aria-hidden
        />
        <p className="relative text-xs font-extrabold tracking-widest text-primary uppercase">
          Promedio general
        </p>
        <p className="relative mt-1 text-6xl font-black text-[#21005D]">
          {ALUMNO.promedioGeneral.toFixed(1)}
        </p>
        <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-sm font-bold text-[#21005D]">
          <TrendingUp className="size-4" aria-hidden />
          +0.4 este trimestre
        </span>
      </section>

      <div className="space-y-3">
        {MOCK_BOLETIN.map((item) => {
          const aprobado = item.promedio >= 7;

          return (
            <article key={item.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-neutral">{item.materia}</h2>
                  <p className="text-sm text-secondary">{item.profesor}</p>
                </div>
                <span
                  className={`badge shrink-0 px-3 py-1 ${
                    aprobado ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}
                >
                  {item.promedio.toFixed(1)}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
                {item.trimestres.map((trim) => (
                  <div key={trim.trimestre}>
                    <dt className="text-xs font-semibold text-secondary">{trim.trimestre}° Trim.</dt>
                    <dd className="text-base font-bold text-warning">
                      {typeof trim.nota === 'number' ? trim.nota.toFixed(1) : trim.nota}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
