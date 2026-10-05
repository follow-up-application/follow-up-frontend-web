import { BookOpen, Save, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormField, Input, PageHeader } from '@/components/ui';

export default function NuevaMateriaPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [anios, setAnios] = useState('1');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({ nombre: '', anios: '' });
  const [saving, setSaving] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nuevos = { nombre: '', anios: '' };

    if (!nombre.trim()) {
      nuevos.nombre = 'El nombre de la materia es requerido';
    } else if (nombre.trim().length < 3) {
      nuevos.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!anios.trim()) {
      nuevos.anios = 'Indicá cuántos años dura la materia';
    } else if (!/^\d+$/.test(anios.trim()) || Number(anios) < 1) {
      nuevos.anios = 'Ingresá un número mayor a 0';
    }

    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setGuardado(true);
    }, 700);
  };

  if (guardado) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Cargar Materia" />
        <div className="card p-8 text-center">
          <Alert variant="success" message="Materia registrada correctamente" className="justify-center" />
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button
              title="Cargar otra"
              variant="outline"
              onClick={() => {
                setGuardado(false);
                setNombre('');
                setDescripcion('');
                setAnios('1');
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

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
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

        <FormField
          label="Años de duración"
          errorMessage={errores.anios}
          hint="Cantidad de años/cursos en los que se cursa"
          required
        >
          <Input
            placeholder="1"
            inputMode="numeric"
            value={anios}
            onChange={(e) => setAnios(e.target.value)}
            error={Boolean(errores.anios)}
            disabled={saving}
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

        <div className="mt-6 flex flex-wrap justify-end gap-3">
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
