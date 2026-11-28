import {
  AlertCircle,
  Calendar,
  Check,
  Loader2,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { crearInscripcion } from '@/services/inscripcionService';
import type { AlumnoApi } from '@/types/alumno';
import type { Inscripcion } from '@/types/inscripcion';
import type { Materia } from '@/types/materia';
import { ApiError } from '@/services/apiClient';

interface NuevaInscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumnos: AlumnoApi[];
  materias: Materia[];
  mapaCursos: Map<number, string>;
  onInscripcionCreada: (nueva: Inscripcion) => void;
}

export default function NuevaInscripcionModal({
  isOpen,
  onClose,
  alumnos,
  materias,
  mapaCursos,
  onInscripcionCreada,
}: NuevaInscripcionModalProps) {
  const [alumnoId, setAlumnoId] = useState<string>('');
  const [materiaId, setMateriaId] = useState<number | ''>('');
  const [busquedaAlumno, setBusquedaAlumno] = useState<string>('');
  const [fechaInscripcion, setFechaInscripcion] = useState<string>(
    () => new Date().toISOString().split('T')[0],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const alumnosFiltrados = useMemo(() => {
    const term = busquedaAlumno.trim().toLowerCase();
    if (!term) return alumnos.slice(0, 8);
    return alumnos
      .filter((a) => {
        const full = `${a.first_name} ${a.last_name}`.toLowerCase();
        const dni = String(a.dni);
        const username = a.username.toLowerCase();
        return full.includes(term) || dni.includes(term) || username.includes(term);
      })
      .slice(0, 10);
  }, [alumnos, busquedaAlumno]);

  const alumnoSeleccionado = useMemo(
    () => alumnos.find((a) => a.id === alumnoId) ?? null,
    [alumnos, alumnoId],
  );

  const materiaSeleccionada = useMemo(
    () => materias.find((m) => m.id === Number(materiaId)) ?? null,
    [materias, materiaId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumnoId) {
      setError('Debes seleccionar un alumno.');
      return;
    }
    if (!materiaId) {
      setError('Debes seleccionar una materia.');
      return;
    }

    setLoading(true);
    setError('');

    // Formatear fecha a DD/MM/YYYY si se especificó
    let fechaParam: string | undefined = undefined;
    if (fechaInscripcion) {
      const [y, m, d] = fechaInscripcion.split('-');
      if (y && m && d) {
        fechaParam = `${d}/${m}/${y}`;
      }
    }

    try {
      const nueva = await crearInscripcion({
        alumno_id: alumnoId,
        materia_id: Number(materiaId),
        fecha_inscripcion: fechaParam,
      });

      onInscripcionCreada(nueva);
      handleClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('El alumno ya se encuentra inscripto en la materia seleccionada.');
      } else {
        setError('No se pudo registrar la inscripción. Verifica los datos e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlumnoId('');
    setMateriaId('');
    setBusquedaAlumno('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-nueva-inscripcion-title"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" aria-hidden />
            </div>
            <div>
              <h3 id="modal-nueva-inscripcion-title" className="text-base font-semibold text-on-surface">
                Nueva Inscripción
              </h3>
              <p className="text-xs text-on-surface-variant">
                Matricular un alumno en una materia
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Selector de Alumno */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface">
              1. Seleccionar Alumno <span className="text-rose-500">*</span>
            </label>

            {alumnoSeleccionado ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {alumnoSeleccionado.first_name[0]}
                    {alumnoSeleccionado.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {alumnoSeleccionado.first_name} {alumnoSeleccionado.last_name}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      DNI: {Number(alumnoSeleccionado.dni).toLocaleString('es-AR')} • {alumnoSeleccionado.curso_division || 'Sin curso'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAlumnoId('')}
                  className="text-xs text-primary font-semibold hover:underline shrink-0 ml-2"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                  <input
                    type="text"
                    value={busquedaAlumno}
                    onChange={(e) => setBusquedaAlumno(e.target.value)}
                    placeholder="Buscar alumno por nombre, apellido o DNI..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-outline-variant/60 p-1 bg-surface-container-lowest">
                  {alumnosFiltrados.length === 0 ? (
                    <p className="p-3 text-center text-xs text-on-surface-variant">
                      No se encontraron alumnos con ese criterio.
                    </p>
                  ) : (
                    alumnosFiltrados.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setAlumnoId(a.id);
                          setBusquedaAlumno('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-surface-container transition-colors text-xs"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-on-surface">
                            {a.first_name} {a.last_name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant ml-2">
                            DNI: {a.dni}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-primary shrink-0 ml-2">
                          Seleccionar
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selector de Materia */}
          <div className="space-y-2">
            <label htmlFor="materia-select" className="block text-xs font-semibold text-on-surface">
              2. Materia de Destino <span className="text-rose-500">*</span>
            </label>
            <select
              id="materia-select"
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">Selecciona una materia...</option>
              {materias.map((m) => {
                const cursoTxt = mapaCursos.get(m.curso_division_turno_id) ?? `Curso #${m.curso_division_turno_id}`;
                return (
                  <option key={m.id} value={m.id}>
                    {m.nombre} — ({cursoTxt})
                  </option>
                );
              })}
            </select>
            {materiaSeleccionada && (
              <p className="text-[11px] text-on-surface-variant">
                Curso: {mapaCursos.get(materiaSeleccionada.curso_division_turno_id) ?? 'No asignado'}
              </p>
            )}
          </div>

          {/* Fecha de Inscripción */}
          <div className="space-y-2">
            <label htmlFor="fecha-select" className="block text-xs font-semibold text-on-surface">
              3. Fecha de Inscripción
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant pointer-events-none" />
              <input
                id="fecha-select"
                type="date"
                value={fechaInscripcion}
                onChange={(e) => setFechaInscripcion(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Por defecto se registrará con la fecha del día de hoy.
            </p>
          </div>

          <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !alumnoId || !materiaId}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              Confirmar Inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
