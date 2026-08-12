import type { Meeting, Session } from "@f1-dashboard/types";
// Subpath import (not the main package barrel): this file is used by a
// Server Component, and the main barrel transitively pulls in client-only
// hooks (useEffect/useState), which Next.js correctly refuses to bundle
// into server code — even though isSessionLive itself uses no hooks at all.
import { isSessionLive } from "@f1-dashboard/hooks/sessionStatus";
import type { SessionWithMeeting } from "./types";

export function joinSessionsWithMeetings(
  sessions: Session[],
  meetings: Meeting[],
): SessionWithMeeting[] {
  const meetingsByKey = new Map(meetings.map((meeting) => [meeting.meeting_key, meeting]));

  return sessions
    .map((session) => ({
      ...session,
      meeting_name: meetingsByKey.get(session.meeting_key)?.meeting_name ?? session.location,
    }))
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
}

export function findLiveSession(
  sessions: SessionWithMeeting[],
): SessionWithMeeting | undefined {
  return sessions.find(isSessionLive);
}

// Only finished sessions have historical data worth replaying — a scheduled
// future session (common when browsing "recent sessions" mid-season) has none.
export function isSessionPast(
  session: Pick<Session, "date_start" | "date_end">,
): boolean {
  const now = Date.now();
  const end = session.date_end ? new Date(session.date_end).getTime() : new Date(session.date_start).getTime();
  return end < now;
}
