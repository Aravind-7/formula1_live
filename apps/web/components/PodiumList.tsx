import type { Driver } from "@f1-dashboard/types";
import { teamColor } from "@/lib/telemetry";

export interface PodiumEntry {
  position: 1 | 2 | 3;
  driver: Driver;
}

export function PodiumList({ podium }: { podium: PodiumEntry[] }) {
  return (
    <div className="flex flex-col gap-sm">
      {podium.map((entry) => (
        <div
          key={entry.position}
          className="flex items-center gap-md rounded-xl border border-border-hairline bg-bg-panel p-lg"
        >
          <span
            className={`w-8 text-xl font-medium ${
              entry.position === 1 ? "text-accent-gold" : "text-text-muted"
            }`}
          >
            P{entry.position}
          </span>
          <span
            className="h-8 w-1 shrink-0 rounded-full bg-border-hairline"
            style={{ backgroundColor: teamColor(entry.driver) }}
          />
          <div>
            <p className="text-base font-medium text-text-primary">{entry.driver.full_name}</p>
            <p className="text-sm text-text-muted">{entry.driver.team_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
