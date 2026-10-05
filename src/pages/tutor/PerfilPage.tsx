import { Bell, HelpCircle, Lock, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel, type ProfileMenuItem } from '@/components/layout/ProfilePanel';
import { useSession } from '@/context/useSession';
import { iniciales, nombreCompleto } from '@/utils/session';

export default function TutorPerfilPage() {
  const navigate = useNavigate();
  const { session, logout } = useSession();

  const metricas = [
    { id: '1', label: 'Alumnos', value: '5' },
    { id: '2', label: 'Inasist.', value: '0' },
    { id: '3', label: 'Promedio', value: '8.5' },
  ];

  const menuItems: ProfileMenuItem[] = [
    {
      id: '1',
      label: 'Mis Datos Personales',
      sublabel: 'Email, teléfono, dirección',
      icon: UserRound,
    },
    {
      id: '2',
      label: 'Configuración de Alertas',
      sublabel: 'Alertas de notas, faltas, comunicados',
      icon: Bell,
    },
    {
      id: '3',
      label: 'Seguridad y Privacidad',
      sublabel: 'Cambiar contraseña',
      icon: Lock,
    },
    { id: '4', label: 'Centro de Soporte', sublabel: 'Ayuda y preguntas frecuentes', icon: HelpCircle },
  ];

  return (
    <ProfilePanel
      nombre={session ? nombreCompleto(session) : 'María González'}
      rol="Tutor Responsable"
      avatarInicial={session ? iniciales(session) : 'MG'}
      metricas={metricas}
      menuItems={menuItems}
      onLogout={() => {
        logout();
        navigate('/login', { replace: true });
      }}
    />
  );
}
