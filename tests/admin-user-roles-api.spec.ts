import { test, expect, request } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test admin credentials (must exist in your Supabase project)
const ADMIN_EMAIL = "philiphansenonline@gmail.com";
const ADMIN_PASSWORD = "1qay!QAY";

test.describe("Admin User Roles API", () => {
  let adminAuthCookie: string;
  let testUserId: string;

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

    // Get a user id to test with (use the admin user for now)
    testUserId = data.user.id;
  });

  test("should update user role for admin", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/admin/users/${testUserId}/role`, {
      headers: {
        Cookie: adminAuthCookie,
        "Content-Type": "application/json"
      },
      data: { role: "admin" }
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("should reject unauthenticated requests", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/admin/users/${testUserId}/role`, {
      data: { role: "admin" }
    });
    expect(res.status()).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  test("should return 400 for missing role", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/admin/users/${testUserId}/role`, {
      headers: {
        Cookie: adminAuthCookie,
        "Content-Type": "application/json"
      },
      data: {}
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Missing role");
  });
});
