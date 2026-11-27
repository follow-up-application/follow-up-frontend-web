export type Materia = {
  id: number;
  nombre: string;
  descripcion: string;
  curso_division_turno_id: number;
  turno: string;
  docente_id: string;
  activo?: boolean;
};

export type CreateMateriaRequest = {
  nombre: string;
  descripcion: string;
  curso_division_turno_id: number;
  docente_id: string;
};

export type UpdateMateriaRequest = Partial<CreateMateriaRequest>;
