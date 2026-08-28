"use client";

import { useEffect, useRef } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  isSessionLive,
  useDrivers,
  usePositions,
  useSession,
  useSessionStore,
} from "@f1-dashboard/hooks";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { LiveIndicator } from "@/components/LiveIndicator";
import { Logo } from "@/components/Logo";
import { ReplayBadge } from "@/components/ReplayBadge";
import { TrackMap } from "@/components/TrackMap";
import { TrackOverlayPanel } from "@/components/TrackOverlayPanel";

export default function TrackPage() {
  const params = useParams<{ sessionKey: string }>();
  const sessionKey = Number(params.sessionKey);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession(sessionKey);
  const live = isSessionLive(session);
  const replayMode = useSessionStore((state) => state.replayMode);

  const selectedDriverParam = searchParams.get("driver");
  const selectedDriverNumber = selectedDriverParam ? Number(selectedDriverParam) : undefined;

  const { data: drivers } = useDrivers(sessionKey);
  const { data: positions } = usePositions(sessionKey, { refetchInterval: live ? 5000 : false });

  const mapPanelRef = useRef<HTMLDivElement>(null);

  const selectDriver = (driverNumber: number) => {
    router.replace(`${pathname}?driver=${driverNumber}`, { scroll: false });
  };

  // Selection lives in the URL, never in local/global state — clicking
  // outside the map panel is the only way to clear it besides navigating.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mapPanelRef.current && !mapPanelRef.current.contains(event.target as Node)) {
        router.replace(pathname, { scroll: false });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pathname, router]);

  return (
    <main className="flex h-screen flex-col bg-bg-base">
      <div className="flex items-center gap-md border-b border-border-hairline px-lg py-md">
        <Logo />
        <div className="flex items-center gap-sm">
          {live && <LiveIndicator />}
          {!live && replayMode && <ReplayBadge />}
          <h1 className="text-lg font-medium text-text-primary">
            {session?.session_name ?? "Loading session…"} — Track Map
          </h1>
        </div>
        <div className="ml-auto">
          <HamburgerMenu />
        </div>
      </div>
      <div ref={mapPanelRef} className="relative flex-1">
        <TrackMap
          sessionKey={sessionKey}
          live={live}
          selectedDriverNumber={selectedDriverNumber}
          onSelectDriver={selectDriver}
        />
        <TrackOverlayPanel
          drivers={drivers}
          positions={positions}
          selectedDriverNumber={selectedDriverNumber}
          onSelect={selectDriver}
        />
      </div>
    </main>
  );
}
