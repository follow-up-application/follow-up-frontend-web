import { Save, Search, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Alert, Button, FormField, Input, PageHeader } from '@/components/ui';
import { OBSERVACION_ALUMNOS, OBSERVACION_TIPOS } from '@/data/docente';

export default function ObservacionPage() {
  const [busqueda, setBusqueda] = useState('');
  const [alumno, setAlumno] = useState(OBSERVACION_ALUMNOS[0]);
  const [tipo, setTipo] = useState(OBSERVACION_TIPOS[0].id);
  const [descripcion, setDescripcion] = useState('');
  const [materia, setMateria] = useState('Matemáticas - Clase del 29/06');
  const [visibleTutores, setVisibleTutores] = useState(true);
  const [visibleDireccion, setVisibleDireccion] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState('');
  const [guardado, setGuardado] = useState(false);

  const alumnosFiltrados = OBSERVACION_ALUMNOS.filter((a) =>
    a.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (descripcion.trim().length < 10) {
      setErrorDescripcion('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setErrorDescripcion('');
    setGuardado(true);
  };

  if (guardado) {
    return (
      <div>
        <PageHeader title="Registrar Observación" />
        <div className="card mx-auto max-w-2xl p-8 text-center">
          <Alert variant="success" message="Observación registrada" className="justify-center" />
          <Button
            title="Registrar otra"
            variant="outline"
            onClick={() => {
              setGuardado(false);
              setDescripcion('');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Registrar Observación" subtitle="Seguimiento conductual y académico" />

      <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl p-6 sm:p-8" noValidate>
        <div className="relative mb-3">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
            aria-hidden
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar alumno..."
            aria-label="Buscar alumno"
            className="field-input pl-11"
          />
          {busqueda ? (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded p-1 text-outline hover:text-secondary"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Alumnos">
          {alumnosFiltrados.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAlumno(item)}
              aria-pressed={alumno === item}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                alumno === item
                  ? 'border-primary bg-primary text-white'
                  : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-2 text-[0.65rem] font-extrabold tracking-wider text-secondary uppercase">
          Tipo de observación
        </p>
        <div className="mb-6 grid grid-cols-3 gap-3">
          {OBSERVACION_TIPOS.map((item) => {
            const activo = tipo === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTipo(item.id)}
                aria-pressed={activo}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition ${
                  activo ? '' : 'border-border/60 bg-white text-secondary hover:border-primary'
                }`}
                style={
                  activo
                    ? { borderColor: item.color, backgroundColor: `${item.color}10`, color: item.color }
                    : undefined
                }
              >
                <item.icono className="size-5" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </div>

        <FormField label="Alumno" hint={`Observación dirigida a ${alumno}`}>
          <Input value={alumno} readOnly disabled />
        </FormField>

        <FormField label="Materia / Contexto">
          <Input value={materia} onChange={(e) => setMateria(e.target.value)} />
        </FormField>

        <FormField label="Descripción" errorMessage={errorDescripcion} required>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            placeholder="Describí la observación..."
            aria-invalid={Boolean(errorDescripcion) || undefined}
            className={`field-input resize-y ${
              errorDescripcion ? 'border-error focus:border-error focus:ring-error/20' : ''
            }`}
          />
        </FormField>

        <fieldset className="mb-6 space-y-2.5">
          <legend className="field-label">Visibilidad</legend>
          {[
            { label: 'Visible para tutores', checked: visibleTutores, set: setVisibleTutores },
            { label: 'Visible para dirección', checked: visibleDireccion, set: setVisibleDireccion },
          ].map((item) => (
            <label key={item.label} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.set(e.target.checked)}
                className="size-4 accent-primary"
              />
              {item.label}
            </label>
          ))}
        </fieldset>

        <Button
          type="submit"
          title="Guardar observación"
          icon={<Save className="size-4" aria-hidden />}
          fullWidth
        />
      </form>
    </div>
  );
}
