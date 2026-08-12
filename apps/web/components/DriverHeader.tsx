import type { Driver } from "@f1-dashboard/types";
import { colors } from "@f1-dashboard/tokens";
import { teamColor } from "@f1-dashboard/hooks";
import { darkenHex } from "@/lib/color";
import { formatGap } from "@/lib/format";

export interface DriverHeaderProps {
  driver: Driver | undefined;
  position: number | undefined;
  gapToLeader: number | string | null | undefined;
}

export function DriverHeader({ driver, position, gapToLeader }: DriverHeaderProps) {
  if (!driver) {
    return <p className="text-sm text-text-muted">Loading driver…</p>;
  }

  const chipBackground = teamColor(driver) ?? colors.textMuted;
  const chipText = darkenHex(chipBackground);

  return (
    <div className="flex items-center gap-md">
      <div>
        <h2 className="text-lg font-medium text-text-primary">{driver.full_name}</h2>
        <span
          className="mt-xs inline-block rounded px-sm py-xs text-xs font-medium"
          style={{ backgroundColor: chipBackground, color: chipText }}
        >
          {driver.team_name}
        </span>
      </div>
      <div className="ml-auto text-right text-sm">
        {position !== undefined && (
          <p className="font-medium text-text-primary">P{position}</p>
        )}
        <p className="text-text-muted">{formatGap(gapToLeader)}</p>
      </div>
    </div>
  );
}
