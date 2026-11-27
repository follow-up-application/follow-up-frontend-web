import {
  ArrowLeft,
  AtSign,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { ApiError } from '@/services/apiClient';
import { iniciales } from '@/utils/session';

export default function NuevoAdminPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const editId = searchParams.get('id');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit && Boolean(editId));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit || !editId) return;

    adminService
      .getAdminById(editId)
      .then((admin) => {
        if (!admin) {
          setError('No se encontró el administrador solicitado.');
          return;
        }
        setFirstName(admin.first_name);
        setLastName(admin.last_name);
        setUsername(admin.username);
        setEmail(admin.email ?? '');
      })
      .catch(() => {
        setError('Error al cargar los datos del administrador.');
      })
      .finally(() => setLoadingInitial(false));
  }, [isEdit, editId]);

  const validaciones = useMemo(() => {
    const nombreValido = firstName.trim().length >= 2 && lastName.trim().length >= 2;
    const usuarioValido = /^[a-zA-Z0-9._-]{4,30}$/.test(username.trim());
    const passwordRequerida = !isEdit || password.length > 0;
    const passwordValida = !passwordRequerida || password.length >= 8;
    const confirmacionValida = !passwordRequerida || (password.length >= 8 && password === confirmPassword);

    return {
      nombreValido,
      usuarioValido,
      passwordValida,
      confirmacionValida,
      formularioListo: nombreValido && usuarioValido && passwordValida && confirmacionValida,
    };
  }, [firstName, lastName, username, password, confirmPassword, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validaciones.formularioListo) {
      setError('Por favor completa todos los requisitos del checklist antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && editId) {
        await adminService.updateAdmin(editId, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim(),
          email: email.trim() || undefined,
          ...(password ? { password } : {}),
        });
        setSuccess('Administrador actualizado correctamente en la base de datos.');
      } else {
        await adminService.createAdmin({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim(),
          email: email.trim() || undefined,
          password,
        });
        setSuccess('Administrador creado exitosamente en la base de datos.');
      }

      setTimeout(() => {
        navigate('/admin/administradores');
      }, 900);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el administrador. Verifica que el usuario no esté repetido.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
        <Loader2 className="size-6 animate-spin text-primary mb-2" aria-hidden />
        <p className="text-sm font-semibold text-on-surface">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title={isEdit ? 'Editar Administrador' : 'Nuevo Administrador'}
        subtitle={
          isEdit
            ? 'Actualiza los datos de acceso y perfil institucional del administrador'
            : 'Registra un nuevo usuario con permisos administrativos en la institución'
        }
        actions={
          <Link to="/admin/administradores">
            <Button
              variant="outline"
              title="Volver al listado"
              icon={<ArrowLeft className="size-4" aria-hidden />}
            />
          </Link>
        }
      />

      {error ? <Alert variant="error" message={error} /> : null}
      {success ? <Alert variant="success" message={success} /> : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-2xl border border-outline-variant/60 p-6 shadow-2xs space-y-5"
        >
          <div className="border-b border-outline-variant/50 pb-3">
            <h2 className="text-base font-bold text-on-surface">Datos Personales y de Cuenta</h2>
            <p className="text-xs text-on-surface-variant">
              Los campos marcados con * son obligatorios para el alta en el sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre" required>
              <Input
                icon={User}
                placeholder="Ej. Mariana"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Apellido" required>
              <Input
                icon={User}
                placeholder="Ej. Gómez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Nombre de usuario"
              required
              hint="Letras, números, puntos o guiones (mín. 4 caracteres)"
            >
              <Input
                icon={AtSign}
                placeholder="Ej. mgomez.admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Correo institucional" hint="Opcional — para notificaciones">
              <Input
                type="email"
                icon={Mail}
                placeholder="Ej. mgomez@followup.edu.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
          </div>

          <div className="border-t border-outline-variant/50 pt-4">
            <h3 className="text-sm font-semibold text-on-surface mb-1">
              {isEdit ? 'Cambiar Contraseña (Opcional)' : 'Seguridad de Acceso'}
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              {isEdit
                ? 'Deja estos campos vacíos si deseas mantener la contraseña actual.'
                : 'La contraseña debe tener al menos 8 caracteres.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Contraseña" required={!isEdit}>
                <Input
                  icon={Lock}
                  isPassword
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEdit}
                />
              </FormField>

              <FormField label="Confirmar contraseña" required={!isEdit || password.length > 0}>
                <Input
                  icon={Lock}
                  isPassword
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isEdit || password.length > 0}
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/50 pt-4">
            <Link to="/admin/administradores">
              <Button variant="outline" title="Cancelar" />
            </Link>
            <Button
              type="submit"
              loading={loading}
              disabled={!validaciones.formularioListo}
              title={isEdit ? 'Guardar Cambios' : 'Registrar Administrador'}
              icon={
                isEdit ? (
                  <Save className="size-4" aria-hidden />
                ) : (
                  <UserPlus className="size-4" aria-hidden />
                )
              }
            />
          </div>
        </form>

        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white border border-outline-variant/60 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Vista Previa de Credencial
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Activo
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-on-primary shadow-sm">
                {iniciales({
                  first_name: firstName || 'N',
                  last_name: lastName || 'A',
                })}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-on-surface truncate">
                  {firstName || lastName
                    ? `${firstName} ${lastName}`.trim()
                    : 'Nombre del Administrador'}
                </p>
                <p className="text-xs font-medium text-primary truncate">
                  @{username || 'usuario.admin'}
                </p>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">
                  {email || (username ? `${username}@followup.edu.ar` : 'correo@followup.edu.ar')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
              <span>Rol: Administrador Institucional</span>
              <span>Acceso Total</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-outline-variant/60 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-on-surface">Requisitos de Validación</h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2.5">
                {validaciones.nombreValido ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4 text-outline shrink-0" />
                )}
                <span className={validaciones.nombreValido ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
                  Nombre y apellido completos (mín. 2 letras c/u)
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                {validaciones.usuarioValido ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4 text-outline shrink-0" />
                )}
                <span className={validaciones.usuarioValido ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
                  Nombre de usuario válido (4 a 30 caracteres sin espacios)
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                {validaciones.passwordValida ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4 text-outline shrink-0" />
                )}
                <span className={validaciones.passwordValida ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
                  {isEdit && !password
                    ? 'Contraseña actual conservada'
                    : 'Contraseña segura (mínimo 8 caracteres)'}
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                {validaciones.confirmacionValida ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="size-4 text-outline shrink-0" />
                )}
                <span className={validaciones.confirmacionValida ? 'text-on-surface font-medium' : 'text-on-surface-variant'}>
                  {isEdit && !password
                    ? 'Sin cambio de contraseña pendiente'
                    : 'Ambas contraseñas coinciden'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
