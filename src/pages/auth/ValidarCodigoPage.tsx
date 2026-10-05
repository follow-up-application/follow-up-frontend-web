import { CheckCircle2, QrCode } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { ApiError } from '@/services/apiClient';
import { validarCodigo, type AlumnoValidado } from '@/services/authService';

export default function ValidarCodigoPage() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [errorCodigo, setErrorCodigo] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [alumno, setAlumno] = useState<AlumnoValidado | null>(null);

  const handleValidar = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');
    setAlumno(null);

    if (!codigo.trim()) {
      setErrorCodigo('El código institucional es requerido');
      return;
    }

    setErrorCodigo('');
    setLoading(true);

    try {
      const data = await validarCodigo(codigo);
      setAlumno(data);
    } catch (error) {
      setErrorGeneral(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error al validar el código. Intenta nuevamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (!alumno) return;
    navigate('/register', {
      state: {
        codigoInstitucional: codigo.trim(),
        alumnoNombre: `${alumno.first_name} ${alumno.last_name}`,
        alumnoDni: String(alumno.dni),
        alumnoCursoDivision: alumno.curso_division,
        alumnoFechaNacimiento: alumno.fecha_nacimiento,
      },
    });
  };

  return (
    <AuthLayout showBack onBack={() => navigate(-1)}>
      <p className="mb-6 text-center text-sm leading-relaxed text-secondary">
        Ingresá el código institucional que te entregó la escuela para vincularte con el alumno.
      </p>

      <form onSubmit={handleValidar} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert message={errorGeneral} /> : null}

        <h2 className="mb-6 text-2xl font-bold text-neutral">Validar Código</h2>

        <FormField label="Código institucional" errorMessage={errorCodigo}>
          <Input
            icon={QrCode}
            placeholder="Ej: A1B2C3"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase());
              setAlumno(null);
            }}
            autoComplete="off"
            disabled={loading}
            error={Boolean(errorCodigo)}
          />
        </FormField>

        <Button type="submit" title={loading ? 'Validando...' : 'Validar'} loading={loading} fullWidth />

        {alumno ? (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" aria-hidden />
              <span className="text-xs font-bold text-primary">Alumno encontrado</span>
            </div>
            <p className="text-lg font-bold text-neutral">
              {alumno.first_name} {alumno.last_name}
            </p>
            <p className="text-sm text-secondary">{alumno.curso_division}</p>
            <Button title="Continuar" onClick={handleContinuar} fullWidth className="mt-4" />
          </div>
        ) : null}
      </form>

      <p className="mt-6 text-center text-xs text-outline">
        El registro habilita el seguimiento del alumno. ¿Ya tenés cuenta?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="cursor-pointer font-bold text-primary hover:underline"
        >
          Iniciá sesión
        </button>
      </p>
    </AuthLayout>
  );
}
