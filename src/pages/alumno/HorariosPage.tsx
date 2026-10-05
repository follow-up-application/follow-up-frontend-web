import { Coffee, DoorOpen, User } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { DIAS_SEMANA, MOCK_HORARIO } from '@/data/alumno';

export default function AlumnoHorariosPage() {
  const [dia, setDia] = useState<string>(DIAS_SEMANA[0]);

  return (
    <div>
      <PageHeader title="Horarios" subtitle="Cronograma semanal de clases" />

      <div
        className="mb-6 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Días de la semana"
      >
        {DIAS_SEMANA.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={dia === item}
            onClick={() => setDia(item)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              dia === item
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <ol className="space-y-3">
        {MOCK_HORARIO.map((item) => {
          if (item.type === 'break') {
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-white/60 px-4 py-3"
              >
                <Coffee className="size-5 shrink-0 text-secondary" aria-hidden />
                <p className="text-sm font-semibold text-secondary">
                  {item.title} ({item.horaInicio} - {item.horaFin})
                </p>
              </li>
            );
          }

          return (
            <li
              key={item.id}
              className={`card flex gap-4 p-4 sm:p-5 ${item.activo ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="w-14 shrink-0 text-center">
                <p className="text-sm font-bold text-neutral">{item.horaInicio}</p>
                <div className="mx-auto my-1 w-px bg-border" />
                <p className="text-sm font-bold text-neutral">{item.horaFin}</p>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-neutral">{item.materia}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-secondary">
                  <DoorOpen className="size-4 shrink-0" aria-hidden />
                  {item.aula}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-sm text-secondary">
                  <User className="size-4 shrink-0" aria-hidden />
                  {item.profesor}
                </p>
              </div>

              {item.activo ? <span className="badge h-fit bg-primary-light text-primary">En curso</span> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
