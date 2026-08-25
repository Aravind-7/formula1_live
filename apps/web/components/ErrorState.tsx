"use client";

// signal-alert marks only the dot and border, never the whole panel — color
// is a cue alongside the text, not the message itself.
export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-sm rounded border border-signal-alert/40 px-sm py-xs"
    >
      <div className="flex items-center gap-sm">
        <span className="h-2 w-2 shrink-0 rounded-full bg-signal-alert" aria-hidden="true" />
        <p className="text-sm text-text-muted">{message}</p>
      </div>
      <button type="button" onClick={onRetry} className="text-sm font-medium text-accent-gold">
        Retry
      </button>
    </div>
  );
}
