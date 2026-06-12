import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const recipes = await getCollection("recipes");

const pages = Object.fromEntries(
  recipes.map((recipe) => [recipe.id, recipe.data])
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,

  getImageOptions: (_path, data: (typeof pages)[string]) => ({
    title: data.title,
    description: data.description ?? data.tags.join(" · "),
    bgGradient: [[204, 236, 233]],
    border: {
      color: [35, 39, 39],
      width: 25,
      side: "inline-start",
    },
    font: {
      title: {
        color: [35, 39, 39],
        weight: "Bold",
        families: ["IBM Plex Sans"],
      },
      description: {
        color: [35, 39, 39],
        weight: "Normal",
        size: 30,
        families: ["IBM Plex Sans"],
      },
    },
    fonts: [
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Bold.ttf",
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Regular.ttf",
    ],
  }),
});
