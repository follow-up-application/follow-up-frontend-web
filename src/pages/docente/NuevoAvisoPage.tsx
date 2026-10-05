import { Info, Send, TriangleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Alert, Button, FormField, Input, PageHeader, SelectInput } from '@/components/ui';
import { AVISO_DESTINATARIOS } from '@/data/docente';

type Urgencia = 'Normal' | 'Urgente';

export default function DocenteNuevoAvisoPage() {
  const [destinatario, setDestinatario] = useState(AVISO_DESTINATARIOS[0]);
  const [urgencia, setUrgencia] = useState<Urgencia>('Normal');
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({ titulo: '', mensaje: '' });
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorGeneral('');

    const nuevosErrores = { titulo: '', mensaje: '' };
    let valid = true;

    if (!titulo.trim()) {
      nuevosErrores.titulo = 'El título es requerido';
      valid = false;
    }

    if (!mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es requerido';
      valid = false;
    } else if (mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
      valid = false;
    }

    setErrores(nuevosErrores);
    if (!valid) return;

    setEnviado(true);
  };

  return (
    <div>
      <PageHeader title="Nuevo Comunicado" subtitle="Enviar un aviso a la comunidad educativa" />

      {enviado ? (
        <div className="card mx-auto max-w-2xl p-8 text-center">
          <Alert variant="success" message="Comunicado enviado correctamente" className="justify-center" />
          <Button
            title="Enviar otro comunicado"
            variant="outline"
            onClick={() => {
              setEnviado(false);
              setTitulo('');
              setMensaje('');
            }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl p-6 sm:p-8" noValidate>
          {errorGeneral ? <Alert message={errorGeneral} /> : null}

          <div className="mb-4 max-w-md">
            <SelectInput
              label="Destinatarios"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              options={AVISO_DESTINATARIOS.map((d) => ({ value: d, label: d }))}
            />
          </div>

          <div className="mb-4">
            <span className="field-label">Nivel de urgencia</span>
            <div className="grid grid-cols-2 gap-3">
              {(['Normal', 'Urgente'] as Urgencia[]).map((item) => {
                const activo = urgencia === item;
                const urgente = item === 'Urgente';
                const Icon = urgente ? TriangleAlert : Info;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setUrgencia(item)}
                    aria-pressed={activo}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 p-3.5 text-sm font-semibold transition ${
                      activo
                        ? urgente
                          ? 'border-error bg-error/8 text-error'
                          : 'border-primary bg-primary/8 text-primary'
                        : 'border-border/60 bg-white text-secondary hover:border-primary'
                    }`}
                  >
                    <Icon className="size-4.5" aria-hidden />
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <FormField label="Título" errorMessage={errores.titulo} required>
            <Input
              placeholder="Ej: Cambio de horario"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={Boolean(errores.titulo)}
            />
          </FormField>

          <FormField label="Mensaje" errorMessage={errores.mensaje} required>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={6}
              placeholder="Escribí el comunicado..."
              aria-invalid={Boolean(errores.mensaje) || undefined}
              className={`field-input resize-y ${
                errores.mensaje ? 'border-error focus:border-error focus:ring-error/20' : ''
              }`}
            />
          </FormField>

          <Button
            type="submit"
            title="Enviar comunicado"
            icon={<Send className="size-4" aria-hidden />}
            fullWidth
            className="mt-2"
          />
        </form>
      )}
    </div>
  );
}
