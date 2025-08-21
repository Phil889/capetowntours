import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002";

test.describe("Public Booking Flow (UI)", () => {
  test("should complete a guest booking from catalogue to confirmation", async ({ page }) => {
    // Go to the tour catalogue
    await page.goto(`${BASE_URL}/tours`);
    await expect(page).toHaveTitle(/Cape Town Experience Broker/);

    // Click the first tour card (assume at least one tour exists)
    const firstTour = page.locator("h2").first();
    await firstTour.click();

    // Wait for detail page to load
    await expect(page.locator("h1")).toBeVisible();

    // Fill out the booking widget
    await page.fill('input[type="email"]', "testguest@example.com");
    await page.fill('input[type="date"]', "2025-08-01");
    await page.fill('input[type="number"]', "2");
    await page.click('button[type="submit"]');

    // Should redirect to confirmation page (wait for URL change)
    await page.waitForURL(/\/booking\/confirmed\/.+/);

    // If payment is required, complete payment
    if (await page.locator('button[type="submit"]:has-text("Pay Now")').isVisible()) {
      await page.click('button[type="submit"]:has-text("Pay Now")');
      await page.waitForURL(/\/booking\/confirmed\/.+/);
    }

    // Confirm booking confirmation message
    await expect(page.locator("h1")).toContainText(/Booking Confirmed|Complete Your Booking/);
    await expect(page.locator("text=Thank you for your booking")).toBeVisible();
  });
});
