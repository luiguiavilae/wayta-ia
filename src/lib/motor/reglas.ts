import {
    NivelMistico,
    Intencion,
    InspiracionAncestral,
    DireccionRegalo,
    Arquetipo,
    Paleta,
    TonoRitual,
    ProfundidadSimbolica,
    TipoArreglo,
  } from "./tipos";
  
  /**
   * ------------------------------------------------------------------
   * 1. Mapeo intención → arquetipo dominante
   * Regla: un solo arquetipo por recomendación (MVP)
   * ------------------------------------------------------------------
   */
  export const ARQUETIPO_POR_INTENCION: Record<Intencion, Arquetipo> = {
    florecimiento: "florecimiento",
    proteccion: "proteccion",
    vinculo: "vinculo",
    gratitud: "vinculo",
    sanacion: "proteccion",
    fuerza: "fuerza",
  };
  
  /**
   * ------------------------------------------------------------------
   * 2. Mapeo intención → paleta energética base
   * ------------------------------------------------------------------
   */
  export const PALETA_POR_INTENCION: Record<Intencion, Paleta> = {
    florecimiento: "aire",
    proteccion: "tierra",
    vinculo: "agua",
    gratitud: "agua",
    sanacion: "tierra",
    fuerza: "fuego",
  };
  
  /**
   * ------------------------------------------------------------------
   * 3. Nivel místico → tono ritual
   * ------------------------------------------------------------------
   */
  export const TONO_POR_NIVEL_MISTICO: Record<NivelMistico, TonoRitual> = {
    1: "suave",
    2: "balanceado",
    3: "balanceado",
    4: "intenso",
  };
  
  /**
   * ------------------------------------------------------------------
   * 4. Nivel místico → profundidad simbólica base
   * ------------------------------------------------------------------
   */
  export const PROFUNDIDAD_POR_NIVEL_MISTICO: Record<
    NivelMistico,
    ProfundidadSimbolica
  > = {
    1: "sutil",
    2: "media",
    3: "media",
    4: "alta",
  };
  
  /**
   * ------------------------------------------------------------------
   * 5. Inspiración ancestral → modificador de profundidad simbólica
   * Regla:
   * - Nunca reduce por debajo de "sutil"
   * - Nunca aumenta por encima de "alta"
   * ------------------------------------------------------------------
   */
  export function ajustarProfundidadPorInspiracion(
    profundidadBase: ProfundidadSimbolica,
    inspiracion: InspiracionAncestral
  ): ProfundidadSimbolica {
    if (inspiracion === "neutral") return profundidadBase;
  
    if (inspiracion === "profunda") {
      if (profundidadBase === "sutil") return "media";
      return "alta";
    }
  
    // inspiracion === "sutil"
    return profundidadBase;
  }
  
  /**
   * ------------------------------------------------------------------
   * 6. Tipos de arreglo permitidos según arquetipo
   * (usado para validación y fallback controlado)
   * ------------------------------------------------------------------
   */
  export const TIPOS_ARREGLO_POR_ARQUETIPO: Record<
    Arquetipo,
    TipoArreglo[]
  > = {
    florecimiento: ["flores", "pack_florecimiento"],
    proteccion: ["flores", "flores_cuarzos", "flores_aromas"],
    vinculo: ["flores", "flores_aromas"],
    fuerza: ["flores", "flores_cuarzos"],
  };
  
  /**
   * ------------------------------------------------------------------
   * 7. Restricciones por dirección del regalo
   * ------------------------------------------------------------------
   */
  export function filtrarTiposPorDireccion(
    tipos: TipoArreglo[],
    direccion: DireccionRegalo
  ): TipoArreglo[] {
    if (direccion === "para_mi") return tipos;
  
    if (direccion === "acompanamiento") {
      return tipos.filter(
        (t) => t !== "pack_florecimiento"
      );
    }
  
    // para_otro
    return tipos;
  }
  
  /**
   * ------------------------------------------------------------------
   * 8. Tipo de arreglo primario (determinista) por arquetipo
   * Regla:
   * - El MVP siempre intenta usar este tipo
   * - Si alguna restricción lo invalida, se hace fallback controlado
   * ------------------------------------------------------------------
   */
  export const TIPO_PRIMARIO_POR_ARQUETIPO: Record<
    Arquetipo,
    TipoArreglo
  > = {
    florecimiento: "pack_florecimiento",
    proteccion: "flores_cuarzos",
    vinculo: "flores_aromas",
    fuerza: "flores_cuarzos",
  };
  