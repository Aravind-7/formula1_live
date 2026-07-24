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

export async function openF1Fetch<T>(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
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
