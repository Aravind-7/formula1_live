export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-bg-panel motion-reduce:animate-none ${className}`}
    />
  );
}
