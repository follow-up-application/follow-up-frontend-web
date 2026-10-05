import { Bell, HelpCircle, Lock, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel, type ProfileMenuItem } from '@/components/layout/ProfilePanel';
import { useSession } from '@/context/useSession';
import { iniciales, nombreCompleto } from '@/utils/session';

export default function DocentePerfilPage() {
  const navigate = useNavigate();
  const { session, logout } = useSession();

  const metricas = [
    { id: '1', label: 'Cursos', value: '4' },
    { id: '2', label: 'Alumnos', value: '98' },
    { id: '3', label: 'Asist. Prom.', value: '94%' },
  ];

  const menuItems: ProfileMenuItem[] = [
    { id: '1', label: 'Mis Datos Personales', sublabel: 'Email, teléfono, dirección', icon: UserRound },
    {
      id: '2',
      label: 'Configuración de Alertas',
      sublabel: 'Gestionar notificaciones push',
      icon: Bell,
    },
    { id: '3', label: 'Seguridad y Privacidad', sublabel: 'Cambiar contraseña', icon: Lock },
    { id: '4', label: 'Centro de Soporte', sublabel: 'Ayuda y preguntas frecuentes', icon: HelpCircle },
  ];

  return (
    <ProfilePanel
      nombre={session ? nombreCompleto(session) : 'Prof. Damián Ramírez'}
      rol="Docente de Ciencias Exactas"
      avatarInicial={session ? iniciales(session) : 'DR'}
      metricas={metricas}
      menuItems={menuItems}
      onLogout={() => {
        logout();
        navigate('/login', { replace: true });
      }}
    />
  );
}
