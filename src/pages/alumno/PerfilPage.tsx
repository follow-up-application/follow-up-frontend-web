import {
  BookOpen,
  HelpCircle,
  Lock,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfilePanel, type ProfileMenuItem } from '@/components/layout/ProfilePanel';
import CambiarPasswordModal from '@/components/perfil/CambiarPasswordModal';
import { useSession } from '@/context/useSession';
import { getMe } from '@/services/userService';
import type { MeUser } from '@/types/user';
import { iniciales, nombreCompleto } from '@/utils/session';

export default function AlumnoPerfilPage() {
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
    { id: '1', label: 'Materias', value: '12' },
    { id: '2', label: 'Promedio', value: '8.2' },
    { id: '3', label: 'Asist. Prom.', value: '92%' },
  ];

  const nombreMostrar = user
    ? `${user.firstName} ${user.lastName}`
    : session
    ? nombreCompleto(session)
    : 'Alumno';

  const avatar = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : session
    ? iniciales(session)
    : 'AL';

  const menuItems: ProfileMenuItem[] = [
    {
      id: '1',
      label: 'Datos del Alumno',
      sublabel: user ? `Legajo / ID: ${user.id}` : 'Matrícula, legajo, división académica',
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
      label: 'Seguridad y Privacidad',
      sublabel: 'Cambiar contraseña de acceso',
      icon: Lock,
      onClick: () => setModalPasswordAbierto(true),
    },
    {
      id: '4',
      label: 'Centro de Soporte',
      sublabel: 'Ayuda y preguntas del portal',
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
        rol="Alumno Regular"
        avatarInicial={avatar}
        metricas={metricas}
        menuItems={menuItems}
        onLogout={async () => {
          await logout();
          navigate('/login', { replace: true });
        }}
        headerExtra={
          <span className="badge gap-1 bg-success/10 text-success">
            <TrendingUp className="size-3" aria-hidden />
            Alumno regular
          </span>
        }
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
