# cook.lalogo.dev

Recetario personal renderizado con [Astro](https://astro.build), con el mismo
sistema de diseño que [lalogo.dev](https://lalogo.dev) (raíz de este repo).

## Cómo funciona el contenido

**Las recetas NO se editan aquí.** Viven en una database de Notion; la Azure
Function [`Sync-Notion-Recipes`](https://github.com/la-lo-go/lalogo.dev-relay)
las convierte a Markdown y las commitea en `src/content/recipes/` cada vez que
algo cambia en Notion (webhook). Cualquier edición manual en esa carpeta será
sobrescrita por el siguiente sync.

```
src/content/recipes/
  tortilla-de-patatas/
    index.md          ← frontmatter (title, tags, time, servings...) + cuerpo
    <uuid>.jpg        ← imágenes descargadas de Notion (sus URLs caducan)
```

- **Añadir una receta** = añadir una fila en la database de Notion
- **Despublicar** = desmarcar la propiedad `Publicada` (o archivar la página)
- **Congelar la URL** de una receta antes de renombrarla: rellenar la
  propiedad `Slug` en Notion
- **Resincronizar a mano** (recuperación): `curl` con la clave manual contra
  la función (ver README del relay)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

Requiere Node 22.12+ (hay `.nvmrc`).

## Deploy

Proyecto propio de Cloudflare Pages sobre este mismo repo:

- **Root directory:** `cook`
- **Build command:** `npm run build` · **Output:** `dist`
- **Custom domain:** `cook.lalogo.dev`
- **Build watch paths:** include `cook/*` (y en el proyecto Pages del sitio
  principal, exclude `cook/*`) para que cada commit construya solo el sitio
  que toca.
