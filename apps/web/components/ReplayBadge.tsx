// Deliberately not a pulsing dot like LiveIndicator — replay must never be
// visually confusable with genuine live data.
export function ReplayBadge() {
  return (
    <span className="rounded border border-border-hairline bg-bg-panel px-sm py-xs text-xs font-medium text-text-muted">
      Replay
    </span>
  );
}
