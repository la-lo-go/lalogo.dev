// Normalización compartida por el filtro del índice y las páginas de etiquetas.
// Debe coincidir con el slugify del relay (lalogo.dev-relay) para que las URLs sean estables.
export function NormalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function SlugifyTag(tag: string): string {
  return NormalizeText(tag)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
