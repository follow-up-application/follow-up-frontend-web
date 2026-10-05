import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: LucideIcon;
  isPassword?: boolean;
  error?: boolean;
};

export function Input({ icon: Icon, isPassword = false, error = false, className = '', ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {Icon ? (
        <Icon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
          aria-hidden
        />
      ) : null}

      <input
        {...rest}
        type={isPassword ? (visible ? 'text' : 'password') : (rest.type ?? 'text')}
        aria-invalid={error || undefined}
        className={`field-input ${Icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${
          error ? 'border-error focus:border-error focus:ring-error/20' : ''
        } ${className}`}
      />

      {isPassword ? (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded p-1 text-outline hover:text-secondary"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
