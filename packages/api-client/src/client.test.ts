import { beforeEach, describe, expect, it, vi } from "vitest";
import { OpenF1Client } from "./client";

describe("OpenF1Client", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  function mockResponse(data: unknown) {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => data });
  }

  it("constructs the correct URL for getSessions with params", async () => {
    mockResponse([]);
    const client = new OpenF1Client();

    await client.getSessions({ year: 2024, session_type: "Race" });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("https://api.openf1.org/v1/sessions");
    expect(calledUrl).toContain("year=2024");
    expect(calledUrl).toContain("session_type=Race");
  });

  it("constructs the correct URL for getPositions scoped to a session and driver", async () => {
    mockResponse([]);
    const client = new OpenF1Client();

    await client.getPositions({ session_key: 9161, driver_number: 1 });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toBe("https://api.openf1.org/v1/position?session_key=9161&driver_number=1");
  });

  it("omits undefined params from the query string", async () => {
    mockResponse([]);
    const client = new OpenF1Client();

    await client.getSessions({ year: 2024, country_name: undefined });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("country_name");
  });

  it("parses and returns the response body", async () => {
    const sessions = [{ session_key: 9161, session_name: "Qualifying" }];
    mockResponse(sessions);
    const client = new OpenF1Client();

    const result = await client.getSessions();

    expect(result).toEqual(sessions);
  });

  it("getSessionByKey returns the first matching session", async () => {
    mockResponse([{ session_key: 9161 }]);
    const client = new OpenF1Client();

    const result = await client.getSessionByKey(9161);

    expect(result).toEqual({ session_key: 9161 });
  });

  it("getSessionByKey returns undefined when no session matches", async () => {
    mockResponse([]);
    const client = new OpenF1Client();

    const result = await client.getSessionByKey(9999);

    expect(result).toBeUndefined();
  });
});
