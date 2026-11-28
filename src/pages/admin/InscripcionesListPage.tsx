import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  GraduationCap,
  LayoutGrid,
  List,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InscripcionDetailModal from '@/components/admin/InscripcionDetailModal';
import NuevaInscripcionModal from '@/components/admin/NuevaInscripcionModal';
import { Alert, Button, EmptyState, PageHeader } from '@/components/ui';
import { getAlumnos } from '@/services/alumnoService';
import { getCursosDivisionTurno } from '@/services/cursoDivisionTurnoService';
import { getDocentes, type DocenteApi } from '@/services/docenteService';
import {
  cambiarEstadoInscripcion,
  getInscripciones,
} from '@/services/inscripcionService';
import { getMaterias } from '@/services/materiaService';
import type { AlumnoApi } from '@/types/alumno';
import type { CursoDivisionTurno } from '@/types/cursoDivisionTurno';
import type { EstadoInscripcion, Inscripcion } from '@/types/inscripcion';
import type { Materia } from '@/types/materia';

type PestañaInscripcion = 'pendientes' | 'aprobadas' | 'rechazadas' | 'todas';

export default function InscripcionesListPage() {
  const [tab, setTab] = useState<PestañaInscripcion>('pendientes');
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [alumnos, setAlumnos] = useState<AlumnoApi[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cursos, setCursos] = useState<CursoDivisionTurno[]>([]);
  const [docentes, setDocentes] = useState<DocenteApi[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCurso, setFiltroCurso] = useState<string>('todos');
  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');

  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState<Inscripcion | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);

  const [cambiandoId, setCambiandoId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const cargarDatos = useCallback(() => {
    setLoading(true);
    setError('');

    Promise.all([
      getInscripciones(),
      getAlumnos().catch(() => [] as AlumnoApi[]),
      getMaterias().catch(() => [] as Materia[]),
      getCursosDivisionTurno().catch(() => [] as CursoDivisionTurno[]),
      getDocentes().catch(() => [] as DocenteApi[]),
    ])
      .then(([inscripcionesData, alumnosData, materiasData, cursosData, docentesData]) => {
        setInscripciones(inscripcionesData);
        setAlumnos(alumnosData);
        setMaterias(materiasData);
        setCursos(cursosData);
        setDocentes(docentesData);
      })
      .catch(() => {
        setError('No se pudo cargar el listado de inscripciones. Intenta nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      getInscripciones(),
      getAlumnos().catch(() => [] as AlumnoApi[]),
      getMaterias().catch(() => [] as Materia[]),
      getCursosDivisionTurno().catch(() => [] as CursoDivisionTurno[]),
      getDocentes().catch(() => [] as DocenteApi[]),
    ])
      .then(([inscripcionesData, alumnosData, materiasData, cursosData, docentesData]) => {
        setInscripciones(inscripcionesData);
        setAlumnos(alumnosData);
        setMaterias(materiasData);
        setCursos(cursosData);
        setDocentes(docentesData);
      })
      .catch(() => {
        setError('No se pudo cargar el listado de inscripciones. Intenta nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Diccionarios para resolución rápida O(1)
  const mapaAlumnos = useMemo(() => {
    const map = new Map<string, AlumnoApi>();
    for (const a of alumnos) map.set(a.id, a);
    return map;
  }, [alumnos]);

  const mapaMaterias = useMemo(() => {
    const map = new Map<number, Materia>();
    for (const m of materias) map.set(m.id, m);
    return map;
  }, [materias]);

  const mapaCursos = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of cursos) {
      map.set(c.id, `${c.curso}° "${c.division}" — ${c.turno}`);
    }
    return map;
  }, [cursos]);

  const mapaDocentes = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of docentes) {
      map.set(String(d.id), `Prof. ${d.first_name} ${d.last_name}`);
    }
    return map;
  }, [docentes]);

  // Conteo de métricas
  const conteo = useMemo(() => {
    let pendientes = 0;
    let aprobadas = 0;
    let rechazadas = 0;

    for (const i of inscripciones) {
      if (i.estado === 'pendiente') pendientes++;
      else if (i.estado === 'aprobado') aprobadas++;
      else if (i.estado === 'rechazado') rechazadas++;
    }

    return {
      total: inscripciones.length,
      pendientes,
      aprobadas,
      rechazadas,
    };
  }, [inscripciones]);

  // Filtrado reactivo
  const inscripcionesFiltradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return inscripciones.filter((i) => {
      // Filtro por pestaña
      if (tab === 'pendientes' && i.estado !== 'pendiente') return false;
      if (tab === 'aprobadas' && i.estado !== 'aprobado') return false;
      if (tab === 'rechazadas' && i.estado !== 'rechazado') return false;

      const alumno = mapaAlumnos.get(i.alumno_id);
      const materia = mapaMaterias.get(i.materia_id);
      const cursoNombre = materia ? mapaCursos.get(materia.curso_division_turno_id) ?? '' : '';

      // Filtro por curso
      if (filtroCurso !== 'todos' && materia) {
        if (String(materia.curso_division_turno_id) !== filtroCurso) return false;
      }

      // Filtro por texto
      if (!term) return true;

      const nombreAlumno = alumno ? `${alumno.first_name} ${alumno.last_name}`.toLowerCase() : '';
      const dniAlumno = alumno ? String(alumno.dni) : '';
      const usuarioAlumno = alumno ? alumno.username.toLowerCase() : '';
      const nombreMateria = materia ? materia.nombre.toLowerCase() : '';

      return (
        nombreAlumno.includes(term) ||
        dniAlumno.includes(term) ||
        usuarioAlumno.includes(term) ||
        nombreMateria.includes(term) ||
        cursoNombre.toLowerCase().includes(term) ||
        String(i.id).includes(term)
      );
    });
  }, [inscripciones, tab, busqueda, filtroCurso, mapaAlumnos, mapaMaterias, mapaCursos]);

  const handleCambiarEstado = async (id: number, nuevoEstado: EstadoInscripcion) => {
    setCambiandoId(id);
    try {
      const updated = await cambiarEstadoInscripcion(id, nuevoEstado);
      setInscripciones((prev) =>
        prev.map((item) => (item.id === id ? { ...item, estado: updated.estado, estado_label: updated.estado_label } : item)),
      );

      if (inscripcionSeleccionada && inscripcionSeleccionada.id === id) {
        setInscripcionSeleccionada((prev) =>
          prev ? { ...prev, estado: updated.estado, estado_label: updated.estado_label } : null,
        );
      }

      const accionTexto = nuevoEstado === 'aprobado' ? 'aprobada' : 'rechazada';
      setToast({
        tipo: 'success',
        texto: `La inscripción #${id} fue ${accionTexto} exitosamente.`,
      });
    } catch {
      setToast({
        tipo: 'error',
        texto: 'No se pudo actualizar el estado de la inscripción. Intenta nuevamente.',
      });
    } finally {
      setCambiandoId(null);
    }
  };

  const abrirDetalle = (inscripcion: Inscripcion) => {
    setInscripcionSeleccionada(inscripcion);
    setModalDetalleAbierto(true);
  };

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '—';
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const [y, m, d] = fechaStr.split('-');
      return `${d}/${m}/${y}`;
    }
    return fechaStr;
  };

  const getBadgeEstado = (estado: EstadoInscripcion) => {
    switch (estado) {
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3" />
            Aprobada
          </span>
        );
      case 'rechazado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="size-3" />
            Rechazada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="size-3" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Inscripciones"
        subtitle={`${conteo.total} solicitud${conteo.total === 1 ? '' : 'es'} registrada${conteo.total === 1 ? '' : 's'} en el ciclo lectivo`}
        actions={
          <Button
            title="Nueva Inscripción"
            icon={<Plus className="size-4" aria-hidden />}
            onClick={() => setModalNuevoAbierto(true)}
          />
        }
      />

      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            toast.tipo === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.tipo === 'success' ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{toast.texto}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {error && <Alert variant="error" message={error} />}

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <BookOpen className="size-5.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Total Solicitudes</p>
            <p className="text-xl font-bold text-on-surface">{conteo.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <Clock className="size-5.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Pendientes</p>
            <p className="text-xl font-bold text-amber-700">{conteo.pendientes}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 className="size-5.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Aprobadas</p>
            <p className="text-xl font-bold text-emerald-700">{conteo.aprobadas}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <XCircle className="size-5.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant">Rechazadas</p>
            <p className="text-xl font-bold text-rose-700">{conteo.rechazadas}</p>
          </div>
        </div>
      </div>

      {/* Controles de Filtros y Búsqueda */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/60 pb-3">
          {/* Pestañas */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setTab('pendientes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'pendientes'
                  ? 'bg-amber-100/70 text-amber-900 border border-amber-300/80 shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Clock className="size-3.5" />
              Pendientes
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200/80 text-amber-900 font-bold">
                {conteo.pendientes}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('aprobadas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'aprobadas'
                  ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300/80 shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              Aprobadas
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200/80 text-emerald-900 font-bold">
                {conteo.aprobadas}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('rechazadas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'rechazadas'
                  ? 'bg-rose-100/70 text-rose-900 border border-rose-300/80 shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <XCircle className="size-3.5" />
              Rechazadas
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200/80 text-rose-900 font-bold">
                {conteo.rechazadas}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('todas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'todas'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Todas
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-bold">
                {conteo.total}
              </span>
            </button>
          </div>

          {/* Toggle de Vista */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setVista('tabla')}
              className={`p-1.5 rounded-lg transition-colors ${
                vista === 'tabla'
                  ? 'bg-white text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Vista de tabla"
              aria-label="Vista de tabla"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setVista('tarjetas')}
              className={`p-1.5 rounded-lg transition-colors ${
                vista === 'tarjetas'
                  ? 'bg-white text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Vista de tarjetas"
              aria-label="Vista de tarjetas"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtro de Curso */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por alumno, DNI, materia o curso..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-outline-variant bg-white focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl border border-outline-variant bg-white focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              aria-label="Filtrar por curso"
            >
              <option value="todos">Todos los Cursos</option>
              {cursos.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.curso}° "{c.division}" — {c.turno}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={cargarDatos}
              disabled={loading}
              className="p-2.5 rounded-xl border border-outline-variant bg-white hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
              title="Actualizar listado"
              aria-label="Actualizar listado"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal: Listado */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-xs font-medium text-on-surface-variant">Cargando inscripciones...</p>
        </div>
      ) : inscripcionesFiltradas.length === 0 ? (
        <EmptyState
          title="No se encontraron inscripciones"
          subtitle={
            busqueda || filtroCurso !== 'todos'
              ? 'No hay solicitudes que coincidan con los filtros aplicados.'
              : tab === 'pendientes'
              ? '¡Excelente! No hay solicitudes de inscripción pendientes de revisión.'
              : 'No hay inscripciones registradas en esta categoría.'
          }
        />
      ) : vista === 'tabla' ? (
        /* Vista de Tabla */
        <div className="overflow-hidden rounded-2xl bg-white border border-outline-variant/60 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant font-semibold">
                  <th className="py-3 px-4">Alumno</th>
                  <th className="py-3 px-4">Materia Solicitada</th>
                  <th className="py-3 px-4">Curso / Turno</th>
                  <th className="py-3 px-4">Fecha Solicitud</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {inscripcionesFiltradas.map((i) => {
                  const alumno = mapaAlumnos.get(i.alumno_id);
                  const materia = mapaMaterias.get(i.materia_id);
                  const cursoNombre = materia
                    ? mapaCursos.get(materia.curso_division_turno_id) ?? 'No asignado'
                    : '—';
                  const iniciales = alumno
                    ? `${alumno.first_name[0] ?? ''}${alumno.last_name[0] ?? ''}`.toUpperCase()
                    : 'AL';

                  const procesando = cambiandoId === i.id;

                  return (
                    <tr
                      key={i.id}
                      className="hover:bg-surface-container-lowest/80 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                            {iniciales}
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">
                              {alumno
                                ? `${alumno.first_name} ${alumno.last_name}`
                                : `Alumno ID: ${i.alumno_id}`}
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              DNI: {alumno?.dni ? Number(alumno.dni).toLocaleString('es-AR') : 'S/D'} • @{alumno?.username ?? i.alumno_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-on-surface">
                          {materia?.nombre ?? `Materia #${i.materia_id}`}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {materia ? mapaDocentes.get(materia.docente_id) ?? 'Docente no asignado' : '—'}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-on-surface font-medium">
                          <GraduationCap className="size-3 text-primary" />
                          {cursoNombre}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-on-surface-variant">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Calendar className="size-3 text-on-surface-variant" />
                          {formatearFecha(i.fecha_inscripcion)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getBadgeEstado(i.estado)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => abrirDetalle(i)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                            title="Ver ficha completa"
                            aria-label="Ver ficha completa"
                          >
                            <Eye className="size-4" />
                          </button>

                          {i.estado !== 'aprobado' && (
                            <button
                              type="button"
                              onClick={() => handleCambiarEstado(i.id, 'aprobado')}
                              disabled={procesando}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                              title="Aprobar inscripción"
                            >
                              {procesando ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Check className="size-3" />
                              )}
                              Aprobar
                            </button>
                          )}

                          {i.estado !== 'rechazado' && (
                            <button
                              type="button"
                              onClick={() => handleCambiarEstado(i.id, 'rechazado')}
                              disabled={procesando}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                              title="Rechazar inscripción"
                            >
                              {procesando ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <X className="size-3" />
                              )}
                              Rechazar
                            </button>
                          )}
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
        /* Vista de Tarjetas */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inscripcionesFiltradas.map((i) => {
            const alumno = mapaAlumnos.get(i.alumno_id);
            const materia = mapaMaterias.get(i.materia_id);
            const cursoNombre = materia
              ? mapaCursos.get(materia.curso_division_turno_id) ?? 'No asignado'
              : '—';
            const iniciales = alumno
              ? `${alumno.first_name[0] ?? ''}${alumno.last_name[0] ?? ''}`.toUpperCase()
              : 'AL';
            const procesando = cambiandoId === i.id;

            return (
              <div
                key={i.id}
                className="p-5 rounded-2xl bg-white border border-outline-variant/60 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {iniciales}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-on-surface truncate">
                          {alumno
                            ? `${alumno.first_name} ${alumno.last_name}`
                            : `Alumno ID: ${i.alumno_id}`}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          DNI: {alumno?.dni ? Number(alumno.dni).toLocaleString('es-AR') : 'S/D'} • @{alumno?.username ?? i.alumno_id}
                        </p>
                      </div>
                    </div>
                    {getBadgeEstado(i.estado)}
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                      <BookOpen className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">{materia?.nombre ?? `Materia #${i.materia_id}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                      <GraduationCap className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">{cursoNombre}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span>Solicitada: {formatearFecha(i.fecha_inscripcion)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => abrirDetalle(i)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Eye className="size-3.5" />
                    Detalles
                  </button>

                  <div className="flex items-center gap-1.5">
                    {i.estado !== 'aprobado' && (
                      <button
                        type="button"
                        onClick={() => handleCambiarEstado(i.id, 'aprobado')}
                        disabled={procesando}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                      >
                        {procesando ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Check className="size-3" />
                        )}
                        Aprobar
                      </button>
                    )}

                    {i.estado !== 'rechazado' && (
                      <button
                        type="button"
                        onClick={() => handleCambiarEstado(i.id, 'rechazado')}
                        disabled={procesando}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                      >
                        {procesando ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <X className="size-3" />
                        )}
                        Rechazar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modales */}
      <InscripcionDetailModal
        isOpen={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        inscripcion={inscripcionSeleccionada}
        alumno={inscripcionSeleccionada ? mapaAlumnos.get(inscripcionSeleccionada.alumno_id) ?? null : null}
        materia={inscripcionSeleccionada ? mapaMaterias.get(inscripcionSeleccionada.materia_id) ?? null : null}
        cursoNombre={
          inscripcionSeleccionada && mapaMaterias.get(inscripcionSeleccionada.materia_id)
            ? mapaCursos.get(mapaMaterias.get(inscripcionSeleccionada.materia_id)!.curso_division_turno_id)
            : undefined
        }
        docenteNombre={
          inscripcionSeleccionada && mapaMaterias.get(inscripcionSeleccionada.materia_id)
            ? mapaDocentes.get(mapaMaterias.get(inscripcionSeleccionada.materia_id)!.docente_id)
            : undefined
        }
        onCambiarEstado={handleCambiarEstado}
        cambiandoEstado={cambiandoId !== null}
      />

      <NuevaInscripcionModal
        isOpen={modalNuevoAbierto}
        onClose={() => setModalNuevoAbierto(false)}
        alumnos={alumnos}
        materias={materias}
        mapaCursos={mapaCursos}
        onInscripcionCreada={(nueva) => {
          setInscripciones((prev) => [nueva, ...prev]);
          setToast({
            tipo: 'success',
            texto: 'Inscripción registrada correctamente.',
          });
        }}
      />
    </div>
  );
}
