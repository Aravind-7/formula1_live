import Link from "next/link";
import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { darkenHex } from "@/lib/color";

export function DriversSection({
  drivers,
  sessionKey,
}: {
  drivers: Driver[];
  sessionKey: number;
}) {
  if (drivers.length === 0) {
    return <p className="text-sm text-text-muted">No driver data available yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
      {drivers.map((driver) => {
        const chipBackground = driver.team_colour ? `#${driver.team_colour}` : colors.textMuted;
        const chipText = darkenHex(chipBackground);

        return (
          <Link
            key={driver.driver_number}
            href={`/dashboard/${sessionKey}/driver/${driver.driver_number}`}
            className="flex flex-col items-center gap-xs rounded border border-border-hairline bg-bg-base p-sm text-center transition-colors hover:border-border-strong"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
              style={{ backgroundColor: chipBackground, color: chipText }}
            >
              {driver.name_acronym}
            </span>
            <span className="text-xs text-text-muted">{driver.full_name}</span>
          </Link>
        );
      })}
    </div>
  );
}
