import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { cambiarPassword } from '@/services/userService';
import { ApiError } from '@/services/apiClient';

interface CambiarPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged?: () => void;
}

export default function CambiarPasswordModal({
  isOpen,
  onClose,
  onPasswordChanged,
}: CambiarPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('La nueva contraseña es requerida.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await cambiarPassword(password);
      setExito(true);
      onPasswordChanged?.();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al actualizar la contraseña. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmarPassword('');
    setError('');
    setExito(false);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-password-title"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-5" aria-hidden />
            </div>
            <div>
              <h3 id="modal-password-title" className="text-base font-semibold text-on-surface">
                Seguridad de la Cuenta
              </h3>
              <p className="text-xs text-on-surface-variant">
                Actualizar contraseña de acceso
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {exito ? (
          <div className="p-8 text-center space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </div>
            <h4 className="text-base font-bold text-on-surface">
              ¡Contraseña actualizada con éxito!
            </h4>
            <p className="text-xs text-on-surface-variant">
              Tu clave de acceso ha sido renovada en el servidor institucional.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="nueva-password"
                className="block text-xs font-semibold text-on-surface"
              >
                Nueva Contraseña <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant pointer-events-none" />
                <input
                  id="nueva-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5"
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {mostrarPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Recomendamos combinar letras mayúsculas, minúsculas y números.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmar-password"
                className="block text-xs font-semibold text-on-surface"
              >
                Confirmar Contraseña <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant pointer-events-none" />
                <input
                  id="confirmar-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repetí la nueva contraseña"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              {password && confirmarPassword && (
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    password === confirmarPassword
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {password === confirmarPassword ? (
                    <>
                      <Check className="size-3" /> Las contraseñas coinciden
                    </>
                  ) : (
                    'Las contraseñas no coinciden todavía'
                  )}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !password || password !== confirmarPassword}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Actualizar Contraseña
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
