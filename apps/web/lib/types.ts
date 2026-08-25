import type { Session } from "@f1-dashboard/types";

export interface SessionWithMeeting extends Session {
  meeting_name: string;
}

// One race weekend — every session sharing a meeting_key (FP1, FP2, FP3,
// Qualifying, Race, ...) grouped under the single location/event they belong to.
export interface RaceWeekend {
  meeting_key: number;
  meeting_name: string;
  country_name: string;
  country_code: string;
  circuit_short_name: string;
  /** Latest session's date_start in the group — used to sort weekends by recency. */
  date_start: string;
  sessions: SessionWithMeeting[];
}
