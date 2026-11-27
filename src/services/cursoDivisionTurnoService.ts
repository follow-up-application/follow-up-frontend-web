import { api } from './apiClient';
import type {
  CreateCursoDivisionTurnoRequest,
  CursoDivisionTurno,
  UpdateCursoDivisionTurnoRequest,
} from '@/types/cursoDivisionTurno';
import type { Materia } from '@/types/materia';

/** GET /cursoDivisionTurno — solo administrador. */
export async function getCursosDivisionTurno(
  signal?: AbortSignal,
): Promise<CursoDivisionTurno[]> {
  return api.get<CursoDivisionTurno[]>('/cursoDivisionTurno', { signal });
}

/** POST /cursoDivisionTurno — solo administrador. */
export async function crearCursoDivisionTurno(
  request: CreateCursoDivisionTurnoRequest,
): Promise<CursoDivisionTurno> {
  return api.post<CursoDivisionTurno>('/cursoDivisionTurno', request);
}

/** GET /cursoDivisionTurno/{id} — solo administrador. */
export async function getCursoDivisionTurno(
  id: number,
  signal?: AbortSignal,
): Promise<CursoDivisionTurno> {
  return api.get<CursoDivisionTurno>(`/cursoDivisionTurno/${id}`, { signal });
}

/** PUT /cursoDivisionTurno/{id} — actualización de curso división turno. */
export async function updateCursoDivisionTurno(
  id: number,
  request: UpdateCursoDivisionTurnoRequest,
): Promise<CursoDivisionTurno> {
  return api.put<CursoDivisionTurno>(`/cursoDivisionTurno/${id}`, request);
}

/** PATCH /cursoDivisionTurno/{id}/inhabilitar — solo administrador. */
export async function inhabilitarCursoDivisionTurno(id: number): Promise<void> {
  await api.patch<void>(`/cursoDivisionTurno/${id}/inhabilitar`);
}

/** PATCH /cursoDivisionTurno/{id}/habilitar — solo administrador. */
export async function habilitarCursoDivisionTurno(id: number): Promise<void> {
  await api.patch<void>(`/cursoDivisionTurno/${id}/habilitar`);
}

/** GET /cursoDivisionTurno/{id}/materias — administrador y docente. */
export async function getMateriasByCursoDivisionTurno(
  id: number,
  signal?: AbortSignal,
): Promise<Materia[]> {
  return api.get<Materia[]>(`/cursoDivisionTurno/${id}/materias`, { signal });
}
