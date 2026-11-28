import {
  Check,
  Edit2,
  IdCard,
  Loader2,
  Lock,
  Save,
  Shield,
  User,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { updateUsuario } from '@/services/userService';
import type { ApiUser, UpdateUserRequest } from '@/types/user';
import { formatearDni } from '@/utils/format';
import { clasesRol, etiquetaRol } from '@/utils/usuarios';

interface UserDetailEditModalProps {
  user: ApiUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: ApiUser) => void;
  onToggleInhabilitar: (user: ApiUser) => void;
}

function UserEditForm({
  user,
  onUserUpdated,
  onCancel,
}: {
  user: ApiUser;
  onUserUpdated: (u: ApiUser) => void;
  onCancel: () => void;
}) {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [username, setUsername] = useState(user.username || '');
  const [dni, setDni] = useState(user.dni ? String(user.dni) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('El nombre y el apellido son obligatorios.');
      return;
    }

    const payload: UpdateUserRequest = {};
    if (firstName.trim() !== user.firstName) payload.first_name = firstName.trim();
    if (lastName.trim() !== user.lastName) payload.last_name = lastName.trim();
    if (username.trim() && username.trim() !== user.username) payload.username = username.trim();
    if (dni.trim() && String(user.dni) !== dni.trim()) {
      if (!/^\d{7,8}$/.test(dni.trim())) {
        setError('El DNI debe tener entre 7 y 8 números.');
        return;
      }
      const parsedDni = parseInt(dni.trim(), 10);
      if (isNaN(parsedDni)) {
        setError('El DNI debe ser numérico.');
        return;
      }
      payload.dni = parsedDni;
    }

    if (Object.keys(payload).length === 0) {
      onCancel();
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUsuario(user.id, payload);
      const merged: ApiUser = {
        ...user,
        firstName: updated.firstName || firstName.trim(),
        lastName: updated.lastName || lastName.trim(),
        username: updated.username || username.trim() || user.username,
        dni: updated.dni || (dni.trim() ? parseInt(dni.trim(), 10) : user.dni),
      };
      onUserUpdated(merged);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el usuario. Verificá los campos ingresados.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleGuardar} className="space-y-4">
      {error ? <Alert message={error} /> : null}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nombre" required>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ej. Juan"
            required
          />
        </FormField>
        <FormField label="Apellido" required>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ej. Pérez"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="DNI">
          <Input
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
            placeholder="Ej. 38123456"
            maxLength={8}
          />
        </FormField>
        <FormField label="Nombre de Usuario">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej. jperez"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
        <Button
          title="Cancelar"
          variant="outline"
          type="button"
          disabled={saving}
          onClick={onCancel}
        />
        <Button
          title={saving ? 'Guardando...' : 'Guardar Cambios'}
          type="submit"
          disabled={saving}
          icon={saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        />
      </div>
    </form>
  );
}

export default function UserDetailEditModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
  onToggleInhabilitar,
}: UserDetailEditModalProps) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [exito, setExito] = useState('');

  if (!isOpen || !user) return null;

  const roleStyles = clasesRol(user.role);
  const isActivo = user.activo !== false;
  const inicialesLetras = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const handleClose = () => {
    setModoEdicion(false);
    setExito('');
    onClose();
  };

  const handleSaveSuccess = (updatedUser: ApiUser) => {
    setExito('Datos del usuario actualizados correctamente.');
    setModoEdicion(false);
    onUserUpdated(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-border/50 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-user-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="size-5" aria-hidden />
            </div>
            <div>
              <h3 id="modal-user-title" className="text-base font-bold text-neutral">
                Ficha de Usuario
              </h3>
              <p className="text-xs text-secondary">
                {modoEdicion ? 'Editar datos del usuario' : 'Detalles de la cuenta'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-surface hover:text-neutral transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {exito ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span>{exito}</span>
            </div>
          ) : null}

          {/* User Header / Avatar */}
          <div className="flex items-start gap-4">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-sm">
              {inicialesLetras}
              <span
                className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white ${
                  isActivo ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={isActivo ? 'Usuario activo' : 'Usuario inhabilitado'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-lg font-bold text-neutral truncate">
                  {user.firstName} {user.lastName}
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border}`}
                >
                  {etiquetaRol(user.role)}
                </span>
              </div>
              {user.username ? (
                <p className="text-xs font-medium text-primary mt-0.5">@{user.username}</p>
              ) : null}
              <div className="mt-1 flex items-center gap-2 text-xs text-secondary">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    isActivo
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isActivo ? 'Cuenta Activa' : 'Inhabilitado'}
                </span>
              </div>
            </div>
          </div>

          {!modoEdicion ? (
            /* Vista de Solo Lectura */
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-surface/30 p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary flex items-center gap-1.5">
                    <User className="size-3.5" />
                    Nombre completo
                  </span>
                  <span className="font-semibold text-neutral">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                  <span className="text-secondary flex items-center gap-1.5">
                    <IdCard className="size-3.5" />
                    DNI
                  </span>
                  <span className="font-semibold text-neutral">
                    {user.dni ? formatearDni(user.dni) : 'No especificado'}
                  </span>
                </div>

                {user.username ? (
                  <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                    <span className="text-secondary flex items-center gap-1.5">
                      <Lock className="size-3.5" />
                      Nombre de Usuario
                    </span>
                    <span className="font-semibold text-neutral">@{user.username}</span>
                  </div>
                ) : null}

                <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Shield className="size-3.5" />
                    ID del Sistema
                  </span>
                  <span className="font-mono text-[11px] text-secondary break-all select-all">
                    {user.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onToggleInhabilitar(user)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                    isActivo
                      ? 'border border-error/30 text-error hover:bg-error/10'
                      : 'border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isActivo ? (
                    <>
                      <UserX className="size-3.5" />
                      Inhabilitar Usuario
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-3.5" />
                      Habilitar Usuario
                    </>
                  )}
                </button>

                <Button
                  title="Editar Información"
                  variant="outline"
                  icon={<Edit2 className="size-3.5" />}
                  onClick={() => {
                    setExito('');
                    setModoEdicion(true);
                  }}
                />
              </div>
            </div>
          ) : (
            /* Vista de Formulario de Edición */
            <UserEditForm
              key={user.id}
              user={user}
              onUserUpdated={handleSaveSuccess}
              onCancel={() => setModoEdicion(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
