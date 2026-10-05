import type { ReactNode } from 'react';

type Props = {
  label: string;
  errorMessage?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
};

export function FormField({ label, errorMessage, required, children, hint }: Props) {
  return (
    <div className="mb-4">
      <label className="field-label">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {children}
      {errorMessage ? <p className="field-error">{errorMessage}</p> : null}
      {!errorMessage && hint ? <p className="mt-1.5 text-xs text-outline">{hint}</p> : null}
    </div>
  );
}
