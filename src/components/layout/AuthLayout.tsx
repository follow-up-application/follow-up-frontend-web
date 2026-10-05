import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  wide?: boolean;
};

export function AuthLayout({ children, subtitle, showBack, onBack, wide }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className={wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}>
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-primary text-2xl font-black text-white">
              F
            </div>
            <h1 className="text-3xl font-black tracking-tight text-primary">FollowUp</h1>
            {subtitle ? <p className="mt-1 text-sm text-secondary">{subtitle}</p> : null}
          </div>

          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 cursor-pointer text-sm font-semibold text-secondary hover:text-primary"
            >
              ← Volver
            </button>
          ) : null}

          {children}
        </div>
      </div>
    </div>
  );
}
