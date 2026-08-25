import { expect, test } from "@playwright/test";

// Curated recap session (see app/recap/[sessionKey]/page.tsx) — a completed
// 2024 race with stable, known-good historical data, so this test doesn't
// depend on a live/current session existing when it runs.
const KNOWN_SESSION_KEY = 9472;
const KNOWN_DRIVER_NUMBER = 44; // Lewis Hamilton, Mercedes — present in that session

test("session selector loads a session and renders the dashboard bento grid", async ({ page }) => {
  await page.goto("/");

  const firstSession = page.locator('a[href^="/dashboard/"]').first();
  await expect(firstSession).toBeVisible({ timeout: 15_000 });
  await firstSession.click();

  await expect(page).toHaveURL(/\/dashboard\/\d+$/);
  await expect(page.getByRole("heading", { name: "Leaderboard" })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole("heading", { name: "Weather" })).toBeVisible();
});

test("track map highlights the driver passed via the ?driver query param", async ({ page }) => {
  await page.goto(`/dashboard/${KNOWN_SESSION_KEY}/track?driver=${KNOWN_DRIVER_NUMBER}`);

  const selectedDot = page.getByRole("button", { pressed: true });
  await expect(selectedDot).toBeVisible({ timeout: 15_000 });
  await expect(selectedDot).toHaveAccessibleName(/selected/);
});
