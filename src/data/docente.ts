import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  MessageSquare,
  Mic,
  School,
  ThumbsUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Notificacion } from '@/components/notifications/NotificationList';

export type ResumenDocente = {
  id: string;
  label: string;
  valor: string;
  icono: LucideIcon;
  color: string;
  to?: string;
};

export const DOCENTE_RESUMEN: ResumenDocente[] = [
  { id: '1', label: 'Clases hoy', valor: '4', icono: Clock, color: '#E65100' },
  { id: '2', label: 'Asistencia', valor: '94%', icono: ClipboardCheck, color: '#6750A4' },
  { id: '3', label: 'Ver Notas', valor: '', icono: GraduationCap, color: '#386A20', to: '/docente/notas' },
];

export type AccionDocente = {
  id: string;
  label: string;
  icono: LucideIcon;
  bg: string;
  iconColor: string;
  to: string;
};

export const DOCENTE_ACCIONES: AccionDocente[] = [
  {
    id: '1',
    label: 'Tomar asistencia',
    icono: Users,
    bg: '#EDE7F6',
    iconColor: '#6750A4',
    to: '/docente/asistencia',
  },
  {
    id: '2',
    label: 'Cargar notas',
    icono: ClipboardList,
    bg: '#D1C4E9',
    iconColor: '#4527A0',
    to: '/docente/notas',
  },
  {
    id: '3',
    label: 'Crear aviso',
    icono: MessageSquare,
    bg: '#FCE4EC',
    iconColor: '#C62828',
    to: '/docente/avisos/nuevo',
  },
  {
    id: '4',
    label: 'Ver agenda',
    icono: CalendarDays,
    bg: '#ECEFF1',
    iconColor: '#546E7A',
    to: '/docente/agenda',
  },
];

export const DOCENTE_ACTIVIDADES: { id: string; titulo: string; subtitulo: string; icono: LucideIcon; iconColor: string }[] = [
  {
    id: '1',
    titulo: 'Reunión de Departamento',
    subtitulo: 'Hoy • 15:30 • Sala 4',
    icono: Users,
    iconColor: '#6750A4',
  },
  {
    id: '2',
    titulo: 'Entrega de Calificaciones',
    subtitulo: 'Mañana • Todo el día',
    icono: ClipboardCheck,
    iconColor: '#E65100',
  },
  {
    id: '3',
    titulo: 'Examen de Matemáticas II',
    subtitulo: 'Viernes • 08:00 • Aula Magna',
    icono: School,
    iconColor: '#6750A4',
  },
];

export type MateriaDocente = {
  id: string;
  nombre: string;
  subtitulo: string;
  categoria: string;
  categoriaColor: string;
  categoriaBg: string;
  alumnosCount: number;
  horario: string;
};

export const DOCENTE_MATERIAS: MateriaDocente[] = [
  {
    id: '1',
    nombre: 'Matemáticas II',
    subtitulo: '4to Año "B"',
    categoria: 'Ciencias Exactas',
    categoriaColor: '#21005D',
    categoriaBg: '#E8DDFF',
    alumnosCount: 28,
    horario: 'Lun y Mie 08:00 - 09:30',
  },
  {
    id: '2',
    nombre: 'Física I',
    subtitulo: '3er Año "A"',
    categoria: 'Ciencias Naturales',
    categoriaColor: '#C62828',
    categoriaBg: '#FCE4EC',
    alumnosCount: 24,
    horario: 'Mar y Jue 10:45 - 12:15',
  },
  {
    id: '3',
    nombre: 'Geometría Analítica',
    subtitulo: '5to Año "C"',
    categoria: 'Ciencias Exactas',
    categoriaColor: '#21005D',
    categoriaBg: '#E8DDFF',
    alumnosCount: 31,
    horario: 'Viernes 07:30 - 10:30',
  },
  {
    id: '4',
    nombre: 'Taller de Robótica',
    subtitulo: 'Ciclo Superior',
    categoria: 'Tecnología',
    categoriaColor: '#37474F',
    categoriaBg: '#ECEFF1',
    alumnosCount: 15,
    horario: 'Miércoles 14:00 - 16:00',
  },
];

export const DOCENTE_CATEGORIAS = [
  'Todas',
  'Ciencias Exactas',
  'Ciencias Naturales',
  'Tecnología',
];

export type AlumnoInscripto = {
  id: string;
  nombre: string;
  legajo: string;
  avatarColor: string;
};

export const MOCK_ALUMNOS_INSCRIPTOS: AlumnoInscripto[] = [
  { id: '1', nombre: 'Alonso, Mateo', legajo: '#29402', avatarColor: '#6750A4' },
  { id: '2', nombre: 'Benítez, Rosa', legajo: '#29405', avatarColor: '#B3261E' },
  { id: '3', nombre: 'Castillo, Juan', legajo: '#29410', avatarColor: '#386A20' },
  { id: '4', nombre: 'Díaz, Martina', legajo: '#29412', avatarColor: '#625B71' },
  { id: '5', nombre: 'Estrada, Lucas', legajo: '#29415', avatarColor: '#E65100' },
  { id: '6', nombre: 'Fernández, Ana', legajo: '#29420', avatarColor: '#4A6FA5' },
];

export type EstadoAsistencia = 'P' | 'A' | 'J' | null;

export type AlumnoAsistencia = {
  id: string;
  nombre: string;
  legajo: string;
  iniciales: string;
  avatarColor: string;
  estado: EstadoAsistencia;
};

export const ASISTENCIA_MATERIAS = [
  'Matemáticas Avanzadas - 5° A',
  'Álgebra - 4° B',
  'Física - 3° A',
  'Cálculo - 6° A',
];

export const MOCK_ALUMNOS_ASISTENCIA: AlumnoAsistencia[] = [
  { id: '1', nombre: 'Alonso, Mateo', legajo: '#29402', iniciales: 'AM', avatarColor: '#6750A4', estado: null },
  { id: '2', nombre: 'Benítez, Rosa', legajo: '#29405', iniciales: 'BR', avatarColor: '#B3261E', estado: null },
  { id: '3', nombre: 'Castillo, Juan', legajo: '#29410', iniciales: 'CJ', avatarColor: '#386A20', estado: null },
  { id: '4', nombre: 'Díaz, Martina', legajo: '#29412', iniciales: 'DM', avatarColor: '#625B71', estado: null },
  { id: '5', nombre: 'Estrada, Lucas', legajo: '#29415', iniciales: 'EL', avatarColor: '#E65100', estado: null },
  { id: '6', nombre: 'Fernández, Ana', legajo: '#29420', iniciales: 'FA', avatarColor: '#4A6FA5', estado: null },
  { id: '7', nombre: 'García, Pablo', legajo: '#29423', iniciales: 'GP', avatarColor: '#6750A4', estado: null },
  { id: '8', nombre: 'Herrera, Sofía', legajo: '#29428', iniciales: 'HS', avatarColor: '#B3261E', estado: null },
];

export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const NOTAS_MATERIAS = [
  'Matemáticas Avanzadas',
  'Álgebra',
  'Física Cuántica',
  'Cálculo',
];

export type TipoEval = 'Examen' | 'Trabajo Práctico' | 'Participación' | 'Laboratorio';

export const TIPOS_EVAL: { id: TipoEval; icono: LucideIcon }[] = [
  { id: 'Examen', icono: ClipboardList },
  { id: 'Trabajo Práctico', icono: FileText },
  { id: 'Participación', icono: Mic },
  { id: 'Laboratorio', icono: BookOpen },
];

export type AlumnoNota = {
  id: string;
  nombre: string;
  idAlumno: string;
  iniciales: string;
  avatarColor: string;
  nota: string;
};

export const MOCK_ALUMNOS_NOTAS: AlumnoNota[] = [
  { id: '1', nombre: 'Alba Martínez', idAlumno: 'ID: 2024-001', iniciales: 'AM', avatarColor: '#6750A4', nota: '9' },
  { id: '2', nombre: 'Bruno González', idAlumno: 'ID: 2024-012', iniciales: 'BG', avatarColor: '#B3261E', nota: '3' },
  { id: '3', nombre: 'Clara Rodríguez', idAlumno: 'ID: 2024-045', iniciales: 'CR', avatarColor: '#386A20', nota: '' },
  { id: '4', nombre: 'Diego López', idAlumno: 'ID: 2024-089', iniciales: 'DL', avatarColor: '#625B71', nota: '7,5' },
  { id: '5', nombre: 'Elena Sánchez', idAlumno: 'ID: 2024-102', iniciales: 'ES', avatarColor: '#E65100', nota: '' },
  { id: '6', nombre: 'Fabián Torres', idAlumno: 'ID: 2024-115', iniciales: 'FT', avatarColor: '#4A6FA5', nota: '6' },
  { id: '7', nombre: 'Gloria Vega', idAlumno: 'ID: 2024-128', iniciales: 'GV', avatarColor: '#6750A4', nota: '10' },
  { id: '8', nombre: 'Hugo Méndez', idAlumno: 'ID: 2024-134', iniciales: 'HM', avatarColor: '#386A20', nota: '4' },
];

export const AVISO_DESTINATARIOS = [
  'Todos los contactos',
  'Padres de 5° A - Matemáticas',
  'Padres de 4° B - Álgebra',
  'Directivos y Preceptores',
];

export const OBSERVACION_ALUMNOS = [
  'F. Alegre',
  'D. Ramirez',
  'P. Ramirez',
  'L. Hofer',
  'E. Vicentin',
];

export const OBSERVACION_TIPOS: { id: string; label: string; icono: LucideIcon; color: string }[] = [
  { id: 'Positiva', label: 'Positiva', icono: ThumbsUp, color: '#386A20' },
  { id: 'Conductual', label: 'Conductual', icono: TriangleAlert, color: '#E65100' },
  { id: 'Académica', label: 'Académica', icono: School, color: '#B3261E' },
];

export type DiaAgenda = { nombre: string; numero: number; id: string };

export const AGENDA_DIAS: DiaAgenda[] = [
  { nombre: 'Lun', numero: 14, id: '14' },
  { nombre: 'Mar', numero: 15, id: '15' },
  { nombre: 'Mié', numero: 16, id: '16' },
  { nombre: 'Jue', numero: 17, id: '17' },
  { nombre: 'Vie', numero: 18, id: '18' },
  { nombre: 'Sáb', numero: 19, id: '19' },
];

export type ActividadAgenda = {
  id: string;
  horaInicio: string;
  horaFin: string;
  titulo: string;
  contexto: string;
  tipo: 'Clase' | 'Examen' | 'Reunión';
  colorBorde: string;
  participantes?: string[];
};

export const AGENDA_ACTIVIDADES: Record<string, ActividadAgenda[]> = {
  '15': [
    {
      id: '1',
      horaInicio: '08:00',
      horaFin: '09:30',
      titulo: 'Clase de Matemáticas II',
      contexto: '4to Año "B" - Aula 102',
      tipo: 'Clase',
      colorBorde: '#386A20',
    },
    {
      id: '2',
      horaInicio: '10:00',
      horaFin: '11:30',
      titulo: 'Parcial de Geometría',
      contexto: '5to Año "A" - Salón de Actos',
      tipo: 'Examen',
      colorBorde: '#B3261E',
    },
    {
      id: '3',
      horaInicio: '12:00',
      horaFin: '13:00',
      titulo: 'Reunión de Departamento',
      contexto: 'Sala de Profesores',
      tipo: 'Reunión',
      colorBorde: '#6750A4',
      participantes: ['P', 'L'],
    },
    {
      id: '4',
      horaInicio: '14:00',
      horaFin: '15:30',
      titulo: 'Clase de Física I',
      contexto: '3er Año "C" - Laboratorio',
      tipo: 'Clase',
      colorBorde: '#386A20',
    },
  ],
  '14': [
    {
      id: '5',
      horaInicio: '08:30',
      horaFin: '10:00',
      titulo: 'Clase de Álgebra',
      contexto: '4to Año "A" - Aula 101',
      tipo: 'Clase',
      colorBorde: '#386A20',
    },
  ],
};

export const AGENDA_FILTROS = ['Todas', 'Clases', 'Exámenes', 'Reuniones'] as const;

export const DOCENTE_NOTIFICACIONES: Notificacion[] = [
  {
    id: '1',
    titulo: 'Inasistencia Reiterada',
    mensaje: 'El alumno Fabricio Alegre acumula 5 inasistencias en tu materia este mes.',
    tiempo: 'Hace 1 hora',
    urgente: true,
    icono: AlertCircle,
    iconoColor: '#B3261E',
    leido: false,
    accion: { label: 'Ver detalle' },
  },
  {
    id: '2',
    titulo: 'Entrega de calificaciones',
    mensaje: 'Recordatorio: debes cargar las notas del 2do trimestre antes del viernes.',
    tiempo: 'Hace 3 horas',
    urgente: false,
    icono: Clock,
    iconoColor: '#E65100',
    leido: false,
  },
  {
    id: '3',
    titulo: 'Reunión de Departamento',
    mensaje: 'La reunión de hoy a las 15:30 en Sala 4 ha sido confirmada.',
    tiempo: 'Hace 5 horas',
    urgente: false,
    icono: Users,
    iconoColor: '#6750A4',
    leido: true,
  },
];

export { CheckCircle2 };
