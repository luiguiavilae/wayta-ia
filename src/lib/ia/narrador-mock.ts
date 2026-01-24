import {
  cargarContenido,
  elegirBloquePorArquetipoYPaleta,
} from "@/lib/contenido/loader";

/**
 * Salida narrativa del narrador mock
 */
export type Narracion = {
  titulo: string;
  narrativa: string;
  cierre: string;
};

/**
 * Entrada que recibe el narrador mock.
 * Proviene del motor simbólico (no decide nada).
 */
type InputNarrador = {
  arquetipoDominante: string;
  paleta: string;
  tonoRitual: string;
  profundidadSimbolica: string;
  tipoArreglo: string;
  justificacionBullets: string[];
};

/**
 * Narrador mock de Wayta IA.
 * - NO decide
 * - NO inventa simbolismo
 * - SOLO narra usando contenido curado
 */
export function narrarWaytaMock(input: InputNarrador): Narracion {
  const { flores, cuarzos, aromas } = cargarContenido();

  // Matching v0.1: arquetipo + paleta
  const flor = elegirBloquePorArquetipoYPaleta(
    flores,
    input.arquetipoDominante,
    input.paleta
  );
  const cuarzo = elegirBloquePorArquetipoYPaleta(
    cuarzos,
    input.arquetipoDominante,
    input.paleta
  );
  const aroma = elegirBloquePorArquetipoYPaleta(
    aromas,
    input.arquetipoDominante,
    input.paleta
  );

  const titulo = generarTitulo(input.arquetipoDominante, input.paleta);

  const narrativa = generarNarrativa({
    arquetipo: input.arquetipoDominante,
    paleta: input.paleta,
    tono: input.tonoRitual,
    profundidad: input.profundidadSimbolica,
    tipoArreglo: input.tipoArreglo,
    flor,
    cuarzo,
    aroma,
  });

  const cierre = generarCierre(input.tonoRitual);

  return { titulo, narrativa, cierre };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function generarTitulo(arquetipo: string, paleta: string) {
  return `Ritual de ${capitalizar(arquetipo)} y ${capitalizar(paleta)}`;
}

function generarNarrativa(args: {
  arquetipo: string;
  paleta: string;
  tono: string;
  profundidad: string;
  tipoArreglo: string;
  flor?: { titulo: string; cuerpo: string };
  cuarzo?: { titulo: string; cuerpo: string };
  aroma?: { titulo: string; cuerpo: string };
}) {
  const {
    arquetipo,
    paleta,
    tono,
    profundidad,
    tipoArreglo,
    flor,
    cuarzo,
    aroma,
  } = args;

  const parrafoBase = `Este arreglo ha sido concebido desde una energía de ${arquetipo}, sostenida por una paleta ${paleta}. El tono del ritual es ${tono}, con una profundidad simbólica ${profundidad}, permitiendo que el significado se exprese sin imponerse.`;

  const parrafoFlor = flor
    ? `Como referencia floral, se integra ${flor.titulo}, elegida por su coherencia simbólica dentro de este contexto.`
    : null;

  const parrafoCuarzo = cuarzo
    ? `En el plano material, ${cuarzo.titulo} aporta un anclaje sobrio que acompaña la intención del arreglo.`
    : null;

  const parrafoAroma = aroma
    ? `Desde lo sensorial, el aroma de ${aroma.titulo} envuelve la experiencia, reforzando el ambiente sin sobrecargarlo.`
    : null;

  const parrafoCierre = `El formato seleccionado (${tipoArreglo.replace(
    "_",
    " "
  )}) permite que estos elementos convivan de manera equilibrada.`;

  return [
    parrafoBase,
    parrafoFlor,
    parrafoCuarzo,
    parrafoAroma,
    parrafoCierre,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function generarCierre(tono: string) {
  if (tono === "intenso") {
    return "Este gesto puede ofrecerse con intención clara y presencia consciente.";
  }

  if (tono === "balanceado") {
    return "Un gesto simbólico pensado para acompañar con armonía y sentido.";
  }

  return "Un gesto simbólico simple, abierto a la interpretación personal.";
}

function capitalizar(texto: string) {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
 