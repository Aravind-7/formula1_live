"use client";

import { useParams } from "next/navigation";
import { useSession } from "@f1-dashboard/hooks";
import { LiveIndicator } from "@/components/LiveIndicator";
import { isSessionLive } from "@/lib/sessions";
import styles from "./page.module.css";

const CARD_CLASS = "rounded-xl border border-border-hairline bg-bg-panel p-lg";

export default function DashboardPage() {
  const params = useParams<{ sessionKey: string }>();
  const sessionKey = Number(params.sessionKey);
  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);

  return (
    <main className="min-h-screen bg-bg-base px-lg py-2xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-lg">
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            {live && <LiveIndicator />}
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
          <div className={`${styles.leaderboard} ${CARD_CLASS}`} />
          <div className={`${styles.weather} ${CARD_CLASS}`} />
          <div className={`${styles.fastestlap} ${CARD_CLASS}`} />
          <div className={`${styles.tires} ${CARD_CLASS}`} />
          <div className={`${styles.radio} ${CARD_CLASS}`} />
        </div>
      </div>
    </main>
  );
}
