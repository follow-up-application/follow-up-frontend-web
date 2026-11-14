import {
    Edit2,
    Eye,
    LayoutGrid,
    List,
    Loader2,
    Mail,
    Search,
    ShieldCheck,
    UserCheck,
    UserPlus,
    UserX,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminDetailModal from '@/components/admin/AdminDetailModal';
import { Alert, Button, EmptyState, PageHeader } from '@/components/ui';
import { adminService, type Admin } from '@/services/adminService';
import { iniciales } from '@/utils/session';

export default function AdminsListPage() {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');
    const [vista, setVista] = useState<'tabla' | 'tarjetas'>('tabla');

    const [adminSeleccionado, setAdminSeleccionado] = useState<Admin | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        adminService
            .getAdmins()
            .then((data) => {
                setAdmins(data);
                setError('');
            })
            .catch(() => {
                setError('No se pudo cargar el listado de administradores.');
            })
            .finally(() => setLoading(false));
    }, []);

    const filtrados = useMemo(() => {
        const term = busqueda.trim().toLowerCase();
        return admins.filter((admin) => {
            const matchTexto =
                !term ||
                `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(term) ||
                admin.username.toLowerCase().includes(term) ||
                (admin.email && admin.email.toLowerCase().includes(term));

            const matchEstado =
                filtroEstado === 'todos' ||
                (filtroEstado === 'activos' && admin.activo) ||
                (filtroEstado === 'inactivos' && !admin.activo);

            return matchTexto && matchEstado;
        });
    }, [admins, busqueda, filtroEstado]);

    const totalActivos = useMemo(() => admins.filter((a) => a.activo).length, [admins]);
    const totalInactivos = admins.length - totalActivos;

    const abrirDetalle = async (admin: Admin) => {
        setAdminSeleccionado(admin);
        setModalAbierto(true);
        try {
            const detalle = await adminService.getAdminById(admin.id);
            if (detalle) {
                setAdminSeleccionado({
                    ...detalle,
                    activo: detalle.activo ?? admin.activo,
                });
            }
        } catch {}
    };

    const handleToggleInhabilitar = async (admin: Admin) => {
        try {
            await adminService.toggleInhabilitarAdmin(admin.id);
            const updated: Admin = { ...admin, activo: !admin.activo };
            setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)));
            if (adminSeleccionado && adminSeleccionado.id === admin.id) {
                setAdminSeleccionado(updated);
            }
        } catch {
            setError('Ocurrió un error al cambiar el estado del administrador.');
        }
    };

    const irAEditar = (admin: Admin) => {
        setModalAbierto(false);
        navigate(`/admin/administradores/nuevo?edit=true&id=${admin.id}`);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Administradores"
                subtitle={`${admins.length} administrador${admins.length === 1 ? '' : 'es'} registrado${admins.length === 1 ? '' : 's'} en el sistema`}
                actions={
                    <Link to="/admin/administradores/nuevo">
                        <Button
                            title="Nuevo Administrador"
                            icon={<UserPlus className="size-4" aria-hidden />}
                        />
                    </Link>
                }
            />

            {error && <Alert variant="error" message={error} />}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="size-5.5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-on-surface-variant">Total Administradores</p>
                        <p className="text-xl font-bold text-on-surface">{admins.length}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <UserCheck className="size-5.5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-on-surface-variant">Cuentas Activas</p>
                        <p className="text-xl font-bold text-emerald-700">{totalActivos}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-outline-variant/60 shadow-2xs">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <UserX className="size-5.5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-on-surface-variant">Inhabilitados</p>
                        <p className="text-xl font-bold text-slate-700">{totalInactivos}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-outline" />
                    <input
                        type="search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, @usuario o email..."
                        className="w-full bg-surface-container-lowest text-on-surface rounded-xl pl-10 pr-9 py-2 text-sm border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    {busqueda && (
                        <button
                            type="button"
                            onClick={() => setBusqueda('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-outline hover:text-on-surface"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-xl bg-surface-container-low p-1 border border-outline-variant/40 text-xs">
                        <button
                            type="button"
                            onClick={() => setFiltroEstado('todos')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filtroEstado === 'todos'
                                ? 'bg-white text-on-surface shadow-2xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltroEstado('activos')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filtroEstado === 'activos'
                                ? 'bg-white text-emerald-700 shadow-2xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            Activos
                        </button>
                        <button
                            type="button"
                            onClick={() => setFiltroEstado('inactivos')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filtroEstado === 'inactivos'
                                ? 'bg-white text-slate-700 shadow-2xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            Inactivos
                        </button>
                    </div>

                    <div className="flex items-center rounded-xl bg-surface-container-low p-1 border border-outline-variant/40">
                        <button
                            type="button"
                            onClick={() => setVista('tabla')}
                            className={`p-1.5 rounded-lg transition-all ${vista === 'tabla'
                                ? 'bg-white text-primary shadow-2xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            title="Vista de Tabla"
                            aria-label="Cambiar a vista de tabla"
                        >
                            <List className="size-4.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setVista('tarjetas')}
                            className={`p-1.5 rounded-lg transition-all ${vista === 'tarjetas'
                                ? 'bg-white text-primary shadow-2xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            title="Vista de Tarjetas"
                            aria-label="Cambiar a vista de tarjetas"
                        >
                            <LayoutGrid className="size-4.5" />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
                    <Loader2 className="size-6 animate-spin text-primary mb-2" aria-hidden />
                    <p className="text-sm font-semibold text-on-surface">Cargando...</p>
                </div>
            ) : filtrados.length === 0 ? (
                <EmptyState
                    icon={ShieldCheck}
                    title="No se encontraron administradores"
                    subtitle={
                        busqueda
                            ? 'No hay resultados que coincidan con la búsqueda actual.'
                            : 'Todavía no hay administradores registrados en este filtro.'
                    }
                >
                    {busqueda ? (
                        <Button
                            variant="outline"
                            title="Limpiar búsqueda"
                            onClick={() => {
                                setBusqueda('');
                                setFiltroEstado('todos');
                            }}
                        />
                    ) : (
                        <Link to="/admin/administradores/nuevo">
                            <Button title="Cargar el primer administrador" />
                        </Link>
                    )}
                </EmptyState>
            ) : vista === 'tabla' ? (
                <div className="overflow-hidden rounded-2xl bg-white border border-outline-variant/60 shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface-container-low text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/60">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5">Administrador</th>
                                    <th scope="col" className="px-6 py-3.5">Usuario</th>
                                    <th scope="col" className="px-6 py-3.5">Contacto</th>
                                    <th scope="col" className="px-6 py-3.5">Estado</th>
                                    <th scope="col" className="px-6 py-3.5">Alta</th>
                                    <th scope="col" className="px-6 py-3.5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/40">
                                {filtrados.map((admin) => (
                                    <tr
                                        key={admin.id}
                                        className="hover:bg-surface-container-lowest/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                                    {iniciales(admin)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                        {admin.first_name} {admin.last_name}
                                                    </p>
                                                    <p className="text-xs text-on-surface-variant font-mono">ID: #{admin.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-container text-on-surface-variant">
                                                @{admin.username}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant text-xs">
                                            {admin.email ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="size-3.5 text-outline" />
                                                    <span>{admin.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-outline italic">Sin email registrado</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${admin.activo
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}
                                            >
                                                {admin.activo ? 'Activo' : 'Inhabilitado'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-on-surface-variant">
                                            {admin.created_at || 'Mar 2026'}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => abrirDetalle(admin)}
                                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Ver ficha completa"
                                                    aria-label={`Ver ficha de ${admin.first_name}`}
                                                >
                                                    <Eye className="size-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => irAEditar(admin)}
                                                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Editar administrador"
                                                    aria-label={`Editar a ${admin.first_name}`}
                                                >
                                                    <Edit2 className="size-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleInhabilitar(admin)}
                                                    className={`p-1.5 rounded-lg transition-colors ${admin.activo
                                                        ? 'text-on-surface-variant hover:text-rose-600 hover:bg-rose-50'
                                                        : 'text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                    title={admin.activo ? 'Inhabilitar administrador' : 'Reactivar administrador'}
                                                    aria-label={admin.activo ? 'Inhabilitar' : 'Reactivar'}
                                                >
                                                    {admin.activo ? (
                                                        <UserX className="size-4" />
                                                    ) : (
                                                        <UserCheck className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtrados.map((admin) => (
                        <div
                            key={admin.id}
                            className="p-5 rounded-2xl bg-white border border-outline-variant/60 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-on-primary">
                                            {iniciales(admin)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-on-surface text-base">
                                                {admin.first_name} {admin.last_name}
                                            </h4>
                                            <p className="text-xs font-medium text-primary">@{admin.username}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium border ${admin.activo
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}
                                    >
                                        {admin.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/40 pt-3">
                                    {admin.email && (
                                        <div className="flex items-center gap-2 truncate">
                                            <Mail className="size-3.5 text-outline shrink-0" />
                                            <span className="truncate">{admin.email}</span>
                                        </div>
                                    )}
                                    <p className="text-2xs text-outline">Alta: {admin.created_at || 'Marzo 2026'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-outline-variant/40 pt-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => abrirDetalle(admin)}
                                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                    <Eye className="size-3.5" /> Ficha
                                </button>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => irAEditar(admin)}
                                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleInhabilitar(admin)}
                                        className={`p-1.5 rounded-lg transition-colors ${admin.activo
                                            ? 'text-rose-600 hover:bg-rose-50'
                                            : 'text-emerald-600 hover:bg-emerald-50'
                                            }`}
                                        title={admin.activo ? 'Inhabilitar' : 'Reactivar'}
                                    >
                                        {admin.activo ? <UserX className="size-3.5" /> : <UserCheck className="size-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AdminDetailModal
                admin={adminSeleccionado}
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onToggleInhabilitar={handleToggleInhabilitar}
                onEdit={irAEditar}
            />
        </div>
    );
}
