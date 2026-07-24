export const colors = {
  bgBase: "#0A0A0A",
  bgPanel: "#1A1C20",
  textPrimary: "#EDEDED",
  textMuted: "#9A9A94",
  accentPrimary: "#00594C",
  accentGold: "#C9B037",
  signalPurple: "#8B5CF6",
  signalGreen: "#22C55E",
  signalAmber: "#FBBF24",
  signalAlert: "#D64933",
  borderHairline: "#2A2C30",
} as const;

export type ColorToken = keyof typeof colors;
