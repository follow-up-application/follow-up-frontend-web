import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSession } from '@/context/useSession';
import type { UserRole } from '@/types/session';

type Props = {
  allow?: UserRole[];
  children: ReactNode;
};

export function RequireAuth({ allow, children }: Props) {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allow && !allow.includes(session.rol)) {
    return <Navigate to={session.rol === 'administrador' ? '/admin' : `/${session.rol}`} replace />;
  }

  return <>{children}</>;
}

export function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface">
      <Loader2 className="size-8 animate-spin text-primary" aria-label="Cargando" />
    </div>
  );
}
