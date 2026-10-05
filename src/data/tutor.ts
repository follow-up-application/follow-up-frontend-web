import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  FileText,
  Mail,
  Mic,
  School,
  Star,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Notificacion } from '@/components/notifications/NotificationList';

export type TutorAlumno = { id: string; nombre: string; curso: string };

export const MOCK_TUTOR_ALUMNOS: TutorAlumno[] = [
  { id: '1', nombre: 'Alegre Fabricio', curso: '4to Año B' },
  { id: '2', nombre: 'Ramirez Damian', curso: '4to Año B' },
  { id: '3', nombre: 'Ramirez Pablo', curso: '3ro Año A' },
  { id: '4', nombre: 'Lautaro Hofer', curso: '4to Año B' },
  { id: '5', nombre: 'Vicentin Erick', curso: '3ro Año A' },
];

export type TutorInfoCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: LucideIcon;
  color: string;
  to: string;
};

export const TUTOR_INFO_CARDS: TutorInfoCard[] = [
  {
    id: '1',
    titulo: 'Inasistencia',
    subtitulo: '3 días',
    icono: Users,
    color: '#B3261E',
    to: '/tutor/alumnos',
  },
  {
    id: '2',
    titulo: 'Boletín',
    subtitulo: 'Ciclo 1',
    icono: BookOpen,
    color: '#6750A4',
    to: '/tutor/notas',
  },
  {
    id: '3',
    titulo: 'Comunicados',
    subtitulo: '2 nuevos',
    icono: Mail,
    color: '#E65100',
    to: '/tutor/notificaciones',
  },
  {
    id: '4',
    titulo: 'Horarios',
    subtitulo: 'Ver grilla',
    icono: CalendarDays,
    color: '#6750A4',
    to: '/tutor/agenda',
  },
];

export type Actividad = {
  id: string;
  materia: string;
  tipo: string;
  fecha: string;
  icono: LucideIcon;
  color: string;
};

export const TUTOR_ACTIVIDADES: Actividad[] = [
  { id: '1', materia: 'Matemática', tipo: 'Examen', fecha: 'Lun 23 Jun', icono: School, color: '#B3261E' },
  {
    id: '2',
    materia: 'Lengua',
    tipo: 'Entrega de trabajo',
    fecha: 'Mié 25 Jun',
    icono: FileText,
    color: '#6750A4',
  },
  {
    id: '3',
    materia: 'Historia',
    tipo: 'Exposición oral',
    fecha: 'Vie 27 Jun',
    icono: Mic,
    color: '#625B71',
  },
  {
    id: '4',
    materia: 'Física',
    tipo: 'Laboratorio',
    fecha: 'Lun 30 Jun',
    icono: Star,
    color: '#386A20',
  },
];

export type Calificacion = {
  id: string;
  materia: string;
  profesor: string;
  nota1: string;
  nota2: string;
  notaFinal: number;
};

export type HijoId = '1' | '2';

export const MOCK_HIJOS = [
  { id: '1' as HijoId, nombre: 'Mateo García' },
  { id: '2' as HijoId, nombre: 'Lucía García' },
];

export const CALIFICACIONES_POR_HIJO: Record<HijoId, Calificacion[]> = {
  '1': [
    {
      id: '1',
      materia: 'Matemáticas Avanzadas',
      profesor: 'Prof. Roberto Domínguez',
      nota1: '8.5',
      nota2: '7.0',
      notaFinal: 7.8,
    },
    {
      id: '2',
      materia: 'Historia Universal',
      profesor: 'Prof. Elena Martinez',
      nota1: '9.0',
      nota2: '8.5',
      notaFinal: 8.8,
    },
    {
      id: '3',
      materia: 'Física Cuántica',
      profesor: 'Prof. Carlos Weber',
      nota1: '4.5',
      nota2: '5.5',
      notaFinal: 5.0,
    },
    {
      id: '4',
      materia: 'Lengua y Literatura',
      profesor: 'Prof. Silvia Rossi',
      nota1: '7.0',
      nota2: '8.0',
      notaFinal: 7.5,
    },
  ],
  '2': [
    {
      id: '1',
      materia: 'Biología Celular',
      profesor: 'Prof. Roberto Domínguez',
      nota1: '9.0',
      nota2: '9.0',
      notaFinal: 9.0,
    },
    {
      id: '2',
      materia: 'Química Orgánica',
      profesor: 'Prof. Juan Perez',
      nota1: '6.0',
      nota2: '7.0',
      notaFinal: 6.5,
    },
  ],
};

export type EstadisticasHijo = {
  asistencia: string;
  conducta: string;
  promedio: string;
  desempeno: string;
  desc: string;
};

export const ESTADISTICAS_POR_HIJO: Record<HijoId, EstadisticasHijo> = {
  '1': {
    asistencia: '94%',
    conducta: 'Excelente',
    promedio: '7.3',
    desempeno: 'Desempeño Sobresaliente',
    desc: 'Mateo se mantiene en el tercio superior de su clase con un promedio general de 7.3',
  },
  '2': {
    asistencia: '98%',
    conducta: 'Excelente',
    promedio: '7.8',
    desempeno: 'Desempeño Sobresaliente',
    desc: 'Lucía se mantiene en el cuadro de honor con un promedio general de 7.8',
  },
};

export type AgendaItem = {
  id: string;
  mes: string;
  dia: string;
  badge: string;
  badgeColor: string;
  hora: string;
  titulo: string;
  desc: string;
  categoria: 'Examen' | 'Entrega' | 'Reunión';
  conAsistentes: boolean;
};

export const TUTOR_AGENDA: { section: string; items: AgendaItem[] }[] = [
  {
    section: 'ESTA SEMANA',
    items: [
      {
        id: '1',
        mes: 'JUN',
        dia: '25',
        badge: 'Examen',
        badgeColor: '#B3261E',
        hora: '08:30 AM',
        titulo: 'Examen de Matemáticas',
        desc: 'Unidad 4: Álgebra y funciones lineales.',
        categoria: 'Examen',
        conAsistentes: false,
      },
      {
        id: '2',
        mes: 'JUN',
        dia: '26',
        badge: 'Entrega',
        badgeColor: '#6750A4',
        hora: '11:59 PM',
        titulo: 'Informe de Biología',
        desc: 'Laboratorio de sistemas celulares.',
        categoria: 'Entrega',
        conAsistentes: false,
      },
      {
        id: '3',
        mes: 'JUN',
        dia: '28',
        badge: 'Reunión',
        badgeColor: '#386A20',
        hora: '05:00 PM',
        titulo: 'Consejo de Padres',
        desc: 'Discusión de planificación fin de curso.',
        categoria: 'Reunión',
        conAsistentes: true,
      },
    ],
  },
  {
    section: 'PRÓXIMA SEMANA',
    items: [
      {
        id: '4',
        mes: 'JUL',
        dia: '02',
        badge: 'Importante',
        badgeColor: '#E65100',
        hora: '10:00 AM',
        titulo: 'Simulacro General',
        desc: 'Ejercicio de seguridad institucional obligatorio.',
        categoria: 'Reunión',
        conAsistentes: false,
      },
    ],
  },
];

export const TUTOR_NOTIFICACIONES: Notificacion[] = [
  {
    id: '1',
    titulo: 'Ausencia Injustificada',
    mensaje: 'Mateo no asistió a la clase de Matemáticas hoy. Por favor, justifique la falta.',
    tiempo: 'Hace 2 horas',
    urgente: true,
    icono: TriangleAlert,
    iconoColor: '#B3261E',
    leido: false,
    accion: { label: 'Acción Requerida' },
  },
  {
    id: '2',
    titulo: 'Calificación publicada',
    mensaje: 'Se ha publicado la nota del examen de Historia: 9.5/10',
    tiempo: 'Hace 4 horas',
    urgente: false,
    icono: Star,
    iconoColor: '#6750A4',
    leido: false,
  },
  {
    id: '3',
    titulo: 'Mensaje de Directora',
    mensaje:
      'Estimados padres, les recordamos que mañana no habrá clases por jornada técnica...',
    tiempo: 'Hace 1 día',
    urgente: false,
    icono: Mail,
    iconoColor: '#6750A4',
    leido: false,
  },
  {
    id: '4',
    titulo: 'Alerta de Rendimiento',
    mensaje:
      'El promedio de Sofía en Ciencias ha bajado de 6.0. Se sugiere programar una tutoría.',
    tiempo: 'Hace 2 días',
    urgente: true,
    icono: AlertCircle,
    iconoColor: '#B3261E',
    leido: false,
    accion: { label: 'Ver detalles' },
  },
  {
    id: '5',
    titulo: 'Reunión de Padres',
    mensaje:
      'Recordatorio: La reunión trimestral será este viernes a las 17:00 en el Salón de Actos.',
    tiempo: 'Hace 3 días',
    urgente: false,
    icono: CalendarDays,
    iconoColor: '#B3261E',
    leido: false,
  },
];

export type Conversacion = {
  id: string;
  nombre: string;
  preview: string;
  hora: string;
  sinLeer: number;
  iniciales: string;
  avatarColor: string;
  online: boolean;
};

export const TUTOR_CONVERSACIONES: Conversacion[] = [
  {
    id: '1',
    nombre: 'Prof. Elena Martínez',
    preview: 'Hola, quería comentarte s...',
    hora: '10:45 AM',
    sinLeer: 2,
    iniciales: 'EM',
    avatarColor: '#6750A4',
    online: true,
  },
  {
    id: '2',
    nombre: 'Dr. Ricardo Silva',
    preview: 'La lista de materiales para...',
    hora: 'Ayer',
    sinLeer: 0,
    iniciales: 'RS',
    avatarColor: '#386A20',
    online: false,
  },
  {
    id: '3',
    nombre: 'Administración Central',
    preview: 'Confirmamos la recepción...',
    hora: 'Lun',
    sinLeer: 0,
    iniciales: 'AC',
    avatarColor: '#625B71',
    online: false,
  },
];

export const TUTOR_DIRECTORIO = [
  { id: '1', nombre: 'Prof. Elena Martínez', materia: 'Matemáticas', iniciales: 'EM', color: '#6750A4' },
  { id: '2', nombre: 'Dr. Ricardo Silva', materia: 'Biología', iniciales: 'RS', color: '#386A20' },
  { id: '3', nombre: 'Prof. Silvia Rossi', materia: 'Lengua y Literatura', iniciales: 'SR', color: '#B3261E' },
  { id: '4', nombre: 'Prof. Carlos Weber', materia: 'Física', iniciales: 'CW', color: '#E65100' },
  { id: '5', nombre: 'Prof. Roberto Domínguez', materia: 'Historia', iniciales: 'RD', color: '#625B71' },
];
