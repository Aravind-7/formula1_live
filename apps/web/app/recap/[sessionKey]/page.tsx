import { notFound } from "next/navigation";
import { OpenF1Client } from "@f1-dashboard/api-client";
// Subpath import — see lib/sessions.ts for why: this Server Component can't
// pull in the main hooks barrel, which transitively includes client-only code.
import { driverMap, latestByDriver } from "@f1-dashboard/hooks/telemetry";
import { Logo } from "@/components/Logo";
import { PodiumList, type PodiumEntry } from "@/components/PodiumList";
import { RecapTrackMapSection } from "@/components/RecapTrackMapSection";
import { ScrollSection } from "@/components/ScrollSection";
import { StatCallout } from "@/components/StatCallout";
import { formatSessionDate } from "@/lib/format";

// Curated list of completed races with known story beats — recap pages are
// historical and never change, so pre-render exactly these at build time.
const CURATED_SESSION_KEYS = [9472, 9488, 9507];

export function generateStaticParams() {
  return CURATED_SESSION_KEYS.map((sessionKey) => ({ sessionKey: String(sessionKey) }));
}

export default async function RecapPage({
  params,
}: {
  params: { sessionKey: string };
}) {
  const sessionKey = Number(params.sessionKey);
  const client = new OpenF1Client();

  const [session, drivers, positions, pitStops, raceControl, laps] = await Promise.all([
    client.getSessionByKey(sessionKey),
    client.getDrivers({ session_key: sessionKey }),
    client.getPositions({ session_key: sessionKey }),
    client.getPitStops({ session_key: sessionKey }),
    client.getRaceControl({ session_key: sessionKey }),
    client.getLaps({ session_key: sessionKey }),
  ]);

  if (!session) {
    notFound();
  }

  const driversByNumber = driverMap(drivers);
  const finalPositions = Array.from(latestByDriver(positions).values()).sort(
    (a, b) => a.position - b.position,
  );

  const podium: PodiumEntry[] = finalPositions
    .slice(0, 3)
    .flatMap((entry) => {
      const driver = driversByNumber.get(entry.driver_number);
      return driver ? [{ position: entry.position as 1 | 2 | 3, driver }] : [];
    });

  const winner = podium.find((entry) => entry.position === 1)?.driver;

  const sortedPitStops = [...pitStops].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const firstPitStop = sortedPitStops[0];
  const firstPitStopDriver = firstPitStop
    ? driversByNumber.get(firstPitStop.driver_number)
    : undefined;

  const safetyCarPeriods = raceControl.filter(
    (message) => message.category === "SafetyCar" && message.message.toUpperCase().includes("DEPLOYED"),
  ).length;

  const totalLaps = laps.reduce((max, lap) => Math.max(max, lap.lap_number), 0);

  return (
    <main className="min-h-screen bg-bg-base">
      <div className="border-b border-border-hairline px-lg py-md">
        <Logo />
      </div>
      <div className="mx-auto flex max-w-[700px] flex-col gap-[100px] px-lg py-2xl">
        <ScrollSection>
          <div className="flex flex-col items-center gap-sm text-center">
            <p className="text-sm text-text-muted">{formatSessionDate(session.date_start)}</p>
            <h1 className="font-serif text-[28px] font-medium text-text-primary">
              {session.circuit_short_name} — {session.country_name}
            </h1>
            {winner && <p className="text-lg text-accent-gold">Winner: {winner.full_name}</p>}
          </div>
        </ScrollSection>

        <ScrollSection>
          <h2 className="mb-lg text-lg font-medium text-text-primary">Race Replay</h2>
          {winner ? (
            <RecapTrackMapSection sessionKey={sessionKey} driverNumber={winner.driver_number} />
          ) : (
            <p className="text-sm text-text-muted">No winner data available.</p>
          )}
        </ScrollSection>

        <ScrollSection>
          <h2 className="mb-lg text-lg font-medium text-text-primary">Key Moments</h2>
          <div className="grid grid-cols-3 gap-lg">
            <StatCallout value={totalLaps} label="Laps completed" />
            <StatCallout
              value={firstPitStopDriver?.name_acronym ?? "—"}
              label={firstPitStop ? `First pit stop, lap ${firstPitStop.lap_number}` : "No pit stop data"}
            />
            <StatCallout value={safetyCarPeriods} label="Safety car periods" />
          </div>
        </ScrollSection>

        <ScrollSection>
          <h2 className="mb-lg text-lg font-medium text-text-primary">Final Standings</h2>
          {podium.length > 0 ? (
            <PodiumList podium={podium} />
          ) : (
            <p className="text-sm text-text-muted">No standings data available.</p>
          )}
        </ScrollSection>
      </div>
    </main>
  );
}
