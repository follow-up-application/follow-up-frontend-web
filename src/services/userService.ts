import { api } from './apiClient';
import type { ApiUser, ChangePasswordRequest, MeUser, UpdateUserRequest } from '@/types/user';

/** GET /users — solo administrador. Listado de usuarios activos. */
export async function getUsuarios(signal?: AbortSignal): Promise<ApiUser[]> {
  return api.get<ApiUser[]>('/users', { signal });
}

/** GET /users/inhabilitados — solo administrador. Listado de usuarios inhabilitados. */
export async function getUsuariosInhabilitados(signal?: AbortSignal): Promise<ApiUser[]> {
  return api.get<ApiUser[]>('/users/inhabilitados', { signal });
}

/** GET /users/{id} — solo administrador. Detalle por ID. */
export async function getUsuario(id: string, signal?: AbortSignal): Promise<ApiUser> {
  return api.get<ApiUser>(`/users/${encodeURIComponent(id)}`, { signal });
}

/** PUT /users/{id} — solo administrador. Actualización parcial. */
export async function updateUsuario(
  id: string,
  request: UpdateUserRequest,
): Promise<ApiUser> {
  return api.put<ApiUser>(`/users/${encodeURIComponent(id)}`, request);
}

/** PATCH /users/{id}/inhabilitar — solo administrador. Baja lógica (204). */
export async function inhabilitarUsuario(id: string): Promise<void> {
  await api.patch<void>(`/users/${encodeURIComponent(id)}/inhabilitar`);
}

/** PATCH /users/{id}/habilitar — solo administrador. Restaura el usuario (204). */
export async function habilitarUsuario(id: string): Promise<void> {
  await api.patch<void>(`/users/${encodeURIComponent(id)}/habilitar`);
}

/** GET /users/me — usuario autenticado (todos los roles). */
export async function getMe(signal?: AbortSignal): Promise<MeUser> {
  return api.get<MeUser>('/users/me', { signal });
}

/** PUT /password — usuario autenticado. Cambio de contraseña. */
export async function cambiarPassword(password: string): Promise<{ message: string }> {
  return api.put<{ message: string }>('/password', { password } as ChangePasswordRequest);
}
