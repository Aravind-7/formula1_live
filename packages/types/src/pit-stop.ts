export interface PitStop {
  date: string;
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
  lane_duration: number | null;
  stop_duration: number | null;
  session_key: number;
  meeting_key: number;
}
