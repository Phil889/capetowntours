import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";

test.describe("Public Tours API", () => {
  test("should list tours for public", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/tours`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.tours)).toBe(true);
  });
});
