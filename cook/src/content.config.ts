import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const recipes = defineCollection({
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/recipes",
    // id = carpeta de la receta = slug ("tortilla-de-patatas/index.md" -> "tortilla-de-patatas")
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      notionId: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      time: z.number().int().positive().optional(),
      servings: z.number().positive().optional(),
      cover: image().optional(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
});

export const collections = { recipes };
