import type { Driver } from "@f1-dashboard/types";

interface TeamGroup {
  team_name: string;
  team_colour: string;
  driver_names: string[];
}

function groupDriversByTeam(drivers: Driver[]): TeamGroup[] {
  const teams = new Map<string, TeamGroup>();
  for (const driver of drivers) {
    const existing = teams.get(driver.team_name);
    if (existing) {
      existing.driver_names.push(driver.full_name);
    } else {
      teams.set(driver.team_name, {
        team_name: driver.team_name,
        team_colour: driver.team_colour,
        driver_names: [driver.full_name],
      });
    }
  }
  return Array.from(teams.values());
}

export function TeamsSection({ drivers }: { drivers: Driver[] }) {
  const teams = groupDriversByTeam(drivers);

  if (teams.length === 0) {
    return <p className="text-sm text-text-muted">No team data available yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-sm">
      {teams.map((team) => (
        <li
          key={team.team_name}
          className="flex items-center gap-sm rounded border border-border-hairline bg-bg-base p-sm"
        >
          <span
            aria-hidden="true"
            className="h-6 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: `#${team.team_colour}` }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">{team.team_name}</span>
            <span className="text-xs text-text-muted">{team.driver_names.join(" · ")}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
