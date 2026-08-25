import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Driver, Position } from "@f1-dashboard/types";
import { TrackOverlayPanel } from "./TrackOverlayPanel";

const drivers: Driver[] = [
  {
    driver_number: 1,
    broadcast_name: "M VERSTAPPEN",
    full_name: "Max Verstappen",
    first_name: "Max",
    last_name: "Verstappen",
    name_acronym: "VER",
    team_name: "Red Bull Racing",
    team_colour: "3671C6",
    country_code: "NED",
    headshot_url: null,
    session_key: 9161,
    meeting_key: 1219,
  },
  {
    driver_number: 44,
    broadcast_name: "L HAMILTON",
    full_name: "Lewis Hamilton",
    first_name: "Lewis",
    last_name: "Hamilton",
    name_acronym: "HAM",
    team_name: "Mercedes",
    team_colour: "27F4D2",
    country_code: "GBR",
    headshot_url: null,
    session_key: 9161,
    meeting_key: 1219,
  },
];

const positions: Position[] = [
  { date: "2023-09-16T13:00:01+00:00", driver_number: 1, position: 1, session_key: 9161, meeting_key: 1219 },
  { date: "2023-09-16T13:00:01+00:00", driver_number: 44, position: 2, session_key: 9161, meeting_key: 1219 },
];

describe("TrackOverlayPanel", () => {
  it("shows an empty message when there is no position data", () => {
    render(
      <TrackOverlayPanel
        drivers={drivers}
        positions={[]}
        selectedDriverNumber={undefined}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("No live position data.")).toBeInTheDocument();
  });

  it("calls onSelect with the driver number when a row is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TrackOverlayPanel
        drivers={drivers}
        positions={positions}
        selectedDriverNumber={undefined}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByText("HAM"));

    expect(onSelect).toHaveBeenCalledWith(44);
  });
});
