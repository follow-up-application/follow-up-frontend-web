import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, subtitle, children, className = '' }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-white/60 px-6 py-14 text-center ${className}`}
    >
      {Icon ? (
        <span className="grid size-14 place-items-center rounded-full bg-surface text-outline">
          <Icon className="size-7" aria-hidden />
        </span>
      ) : null}
      <div>
        <p className="font-semibold text-neutral">{title}</p>
        {subtitle ? <p className="mt-1 max-w-md text-sm text-secondary">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
