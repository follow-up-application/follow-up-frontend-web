import { Building2, ChevronRight, Megaphone } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, EmptyState, PageHeader } from '@/components/ui';
import { MOCK_AVISOS } from '@/data/alumno';

export default function AlumnoComunicadosPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (id) {
    const aviso = MOCK_AVISOS.find((item) => item.id === id) ?? MOCK_AVISOS[0];

    return (
      <div>
        <PageHeader title="Comunicado" subtitle={aviso.remitente} />

        <article className="card mx-auto max-w-3xl p-6 sm:p-8">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white">
                <Building2 className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-bold text-neutral">{aviso.remitente}</p>
                <p className="text-xs text-secondary">{aviso.fecha}</p>
              </div>
            </div>
            {aviso.urgente ? <span className="badge bg-error/10 text-error">Importante</span> : null}
          </header>

          <div className="my-5 border-t border-border/50" />

          <h2 className="text-xl font-extrabold text-neutral">{aviso.titulo}</h2>
          <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed whitespace-pre-line text-secondary">
            {aviso.cuerpo}
          </div>

          <Button title="Marcar como leído" fullWidth className="mt-6" onClick={() => navigate(-1)} />
        </article>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Comunicados" subtitle="Avisos de la institución" />

      {MOCK_AVISOS.length === 0 ? (
        <EmptyState icon={Megaphone} title="Sin comunicados" subtitle="No hay avisos publicados." />
      ) : (
        <div className="space-y-3">
          {MOCK_AVISOS.map((aviso) => (
            <Link
              key={aviso.id}
              to={`/alumno/comunicados/${aviso.id}`}
              className="card flex items-center gap-4 p-4 transition hover:border-primary/40 hover:shadow-sm"
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                  aviso.urgente ? 'bg-error/10 text-error' : 'bg-primary-light text-primary'
                }`}
              >
                <Megaphone className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-bold text-neutral">{aviso.titulo}</p>
                  {aviso.urgente ? <span className="badge bg-error/10 text-error">Importante</span> : null}
                </div>
                <p className="truncate text-sm text-secondary">{aviso.remitente}</p>
                <p className="text-xs text-outline">{aviso.fecha}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-outline" aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
