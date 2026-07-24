import { Suspense } from "react";
import { OpenF1Client } from "@f1-dashboard/api-client";
import { LiveBanner } from "@/components/LiveBanner";
import { SessionListSkeleton } from "@/components/SessionListSkeleton";
import { SessionSelectorList } from "@/components/SessionSelectorList";
import { findLiveSession, joinSessionsWithMeetings } from "@/lib/sessions";

async function SessionSelectorContent() {
  const client = new OpenF1Client();
  const year = new Date().getFullYear();
  const [sessions, meetings] = await Promise.all([
    client.getSessions({ year }),
    client.getMeetings({ year }),
  ]);

  const joined = joinSessionsWithMeetings(sessions, meetings);
  const liveSession = findLiveSession(joined);

  return (
    <>
      {liveSession && <LiveBanner session={liveSession} />}
      <h2 className="text-lg text-text-primary">Recent sessions</h2>
      <SessionSelectorList sessions={joined} />
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base px-lg py-2xl">
      <div className="mx-auto flex max-w-[900px] flex-col gap-lg">
        <Suspense fallback={<SessionListSkeleton />}>
          <SessionSelectorContent />
        </Suspense>
      </div>
    </main>
  );
}
