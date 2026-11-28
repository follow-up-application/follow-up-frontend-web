import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Lock,
  School,
  User,
  Users,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button, FormField, Input } from '@/components/ui';
import { useSession } from '@/context/useSession';
import { ApiError } from '@/services/apiClient';
import { registrarUsuario } from '@/services/userService';
import type { UserRole } from '@/types/user';

export default function RegistroUsuarioPage() {
  const navigate = useNavigate();
  const { login, homeFor } = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('alumno');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validarCampos = () => {
    const errs: Record<string, string> = {};
    let valid = true;

    if (!firstName.trim()) {
      errs.firstName = 'El nombre es obligatorio.';
      valid = false;
    }

    if (!lastName.trim()) {
      errs.lastName = 'El apellido es obligatorio.';
      valid = false;
    }

    if (dni.trim() && !/^\d{7,8}$/.test(dni.trim())) {
      errs.dni = 'El DNI debe contener entre 7 y 8 números.';
      valid = false;
    }

    if (!username.trim() && !dni.trim()) {
      errs.username = 'Ingresá un nombre de usuario o un DNI para tu cuenta.';
      valid = false;
    }

    if (!password) {
      errs.password = 'La contraseña es obligatoria.';
      valid = false;
    } else if (password.length < 8) {
      errs.password = 'La contraseña debe tener al menos 8 caracteres.';
      valid = false;
    }

    if (password && confirmarPassword !== password) {
      errs.confirmarPassword = 'Las contraseñas no coinciden.';
      valid = false;
    }

    setErrores(errs);
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorGeneral('');

    if (!validarCampos()) return;

    setLoading(true);

    const cleanUsername = username.trim() || `usr_${dni.trim()}`;

    try {
      await registrarUsuario({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        dni: dni.trim() ? Number(dni.trim()) : undefined,
        username: cleanUsername,
        password,
        role,
      });

      // Inicio de sesión automático tras el alta
      try {
        const next = await login(cleanUsername, password);
        navigate(homeFor(next.rol), { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorGeneral(err.message);
      } else {
        setErrorGeneral('Ocurrió un error al registrar la cuenta. Verificá los datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showBack onBack={() => navigate('/login')}>
      <div className="mb-6 text-center space-y-1">
        <h2 className="text-xl font-bold text-neutral">Crear Cuenta Institucional</h2>
        <p className="text-xs text-secondary">
          Registrate para acceder a la plataforma FollowUp
        </p>
      </div>

      {errorGeneral && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{errorGeneral}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Rol */}
        <div>
          <label className="block text-xs font-semibold text-neutral mb-1.5">
            Tipo de Usuario <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('alumno')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                role === 'alumno'
                  ? 'bg-primary/10 border-primary text-primary shadow-2xs'
                  : 'bg-white border-outline-variant text-secondary hover:bg-surface'
              }`}
            >
              <GraduationCap className="size-4" />
              Alumno
            </button>

            <button
              type="button"
              onClick={() => setRole('docente')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                role === 'docente'
                  ? 'bg-primary/10 border-primary text-primary shadow-2xs'
                  : 'bg-white border-outline-variant text-secondary hover:bg-surface'
              }`}
            >
              <School className="size-4" />
              Docente
            </button>

            <button
              type="button"
              onClick={() => setRole('tutor')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                role === 'tutor'
                  ? 'bg-primary/10 border-primary text-primary shadow-2xs'
                  : 'bg-white border-outline-variant text-secondary hover:bg-surface'
              }`}
            >
              <Users className="size-4" />
              Tutor
            </button>
          </div>
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nombre" required errorMessage={errores.firstName}>
            <Input
              icon={User}
              placeholder="Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              error={Boolean(errores.firstName)}
            />
          </FormField>

          <FormField label="Apellido" required errorMessage={errores.lastName}>
            <Input
              icon={User}
              placeholder="Pérez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              error={Boolean(errores.lastName)}
            />
          </FormField>
        </div>

        {/* DNI y Usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="DNI" errorMessage={errores.dni}>
            <Input
              icon={IdCard}
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              disabled={loading}
              error={Boolean(errores.dni)}
            />
          </FormField>

          <FormField label="Nombre de Usuario" required errorMessage={errores.username}>
            <Input
              icon={User}
              placeholder="juan.perez"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
              disabled={loading}
              error={Boolean(errores.username)}
            />
          </FormField>
        </div>

        {/* Contraseña */}
        <FormField label="Contraseña (mínimo 8 caracteres)" required errorMessage={errores.password}>
          <div className="relative">
            <Input
              icon={Lock}
              type={mostrarPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={Boolean(errores.password)}
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
        </FormField>

        {/* Confirmar Contraseña */}
        <FormField label="Confirmar Contraseña" required errorMessage={errores.confirmarPassword}>
          <Input
            icon={Lock}
            type={mostrarPassword ? 'text' : 'password'}
            placeholder="********"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            disabled={loading}
            error={Boolean(errores.confirmarPassword)}
          />
        </FormField>

        {password && confirmarPassword && (
          <p
            className={`text-[11px] font-medium flex items-center gap-1 ${
              password === confirmarPassword ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {password === confirmarPassword ? (
              <>
                <Check className="size-3" /> Las contraseñas coinciden
              </>
            ) : (
              'Las contraseñas no coinciden'
            )}
          </p>
        )}

        <Button
          type="submit"
          title={loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          loading={loading}
          fullWidth
        />
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
        >
          ¿Ya tenés una cuenta? <span className="text-primary underline">Iniciar Sesión</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
