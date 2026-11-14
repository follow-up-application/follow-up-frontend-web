import { AlertCircle, Save, UserRound, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader, SelectInput } from '@/components/ui';
import { DIVISIONES_DOCENTE, GRADOS, MATERIAS, TURNOS } from '@/data/admin';
import { getCursosDivisionTurno } from '@/services/alumnoService';
import { ApiError } from '@/services/apiClient';
import { crearDocente } from '@/services/docenteService';
import type { CursoDivisionTurno } from '@/types/alumno';
import {
  esDniValido,
  esEmailValido,
  esNombreValido,
  esTelefonoValido,
} from '@/utils/validations';

type Errores = Partial<Record<string, string>>;

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-2 mb-4 flex items-center gap-2 text-sm font-extrabold tracking-wider text-secondary uppercase">
      <UserRound className="size-4" aria-hidden />
      {children}
    </h2>
  );
}

export default function NuevoDocentePage() {
  const navigate = useNavigate();

  const [apellido, setApellido] = useState('');
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [materia, setMateria] = useState('');
  const [grado, setGrado] = useState('');
  const [division, setDivision] = useState('');
  const [turno, setTurno] = useState('');

  const [cursos, setCursos] = useState<CursoDivisionTurno[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState<Errores>({});

  useEffect(() => {
    getCursosDivisionTurno()
      .then(setCursos)
      .catch(() => {});
  }, []);

  const faltantes: string[] = [];
  if (!apellido || !nombre || !dni || !email || !telefono || !materia || !grado || !division || !turno) {
    faltantes.push('Faltan completar campos obligatorios');
  }
  if (apellido && !esNombreValido(apellido)) faltantes.push('El apellido solo puede contener letras');
  if (nombre && !esNombreValido(nombre)) faltantes.push('El nombre solo puede contener letras');
  if (dni && !esDniValido(dni)) faltantes.push('El DNI debe tener entre 7 y 8 números');
  if (email && !esEmailValido(email)) faltantes.push('El correo no tiene un formato válido');
  if (telefono && !esTelefonoValido(telefono)) faltantes.push('El teléfono tiene un formato inválido');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    if (faltantes.length > 0) {
      setErrores({
        apellido: !apellido ? 'Requerido' : esNombreValido(apellido) ? '' : 'Solo letras',
        nombre: !nombre ? 'Requerido' : esNombreValido(nombre) ? '' : 'Solo letras',
        dni: !dni ? 'Requerido' : esDniValido(dni) ? '' : 'Debe tener 7 u 8 números',
        email: !email ? 'Requerido' : esEmailValido(email) ? '' : 'Formato inválido',
        telefono: !telefono ? 'Requerido' : esTelefonoValido(telefono) ? '' : 'Formato inválido',
        materia: !materia ? 'Seleccioná una materia' : '',
        grado: !grado ? 'Seleccioná un grado' : '',
        division: !division ? 'Seleccioná una división' : '',
        turno: !turno ? 'Seleccioná un turno' : '',
      });
      return;
    }

    setErrores({});
    setSaving(true);

    try {
      const cdtCoincidente = cursos.find(
        (c) =>
          String(c.curso) === String(grado) &&
          c.division.toUpperCase() === division.toUpperCase() &&
          c.turno.toLowerCase() === turno.toLowerCase(),
      );
      const cursoDivisionTurnoId = cdtCoincidente ? cdtCoincidente.id : (cursos[0]?.id ?? 1);
      const fechaHoy = new Date().toISOString().split('T')[0];

      await crearDocente({
        first_name: nombre.trim(),
        last_name: apellido.trim(),
        dni: Number(dni.trim()),
        telephone: telefono.trim(),
        fecha_ingreso: fechaHoy,
        curso_division_turno_id: cursoDivisionTurnoId,
      });

      navigate('/admin/docentes', { replace: true });
    } catch (err) {
      setErrorGeneral(
        err instanceof ApiError
          ? err.message
          : 'Ocurrió un error al guardar el docente en la base de datos.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Cargar Docente" subtitle="Alta de docente y asignación de materia" />

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert variant="error" message={errorGeneral} className="mb-4" /> : null}

        {faltantes.length > 0 ? (
          <Alert
            variant="info"
            message={faltantes.join('. ')}
            className="items-start mb-4"
          />
        ) : null}

        <SectionTitle>Información personal</SectionTitle>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Apellido" errorMessage={errores.apellido} required>
            <Input
              placeholder="Ej: González"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              disabled={saving}
              error={Boolean(errores.apellido)}
            />
          </FormField>

          <FormField label="Nombre" errorMessage={errores.nombre} required>
            <Input
              placeholder="Ej: María"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={saving}
              error={Boolean(errores.nombre)}
            />
          </FormField>

          <FormField label="DNI / Identificación" errorMessage={errores.dni} required>
            <Input
              placeholder="Ej: 30123456"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              disabled={saving}
              error={Boolean(errores.dni)}
            />
          </FormField>

          <FormField label="Correo electrónico" errorMessage={errores.email} required>
            <Input
              type="email"
              placeholder="nombre@escuela.edu.ar"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              error={Boolean(errores.email)}
            />
          </FormField>

          <FormField label="Teléfono" errorMessage={errores.telefono} required>
            <Input
              placeholder="11 1234-5678"
              inputMode="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              disabled={saving}
              error={Boolean(errores.telefono)}
            />
          </FormField>
        </div>

        <SectionTitle>Asignación académica</SectionTitle>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Materia" errorMessage={errores.materia} required>
            <SelectInput
              placeholder="Seleccionar materia..."
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              options={MATERIAS}
              error={Boolean(errores.materia)}
              disabled={saving}
            />
          </FormField>

          <FormField label="Grado / Año" errorMessage={errores.grado} required>
            <SelectInput
              placeholder="Seleccionar grado..."
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              options={GRADOS}
              error={Boolean(errores.grado)}
              disabled={saving}
            />
          </FormField>

          <FormField label="División" errorMessage={errores.division} required>
            <SelectInput
              placeholder="Seleccionar división..."
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              options={DIVISIONES_DOCENTE}
              error={Boolean(errores.division)}
              disabled={saving}
            />
          </FormField>

          <FormField label="Turno" errorMessage={errores.turno} required>
            <SelectInput
              placeholder="Seleccionar turno..."
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              options={TURNOS}
              error={Boolean(errores.turno)}
              disabled={saving}
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            title="Cancelar"
            variant="outline"
            onClick={() => navigate('/admin/docentes')}
            icon={<X className="size-4" aria-hidden />}
          />
          <Button
            type="submit"
            title="Guardar docente"
            loading={saving}
            icon={<Save className="size-4" aria-hidden />}
          />
        </div>
      </form>

      <p className="mt-4 flex items-center gap-2 text-xs text-outline">
        <AlertCircle className="size-3.5" aria-hidden />
        El docente recibirá un código de acceso para completar su registro.
      </p>
    </div>
  );
}
