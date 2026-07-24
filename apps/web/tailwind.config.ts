import type { Config } from "tailwindcss";
import { colors, typography, spacing } from "@f1-dashboard/tokens";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
          // no dedicated "hover" color in the palette — reuse text-muted, the
          // closest existing tone lighter than the hairline border.
          strong: colors.textMuted,
        },
      },
      fontFamily: {
        sans: [typography.fontFamily],
      },
      fontSize: typography.fontSize,
      fontWeight: {
        regular: String(typography.fontWeight.regular),
        medium: String(typography.fontWeight.medium),
      },
      spacing,
    },
  },
  plugins: [],
};
export default config;
