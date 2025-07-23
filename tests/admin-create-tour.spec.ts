import { test, expect } from "@playwright/test"

test("Admin can create a new tour via API", async ({ page }) => {
  // Log in via UI to get session cookie
  await page.goto("http://localhost:3002/admin/login")
  await page.fill('input[type="email"]', "philiphansenonline@gmail.com")
  await page.fill('input[type="password"]', "1qay!QAY")
  await page.click('button[type="submit"]')
  await page.waitForURL("**/admin", { timeout: 10000 })

  // Use fetch in the browser context to call the API with the session cookie
  const response = await page.evaluate(async () => {
    const res = await fetch("/api/admin/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Safari Tour",
        description: "A thrilling safari adventure.",
        price: "1999.99",
        category: "Safari",
        duration_days: 5,
        image_url: "https://example.com/safari.jpg"
      })
    })
    return { status: res.status, json: await res.json() }
  })

  expect(response.status).toBe(201)
  expect(response.json.success).toBe(true)
})
