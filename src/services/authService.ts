import { api, ApiError, apiRequestRaw } from '@/services/apiClient';
import type { LoginResponse } from '@/types/session';

export type AlumnoValidado = {
  id: string;
  first_name: string;
  last_name: string;
  dni: number;
  username: string;
  curso_division: string;
  fecha_nacimiento: string;
  role: string;
};

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    return await api.post<LoginResponse>(
      '/login',
      { username: username.trim(), password },
      { auth: false },
    );
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 422)) {
      throw new ApiError('Usuario o contraseña incorrectos', error.status);
    }
    throw error;
  }
}

export async function validarCodigo(codigo: string): Promise<AlumnoValidado> {
  try {
    return await api.get<AlumnoValidado>(`/tutores/validarCodigo/${encodeURIComponent(codigo.trim())}`, {
      auth: false,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError('El código institucional no es válido. Verificalo con la institución.', 404);
    }
    throw error;
  }
}

/** El backend (CreateTutorRequest) exige min:8, no 6. */
export const PASSWORD_MIN = 8;

/** Mensajes por campo para el 422 de Laravel, que viene en inglés. */
const ERRORES_VALIDACION: Record<string, string> = {
  email: 'Revisá el correo electrónico. Es posible que ya esté registrado.',
  password: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`,
  codigo_institucional: 'Revisá el código institucional.',
};

/** Primer campo que Laravel marcó como inválido en un 422. */
function campoConError(data: unknown): string | null {
  if (data === null || typeof data !== 'object') return null;

  const errores = (data as { errors?: unknown }).errors;

  if (errores === null || typeof errores !== 'object') return null;

  return Object.keys(errores)[0] ?? null;
}

export async function registerTutor(
  codigoInstitucional: string,
  email: string,
  password: string,
): Promise<void> {
  // Se usa apiRequestRaw y no api.post para conservar el body del 422 y poder
  // mostrar el campo que falló. Antes se pisaba con un texto genérico y una
  // contraseña de 6 o 7 caracteres se reportaba como "código ya utilizado".
  const { status, data } = await apiRequestRaw('/tutores/register', {
    method: 'POST',
    body: { codigo_institucional: codigoInstitucional, email: email.trim(), password },
    auth: false,
  });

  if (status >= 200 && status < 300) return;

  if (status === 404) {
    throw new ApiError('El código institucional ya no es válido. Volvé a validarlo.', 404);
  }

  if (status === 422 || status === 409) {
    const campo = campoConError(data);

    throw new ApiError(
      (campo ? ERRORES_VALIDACION[campo] : undefined) ??
        'El código ya fue utilizado, o el correo ya está registrado.',
      status,
    );
  }

  throw new ApiError('Ocurrió un error al registrarte. Intenta nuevamente.', status);
}
