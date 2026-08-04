import type { Driver } from "@f1-dashboard/types";

export interface DriverTooltipProps {
  driver: Driver;
  position: number | undefined;
  x: number;
  y: number;
}

export function DriverTooltip({ driver, position, x, y }: DriverTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-border-hairline bg-bg-panel px-sm py-xs text-xs text-text-primary"
      style={{ left: x, top: y - 8 }}
    >
      <span className="font-medium">{driver.name_acronym}</span>
      {position !== undefined && <span className="text-text-muted"> P{position}</span>}
    </div>
  );
}
