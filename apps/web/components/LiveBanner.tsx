import Link from "next/link";
import { LiveIndicator } from "@/components/LiveIndicator";
import type { SessionWithMeeting } from "@/lib/types";

export function LiveBanner({ session }: { session: SessionWithMeeting }) {
  return (
    <div className="flex items-center justify-between gap-md rounded border border-border-hairline bg-bg-panel p-lg">
      <div className="flex items-center gap-sm">
        <LiveIndicator />
        <span className="text-base font-medium text-text-primary">
          {session.meeting_name} — {session.session_name}
        </span>
      </div>
      <Link
        href={`/dashboard/${session.session_key}`}
        className="whitespace-nowrap rounded bg-accent-primary px-lg py-xs text-sm font-medium text-text-primary"
      >
        Go to live dashboard
      </Link>
    </div>
  );
}
