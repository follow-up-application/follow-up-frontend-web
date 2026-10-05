import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'primary' | 'success' | 'error' | 'warning';
  hint?: string;
};

const TONES = {
  primary: { box: 'bg-primary-light text-primary', value: 'text-primary' },
  success: { box: 'bg-success/10 text-success', value: 'text-success' },
  error: { box: 'bg-error/10 text-error', value: 'text-error' },
  warning: { box: 'bg-warning/10 text-warning', value: 'text-warning' },
} as const;

export function StatCard({ label, value, icon: Icon, tone = 'primary', hint }: Props) {
  const styles = TONES[tone];

  return (
    <div className="card flex items-center gap-4 p-4 sm:p-5">
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${styles.box}`}>
        <Icon className="size-5.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide text-secondary uppercase">{label}</p>
        <p className={`text-xl font-black ${styles.value}`}>{value}</p>
        {hint ? <p className="truncate text-xs text-outline">{hint}</p> : null}
      </div>
    </div>
  );
}
