"use client";

import { useState } from "react";
import Image from "next/image";
import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { darkenHex } from "@/lib/color";

export function DriverAvatar({ driver, size = 40 }: { driver: Driver; size?: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const chipBackground = driver.team_colour ? `#${driver.team_colour}` : colors.textMuted;
  const chipText = darkenHex(chipBackground);

  if (driver.headshot_url && !imageFailed) {
    return (
      <Image
        src={driver.headshot_url}
        alt={driver.full_name}
        width={size}
        height={size}
        onError={() => setImageFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ backgroundColor: chipBackground }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full text-sm font-medium"
      style={{ width: size, height: size, backgroundColor: chipBackground, color: chipText }}
    >
      {driver.name_acronym}
    </span>
  );
}
