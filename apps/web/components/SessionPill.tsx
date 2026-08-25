import Link from "next/link";
import { formatSessionTime } from "@/lib/format";
import type { SessionWithMeeting } from "@/lib/types";

export function SessionPill({ session }: { session: SessionWithMeeting }) {
  return (
    <Link
      href={`/dashboard/${session.session_key}`}
      className="flex flex-col gap-xs rounded border border-border-hairline bg-bg-base px-md py-sm transition-colors hover:border-border-strong"
    >
      <span className="text-sm font-medium text-text-primary">{session.session_name}</span>
      <span className="text-xs text-text-muted">{formatSessionTime(session.date_start)}</span>
    </Link>
  );
}
