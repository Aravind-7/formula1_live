export function StatCallout({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-xs text-center">
      <span className="text-xl font-medium text-accent-gold">{value}</span>
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}
