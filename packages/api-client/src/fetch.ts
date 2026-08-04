export class OpenF1Error extends Error {
  readonly status: number;
  readonly url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "OpenF1Error";
    this.status = status;
    this.url = url;
  }
}

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// OpenF1 enforces 3 req/sec globally. Pages that fire several queries at
// once (a bento grid, or SSG rendering multiple recap pages in parallel at
// build time) blow past that immediately — so cap how many requests are
// ever in flight at once, process-wide, rather than only reacting after a
// 429 comes back.
const MAX_CONCURRENT_REQUESTS = 2;
let activeRequests = 0;
const waiters: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT_REQUESTS) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    waiters.push(() => {
      activeRequests++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  activeRequests--;
  const next = waiters.shift();
  if (next) next();
}

async function attemptFetch<T>(url: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new OpenF1Error(
        `OpenF1 request failed with status ${response.status}`,
        response.status,
        url,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof OpenF1Error) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new OpenF1Error(`OpenF1 request timed out after ${timeoutMs}ms`, 0, url);
    }
    throw new OpenF1Error(
      error instanceof Error ? error.message : "Unknown OpenF1 request error",
      0,
      url,
    );
  } finally {
    clearTimeout(timeout);
  }
}

// Retries 429s specifically — client-side callers already get retries from
// TanStack Query, but server-side/build-time callers (SSG recap pages) have
// no such safety net, so this is the one place every caller benefits.
async function openF1FetchWithRetry<T>(
  url: string,
  timeoutMs: number,
  attempt: number,
): Promise<T> {
  await acquireSlot();
  try {
    return await attemptFetch<T>(url, timeoutMs);
  } catch (error) {
    if (error instanceof OpenF1Error && error.status === 429 && attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * 2 ** attempt);
      return openF1FetchWithRetry<T>(url, timeoutMs, attempt + 1);
    }
    throw error;
  } finally {
    releaseSlot();
  }
}

export function openF1Fetch<T>(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> {
  return openF1FetchWithRetry<T>(url, timeoutMs, 0);
}
