import type { Meeting, Session } from "@f1-dashboard/types";
// Subpath import (not the main package barrel): this file is used by a
// Server Component, and the main barrel transitively pulls in client-only
// hooks (useEffect/useState), which Next.js correctly refuses to bundle
// into server code — even though isSessionLive itself uses no hooks at all.
import { isSessionLive } from "@f1-dashboard/hooks/sessionStatus";
import type { RaceWeekend, SessionWithMeeting } from "./types";

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

// One race weekend can span 3-5 sessions (practice, qualifying, race) at the
// same circuit — group by meeting_key so they render as one entry instead of
// a flat list of near-duplicate rows.
export function groupSessionsByMeeting(sessions: SessionWithMeeting[]): RaceWeekend[] {
  const byMeeting = new Map<number, SessionWithMeeting[]>();
  for (const session of sessions) {
    const group = byMeeting.get(session.meeting_key);
    if (group) {
      group.push(session);
    } else {
      byMeeting.set(session.meeting_key, [session]);
    }
  }

  return Array.from(byMeeting.values())
    .map((group): RaceWeekend => {
      const chronological = [...group].sort(
        (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
      );
      const latest = chronological[chronological.length - 1];
      return {
        meeting_key: latest.meeting_key,
        meeting_name: latest.meeting_name,
        country_name: latest.country_name,
        country_code: latest.country_code,
        circuit_short_name: latest.circuit_short_name,
        date_start: latest.date_start,
        sessions: chronological,
      };
    })
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
}
