import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpenF1Error, openF1Fetch } from "./fetch";

describe("openF1Fetch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("returns parsed JSON on success", async () => {
    const data = [{ session_key: 42 }];
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => data });

    const result = await openF1Fetch("https://api.openf1.org/v1/sessions");

    expect(result).toEqual(data);
  });

  it("throws OpenF1Error on a non-ok response", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });

    await expect(openF1Fetch("https://api.openf1.org/v1/sessions")).rejects.toThrow(OpenF1Error);
  });

  it("retries once on 429 and succeeds on the next attempt", async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [{ session_key: 1 }] });

    const result = await openF1Fetch("https://api.openf1.org/v1/sessions");

    expect(result).toEqual([{ session_key: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  }, 10000);

  it("does not retry on a non-429 error status", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });

    await expect(openF1Fetch("https://api.openf1.org/v1/sessions")).rejects.toThrow(OpenF1Error);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
