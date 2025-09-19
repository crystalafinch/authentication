import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('h1').innerText()).toContain('Home');
  });
});

test.describe('Home Page Unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/check-auth', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { user: null } }),
        headers: { 'access-control-allow-origin': '*' },
      });
    });
    await page.waitForLoadState('networkidle');

    await page.goto('/');
  });

  test('has "Home" link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('has "Sign in" link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('has "Create account" link', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Create account' })
    ).toBeVisible();
  });
});

test.describe('Home Page Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-account');
    await page.fill('input[name="email"]', 'test1@test.com');
    await page.fill('input[name="password"]', 'asdfasdfasdfasdfasdfA1!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
  });

  test('has "Research" link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Research' })).toBeVisible();
  });
});
