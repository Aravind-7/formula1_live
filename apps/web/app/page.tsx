import { Suspense } from "react";
import { OpenF1Client } from "@f1-dashboard/api-client";
import { DriversSection } from "@/components/DriversSection";
import { LiveBanner } from "@/components/LiveBanner";
import { Logo } from "@/components/Logo";
import { RaceWeekendList } from "@/components/RaceWeekendList";
import { ReplayModeToggle } from "@/components/ReplayModeToggle";
import { SessionListSkeleton } from "@/components/SessionListSkeleton";
import { TeamsSection } from "@/components/TeamsSection";
import { findLiveSession, groupSessionsByMeeting, joinSessionsWithMeetings } from "@/lib/sessions";
import styles from "./page.module.css";

// Live/recent session data must reflect the current moment on every
// request — never freeze it into a static build-time snapshot.
export const dynamic = "force-dynamic";

const CARD_CLASS = "rounded-xl border border-border-hairline bg-bg-panel p-lg";

async function LandingContent() {
  const client = new OpenF1Client();
  const year = new Date().getFullYear();
  const [sessions, meetings] = await Promise.all([
    client.getSessions({ year }),
    client.getMeetings({ year }),
  ]);

  const joined = joinSessionsWithMeetings(sessions, meetings);
  const liveSession = findLiveSession(joined);
  const weekends = groupSessionsByMeeting(joined);
  // Most recent session overall — used as the source for the Drivers/Teams
  // showcase, since OpenF1 has no season-wide roster endpoint of its own.
  const latestSession = joined[0];
  const drivers = latestSession
    ? await client.getDrivers({ session_key: latestSession.session_key })
    : [];

  return (
    <>
      {liveSession && <LiveBanner session={liveSession} />}
      {!liveSession && <ReplayModeToggle sessions={joined} />}

      <div className={styles.grid}>
        <div className={`${styles.races} ${CARD_CLASS}`}>
          <h2 className="mb-md text-lg text-text-primary">Races</h2>
          {weekends.length === 0 ? (
            <p className="text-sm text-text-muted">No sessions found for {year}.</p>
          ) : (
            <RaceWeekendList weekends={weekends} />
          )}
        </div>

        <div className={`${styles.drivers} ${CARD_CLASS}`}>
          <h2 className="mb-md text-lg text-text-primary">Drivers</h2>
          {latestSession ? (
            <DriversSection drivers={drivers} sessionKey={latestSession.session_key} />
          ) : (
            <p className="text-sm text-text-muted">No driver data available yet.</p>
          )}
        </div>

        <div className={`${styles.teams} ${CARD_CLASS}`}>
          <h2 className="mb-md text-lg text-text-primary">Teams</h2>
          <TeamsSection drivers={drivers} />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base px-lg py-2xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-lg">
        <header>
          <Logo className="text-xl" />
          <p className="text-sm text-text-muted">Live and historical Formula 1 data</p>
        </header>
        <Suspense fallback={<SessionListSkeleton />}>
          <LandingContent />
        </Suspense>
      </div>
    </main>
  );
}
