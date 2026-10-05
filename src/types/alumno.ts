export type CursoDivisionTurno = {
  id: number;
  curso: number;
  division: string;
  turno: string;
  capacidad_maxima: number;
};

export type Tutor = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  email: string;
};

export type TutorAlumnoRelation = 'padre' | 'madre' | 'otra';

export type CreateAlumnoRequest = {
  firstName: string;
  lastName: string;
  dni: number;
  fechaNacimiento: string;
  cursoDivisionTurnoId: number;
  relationship: TutorAlumnoRelation;
  otraRelacion?: string | null;
  tutorFirstName?: string | null;
  tutorLastName?: string | null;
  tutorDni: number;
  tutorTelephone?: string | null;
};

export type AlumnoApi = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  username: string;
  curso_division: string;
  fecha_nacimiento: string;
  role: string;
};

export type AdminEstadisticas = {
  total_alumnos: number;
  total_tutores: number;
};

export type CreateCursoRequest = {
  curso: number;
  division: string;
  turno: string;
  capacidad_maxima: number;
};
