import { ChevronRight, LogOut, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ProfileMetric = {
  id: string;
  label: string;
  value: string;
};

export type ProfileMenuItem = {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  onClick?: () => void;
};

type Props = {
  nombre: string;
  rol: string;
  institucion?: string;
  avatarInicial: string;
  metricas?: ProfileMetric[];
  menuItems: ProfileMenuItem[];
  onLogout?: () => void;
  headerExtra?: ReactNode;
};

export function ProfilePanel({
  nombre,
  rol,
  institucion = 'Colegio Secundario FollowUp',
  avatarInicial,
  metricas = [],
  menuItems,
  onLogout,
  headerExtra,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="card flex flex-col items-center gap-3 p-6 text-center sm:p-8">
        <span className="grid size-22 place-items-center rounded-full bg-primary text-3xl font-black text-white shadow-md">
          {avatarInicial}
        </span>
        <h1 className="text-xl font-extrabold text-neutral">{nombre}</h1>
        <p className="-mt-1 text-sm font-semibold text-secondary">{rol}</p>
        <span className="badge border border-primary-light bg-primary-light/50 text-primary">
          {institucion}
        </span>
        {headerExtra}
      </section>

      {metricas.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {metricas.map((metric) => (
            <div key={metric.id} className="card px-3 py-4 text-center">
              <p className="text-lg font-extrabold text-neutral">{metric.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-secondary">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <nav className="card divide-y divide-border/40 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className="flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3 py-3.5 text-left hover:bg-surface"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-light/60 text-primary">
              <item.icon className="size-4.5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-neutral">{item.label}</span>
              {item.sublabel ? (
                <span className="block text-xs text-outline">{item.sublabel}</span>
              ) : null}
            </span>
            <ChevronRight className="size-4.5 shrink-0 text-outline" aria-hidden />
          </button>
        ))}
      </nav>

      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="btn w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-error py-3.5 font-bold text-white shadow-sm hover:bg-error/90"
        >
          <LogOut className="size-5" aria-hidden />
          Cerrar Sesión
        </button>
      ) : null}
    </div>
  );
}
