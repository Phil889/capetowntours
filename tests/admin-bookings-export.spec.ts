import { test, expect, request } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test admin credentials (must exist in your Supabase project)
const ADMIN_EMAIL = "philiphansenonline@gmail.com";
const ADMIN_PASSWORD = "1qay!QAY";

test.describe("Admin Bookings Export API", () => {
  let adminAuthCookie: string;

  test.beforeAll(async () => {
    // Sign in with Supabase to get access_token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    expect(error).toBeNull();
    expect(data.session).toBeTruthy();
    const access_token = data.session?.access_token;
    expect(access_token).toBeTruthy();

    // Set the sb-auth-token cookie via the API
    const apiRequestContext = await request.newContext();
    const res = await apiRequestContext.post(`${BASE_URL}/api/auth/set-cookie`, {
      data: { access_token },
    });
    expect(res.ok()).toBeTruthy();
    const cookies = res.headers()["set-cookie"];
    expect(cookies).toBeTruthy();
    // Use sb-auth-token for subsequent requests
    adminAuthCookie = cookies;
    await apiRequestContext.dispose();
  });

  test("should export bookings as CSV for admin", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/bookings/export`, {
      headers: {
        Cookie: adminAuthCookie,
      },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    const csv = await res.text();
    expect(csv).toContain("id,tour_id,user_id,date,status,created_at,updated_at");
    // Optionally, check for at least one data row (if bookings exist)
  });

  test("should reject unauthenticated export requests", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/bookings/export`);
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  test("should export filtered bookings as CSV", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/bookings/export?status=confirmed`, {
      headers: {
        Cookie: adminAuthCookie,
      },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    const csv = await res.text();
    expect(csv).toContain("status");
    // Optionally, check that all rows have status "confirmed" if test data is available
  });
});
