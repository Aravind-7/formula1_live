export function formatSessionDate(dateStart: string): string {
  return new Date(dateStart).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
