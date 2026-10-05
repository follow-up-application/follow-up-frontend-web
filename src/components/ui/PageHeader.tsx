import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function PageHeader({ title, subtitle, actions, icon: Icon, className = '' }: Props) {
  return (
    <header className={`mb-6 flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
            <Icon className="size-5.5" aria-hidden />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold text-neutral">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-secondary">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
