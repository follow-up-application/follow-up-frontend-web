import { api } from './apiClient';
import type {
  CambiarEstadoInscripcionRequest,
  CreateInscripcionRequest,
  EstadoInscripcion,
  Inscripcion,
} from '@/types/inscripcion';

/** GET /inscripciones — administrador y alumno. */
export async function getInscripciones(
  estado?: EstadoInscripcion,
  signal?: AbortSignal,
): Promise<Inscripcion[]> {
  return api.get<Inscripcion[]>('/inscripciones', {
    signal,
    query: estado ? { estado } : undefined,
  });
}

/** GET /inscripciones/{id} — administrador y alumno. */
export async function getInscripcion(
  id: number,
  signal?: AbortSignal,
): Promise<Inscripcion> {
  return api.get<Inscripcion>(`/inscripciones/${id}`, { signal });
}

/** POST /inscripciones — administrador y alumno. */
export async function crearInscripcion(
  request: CreateInscripcionRequest,
): Promise<Inscripcion> {
  return api.post<Inscripcion>('/inscripciones', request);
}

/** GET /alumnos/{id}/inscripciones — administrador y alumno. */
export async function getInscripcionesByAlumno(
  alumnoId: string,
  estado?: EstadoInscripcion,
  signal?: AbortSignal,
): Promise<Inscripcion[]> {
  return api.get<Inscripcion[]>(`/alumnos/${encodeURIComponent(alumnoId)}/inscripciones`, {
    signal,
    query: estado ? { estado } : undefined,
  });
}

/** GET /materias/{id}/inscripciones — administrador y docente. */
export async function getInscripcionesByMateria(
  materiaId: number,
  estado?: EstadoInscripcion,
  signal?: AbortSignal,
): Promise<Inscripcion[]> {
  return api.get<Inscripcion[]>(`/materias/${materiaId}/inscripciones`, {
    signal,
    query: estado ? { estado } : undefined,
  });
}

/** PUT /inscripciones/{id}/estado — administrador y docente. */
export async function cambiarEstadoInscripcion(
  id: number,
  estado: EstadoInscripcion,
): Promise<Inscripcion> {
  const payload: CambiarEstadoInscripcionRequest = { estado };
  return api.put<Inscripcion>(`/inscripciones/${id}/estado`, payload);
}
