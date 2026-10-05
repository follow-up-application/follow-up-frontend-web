import { createContext } from 'react';
import type { Session, UserRole } from '@/types/session';

export type SessionContextValue = {
  session: Session | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<Session>;
  logout: () => void;
  homeFor: (rol: UserRole | string) => string;
};

export const SessionContext = createContext<SessionContextValue | null>(null);
