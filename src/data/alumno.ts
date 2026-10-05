import type { Notificacion } from '@/components/notifications/NotificationList';

export const ALUMNO = {
  nombre: 'Lucas Estrada',
  rol: 'Alumno - 4to Año B',
  iniciales: 'LE',
  curso: '4to Año B',
  promedioGeneral: 8.2,
  asistenciaTotal: 92,
} as const;

export type Aviso = {
  id: string;
  titulo: string;
  remitente: string;
  fecha: string;
  urgente: boolean;
  cuerpo: string;
};

export const MOCK_AVISOS: Aviso[] = [
  {
    id: '1',
    titulo: 'Circular Fin de Mes',
    remitente: 'Dirección Académica',
    fecha: 'Hoy, 09:30 AM',
    urgente: true,
    cuerpo:
      'Estimados alumnos y familias:\n\nNos dirigimos a ustedes para informarles que el próximo viernes 30 de noviembre se llevará a cabo el acto de cierre del mes. Por este motivo, las actividades extracurriculares de la tarde quedarán suspendidas.\n\nAsimismo, les recordamos que ya se encuentran disponibles las calificaciones parciales del trimestre en la sección "Notas" de esta misma aplicación.\n\nCualquier consulta, por favor dirigirse al departamento de alumnos.\n\nSaludos cordiales,\nLa Dirección.',
  },
  {
    id: '2',
    titulo: 'Convocatoria Feria de Ciencias',
    remitente: 'Depto. de Ciencias',
    fecha: 'Ayer, 14:15 PM',
    urgente: false,
    cuerpo:
      'Se invita a todos los alumnos a participar en la Feria de Ciencias Anual que se realizará la segunda semana de noviembre.\n\nLos equipos interesados deberán inscribir sus proyectos antes del viernes en la preceptoría. Habrá premios para los proyectos más innovadores en robótica y sustentabilidad.\n\n¡Esperamos contar con su participación!',
  },
  {
    id: '3',
    titulo: 'Cambio de Aula - Biología',
    remitente: 'Preceptoría',
    fecha: 'Lunes, 08:00 AM',
    urgente: false,
    cuerpo:
      'Informamos a todos los alumnos de 4to Año B que las clases de Biología Celular de esta semana se dictarán excepcionalmente en el Laboratorio 2, ya que el aula habitual se encuentra en tareas de mantenimiento.\n\nPor favor dirigirse directamente al laboratorio en el horario de clase correspondiente.',
  },
];

export type ObservacionAlumno = {
  id: string;
  tipo: 'positiva' | 'alerta' | 'neutral';
  etiqueta: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  profesor: string;
};

export const MOCK_OBSERVACIONES: ObservacionAlumno[] = [
  {
    id: '1',
    tipo: 'positiva',
    etiqueta: 'Felicitación',
    fecha: '15 Oct, 2023',
    titulo: 'Excelente Participación',
    descripcion:
      'El estudiante demostró un liderazgo excepcional durante el proyecto de ciencias, ayudando a sus compañeros a integrar los conceptos de energía renovable de manera creativa.',
    profesor: 'Prof. Maria González',
  },
  {
    id: '2',
    tipo: 'alerta',
    etiqueta: 'Llamado de atención',
    fecha: '12 Oct, 2023',
    titulo: 'Uso de Celular en Clase',
    descripcion:
      'Se retiró el dispositivo móvil por uso reiterado durante la explicación de matemáticas. Es el segundo aviso en el mes respecto a este comportamiento.',
    profesor: 'Prof. Ricardo Méndez',
  },
  {
    id: '3',
    tipo: 'neutral',
    etiqueta: 'Observación',
    fecha: '08 Oct, 2023',
    titulo: 'Entrega de Material',
    descripcion:
      'El alumno olvidó su libro de texto por tercera vez consecutiva. Se le permitió trabajar con copias, pero se sugiere revisión en casa.',
    profesor: 'Prof. Elena Soto',
  },
];

export const MOCK_OBSERVACIONES_RESUMEN = { total: 12, positivas: 4, alertas: 2 };

export const MOCK_ALUMNO_NOTIFICACIONES: Notificacion[] = [
  {
    id: '1',
    titulo: 'Nueva Calificación Cargada',
    mensaje:
      'El Prof. Damián Ramírez ha cargado la nota del Examen de Matemáticas II: 9 (Aprobado).',
    tiempo: 'Hace 5 min',
    urgente: false,
    icono: 'assignment',
    iconoColor: '#386A20',
    leido: false,
    accion: { label: 'Ver boletín' },
  },
  {
    id: '2',
    titulo: 'Aviso Urgente: Circular Fin de Mes',
    mensaje:
      'Se encuentra disponible la circular informativa sobre el receso invernal y entrega de libretas.',
    tiempo: 'Hace 2 horas',
    urgente: true,
    icono: 'warning',
    iconoColor: '#B3261E',
    leido: false,
    accion: { label: 'Ver Circular' },
  },
  {
    id: '3',
    titulo: 'Clase Suspendida',
    mensaje:
      'La clase de Física I de mañana a las 10:45 hs ha sido suspendida por refacciones en el laboratorio.',
    tiempo: 'Hace 1 día',
    urgente: false,
    icono: 'event-busy',
    iconoColor: '#6750A4',
    leido: false,
  },
];

export type BoletinItem = {
  id: string;
  materia: string;
  profesor: string;
  promedio: number;
  trimestres: { trimestre: number; nota: number | string }[];
};

export const MOCK_BOLETIN: BoletinItem[] = [
  {
    id: '1',
    materia: 'Matemáticas Avanzadas',
    profesor: 'Prof. Ricardo Méndez',
    promedio: 9.0,
    trimestres: [
      { trimestre: 1, nota: 8.5 },
      { trimestre: 2, nota: 9.2 },
      { trimestre: 3, nota: 9.3 },
    ],
  },
  {
    id: '2',
    materia: 'Física Cuántica',
    profesor: 'Prof. Elena Martínez',
    promedio: 5.8,
    trimestres: [
      { trimestre: 1, nota: 6.0 },
      { trimestre: 2, nota: 5.5 },
      { trimestre: 3, nota: 6.0 },
    ],
  },
  {
    id: '3',
    materia: 'Literatura Universal',
    profesor: 'Prof. Carlos Fuentes',
    promedio: 8.5,
    trimestres: [
      { trimestre: 1, nota: 8.0 },
      { trimestre: 2, nota: 8.5 },
      { trimestre: 3, nota: 9.0 },
    ],
  },
  {
    id: '4',
    materia: 'Historia del Arte',
    profesor: 'Dra. Sofía Ortega',
    promedio: 7.8,
    trimestres: [
      { trimestre: 1, nota: 7.5 },
      { trimestre: 2, nota: 8.0 },
      { trimestre: 3, nota: 7.8 },
    ],
  },
  {
    id: '5',
    materia: 'Biología Celular',
    profesor: 'Prof. Juan Valdés',
    promedio: 6.5,
    trimestres: [
      { trimestre: 1, nota: 6.0 },
      { trimestre: 2, nota: 6.5 },
      { trimestre: 3, nota: 7.0 },
    ],
  },
];

export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

export type HorarioItem = {
  id: string;
  type: 'class' | 'break';
  materia?: string;
  aula?: string;
  profesor?: string;
  horaInicio: string;
  horaFin: string;
  activo?: boolean;
  title?: string;
};

export const MOCK_HORARIO: HorarioItem[] = [
  {
    id: '1',
    type: 'class',
    materia: 'Matemáticas Avanzadas',
    aula: 'Aula 102 - Edificio B',
    profesor: 'Prof. Alejandro Vargas',
    horaInicio: '08:00',
    horaFin: '09:30',
    activo: true,
  },
  {
    id: '2',
    type: 'class',
    materia: 'Física Aplicada',
    aula: 'Laboratorio 3',
    profesor: 'Dra. Elena Martínez',
    horaInicio: '10:00',
    horaFin: '11:30',
  },
  {
    id: '3',
    type: 'class',
    materia: 'Historia Universal',
    aula: 'Aula 205',
    profesor: 'Lic. Ricardo Solís',
    horaInicio: '11:45',
    horaFin: '13:15',
  },
  {
    id: '4',
    type: 'break',
    title: 'Receso de Almuerzo',
    horaInicio: '13:15',
    horaFin: '14:15',
  },
  {
    id: '5',
    type: 'class',
    materia: 'Programación I',
    aula: 'Sala de Cómputo A',
    profesor: 'Ing. Claudia Ruiz',
    horaInicio: '14:15',
    horaFin: '15:45',
  },
];

export type FaltaItem = {
  id: string;
  fecha: string;
  motivo: string;
  justificada: boolean;
};

export const MOCK_FALTAS: FaltaItem[] = [
  { id: '1', fecha: '14 de Octubre, 2023', motivo: 'Sin motivo registrado', justificada: false },
  { id: '2', fecha: '02 de Octubre, 2023', motivo: 'Cita Médica', justificada: true },
  { id: '3', fecha: '25 de Septiembre, 2023', motivo: 'Competencia deportiva', justificada: true },
  { id: '4', fecha: '12 de Septiembre, 2023', motivo: 'Llegada tarde extrema', justificada: false },
];

export const MOCK_ASISTENCIA_STATS = { presentes: 164, ausentes: 8, justificadas: 4 };
