import { SessionContext } from '@/context/session-context';
import { ROLE_HOME } from '@/constants/app';
import { login as loginRequest } from '@/services/authService';
import type { Session, UserRole } from '@/types/session';
import { clearSession, getSession, saveSession } from '@/utils/session';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

export const SESSION_EXPIRED_EVENT = 'followup:session-expired';

export function SessionProvider({ children }: { children: ReactNode }) {
  // localStorage es síncrono en web, la sesión se hidrata en el primer render.
  const [session, setSession] = useState<Session | null>(() => getSession());

  useEffect(() => {
    const onExpired = () => setSession(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await loginRequest(username, password);
    const next: Session = {
      token: data.token,
      rol: data.rol,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
    };
    saveSession(next);
    setSession(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const homeFor = useCallback((rol: UserRole | string) => ROLE_HOME[rol] ?? '/login', []);

  const value = useMemo(
    () => ({ session, loading: false, login, logout, homeFor }),
    [session, login, logout, homeFor],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
