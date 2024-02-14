import { Type, type Role } from './Manfred';
import type { ProjectUrl } from './ProjectPortfolio';

// Credits: https://gist.github.com/max10rogerio/c67c5d2d7a3ce714c4bc0c114a3ddc6e
export function SlugName(name: string) {
  return name
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
}

export function GetTechnologiesFromRoles(roles: Role[]) {
  const techList = roles.flatMap((role) =>
    role.competences
      .filter((competence) => competence.type === Type.Technology)
      .map((competence) => competence.name)
  );

  const joined = techList.join(", ");
  if (techList.length > 1) {
    const lastCommaIndex = joined.lastIndexOf(",");
    const replaced =
      joined.slice(0, lastCommaIndex) + " &" + joined.slice(lastCommaIndex + 1);
    return `(${replaced})`;
  }

  const enclosed = `(${joined})`;

  return enclosed;
}

// parse a markdown text  to get the first sentence
export function FormatDescription(text: string) {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const noLinks = text.replace(linkRegex, (_, text, link) => text);

  const noLineBreaks = noLinks.replace(/\n/g, " ");
  const noMultipleSpaces = noLineBreaks.replace(/ +/g, " ");

  // get the first sentence of the text
  const firstSentenceRegex = /(^.*?[a-z]{2,}[.!?])\s+\W*[A-Z]/;
  const firstSentence =
    noMultipleSpaces.match(firstSentenceRegex)?.[1] ?? noMultipleSpaces;

  return firstSentence;
}

export function GetLinks(url: string, description: string): ProjectUrl[] {
  const urls = url ? [{ name: "GitHub repo", url: url }] : [];
  const descriptionUrls = extractDescriptionLinks(description);

  return urls.concat(descriptionUrls);
}

function extractDescriptionLinks(description: string): Array<ProjectUrl> {
  const regex = /\[(.*?)\]\(([^)]+)\)/g;
  let match;
  const links = [];

  while ((match = regex.exec(description)) !== null) {
    links.push({ name: match[1], url: match[2] });
  }

  return links;
}

export function FormatDates(dateStart: Date, dateFinish: Date) {
  const start = dateStart.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const finish = dateFinish
    ? dateFinish.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "today";

  return `${start} - ${finish}`;
}
