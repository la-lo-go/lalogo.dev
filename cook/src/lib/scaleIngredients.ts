// Escala las cantidades de una línea de ingrediente por un factor.
//
// Diseñada y validada contra los 187 ingredientes reales de las recetas:
// escala pesos/volúmenes (250g, 170ml), unidades (1 huevo, 12 dientes),
// fracciones (½, ¼, 1/2, 2 ¾, 2 y ½), decimales (1,5), rangos (15-20g),
// "media/medio" y equivalencias entre paréntesis (150g). NO escala
// porcentajes (70%), diámetros de molde (25cm) ni temperaturas (180°),
// que son propiedades del ingrediente o del utillaje, no cantidades.

const FRAC: Record<string, number> = {
  "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};
const FRAC_CHARS = Object.keys(FRAC).join("");

// Unidades/contexto que, pegados a un número, lo marcan como NO escalable.
const NO_SCALE = `(?:%|cm|mm|°|º|grados?)`;

const toNumber = (raw: string): number => parseFloat(raw.replace(",", "."));
const formatQty = (value: number): string =>
  String(Math.round(value * 100) / 100).replace(".", ",");

const QTY = new RegExp(
  [
    // 1) "N <unidad 1-2 palabras> y medio/media"  (g1=N, g2=unidad intermedia)
    `(\\d+(?:[.,]\\d+)?)((?:\\s+[a-záéíóúñ]+){1,2}\\s+)y\\s+(?:medio|media)\\b`,
    // 2) rango A-B (+ unidad no escalable opcional)  (g3, g4, g5)
    `(\\d+(?:[.,]\\d+)?)\\s*[-–]\\s*(\\d+(?:[.,]\\d+)?)\\s*(${NO_SCALE})?`,
    // 3) entero + fracción unicode "2 ¾" / "2 y ½"  (g6, g7)
    `(\\d+)\\s*(?:y\\s+)?([${FRAC_CHARS}])`,
    // 4) "N y medio/media" adyacente  (g8)
    `(\\d+(?:[.,]\\d+)?)\\s+y\\s+(?:medio|media)\\b`,
    // 5) fracción ascii a/b  (g9, g10)
    `(\\d+)\\s*\\/\\s*(\\d+)`,
    // 6) fracción unicode suelta  (g11)
    `([${FRAC_CHARS}])`,
    // 7) palabra "media/medio" al inicio del ingrediente  (g12)
    `(medio|media)\\b`,
    // 8) entero/decimal (+ unidad no escalable opcional, \\s* dentro del grupo)  (g13, g14)
    `(\\d+(?:[.,]\\d+)?)(\\s*${NO_SCALE})?`,
  ].join("|"),
  "giu"
);

export function scaleIngredientText(text: string, factor: number): string {
  if (factor === 1) return text;
  let mediaUsed = false;

  const scaled = text.replace(
    QTY,
    (
      m: string,
      g1: string, g2: string, g3: string, g4: string, g5: string,
      g6: string, g7: string, g8: string, g9: string, g10: string,
      g11: string, g12: string, g13: string, g14: string,
      offset: number
    ): string => {
      if (g1 !== undefined && g2 !== undefined)
        return `${formatQty((toNumber(g1) + 0.5) * factor)}${g2}`;
      if (g3 !== undefined && g4 !== undefined) {
        if (g5) return m; // unidad no escalable -> intacto
        return `${formatQty(toNumber(g3) * factor)}-${formatQty(toNumber(g4) * factor)}`;
      }
      if (g6 !== undefined && g7 !== undefined)
        return formatQty((parseInt(g6, 10) + FRAC[g7]) * factor);
      if (g8 !== undefined) return formatQty((toNumber(g8) + 0.5) * factor);
      if (g9 !== undefined && g10 !== undefined)
        return formatQty((toNumber(g9) / toNumber(g10)) * factor);
      if (g11 !== undefined) return formatQty(FRAC[g11] * factor);
      if (g12 !== undefined) {
        // "media/medio" solo se escala cuando abre el ingrediente (Media cebolla)
        if (offset <= 2 && !mediaUsed) {
          mediaUsed = true;
          return formatQty(0.5 * factor);
        }
        return m;
      }
      if (g13 !== undefined) {
        if (g14) return m; // %, cm, mm, ° -> intacto
        return formatQty(toNumber(g13) * factor);
      }
      return m;
    }
  );

  // El caso "N unidad y medio" deja un doble espacio al quitar "y medio".
  return scaled.replace(/ {2,}/g, " ");
}
