import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const recipes = await getCollection("recipes");

const pages = Object.fromEntries(
  recipes.map((recipe) => [
    recipe.id,
    {
      ...recipe.data,
      // Ruta en disco de la portada para usarla como fondo de la imagen OG.
      coverPath: (recipe.data.cover as { fsPath?: string } | undefined)?.fsPath,
    },
  ])
);

const titleFont = {
  weight: "Bold" as const,
  families: ["IBM Plex Sans"],
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,

  getImageOptions: (_path, data: (typeof pages)[string]) => {
    const fonts = [
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Bold.ttf",
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Regular.ttf",
    ];

    // Con foto: la portada llena la tarjeta y el título va en blanco sobre una
    // banda inferior oscura (el borde grueso) para que se lea sobre cualquier
    // imagen.
    if (data.coverPath) {
      return {
        title: data.title,
        bgImage: { path: data.coverPath, fit: "cover" as const },
        bgGradient: [[35, 39, 39]] as [number, number, number][],
        border: { color: [35, 39, 39], width: 140, side: "block-end" as const },
        padding: 60,
        font: {
          title: { color: [255, 255, 255], size: 64, ...titleFont },
        },
        fonts,
      };
    }

    // Sin foto: el diseño de marca (fondo cian + título oscuro).
    return {
      title: data.title,
      description: data.tags.join(" · "),
      bgGradient: [[204, 236, 233]] as [number, number, number][],
      border: { color: [35, 39, 39], width: 25, side: "inline-start" as const },
      font: {
        title: { color: [35, 39, 39], ...titleFont },
        description: {
          color: [35, 39, 39],
          weight: "Normal" as const,
          size: 30,
          families: ["IBM Plex Sans"],
        },
      },
      fonts,
    };
  },
});
