import { api, ApiError } from './apiClient';
import type { AlumnoApi } from '@/types/alumno';
import type { CreateTutorRequest, RegisterTutorRequest, Tutor, UpdateTutorRequest } from '@/types/tutor';

/** GET /tutores — solo administrador. */
export async function getTutores(signal?: AbortSignal): Promise<Tutor[]> {
  return api.get<Tutor[]>('/tutores', { signal });
}

/** GET /tutores/{id} — administrador y tutor. */
export async function getTutor(id: string, signal?: AbortSignal): Promise<Tutor> {
  return api.get<Tutor>(`/tutores/${encodeURIComponent(id)}`, { signal });
}

/** POST /tutores/register — registro público con código institucional. */
export async function registerTutor(request: RegisterTutorRequest): Promise<Tutor> {
  return api.post<Tutor>('/tutores/register', request, { auth: false });
}

/** POST /tutores — alta directa de tutor por administrador. */
export async function crearTutor(request: CreateTutorRequest): Promise<Tutor> {
  return api.post<Tutor>('/tutores', request);
}

/** PUT /tutores/{id} — actualización de datos del tutor. */
export async function updateTutor(
  id: string,
  request: UpdateTutorRequest,
): Promise<Tutor> {
  return api.put<Tutor>(`/tutores/${encodeURIComponent(id)}`, request);
}

/** GET /tutores/dni/{dni} — administrador y tutor. Devuelve null si no existe (404). */
export async function buscarTutorPorDni(
  dni: string,
  signal?: AbortSignal,
): Promise<Tutor | null> {
  try {
    return await api.get<Tutor>(`/tutores/dni/${encodeURIComponent(dni)}`, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/** GET /tutores/{id}/alumnos — alumnos asociados al tutor. */
export async function getAlumnosByTutor(
  id: string,
  signal?: AbortSignal,
): Promise<AlumnoApi[]> {
  return api.get<AlumnoApi[]>(`/tutores/${encodeURIComponent(id)}/alumnos`, { signal });
}

/** PATCH /tutores/{id}/inhabilitar — solo administrador. */
export async function inhabilitarTutor(id: string): Promise<void> {
  await api.patch<void>(`/tutores/${encodeURIComponent(id)}/inhabilitar`);
}

/** PATCH /tutores/{id}/habilitar — solo administrador. */
export async function habilitarTutor(id: string): Promise<void> {
  await api.patch<void>(`/tutores/${encodeURIComponent(id)}/habilitar`);
}
