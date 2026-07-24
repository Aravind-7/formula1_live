import type { Session } from "@f1-dashboard/types";

export interface SessionWithMeeting extends Session {
  meeting_name: string;
}
