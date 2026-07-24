const SKELETON_COUNT = 4;

export function SessionListSkeleton() {
  return (
    <div className="flex flex-col gap-md" aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded border border-border-hairline bg-bg-panel"
        />
      ))}
    </div>
  );
}
