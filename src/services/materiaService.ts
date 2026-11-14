import { api } from './apiClient';

export interface CreateMateriaPayload {
  nombre: string;
  descripcion: string;
  curso_division_turno_id: number;
  docente_id: string;
}

export async function crearMateria(payload: CreateMateriaPayload): Promise<void> {
  await api.post<void>('/materias', payload);
}
