import { BookOpen, Save, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader, SelectInput } from '@/components/ui';
import { getCursosDivisionTurno } from '@/services/alumnoService';
import { ApiError } from '@/services/apiClient';
import { getDocentes, type DocenteApi } from '@/services/docenteService';
import { crearMateria } from '@/services/materiaService';
import type { CursoDivisionTurno } from '@/types/alumno';

export default function NuevaMateriaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [docenteId, setDocenteId] = useState('');

  const [cursos, setCursos] = useState<CursoDivisionTurno[]>([]);
  const [docentes, setDocentes] = useState<DocenteApi[]>([]);
  const [loadingDatos, setLoadingDatos] = useState(true);

  const [errores, setErrores] = useState({
    nombre: '',
    cursoId: '',
    docenteId: '',
  });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [saving, setSaving] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    Promise.all([getCursosDivisionTurno(), getDocentes()])
      .then(([cursosData, docentesData]) => {
        setCursos(cursosData);
        setDocentes(docentesData);
      })
      .catch(() => {
        setErrorGeneral('No se pudieron cargar los datos necesarios para registrar la materia.');
      })
      .finally(() => setLoadingDatos(false));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    const nuevos = {
      nombre: '',
      cursoId: '',
      docenteId: '',
    };

    if (!nombre.trim()) {
      nuevos.nombre = 'El nombre de la materia es requerido';
    } else if (nombre.trim().length < 3) {
      nuevos.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!cursoId) {
      nuevos.cursoId = 'Seleccioná un curso para la materia';
    }

    if (!docenteId) {
      nuevos.docenteId = 'Seleccioná el docente a cargo';
    }

    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;

    setSaving(true);

    try {
      await crearMateria({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || `Materia de ${nombre.trim()}`,
        curso_division_turno_id: Number(cursoId),
        docente_id: docenteId,
      });
      setGuardado(true);
    } catch (error) {
      setErrorGeneral(
        error instanceof ApiError
          ? error.message
          : 'Ocurrió un error al registrar la materia en la base de datos.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (guardado) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Cargar Materia" />
        <div className="card p-8 text-center">
          <Alert variant="success" message="Materia registrada correctamente en la base de datos" className="justify-center" />
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button
              title="Cargar otra"
              variant="outline"
              onClick={() => {
                setGuardado(false);
                setNombre('');
                setDescripcion('');
                setCursoId('');
                setDocenteId('');
              }}
              icon={<BookOpen className="size-4" aria-hidden />}
            />
            <Button title="Volver al panel" onClick={() => navigate('/admin')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Cargar Materia" subtitle="Registro de materias disponibles en la escuela" />

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4" noValidate>
        {errorGeneral ? <Alert variant="error" message={errorGeneral} /> : null}

        <FormField label="Nombre de la materia" errorMessage={errores.nombre} required>
          <Input
            icon={BookOpen}
            placeholder="Ej: Matemáticas"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={Boolean(errores.nombre)}
            disabled={saving}
          />
        </FormField>

        <FormField label="Curso / División / Turno" errorMessage={errores.cursoId} required>
          <SelectInput
            placeholder={loadingDatos ? 'Cargando cursos...' : 'Seleccionar curso...'}
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            options={cursos.map((c) => ({
              value: String(c.id),
              label: `${c.curso}° "${c.division}" — Turno ${c.turno}`,
            }))}
            error={Boolean(errores.cursoId)}
            disabled={loadingDatos || saving}
          />
        </FormField>

        <FormField label="Docente a cargo" errorMessage={errores.docenteId} required>
          <SelectInput
            placeholder={loadingDatos ? 'Cargando docentes...' : 'Seleccionar docente...'}
            value={docenteId}
            onChange={(e) => setDocenteId(e.target.value)}
            options={docentes.map((d) => ({
              value: String(d.id),
              label: `Prof. ${d.first_name} ${d.last_name} (${d.username})`,
            }))}
            error={Boolean(errores.docenteId)}
            disabled={loadingDatos || saving}
          />
        </FormField>

        <FormField label="Descripción" hint="Opcional">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Breve descripción del contenido..."
            disabled={saving}
            className="field-input resize-y"
          />
        </FormField>

        <div className="mt-6 flex flex-wrap justify-end gap-3 pt-4 border-t border-border">
          <Button
            title="Cancelar"
            variant="outline"
            onClick={() => navigate('/admin')}
            icon={<X className="size-4" aria-hidden />}
          />
          <Button
            type="submit"
            title="Guardar materia"
            loading={saving}
            icon={<Save className="size-4" aria-hidden />}
          />
        </div>
      </form>
    </div>
  );
}
