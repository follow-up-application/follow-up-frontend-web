import type { UserRole } from './session';

export type { UserRole };

export type ApiUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  username?: string;
  dni?: number | string | null;
  email?: string | null;
  activo?: boolean;
};

export type MeUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  username?: string;
  dni?: number | string | null;
  email?: string | null;
};

export type UpdateUserRequest = {
  first_name?: string;
  last_name?: string;
  dni?: number;
  username?: string;
};

export type ChangePasswordRequest = {
  password: string;
};
