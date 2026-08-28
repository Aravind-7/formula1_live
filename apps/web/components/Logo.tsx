import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-lg font-medium text-text-primary transition-opacity hover:opacity-80 ${className}`}
    >
      F1 <span className="text-accent-gold">Dashboard</span>
    </Link>
  );
}
