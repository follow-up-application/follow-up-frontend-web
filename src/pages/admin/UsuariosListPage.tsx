import {
  AlertTriangle,
  Edit2,
  Eye,
  LayoutGrid,
  List,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import UserDetailEditModal from '@/components/admin/UserDetailEditModal';
import { Alert, Button, EmptyState, PageHeader } from '@/components/ui';
import { PALETA_AVATARES } from '@/data/admin';
import {
  getUsuarios,
  getUsuariosInhabilitados,
  habilitarUsuario,
  inhabilitarUsuario,
} from '@/services/userService';
import type { ApiUser, UserRole } from '@/types/user';
import { formatearDni } from '@/utils/format';
import { clasesRol, etiquetaRol } from '@/utils/usuarios';

type PestañaEstado = 'activos' | 'inhabilitados';
type FiltroRol = 'todos' | UserRole;

export default function UsuariosListPage() {
  const [tab, setTab] = useState<PestañaEstado>('activos');
  const [activos, setActivos] = useState<ApiUser[]>([]);
  const [inhabilitados, setInhabilitados] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos');
  const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<ApiUser | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [usuarioConfirmarToggle, setUsuarioConfirmarToggle] = useState<ApiUser | null>(null);
  const [toggleando, setToggleando] = useState(false);

  const cargarUsuarios = useCallback(() => {
    setLoading(true);
    setError('');

    Promise.all([
      getUsuarios(),
      getUsuariosInhabilitados(),
    ])
      .then(([activosData, inhabilitadosData]) => {
        setActivos(activosData.map((u) => ({ ...u, activo: true })));
        setInhabilitados(inhabilitadosData.map((u) => ({ ...u, activo: false })));
      })
      .catch(() => {
        setError('No se pudo cargar el directorio de usuarios. Verificá tu conexión.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      getUsuarios(),
      getUsuariosInhabilitados(),
    ])
      .then(([activosData, inhabilitadosData]) => {
        setActivos(activosData.map((u) => ({ ...u, activo: true })));
        setInhabilitados(inhabilitadosData.map((u) => ({ ...u, activo: false })));
        setError('');
      })
      .catch(() => {
        setError('No se pudo cargar el directorio de usuarios. Verificá tu conexión.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const listaActual = tab === 'activos' ? activos : inhabilitados;

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    return listaActual.filter((user) => {
      const nombreCompleto = `${user.firstName} ${user.lastName}`.toLowerCase();
      const rolLabel = etiquetaRol(user.role).toLowerCase();
      const dniStr = user.dni ? String(user.dni) : '';
      const usernameStr = user.username ? user.username.toLowerCase() : '';

      const matchTexto =
        !term ||
        nombreCompleto.includes(term) ||
        rolLabel.includes(term) ||
        dniStr.includes(term) ||
        usernameStr.includes(term);

      const matchRol = filtroRol === 'todos' || user.role === filtroRol;

      return matchTexto && matchRol;
    });
  }, [listaActual, busqueda, filtroRol]);

  const handleToggleEstado = async () => {
    if (!usuarioConfirmarToggle) return;

    const user = usuarioConfirmarToggle;
    const esActivo = user.activo !== false;
    setToggleando(true);

    try {
      if (esActivo) {
        await inhabilitarUsuario(user.id);
        const inhabilitadoUser: ApiUser = { ...user, activo: false };
        setActivos((prev) => prev.filter((u) => u.id !== user.id));
        setInhabilitados((prev) => [inhabilitadoUser, ...prev]);
        if (usuarioSeleccionado?.id === user.id) {
          setUsuarioSeleccionado(inhabilitadoUser);
        }
      } else {
        await habilitarUsuario(user.id);
        const habilitadoUser: ApiUser = { ...user, activo: true };
        setInhabilitados((prev) => prev.filter((u) => u.id !== user.id));
        setActivos((prev) => [habilitadoUser, ...prev]);
        if (usuarioSeleccionado?.id === user.id) {
          setUsuarioSeleccionado(habilitadoUser);
        }
      }
      setUsuarioConfirmarToggle(null);
    } catch {
      setError(
        `No se pudo ${esActivo ? 'inhabilitar' : 'habilitar'} al usuario "${user.firstName} ${user.lastName}".`,
      );
    } finally {
      setToggleando(false);
    }
  };

  const handleUserUpdated = (updated: ApiUser) => {
    if (updated.activo !== false) {
      setActivos((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } else {
      setInhabilitados((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
    setUsuarioSeleccionado(updated);
  };

  const abrirFicha = (user: ApiUser) => {
    setUsuarioSeleccionado(user);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Directorio de Usuarios"
        subtitle={`${activos.length} usuario${activos.length === 1 ? '' : 's'} activo${activos.length === 1 ? '' : 's'} en el sistema institucional`}
        actions={
          <Button
            title="Recargar"
            variant="outline"
            onClick={cargarUsuarios}
            icon={<RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />}
          />
        }
      />

      {error ? <Alert message={error} /> : null}

      {/* Selector de Pestañas Activos / Inhabilitados */}
      <div className="flex border-b border-border/50 gap-2">
        <button
          type="button"
          onClick={() => setTab('activos')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'activos'
              ? 'border-primary text-primary'
              : 'border-transparent text-secondary hover:text-neutral'
          }`}
        >
          <UserCheck className="size-4" />
          <span>Usuarios Activos</span>
          <span className="badge bg-primary/10 text-primary text-xs">{activos.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('inhabilitados')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'inhabilitados'
              ? 'border-error text-error'
              : 'border-transparent text-secondary hover:text-neutral'
          }`}
        >
          <UserX className="size-4" />
          <span>Inhabilitados</span>
          <span className="badge bg-error/10 text-error text-xs">{inhabilitados.length}</span>
        </button>
      </div>

      {/* Barra de Filtros, Búsqueda y Vistas */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
              aria-hidden
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido, DNI, usuario..."
              aria-label="Buscar usuario"
              className="field-input pl-11"
            />
            {busqueda ? (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded p-1 text-outline hover:text-secondary"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value as FiltroRol)}
              className="field-input py-2 pr-8 text-sm"
              aria-label="Filtrar por rol"
            >
              <option value="todos">Todos los roles</option>
              <option value="administrador">Administradores</option>
              <option value="docente">Docentes</option>
              <option value="alumno">Alumnos</option>
              <option value="tutor">Tutores</option>
            </select>

            <div className="flex rounded-xl border border-border/50 bg-surface p-1">
              <button
                type="button"
                onClick={() => setVista('tabla')}
                title="Vista en tabla"
                className={`rounded-lg p-2 transition-colors cursor-pointer ${
                  vista === 'tabla'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-secondary hover:text-neutral'
                }`}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setVista('tarjetas')}
                title="Vista en tarjetas"
                className={`rounded-lg p-2 transition-colors cursor-pointer ${
                  vista === 'tarjetas'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-secondary hover:text-neutral'
                }`}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
          <Loader2 className="size-6 animate-spin text-primary mb-2" aria-hidden />
          <p className="text-sm font-semibold text-on-surface">Cargando directorio institucional...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            tab === 'activos'
              ? 'No hay usuarios activos que coincidan'
              : 'No hay usuarios inhabilitados'
          }
          subtitle={
            busqueda || filtroRol !== 'todos'
              ? 'Probá modificando los filtros de búsqueda.'
              : tab === 'activos'
                ? 'No se encontraron usuarios activos en la institución.'
                : 'No existen cuentas inhabilitadas en este momento.'
          }
        />
      ) : vista === 'tabla' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 bg-surface/50 text-xs font-semibold uppercase text-secondary">
                <tr>
                  <th className="px-5 py-3.5">Usuario</th>
                  <th className="px-5 py-3.5">Rol Institucional</th>
                  <th className="px-5 py-3.5">DNI</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtrados.map((user, index) => {
                  const roleStyles = clasesRol(user.role);
                  const inicialesLetras =
                    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
                  const colorAvatar = PALETA_AVATARES[index % PALETA_AVATARES.length];
                  const esActivo = user.activo !== false;

                  return (
                    <tr key={user.id} className="hover:bg-surface/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-xl text-white font-bold text-xs"
                            style={{ backgroundColor: colorAvatar }}
                          >
                            {inicialesLetras}
                          </span>
                          <div>
                            <p className="font-bold text-neutral">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.username ? (
                              <p className="text-xs text-primary font-medium">@{user.username}</p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border}`}
                        >
                          {etiquetaRol(user.role)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-neutral font-medium">
                        {user.dni ? formatearDni(user.dni) : '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            esActivo
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {esActivo ? 'Activo' : 'Inhabilitado'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            title="Ficha"
                            variant="outline"
                            onClick={() => abrirFicha(user)}
                            icon={<Eye className="size-3.5" />}
                          />
                          <Button
                            title={esActivo ? 'Inhabilitar' : 'Habilitar'}
                            variant={esActivo ? 'danger' : 'outline'}
                            onClick={() => setUsuarioConfirmarToggle(user)}
                            icon={
                              esActivo ? (
                                <UserX className="size-3.5" />
                              ) : (
                                <UserCheck className="size-3.5 text-emerald-600" />
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((user, index) => {
            const roleStyles = clasesRol(user.role);
            const inicialesLetras =
              `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
            const colorAvatar = PALETA_AVATARES[index % PALETA_AVATARES.length];
            const esActivo = user.activo !== false;

            return (
              <div
                key={user.id}
                className="card flex flex-col justify-between p-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-11 shrink-0 place-items-center rounded-2xl text-white font-bold"
                        style={{ backgroundColor: colorAvatar }}
                      >
                        {inicialesLetras}
                      </span>
                      <div>
                        <h3 className="font-bold text-neutral">
                          {user.firstName} {user.lastName}
                        </h3>
                        {user.username ? (
                          <p className="text-xs font-medium text-primary">@{user.username}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border}`}
                    >
                      {etiquetaRol(user.role)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        esActivo
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {esActivo ? 'Activo' : 'Inhabilitado'}
                    </span>
                  </div>

                  <div className="border-t border-border/50 pt-2 text-xs text-secondary space-y-1">
                    <div className="flex justify-between">
                      <span>DNI:</span>
                      <span className="font-semibold text-neutral">
                        {user.dni ? formatearDni(user.dni) : 'No especificado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <span className="font-mono text-[11px] text-secondary truncate max-w-[150px]">
                        {user.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-border/50 pt-3 flex items-center justify-between gap-2">
                  <Button
                    title={esActivo ? 'Inhabilitar' : 'Habilitar'}
                    variant={esActivo ? 'danger' : 'outline'}
                    onClick={() => setUsuarioConfirmarToggle(user)}
                    icon={
                      esActivo ? (
                        <UserX className="size-3.5" />
                      ) : (
                        <UserCheck className="size-3.5 text-emerald-600" />
                      )
                    }
                  />

                  <Button
                    title="Ver Ficha / Editar"
                    variant="outline"
                    onClick={() => abrirFicha(user)}
                    icon={<Edit2 className="size-3.5" />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ficha / Edición de Usuario */}
      <UserDetailEditModal
        user={usuarioSeleccionado}
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onUserUpdated={handleUserUpdated}
        onToggleInhabilitar={(u) => {
          setModalAbierto(false);
          setUsuarioConfirmarToggle(u);
        }}
      />

      {/* Modal Confirmación de Inhabilitación / Habilitación */}
      {usuarioConfirmarToggle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-border/50 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-user-toggle-title"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${
                  usuarioConfirmarToggle.activo !== false
                    ? 'bg-error/10 text-error'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {usuarioConfirmarToggle.activo !== false ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <Shield className="size-5" />
                )}
              </div>
              <h2 id="confirm-user-toggle-title" className="text-lg font-bold text-neutral">
                {usuarioConfirmarToggle.activo !== false
                  ? 'Inhabilitar Usuario'
                  : 'Habilitar Usuario'}
              </h2>
            </div>

            <p className="text-sm text-secondary">
              ¿Estás seguro de que deseas{' '}
              {usuarioConfirmarToggle.activo !== false ? 'inhabilitar' : 're-habilitar'} la cuenta de{' '}
              <strong className="text-neutral font-semibold">
                "{usuarioConfirmarToggle.firstName} {usuarioConfirmarToggle.lastName}"
              </strong>{' '}
              ({etiquetaRol(usuarioConfirmarToggle.role)})?{' '}
              {usuarioConfirmarToggle.activo !== false
                ? 'El usuario no podrá iniciar sesión en la plataforma mientras se encuentre inhabilitado.'
                : 'El usuario podrá volver a ingresar y operar normalmente con sus credenciales.'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                title="Cancelar"
                variant="outline"
                disabled={toggleando}
                onClick={() => setUsuarioConfirmarToggle(null)}
              />
              <Button
                title={
                  toggleando
                    ? 'Procesando...'
                    : usuarioConfirmarToggle.activo !== false
                      ? 'Sí, inhabilitar'
                      : 'Sí, habilitar'
                }
                variant={usuarioConfirmarToggle.activo !== false ? 'danger' : 'primary'}
                disabled={toggleando}
                onClick={handleToggleEstado}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
