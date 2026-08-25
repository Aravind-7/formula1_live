import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SessionWithMeeting } from "@/lib/types";
import { SessionPill } from "./SessionPill";

const session: SessionWithMeeting = {
  session_key: 9161,
  meeting_key: 1219,
  meeting_name: "Singapore Grand Prix",
  location: "Marina Bay",
  date_start: "2023-09-16T13:00:00+00:00",
  date_end: "2023-09-16T14:00:00+00:00",
  session_type: "Qualifying",
  session_name: "Qualifying",
  country_key: 1,
  country_code: "SGP",
  country_name: "Singapore",
  circuit_key: 1,
  circuit_short_name: "Marina Bay",
  gmt_offset: "08:00:00",
  year: 2023,
};

describe("SessionPill", () => {
  it("renders the session name", () => {
    render(<SessionPill session={session} />);

    expect(screen.getByText("Qualifying")).toBeInTheDocument();
  });

  it("links to the correct dashboard route", () => {
    render(<SessionPill session={session} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard/9161");
  });
});
