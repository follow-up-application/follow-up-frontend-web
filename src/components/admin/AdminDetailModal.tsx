import {
    Calendar,
    Clock,
    Edit2,
    Mail,
    Shield,
    ShieldAlert,
    ShieldCheck,
    User,
    UserCheck,
    UserX,
    X,
} from 'lucide-react';
import type { Admin } from '@/services/adminService';
import { iniciales } from '@/utils/session';

interface AdminDetailModalProps {
    admin: Admin | null;
    isOpen: boolean;
    onClose: () => void;
    onToggleInhabilitar: (admin: Admin) => void;
    onEdit: (admin: Admin) => void;
}

export default function AdminDetailModal({
    admin,
    isOpen,
    onClose,
    onToggleInhabilitar,
    onEdit,
}: AdminDetailModalProps) {
    if (!isOpen || !admin) return null;

    const nombreCompleto = `${admin.first_name} ${admin.last_name}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-150"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-admin-title"
            >
                <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4 bg-surface-container-low">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck className="size-5" aria-hidden />
                        </div>
                        <div>
                            <h3 id="modal-admin-title" className="text-base font-semibold text-on-surface">
                                Ficha Institucional
                            </h3>
                            <p className="text-xs text-on-surface-variant">Detalle del Administrador</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-on-primary shadow-md">
                            {iniciales(admin)}
                            <span
                                className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ${admin.activo ? 'bg-emerald-500' : 'bg-slate-400'
                                    }`}
                                title={admin.activo ? 'Cuenta activa' : 'Cuenta inhabilitada'}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-lg font-bold text-on-surface truncate">{nombreCompleto}</h4>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${admin.activo
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}
                                >
                                    {admin.activo ? 'Activo' : 'Inhabilitado'}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-primary mt-0.5">@{admin.username}</p>
                            {admin.email && (
                                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-1.5 truncate">
                                    <Mail className="size-3.5 shrink-0 text-outline" />
                                    <span className="truncate">{admin.email}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                                <Shield className="size-3.5 text-outline" /> Rol Asignado
                            </span>
                            <p className="font-semibold text-on-surface">Administrador</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                                <User className="size-3.5 text-outline" /> ID de Sistema
                            </span>
                            <p className="font-semibold text-on-surface font-mono text-xs">#{admin.id}</p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-outline-variant/40">
                            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-outline" /> Alta en Sistema
                            </span>
                            <p className="text-xs font-medium text-on-surface">{admin.created_at || 'Marzo 2026'}</p>
                        </div>
                        <div className="space-y-1 pt-2 border-t border-outline-variant/40">
                            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                                <Clock className="size-3.5 text-outline" /> Último Acceso
                            </span>
                            <p className="text-xs font-medium text-on-surface">{admin.ultimo_acceso || 'Hoy'}</p>
                        </div>
                    </div>

                    {admin.activo ? (
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                            <ShieldCheck className="size-4 shrink-0 text-blue-600 mt-0.5" />
                            <p>
                                Este usuario tiene privilegios totales para gestionar la institución, alumnos, docentes y cursos.
                            </p>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                            <ShieldAlert className="size-4 shrink-0 text-amber-600 mt-0.5" />
                            <p>
                                <strong>Cuenta inhabilitada:</strong> Este administrador no puede acceder al panel ni modificar registros.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant/60 px-6 py-4 bg-surface-container-low">
                    <button
                        type="button"
                        onClick={() => onToggleInhabilitar(admin)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${admin.activo
                            ? 'border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100'
                            }`}
                    >
                        {admin.activo ? (
                            <>
                                <UserX className="size-3.5" /> Inhabilitar Administrador
                            </>
                        ) : (
                            <>
                                <UserCheck className="size-3.5" /> Reactivar Cuenta
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            onClick={() => onEdit(admin)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 shadow-xs transition-colors"
                        >
                            <Edit2 className="size-3.5" /> Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
