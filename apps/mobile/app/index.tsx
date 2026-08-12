import { Redirect } from "expo-router";

// Session browsing stays web-first (per the doc) — mobile jumps straight
// into a session's dashboard. A hardcoded default for now; a real app would
// persist/deep-link the last viewed session.
const DEFAULT_SESSION_KEY = 9161;

export default function Index() {
  return <Redirect href={`/dashboard/${DEFAULT_SESSION_KEY}`} />;
}
