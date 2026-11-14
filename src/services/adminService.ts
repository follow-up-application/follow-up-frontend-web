import { api } from './apiClient';

export interface Admin {
  id: string | number;
  first_name: string;
  last_name: string;
  username: string;
  email?: string;
  role: 'administrador';
  activo: boolean;
  created_at?: string;
  ultimo_acceso?: string;
}

type AdminApiResponse = {
  id: string | number;
  first_name: string;
  last_name: string;
  username: string;
  role: 'administrador';
  email?: string;
  activo?: boolean;
  created_at?: string;
};

export interface CreateAdminPayload {
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  email?: string;
}

export interface UpdateAdminPayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  email?: string;
  activo?: boolean;
}

function normalizarAdmin(raw: AdminApiResponse): Admin {
  return {
    ...raw,
    activo: raw.activo ?? true,
  };
}

export const adminService = {
  async registerAdmin(payload: CreateAdminPayload): Promise<Admin> {
    const response = await api.post<AdminApiResponse>('/admins/register', payload, { auth: false });
    return normalizarAdmin(response);
  },

  async getAdmins(): Promise<Admin[]> {
    const response = await api.get<AdminApiResponse[]>('/admins');
    return response.map(normalizarAdmin);
  },

  async getAdminById(id: string | number): Promise<Admin | null> {
    const response = await api.get<AdminApiResponse>(`/admins/${id}`);
    return response ? normalizarAdmin(response) : null;
  },

  async createAdmin(payload: CreateAdminPayload): Promise<Admin> {
    const response = await api.post<AdminApiResponse>('/admins', payload);
    return normalizarAdmin(response);
  },

  async updateAdmin(id: string | number, payload: UpdateAdminPayload): Promise<Admin> {
    const response = await api.put<AdminApiResponse>(`/admins/${id}`, payload);
    return normalizarAdmin(response);
  },

  async toggleInhabilitarAdmin(id: string | number): Promise<{ id: string | number; activo: boolean }> {
    await api.patch<void>(`/admins/${id}/inhabilitar`);
    return {
      id,
      activo: false,
    };
  },
};
