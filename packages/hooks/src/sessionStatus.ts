import type { Session } from "@f1-dashboard/types";

export function isSessionLive(
  session: Pick<Session, "date_start" | "date_end"> | undefined,
): boolean {
  if (!session) return false;
  const now = Date.now();
  const start = new Date(session.date_start).getTime();
  const end = session.date_end ? new Date(session.date_end).getTime() : undefined;
  return start <= now && (end === undefined || end > now);
}
