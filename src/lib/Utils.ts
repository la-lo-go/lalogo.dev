import { Type, type Role } from './ManfredType';

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
