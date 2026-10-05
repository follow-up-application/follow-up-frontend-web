import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { ROLE_LABELS } from '@/constants/app';
import { useSession } from '@/context/useSession';
import { NAV_BY_ROLE } from '@/config/navigation';
import type { UserRole } from '@/types/session';
import { iniciales, nombreCompleto } from '@/utils/session';

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const items = NAV_BY_ROLE[session?.rol ?? 'alumno'] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-white">
            {session ? iniciales(session) : ''}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-neutral">{session ? nombreCompleto(session) : ''}</p>
            <span className="badge mt-0.5 bg-primary-light text-primary">
              {session ? (ROLE_LABELS[session.rol] ?? session.rol) : ''}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:bg-surface hover:text-neutral'
              }`
            }
          >
            <item.icon className="size-5 shrink-0" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/50 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/8"
        >
          <LogOut className="size-5 shrink-0" aria-hidden />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export function AppShell() {
  const { session } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border/50 bg-white lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-neutral/50"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 cursor-pointer rounded-lg p-1.5 text-secondary hover:bg-surface"
              aria-label="Cerrar menú"
            >
              <X className="size-5" aria-hidden />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border/50 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-lg p-2 text-secondary hover:bg-surface"
            aria-label="Abrir menú"
          >
            <Menu className="size-5.5" aria-hidden />
          </button>
          <span className="font-bold text-primary">FollowUp</span>
          <span className="ml-auto badge bg-primary-light text-primary">
            {ROLE_LABELS[session.rol] ?? session.rol}
          </span>
        </header>

        <main id="contenido" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
    </div>
  );
}

export function RoleRoutes({ role }: { role: UserRole }) {
  return (
    <RequireAuth allow={[role]}>
      <AppShell />
    </RequireAuth>
  );
}
