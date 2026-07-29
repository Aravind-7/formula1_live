export type TyreCompound = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";

export interface Stint {
  driver_number: number;
  stint_number: number;
  compound: TyreCompound;
  lap_start: number;
  lap_end: number;
  tyre_age_at_start: number;
  session_key: number;
  meeting_key: number;
}
