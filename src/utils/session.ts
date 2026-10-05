import type { Session } from '@/types/session';

const SESSION_KEY = 'followup.session';

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function nombreCompleto(session: Session): string {
  return `${session.first_name} ${session.last_name}`.trim();
}

export function iniciales(session: Pick<Session, 'first_name' | 'last_name'>): string {
  const inicialNombre = session.first_name?.[0] ?? '';
  const inicialApellido = session.last_name?.[0] ?? '';
  return `${inicialNombre}${inicialApellido}`.toUpperCase();
}
