import { EntradaMotor, SalidaMotor, Arquetipo, Paleta, TipoArreglo } from "./tipos";
import {
  ARQUETIPO_POR_INTENCION,
  PALETA_POR_INTENCION,
  TONO_POR_NIVEL_MISTICO,
  PROFUNDIDAD_POR_NIVEL_MISTICO,
  ajustarProfundidadPorInspiracion,
  TIPOS_ARREGLO_POR_ARQUETIPO,
  filtrarTiposPorDireccion,
  TIPO_PRIMARIO_POR_ARQUETIPO,
} from "./reglas";

/**
 * Motor determinista del MVP.
 * - Decide arquetipo, paleta, tono, profundidad y tipo de arreglo.
 * - No genera texto final (eso es tarea del narrador IA).
 */
export function recomendar(input: EntradaMotor): SalidaMotor {
  const arquetipoDominante: Arquetipo = ARQUETIPO_POR_INTENCION[input.intencion];
  const paleta: Paleta = PALETA_POR_INTENCION[input.intencion];

  const tonoRitual = TONO_POR_NIVEL_MISTICO[input.nivelMistico];

  const profundidadBase = PROFUNDIDAD_POR_NIVEL_MISTICO[input.nivelMistico];
  const profundidadSimbolica = ajustarProfundidadPorInspiracion(
    profundidadBase,
    input.inspiracionAncestral
  );

  // Tipos permitidos por arquetipo + restricciones por dirección
  const tiposPermitidos = filtrarTiposPorDireccion(
    TIPOS_ARREGLO_POR_ARQUETIPO[arquetipoDominante],
    input.direccionRegalo
  );

  // Tipo determinista por arquetipo (fallback si una restricción lo invalida)
  const tipoPrimario = TIPO_PRIMARIO_POR_ARQUETIPO[arquetipoDominante];
  const tipoArreglo: TipoArreglo = tiposPermitidos.includes(tipoPrimario)
    ? tipoPrimario
    : tiposPermitidos[0];

  const justificacionBullets = construirJustificacion({
    input,
    arquetipoDominante,
    paleta,
    tonoRitual,
    profundidadSimbolica,
    tipoArreglo,
  });

  return {
    arquetipoDominante,
    paleta,
    tonoRitual,
    profundidadSimbolica,
    tipoArreglo,
    justificacionBullets,
  };
}

function construirJustificacion(args: {
  input: EntradaMotor;
  arquetipoDominante: Arquetipo;
  paleta: Paleta;
  tonoRitual: string;
  profundidadSimbolica: string;
  tipoArreglo: TipoArreglo;
}): string[] {
  const {
    input,
    arquetipoDominante,
    paleta,
    tonoRitual,
    profundidadSimbolica,
    tipoArreglo,
  } = args;

  const bullets: string[] = [];

  // 1) Núcleo
  bullets.push(`Energía dominante: ${arquetipoDominante} (definida por la intención "${input.intencion}").`);
  bullets.push(`Paleta energética sugerida: ${paleta} para sostener esa energía.`);

  // 2) Calibración de tono / profundidad
  bullets.push(`Tono del ritual: ${tonoRitual}. Profundidad simbólica: ${profundidadSimbolica}.`);

  // 3) Inspiración ancestral
  if (input.inspiracionAncestral === "profunda") {
    bullets.push(`Inspiración ancestral profunda: el relato puede incluir simbolismo andino de forma explícita (sin dogma).`);
  } else if (input.inspiracionAncestral === "sutil") {
    bullets.push(`Inspiración ancestral sutil: se sugiere un guiño simbólico andino sin sobrecargar la narrativa.`);
  } else {
    bullets.push(`Enfoque universal: sin referencia ancestral explícita, priorizando claridad y accesibilidad.`);
  }

  // 4) Objeto físico
  bullets.push(`Tipo de arreglo elegido: ${tipoArreglo} (regla fija por arquetipo, con fallback si aplica).`);

  // 5) Matiz opcional (no cambia el core en MVP)
  if (input.tipoPersonalidad16) {
    bullets.push(`Matiz por personalidad (opcional): ${input.tipoPersonalidad16}. No altera la decisión central, solo el estilo narrativo.`);
  }

  // Control: mantenemos 3–5 bullets máximo
  return bullets.slice(0, 5);
}
