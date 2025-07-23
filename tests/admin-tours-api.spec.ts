import { test, expect, request } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const API_URL = "http://localhost:3002/api/admin/tours";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zbgpiqhxrynjllcxqjre.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZ3BpcWh4cnluamxsY3hxanJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzA3MzIsImV4cCI6MjA2ODg0NjczMn0.5V67JEfaZffvr3tmu7pwtMEwU3X8l4VHNdqK2YI_Es4";

async function getAdminAuthCookie(apiRequestContext: any) {
  // Sign in with Supabase client to get access_token
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "philiphansenonline@gmail.com",
    password: "1qay!QAY"
  });
  expect(error).toBeNull();
  expect(data.session).toBeTruthy();
  const access_token = data.session.access_token;
  // Set the cookie via the API
  const loginRes = await apiRequestContext.post("http://localhost:3002/api/auth/set-cookie", {
    data: { access_token }
  });
  expect(loginRes.ok()).toBeTruthy();
  // Get the cookie from storageState
  const cookies = await apiRequestContext.storageState();
  return cookies.cookies.find((c: any) => c.name === "sb-auth-token");
}

test.describe("POST /api/admin/tours", () => {
  test("should create a tour with valid data and admin auth", async ({ request }) => {
    // Get admin cookie
    const adminCookie = await getAdminAuthCookie(request);

    const res = await request.post(API_URL, {
      data: {
        title: "Test Tour",
        description: "A test tour",
        price: 100.0,
        category: "Adventure",
        duration_days: 2,
        image_url: "http://example.com/image.jpg"
      },
      headers: {
        cookie: `sb-auth-token=${adminCookie.value}`
      }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("should reject unauthenticated requests", async ({ request }) => {
    const res = await request.post(API_URL, {
      data: {
        title: "Test Tour",
        description: "A test tour",
        price: 100.0
      }
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  test("should reject missing required fields", async ({ request }) => {
    const adminCookie = await getAdminAuthCookie(request);

    const res = await request.post(API_URL, {
      data: {
        title: "",
        description: "",
        price: null
      },
      headers: {
        cookie: `sb-auth-token=${adminCookie.value}`
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing required fields");
  });

  // Optionally: add more tests for error handling, non-admin user, etc.
});
