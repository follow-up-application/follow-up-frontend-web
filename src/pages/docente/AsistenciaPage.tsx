import { Check, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useState } from 'react';
import { Button, PageHeader, SelectInput, StatCard } from '@/components/ui';
import {
  ASISTENCIA_MATERIAS,
  DIAS,
  MESES,
  MOCK_ALUMNOS_ASISTENCIA,
  type EstadoAsistencia,
} from '@/data/docente';

const ESTADOS: { value: EstadoAsistencia; label: string; title: string; className: string }[] = [
  {
    value: 'P',
    label: 'P',
    title: 'Presente',
    className: 'bg-success text-white border-success',
  },
  { value: 'A', label: 'A', title: 'Ausente', className: 'bg-error text-white border-error' },
  { value: 'J', label: 'J', title: 'Justificado', className: 'bg-warning text-white border-warning' },
];

export default function DocenteAsistenciaPage() {
  const today = useState(() => new Date())[0];
  const [fecha, setFecha] = useState(today);
  const [materia, setMateria] = useState(ASISTENCIA_MATERIAS[0]);
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS_ASISTENCIA);

  const cambiarDia = (delta: number) => {
    const nueva = new Date(fecha);
    nueva.setDate(fecha.getDate() + delta);
    setFecha(nueva);
  };

  const setEstado = (id: string, nuevo: EstadoAsistencia) => {
    setAlumnos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: a.estado === nuevo ? null : nuevo } : a)),
    );
  };

  const presentes = alumnos.filter((a) => a.estado === 'P').length;
  const ausentes = alumnos.filter((a) => a.estado === 'A').length;
  const justificados = alumnos.filter((a) => a.estado === 'J').length;

  const fechaLabel = `${DIAS[fecha.getDay()]}, ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;

  return (
    <div>
      <PageHeader title="Tomar Asistencia" subtitle={fechaLabel} />

      <div className="card mb-5 flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => cambiarDia(-1)}
            className="btn-ghost cursor-pointer rounded-full p-2"
            aria-label="Día anterior"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <span className="min-w-44 text-center font-bold text-neutral">{fechaLabel}</span>
          <button
            type="button"
            onClick={() => cambiarDia(1)}
            className="btn-ghost cursor-pointer rounded-full p-2"
            aria-label="Día siguiente"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
        <Button title="Hoy" variant="outline" onClick={() => setFecha(today)} className="px-4 py-2 text-xs" />
      </div>

      <div className="mb-6 max-w-md">
        <SelectInput
          label="Materia / Curso"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          options={ASISTENCIA_MATERIAS.map((m) => ({ value: m, label: m }))}
        />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="Presentes" value={String(presentes)} icon={Check} tone="success" />
        <StatCard label="Ausentes" value={String(ausentes)} icon={ChevronRight} tone="error" />
        <StatCard label="Justificados" value={String(justificados)} icon={Check} tone="warning" />
      </div>

      <ul className="space-y-3">
        {alumnos.map((alumno) => (
          <li key={alumno.id} className="card flex flex-wrap items-center gap-4 p-4">
            <span
              className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: alumno.avatarColor }}
            >
              {alumno.iniciales}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-neutral">{alumno.nombre}</p>
              <p className="text-sm text-secondary">Legajo: {alumno.legajo}</p>
            </div>

            <div className="flex gap-2" role="group" aria-label={`Asistencia de ${alumno.nombre}`}>
              {ESTADOS.map((estado) => (
                <button
                  key={estado.label}
                  type="button"
                  title={estado.title}
                  aria-label={estado.title}
                  aria-pressed={alumno.estado === estado.value}
                  onClick={() => setEstado(alumno.id, estado.value)}
                  className={`size-10 cursor-pointer rounded-lg border-2 text-sm font-black transition ${
                    alumno.estado === estado.value
                      ? estado.className
                      : 'border-border/60 bg-white text-outline hover:border-primary hover:text-primary'
                  }`}
                >
                  {estado.label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <Button title="Guardar asistencia" icon={<Save className="size-4" aria-hidden />} />
      </div>
    </div>
  );
}
