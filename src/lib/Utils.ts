import { Type, type Role } from './ManfredType';

export function SlugName(name: string) {
  return name.trim().replaceAll(" ", "-").toLowerCase();
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
