import { Clock, Filter, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { DOCENTE_CATEGORIAS, DOCENTE_MATERIAS } from '@/data/docente';

export default function DocenteMateriasPage() {
  const [categoria, setCategoria] = useState('Todas');
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  const materias =
    categoria === 'Todas'
      ? DOCENTE_MATERIAS
      : DOCENTE_MATERIAS.filter((m) => m.categoria === categoria);

  return (
    <div>
      <PageHeader
        title="Mis Materias"
        subtitle="Ciclo lectivo 2024"
        actions={
          <button
            type="button"
            onClick={() => setFiltrosVisibles((v) => !v)}
            aria-pressed={filtrosVisibles}
            className="btn-outline px-4 py-2 text-sm lg:hidden"
          >
            <Filter className="size-4" aria-hidden />
            Filtrar
          </button>
        }
      />

      <div className={`mb-6 gap-2 ${filtrosVisibles ? 'flex flex-wrap' : 'hidden lg:flex'}`}>
        {DOCENTE_CATEGORIAS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategoria(item)}
            aria-pressed={categoria === item}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${
              categoria === item
                ? 'border-primary bg-primary text-white'
                : 'border-border/60 bg-white text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {materias.map((materia) => (
          <Link
            key={materia.id}
            to={`/docente/materias/${materia.id}`}
            className="card p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-bold text-neutral">{materia.nombre}</h2>
                <p className="text-sm text-secondary">{materia.subtitulo}</p>
              </div>
              <span
                className="badge shrink-0"
                style={{ backgroundColor: materia.categoriaBg, color: materia.categoriaColor }}
              >
                {materia.categoria}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                {materia.alumnosCount} alumnos
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                {materia.horario}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {materias.length === 0 ? (
        <p className="card p-8 text-center text-sm text-secondary">
          No hay materias para esta categoría.
        </p>
      ) : null}
    </div>
  );
}
