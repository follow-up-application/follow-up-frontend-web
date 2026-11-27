import { api } from './apiClient';
import type {
  CreateMateriaRequest,
  Materia,
  UpdateMateriaRequest,
} from '@/types/materia';

export type CreateMateriaPayload = CreateMateriaRequest;
export type UpdateMateriaPayload = UpdateMateriaRequest;

/** GET /materias — solo administrador. */
export async function getMaterias(signal?: AbortSignal): Promise<Materia[]> {
  return api.get<Materia[]>('/materias', { signal });
}

/** GET /materias/{id} — solo administrador. */
export async function getMateria(id: number, signal?: AbortSignal): Promise<Materia> {
  return api.get<Materia>(`/materias/${id}`, { signal });
}

/** POST /materias — solo administrador. */
export async function crearMateria(payload: CreateMateriaRequest): Promise<Materia> {
  return api.post<Materia>('/materias', payload);
}

/** PUT /materias/{id} — solo administrador. */
export async function updateMateria(
  id: number,
  payload: UpdateMateriaRequest,
): Promise<Materia> {
  return api.put<Materia>(`/materias/${id}`, payload);
}

/** PATCH /materias/{id}/inhabilitar — baja lógica. */
export async function inhabilitarMateria(id: number): Promise<void> {
  await api.patch<void>(`/materias/${id}/inhabilitar`);
}

/** PATCH /materias/{id}/habilitar — restaurar materia. */
export async function habilitarMateria(id: number): Promise<void> {
  await api.patch<void>(`/materias/${id}/habilitar`);
}

/** GET /docentes/{id}/materias — materias asignadas al docente. */
export async function getMateriasByDocente(
  docenteId: string,
  signal?: AbortSignal,
): Promise<Materia[]> {
  return api.get<Materia[]>(`/docentes/${encodeURIComponent(docenteId)}/materias`, { signal });
}

/** GET /cursoDivisionTurno/{id}/materias — materias del curso/división/turno. */
export async function getMateriasByCursoDivisionTurno(
  cdtId: number,
  signal?: AbortSignal,
): Promise<Materia[]> {
  return api.get<Materia[]>(`/cursoDivisionTurno/${cdtId}/materias`, { signal });
}
