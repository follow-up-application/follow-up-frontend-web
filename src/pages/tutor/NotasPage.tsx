import { useState } from 'react';
import { Button, PageHeader } from '@/components/ui';
import {
  CALIFICACIONES_POR_HIJO,
  ESTADISTICAS_POR_HIJO,
  MOCK_HIJOS,
  type HijoId,
} from '@/data/tutor';

export default function TutorNotasPage() {
  const [hijo, setHijo] = useState<HijoId>('1');

  const notas = CALIFICACIONES_POR_HIJO[hijo];
  const stats = ESTADISTICAS_POR_HIJO[hijo];

  return (
    <div>
      <PageHeader
        title="Boletín de Calificaciones"
        subtitle="Ciclo lectivo 2024"
        actions={<Button title="Descargar PDF" variant="outline" className="px-4 py-2 text-xs" />}
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Seleccionar alumno">
        {MOCK_HIJOS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setHijo(item.id)}
            aria-pressed={hijo === item.id}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              hijo === item.id
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item.nombre}
          </button>
        ))}
      </div>

      <section className="card mb-6 grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold tracking-wide text-secondary uppercase">Desempeño</p>
          <p className="font-bold text-neutral">{stats.desempeno}</p>
          <p className="mt-1 text-sm text-secondary">{stats.desc}</p>
        </div>
        <dl className="grid grid-cols-3 gap-3 text-center sm:col-span-1">
          <div>
            <dt className="text-[0.6rem] font-bold tracking-wider text-secondary uppercase">
              Asistencia
            </dt>
            <dd className="text-lg font-black text-primary">{stats.asistencia}</dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-bold tracking-wider text-secondary uppercase">Conducta</dt>
            <dd className="text-lg font-black text-success">{stats.conducta}</dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-bold tracking-wider text-secondary uppercase">
              Promedio
            </dt>
            <dd className="text-lg font-black text-neutral">{stats.promedio}</dd>
          </div>
        </dl>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs tracking-wide text-secondary uppercase">
              <th className="px-3 py-2.5 font-bold">Materia</th>
              <th className="px-3 py-2.5 font-bold">Profesor</th>
              <th className="px-3 py-2.5 text-center font-bold">1ª Nota</th>
              <th className="px-3 py-2.5 text-center font-bold">2ª Nota</th>
              <th className="px-3 py-2.5 text-center font-bold">Final</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((nota) => {
              const aprobado = nota.notaFinal >= 6;

              return (
                <tr key={nota.id} className="border-b border-border/30 last:border-0">
                  <td className="px-3 py-3 font-semibold text-neutral">{nota.materia}</td>
                  <td className="px-3 py-3 text-secondary">{nota.profesor}</td>
                  <td className="px-3 py-3 text-center text-secondary">{nota.nota1}</td>
                  <td className="px-3 py-3 text-center text-secondary">{nota.nota2}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`badge ${aprobado ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}
                    >
                      {nota.notaFinal.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
