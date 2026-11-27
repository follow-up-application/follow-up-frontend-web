import { ArrowLeft, AtSign, Clock, Lock, ShieldCheck, User, UserPlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { ApiError } from '@/services/apiClient';

export default function RegistroAdminPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrado, setRegistrado] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('Ingresa nombre y apellido válidos (mínimo 2 caracteres).');
      return;
    }

    if (username.trim().length < 4) {
      setError('El nombre de usuario debe tener al menos 4 caracteres.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await adminService.registerAdmin({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
        password,
      });

      setRegistrado(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo completar el registro. Verifica que el usuario no esté en uso.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (registrado) {
    return (
      <AuthLayout subtitle="Alta institucional de Administrador">
        <div className="card p-6 sm:p-8 text-center space-y-4">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="size-6" aria-hidden />
          </span>
          <h2 className="text-xl font-bold text-neutral">Solicitud de Registro Enviada</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Tu cuenta institucional fue registrada con el usuario <strong>@{username}</strong>.
          </p>
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left">
            Por seguridad institucional, la cuenta se encuentra <strong>pendiente de aprobación</strong>. Un administrador activo del establecimiento deberá habilitarla desde el panel antes de que puedas iniciar sesión.
          </div>
          <Link to="/login" className="block pt-2">
            <Button title="Volver al inicio de sesión" fullWidth />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="Alta institucional de Administrador">
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {error ? <Alert variant="error" message={error} /> : null}

        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-bold text-neutral">Registro de Administrador</h2>
            <p className="text-xs text-secondary">Crea una cuenta administrativa institucional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nombre" required>
            <Input
              icon={User}
              placeholder="Ej. Carlos"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required
            />
          </FormField>

          <FormField label="Apellido" required>
            <Input
              icon={User}
              placeholder="Ej. Rodríguez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required
            />
          </FormField>
        </div>

        <FormField label="Usuario" required hint="Sin espacios (mínimo 4 caracteres)">
          <Input
            icon={AtSign}
            placeholder="Ej. carlos.admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </FormField>

        <FormField label="Contraseña" required hint="Mínimo 8 caracteres">
          <Input
            icon={Lock}
            isPassword
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </FormField>

        <FormField label="Confirmar Contraseña" required>
          <Input
            icon={Lock}
            isPassword
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </FormField>

        <Button
          type="submit"
          title={loading ? 'Registrando...' : 'Crear Cuenta de Administrador'}
          loading={loading}
          icon={<UserPlus className="size-4" aria-hidden />}
          fullWidth
        />

        <Link
          to="/login"
          className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver al inicio de sesión
        </Link>
      </form>
    </AuthLayout>
  );
}
