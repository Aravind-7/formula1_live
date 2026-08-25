import { formatSessionDate } from "@/lib/format";
import type { RaceWeekend } from "@/lib/types";
import { CountryFlag } from "./CountryFlag";
import { SessionPill } from "./SessionPill";

export function RaceWeekendGroup({ weekend }: { weekend: RaceWeekend }) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-xs">
        <h3 className="flex items-center gap-xs text-base font-medium text-text-primary">
          <CountryFlag countryCode={weekend.country_code} countryName={weekend.country_name} />
          {weekend.meeting_name}
        </h3>
        <span className="text-sm text-text-muted">
          {weekend.circuit_short_name}, {weekend.country_name} ·{" "}
          {formatSessionDate(weekend.date_start)}
        </span>
      </div>
      <div className="flex flex-wrap gap-sm">
        {weekend.sessions.map((session) => (
          <SessionPill key={session.session_key} session={session} />
        ))}
      </div>
    </div>
  );
}
