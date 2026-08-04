// Darkens a hex color for use as text on top of that same color as a
// background chip — multiplying channels keeps the hue instead of just
// falling back to plain black, per the "never plain black" design rule.
export function darkenHex(hex: string, factor = 0.35): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const darken = (channel: number) => Math.round(channel * factor);

  return `#${[darken(r), darken(g), darken(b)]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}
