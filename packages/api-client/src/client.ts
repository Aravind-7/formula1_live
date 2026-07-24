import type { Meeting, Session } from "@f1-dashboard/types";
import { openF1Fetch } from "./fetch";

const BASE_URL = "https://api.openf1.org/v1";

export interface GetSessionsParams {
  year?: number;
  country_name?: string;
  meeting_key?: number;
  session_type?: string;
  [key: string]: string | number | undefined;
}

export interface GetMeetingsParams {
  year?: number;
  country_name?: string;
  [key: string]: string | number | undefined;
}

function toQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, value]) => value !== undefined);
  if (entries.length === 0) return "";
  const search = new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  );
  return `?${search.toString()}`;
}

export class OpenF1Client {
  async getSessions(params?: GetSessionsParams): Promise<Session[]> {
    return openF1Fetch<Session[]>(`${BASE_URL}/sessions${toQueryString(params)}`);
  }

  async getMeetings(params?: GetMeetingsParams): Promise<Meeting[]> {
    return openF1Fetch<Meeting[]>(`${BASE_URL}/meetings${toQueryString(params)}`);
  }

  async getSessionByKey(sessionKey: number): Promise<Session | undefined> {
    const sessions = await openF1Fetch<Session[]>(
      `${BASE_URL}/sessions${toQueryString({ session_key: sessionKey })}`,
    );
    return sessions[0];
  }
}
