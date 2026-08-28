"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CURATED_RECAP_SESSIONS } from "@/lib/curatedRecaps";

function MenuLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-md px-sm py-xs text-sm text-text-primary hover:bg-bg-base"
    >
      {children}
    </Link>
  );
}

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ sessionKey?: string; driverNumber?: string }>();
  const sessionKey = params?.sessionKey;
  const driverNumber = params?.driverNumber;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md border border-border-hairline hover:bg-bg-panel"
      >
        <span className="h-[1.5px] w-4 bg-text-primary" />
        <span className="h-[1.5px] w-4 bg-text-primary" />
        <span className="h-[1.5px] w-4 bg-text-primary" />
      </button>

      {isOpen && (
        <nav className="absolute right-0 top-full z-50 mt-xs w-64 rounded-xl border border-border-hairline bg-bg-panel p-xs shadow-lg">
          <MenuLink href="/" onNavigate={close}>
            Home
          </MenuLink>

          {sessionKey && (
            <>
              <MenuLink href={`/dashboard/${sessionKey}`} onNavigate={close}>
                Session Dashboard
              </MenuLink>
              <MenuLink href={`/dashboard/${sessionKey}/track`} onNavigate={close}>
                Track Map
              </MenuLink>
              {driverNumber && (
                <MenuLink href={`/dashboard/${sessionKey}/driver/${driverNumber}`} onNavigate={close}>
                  Driver Detail
                </MenuLink>
              )}
            </>
          )}

          <div className="my-xs border-t border-border-hairline" />
          <p className="px-sm py-xs text-xs uppercase tracking-wide text-text-muted">Race Recaps</p>
          {CURATED_RECAP_SESSIONS.map((recap) => (
            <MenuLink key={recap.sessionKey} href={`/recap/${recap.sessionKey}`} onNavigate={close}>
              {recap.label} Recap
            </MenuLink>
          ))}
        </nav>
      )}
    </div>
  );
}
