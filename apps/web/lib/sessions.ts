import type { Meeting, Session } from "@f1-dashboard/types";
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
  const now = Date.now();

  return sessions.find((session) => {
    const start = new Date(session.date_start).getTime();
    const end = session.date_end ? new Date(session.date_end).getTime() : undefined;
    return start <= now && (end === undefined || end > now);
  });
}
