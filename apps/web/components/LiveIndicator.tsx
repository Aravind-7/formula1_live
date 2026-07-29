export function LiveIndicator() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="motion-safe:absolute motion-safe:inline-flex motion-safe:h-full motion-safe:w-full motion-safe:animate-ping motion-safe:rounded-full motion-safe:bg-accent-gold motion-safe:opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-gold" />
    </span>
  );
}
