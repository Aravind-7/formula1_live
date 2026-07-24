import Link from "next/link";
import { formatSessionDate } from "@/lib/format";
import type { SessionWithMeeting } from "@/lib/types";

export function SessionCard({ session }: { session: SessionWithMeeting }) {
  return (
    <Link
      href={`/dashboard/${session.session_key}`}
      className="flex flex-col gap-xs rounded border border-border-hairline bg-bg-panel p-lg transition-colors hover:border-border-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-text-primary">
          {session.meeting_name}
        </span>
        <span className="text-sm text-text-muted">{session.session_type}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          {session.circuit_short_name}, {session.country_name}
        </span>
        <span>{formatSessionDate(session.date_start)}</span>
      </div>
    </Link>
  );
}
