import { test, expect, request } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test admin credentials (must exist in your Supabase project)
const ADMIN_EMAIL = "philiphansenonline@gmail.com";
const ADMIN_PASSWORD = "1qay!QAY";

test.describe("Admin Audit Log API", () => {
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
    adminAuthCookie = cookies;
    await apiRequestContext.dispose();
  });

  test("should list audit log entries for admin", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/audit-log`, {
      headers: {
        Cookie: adminAuthCookie,
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.entries)).toBe(true);
  });

  test("should reject unauthenticated requests", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/audit-log`);
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });
});
