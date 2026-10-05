import {
  Activity,
  CheckCircle2,
  ChevronDown,
  MinusCircle,
  Play,
  Server,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Alert, Button, EmptyState, Input, PageHeader } from '@/components/ui';
import { API_BASE_URL } from '@/config/api';
import {
  construirChecks,
  ejecutarVerificacion,
  limpiarTemporales,
  prepararContexto,
  type CheckResult,
  type ResultadoCorrida,
} from '@/services/apiVerification';
import { getSession, saveSession } from '@/utils/session';

type Filtro = 'todos' | 'fallo' | 'ok' | 'omitido';

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'fallo', label: 'Fallan' },
  { value: 'ok', label: 'OK' },
  { value: 'omitido', label: 'Omitidos' },
];

const ESTADO_UI = {
  ok: { Icon: CheckCircle2, classes: 'text-success', badge: 'bg-success/10 text-success' },
  fallo: { Icon: XCircle, classes: 'text-error', badge: 'bg-error/10 text-error' },
  omitido: { Icon: MinusCircle, classes: 'text-outline', badge: 'bg-surface text-outline' },
} as const;

export default function VerificarApiPage() {
  const [escribir, setEscribir] = useState(false);
  const [codigoTutor, setCodigoTutor] = useState('');
  const [corrida, setCorrida] = useState<ResultadoCorrida | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [ejecutando, setEjecutando] = useState(false);
  const [progreso, setProgreso] = useState('');
  const [error, setError] = useState('');
  const [limpieza, setLimpieza] = useState('');

  const checks = useMemo(() => construirChecks(codigoTutor.trim()), [codigoTutor]);

  const visibles = useMemo(() => {
    if (!corrida) return [];
    if (filtro === 'todos') return corrida.checks;

    return corrida.checks.filter((c) => c.estado === filtro);
  }, [corrida, filtro]);

  const ejecutar = async () => {
    if (ejecutando) return;

    setEjecutando(true);
    setError('');
    setCorrida(null);
    setLimpieza('');
    setProgreso('Conectando con la API...');

    try {
      const ctx = await prepararContexto(escribir);

      const resultado = await ejecutarVerificacion(ctx, checks, (_, index, total) => {
        setProgreso(`Verificando ${index + 1}/${total}...`);
      });

      setCorrida(resultado);

      // El check de login re autentica al administrador y el backend le revoca
      // el token anterior: hay que guardar el nuevo o la web queda con una
      // sesión muerta al terminar la corrida.
      const session = getSession();

      if (session && session.token !== ctx.tokenAdmin) {
        saveSession({ ...session, token: ctx.tokenAdmin });
      }

      if (escribir) {
        setProgreso('Limpiando datos temporales...');
        const borrados = await limpiarTemporales(ctx);

        setLimpieza(
          borrados.length
            ? `Se borraron: ${borrados.join(', ')}.`
            : 'No quedaron datos temporales.',
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo ejecutar la verificación.');
    } finally {
      setProgreso('');
      setEjecutando(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Verificar API"
        subtitle="Recorre todos los endpoints habilitados del backend y compara el status con el esperado."
        icon={Activity}
      />

      <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
            <Server className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold tracking-wide text-secondary uppercase">API</p>
            <p className="font-mono text-sm break-all text-neutral">{API_BASE_URL}</p>
            <p className="text-xs text-outline">Se define con VITE_API_BASE_URL en el .env</p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral">
          <input
            type="checkbox"
            checked={escribir}
            disabled={ejecutando}
            onChange={(e) => setEscribir(e.target.checked)}
            className="size-4 accent-primary"
          />
          Modo escritura
        </label>
      </div>

      {escribir ? (
        <Alert
          variant="info"
          message="El modo escritura crea y borra registros de prueba en la base de datos. Al terminar se limpian, pero POST /users deja un usuario sin endpoint de borrado: volvé al estado inicial con php artisan migrate:fresh --seed."
        />
      ) : null}

      <div className="card mb-5 p-4">
        <label className="field-label" htmlFor="codigo-tutor">
          Código institucional (opcional)
        </label>
        <Input
          id="codigo-tutor"
          placeholder="ALU-XXXXXX-XXXXXX"
          value={codigoTutor}
          disabled={ejecutando}
          onChange={(e) => setCodigoTutor(e.target.value)}
        />
        <p className="mt-2 flex items-start gap-1.5 text-xs text-outline">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Necesario para verificar el registro de tutores. El endpoint consume el código y no se
          puede volver a usar: el tutor queda registrado con ese email, así que cargalo sólo contra
          una base descartable.
        </p>
      </div>

      <Button
        title={ejecutando ? 'Verificando...' : `Ejecutar ${checks.length} checks`}
        loading={ejecutando}
        onClick={ejecutar}
        icon={<Play className="size-4" aria-hidden />}
        className="mb-5"
      />

      {ejecutando && progreso ? (
        <p className="mb-5 text-sm text-secondary">{progreso}</p>
      ) : null}

      {error ? <Alert message={error} /> : null}

      {limpieza ? (
        <p className="mb-5 text-sm text-secondary">
          <span className="font-semibold text-neutral">Limpieza: </span>
          {limpieza}
        </p>
      ) : null}

      {!corrida ? (
        <EmptyState
          icon={Activity}
          title="Todavía no hay ninguna corrida"
          subtitle="Presioná Ejecutar para recorrer todos los endpoints. Los checks de escritura sólo corren si activás el modo escritura."
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Contador valor={corrida.totales.ok} label="OK" classes="text-success" />
            <Contador valor={corrida.totales.fallos} label="Fallan" classes="text-error" />
            <Contador valor={corrida.totales.omitidos} label="Omitidos" classes="text-outline" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFiltro(f.value)}
                aria-pressed={filtro === f.value}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  filtro === f.value
                    ? 'bg-primary text-white'
                    : 'bg-surface text-secondary hover:bg-surface-variant'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <EmptyState title="Sin checks para este filtro" />
          ) : (
            <ul className="space-y-3">
              {visibles.map((check) => (
                <li key={check.id}>
                  <CheckCard check={check} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function Contador({ valor, label, classes }: { valor: number; label: string; classes: string }) {
  return (
    <div className="card p-4 text-center">
      <p className={`text-2xl font-black ${classes}`}>{valor}</p>
      <p className="text-xs font-semibold text-secondary">{label}</p>
    </div>
  );
}

function CheckCard({ check }: { check: CheckResult }) {
  const [expandido, setExpandido] = useState(false);
  const { Icon, classes, badge } = ESTADO_UI[check.estado];

  return (
    <div className="card p-4">
      <button
        type="button"
        onClick={() => setExpandido((v) => !v)}
        aria-expanded={expandido}
        className="flex w-full cursor-pointer items-center gap-3 text-left"
      >
        <Icon className={`size-5 shrink-0 ${classes}`} aria-hidden />

        <span className="min-w-0 flex-1">
          <span className="block font-mono text-sm font-bold break-all text-neutral">
            {check.metodo} {check.ruta}
          </span>
          <span className="mt-0.5 block text-xs text-secondary">{check.descripcion}</span>
        </span>

        <span className={`badge shrink-0 ${badge}`}>{check.status ?? '—'}</span>

        <ChevronDown
          className={`size-4 shrink-0 text-outline transition ${expandido ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {expandido ? (
        <div className="mt-3 border-t border-border/40 pt-3 text-xs text-secondary">
          <p>Esperado: {check.esperado}</p>
          <p>Roles: {check.roles}</p>
          <p>Duración: {check.duracionMs} ms</p>
          {check.detalle ? <p className="mt-1">Respuesta: {check.detalle}</p> : null}
          {check.nota ? (
            <p className="mt-2 rounded-lg bg-primary/8 px-2.5 py-2 text-primary">{check.nota}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}