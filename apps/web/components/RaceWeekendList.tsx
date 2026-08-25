"use client";

import { useMemo, useState } from "react";
import type { RaceWeekend } from "@/lib/types";
import { RaceWeekendGroup } from "./RaceWeekendGroup";

export function RaceWeekendList({ weekends }: { weekends: RaceWeekend[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return weekends;
    return weekends.filter(
      (weekend) =>
        weekend.meeting_name.toLowerCase().includes(q) ||
        weekend.country_name.toLowerCase().includes(q),
    );
  }, [weekends, query]);

  return (
    <div className="flex flex-col gap-lg">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by race or country"
        className="rounded border border-border-hairline bg-bg-panel px-md py-sm text-sm text-text-primary placeholder:text-text-muted focus:border-border-strong focus:outline-none"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted">No race weekends match your search.</p>
      ) : (
        <div className="flex flex-col gap-lg">
          {filtered.map((weekend) => (
            <RaceWeekendGroup key={weekend.meeting_key} weekend={weekend} />
          ))}
        </div>
      )}
    </div>
  );
}
