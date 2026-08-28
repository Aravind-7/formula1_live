"use client";

import { useParams } from "next/navigation";
import { isSessionLive, useSession, useSessionStore } from "@f1-dashboard/hooks";
import { FastestLapCard } from "@/components/FastestLapCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { LiveIndicator } from "@/components/LiveIndicator";
import { Logo } from "@/components/Logo";
import { ReplayBadge } from "@/components/ReplayBadge";
import { TeamRadioFeed } from "@/components/TeamRadioFeed";
import { TireStrategyCard } from "@/components/TireStrategyCard";
import { WeatherWidget } from "@/components/WeatherWidget";
import styles from "./page.module.css";

const CARD_CLASS = "rounded-xl border border-border-hairline bg-bg-panel p-lg";

export default function DashboardPage() {
  const params = useParams<{ sessionKey: string }>();
  const sessionKey = Number(params.sessionKey);
  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);
  const replayMode = useSessionStore((state) => state.replayMode);

  return (
    <main className="min-h-screen bg-bg-base px-lg py-2xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-lg">
        <Logo />
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            {live && <LiveIndicator />}
            {!live && replayMode && <ReplayBadge />}
            <div>
              <h1 className="text-lg font-medium text-text-primary">
                {session?.session_name ?? "Loading session…"}
              </h1>
              {session && (
                <p className="text-sm text-text-muted">
                  {session.circuit_short_name}, {session.country_name}
                </p>
              )}
            </div>
          </div>
          {session && (
            <span className="rounded border border-border-hairline bg-bg-panel px-md py-xs text-sm text-text-muted">
              {session.session_type}
            </span>
          )}
        </div>

        <div className={styles.grid}>
          <div className={`${styles.leaderboard} ${CARD_CLASS}`}>
            <LeaderboardTable sessionKey={sessionKey} live={live} />
          </div>
          <div className={`${styles.weather} ${CARD_CLASS}`}>
            <WeatherWidget sessionKey={sessionKey} live={live} />
          </div>
          <div className={`${styles.fastestlap} ${CARD_CLASS}`}>
            <FastestLapCard sessionKey={sessionKey} live={live} />
          </div>
          <div className={`${styles.tires} ${CARD_CLASS}`}>
            <TireStrategyCard sessionKey={sessionKey} live={live} />
          </div>
          <div className={`${styles.radio} ${CARD_CLASS}`}>
            <TeamRadioFeed sessionKey={sessionKey} live={live} />
          </div>
        </div>
      </div>
    </main>
  );
}
