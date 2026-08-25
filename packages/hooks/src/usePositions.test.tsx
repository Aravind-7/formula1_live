import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePositions } from "./usePositions";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("usePositions", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(() => usePositions(9161, { enabled: false }), {
      wrapper: createWrapper(),
    });

    // Give any accidental async fetch a chance to fire before asserting.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches when enabled is true", async () => {
    const positions = [{ session_key: 9161, driver_number: 1, position: 1, date: "2024-01-01" }];
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => positions });

    const { result } = renderHook(() => usePositions(9161, { enabled: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(positions);
  });
});
