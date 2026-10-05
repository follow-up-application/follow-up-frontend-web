import { CheckCircle2, Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { useSession } from '@/context/useSession';
import { ApiError } from '@/services/apiClient';
import { registerTutor, PASSWORD_MIN } from '@/services/authService';
import { formatearDni } from '@/utils/format';
import { esEmailValido } from '@/utils/validations';

type RegisterState = {
  codigoInstitucional: string;
  alumnoNombre: string;
  alumnoDni: string;
  alumnoCursoDivision: string;
  alumnoFechaNacimiento: string;
} | null;

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, homeFor } = useSession();

  const state = location.state as RegisterState;
  const codigoInstitucional = state?.codigoInstitucional ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState({ email: '', password: '', confirmarPassword: '' });

  if (!codigoInstitucional) {
    return <Navigate to="/validar-codigo" replace />;
  }

  const validarCampos = () => {
    const nuevosErrores = { email: '', password: '', confirmarPassword: '' };
    let valid = true;

    if (!email.trim()) {
      nuevosErrores.email = 'El correo electrónico es requerido';
      valid = false;
    } else if (!esEmailValido(email)) {
      nuevosErrores.email = 'El formato del correo es inválido';
      valid = false;
    }

    if (!password) {
      nuevosErrores.password = 'La contraseña es requerida';
      valid = false;
    } else if (password.length < PASSWORD_MIN) {
      nuevosErrores.password = `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`;
      valid = false;
    }

    if (password && confirmarPassword !== password) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrores(nuevosErrores);
    return valid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    if (!validarCampos()) return;

    setLoading(true);

    try {
      await registerTutor(codigoInstitucional, email, password);

      try {
        const next = await login(email, password);
        navigate(homeFor(next.rol), { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      setErrorGeneral(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error al registrarte. Intenta nuevamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showBack onBack={() => navigate(-1)}>
      <p className="mb-6 text-center text-sm text-secondary">
        Creá tus credenciales para acceder como tutor en FollowUp
      </p>

      {state?.alumnoNombre ? (
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" aria-hidden />
            <span className="text-xs font-bold text-primary">Vas a registrarte como tutor de:</span>
          </div>
          <p className="text-lg font-bold text-neutral">{state.alumnoNombre}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary">
            {state.alumnoDni ? <span>DNI: {formatearDni(state.alumnoDni)}</span> : null}
            {state.alumnoCursoDivision ? <span>{state.alumnoCursoDivision}</span> : null}
          </div>
          {state.alumnoFechaNacimiento ? (
            <p className="mt-1 text-sm text-secondary">Nacimiento: {state.alumnoFechaNacimiento}</p>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert message={errorGeneral} /> : null}

        <h2 className="mb-6 text-2xl font-bold text-neutral">Crear Cuenta</h2>

        <FormField label="Correo Electrónico" errorMessage={errores.email}>
          <Input
            icon={Mail}
            type="email"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
            error={Boolean(errores.email)}
          />
        </FormField>

        <FormField label="Contraseña" errorMessage={errores.password}>
          <Input
            icon={Lock}
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword
            autoComplete="new-password"
            disabled={loading}
            error={Boolean(errores.password)}
          />
        </FormField>

        <FormField label="Confirmar contraseña" errorMessage={errores.confirmarPassword}>
          <Input
            icon={Lock}
            placeholder="*********"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            isPassword
            autoComplete="new-password"
            disabled={loading}
            error={Boolean(errores.confirmarPassword)}
          />
        </FormField>

        <Button
          type="submit"
          title={loading ? 'Registrando...' : 'Registrarse'}
          loading={loading}
          fullWidth
          className="mt-2"
        />
      </form>

      <p className="mt-6 text-center text-sm font-semibold text-secondary">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
