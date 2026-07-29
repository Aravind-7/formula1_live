import { create } from "zustand";
import type { Session } from "@f1-dashboard/types";

interface SessionStore {
  currentSession: Session | null;
  setSession: (session: Session | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  currentSession: null,
  setSession: (session) => set({ currentSession: session }),
}));
