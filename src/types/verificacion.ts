import type { UserRole } from '@/types/session';

/**
 * Formas de los resources de la API, replicadas para el runner de verificación.
 * Se declaran acá y no en los types de cada página porque esas páginas todavía
 * usan el contrato camelCase que el backend no acepta.
 */

export type AlumnoResource = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  username: string;
  curso_division: string;
  fecha_nacimiento: string;
  role: UserRole;
};

export type CDTResource = {
  id: number;
  curso: number;
  division: string;
  turno: string;
  capacidad_maxima: number;
};

export type DocenteResource = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  username: string;
  fecha_ingreso: string;
};

export type MateriaResource = {
  id: number;
  nombre: string;
  descripcion: string;
  curso_division_turno_id: number;
  turno: string;
  docente_id: string;
};

export type EstadoInscripcion = 'pendiente' | 'aprobado' | 'rechazado';

export type InscripcionResource = {
  id: number;
  alumno_id: string;
  materia_id: number;
  fecha_inscripcion: string;
  estado: EstadoInscripcion;
  estado_label: string;
};

export type TutorResource = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  email: string;
};

export type AdminResource = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
};

export type AdminStatisticsResource = {
  total_alumnos: number;
  total_tutores: number;
};

/**
 * Fallback para cuando el listado de docentes viene sin username. El backend lo
 * arma como {PREFIJO}-{DNI}-{AÑO}; sólo se usa si el campo no viene.
 */
export function docenteUsername(docente: Pick<DocenteResource, 'dni' | 'fecha_ingreso'>): string {
  const anio = docente.fecha_ingreso.split('/')[2] ?? '';

  return `DOC-${docente.dni}-${anio}`;
}