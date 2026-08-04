"use client";

import { useEffect, useRef, useState } from "react";
import { RecapTrackMap } from "./RecapTrackMap";

export function RecapTrackMapSection({
  sessionKey,
  driverNumber,
}: {
  sessionKey: number;
  driverNumber: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 0 when the section's bottom first reaches the viewport bottom,
      // 1 when its top reaches the viewport top — maps scroll % to race %.
      const total = rect.height + viewportHeight;
      const scrolled = viewportHeight - rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref}>
      <RecapTrackMap sessionKey={sessionKey} driverNumber={driverNumber} progress={progress} />
    </div>
  );
}
