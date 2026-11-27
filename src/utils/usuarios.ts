import type { UserRole } from '@/types/user';

export const COLORES_POR_ROL: Record<UserRole, { bg: string; text: string; border: string }> = {
  administrador: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  docente: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  alumno: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  tutor: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
};

export const ETIQUETAS_POR_ROL: Record<UserRole, string> = {
  administrador: 'Administrador',
  docente: 'Docente',
  alumno: 'Alumno',
  tutor: 'Tutor',
};

export function etiquetaRol(rol: UserRole): string {
  return ETIQUETAS_POR_ROL[rol] ?? rol;
}

export function clasesRol(rol: UserRole) {
  return (
    COLORES_POR_ROL[rol] ?? {
      bg: 'bg-surface',
      text: 'text-secondary',
      border: 'border-border',
    }
  );
}
