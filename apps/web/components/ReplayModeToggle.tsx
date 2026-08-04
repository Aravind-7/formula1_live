"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@f1-dashboard/hooks";
import type { SessionWithMeeting } from "@/lib/types";

export function ReplayModeToggle({ sessions }: { sessions: SessionWithMeeting[] }) {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);
  const setReplayMode = useSessionStore((state) => state.setReplayMode);
  const [selectedKey, setSelectedKey] = useState(
    sessions[0] ? String(sessions[0].session_key) : "",
  );

  if (sessions.length === 0) return null;

  const startReplay = () => {
    const session = sessions.find((candidate) => String(candidate.session_key) === selectedKey);
    if (!session) return;

    setSession(session);
    setReplayMode(true);
    router.push(`/dashboard/${session.session_key}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-sm rounded-xl border border-border-hairline bg-bg-panel p-lg">
      <p className="flex-1 text-sm text-text-muted">
        No live session right now — try replay mode
      </p>
      <select
        value={selectedKey}
        onChange={(event) => setSelectedKey(event.target.value)}
        className="rounded border border-border-hairline bg-bg-base px-sm py-xs text-sm text-text-primary"
      >
        {sessions.map((session) => (
          <option key={session.session_key} value={session.session_key}>
            {session.meeting_name} — {session.session_name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={startReplay}
        className="rounded bg-accent-primary px-md py-xs text-sm font-medium text-text-primary"
      >
        Start replay
      </button>
    </div>
  );
}
