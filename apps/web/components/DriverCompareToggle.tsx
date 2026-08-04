"use client";

import { useState } from "react";
import type { Driver } from "@f1-dashboard/types";

export interface DriverCompareToggleProps {
  drivers: Driver[] | undefined;
  excludeDriverNumber: number;
  compareDriverNumber: number | undefined;
  onAddCompare: (driverNumber: number) => void;
  onRemoveCompare: () => void;
}

export function DriverCompareToggle({
  drivers,
  excludeDriverNumber,
  compareDriverNumber,
  onAddCompare,
  onRemoveCompare,
}: DriverCompareToggleProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (compareDriverNumber !== undefined) {
    return (
      <button
        type="button"
        onClick={onRemoveCompare}
        className="rounded border border-border-hairline bg-bg-panel px-md py-xs text-sm text-text-primary"
      >
        Remove comparison
      </button>
    );
  }

  const options = (drivers ?? []).filter(
    (driver) => driver.driver_number !== excludeDriverNumber,
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsPickerOpen((open) => !open)}
        className="rounded border border-border-hairline bg-bg-panel px-md py-xs text-sm text-text-primary"
      >
        Compare with…
      </button>
      {isPickerOpen && (
        <div className="absolute right-0 top-full z-10 mt-xs max-h-64 w-48 overflow-y-auto rounded-xl border border-border-hairline bg-bg-panel p-xs">
          {options.map((driver) => (
            <button
              key={driver.driver_number}
              type="button"
              onClick={() => {
                onAddCompare(driver.driver_number);
                setIsPickerOpen(false);
              }}
              className="block w-full rounded px-sm py-xs text-left text-sm text-text-primary hover:bg-bg-base"
            >
              {driver.name_acronym} — {driver.full_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
