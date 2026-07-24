// Stub — fleshed out in Stage 2/3 once timing and driver detail screens are built.
export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string | null;
  headshot_url: string | null;
  session_key: number;
  meeting_key: number;
}
