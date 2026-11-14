import { api } from './apiClient';

export interface DocenteApi {
  id: string | number;
  first_name: string;
  last_name: string;
  dni: string | number;
  telephone?: string;
  username: string;
  fecha_ingreso?: string;
}

export interface CreateDocentePayload {
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  fecha_ingreso: string;
  curso_division_turno_id: number;
}

export async function getDocentes(signal?: AbortSignal): Promise<DocenteApi[]> {
  return api.get<DocenteApi[]>('/docentes', { signal });
}

export async function crearDocente(payload: CreateDocentePayload): Promise<DocenteApi> {
  return api.post<DocenteApi>('/docentes', payload);
}

export async function inhabilitarDocente(id: string | number): Promise<void> {
  await api.patch<void>(`/docentes/${id}/inhabilitar`);
}
