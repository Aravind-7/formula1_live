export type SessionType = "Practice" | "Qualifying" | "Race";

export interface Session {
  session_key: number;
  meeting_key: number;
  location: string;
  date_start: string;
  date_end: string | null;
  session_type: SessionType;
  session_name: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  gmt_offset: string;
  year: number;
}
