import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  School,
  X,
  XCircle,
} from 'lucide-react';
import type { AlumnoApi } from '@/types/alumno';
import type { EstadoInscripcion, Inscripcion } from '@/types/inscripcion';
import type { Materia } from '@/types/materia';

interface InscripcionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscripcion: Inscripcion | null;
  alumno: AlumnoApi | null;
  materia: Materia | null;
  cursoNombre?: string;
  docenteNombre?: string;
  onCambiarEstado: (id: number, nuevoEstado: EstadoInscripcion) => Promise<void>;
  cambiandoEstado: boolean;
}

export default function InscripcionDetailModal({
  isOpen,
  onClose,
  inscripcion,
  alumno,
  materia,
  cursoNombre,
  docenteNombre,
  onCambiarEstado,
  cambiandoEstado,
}: InscripcionDetailModalProps) {
  if (!isOpen || !inscripcion) return null;

  const nombreAlumno = alumno
    ? `${alumno.first_name} ${alumno.last_name}`
    : `Alumno ID: ${inscripcion.alumno_id}`;

  const inicialesAlumno = alumno
    ? `${alumno.first_name[0] ?? ''}${alumno.last_name[0] ?? ''}`.toUpperCase()
    : 'AL';

  const estadoBadge = {
    pendiente: {
      label: 'Pendiente de Aprobación',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      dotColor: 'bg-amber-500',
    },
    aprobado: {
      label: 'Inscripción Aprobada',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
    },
    rechazado: {
      label: 'Inscripción Rechazada',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      dotColor: 'bg-rose-500',
    },
  }[inscripcion.estado];

  const StatusIcon = estadoBadge.icon;

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return 'No especificada';
    // Si viene en formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const [year, month, day] = fechaStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return fechaStr;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-inscripcion-title"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" aria-hidden />
            </div>
            <div>
              <h3 id="modal-inscripcion-title" className="text-base font-semibold text-on-surface">
                Ficha Institucional de Inscripción
              </h3>
              <p className="text-xs text-on-surface-variant">
                Identificador #{inscripcion.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-on-primary shadow-xs">
              {inicialesAlumno}
              <span
                className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white ${estadoBadge.dotColor}`}
                title={estadoBadge.label}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-on-surface truncate">
                  {nombreAlumno}
                </h4>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge.color}`}
                >
                  <StatusIcon className="size-3" />
                  {estadoBadge.label}
                </span>
              </div>
              <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                DNI: {alumno?.dni ? Number(alumno.dni).toLocaleString('es-AR') : 'S/D'} • Usuario: {alumno?.username ?? inscripcion.alumno_id}
              </p>
              {alumno?.curso_division && (
                <p className="text-xs text-primary font-medium mt-1">
                  Curso: {alumno.curso_division}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                Materia Solicitada
              </span>
              <p className="font-semibold text-on-surface truncate">
                {materia?.nombre ?? `Materia #${inscripcion.materia_id}`}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {cursoNombre ?? 'Curso no especificado'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                <School className="size-3.5 text-primary" />
                Docente Titular
              </span>
              <p className="font-semibold text-on-surface truncate">
                {docenteNombre ?? 'No asignado'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {materia?.descripcion ? materia.descripcion : 'Sin descripción adicional'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                Fecha de Inscripción
              </span>
              <p className="font-semibold text-on-surface">
                {formatearFecha(inscripcion.fecha_inscripcion)}
              </p>
              <p className="text-xs text-on-surface-variant">
                Registrada en el sistema
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-1">
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-primary" />
                Condición Administrativa
              </span>
              <p className="font-semibold text-on-surface capitalize">
                {inscripcion.estado_label ?? inscripcion.estado}
              </p>
              <p className="text-xs text-on-surface-variant">
                {inscripcion.estado === 'pendiente'
                  ? 'Esperando resolución'
                  : inscripcion.estado === 'aprobado'
                  ? 'Matriculado regularmente'
                  : 'Rechazado por autoridad'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={cambiandoEstado}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              Cerrar Ficha
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {inscripcion.estado !== 'rechazado' && (
                <button
                  type="button"
                  onClick={() => onCambiarEstado(inscripcion.id, 'rechazado')}
                  disabled={cambiandoEstado}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                >
                  {cambiandoEstado ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <XCircle className="size-3.5" />
                  )}
                  Rechazar
                </button>
              )}

              {inscripcion.estado !== 'aprobado' && (
                <button
                  type="button"
                  onClick={() => onCambiarEstado(inscripcion.id, 'aprobado')}
                  disabled={cambiandoEstado}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50"
                >
                  {cambiandoEstado ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  Aprobar Inscripción
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
