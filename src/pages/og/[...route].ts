import { OGImageRoute } from "astro-og-canvas";
import type { FontConfig } from "node_modules/astro-og-canvas/dist/types";

const directory = "src/pages/blog";
const rawPages = import.meta.glob(`src/pages/blog/**/*.md`, { eager: true });

const pages = Object.entries(rawPages).reduce(
  (acc, [path, page]) => ({ ...acc, [path.replace(directory, "")]: page }),
  {}
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",
  pages: import.meta.glob("/src/pages/**/*.md", { eager: true }),

  getImageOptions: (path, page) => ({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    bgGradient: [[204, 236, 233]],
    border: {
      color: [35, 39, 39],
      width: 25,
      side: "inline-start",
    },
    font: {
      title: titleFontConfig,
      description: descriptionFontConfig,
    },
    fonts: [
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Bold.ttf",
      "./src/fonts/IBM_Plex_Sans/IBMPlexSans-Regular.ttf",
    ],
  }),
});

const titleFontConfig: FontConfig = {
  color: [35, 39, 39],
  weight: "Bold",
  families: ["IBM Plex Sans"],
};

const descriptionFontConfig: FontConfig = {
  color: [35, 39, 39],
  weight: "Normal",
  size: 30,
  families: ["IBM Plex Sans"],
};