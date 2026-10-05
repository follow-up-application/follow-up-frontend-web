import { HelpCircle, Lock, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { useSession } from '@/context/useSession';
import { ApiError } from '@/services/apiClient';

type LocationState = { from?: string } | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, homeFor, session } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({ username: '', password: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to={homeFor(session.rol)} replace />;
  }

  const validarCampos = () => {
    const nuevosErrores = { username: '', password: '' };
    let valid = true;

    if (!username.trim()) {
      nuevosErrores.username = 'El usuario es requerido';
      valid = false;
    }

    if (!password) {
      nuevosErrores.password = 'La contraseña es requerida';
      valid = false;
    }

    setErrores(nuevosErrores);
    return valid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setErrorGeneral('');

    if (!validarCampos()) return;

    setLoading(true);

    try {
      const next = await login(username, password);
      const from = (location.state as LocationState)?.from;
      navigate(from ?? homeFor(next.rol), { replace: true });
    } catch (error) {
      setErrorGeneral(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error al iniciar sesión. Intenta nuevamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Sistema de seguimiento de alumnos">
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert message={errorGeneral} /> : null}

        <h2 className="text-2xl font-bold text-neutral">Bienvenido</h2>
        <p className="mt-1 mb-6 text-sm text-secondary">Ingresa tus credenciales para continuar</p>

        <FormField label="Usuario" errorMessage={errores.username}>
          <Input
            icon={User}
            placeholder="tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={loading}
            error={Boolean(errores.username)}
          />
        </FormField>

        <FormField label="Contraseña" errorMessage={errores.password}>
          <Input
            icon={Lock}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword
            autoComplete="current-password"
            disabled={loading}
            error={Boolean(errores.password)}
          />
        </FormField>

        <Button
          type="submit"
          title={loading ? 'Ingresando...' : 'Acceder'}
          loading={loading}
          fullWidth
        />

        <Link
          to="/recuperar-password"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <HelpCircle className="size-4" aria-hidden />
          ¿Olvidaste tu contraseña?
        </Link>
      </form>

      <div className="mt-6">
        <Button
          title="Soy Tutor"
          variant="outline"
          fullWidth
          onClick={() => navigate('/validar-codigo')}
        />
      </div>
    </AuthLayout>
  );
}
