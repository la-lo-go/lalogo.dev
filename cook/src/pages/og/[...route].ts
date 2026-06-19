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

function logoDataUri(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1721 574"><path d="${LOGO_PATH}" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Las portadas originales de Notion pesan varios MB y Satori se cuelga al
// rasterizarlas, así que se reescalan al tamaño de la tarjeta antes de
// incrustarlas.
async function coverDataUri(fsPath?: string): Promise<string | null> {
  if (!fsPath) return null;
  const resized = await sharp(fsPath)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 78 })
    .toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const logoBadge = (logoColor: string, bg: string) => `
  <div style="position:absolute; top:44px; right:44px; display:flex; padding:14px 20px; background:${bg}; border:5px solid #232727;">
    <img src="${logoDataUri(logoColor)}" style="width:128px; height:43px;" />
  </div>`;

function markupWithPhoto(cover: string, title: string): string {
  return `
  <div style="display:flex; position:relative; width:1200px; height:630px; font-family:'IBM Plex Sans';">
    <img src="${cover}" style="position:absolute; top:0; left:0; width:1200px; height:630px; object-fit:cover;" />
    <div style="position:absolute; bottom:0; left:0; display:flex; width:1200px; height:420px; background:linear-gradient(to bottom, rgba(35,39,39,0) 0%, rgba(35,39,39,0.55) 45%, rgba(35,39,39,0.95) 100%);"></div>
    ${logoBadge("#232727", "#ccece9")}
    <div style="position:absolute; left:64px; right:64px; bottom:56px; display:flex; color:#ffffff; font-size:72px; font-weight:700; line-height:1.08;">${escapeHtml(title)}</div>
  </div>`;
}

function markupBrand(title: string): string {
  return `
  <div style="display:flex; position:relative; width:1200px; height:630px; background:#ccece9; font-family:'IBM Plex Sans';">
    ${logoBadge("#232727", "#ffffff")}
    <div style="position:absolute; left:64px; right:64px; bottom:56px; display:flex; color:#232727; font-size:72px; font-weight:700; line-height:1.08;">${escapeHtml(title)}</div>
  </div>`;
}

export function getStaticPaths() {
  return recipes.map((recipe) => ({
    params: { route: `${recipe.id}.png` },
    props: { recipe },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const recipe = (props as any).recipe;
  const cover = await coverDataUri((recipe.data.cover as { fsPath?: string } | undefined)?.fsPath);
  const title = recipe.data.title.trim();

  const markup = cover ? markupWithPhoto(cover, title) : markupBrand(title);

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
