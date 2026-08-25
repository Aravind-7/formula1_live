export function formatSessionDate(dateStart: string): string {
  return new Date(dateStart).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSessionTime(dateStart: string): string {
  return new Date(dateStart).toLocaleString("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatGap(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return `+${value.toFixed(3)}s`;
  return value;
}

export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${minutes}:${remaining}`;
}
