import { test, expect } from "@playwright/test";

test.describe("Admin Custom/Private Bookings Dashboard", () => {
  test("admin can view and update custom/private bookings", async ({ page }) => {
    // Login as admin
    await page.goto("http://localhost:3001/admin/login");
    await page.fill('input[type="email"]', "philiphansenonline@gmail.com");
    await page.fill('input[type="password"]', "1qay!QAY");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    // Wait for admin UI to be visible
    await expect(page.locator("text=Admin Panel")).toBeVisible();

    // Now go to the custom bookings dashboard
    await page.goto("/admin/custom-bookings");

    // Wait for the dashboard to load
    await expect(page.getByText("Custom/Private Bookings")).toBeVisible();

    // There should be at least one booking row (if any bookings exist)
    const rows = await page.locator("table tbody tr").all();
    if (rows.length === 0) {
      test.skip(true, "No custom/private bookings to test");
    }

    // Check that status select is present and can be changed
    const firstStatusSelect = page.locator("table tbody tr select").first();
    await expect(firstStatusSelect).toBeVisible();

    // Change status to "confirmed" (if not already)
    const currentStatus = await firstStatusSelect.inputValue();
    if (currentStatus !== "confirmed") {
      await firstStatusSelect.selectOption("confirmed");
      // Wait for the update to complete
      await expect(firstStatusSelect).toHaveValue("confirmed");
    }

    // Check that itinerary details are shown
    const firstItinerary = page.locator("table tbody tr pre").first();
    await expect(firstItinerary).toBeVisible();

    // Check that the Contact button is present
    const contactButton = page.getByRole("button", { name: /Contact/i }).first();
    await expect(contactButton).toBeVisible();
  });
});
