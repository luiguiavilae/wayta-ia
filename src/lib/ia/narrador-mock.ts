type Narracion = {
    titulo: string;
    narrativa: string;
    cierre: string;
  };
  
  type InputNarrador = {
    arquetipoDominante: string;
    paleta: string;
    tonoRitual: string;
    profundidadSimbolica: string;
    tipoArreglo: string;
    justificacionBullets: string[];
  };
  
  export function narrarWaytaMock(input: InputNarrador): Narracion {
    const {
      arquetipoDominante,
      paleta,
      tonoRitual,
      profundidadSimbolica,
      tipoArreglo,
      justificacionBullets,
    } = input;
  
    const titulo = generarTitulo(arquetipoDominante, paleta);
  
    const narrativa = generarNarrativa({
      arquetipoDominante,
      paleta,
      tonoRitual,
      profundidadSimbolica,
      tipoArreglo,
      bullets: justificacionBullets,
    });
  
    const cierre = generarCierre(tonoRitual);
  
    return { titulo, narrativa, cierre };
  }
  
  function generarTitulo(arquetipo: string, paleta: string) {
    return `Ritual de ${capitalizar(arquetipo)} y ${capitalizar(paleta)}`;
  }
  
  function generarNarrativa(args: {
    arquetipoDominante: string;
    paleta: string;
    tonoRitual: string;
    profundidadSimbolica: string;
    tipoArreglo: string;
    bullets: string[];
  }) {
    const {
      arquetipoDominante,
      paleta,
      tonoRitual,
      profundidadSimbolica,
      tipoArreglo,
      bullets,
    } = args;
  
    const intro = `Este arreglo ha sido concebido desde una energía de ${arquetipoDominante}, utilizando una paleta ${paleta} para sostener la intención de forma coherente y equilibrada.`;
  
    const cuerpo = `El ritual se presenta con un tono ${tonoRitual} y una profundidad simbólica ${profundidadSimbolica}, permitiendo que el significado se exprese sin imponerse. El formato elegido (${tipoArreglo.replace(
      "_",
      " "
    )}) acompaña esta intención de manera concreta y respetuosa.`;
  
    const cierre = bullets.length
      ? `Este diseño se fundamenta en los siguientes criterios simbólicos: ${bullets.join(
          " "
        )}`
      : "";
  
    return [intro, cuerpo, cierre].filter(Boolean).join("\n\n");
  }
  
  function generarCierre(tonoRitual: string) {
    if (tonoRitual === "intenso") {
      return "Este arreglo puede ser ofrecido como un gesto consciente, con intención clara.";
    }
  
    if (tonoRitual === "balanceado") {
      return "Este arreglo acompaña el momento con sentido y armonía.";
    }
  
    return "Un gesto simbólico simple, abierto a la interpretación personal.";
  }
  
  function capitalizar(texto: string) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  