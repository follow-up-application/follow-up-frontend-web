import { BookOpen, HelpCircle, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel, type ProfileMenuItem } from '@/components/layout/ProfilePanel';
import { useSession } from '@/context/useSession';
import { iniciales, nombreCompleto } from '@/utils/session';

export default function AlumnoPerfilPage() {
  const navigate = useNavigate();
  const { session, logout } = useSession();

  const metricas = [
    { id: '1', label: 'Materias', value: '12' },
    { id: '2', label: 'Promedio', value: '8.2' },
    { id: '3', label: 'Asist. Prom.', value: '92%' },
  ];

  const menuItems: ProfileMenuItem[] = [
    {
      id: '1',
      label: 'Datos del Alumno',
      sublabel: 'Matrícula, legajo, división académica',
      icon: BookOpen as LucideIcon,
    },
    {
      id: '2',
      label: 'Datos de Tutor Responsable',
      sublabel: 'Contacto de tutores registrados',
      icon: Users,
    },
    {
      id: '3',
      label: 'Centro de Soporte',
      sublabel: 'Ayuda y preguntas del portal',
      icon: HelpCircle,
    },
  ];

  return (
    <ProfilePanel
      nombre={session ? nombreCompleto(session) : ''}
      rol="Alumno - 4to Año B"
      avatarInicial={session ? iniciales(session) : ''}
      metricas={metricas}
      menuItems={menuItems}
      onLogout={() => {
        logout();
        navigate('/login', { replace: true });
      }}
      headerExtra={
        <span className="badge gap-1 bg-success/10 text-success">
          <TrendingUp className="size-3" aria-hidden />
          Buen desempeño
        </span>
      }
    />
  );
}
