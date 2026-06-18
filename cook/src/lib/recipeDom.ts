// Utilidades compartidas para localizar y enriquecer las partes de una receta
// en el DOM (las usan el escalador de raciones, los checkboxes y el modo cocina).

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function nextListAfter(heading: Element): HTMLUListElement | HTMLOListElement | null {
  let el = heading.nextElementSibling;
  while (el) {
    if (el.tagName === "UL" || el.tagName === "OL")
      return el as HTMLUListElement | HTMLOListElement;
    if (/^H[1-6]$/.test(el.tagName)) return null; // empezó otra sección
    el = el.nextElementSibling;
  }
  return null;
}

// <li> de las listas que siguen a un encabezado de "Ingredientes".
export function findIngredientItems(): HTMLLIElement[] {
  const body = document.querySelector(".recipe-body");
  if (!body) return [];
  const items: HTMLLIElement[] = [];
  for (const heading of body.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    if (!normalize(heading.textContent ?? "").includes("ingrediente")) continue;
    const list = nextListAfter(heading);
    if (list) items.push(...list.querySelectorAll("li"));
  }
  return items;
}

export interface RecipeStep {
  section: string;
  text: string;
}

// Pasos de la receta: los <li> de las listas ordenadas, agrupados por su
// encabezado. Se excluye lo que cuelgue de "Ingredientes".
export function findRecipeSteps(): RecipeStep[] {
  const body = document.querySelector(".recipe-body");
  if (!body) return [];
  const steps: RecipeStep[] = [];
  let currentSection = "";
  for (const el of body.children) {
    if (/^H[1-6]$/.test(el.tagName)) {
      currentSection = el.textContent?.trim() ?? "";
      continue;
    }
    if (el.tagName === "OL" && !normalize(currentSection).includes("ingrediente")) {
      for (const li of el.querySelectorAll("li")) {
        const text = li.textContent?.trim();
        if (text) steps.push({ section: currentSection, text });
      }
    }
  }
  return steps;
}

import { icons } from "./icons";

// Hace clicables las menciones de tiempo de los pasos ("40 minutos", "1 hora",
// "35-40 min") para crear un temporizador con ese tiempo. Usa la función global
// cookAddTimer que expone el componente Timers.
const TIME_RE =
  /(\d+)(?:\s*[-–]\s*(\d+))?\s*(horas?|minutos?|min|segundos?|seg|h)\b/gi;

function secondsFromMatch(a: string, b: string | undefined, unit: string): number {
  const value = Number(b ?? a); // en un rango usamos el mayor (b)
  const u = unit.toLowerCase();
  if (u.startsWith("h")) return value * 3600;
  if (u.startsWith("s")) return value;
  return value * 60; // minutos por defecto
}

export function enhanceStepTimes(): void {
  const steps = document.querySelectorAll<HTMLLIElement>(".recipe-body ol li");
  for (const li of steps) {
    if (li.dataset.timesProcessed === "1") continue;
    li.dataset.timesProcessed = "1";

    const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) textNodes.push(node as Text);

    for (const textNode of textNodes) {
      if (textNode.parentElement?.closest("a, button")) continue;
      const text = textNode.nodeValue ?? "";
      TIME_RE.lastIndex = 0;
      if (!TIME_RE.test(text)) continue;

      const frag = document.createDocumentFragment();
      let last = 0;
      TIME_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = TIME_RE.exec(text))) {
        frag.append(text.slice(last, m.index));
        const seconds = secondsFromMatch(m[1], m[2], m[3]);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "step-time";
        btn.append(m[0]);
        btn.insertAdjacentHTML("beforeend", " " + icons.timer);
        btn.title = "Crear temporizador";
        btn.dataset.seconds = String(seconds);
        btn.addEventListener("click", () => {
          (window as any).cookAddTimer?.(seconds);
          btn.classList.add("step-time-fired");
          setTimeout(() => btn.classList.remove("step-time-fired"), 1200);
        });
        frag.append(btn);
        last = m.index + m[0].length;
      }
      frag.append(text.slice(last));
      textNode.replaceWith(frag);
    }
  }
}

// Envuelve cada ingrediente en una etiqueta con checkbox (mise en place) y un
// <span class="ing-text"> con el texto, sobre el que actúa el escalador.
// Idempotente: lo llaman tanto el escalador como otros scripts.
export function ensureIngredientsProcessed(): HTMLLIElement[] {
  const items = findIngredientItems();
  if (items.length === 0) return items;

  const storeKey = `cook:miseEnPlace:${location.pathname}`;
  let done: Record<string, boolean> = {};
  try {
    done = JSON.parse(localStorage.getItem(storeKey) ?? "{}");
  } catch {}

  const persist = () => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(done));
    } catch {}
  };

  items.forEach((li, index) => {
    if (li.dataset.ingredientProcessed === "1") return;
    li.dataset.ingredientProcessed = "1";
    li.classList.add("ing-li");

    const text = li.textContent ?? "";
    const key = String(index);

    li.textContent = "";
    const label = document.createElement("label");
    label.className = "ing-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "ing-check";
    checkbox.checked = done[key] === true;

    const span = document.createElement("span");
    span.className = "ing-text";
    span.dataset.original = text;
    span.textContent = text;

    if (checkbox.checked) li.classList.add("ing-done");

    checkbox.addEventListener("change", () => {
      li.classList.toggle("ing-done", checkbox.checked);
      done[key] = checkbox.checked;
      persist();
    });

    label.append(checkbox, span);
    li.append(label);
  });

  return items;
}
