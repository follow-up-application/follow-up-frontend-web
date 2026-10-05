import { Save, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader, SelectInput } from '@/components/ui';
import { DIVISIONES_CURSO, GRADOS, TURNOS } from '@/data/admin';
import { crearCursoDivisionTurno } from '@/services/alumnoService';

export default function NuevoCursoPage() {
  const navigate = useNavigate();

  const [grado, setGrado] = useState('');
  const [division, setDivision] = useState('');
  const [turno, setTurno] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [errores, setErrores] = useState({ grado: '', division: '', turno: '', capacidad: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    const nuevos = { grado: '', division: '', turno: '', capacidad: '' };

    if (!grado) nuevos.grado = 'Seleccioná un grado';
    if (!division) nuevos.division = 'Seleccioná una división';
    if (!turno) nuevos.turno = 'Seleccioná un turno';

    if (!capacidad.trim()) {
      nuevos.capacidad = 'La capacidad es requerida';
    } else if (!/^\d+$/.test(capacidad.trim()) || Number(capacidad) < 1) {
      nuevos.capacidad = 'Ingresá un número mayor a 0';
    }

    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;

    setSaving(true);

    try {
      await crearCursoDivisionTurno({
        curso: Number(grado),
        division,
        turno,
        capacidad_maxima: Number(capacidad),
      });
      navigate('/admin', { replace: true });
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : 'No se pudo crear el curso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Cargar Curso / División"
        subtitle="Información académica para registrar una nueva división"
      />

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {errorGeneral ? <Alert message={errorGeneral} /> : null}

        <div className="grid gap-x-4 sm:grid-cols-2">
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
              options={DIVISIONES_CURSO}
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

          <FormField label="Capacidad máxima" errorMessage={errores.capacidad} required>
            <Input
              placeholder="30"
              inputMode="numeric"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              error={Boolean(errores.capacidad)}
              disabled={saving}
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            title="Cancelar"
            variant="outline"
            onClick={() => navigate('/admin')}
            icon={<X className="size-4" aria-hidden />}
          />
          <Button
            type="submit"
            title="Guardar curso"
            loading={saving}
            icon={<Save className="size-4" aria-hidden />}
          />
        </div>
      </form>
    </div>
  );
}
