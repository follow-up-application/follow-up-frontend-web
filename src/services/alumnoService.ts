import { api, ApiError } from './apiClient';
import type {
  AdminEstadisticas,
  AlumnoApi,
  CreateAlumnoRequest,
  CreateCursoRequest,
  CursoDivisionTurno,
  Tutor,
} from '@/types/alumno';

export async function getAdminEstadisticas(signal?: AbortSignal): Promise<AdminEstadisticas> {
  return api.get<AdminEstadisticas>('/admins/estadisticas', { signal });
}

export async function getAlumnos(signal?: AbortSignal): Promise<AlumnoApi[]> {
  return api.get<AlumnoApi[]>('/alumnos', { signal });
}

export async function getCursosDivisionTurno(signal?: AbortSignal): Promise<CursoDivisionTurno[]> {
  return api.get<CursoDivisionTurno[]>('/cursoDivisionTurno', { signal });
}

export async function buscarTutorPorDni(dni: string, signal?: AbortSignal): Promise<Tutor | null> {
  try {
    return await api.get<Tutor>(`/tutores/dni/${dni}`, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function crearAlumno(request: CreateAlumnoRequest): Promise<void> {
  await api.post<void>('/alumnos', {
    first_name: request.firstName,
    last_name: request.lastName,
    dni: request.dni,
    fecha_nacimiento: request.fechaNacimiento,
    curso_division_turno_id: request.cursoDivisionTurnoId,
    relationship: request.relationship,
    otra_relacion: request.otraRelacion ?? null,
    tutor_dni: request.tutorDni,
    tutor_first_name: request.tutorFirstName ?? null,
    tutor_last_name: request.tutorLastName ?? null,
    tutor_telephone: request.tutorTelephone ?? null,
  });
}

export async function crearCursoDivisionTurno(request: CreateCursoRequest): Promise<void> {
  await api.post<void>('/cursoDivisionTurno', request);
}

export async function inhabilitarAlumno(id: string | number): Promise<void> {
  await api.patch<void>(`/alumnos/${id}/inhabilitar`);
}
