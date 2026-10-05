import { CalendarX2, CheckCircle2, Info, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { ALUMNO, MOCK_ASISTENCIA_STATS, MOCK_FALTAS } from '@/data/alumno';

export default function AlumnoAsistenciaPage() {
  return (
    <div>
      <PageHeader title="Asistencia" subtitle="Resumen e historial de faltas" />

      <section className="card mb-4 grid place-items-center gap-1 p-8 text-center">
        <p className="text-5xl font-black text-primary">{ALUMNO.asistenciaTotal}%</p>
        <p className="text-sm font-semibold text-secondary">Asistencia Total</p>
        <div
          className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-variant"
          role="progressbar"
          aria-valuenow={ALUMNO.asistenciaTotal}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${ALUMNO.asistenciaTotal}%` }}
          />
        </div>
      </section>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="card flex flex-col items-center gap-1 p-4 text-center">
          <CheckCircle2 className="size-5 text-primary" aria-hidden />
          <p className="text-xl font-black text-neutral">{MOCK_ASISTENCIA_STATS.presentes}</p>
          <p className="text-xs font-semibold text-secondary">Presentes</p>
        </div>
        <div className="card flex flex-col items-center gap-1 p-4 text-center">
          <XCircle className="size-5 text-error" aria-hidden />
          <p className="text-xl font-black text-error">{MOCK_ASISTENCIA_STATS.ausentes}</p>
          <p className="text-xs font-semibold text-secondary">Ausentes</p>
        </div>
        <div className="card flex flex-col items-center gap-1 p-4 text-center">
          <Info className="size-5 text-secondary" aria-hidden />
          <p className="text-xl font-black text-neutral">{MOCK_ASISTENCIA_STATS.justificadas}</p>
          <p className="text-xs font-semibold text-secondary">Justif.</p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-neutral">Historial de Faltas</h2>
      <div className="space-y-3">
        {MOCK_FALTAS.map((falta) => {
          const justificada = falta.justificada;
          const tone = justificada
            ? { box: 'bg-primary-light text-primary', text: 'text-primary' }
            : { box: 'bg-error/10 text-error', text: 'text-error' };
          const Icon = justificada ? CheckCircle2 : CalendarX2;

          return (
            <article key={falta.id} className="card flex items-center gap-4 p-4">
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone.box}`}>
                <Icon className="size-5.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-neutral">{falta.fecha}</p>
                <p className="text-sm text-secondary">{falta.motivo}</p>
              </div>
              <span className={`badge shrink-0 ${tone.box} ${tone.text}`}>
                {justificada ? 'Justificada' : 'Injustificada'}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
