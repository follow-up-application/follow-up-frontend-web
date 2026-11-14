import { Save, Search, UserRound, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader, SelectInput } from '@/components/ui';
import { OPCIONES_PARENTESCO } from '@/data/admin';
import { buscarTutorPorDni, crearAlumno, getCursosDivisionTurno } from '@/services/alumnoService';
import type { CreateAlumnoRequest, CursoDivisionTurno, TutorAlumnoRelation } from '@/types/alumno';
import { esDniValido } from '@/utils/validations';

const FECHA_REGEX = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;

function fechaAIso(fecha: string): string {
  const [, dd, mm, yyyy] = fecha.match(FECHA_REGEX) ?? [];
  return `${yyyy}-${mm}-${dd}`;
}

function esFechaValida(fecha: string): boolean {
  const match = fecha.match(FECHA_REGEX);
  if (!match) return false;

  const [, dd, mm, yyyy] = match;
  const dia = Number(dd);
  const mes = Number(mm);
  const anio = Number(yyyy);

  const fechaObj = new Date(anio, mes, dia);
  
  return (
    fechaObj.getFullYear() === anio &&
    fechaObj.getMonth() === mes &&
    fechaObj.getDate() === dia
  );
}

type Errores = Partial<Record<string, string>>;

export default function NuevoAlumnoPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cursoId, setCursoId] = useState('');

  const [cursos, setCursos] = useState<CursoDivisionTurno[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [errorCursos, setErrorCursos] = useState('');

  const [tutorDni, setTutorDni] = useState('');
  const [tutorFirstName, setTutorFirstName] = useState('');
  const [tutorLastName, setTutorLastName] = useState('');
  const [tutorTelephone, setTutorTelephone] = useState('');
  const [tutorEncontrado, setTutorEncontrado] = useState(false);
  const [tutorBuscado, setTutorBuscado] = useState(false);
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [errorTutor, setErrorTutor] = useState('');

  const [relationship, setRelationship] = useState<TutorAlumnoRelation | ''>('');
  const [otraRelacion, setOtraRelacion] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [errores, setErrores] = useState<Errores>({});

  useEffect(() => {
    getCursosDivisionTurno()
      .then(setCursos)
      .catch(() => {
        setErrorCursos('No se pudieron cargar los cursos.');
      })
      .finally(() => setLoadingCursos(false));
  }, []);

  const limpiarDatosTutor = () => {
    setTutorFirstName('');
    setTutorLastName('');
    setTutorTelephone('');
    setTutorEncontrado(false);
  };

  const handleBuscarTutor = async () => {
    setErrorTutor('');

    if (!tutorDni.trim()) {
      setErrores((prev) => ({ ...prev, tutorDni: 'Ingresá el DNI del tutor' }));
      return;
    }

    setErrores((prev) => ({ ...prev, tutorDni: undefined }));
    setLoadingTutor(true);
    setTutorBuscado(false);

    try {
      const tutor = await buscarTutorPorDni(tutorDni.trim());

      if (tutor) {
        setTutorFirstName(tutor.first_name);
        setTutorLastName(tutor.last_name);
        setTutorTelephone(tutor.telephone);
        setTutorEncontrado(true);
      } else {
        limpiarDatosTutor();
        setTutorEncontrado(false);
      }

      setTutorBuscado(true);
    } catch {
      setErrorTutor('Error al buscar el tutor. Intentá nuevamente.');
      limpiarDatosTutor();
    } finally {
      setLoadingTutor(false);
    }
  };

  const handleChangeTutorDni = (value: string) => {
    setTutorDni(value);
    if (tutorBuscado) {
      setTutorBuscado(false);
      setTutorEncontrado(false);
      limpiarDatosTutor();
    }
  };

  const validar = (): boolean => {
    const nuevos: Errores = {};

    if (!firstName.trim()) nuevos.firstName = 'El nombre es requerido';
    if (!lastName.trim()) nuevos.lastName = 'El apellido es requerido';

    if (!dni.trim()) {
      nuevos.dni = 'El DNI es requerido';
    } else if (!/^\d+$/.test(dni.trim())) {
      nuevos.dni = 'El DNI debe ser numérico';
    }

    if (!fechaNacimiento.trim()) {
      nuevos.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else if (!esFechaValida(fechaNacimiento.trim())) {
      nuevos.fechaNacimiento = 'Formato esperado: DD/MM/AAAA';
    }

    if (!cursoId) nuevos.curso = 'Seleccioná un curso';

    if (!tutorDni.trim()) {
      nuevos.tutorDni = 'El DNI del tutor es requerido';
    } else if (!esDniValido(tutorDni.trim())) {
      nuevos.tutorDni = 'El DNI del tutor debe tener entre 7 y 8 números';
    }

    if (!tutorEncontrado) {
      if (!tutorFirstName.trim()) nuevos.tutorFirstName = 'El nombre del tutor es requerido';
      if (!tutorLastName.trim()) nuevos.tutorLastName = 'El apellido del tutor es requerido';
    }

    if (!relationship) {
      nuevos.relationship = 'Seleccioná el parentesco';
    } else if (relationship === 'otra' && !otraRelacion.trim()) {
      nuevos.otraRelacion = 'Especificá la relación';
    }

    setErrores(nuevos);
    return Object.values(nuevos).every((v) => !v);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    if (!validar()) return;

    const request: CreateAlumnoRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dni: Number(dni.trim()),
      fechaNacimiento: fechaAIso(fechaNacimiento.trim()),
      cursoDivisionTurnoId: Number(cursoId),
      relationship: relationship as TutorAlumnoRelation,
      otraRelacion: relationship === 'otra' ? otraRelacion.trim() : null,
      tutorDni: Number(tutorDni.trim()),
      tutorFirstName: tutorEncontrado ? null : tutorFirstName.trim(),
      tutorLastName: tutorEncontrado ? null : tutorLastName.trim(),
      tutorTelephone: tutorEncontrado ? null : tutorTelephone.trim() || null,
    };

    setSaving(true);

    try {
      console.log('Creating alumno with request:', request);
      await crearAlumno(request);
      navigate('/admin/alumnos', { replace: true, state: { creado: true } });
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : 'No fue posible crear el alumno.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Cargar Alumno" subtitle="Alta de alumno y vínculo con su tutor" />

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert message={errorGeneral} /> : null}

        <h2 className="mb-4 text-sm font-extrabold tracking-wider text-secondary uppercase">
          Datos del alumno
        </h2>

        <div className="grid gap-x-4 sm:grid-cols-2">
          <FormField label="Nombre" errorMessage={errores.firstName} required>
            <Input
              icon={UserRound}
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={saving}
              error={Boolean(errores.firstName)}
            />
          </FormField>

          <FormField label="Apellido" errorMessage={errores.lastName} required>
            <Input
              icon={UserRound}
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={saving}
              error={Boolean(errores.lastName)}
            />
          </FormField>

          <FormField label="DNI" errorMessage={errores.dni} required>
            <Input
              placeholder="34825255"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              disabled={saving}
              error={Boolean(errores.dni)}
            />
          </FormField>

          <FormField
            label="Fecha de nacimiento"
            errorMessage={errores.fechaNacimiento}
            hint="Formato DD/MM/AAAA"
            required
          >
            <Input
              placeholder="15/03/2010"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              disabled={saving}
              error={Boolean(errores.fechaNacimiento)}
            />
          </FormField>
        </div>

        <FormField label="Curso / División / Turno" errorMessage={errores.curso} required>
          <SelectInput
            placeholder={loadingCursos ? 'Cargando cursos...' : 'Seleccionar curso...'}
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            options={cursos.map((c) => ({
              value: String(c.id),
              label: `${c.curso}° ${c.division} - ${c.turno}`,
            }))}
            error={Boolean(errores.curso)}
            disabled={loadingCursos}
          />
        </FormField>
        {errorCursos ? <Alert variant="info" message={errorCursos} /> : null}

        <h2 className="mt-2 mb-4 text-sm font-extrabold tracking-wider text-secondary uppercase">
          Datos del tutor
        </h2>

        {errorTutor ? <Alert message={errorTutor} /> : null}

        <FormField label="DNI del tutor" errorMessage={errores.tutorDni} required>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar por DNI"
                inputMode="numeric"
                value={tutorDni}
                onChange={(e) => handleChangeTutorDni(e.target.value)}
                disabled={saving || loadingTutor}
                error={Boolean(errores.tutorDni)}
              />
            </div>
            <Button
              title="Buscar"
              variant="outline"
              onClick={handleBuscarTutor}
              loading={loadingTutor}
              icon={<Search className="size-4" aria-hidden />}
            />
          </div>
        </FormField>

        {tutorBuscado && !tutorEncontrado ? (
          <Alert variant="info" message="No se encontró un tutor con ese DNI. Cargá los datos manualmente." />
        ) : null}

        {tutorEncontrado ? (
          <Alert variant="success" message="Tutor encontrado. Los datos se toman del sistema." />
        ) : null}

        {tutorEncontrado ? (
          <div className="card mb-4 flex flex-col gap-1 bg-surface p-4">
            <p className="font-bold text-neutral">
              {tutorFirstName} {tutorLastName}
            </p>
            <p className="text-sm text-secondary">Teléfono: {tutorTelephone || 'sin especificar'}</p>
          </div>
        ) : (
          <div className="grid gap-x-4 sm:grid-cols-2">
            <FormField label="Nombre del tutor" errorMessage={errores.tutorFirstName} required>
              <Input
                placeholder="Nombre"
                value={tutorFirstName}
                onChange={(e) => setTutorFirstName(e.target.value)}
                disabled={saving}
                error={Boolean(errores.tutorFirstName)}
              />
            </FormField>

            <FormField label="Apellido del tutor" errorMessage={errores.tutorLastName} required>
              <Input
                placeholder="Apellido"
                value={tutorLastName}
                onChange={(e) => setTutorLastName(e.target.value)}
                disabled={saving}
                error={Boolean(errores.tutorLastName)}
              />
            </FormField>

            <FormField label="Teléfono del tutor" hint="Opcional">
              <Input
                placeholder="11 1234-5678"
                value={tutorTelephone}
                onChange={(e) => setTutorTelephone(e.target.value)}
                disabled={saving}
              />
            </FormField>
          </div>
        )}

        <h2 className="mt-2 mb-4 text-sm font-extrabold tracking-wider text-secondary uppercase">
          Relación
        </h2>

        <FormField label="Parentesco" errorMessage={errores.relationship} required>
          <SelectInput
            placeholder="Seleccionar parentesco..."
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as TutorAlumnoRelation)}
            options={OPCIONES_PARENTESCO}
            error={Boolean(errores.relationship)}
            disabled={saving}
          />
        </FormField>

        {relationship === 'otra' ? (
          <FormField label="Especificar relación" errorMessage={errores.otraRelacion} required>
            <Input
              placeholder="Ej: abuela, tío"
              value={otraRelacion}
              onChange={(e) => setOtraRelacion(e.target.value)}
              disabled={saving}
              error={Boolean(errores.otraRelacion)}
            />
          </FormField>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            title="Cancelar"
            variant="outline"
            onClick={() => navigate('/admin/alumnos')}
            icon={<X className="size-4" aria-hidden />}
          />
          <Button
            type="submit"
            title="Guardar alumno"
            loading={saving}
            icon={<Save className="size-4" aria-hidden />}
          />
        </div>
      </form>
    </div>
  );
}
