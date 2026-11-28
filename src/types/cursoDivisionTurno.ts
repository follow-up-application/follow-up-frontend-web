export type CursoDivisionTurno = {
  id: number;
  curso: number | string;
  division: string;
  turno: string;
  capacidad_maxima: number;
};

export type CreateCursoDivisionTurnoRequest = {
  curso: number | string;
  division: string;
  turno: string;
  capacidad_maxima?: number;
};

export type UpdateCursoDivisionTurnoRequest = Partial<CreateCursoDivisionTurnoRequest>;
