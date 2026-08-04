import type {
  CarData,
  Driver,
  Interval,
  Lap,
  Location,
  Meeting,
  Position,
  Session,
  Stint,
  TeamRadio,
  Weather,
} from "@f1-dashboard/types";
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

export interface SessionScopedParams {
  session_key: number;
  driver_number?: number;
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

  async getDrivers(params: SessionScopedParams): Promise<Driver[]> {
    return openF1Fetch<Driver[]>(`${BASE_URL}/drivers${toQueryString(params)}`);
  }

  async getPositions(params: SessionScopedParams): Promise<Position[]> {
    return openF1Fetch<Position[]>(`${BASE_URL}/position${toQueryString(params)}`);
  }

  async getIntervals(params: SessionScopedParams): Promise<Interval[]> {
    return openF1Fetch<Interval[]>(`${BASE_URL}/intervals${toQueryString(params)}`);
  }

  async getLaps(params: SessionScopedParams): Promise<Lap[]> {
    return openF1Fetch<Lap[]>(`${BASE_URL}/laps${toQueryString(params)}`);
  }

  async getWeather(params: SessionScopedParams): Promise<Weather[]> {
    return openF1Fetch<Weather[]>(`${BASE_URL}/weather${toQueryString(params)}`);
  }

  async getStints(params: SessionScopedParams): Promise<Stint[]> {
    return openF1Fetch<Stint[]>(`${BASE_URL}/stints${toQueryString(params)}`);
  }

  async getTeamRadio(params: SessionScopedParams): Promise<TeamRadio[]> {
    return openF1Fetch<TeamRadio[]>(`${BASE_URL}/team_radio${toQueryString(params)}`);
  }

  async getLocations(params: SessionScopedParams): Promise<Location[]> {
    return openF1Fetch<Location[]>(`${BASE_URL}/location${toQueryString(params)}`);
  }

  async getCarData(params: SessionScopedParams): Promise<CarData[]> {
    return openF1Fetch<CarData[]>(`${BASE_URL}/car_data${toQueryString(params)}`);
  }
}
