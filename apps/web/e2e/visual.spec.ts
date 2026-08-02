import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const publicDirectory = path.resolve(import.meta.dirname, '../../../docs/assets/screenshots');
const updatePublic = process.env.UPDATE_PUBLIC_SCREENSHOTS === '1';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  if (updatePublic) await mkdir(publicDirectory, { recursive: true });
});

test('capture verified public UI states', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, '/', 'home-light.png');

  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await screenshot(page, 'home-dark.png', '/');

  await capture(page, '/tasks', 'tasks-populated.png');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByRole('dialog', { name: 'Add a task' })).toBeVisible();
  await screenshot(page, 'add-bottom-sheet.png');
  await page.getByRole('button', { name: 'Close' }).click();

  await capture(page, '/profile', 'profile.png');
  await capture(page, '/dev/telegram-preview', 'mock-controls.png');
  await page.getByRole('button', { name: 'Slow loading' }).click();
  await screenshot(page, 'tasks-loading.png', '/tasks');
  await expect(page.getByText('Run the production readiness checklist')).toBeVisible();
  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'Empty tasks' }).click();
  await screenshot(page, 'tasks-empty.png', '/tasks');
  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'API error' }).click();
  await screenshot(page, 'error-state.png', '/tasks');

  await page.setViewportSize({ width: 320, height: 568 });
  await screenshot(page, 'home-320.png', '/');
  await page.setViewportSize({ width: 430, height: 932 });
  await screenshot(page, 'home-430.png', '/');
});

async function capture(page: Page, route: string, name: string) {
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await screenshot(page, name);
}

async function screenshot(page: Page, name: string, route?: string) {
  if (route) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
  }
  await expect(page.locator('body')).toBeVisible();
  const target = updatePublic ? path.join(publicDirectory, name) : test.info().outputPath(name);
  await page.screenshot({ path: target, fullPage: true });
}
