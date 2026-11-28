import { Bell, HelpCircle, Lock, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel, type ProfileMenuItem } from '@/components/layout/ProfilePanel';
import CambiarPasswordModal from '@/components/perfil/CambiarPasswordModal';
import { useSession } from '@/context/useSession';
import { getMe } from '@/services/userService';
import type { MeUser } from '@/types/user';
import { iniciales, nombreCompleto } from '@/utils/session';

export default function DocentePerfilPage() {
  const navigate = useNavigate();
  const { session, logout } = useSession();
  const [user, setUser] = useState<MeUser | null>(null);
  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);
  const [toastPassword, setToastPassword] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  const metricas = [
    { id: '1', label: 'Cursos', value: '4' },
    { id: '2', label: 'Alumnos', value: '98' },
    { id: '3', label: 'Asist. Prom.', value: '94%' },
  ];

  const nombreMostrar = user
    ? `Prof. ${user.firstName} ${user.lastName}`
    : session
    ? `Prof. ${nombreCompleto(session)}`
    : 'Docente';

  const avatar = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : session
    ? iniciales(session)
    : 'DOC';

  const menuItems: ProfileMenuItem[] = [
    {
      id: '1',
      label: 'Mis Datos Personales',
      sublabel: user ? `ID: ${user.id} • Rol: ${user.role}` : 'Email, teléfono, rol',
      icon: UserRound,
    },
    {
      id: '2',
      label: 'Configuración de Alertas',
      sublabel: 'Gestionar notificaciones institucionales',
      icon: Bell,
    },
    {
      id: '3',
      label: 'Seguridad y Privacidad',
      sublabel: 'Actualizar contraseña de acceso',
      icon: Lock,
      onClick: () => setModalPasswordAbierto(true),
    },
    {
      id: '4',
      label: 'Centro de Soporte',
      sublabel: 'Ayuda y preguntas frecuentes',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="space-y-4">
      {toastPassword && (
        <div className="mx-auto max-w-3xl p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          Tu contraseña se actualizó correctamente.
        </div>
      )}

      <ProfilePanel
        nombre={nombreMostrar}
        rol="Docente Institucional"
        avatarInicial={avatar}
        metricas={metricas}
        menuItems={menuItems}
        onLogout={async () => {
          await logout();
          navigate('/login', { replace: true });
        }}
      />

      <CambiarPasswordModal
        isOpen={modalPasswordAbierto}
        onClose={() => setModalPasswordAbierto(false)}
        onPasswordChanged={() => {
          setToastPassword(true);
          setTimeout(() => setToastPassword(false), 4000);
        }}
      />
    </div>
  );
}
