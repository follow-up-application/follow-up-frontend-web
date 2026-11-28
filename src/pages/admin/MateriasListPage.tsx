import {
  AlertTriangle,
  BookCheck,
  BookOpen,
  BookPlus,
  BookX,
  Clock,
  Edit2,
  Eye,
  GraduationCap,
  LayoutGrid,
  List,
  Loader2,
  RefreshCw,
  School,
  Search,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MateriaDetailEditModal from '@/components/admin/MateriaDetailEditModal';
import { Alert, Button, EmptyState, PageHeader } from '@/components/ui';
import { PALETA_AVATARES } from '@/data/admin';
import { getCursosDivisionTurno } from '@/services/cursoDivisionTurnoService';
import { getDocentes, type DocenteApi } from '@/services/docenteService';
import {
  getMaterias,
  habilitarMateria,
  inhabilitarMateria,
} from '@/services/materiaService';
import type { CursoDivisionTurno } from '@/types/cursoDivisionTurno';
import type { Materia } from '@/types/materia';

type PestañaMateria = 'activas' | 'inhabilitadas';

export default function MateriasListPage() {
  const [tab, setTab] = useState<PestañaMateria>('activas');
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [inhabilitadas, setInhabilitadas] = useState<Materia[]>([]);
  const [docentes, setDocentes] = useState<DocenteApi[]>([]);
  const [cursos, setCursos] = useState<CursoDivisionTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroTurno, setFiltroTurno] = useState<string>('todos');
  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');

  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materia | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [materiaConfirmarToggle, setMateriaConfirmarToggle] = useState<Materia | null>(null);
  const [toggleando, setToggleando] = useState(false);

  const cargarDatos = useCallback(() => {
    setLoading(true);
    setError('');

    Promise.all([
      getMaterias(),
      getDocentes().catch(() => [] as DocenteApi[]),
      getCursosDivisionTurno().catch(() => [] as CursoDivisionTurno[]),
    ])
      .then(([materiasData, docentesData, cursosData]) => {
        setMaterias(materiasData.map((m) => ({ ...m, activo: true })));
        setDocentes(docentesData);
        setCursos(cursosData);
      })
      .catch(() => {
        setError('No se pudo cargar el listado de materias. Intenta nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      getMaterias(),
      getDocentes().catch(() => [] as DocenteApi[]),
      getCursosDivisionTurno().catch(() => [] as CursoDivisionTurno[]),
    ])
      .then(([materiasData, docentesData, cursosData]) => {
        setMaterias(materiasData.map((m) => ({ ...m, activo: true })));
        setDocentes(docentesData);
        setCursos(cursosData);
        setError('');
      })
      .catch(() => {
        setError('No se pudo cargar el listado de materias. Intenta nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const mapaDocentes = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of docentes) {
      map.set(String(d.id), `Prof. ${d.first_name} ${d.last_name}`);
    }
    return map;
  }, [docentes]);

  const mapaCursos = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of cursos) {
      map.set(c.id, `${c.curso}° "${c.division}" — ${c.turno}`);
    }
    return map;
  }, [cursos]);

  const getDocenteNombre = useCallback(
    (docenteId: string) => mapaDocentes.get(docenteId) ?? 'Docente no asignado',
    [mapaDocentes],
  );

  const getCursoLabel = useCallback(
    (cursoId: number) => mapaCursos.get(cursoId) ?? `Curso #${cursoId}`,
    [mapaCursos],
  );

  const listaActual = tab === 'activas' ? materias : inhabilitadas;

  const filtradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return listaActual.filter((m) => {
      const docenteNombre = getDocenteNombre(m.docente_id).toLowerCase();
      const cursoNombre = getCursoLabel(m.curso_division_turno_id).toLowerCase();

      const matchTexto =
        !term ||
        m.nombre.toLowerCase().includes(term) ||
        (m.descripcion && m.descripcion.toLowerCase().includes(term)) ||
        docenteNombre.includes(term) ||
        cursoNombre.includes(term);

      const matchTurno =
        filtroTurno === 'todos' ||
        (m.turno && m.turno.toLowerCase() === filtroTurno.toLowerCase());

      return matchTexto && matchTurno;
    });
  }, [listaActual, busqueda, filtroTurno, getDocenteNombre, getCursoLabel]);

  const handleToggleEstado = async () => {
    if (!materiaConfirmarToggle) return;

    const mat = materiaConfirmarToggle;
    const esActiva = mat.activo !== false;
    setToggleando(true);

    try {
      if (esActiva) {
        await inhabilitarMateria(mat.id);
        const inhabilitadaMat: Materia = { ...mat, activo: false };
        setMaterias((prev) => prev.filter((item) => item.id !== mat.id));
        setInhabilitadas((prev) => [inhabilitadaMat, ...prev]);
        if (materiaSeleccionada?.id === mat.id) {
          setMateriaSeleccionada(inhabilitadaMat);
        }
      } else {
        await habilitarMateria(mat.id);
        const habilitadaMat: Materia = { ...mat, activo: true };
        setInhabilitadas((prev) => prev.filter((item) => item.id !== mat.id));
        setMaterias((prev) => [habilitadaMat, ...prev]);
        if (materiaSeleccionada?.id === mat.id) {
          setMateriaSeleccionada(habilitadaMat);
        }
      }
      setMateriaConfirmarToggle(null);
    } catch {
      setError(
        `No se pudo ${esActiva ? 'inhabilitar' : 'habilitar'} la materia "${mat.nombre}".`,
      );
    } finally {
      setToggleando(false);
    }
  };

  const handleMateriaUpdated = (updated: Materia) => {
    if (updated.activo !== false) {
      setMaterias((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } else {
      setInhabilitadas((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    }
    setMateriaSeleccionada(updated);
  };

  const abrirFicha = (mat: Materia) => {
    setMateriaSeleccionada(mat);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listado de Materias"
        subtitle={`${materias.length} materia${materias.length === 1 ? '' : 's'} activa${materias.length === 1 ? '' : 's'} en el plan institucional`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              title="Recargar"
              variant="outline"
              onClick={cargarDatos}
              icon={<RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />}
            />
            <Link to="/admin/materias/nuevo">
              <Button
                title="Cargar materia"
                icon={<BookPlus className="size-4" aria-hidden />}
              />
            </Link>
          </div>
        }
      />

      {error ? <Alert message={error} /> : null}

      {/* Tabs Activas / Inhabilitadas */}
      <div className="flex border-b border-border/50 gap-2">
        <button
          type="button"
          onClick={() => setTab('activas')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'activas'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-neutral'
          }`}
        >
          <BookCheck className="size-4" />
          <span>Materias Activas</span>
          <span className="badge bg-primary/10 text-primary text-xs">{materias.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('inhabilitadas')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'inhabilitadas'
              ? 'border-error text-error'
              : 'border-transparent text-secondary hover:text-neutral'
          }`}
        >
          <BookX className="size-4" />
          <span>Inhabilitadas</span>
          <span className="badge bg-error/10 text-error text-xs">{inhabilitadas.length}</span>
        </button>
      </div>

      {/* Barra de Filtros, Búsqueda y Vistas */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
              aria-hidden
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por materia, docente o curso..."
              aria-label="Buscar materia"
              className="field-input pl-11"
            />
            {busqueda ? (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded p-1 text-outline hover:text-secondary"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
              className="field-input py-2 pr-8 text-sm"
              aria-label="Filtrar por turno"
            >
              <option value="todos">Todos los turnos</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>

            <div className="flex rounded-xl border border-border/50 bg-surface p-1">
              <button
                type="button"
                onClick={() => setVista('tabla')}
                title="Vista en tabla"
                className={`rounded-lg p-2 transition-colors cursor-pointer ${
                  vista === 'tabla'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-secondary hover:text-neutral'
                }`}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setVista('tarjetas')}
                title="Vista en tarjetas"
                className={`rounded-lg p-2 transition-colors cursor-pointer ${
                  vista === 'tarjetas'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-secondary hover:text-neutral'
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
          <Loader2 className="size-6 animate-spin text-primary mb-2" aria-hidden />
          <p className="text-sm font-semibold text-on-surface">Cargando materias...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={
            tab === 'activas'
              ? 'No se encontraron materias'
              : 'No hay materias inhabilitadas'
          }
          subtitle={
            busqueda || filtroTurno !== 'todos'
              ? 'Probá modificando los filtros de búsqueda.'
              : tab === 'activas'
                ? 'Comenzá cargando la primera materia del plan de estudios.'
                : 'No hay materias inhabilitadas en este momento.'
          }
        >
          {tab === 'activas' ? (
            <Link to="/admin/materias/nuevo">
              <Button
                title="Cargar materia"
                icon={<BookPlus className="size-4" aria-hidden />}
              />
            </Link>
          ) : null}
        </EmptyState>
      ) : vista === 'tabla' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 bg-surface/50 text-xs font-semibold uppercase text-secondary">
                <tr>
                  <th className="px-5 py-3.5">Materia</th>
                  <th className="px-5 py-3.5">Curso / División</th>
                  <th className="px-5 py-3.5">Turno</th>
                  <th className="px-5 py-3.5">Docente Asignado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtradas.map((materia, index) => {
                  const docenteNombre = getDocenteNombre(materia.docente_id);
                  const cursoLabel = getCursoLabel(materia.curso_division_turno_id);
                  const color = PALETA_AVATARES[index % PALETA_AVATARES.length];
                  const esActiva = materia.activo !== false;

                  return (
                    <tr key={materia.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-xl text-white font-bold text-xs"
                            style={{ backgroundColor: color }}
                          >
                            <BookOpen className="size-4" />
                          </span>
                          <div>
                            <p className="font-bold text-neutral">{materia.nombre}</p>
                            <p className="text-xs text-secondary line-clamp-1 max-w-xs">
                              {materia.descripcion || 'Sin descripción adicional'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-neutral font-medium">
                          <GraduationCap className="size-4 text-secondary shrink-0" />
                          <span>{cursoLabel}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <Clock className="size-3" />
                          {materia.turno || 'Sin turno'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <School className="size-4 text-secondary shrink-0" />
                          <span className="font-medium text-neutral">{docenteNombre}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            title="Ficha"
                            variant="outline"
                            onClick={() => abrirFicha(materia)}
                            icon={<Eye className="size-3.5" />}
                          />
                          <Button
                            title={esActiva ? 'Inhabilitar' : 'Habilitar'}
                            variant={esActiva ? 'danger' : 'outline'}
                            onClick={() => setMateriaConfirmarToggle(materia)}
                            icon={
                              esActiva ? (
                                <Trash2 className="size-3.5" />
                              ) : (
                                <BookCheck className="size-3.5 text-emerald-600" />
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((materia, index) => {
            const docenteNombre = getDocenteNombre(materia.docente_id);
            const cursoLabel = getCursoLabel(materia.curso_division_turno_id);
            const color = PALETA_AVATARES[index % PALETA_AVATARES.length];
            const esActiva = materia.activo !== false;

            return (
              <div
                key={materia.id}
                className="card flex flex-col justify-between p-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl text-white font-bold"
                        style={{ backgroundColor: color }}
                      >
                        <BookOpen className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-neutral line-clamp-1">{materia.nombre}</h3>
                        <span className="badge mt-0.5 bg-primary/10 text-primary text-xs">
                          {materia.turno || 'Turno no especificado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary mb-4 line-clamp-2">
                    {materia.descripcion || 'Sin descripción adicional registrada.'}
                  </p>

                  <div className="space-y-2 border-t border-border/50 pt-3 text-xs text-secondary">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-neutral">{cursoLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-neutral">{docenteNombre}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-border/50 pt-3 flex items-center justify-between gap-2">
                  <Button
                    title={esActiva ? 'Inhabilitar' : 'Habilitar'}
                    variant={esActiva ? 'danger' : 'outline'}
                    onClick={() => setMateriaConfirmarToggle(materia)}
                    icon={
                      esActiva ? (
                        <Trash2 className="size-3.5" />
                      ) : (
                        <BookCheck className="size-3.5 text-emerald-600" />
                      )
                    }
                  />
                  <Button
                    title="Ver Ficha / Editar"
                    variant="outline"
                    onClick={() => abrirFicha(materia)}
                    icon={<Edit2 className="size-3.5" />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ficha y Edición de Materia */}
      <MateriaDetailEditModal
        materia={materiaSeleccionada}
        docentes={docentes}
        cursos={cursos}
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onMateriaUpdated={handleMateriaUpdated}
        onToggleInhabilitar={(mat) => {
          setModalAbierto(false);
          setMateriaConfirmarToggle(mat);
        }}
      />

      {/* Modal Confirmación de Inhabilitación / Habilitación */}
      {materiaConfirmarToggle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-border/50 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-materia-toggle-title"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${
                  materiaConfirmarToggle.activo !== false
                    ? 'bg-error/10 text-error'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {materiaConfirmarToggle.activo !== false ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <Shield className="size-5" />
                )}
              </div>
              <h2 id="confirm-materia-toggle-title" className="text-lg font-bold text-neutral">
                {materiaConfirmarToggle.activo !== false
                  ? 'Inhabilitar Materia'
                  : 'Habilitar Materia'}
              </h2>
            </div>

            <p className="text-sm text-secondary">
              ¿Estás seguro de que deseas{' '}
              {materiaConfirmarToggle.activo !== false ? 'inhabilitar' : 'volver a habilitar'}{' '}
              <strong className="text-neutral font-semibold">
                "{materiaConfirmarToggle.nombre}"
              </strong>?{' '}
              {materiaConfirmarToggle.activo !== false
                ? 'La materia no estará disponible para nuevas inscripciones.'
                : 'La materia volverá a estar disponible para el ciclo lectivo.'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                title="Cancelar"
                variant="outline"
                disabled={toggleando}
                onClick={() => setMateriaConfirmarToggle(null)}
              />
              <Button
                title={
                  toggleando
                    ? 'Procesando...'
                    : materiaConfirmarToggle.activo !== false
                      ? 'Sí, inhabilitar'
                      : 'Sí, habilitar'
                }
                variant={materiaConfirmarToggle.activo !== false ? 'danger' : 'primary'}
                disabled={toggleando}
                onClick={handleToggleEstado}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
