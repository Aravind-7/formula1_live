import { SkeletonBlock } from "./SkeletonBlock";

export function TelemetryChartSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-lg">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock key={index} className="h-24 w-full" />
      ))}
    </div>
  );
}
