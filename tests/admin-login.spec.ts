import { test, expect } from "@playwright/test"

test("Admin login flow", async ({ page }) => {
  // Go to the admin login page
  await page.goto("http://localhost:3002/admin/login")

  // Fill in email and password
  await page.fill('input[type="email"]', "philiphansenonline@gmail.com")
  await page.fill('input[type="password"]', "1qay!QAY")

  // Click the login button
  await page.click('button[type="submit"]')

  // Wait for navigation to /admin (full reload)
  await page.waitForURL("**/admin", { timeout: 10000 })

  // Check for an element that should be present in the admin UI
  await expect(page.locator("text=Admin Panel")).toBeVisible()
})
