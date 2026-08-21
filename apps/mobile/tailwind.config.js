/** @type {import('tailwindcss').Config} */

// Mirrors packages/tokens exactly (colors.ts, typography.ts, spacing.ts).
// Metro/NativeWind load this config in a plain Node context that can't
// transpile the workspace package's TypeScript (`as const`, extension-less
// relative imports) at require-time — unlike apps/web, where Next.js's own
// loader handles that transparently. Keep these values in sync by hand;
// this is the same constraint any cross-platform design-token setup hits
// when web and native tooling don't share a JS runtime at config-load time.
const colors = {
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
};

const typography = {
  fontFamily: "System",
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "20px",
    xl: "28px",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
  },
};

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
};

module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: { base: colors.bgBase, panel: colors.bgPanel },
        text: { primary: colors.textPrimary, muted: colors.textMuted },
        accent: { primary: colors.accentPrimary, gold: colors.accentGold },
        signal: {
          purple: colors.signalPurple,
          green: colors.signalGreen,
          amber: colors.signalAmber,
          alert: colors.signalAlert,
        },
        border: {
          hairline: colors.borderHairline,
          strong: colors.textMuted,
        },
      },
      fontFamily: {
        sans: [typography.fontFamily],
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing,
    },
  },
  plugins: [],
};
