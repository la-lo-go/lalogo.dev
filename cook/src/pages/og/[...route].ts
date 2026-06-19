import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync } from "node:fs";

const recipes = await getCollection("recipes");

const fontBold = readFileSync("./src/fonts/IBM_Plex_Sans/IBMPlexSans-Bold.ttf");
const fontRegular = readFileSync("./src/fonts/IBM_Plex_Sans/IBMPlexSans-Regular.ttf");

// Monograma "la-lo-go", mismo path que Personal-Logo.astro.
const LOGO_PATH =
  "M0.333,0.333l114.667,0l-0,458.667l286.667,0l-0,-458.667l516,0l-0,458.667l286.666,0l0,-458.667l516,0l0,573.334l-286.666,-0l-0,-114.667l172,-0l-0,-344l-286.667,-0l-0,458.667l-516,-0l-0,-229.334l-172,0l-0,-114.666l172,-0l-0,-114.667l-286.667,-0l0,458.667l-516,-0l0,-573.334Z";

// Lucide clock y users como data URIs (mismo patrón que el logo).
const CLOCK_INNER =
  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 12"/>';
const USERS_INNER =
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>' +
  '<circle cx="9" cy="7" r="4"/>' +
  '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>' +
  '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>';

function logoDataUri(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1721 574"><path d="${LOGO_PATH}" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function iconDataUri(inner: string, color: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"` +
    ` fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    inner + `</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Las portadas originales de Notion pesan varios MB y Satori se cuelga al
// rasterizarlas. .rotate() corrige la orientación EXIF antes del resize.
async function coverDataUri(fsPath?: string): Promise<string | null> {
  if (!fsPath) return null;
  const resized = await sharp(fsPath)
    .rotate()
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 78 })
    .toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Satori exige display:flex en todo <div> con más de un hijo. Para evitar que
// los saltos de línea de los template literals se cuenten como text-nodes hijos,
// todas las cadenas de hijos se concatenan con + (sin espacios entre etiquetas).

// Pastilla con el logotipo arriba a la derecha.
function logoBadge(logoColor: string, bg: string): string {
  return (
    `<div style="position:absolute;top:44px;right:44px;display:flex;` +
    `padding:14px 20px;background:${bg};border:5px solid #232727;">` +
    `<img src="${logoDataUri(logoColor)}" style="width:128px;height:43px;" />` +
    `</div>`
  );
}

type Meta = { time?: number; servings?: number };

// Fila de iconos + texto: "⏱ 25 min  👥 4 raciones".
function metaRow(meta: Meta, color: string): string {
  const parts: string[] = [];
  if (meta.time)
    parts.push(
      `<div style="display:flex;align-items:center;gap:10px;">` +
        `<img src="${iconDataUri(CLOCK_INNER, color)}" style="width:36px;height:36px;" />` +
        `<div style="display:flex;color:${color};font-size:34px;font-weight:400;">${meta.time} min</div>` +
      `</div>`
    );
  if (meta.servings) {
    const label = meta.servings === 1 ? "ración" : "raciones";
    parts.push(
      `<div style="display:flex;align-items:center;gap:10px;">` +
        `<img src="${iconDataUri(USERS_INNER, color)}" style="width:36px;height:36px;" />` +
        `<div style="display:flex;color:${color};font-size:34px;font-weight:400;">${meta.servings} ${label}</div>` +
      `</div>`
    );
  }
  if (!parts.length) return "";
  return (
    `<div style="display:flex;align-items:center;gap:28px;opacity:0.85;">` +
    parts.join("") +
    `</div>`
  );
}

// Bloque inferior anclado a bottom:56px: título → barra cian → meta.
// flex-direction:column + bottom:56px → el bloque crece hacia arriba.
// Sin espacios entre etiquetas para no generar text-nodes que Satori cuente.
function bottomBlock(
  title: string,
  meta: Meta,
  textColor: string,
  accentColor: string
): string {
  const metaHtml = metaRow(meta, textColor);
  // 1072 = 1200 - 64 (left) - 64 (right)
  const inner =
    `<div style="display:flex;width:1072px;color:${textColor};font-size:72px;font-weight:700;line-height:1.08;">${escapeHtml(title)}</div>` +
    `<div style="display:flex;width:96px;height:5px;background:${accentColor};"></div>` +
    metaHtml;
  return (
    `<div style="position:absolute;left:64px;right:64px;bottom:56px;display:flex;flex-direction:column;align-items:flex-start;gap:12px;">` +
    inner +
    `</div>`
  );
}

function markupWithPhoto(cover: string, title: string, meta: Meta): string {
  return (
    `<div style="display:flex;position:relative;width:1200px;height:630px;font-family:'IBM Plex Sans';">` +
      `<img src="${cover}" style="position:absolute;top:0;left:0;width:1200px;height:630px;object-fit:cover;" />` +
      `<div style="position:absolute;bottom:0;left:0;display:flex;width:1200px;height:420px;` +
        `background:linear-gradient(to bottom,rgba(35,39,39,0) 0%,rgba(35,39,39,0.55) 45%,rgba(35,39,39,0.95) 100%);"></div>` +
      logoBadge("#232727", "#ccece9") +
      bottomBlock(title, meta, "#ffffff", "#ccece9") +
    `</div>`
  );
}

function markupBrand(title: string, meta: Meta): string {
  return (
    `<div style="display:flex;position:relative;width:1200px;height:630px;background:#ccece9;font-family:'IBM Plex Sans';">` +
      logoBadge("#232727", "#ffffff") +
      bottomBlock(title, meta, "#232727", "#232727") +
    `</div>`
  );
}

export function getStaticPaths() {
  return recipes.map((recipe) => ({
    params: { route: `${recipe.id}.png` },
    props: { recipe },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const recipe = (props as any).recipe;
  const cover = await coverDataUri(
    (recipe.data.cover as { fsPath?: string } | undefined)?.fsPath
  );
  const title = recipe.data.title.trim();
  const meta: Meta = { time: recipe.data.time, servings: recipe.data.servings };

  const markup = cover
    ? markupWithPhoto(cover, title, meta)
    : markupBrand(title, meta);

  const svg = await satori(html(markup) as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "IBM Plex Sans", data: fontBold, weight: 700, style: "normal" },
      { name: "IBM Plex Sans", data: fontRegular, weight: 400, style: "normal" },
    ],
  });

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
