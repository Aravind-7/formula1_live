import Link from "next/link";
import type { Driver } from "@f1-dashboard/types";
import { DriverAvatar } from "./DriverAvatar";

export function DriversSection({
  drivers,
  sessionKey,
}: {
  drivers: Driver[];
  sessionKey: number;
}) {
  if (drivers.length === 0) {
    return <p className="text-sm text-text-muted">No driver data available yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
      {drivers.map((driver) => (
        <Link
          key={driver.driver_number}
          href={`/dashboard/${sessionKey}/driver/${driver.driver_number}`}
          className="flex flex-col items-center gap-xs rounded border border-border-hairline bg-bg-base p-sm text-center transition-colors hover:border-border-strong"
        >
          <DriverAvatar driver={driver} size={40} />
          <span className="text-xs text-text-muted">{driver.full_name}</span>
        </Link>
      ))}
    </div>
  );
}
