export type EstadoInscripcion = 'pendiente' | 'aprobado' | 'rechazado';

export const ESTADOS_INSCRIPCION: EstadoInscripcion[] = [
  'pendiente',
  'aprobado',
  'rechazado',
];

export type Inscripcion = {
  id: number;
  alumno_id: string;
  materia_id: number;
  /** Formato dd/mm/yyyy. */
  fecha_inscripcion: string;
  estado: EstadoInscripcion;
  estado_label?: string;
};

export type CreateInscripcionRequest = {
  alumno_id: string;
  materia_id: number;
  /** Opcional, formato dd/mm/yyyy. */
  fecha_inscripcion?: string | null;
};

export type CambiarEstadoInscripcionRequest = {
  estado: EstadoInscripcion;
};
