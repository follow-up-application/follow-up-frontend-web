import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FullScreenLoader, RequireAuth } from '@/components/layout/RequireAuth';
import { RoleRoutes } from '@/components/layout/AppShell';
import { SessionProvider } from '@/context/SessionContext';
import type { UserRole } from '@/types/session';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ValidarCodigoPage = lazy(() => import('@/pages/auth/ValidarCodigoPage'));
const RecuperarPasswordPage = lazy(() => import('@/pages/auth/RecuperarPasswordPage'));

const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminAlumnos = lazy(() => import('@/pages/admin/AlumnosListPage'));
const AdminNuevoAlumno = lazy(() => import('@/pages/admin/NuevoAlumnoPage'));
const AdminDocentes = lazy(() => import('@/pages/admin/DocentesListPage'));
const AdminNuevoDocente = lazy(() => import('@/pages/admin/NuevoDocentePage'));
const AdminNuevoCurso = lazy(() => import('@/pages/admin/NuevoCursoPage'));
const AdminNuevaMateria = lazy(() => import('@/pages/admin/NuevaMateriaPage'));
const AdminVerificarApi = lazy(() => import('@/pages/admin/VerificarApiPage'));

const DocenteDashboard = lazy(() => import('@/pages/docente/DashboardPage'));
const DocenteMaterias = lazy(() => import('@/pages/docente/MateriasPage'));
const DocenteMateriaDetalle = lazy(() => import('@/pages/docente/MateriaDetallePage'));
const DocenteAsistencia = lazy(() => import('@/pages/docente/AsistenciaPage'));
const DocenteNotas = lazy(() => import('@/pages/docente/NotasPage'));
const DocenteNuevoAviso = lazy(() => import('@/pages/docente/NuevoAvisoPage'));
const DocenteObservacion = lazy(() => import('@/pages/docente/ObservacionPage'));
const DocenteAgenda = lazy(() => import('@/pages/docente/AgendaPage'));
const DocenteNotificaciones = lazy(() => import('@/pages/docente/NotificacionesPage'));
const DocentePerfil = lazy(() => import('@/pages/docente/PerfilPage'));

const AlumnoDashboard = lazy(() => import('@/pages/alumno/DashboardPage'));
const AlumnoNotas = lazy(() => import('@/pages/alumno/NotasPage'));
const AlumnoHorarios = lazy(() => import('@/pages/alumno/HorariosPage'));
const AlumnoAsistencia = lazy(() => import('@/pages/alumno/AsistenciaPage'));
const AlumnoObservaciones = lazy(() => import('@/pages/alumno/ObservacionesPage'));
const AlumnoComunicados = lazy(() => import('@/pages/alumno/ComunicadosPage'));
const AlumnoNotificaciones = lazy(() => import('@/pages/alumno/NotificacionesPage'));
const AlumnoPerfil = lazy(() => import('@/pages/alumno/PerfilPage'));

const TutorDashboard = lazy(() => import('@/pages/tutor/DashboardPage'));
const TutorAlumnos = lazy(() => import('@/pages/tutor/AlumnosPage'));
const TutorAgenda = lazy(() => import('@/pages/tutor/AgendaPage'));
const TutorNotas = lazy(() => import('@/pages/tutor/NotasPage'));
const TutorNotificaciones = lazy(() => import('@/pages/tutor/NotificacionesPage'));
const TutorContacto = lazy(() => import('@/pages/tutor/ContactoPage'));
const TutorPerfil = lazy(() => import('@/pages/tutor/PerfilPage'));

function HomeRedirect() {
  return <Navigate to="/login" replace />;
}

function roleElement(role: UserRole) {
  return <RoleRoutes role={role} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
            <Route path="/validar-codigo" element={<ValidarCodigoPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={roleElement('administrador')}>
              <Route index element={<AdminDashboard />} />
              <Route path="alumnos" element={<AdminAlumnos />} />
              <Route path="alumnos/nuevo" element={<AdminNuevoAlumno />} />
              <Route path="docentes" element={<AdminDocentes />} />
              <Route path="docentes/nuevo" element={<AdminNuevoDocente />} />
              <Route path="cursos/nuevo" element={<AdminNuevoCurso />} />
              <Route path="materias/nuevo" element={<AdminNuevaMateria />} />
              <Route path="verificar-api" element={<AdminVerificarApi />} />
            </Route>

            <Route path="/docente" element={roleElement('docente')}>
              <Route index element={<DocenteDashboard />} />
              <Route path="materias" element={<DocenteMaterias />} />
              <Route path="materias/:id" element={<DocenteMateriaDetalle />} />
              <Route path="asistencia" element={<DocenteAsistencia />} />
              <Route path="notas" element={<DocenteNotas />} />
              <Route path="avisos/nuevo" element={<DocenteNuevoAviso />} />
              <Route path="observaciones" element={<DocenteObservacion />} />
              <Route path="agenda" element={<DocenteAgenda />} />
              <Route path="notificaciones" element={<DocenteNotificaciones />} />
              <Route path="perfil" element={<DocentePerfil />} />
            </Route>

            <Route path="/alumno" element={roleElement('alumno')}>
              <Route index element={<AlumnoDashboard />} />
              <Route path="notas" element={<AlumnoNotas />} />
              <Route path="horarios" element={<AlumnoHorarios />} />
              <Route path="asistencia" element={<AlumnoAsistencia />} />
              <Route path="observaciones" element={<AlumnoObservaciones />} />
              <Route path="comunicados" element={<AlumnoComunicados />} />
              <Route path="comunicados/:id" element={<AlumnoComunicados />} />
              <Route path="notificaciones" element={<AlumnoNotificaciones />} />
              <Route path="perfil" element={<AlumnoPerfil />} />
            </Route>

            <Route path="/tutor" element={roleElement('tutor')}>
              <Route index element={<TutorDashboard />} />
              <Route path="alumnos" element={<TutorAlumnos />} />
              <Route path="agenda" element={<TutorAgenda />} />
              <Route path="notas" element={<TutorNotas />} />
              <Route path="notificaciones" element={<TutorNotificaciones />} />
              <Route path="contacto" element={<TutorContacto />} />
              <Route path="perfil" element={<TutorPerfil />} />
            </Route>

            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </Suspense>
      </SessionProvider>
    </BrowserRouter>
  );
}

export { RequireAuth };
