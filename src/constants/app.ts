export const COLORS = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  neutral: '#1C1B1F',
  background: '#FDFBFF',
  surface: '#F4F3F7',
  surfaceVariant: '#E7E0EC',
  border: '#CAC4D0',
  outline: '#79747E',
  white: '#FFFFFF',
  error: '#B3261E',
  success: '#137333',
  onPrimary: '#FFFFFF',
  onSurface: '#1C1B1F',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  administrador: 'Administrador',
  docente: 'Docente',
  alumno: 'Alumno',
  tutor: 'Tutor',
};

export const ROLE_HOME: Record<string, string> = {
  administrador: '/admin',
  docente: '/docente',
  alumno: '/alumno',
  tutor: '/tutor',
};
