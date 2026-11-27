import {
  BookOpen,
  Check,
  Clock,
  Edit2,
  GraduationCap,
  Loader2,
  Save,
  School,
  Trash2,
  X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Alert, Button, FormField, Input, SelectInput } from '@/components/ui';
import { updateMateria } from '@/services/materiaService';
import type { CursoDivisionTurno } from '@/types/cursoDivisionTurno';
import type { Materia, UpdateMateriaRequest } from '@/types/materia';
import type { DocenteApi } from '@/services/docenteService';

interface MateriaDetailEditModalProps {
  materia: Materia | null;
  docentes: DocenteApi[];
  cursos: CursoDivisionTurno[];
  isOpen: boolean;
  onClose: () => void;
  onMateriaUpdated: (materia: Materia) => void;
  onToggleInhabilitar: (materia: Materia) => void;
}

function MateriaEditForm({
  materia,
  docentes,
  cursos,
  onMateriaUpdated,
  onCancel,
}: {
  materia: Materia;
  docentes: DocenteApi[];
  cursos: CursoDivisionTurno[];
  onMateriaUpdated: (m: Materia) => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState(materia.nombre || '');
  const [descripcion, setDescripcion] = useState(materia.descripcion || '');
  const [cursoId, setCursoId] = useState(String(materia.curso_division_turno_id || ''));
  const [docenteId, setDocenteId] = useState(materia.docente_id || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre de la materia es obligatorio.');
      return;
    }
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!cursoId) {
      setError('Debes seleccionar un curso.');
      return;
    }
    if (!docenteId) {
      setError('Debes seleccionar un docente a cargo.');
      return;
    }

    const payload: UpdateMateriaRequest = {};
    if (nombre.trim() !== materia.nombre) payload.nombre = nombre.trim();
    if (descripcion.trim() !== (materia.descripcion || '')) payload.descripcion = descripcion.trim();
    if (Number(cursoId) !== materia.curso_division_turno_id) payload.curso_division_turno_id = Number(cursoId);
    if (docenteId !== materia.docente_id) payload.docente_id = docenteId;

    if (Object.keys(payload).length === 0) {
      onCancel();
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMateria(materia.id, payload);
      const cursoElegido = cursos.find((c) => c.id === Number(cursoId));
      const merged: Materia = {
        ...materia,
        ...updated,
        nombre: updated.nombre || nombre.trim(),
        descripcion: updated.descripcion || descripcion.trim(),
        curso_division_turno_id: updated.curso_division_turno_id || Number(cursoId),
        docente_id: updated.docente_id || docenteId,
        turno: cursoElegido?.turno || updated.turno || materia.turno,
      };
      onMateriaUpdated(merged);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar la materia. Verificá los campos ingresados.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleGuardar} className="space-y-4">
      {error ? <Alert message={error} /> : null}

      <FormField label="Nombre de la materia" required>
        <Input
          icon={BookOpen}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Matemática Aplicada"
          required
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Curso / División / Turno" required>
          <SelectInput
            placeholder="Seleccionar curso..."
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
            options={cursos.map((c) => ({
              value: String(c.id),
              label: `${c.curso}° "${c.division}" — ${c.turno}`,
            }))}
            disabled={saving}
          />
        </FormField>

        <FormField label="Docente a cargo" required>
          <SelectInput
            placeholder="Seleccionar docente..."
            value={docenteId}
            onChange={(e) => setDocenteId(e.target.value)}
            options={docentes.map((d) => ({
              value: String(d.id),
              label: `Prof. ${d.first_name} ${d.last_name}`,
            }))}
            disabled={saving}
          />
        </FormField>
      </div>

      <FormField label="Descripción" hint="Opcional">
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          placeholder="Breve descripción del programa..."
          disabled={saving}
          className="field-input resize-y"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
        <Button
          title="Cancelar"
          variant="outline"
          type="button"
          disabled={saving}
          onClick={onCancel}
        />
        <Button
          title={saving ? 'Guardando...' : 'Guardar Cambios'}
          type="submit"
          disabled={saving}
          icon={saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        />
      </div>
    </form>
  );
}

export default function MateriaDetailEditModal({
  materia,
  docentes,
  cursos,
  isOpen,
  onClose,
  onMateriaUpdated,
  onToggleInhabilitar,
}: MateriaDetailEditModalProps) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [exito, setExito] = useState('');

  if (!isOpen || !materia) return null;

  const esActiva = materia.activo !== false;
  const docenteEncontrado = docentes.find((d) => String(d.id) === String(materia.docente_id));
  const docenteNombre = docenteEncontrado
    ? `Prof. ${docenteEncontrado.first_name} ${docenteEncontrado.last_name}`
    : 'Docente no asignado';

  const cursoEncontrado = cursos.find((c) => c.id === materia.curso_division_turno_id);
  const cursoLabel = cursoEncontrado
    ? `${cursoEncontrado.curso}° "${cursoEncontrado.division}" — Turno ${cursoEncontrado.turno}`
    : `Curso ID #${materia.curso_division_turno_id}`;

  const handleClose = () => {
    setModoEdicion(false);
    setExito('');
    onClose();
  };

  const handleSaveSuccess = (updatedMateria: Materia) => {
    setExito('Materia actualizada correctamente.');
    setModoEdicion(false);
    onMateriaUpdated(updatedMateria);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-border/50 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-materia-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" aria-hidden />
            </div>
            <div>
              <h3 id="modal-materia-title" className="text-base font-bold text-neutral">
                Ficha de Materia
              </h3>
              <p className="text-xs text-secondary">
                {modoEdicion ? 'Editar datos curriculares' : 'Información académica y asignación'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-surface hover:text-neutral transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {exito ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span>{exito}</span>
            </div>
          ) : null}

          {/* Banner */}
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <BookOpen className="size-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-neutral truncate">{materia.nombre}</h4>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Clock className="size-3" />
                  {materia.turno || cursoEncontrado?.turno || 'Turno no especificado'}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    esActiva
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {esActiva ? 'Materia Habilitada' : 'Inhabilitada'}
                </span>
              </div>
            </div>
          </div>

          {!modoEdicion ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-surface/30 p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary flex items-center gap-1.5">
                    <GraduationCap className="size-3.5" />
                    Curso y División
                  </span>
                  <span className="font-semibold text-neutral">{cursoLabel}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                  <span className="text-secondary flex items-center gap-1.5">
                    <School className="size-3.5" />
                    Docente a cargo
                  </span>
                  <span className="font-semibold text-neutral">{docenteNombre}</span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    Turno Escolar
                  </span>
                  <span className="font-semibold text-neutral">
                    {materia.turno || cursoEncontrado?.turno || 'No especificado'}
                  </span>
                </div>

                <div className="border-t border-border/40 pt-2.5 text-xs space-y-1">
                  <span className="text-secondary block">Descripción / Programa</span>
                  <p className="text-neutral font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-border/40">
                    {materia.descripcion || 'Sin descripción adicional registrada.'}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-border/40 pt-2.5">
                  <span className="text-secondary">ID de Materia</span>
                  <span className="font-mono text-[11px] text-secondary">#{materia.id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onToggleInhabilitar(materia)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                    esActiva
                      ? 'border border-error/30 text-error hover:bg-error/10'
                      : 'border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  <Trash2 className="size-3.5" />
                  {esActiva ? 'Inhabilitar Materia' : 'Habilitar Materia'}
                </button>

                <Button
                  title="Editar Información"
                  variant="outline"
                  icon={<Edit2 className="size-3.5" />}
                  onClick={() => {
                    setExito('');
                    setModoEdicion(true);
                  }}
                />
              </div>
            </div>
          ) : (
            <MateriaEditForm
              key={materia.id}
              materia={materia}
              docentes={docentes}
              cursos={cursos}
              onMateriaUpdated={handleSaveSuccess}
              onCancel={() => setModoEdicion(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
