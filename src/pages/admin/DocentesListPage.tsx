import { Loader2, Search, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, EmptyState, PageHeader } from '@/components/ui';
import { PALETA_AVATARES } from '@/data/admin';
import { getDocentes, inhabilitarDocente, type DocenteApi } from '@/services/docenteService';
import { iniciales } from '@/utils/session';

function formatearDni(dni: string | number): string {
  return String(dni).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function DocentesListPage() {
  const [docentes, setDocentes] = useState<DocenteApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [confirmando, setConfirmando] = useState<DocenteApi | null>(null);

  useEffect(() => {
    getDocentes()
      .then((data) => {
        setDocentes(data);
        setError('');
      })
      .catch(() => {
        setError('No se pudo cargar el listado de docentes.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return docentes;

    return docentes.filter((d) => {
      const nombreCompleto = `${d.first_name} ${d.last_name}`.toLowerCase();
      const dni = String(d.dni);
      const user = d.username?.toLowerCase() || '';
      return nombreCompleto.includes(term) || dni.includes(term) || user.includes(term);
    });
  }, [docentes, busqueda]);

  const eliminar = async (docente: DocenteApi) => {
    try {
      await inhabilitarDocente(docente.id);
      setDocentes((prev) => prev.filter((item) => item.id !== docente.id));
    } catch {
      setError('No se pudo inhabilitar el docente.');
    } finally {
      setConfirmando(null);
    }
  };

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
          placeholder="Buscar por nombre, DNI o usuario..."
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

      {error ? <Alert message={error} /> : null}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-outline-variant/60 shadow-2xs">
          <Loader2 className="size-6 animate-spin text-primary mb-2" aria-hidden />
          <p className="text-sm font-semibold text-on-surface">Cargando...</p>
        </div>
      ) : filtrados.length === 0 ? (
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
          {filtrados.map((docente, index) => (
            <li key={docente.id} className="card flex flex-wrap items-center gap-4 p-4">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: PALETA_AVATARES[index % PALETA_AVATARES.length] }}
              >
                {iniciales({ first_name: docente.first_name, last_name: docente.last_name })}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-neutral">
                  Prof. {docente.first_name} {docente.last_name}
                </p>
                <p className="text-sm text-secondary">
                  DNI {formatearDni(docente.dni)}
                  {docente.telephone ? ` · Tel: ${docente.telephone}` : ` · @${docente.username}`}
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
              ¿Estás seguro de que querés eliminar a Prof. {confirmando.first_name} {confirmando.last_name}?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button title="Cancelar" variant="outline" onClick={() => setConfirmando(null)} />
              <Button
                title="Sí, eliminar"
                variant="danger"
                onClick={() => eliminar(confirmando)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
