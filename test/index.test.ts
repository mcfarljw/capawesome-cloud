import { describe, expect, it, vi } from "vitest";
import { createCapawesomeClient } from "../src/index.ts";

function createJsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}

function readRequestUrl(request: RequestInfo | URL): string {
  if (typeof request === "string") {
    return request;
  }

  if (request instanceof URL) {
    return request.toString();
  }

  return request.url;
}

describe("createCapawesomeClient", () => {
  it("interpolates path parameters and forwards query + auth headers", async () => {
    const fetchMock = vi.fn(async (request: RequestInfo | URL, init?: RequestInit) => {
      return createJsonResponse({
        method: init?.method,
        request: readRequestUrl(request),
      });
    });

    const client = createCapawesomeClient({
      baseURL: "https://example.com",
      fetch: fetchMock as typeof globalThis.fetch,
      token: "secret-token",
    });

    await client.get("/v1/apps/{appId}/automations", {
      path: { appId: "app_123" },
      query: { limit: "10", platform: "ios" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [request, init] = fetchMock.mock.calls[0] ?? [];
    expect(readRequestUrl(request as RequestInfo | URL)).toContain("/v1/apps/app_123/automations");
    expect(readRequestUrl(request as RequestInfo | URL)).toContain("limit=10");
    expect(readRequestUrl(request as RequestInfo | URL)).toContain("platform=ios");

    const headers = new Headers(init?.headers);
    expect(headers.get("authorization")).toBe("Bearer secret-token");
    expect(init?.method).toBe("GET");
  });

  it("forwards JSON body for post requests", async () => {
    const fetchMock = vi.fn(async (_request: RequestInfo | URL, init?: RequestInit) => {
      return createJsonResponse({ body: init?.body });
    });

    const client = createCapawesomeClient({
      baseURL: "https://example.com",
      fetch: fetchMock as typeof globalThis.fetch,
    });

    await client.post("/v1/apps", {
      query: { organizationId: "org_123" },
      body: { name: "My App" },
    });

    const [, init] = fetchMock.mock.calls[0] ?? [];
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ name: "My App" });
  });

  it("throws when path parameters are missing", async () => {
    const fetchMock = vi.fn(async () => createJsonResponse({}));

    const client = createCapawesomeClient({
      baseURL: "https://example.com",
      fetch: fetchMock as typeof globalThis.fetch,
    });

    expect(() => {
      client.get("/v1/apps/{appId}/automations", {} as never);
    }).toThrow('Missing path parameter "appId" for "/v1/apps/{appId}/automations"');

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
