import { Search, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, PageHeader } from '@/components/ui';
import { PALETA_AVATARES } from '@/data/admin';

type Docente = {
  id: string;
  nombre: string;
  dni: string;
  materias: string;
  avatarColor: string;
};

const DOCENTES_INICIAL: Docente[] = [
  {
    id: '1',
    nombre: 'Prof. Adrián López',
    dni: '32.123.456',
    materias: 'Matemáticas Avanzadas',
    avatarColor: PALETA_AVATARES[0],
  },
  {
    id: '2',
    nombre: 'Prof. Beatriz Torres',
    dni: '34.234.567',
    materias: 'Literatura, Prácticas del Lenguaje',
    avatarColor: PALETA_AVATARES[1],
  },
  {
    id: '3',
    nombre: 'Prof. Carlos Gómez',
    dni: '30.345.678',
    materias: 'Física, Química',
    avatarColor: PALETA_AVATARES[2],
  },
  {
    id: '4',
    nombre: 'Prof. Daniela Ruiz',
    dni: '28.567.890',
    materias: 'Inglés I, Inglés II',
    avatarColor: PALETA_AVATARES[3],
  },
];

export default function DocentesListPage() {
  const [docentes, setDocentes] = useState(DOCENTES_INICIAL);
  const [busqueda, setBusqueda] = useState('');
  const [confirmando, setConfirmando] = useState<Docente | null>(null);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return docentes;

    return docentes.filter(
      (d) =>
        d.nombre.toLowerCase().includes(term) ||
        d.dni.includes(term) ||
        d.materias.toLowerCase().includes(term),
    );
  }, [docentes, busqueda]);

  return (
    <div>
      <PageHeader
        title="Listado de Docentes"
        subtitle={`${docentes.length} docente${docentes.length === 1 ? '' : 's'} en el padrón`}
        actions={
          <Link to="/admin/docentes/nuevo">
            <Button title="Cargar docente" icon={<UserPlus className="size-4" aria-hidden />} />
          </Link>
        }
      />

      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
          aria-hidden
        />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, DNI o materia..."
          aria-label="Buscar docente"
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

      {filtrados.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay docentes para mostrar"
          subtitle={busqueda ? 'Probá con otro término de búsqueda.' : 'Cargá el primer docente.'}
        >
          <Link to="/admin/docentes/nuevo">
            <Button title="Cargar docente" icon={<UserPlus className="size-4" aria-hidden />} />
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((docente) => (
            <li key={docente.id} className="card flex flex-wrap items-center gap-4 p-4">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: docente.avatarColor }}
              >
                {docente.nombre.replace('Prof. ', '').charAt(0)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-neutral">{docente.nombre}</p>
                <p className="text-sm text-secondary">
                  DNI {docente.dni} &middot; {docente.materias}
                </p>
              </div>

              <Button
                title="Eliminar"
                variant="danger"
                onClick={() => setConfirmando(docente)}
                icon={<Trash2 className="size-4" aria-hidden />}
              />
            </li>
          ))}
        </ul>
      )}

      {confirmando ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral/40 p-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-neutral">Eliminar docente</h2>
            <p className="mt-2 text-sm text-secondary">
              ¿Estás seguro de que querés eliminar a {confirmando.nombre}?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button title="Cancelar" variant="outline" onClick={() => setConfirmando(null)} />
              <Button
                title="Sí, eliminar"
                variant="danger"
                onClick={() => {
                  setDocentes((prev) => prev.filter((d) => d.id !== confirmando.id));
                  setConfirmando(null);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
