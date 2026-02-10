"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ───────────── TIPOS ───────────── */
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

/* ───────────── PASOS DEL RITUAL ───────────── */
type Paso = "bienvenida" | "intencion" | "misticismo" | "inspiracion" | "destinatario";

/* ───────────── DATOS ───────────── */
const INTENCIONES: { value: Intencion; label: string; hint: string; icon: string }[] = [
  { value: "florecimiento", label: "Florecimiento", hint: "Apertura, inicio, expansión", icon: "✿" },
  { value: "proteccion", label: "Protección", hint: "Límite, resguardo, contención", icon: "◈" },
  { value: "vinculo", label: "Vínculo", hint: "Cercanía, afecto, presencia", icon: "∞" },
  { value: "gratitud", label: "Gratitud", hint: "Ofrenda, reconocimiento, gesto", icon: "❋" },
  { value: "sanacion", label: "Acompañamiento", hint: "Tránsito, cuidado, calma", icon: "☽" },
  { value: "fuerza", label: "Fuerza", hint: "Determinación, firmeza, dirección", icon: "△" },
];

const NIVELES_MISTICOS: { value: NivelMistico; label: string; desc: string }[] = [
  { value: 1, label: "Suave", desc: "Un susurro simbólico" },
  { value: 2, label: "Equilibrado", desc: "Armonía entre lo visible y lo sutil" },
  { value: 3, label: "Intenso", desc: "Profundidad en cada símbolo" },
  { value: 4, label: "Profundo", desc: "Inmersión total en el ritual" },
];

const INSPIRACIONES: { value: InspiracionAncestral; label: string; desc: string }[] = [
  { value: "neutral", label: "Contemporánea", desc: "Lenguaje actual, sin referencias ancestrales" },
  { value: "sutil", label: "Sutil", desc: "Notas ancestrales integradas con delicadeza" },
  { value: "profunda", label: "Profunda", desc: "Raíz andina en cada palabra y símbolo" },
];

const DESTINATARIOS: { value: DireccionRegalo; label: string; desc: string; icon: string }[] = [
  { value: "para_mi", label: "Para mí", desc: "Un ritual personal, un gesto propio", icon: "♡" },
  { value: "para_otro", label: "Para otra persona", desc: "Un obsequio cargado de intención", icon: "❈" },
];

/* ───────────── IMAGEN POR ARQUETIPO + PALETA ───────────── */
const IMAGEN_RITUAL: Record<string, { src: string; alt: string }> = {
  "florecimiento-aire": {
    src: "/rituales/florecimiento-aire.png",
    alt: "Arreglo de Amancay con cuarzo transparente y vela de flor de naranja",
  },
  "proteccion-tierra": {
    src: "/rituales/proteccion-tierra.png",
    alt: "Arreglo de Retama con obsidiana y vela de muña",
  },
  "vinculo-agua": {
    src: "/rituales/vinculo-agua.png",
    alt: "Arreglo de Flor de Sauco con cuarzo rosado y vela de flor de naranja",
  },
  "fuerza-fuego": {
    src: "/rituales/fuerza-fuego.png",
    alt: "Arreglo de Cantuta con pirita y vela de cedro andino",
  },
};

function getImagenRitual(arquetipo: string, paleta: string) {
  const key = `${arquetipo}-${paleta}`;
  return IMAGEN_RITUAL[key] ?? IMAGEN_RITUAL["florecimiento-aire"];
}

/* ───────────── ANIMACIONES ───────────── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const itemFade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ───────────── HOOK: TYPEWRITER ───────────── */
function useTypewriter(text: string, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

/* ───────────── COMPONENTE PRINCIPAL ───────────── */
export default function Page() {
  const [paso, setPaso] = useState<Paso>("bienvenida");
  const [form, setForm] = useState<EntradaMotor>({
    nivelMistico: 2,
    intencion: "florecimiento",
    inspiracionAncestral: "sutil",
    direccionRegalo: "para_otro",
  });
  const [seleccionado, setSeleccionado] = useState({
    intencion: false,
    misticismo: false,
    inspiracion: false,
    destinatario: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  /* Typewriter for narration */
  const tituloTw = useTypewriter(resultado?.narracion?.titulo ?? "", 40);
  const narrativaTw = useTypewriter(
    tituloTw.done ? (resultado?.narracion?.narrativa ?? "") : "",
    18
  );
  const cierreTw = useTypewriter(
    narrativaTw.done ? (resultado?.narracion?.cierre ?? "") : "",
    25
  );

  /* Scroll to result when it appears */
  useEffect(() => {
    if (resultado && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [resultado]);

  /* Handler: select an option and advance */
  function seleccionarIntencion(v: Intencion) {
    setForm((f) => ({ ...f, intencion: v }));
    setSeleccionado((s) => ({ ...s, intencion: true }));
    setTimeout(() => setPaso("misticismo"), 400);
  }

  function seleccionarMisticismo(v: NivelMistico) {
    setForm((f) => ({ ...f, nivelMistico: v }));
    setSeleccionado((s) => ({ ...s, misticismo: true }));
    setTimeout(() => setPaso("inspiracion"), 400);
  }

  function seleccionarInspiracion(v: InspiracionAncestral) {
    setForm((f) => ({ ...f, inspiracionAncestral: v }));
    setSeleccionado((s) => ({ ...s, inspiracion: true }));
    setTimeout(() => setPaso("destinatario"), 400);
  }

  function seleccionarDestinatario(v: DireccionRegalo) {
    setForm((f) => ({ ...f, direccionRegalo: v }));
    setSeleccionado((s) => ({ ...s, destinatario: true }));
  }

  /* API call */
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
    setPaso("bienvenida");
    setSeleccionado({
      intencion: false,
      misticismo: false,
      inspiracion: false,
      destinatario: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* Progress indicator */
  const pasos: Paso[] = ["bienvenida", "intencion", "misticismo", "inspiracion", "destinatario"];
  const pasoIdx = pasos.indexOf(paso);

  const canReveal = seleccionado.destinatario && !loading && !resultado;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ── Background texture ── */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 900px 600px at 20% 15%, rgba(200,169,126,0.04), transparent 60%),
            radial-gradient(ellipse 700px 500px at 80% 80%, rgba(200,169,126,0.03), transparent 55%),
            linear-gradient(180deg, #0a0a0a, #0f0d0b 40%, #0a0a0a)
          `,
        }}
      />

      {/* ── Decorative line ── */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-[0.04]"
        style={{ background: "linear-gradient(180deg, transparent, var(--color-accent), transparent)" }}
      />

      <div className="relative z-10">
        {/* ── NAV ── */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2">
            <span
              className="text-xl tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}
            >
              Wayta
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {pasos.map((p, i) => (
              <div
                key={p}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i <= pasoIdx ? "24px" : "6px",
                  backgroundColor:
                    i <= pasoIdx ? "var(--color-accent)" : "rgba(200,169,126,0.15)",
                }}
              />
            ))}
          </div>
        </nav>

        {/* ── MARQUEE ── */}
        <div className="overflow-hidden border-y border-[rgba(255,235,205,0.06)] py-2.5">
          <motion.div
            className="flex gap-8 whitespace-nowrap text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--color-text-subtle)" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {Array(2)
              .fill(null)
              .map((_, idx) => (
                <span key={idx} className="flex gap-8">
                  <span>✦ Ritual simbólico floral</span>
                  <span>✦ Inspiración andina ancestral</span>
                  <span>✦ Cada arreglo es una ofrenda</span>
                  <span>✦ Flores, cuarzos & aromas</span>
                  <span>✦ Experiencia simbólica personalizada</span>
                </span>
              ))}
          </motion.div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <AnimatePresence mode="wait">
            {/* ─────── PASO 0: BIENVENIDA ─────── */}
            {paso === "bienvenida" && (
              <motion.section
                key="bienvenida"
                {...fadeUp}
                className="flex min-h-[70vh] flex-col items-center justify-center text-center"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 text-xs tracking-[0.4em] uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  Experiencia simbólica
                </motion.p>

                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span style={{ color: "var(--color-accent)" }}>El</span>
                  <br />
                  <span>Ritual</span>{" "}
                  <em className="font-normal" style={{ color: "var(--color-accent)" }}>
                    Floral
                  </em>
                </h1>

                <p
                  className="max-w-md text-base md:text-lg leading-relaxed mb-10"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Cada flor cuenta una historia. Cada cuarzo guarda una intención.
                  Descubre el arreglo simbólico que conecta con tu momento.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPaso("intencion")}
                  className="wayta-btn flex items-center gap-2"
                >
                  Comenzar el ritual
                  <span className="text-lg">→</span>
                </motion.button>
              </motion.section>
            )}

            {/* ─────── PASO 1: INTENCIÓN ─────── */}
            {paso === "intencion" && (
              <motion.section key="intencion" {...fadeUp} className="py-16 md:py-24">
                <StepHeader
                  step="01"
                  title="¿Cuál es tu intención?"
                  subtitle="Elige la energía que guiará tu ritual"
                />

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {INTENCIONES.map((it) => (
                    <motion.button
                      key={it.value}
                      variants={itemFade}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => seleccionarIntencion(it.value)}
                      className="group relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition-all duration-300"
                      style={{
                        borderColor:
                          form.intencion === it.value
                            ? "var(--color-border-active)"
                            : "var(--color-border)",
                        backgroundColor:
                          form.intencion === it.value
                            ? "var(--color-accent-soft)"
                            : "var(--color-surface)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className="mt-0.5 text-2xl"
                          style={{ color: "var(--color-accent)" }}
                        >
                          {it.icon}
                        </span>
                        <div>
                          <div className="text-base font-medium">{it.label}</div>
                          <div
                            className="mt-1 text-sm"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {it.hint}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* ─────── PASO 2: MISTICISMO ─────── */}
            {paso === "misticismo" && (
              <motion.section key="misticismo" {...fadeUp} className="py-16 md:py-24">
                <StepHeader
                  step="02"
                  title="Nivel de misticismo"
                  subtitle="¿Cuánta profundidad simbólica deseas en tu experiencia?"
                />

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="mt-10 flex flex-col gap-3"
                >
                  {NIVELES_MISTICOS.map((n) => (
                    <motion.button
                      key={n.value}
                      variants={itemFade}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => seleccionarMisticismo(n.value)}
                      className="group flex items-center gap-5 rounded-2xl border px-6 py-5 text-left transition-all duration-300"
                      style={{
                        borderColor:
                          form.nivelMistico === n.value
                            ? "var(--color-border-active)"
                            : "var(--color-border)",
                        backgroundColor:
                          form.nivelMistico === n.value
                            ? "var(--color-accent-soft)"
                            : "var(--color-surface)",
                      }}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: "var(--color-accent-soft)",
                          color: "var(--color-accent)",
                          border: "1px solid var(--color-border-active)",
                        }}
                      >
                        {n.value}
                      </span>
                      <div>
                        <div className="text-base font-medium">{n.label}</div>
                        <div
                          className="mt-0.5 text-sm"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {n.desc}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                <p className="mt-5 text-center text-xs" style={{ color: "var(--color-text-subtle)" }}>
                  No prometemos efectos reales. Solo experiencia simbólica.
                </p>
              </motion.section>
            )}

            {/* ─────── PASO 3: INSPIRACIÓN ─────── */}
            {paso === "inspiracion" && (
              <motion.section key="inspiracion" {...fadeUp} className="py-16 md:py-24">
                <StepHeader
                  step="03"
                  title="Inspiración ancestral"
                  subtitle="¿Qué tanta raíz andina quieres en la narrativa?"
                />

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="mt-10 flex flex-col gap-3"
                >
                  {INSPIRACIONES.map((ins) => (
                    <motion.button
                      key={ins.value}
                      variants={itemFade}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => seleccionarInspiracion(ins.value)}
                      className="rounded-2xl border px-6 py-5 text-left transition-all duration-300"
                      style={{
                        borderColor:
                          form.inspiracionAncestral === ins.value
                            ? "var(--color-border-active)"
                            : "var(--color-border)",
                        backgroundColor:
                          form.inspiracionAncestral === ins.value
                            ? "var(--color-accent-soft)"
                            : "var(--color-surface)",
                      }}
                    >
                      <div className="text-base font-medium">{ins.label}</div>
                      <div
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {ins.desc}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* ─────── PASO 4: DESTINATARIO ─────── */}
            {paso === "destinatario" && (
              <motion.section key="destinatario" {...fadeUp} className="py-16 md:py-24">
                <StepHeader
                  step="04"
                  title="¿Para quién es?"
                  subtitle="El destino cambia el gesto"
                />

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {DESTINATARIOS.map((d) => (
                    <motion.button
                      key={d.value}
                      variants={itemFade}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => seleccionarDestinatario(d.value)}
                      className="flex flex-col items-center gap-3 rounded-2xl border px-6 py-8 text-center transition-all duration-300"
                      style={{
                        borderColor:
                          form.direccionRegalo === d.value && seleccionado.destinatario
                            ? "var(--color-border-active)"
                            : "var(--color-border)",
                        backgroundColor:
                          form.direccionRegalo === d.value && seleccionado.destinatario
                            ? "var(--color-accent-soft)"
                            : "var(--color-surface)",
                      }}
                    >
                      <span className="text-3xl">{d.icon}</span>
                      <div className="text-base font-medium">{d.label}</div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {d.desc}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Reveal button */}
                <AnimatePresence>
                  {canReveal && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-12 flex justify-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={revelar}
                        disabled={loading}
                        className="wayta-btn flex items-center gap-3 text-base px-8 py-4"
                      >
                        {loading ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block"
                            >
                              ✦
                            </motion.span>
                            Invocando el ritual...
                          </>
                        ) : (
                          <>
                            Revelar mi ritual
                            <span className="text-lg">✦</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ─────── RESULTADO ─────── */}
          <AnimatePresence>
            {resultado && (
              <motion.section
                ref={resultRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pb-20 pt-8"
              >
                {/* Divider */}
                <div className="mb-12 flex items-center gap-4">
                  <div
                    className="h-px flex-1"
                    style={{ background: "var(--color-border-active)" }}
                  />
                  <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Tu revelación
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "var(--color-border-active)" }}
                  />
                </div>

                {/* Imagen del arreglo */}
                {(() => {
                  const img = getImagenRitual(
                    resultado.recomendado.arquetipoDominante,
                    resultado.recomendado.paleta
                  );
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-12 flex justify-center"
                    >
                      <div
                        className="relative overflow-hidden rounded-3xl"
                        style={{
                          border: "1px solid var(--color-border)",
                          boxShadow: "0 30px 100px rgba(0,0,0,0.5)",
                          maxWidth: "420px",
                          width: "100%",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="block w-full h-auto"
                          style={{ display: "block" }}
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.6) 100%)",
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Título */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-3xl md:text-5xl font-medium leading-tight mb-8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className={tituloTw.done ? "" : "typing-cursor"}>
                    {tituloTw.displayed}
                  </span>
                </motion.h2>

                {/* Chips */}
                {tituloTw.done && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 flex flex-wrap justify-center gap-2"
                  >
                    {[
                      resultado.recomendado.arquetipoDominante,
                      resultado.recomendado.paleta,
                      resultado.recomendado.tipoArreglo,
                    ].map((t) => (
                      <span key={t} className="wayta-chip">
                        {t}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Narrativa */}
                <div
                  className="mx-auto max-w-2xl text-base md:text-lg leading-[1.8] whitespace-pre-line text-center"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span className={narrativaTw.done ? "" : "typing-cursor"}>
                    {narrativaTw.displayed}
                  </span>
                </div>

                {/* Cierre */}
                {narrativaTw.done && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center text-base italic"
                    style={{ color: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                  >
                    <span className={cierreTw.done ? "" : "typing-cursor"}>
                      {cierreTw.displayed}
                    </span>
                  </motion.p>
                )}

                {/* Justificación */}
                {cierreTw.done && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                  >
                    <details
                      className="mx-auto max-w-xl rounded-2xl border p-5"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                      }}
                    >
                      <summary
                        className="cursor-pointer text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Ver justificación del motor simbólico
                      </summary>
                      <ul
                        className="mt-4 list-none space-y-2 text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {resultado.recomendado.justificacionBullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span style={{ color: "var(--color-accent)" }}>✦</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </motion.div>
                )}

                {/* Reiniciar */}
                {cierreTw.done && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex justify-center"
                  >
                    <button onClick={reiniciar} className="wayta-btn-soft flex items-center gap-2">
                      Iniciar nuevo ritual
                      <span>↻</span>
                    </button>
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <footer
          className="border-t py-6 text-center text-xs"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-subtle)",
          }}
        >
          Wayta IA · Recomendación simbólica · Sin promesas de efecto real
        </footer>
      </div>
    </main>
  );
}

/* ───────────── COMPONENTE: STEP HEADER ───────────── */
function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <span
        className="text-xs tracking-[0.4em] uppercase"
        style={{ color: "var(--color-accent)" }}
      >
        Paso {step}
      </span>
      <h2
        className="mt-3 text-3xl md:text-4xl font-medium"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p
        className="mt-2 text-sm md:text-base"
        style={{ color: "var(--color-text-muted)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
