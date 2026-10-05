export type UserRole = 'administrador' | 'docente' | 'alumno' | 'tutor';

export type Session = {
  token: string;
  rol: UserRole;
  first_name: string;
  last_name: string;
  username: string;
};

export type LoginResponse = Session;
