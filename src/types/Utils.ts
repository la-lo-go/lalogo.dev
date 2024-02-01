export function SlugName(name: string) {
  return name.trim().replaceAll(" ", "-").toLowerCase();
}
