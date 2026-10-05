import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

type Variant = 'error' | 'success' | 'info';

type Props = {
  variant?: Variant;
  message: string;
  className?: string;
};

const STYLES: Record<Variant, { box: string; icon: ReactNode }> = {
  error: {
    box: 'border-error/30 bg-error/8 text-error',
    icon: <AlertCircle className="size-4 shrink-0" aria-hidden />,
  },
  success: {
    box: 'border-success/30 bg-success/8 text-success',
    icon: <CheckCircle2 className="size-4 shrink-0" aria-hidden />,
  },
  info: {
    box: 'border-primary/30 bg-primary/8 text-primary',
    icon: <Info className="size-4 shrink-0" aria-hidden />,
  },
};

export function Alert({ variant = 'error', message, className = '' }: Props) {
  const style = STYLES[variant];

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${style.box} ${className}`}
    >
      {style.icon}
      <span>{message}</span>
    </div>
  );
}
