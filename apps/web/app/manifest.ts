import type { MetadataRoute } from "next";
import { colors } from "@f1-dashboard/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "F1 Dashboard",
    short_name: "F1 Dashboard",
    display: "standalone",
    background_color: colors.bgBase,
    theme_color: colors.bgBase,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
