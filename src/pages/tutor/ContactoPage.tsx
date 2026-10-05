import { Search, Send } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { TUTOR_CONVERSACIONES, TUTOR_DIRECTORIO } from '@/data/tutor';

const TABS = ['Mensajes', 'Directorio'] as const;
type Tab = (typeof TABS)[number];

export default function TutorContactoPage() {
  const [tab, setTab] = useState<Tab>('Mensajes');
  const [busqueda, setBusqueda] = useState('');

  const directorio = TUTOR_DIRECTORIO.filter(
    (item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.materia.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Comunicaciones" subtitle="Mensajes y directorio del personal" />

      <div
        className="mb-6 inline-flex rounded-full bg-surface p-1"
        role="tablist"
        aria-label="Comunicaciones"
      >
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition ${
              tab === item ? 'bg-primary text-white' : 'text-secondary hover:text-neutral'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'Mensajes' ? (
        <ul className="space-y-3">
          {TUTOR_CONVERSACIONES.map((conv) => (
            <li key={conv.id} className="card flex items-center gap-4 p-4">
              <span
                className="relative grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: conv.avatarColor }}
              >
                {conv.iniciales}
                {conv.online ? (
                  <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-success" />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-neutral">{conv.nombre}</p>
                <p className="truncate text-sm text-secondary">{conv.preview}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-outline">{conv.hora}</span>
                {conv.sinLeer > 0 ? (
                  <span className="badge bg-primary text-white">{conv.sinLeer}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-outline"
              aria-hidden
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o materia"
              aria-label="Buscar en el directorio"
              className="field-input pl-11"
            />
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {directorio.map((item) => (
              <li key={item.id} className="card flex items-center gap-4 p-4">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.iniciales}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-neutral">{item.nombre}</p>
                  <p className="truncate text-sm text-secondary">{item.materia}</p>
                </div>
                <button
                  type="button"
                  className="btn-ghost shrink-0 rounded-full p-2"
                  aria-label={`Escribir a ${item.nombre}`}
                >
                  <Send className="size-4.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          {directorio.length === 0 ? (
            <p className="card p-8 text-center text-sm text-secondary">
              No se encontraron resultados.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
