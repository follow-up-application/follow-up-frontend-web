import { ClipboardCheck, GraduationCap, MessageSquarePlus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { DOCENTE_MATERIAS, MOCK_ALUMNOS_INSCRIPTOS } from '@/data/docente';

const ACCIONES = [
  { label: 'Asistencia', icon: ClipboardCheck, to: '/docente/asistencia', color: '#4A6FA5' },
  { label: 'Calificar', icon: GraduationCap, to: '/docente/notas', color: '#137333' },
  { label: 'Avisos', icon: MessageSquarePlus, to: '/docente/avisos/nuevo', color: '#B3261E' },
] as const;

export default function DocenteMateriaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const materia = DOCENTE_MATERIAS.find((m) => m.id === id) ?? DOCENTE_MATERIAS[0];

  return (
    <div>
      <PageHeader title={materia.nombre} subtitle={materia.subtitulo} />

      <div className="mb-8 grid grid-cols-3 gap-3">
        {ACCIONES.map((accion) => (
          <Link
            key={accion.to}
            to={accion.to}
            className="card flex flex-col items-center gap-2.5 p-5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <span
              className="grid size-12 place-items-center rounded-xl"
              style={{ backgroundColor: `${accion.color}15`, color: accion.color }}
            >
              <accion.icon className="size-6" aria-hidden />
            </span>
            <span className="text-sm font-bold text-neutral">{accion.label}</span>
          </Link>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral">Alumnos Inscriptos</h2>
        <span className="text-sm text-secondary">{MOCK_ALUMNOS_INSCRIPTOS.length} alumnos</span>
      </div>

      <ul className="space-y-3">
        {MOCK_ALUMNOS_INSCRIPTOS.map((alumno) => (
          <li key={alumno.id} className="card flex items-center gap-4 p-4">
            <span
              className="grid size-11 shrink-0 place-items-center rounded-full font-bold text-white"
              style={{ backgroundColor: alumno.avatarColor }}
            >
              {alumno.nombre.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-neutral">{alumno.nombre}</p>
              <p className="text-sm text-secondary">Legajo: {alumno.legajo}</p>
            </div>
            <Link
              to="/docente/observaciones"
              className="btn-ghost shrink-0 rounded-full p-2"
              aria-label={`Registrar observación para ${alumno.nombre}`}
            >
              <MessageSquarePlus className="size-5" style={{ color: '#4A6FA5' }} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
