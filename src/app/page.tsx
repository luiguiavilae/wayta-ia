"use client";

import { useMemo, useState } from "react";

/**
 * Tipos locales (UI)
 * No importamos los del motor para mantener la UI desacoplada.
 */

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
  narracion: {
    titulo: string;
    narrativa: string;
    cierre: string;
  };
};

export default function Home() {
  const [form, setForm] = useState<EntradaMotor>({
    nivelMistico: 2,
    intencion: "florecimiento",
    inspiracionAncestral: "sutil",
    direccionRegalo: "para_otro",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoAPI | null>(null);

  const payloadPretty = useMemo(() => JSON.stringify(form, null, 2), [form]);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Error desconocido");
        return;
      }

      setResultado(data as ResultadoAPI);
    } catch (e) {
      setError("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Wayta IA</h1>
      <p style={{ opacity: 0.75, marginBottom: 24 }}>
        Ritual simbólico — MVP funcional
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ---------------- FORMULARIO ---------------- */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 14 }}>
            1) Configura el ritual
          </h2>

          <label style={{ display: "block", marginBottom: 12 }}>
            Nivel místico
            <select
              style={{ width: "100%", marginTop: 6, padding: 8 }}
              value={form.nivelMistico}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  nivelMistico: Number(e.target.value) as NivelMistico,
                }))
              }
            >
              <option value={1}>1 — curiosidad</option>
              <option value={2}>2 — creencia parcial</option>
              <option value={3}>3 — confianza simbólica</option>
              <option value={4}>4 — vínculo profundo</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            Intención energética
            <select
              style={{ width: "100%", marginTop: 6, padding: 8 }}
              value={form.intencion}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  intencion: e.target.value as Intencion,
                }))
              }
            >
              <option value="florecimiento">Florecimiento</option>
              <option value="proteccion">Protección</option>
              <option value="vinculo">Vínculo</option>
              <option value="gratitud">Gratitud / ofrenda</option>
              <option value="sanacion">Sanación / acompañamiento</option>
              <option value="fuerza">Fuerza / determinación</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            Inspiración ancestral
            <select
              style={{ width: "100%", marginTop: 6, padding: 8 }}
              value={form.inspiracionAncestral}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  inspiracionAncestral:
                    e.target.value as InspiracionAncestral,
                }))
              }
            >
              <option value="profunda">Profunda</option>
              <option value="sutil">Sutil</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            Dirección del regalo
            <select
              style={{ width: "100%", marginTop: 6, padding: 8 }}
              value={form.direccionRegalo}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  direccionRegalo:
                    e.target.value as DireccionRegalo,
                }))
              }
            >
              <option value="para_mi">Para mí</option>
              <option value="para_otro">Para otra persona</option>
              <option value="acompanamiento">Acompañamiento</option>
            </select>
          </label>

          <button
            onClick={onSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Invocando..." : "Iniciar ritual"}
          </button>

          {error && (
            <p style={{ marginTop: 12, color: "salmon" }}>
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>

        {/* ---------------- RESULTADO ---------------- */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 14 }}>
            2) Revelación
          </h2>

          {!resultado ? (
            <p style={{ opacity: 0.75 }}>
              Completa el ritual para revelar el significado.
            </p>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>
                {resultado.narracion.titulo}
              </h3>

              <p style={{ whiteSpace: "pre-line" }}>
                {resultado.narracion.narrativa}
              </p>

              <p>
                <em>{resultado.narracion.cierre}</em>
              </p>

              <hr />

              <details>
                <summary style={{ cursor: "pointer" }}>
                  Ver justificación simbólica (debug)
                </summary>
                <ul>
                  {resultado.recomendado.justificacionBullets.map(
                    (b, i) => (
                      <li key={i}>{b}</li>
                    )
                  )}
                </ul>
              </details>
            </>
          )}

          <div style={{ marginTop: 16 }}>
            <strong>Payload enviado</strong>
            <pre
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 10,
                background: "rgba(0,0,0,0.25)",
                overflow: "auto",
                fontSize: 12,
              }}
            >
              {payloadPretty}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}