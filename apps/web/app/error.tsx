"use client";

import { useEffect } from "react";
import { Logo } from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-lg bg-bg-base px-lg text-center">
      <Logo className="text-xl" />
      <div className="flex flex-col gap-sm">
        <h1 className="text-lg font-medium text-text-primary">Data temporarily unavailable</h1>
        <p className="max-w-md text-sm text-text-muted">
          We couldn&apos;t load F1 session data right now — this is usually a hiccup with the
          upstream OpenF1 API, not this app. Try again in a moment.
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-xl border border-border-hairline bg-bg-panel px-lg py-md text-sm text-text-primary transition-opacity hover:opacity-80"
      >
        Try again
      </button>
    </main>
  );
}
