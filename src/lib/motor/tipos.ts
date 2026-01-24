/**
 * Tipos de dominio — Wayta IA (MVP)
 * Este archivo es el "diccionario" del sistema.
 * Aquí viven los tipos. En reglas.ts viven las decisiones.
 */

// -----------------------------
// Entradas (desde el frontend)
// -----------------------------

export type NivelMistico = 1 | 2 | 3 | 4;

export type Intencion =
  | "florecimiento"
  | "proteccion"
  | "vinculo"
  | "gratitud"
  | "sanacion"
  | "fuerza";

export type InspiracionAncestral = "profunda" | "sutil" | "neutral";

export type DireccionRegalo = "para_mi" | "para_otro" | "acompanamiento";

// -----------------------------
// Variables / entidades internas
// -----------------------------

export type Arquetipo = "florecimiento" | "proteccion" | "vinculo" | "fuerza";

export type Paleta = "tierra" | "fuego" | "aire" | "agua";

export type TonoRitual = "suave" | "balanceado" | "intenso";

export type ProfundidadSimbolica = "sutil" | "media" | "alta";

export type TipoArreglo =
  | "flores"
  | "flores_cuarzos"
  | "flores_aromas"
  | "pack_florecimiento";

// -----------------------------
// Contratos del motor
// -----------------------------

export type EntradaMotor = {
  nivelMistico: NivelMistico;
  intencion: Intencion;
  inspiracionAncestral: InspiracionAncestral;
  direccionRegalo: DireccionRegalo;

  /**
   * Opcional (v1): 16 tipos de personalidad.
   * En MVP NO altera el arquetipo: solo matiza narrativa/acentos.
   */
  tipoPersonalidad16?: string;
};

export type SalidaMotor = {
  arquetipoDominante: Arquetipo;
  paleta: Paleta;
  tonoRitual: TonoRitual;
  profundidadSimbolica: ProfundidadSimbolica;
  tipoArreglo: TipoArreglo;

  /**
   * Bullets estructurados para explicar “por qué” sin dogma.
   * La IA los usará como base para redactar 2–3 párrafos.
   */
  justificacionBullets: string[];
};
