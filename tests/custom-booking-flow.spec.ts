import { test, expect } from "@playwright/test";

test.describe("Custom Privat Tour Planner", () => {
  test("user can build and submit a custom itinerary", async ({ page }) => {
    await page.goto("/tours/custom");

    // Wait for available tours to load
    await expect(page.getByText("Available Tours")).toBeVisible();

    // Add the first available tour
    const addButtons = await page.locator("button", { hasText: "Add to Itinerary" }).all();
    if (addButtons.length === 0) {
      test.skip(true, "No tours available to add");
    }
    await addButtons[0].click();

    // Select a date for the first itinerary item
    // Find the first visible day button in the calendar and click it
    const dayButtons = await page.locator('.rdp-day').filter({ hasText: /^[0-9]+$/ }).all();
    if (dayButtons.length === 0) {
      test.skip(true, "No day buttons available in calendar");
    }
    await dayButtons[0].click();

    // Proceed to booking
    await page.getByRole("button", { name: /Proceed to Booking/i }).click();

    // Expect a success message
    await expect(page.getByText(/has been submitted/i)).toBeVisible();
  });
});
