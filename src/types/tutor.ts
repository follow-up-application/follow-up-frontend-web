export type Tutor = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  email: string;
};

export type RegisterTutorRequest = {
  codigo_institucional: string;
  email: string;
  password: string;
};

export type CreateTutorRequest = {
  first_name: string;
  last_name: string;
  dni: number;
  telephone: string;
  email: string;
  password?: string;
};

export type UpdateTutorRequest = {
  first_name?: string;
  last_name?: string;
  telephone?: string;
  email?: string;
};
