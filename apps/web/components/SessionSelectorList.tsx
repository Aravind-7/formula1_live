"use client";

import { useMemo, useState } from "react";
import { SessionCard } from "./SessionCard";
import type { SessionWithMeeting } from "@/lib/types";

export function SessionSelectorList({ sessions }: { sessions: SessionWithMeeting[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (session) =>
        session.meeting_name.toLowerCase().includes(q) ||
        session.country_name.toLowerCase().includes(q),
    );
  }, [sessions, query]);

  return (
    <div className="flex flex-col gap-md">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by meeting or country"
        className="rounded border border-border-hairline bg-bg-panel px-md py-sm text-sm text-text-primary placeholder:text-text-muted focus:border-border-strong focus:outline-none"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted">No sessions match your search.</p>
      ) : (
        <div className="flex flex-col gap-md">
          {filtered.map((session) => (
            <SessionCard key={session.session_key} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
