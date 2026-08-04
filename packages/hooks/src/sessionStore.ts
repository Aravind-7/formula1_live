import { create } from "zustand";
import type { Session } from "@f1-dashboard/types";

interface SessionStore {
  currentSession: Session | null;
  setSession: (session: Session | null) => void;
  replayMode: boolean;
  replaySpeed: number;
  setReplayMode: (replayMode: boolean) => void;
  setReplaySpeed: (replaySpeed: number) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  currentSession: null,
  setSession: (session) => set({ currentSession: session }),
  replayMode: false,
  replaySpeed: 10,
  setReplayMode: (replayMode) => set({ replayMode }),
  setReplaySpeed: (replaySpeed) => set({ replaySpeed }),
}));
