import { Save } from 'lucide-react';
import { useState } from 'react';
import { Button, PageHeader, SelectInput } from '@/components/ui';
import { MOCK_ALUMNOS_NOTAS, NOTAS_MATERIAS, TIPOS_EVAL, type TipoEval } from '@/data/docente';

function colorNota(nota: string): string {
  if (nota === '') return 'border-border/60 text-outline';
  const num = Number.parseFloat(nota.replace(',', '.'));
  if (Number.isNaN(num)) return 'border-border/60 text-outline';
  return num >= 6 ? 'border-success text-success' : 'border-error text-error';
}

export default function DocenteNotasPage() {
  const [materia, setMateria] = useState(NOTAS_MATERIAS[0]);
  const [tipo, setTipo] = useState<TipoEval>('Examen');
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS_NOTAS);

  const setNota = (id: string, value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '');
    setAlumnos((prev) => prev.map((a) => (a.id === id ? { ...a, nota: cleaned } : a)));
  };

  return (
    <div>
      <PageHeader title="Calificaciones" subtitle="Carga de notas por evaluación" />

      <div className="card mb-5 grid gap-4 p-5 lg:grid-cols-2">
        <SelectInput
          label="Materia"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          options={NOTAS_MATERIAS.map((m) => ({ value: m, label: m }))}
        />

        <div>
          <span className="field-label">Tipo de evaluación</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIPOS_EVAL.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTipo(item.id)}
                aria-pressed={tipo === item.id}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition ${
                  tipo === item.id
                    ? 'border-primary bg-primary/8 text-primary'
                    : 'border-border/60 bg-white text-secondary hover:border-primary'
                }`}
              >
                <item.icono className="size-5" aria-hidden />
                {item.id}
              </button>
            ))}
          </div>
        </div>
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
              <p className="text-sm text-secondary">{alumno.idAlumno}</p>
            </div>

            <label className="flex items-center gap-2">
              <span className="sr-only">Nota de {alumno.nombre}</span>
              <input
                type="text"
                inputMode="decimal"
                value={alumno.nota}
                onChange={(e) => setNota(alumno.id, e.target.value)}
                placeholder="—"
                aria-label={`Nota de ${alumno.nombre}`}
                className={`w-20 rounded-lg border-2 bg-white px-2 py-2 text-center font-bold focus:outline-none ${colorNota(
                  alumno.nota,
                )}`}
              />
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <Button title={`Guardar notas - ${tipo}`} icon={<Save className="size-4" aria-hidden />} />
      </div>
    </div>
  );
}
