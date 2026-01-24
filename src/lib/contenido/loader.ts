import fs from "fs";
import path from "path";

export type BloqueContenido = {
  titulo: string;
  cuerpo: string;
};

export type CatalogoContenido = {
  flores: BloqueContenido[];
  cuarzos: BloqueContenido[];
  aromas: BloqueContenido[];
};

function leerArchivo(nombre: string): string {
  const ruta = path.join(process.cwd(), "src", "contenido", nombre);
  return fs.readFileSync(ruta, "utf8");
}

/**
 * Extrae bloques tipo:
 * ## Título
 * texto...
 */
function parsearBloques(md: string): BloqueContenido[] {
  const bloques: BloqueContenido[] = [];
  const partes = md.split("\n## ").slice(1);

  for (const parte of partes) {
    const [tituloLinea, ...resto] = parte.split("\n");
    bloques.push({
      titulo: tituloLinea.trim(),
      cuerpo: resto.join("\n").trim(),
    });
  }

  return bloques;
}

export function cargarContenido(): CatalogoContenido {
  return {
    flores: parsearBloques(leerArchivo("flores.md")),
    cuarzos: parsearBloques(leerArchivo("cuarzos.md")),
    aromas: parsearBloques(leerArchivo("aromas.md")),
  };
}

/**
 * Matching pragmático v0.1:
 * - Si el cuerpo contiene "Arquetipos compatibles: <arquetipo>"
 * - y/o "Paletas asociadas: <paleta>"
 * se prioriza ese bloque.
 */
export function elegirBloquePorArquetipoYPaleta(
  bloques: BloqueContenido[],
  arquetipo: string,
  paleta: string
): BloqueContenido | undefined {
  if (!bloques.length) return undefined;

  const a = normalizar(arquetipo);
  const p = normalizar(paleta);

  const scored = bloques
    .map((b) => {
      const cuerpo = normalizar(b.cuerpo);

      const matchArquetipo =
        cuerpo.includes("arquetipos compatibles:") && cuerpo.includes(a);

      const matchPaleta =
        cuerpo.includes("paletas asociadas:") && cuerpo.includes(p);

      // Scoring simple: arquetipo pesa más que paleta
      const score = (matchArquetipo ? 2 : 0) + (matchPaleta ? 1 : 0);

      return { b, score };
    })
    .sort((x, y) => y.score - x.score);

  // Si el mejor score es 0, devolvemos el primero (fallback)
  return scored[0].b;
}

function normalizar(s: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
