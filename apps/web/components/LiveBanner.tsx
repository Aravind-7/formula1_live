import Link from "next/link";
import type { SessionWithMeeting } from "@/lib/types";

export function LiveBanner({ session }: { session: SessionWithMeeting }) {
  return (
    <div className="flex items-center justify-between gap-md rounded border border-border-hairline bg-bg-panel p-lg">
      <div className="flex items-center gap-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="motion-safe:absolute motion-safe:inline-flex motion-safe:h-full motion-safe:w-full motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-accent-gold motion-safe:opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-gold" />
        </span>
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
