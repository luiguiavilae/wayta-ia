"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NivelMistico = 1 | 2 | 3 | 4;
type Intencion =
  | "florecimiento"
  | "proteccion"
  | "vinculo"
  | "gratitud"
  | "sanacion"
  | "fuerza";
type InspiracionAncestral = "profunda" | "sutil" | "neutral";
type DireccionRegalo = "para_mi" | "para_otro" | "acompanamiento";

type EntradaMotor = {
  nivelMistico: NivelMistico;
  intencion: Intencion;
  inspiracionAncestral: InspiracionAncestral;
  direccionRegalo: DireccionRegalo;
};

type SalidaMotor = {
  arquetipoDominante: string;
  paleta: string;
  tonoRitual: string;
  profundidadSimbolica: string;
  tipoArreglo: string;
  justificacionBullets: string[];
};

type ResultadoAPI = {
  recomendado: SalidaMotor;
  narracion?: {
    titulo: string;
    narrativa: string;
    cierre: string;
  };
};

const INTENCIONES: { value: Intencion; label: string; hint: string }[] = [
  { value: "florecimiento", label: "Florecimiento", hint: "Apertura, inicio, expansión" },
  { value: "proteccion", label: "Protección", hint: "Límite, resguardo, contención" },
  { value: "vinculo", label: "Vínculo", hint: "Cercanía, afecto, presencia" },
  { value: "gratitud", label: "Gratitud", hint: "Ofrenda, reconocimiento, gesto" },
  { value: "sanacion", label: "Acompañamiento", hint: "Tránsito, cuidado, calma" },
  { value: "fuerza", label: "Fuerza", hint: "Determinación, firmeza, dirección" },
];

function normalizarEtiqueta(s: string) {
  return (s ?? "").replaceAll("_", " ");
}

function capitalizar(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function chipLabelFromForm(form: EntradaMotor) {
  const mapMist: Record<NivelMistico, string> = {
    1: "suave",
    2: "equilibrado",
    3: "intenso",
    4: "profundo",
  };
  return `místico: ${mapMist[form.nivelMistico]} • ancestral: ${form.inspiracionAncestral}`;
}

export default function Page() {
  const [form, setForm] = useState<EntradaMotor>({
    nivelMistico: 2,
    intencion: "florecimiento",
    inspiracionAncestral: "sutil",
    direccionRegalo: "para_otro",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const payloadPretty = useMemo(() => JSON.stringify(form, null, 2), [form]);

  async function revelar() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        const maybeError =
          typeof data === "object" && data !== null && "error" in data
            ? (data as { error?: string }).error
            : undefined;

        setResultado(null);
        setError(maybeError ?? "Error desconocido");
        return;
      }

      setResultado(data as ResultadoAPI);
    } catch {
      setResultado(null);
      setError("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  function reiniciar() {
    setResultado(null);
    setError(null);
    setShowDebug(false);
  }

  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs tracking-[0.35em] uppercase text-white/55">
            Wayta IA • Ritual simbólico (MVP)
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold">
              {resultado?.narracion?.titulo ?? "Elige tu intención"}
            </h1>

            <span className="wayta-chip">
              <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
              {chipLabelFromForm(form)}
            </span>

            {resultado && (
              <span className="wayta-chip">
                <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
                paleta: {resultado.recomendado.paleta}
              </span>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-sm text-white/65">
            Respondes tú. El motor decide. El contenido sustenta. La voz revela.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Panel izquierda */}
          <motion.section
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="wayta-card md:col-span-5 p-5 md:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Configura el ritual</h2>
                <p className="mt-1 text-sm text-white/60">
                  Cambia variables. Cuando estés listo, revela.
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={reiniciar} className="wayta-btn-soft">
                  Reiniciar
                </button>
                <button onClick={revelar} disabled={loading} className="wayta-btn">
                  {loading ? "Invocando..." : "Revelar"}
                </button>
              </div>
            </div>

            {/* Intención */}
            <div className="mb-6">
              <div className="mb-2 flex items-baseline justify-between">
                <label className="text-sm text-white/75">Intención</label>
                <span className="text-xs text-white/45">elige una energía dominante</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {INTENCIONES.map((it) => {
                  const active = form.intencion === it.value;
                  return (
                    <button
                      key={it.value}
                      onClick={() => setForm((f) => ({ ...f, intencion: it.value }))}
                      className={[
                        "rounded-2xl border px-3 py-3 text-left transition",
                        active
                          ? "border-white/30 bg-white/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="text-sm font-medium">{it.label}</div>
                      <div className="text-xs text-white/55">{it.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nivel místico */}
            <div className="mb-6">
              <div className="mb-2 flex items-baseline justify-between">
                <label className="text-sm text-white/75">Nivel místico</label>
                <span className="text-xs text-white/45">1 suave • 4 intenso</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as NivelMistico[]).map((n) => {
                  const active = form.nivelMistico === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setForm((f) => ({ ...f, nivelMistico: n }))}
                      className={[
                        "rounded-xl px-3 py-3 text-sm border transition",
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-white/50">
                No prometemos efectos reales. Solo experiencia simbólica.
              </p>
            </div>

            {/* Inspiración ancestral */}
            <div className="mb-6">
              <div className="mb-2 flex items-baseline justify-between">
                <label className="text-sm text-white/75">Inspiración ancestral</label>
                <span className="text-xs text-white/45">carga del relato</span>
              </div>

              <div className="flex gap-2">
                {(["neutral", "sutil", "profunda"] as InspiracionAncestral[]).map((v) => {
                  const active = form.inspiracionAncestral === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setForm((f) => ({ ...f, inspiracionAncestral: v }))}
                      className={[
                        "flex-1 rounded-xl border px-3 py-3 text-sm transition capitalize",
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <div className="mb-2 flex items-baseline justify-between">
                <label className="text-sm text-white/75">Dirección del regalo</label>
                <span className="text-xs text-white/45">intención social del gesto</span>
              </div>

              <div className="flex gap-2">
                {(["para_mi", "para_otro", "acompanamiento"] as DireccionRegalo[]).map((v) => {
                  const active = form.direccionRegalo === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setForm((f) => ({ ...f, direccionRegalo: v }))}
                      className={[
                        "flex-1 rounded-xl border px-3 py-3 text-sm transition",
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {normalizarEtiqueta(v)}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
                >
                  <strong>Error:</strong> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5">
              <button
                onClick={() => setShowDebug((s) => !s)}
                className="text-xs text-white/60 hover:text-white/80 transition"
              >
                {showDebug ? "Ocultar debug" : "Ver payload (debug)"}
              </button>

              <AnimatePresence>
                {showDebug && (
                  <motion.pre
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/70"
                  >
                    {payloadPretty}
                  </motion.pre>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Panel derecha */}
          <motion.section
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="wayta-card md:col-span-7 p-5 md:p-6 relative overflow-hidden"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-48 -right-48 h-[620px] w-[620px] rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.05, 1], opacity: [0.18, 0.28, 0.18] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Revelación</h2>

                {resultado && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      `arquetipo: ${resultado.recomendado.arquetipoDominante}`,
                      `arreglo: ${resultado.recomendado.tipoArreglo}`,
                      `tono: ${resultado.recomendado.tonoRitual}`,
                      `profundidad: ${resultado.recomendado.profundidadSimbolica}`,
                    ].map((t) => (
                      <span key={t} className="wayta-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!resultado ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70"
                  >
                    <p className="text-sm">
                      Aún no hay revelación. Presiona <strong>Revelar</strong>.
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                      Esto es un MVP: recomendación determinista + contenido curado.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h3 className="text-xl font-semibold">
                        {resultado.narracion?.titulo ??
                          `Ritual de ${capitalizar(resultado.recomendado.arquetipoDominante)}`}
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/78">
                        {resultado.narracion?.narrativa ??
                          "Narración no disponible. Revisa narrador-mock o tu endpoint."}
                      </p>

                      <p className="mt-3 text-sm text-white/70">
                        <em>{resultado.narracion?.cierre ?? "—"}</em>
                      </p>
                    </div>

                    <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer text-sm text-white/70">
                        Ver justificación del motor
                      </summary>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
                        {resultado.recomendado.justificacionBullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </details>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        <footer className="mt-8 text-xs text-white/45">
          Nota: recomendación determinista; narración con contenido curado (sin promesas de efecto real).
        </footer>
      </div>
    </main>
  );
}
