import { BookOpen, GraduationCap, School, ShieldCheck, UserPlus, Users } from 'lucide-react';

export const GRADOS = Array.from({ length: 9 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

export const DIVISIONES_CURSO = ['A', 'B', 'C', 'D', 'E'].map((value) => ({ value, label: value }));

export const DIVISIONES_DOCENTE = ['1', '2', '3', 'A', 'B', 'C', 'D', 'E'].map((value) => ({
  value,
  label: value,
}));

export const TURNOS = [
  { value: 'Mañana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
];

export const MATERIAS = [
  'Matemáticas',
  'Prácticas del Lenguaje',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Educación Física',
  'Inglés',
  'Arte',
].map((value) => ({ value, label: value }));

export const OPCIONES_PARENTESCO = [
  { value: 'padre', label: 'Padre' },
  { value: 'madre', label: 'Madre' },
  { value: 'otra', label: 'Otra' },
];

export const PALETA_AVATARES = ['#6750A4', '#B3261E', '#386A20', '#625B71', '#E65100'];

export const MODULOS_ADMIN = [
  {
    id: '7',
    titulo: 'Administradores',
    descripcion: 'Gestionar altas, edición, detalle e inhabilitación de administradores.',
    icon: ShieldCheck,
    to: '/admin/administradores',
    tone: 'primary' as const,
  },
  {
    id: '1',
    titulo: 'Cargar Alumno',
    descripcion: 'Registrar un alumno y vincularlo con su tutor.',
    icon: UserPlus,
    to: '/admin/alumnos/nuevo',
    tone: 'primary' as const,
  },
  {
    id: '5',
    titulo: 'Listado de Alumnos',
    descripcion: 'Consultar, editar y eliminar alumnos del sistema.',
    icon: Users,
    to: '/admin/alumnos',
    tone: 'success' as const,
  },
  {
    id: '2',
    titulo: 'Cargar Docente',
    descripcion: 'Dar de alta un docente con sus asignaciones.',
    icon: School,
    to: '/admin/docentes/nuevo',
    tone: 'warning' as const,
  },
  {
    id: '6',
    titulo: 'Listado de Docentes',
    descripcion: 'Gestionar el padrón docente de la institución.',
    icon: Users,
    to: '/admin/docentes',
    tone: 'primary' as const,
  },
  {
    id: '3',
    titulo: 'Cargar Curso / División',
    descripcion: 'Crear un nuevo curso, división y turno.',
    icon: GraduationCap,
    to: '/admin/cursos/nuevo',
    tone: 'success' as const,
  },
  {
    id: '4',
    titulo: 'Cargar Materia',
    descripcion: 'Registrar las materias disponibles en la escuela.',
    icon: BookOpen,
    to: '/admin/materias/nuevo',
    tone: 'warning' as const,
  },
];
