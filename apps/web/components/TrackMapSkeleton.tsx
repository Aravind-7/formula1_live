import { SkeletonBlock } from "./SkeletonBlock";

export function TrackMapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center p-2xl">
      <SkeletonBlock className="h-full max-h-[500px] w-full max-w-[700px] rounded-xl" />
    </div>
  );
}
