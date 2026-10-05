import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  School,
  UserPlus,
  Users,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
};

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  tutor: [
    { label: 'Panel Principal', path: '/tutor', icon: LayoutDashboard, end: true },
    { label: 'Mis Alumnos', path: '/tutor/alumnos', icon: Users },
    { label: 'Próximas Actividades', path: '/tutor/agenda', icon: CalendarDays },
    { label: 'Resumen de Notas', path: '/tutor/notas', icon: GraduationCap },
    { label: 'Notificaciones', path: '/tutor/notificaciones', icon: Bell },
    { label: 'Contactar Docente', path: '/tutor/contacto', icon: MessageSquare },
    { label: 'Mi Perfil', path: '/tutor/perfil', icon: UserRound },
  ],
  docente: [
    { label: 'Panel Principal', path: '/docente', icon: LayoutDashboard, end: true },
    { label: 'Mis Materias', path: '/docente/materias', icon: BookOpen },
    { label: 'Tomar Asistencia', path: '/docente/asistencia', icon: ClipboardCheck },
    { label: 'Cargar Notas', path: '/docente/notas', icon: ClipboardList },
    { label: 'Crear Aviso', path: '/docente/avisos/nuevo', icon: Megaphone },
    { label: 'Observación', path: '/docente/observaciones', icon: ClipboardList },
    { label: 'Ver Agenda', path: '/docente/agenda', icon: CalendarRange },
    { label: 'Notificaciones', path: '/docente/notificaciones', icon: Bell },
    { label: 'Mi Perfil', path: '/docente/perfil', icon: UserRound },
  ],
  alumno: [
    { label: 'Mi Portal', path: '/alumno', icon: LayoutDashboard, end: true },
    { label: 'Boletín de Notas', path: '/alumno/notas', icon: ClipboardList },
    { label: 'Horarios', path: '/alumno/horarios', icon: CalendarDays },
    { label: 'Asistencia', path: '/alumno/asistencia', icon: ClipboardCheck },
    { label: 'Observaciones', path: '/alumno/observaciones', icon: Bell },
    { label: 'Comunicados', path: '/alumno/comunicados', icon: Megaphone },
    { label: 'Notificaciones', path: '/alumno/notificaciones', icon: Bell },
    { label: 'Mi Perfil', path: '/alumno/perfil', icon: UserRound },
  ],
  administrador: [
    { label: 'Panel Principal', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Cargar Alumno', path: '/admin/alumnos/nuevo', icon: UserPlus },
    { label: 'Listado de Alumnos', path: '/admin/alumnos', icon: Users },
    { label: 'Cargar Docente', path: '/admin/docentes/nuevo', icon: School },
    { label: 'Listado de Docentes', path: '/admin/docentes', icon: School },
    { label: 'Cargar Curso / División', path: '/admin/cursos/nuevo', icon: GraduationCap },
    { label: 'Cargar Materia', path: '/admin/materias/nuevo', icon: BookOpen },
    { label: 'Verificar API', path: '/admin/verificar-api', icon: Activity },
  ],
};
