export type RaceControlCategory =
  | "Flag"
  | "SafetyCar"
  | "Drs"
  | "CarEvent"
  | "SessionStatus"
  | "Other";

export interface RaceControlMessage {
  date: string;
  category: RaceControlCategory;
  flag: string | null;
  scope: string | null;
  sector: number | null;
  lap_number: number | null;
  driver_number: number | null;
  message: string;
  session_key: number;
  meeting_key: number;
}
