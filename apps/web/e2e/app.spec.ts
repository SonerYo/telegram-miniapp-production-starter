import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('browser mock starts with a verified synthetic user', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Browser mock')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Good to see you, Avery/i })).toBeVisible();
  await expect(page.getByText('Server-validated identity')).toBeVisible();
});

test('tab navigation, task CRUD, and dialog confirmation work', async ({ page }) => {
  await page.goto('/tasks');
  await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
  await page.getByRole('button', { name: 'Add task' }).click();
  const sheet = page.getByRole('dialog', { name: 'Add a task' });
  await expect(sheet).toBeVisible();
  await sheet.getByLabel('Task').fill('E2E release check');
  await sheet.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByText('E2E release check')).toBeVisible();

  const row = page.getByText('E2E release check').locator('..').locator('..');
  await row.getByRole('button', { name: /Edit E2E release check/ }).click();
  await page
    .getByRole('dialog', { name: 'Edit task' })
    .getByLabel('Task')
    .fill('E2E release verified');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('E2E release verified')).toBeVisible();

  await page.getByRole('button', { name: /Complete E2E release verified/ }).click();
  await expect(page.getByText('Completed', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /Delete E2E release verified/ }).click();
  const confirmation = page.getByRole('alertdialog', { name: 'Delete this task?' });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('E2E release verified')).toHaveCount(0);
});

test('mock BackButton closes an open sheet before navigating', async ({ page }) => {
  await page.goto('/tasks');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByRole('dialog', { name: 'Add a task' })).toBeVisible();
  await page.evaluate(() => window.__STARTER_MOCK_RUNTIME__?.emitMockBack?.());
  await expect(page.getByRole('dialog', { name: 'Add a task' })).toHaveCount(0);
  await expect(page).toHaveURL(/\/tasks$/);
});

test('empty, API error, offline, theme, safe area, and 404 states are reachable', async ({
  page,
  context,
}) => {
  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'Empty tasks' }).click();
  await page.getByRole('link', { name: /Tasks/ }).click();
  await expect(page.getByRole('heading', { name: 'A clear starting point' })).toBeVisible();

  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'API error' }).click();
  await page.getByRole('link', { name: /Tasks/ }).click();
  await expect(page.getByRole('heading', { name: 'Something went wrong' })).toBeVisible();

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Offline — cached content may be stale/)).toBeVisible();
  await context.setOffline(false);

  await page.goto('/dev/telegram-preview');
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'iOS insets' }).click();
  await expect(page.locator('html')).toHaveCSS('--tg-safe-area-top', '24px');

  await page.goto('/missing-screen');
  await expect(
    page.getByRole('heading', { name: 'This route is not in the starter' }),
  ).toBeVisible();
});

test('critical pages have no serious automated accessibility violations', async ({ page }) => {
  for (const route of ['/', '/tasks', '/profile']) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) =>
        ['critical', 'serious'].includes(violation.impact ?? ''),
      ),
    ).toEqual([]);
  }
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
]) {
  test(`layout has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/tasks');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(navigation).toBeInViewport();
    await expect(page.getByRole('link', { name: /Activity/ })).toBeVisible();
  });
}
